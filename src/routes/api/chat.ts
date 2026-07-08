import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { PRODUCTS } from "@/lib/products";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, stepCountIs, tool, type UIMessage } from "ai";
import { z } from "zod";

// Hard caps to prevent token/cost abuse via oversized payloads.
const MAX_MESSAGES = 40;
const MAX_CHARS_PER_MESSAGE = 2000;
const MAX_TOTAL_CHARS = 20_000;
const RECENT_TURNS = 20; // trim history server-side before forwarding

// Allow any AI SDK UIMessage part (text, tool-*, reasoning, etc.).
// We still cap text length hard; non-text parts are passed through
// so multi-turn tool conversations don't get rejected as "Invalid request".
const partSchema = z
  .object({
    type: z.string().max(64),
    text: z.string().max(MAX_CHARS_PER_MESSAGE).optional(),
  })
  .passthrough();

const messageSchema = z.object({
  id: z.string().max(128).optional(),
  role: z.enum(["system", "user", "assistant"]),
  parts: z.array(partSchema).min(1).max(32),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
});

// Same-origin check: block cross-site callers from burning AI credits.
// The app's own fetches send an Origin header equal to the request URL's origin.
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");
  if (!host) return false;
  const expected = new Set<string>([`https://${host}`, `http://${host}`]);
  if (origin && expected.has(origin)) return true;
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (expected.has(refOrigin)) return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}

// Compact catalog string given to the model as grounding context.
function catalogContext() {
  return PRODUCTS.map(
    (p) =>
      `- ${p.id} | ${p.name} | ${p.brand} | ${p.category}/${p.subcategory} | ₹${p.price} (MRP ₹${p.mrp}) | ★${p.rating} (${p.reviews}) | tags: ${p.tags.join(", ")}`,
  ).join("\n");
}

// Deterministic negotiation policy. The model proposes; the server decides.
// Caps prevent margin abuse regardless of how the user pushes back.
function maxDiscountPct(productId: string): number {
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p) return 0;
  const alreadyOffPct = (p.mrp - p.price) / p.mrp; // existing MRP discount
  // Base cap 5%, +5% for high stock, +5% if item isn't a bestseller, capped at 15%.
  let cap = 0.05;
  if (p.stock > 40) cap += 0.05;
  if (!p.bestseller) cap += 0.05;
  // Squeeze cap if MRP discount is already generous.
  if (alreadyOffPct > 0.25) cap = Math.min(cap, 0.07);
  if (alreadyOffPct > 0.4) cap = Math.min(cap, 0.03);
  return Math.round(Math.max(0, Math.min(0.15, cap)) * 100) / 100;
}

function makeCouponCode(productId: string): string {
  const seed = `${productId}-${Date.now().toString(36)}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `LUMEN-${h.toString(36).slice(0, 6).toUpperCase()}`;
}

const SYSTEM = `You are Lumen, a warm, expert AI shopping concierge for a premium Indian e-commerce boutique.

You help customers discover products, compare options, plan gifts, stay within a budget, and answer FAQs.
All prices are in Indian Rupees (₹). Delivery is pan-India. Free returns within 30 days.

RULES
- Only recommend products from the CATALOG below. Never invent products or prices.
- When recommending, reference products by their exact name and price and briefly explain WHY they fit.
- Keep replies concise (max ~6 short paragraphs / a tight bulleted list). Use markdown.
- If the user's budget or need is unclear, ask ONE clarifying question first.
- For comparisons, present a compact table of key differences and end with a clear pick.
- For gifts, ask about the recipient (age, interests) if unknown; otherwise recommend 2–3 tasteful options.
- For FAQs (returns, delivery, warranty, EMI): answer directly.

PRICE NEGOTIATION
- Customers may ask for a discount ("can you do better?", "any deal?", "match this price"). Engage warmly — never refuse outright.
- Negotiate ONE product at a time. Ask which product if unclear.
- Start with a modest counter-offer (typically 3–5%). Only sweeten it if the customer pushes with a reason (bundle, first-time buyer, price match, close to budget).
- To lock in a deal, CALL the "negotiate" tool with the productId and the requested discount percent (integer 1–15). The tool returns the APPROVED percent and a coupon code — always honor that number, never promise more.
- After the tool responds, present the coupon in a short line: **CODE · X% off · applies at cart**. Do not invent codes yourself.
- If the approved discount is 0, politely explain the item is already at its best price and suggest a bundle or a similar item with more room.

CATALOG
${catalogContext()}

Free shipping over ₹999. EMI available on orders above ₹3,000. 30-day free returns. Warranty as listed per product.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) {
          return new Response("Forbidden", { status: 403 });
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const parsed = bodySchema.safeParse(raw);
        if (!parsed.success) {
          return new Response("Invalid request", { status: 400 });
        }

        const messages = parsed.data.messages;
        const totalChars = messages.reduce(
          (sum, m) =>
            sum +
            m.parts.reduce((s, p) => s + (typeof p.text === "string" ? p.text.length : 0), 0),
          0,
        );
        if (totalChars > MAX_TOTAL_CHARS) {
          return new Response("Payload too large", { status: 413 });
        }

        // Trim conversation history to the most recent turns before forwarding.
        const trimmed = messages.slice(-RECENT_TURNS);

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM,
          messages: await convertToModelMessages(trimmed as unknown as UIMessage[]),
          stopWhen: stepCountIs(50),
          tools: {
            negotiate: tool({
              description:
                "Request an approved discount coupon for a single product. Server enforces the maximum discount policy — the returned percent may be lower than requested.",
              inputSchema: z.object({
                productId: z.string().describe("Exact product id from the catalog"),
                requestedPct: z.number().int().describe("Discount percent the customer is asking for (1–15)"),
              }),
              execute: async ({ productId, requestedPct }) => {
                const product = PRODUCTS.find((p) => p.id === productId);
                if (!product) return { ok: false as const, reason: "unknown_product" };
                const cap = maxDiscountPct(productId);
                const approvedPct = Math.max(0, Math.min(Math.round(requestedPct), Math.round(cap * 100)));
                if (approvedPct === 0) {
                  return {
                    ok: true as const,
                    productId,
                    productName: product.name,
                    approvedPct: 0,
                    code: null,
                    finalPrice: product.price,
                    reason: "at_best_price",
                  };
                }
                const code = makeCouponCode(productId);
                const finalPrice = Math.round(product.price * (1 - approvedPct / 100));
                return {
                  ok: true as const,
                  productId,
                  productName: product.name,
                  approvedPct,
                  code,
                  finalPrice,
                };
              },
            }),
          },
        });

        return result.toUIMessageStreamResponse({
          originalMessages: trimmed as unknown as UIMessage[],
        });
      },
    },
  },
});
