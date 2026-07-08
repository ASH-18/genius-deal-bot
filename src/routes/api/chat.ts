import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { PRODUCTS } from "@/lib/products";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";

// Hard caps to prevent token/cost abuse via oversized payloads.
const MAX_MESSAGES = 40;
const MAX_CHARS_PER_MESSAGE = 2000;
const MAX_TOTAL_CHARS = 20_000;
const RECENT_TURNS = 20; // trim history server-side before forwarding

const textPartSchema = z.object({
  type: z.literal("text"),
  text: z.string().max(MAX_CHARS_PER_MESSAGE),
});

const messageSchema = z.object({
  id: z.string().max(128).optional(),
  role: z.enum(["system", "user", "assistant"]),
  parts: z.array(textPartSchema).min(1).max(8),
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
          (sum, m) => sum + m.parts.reduce((s, p) => s + p.text.length, 0),
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
        });

        return result.toUIMessageStreamResponse({
          originalMessages: trimmed as unknown as UIMessage[],
        });
      },
    },
  },
});
