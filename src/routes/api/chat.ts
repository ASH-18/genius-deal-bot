import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { PRODUCTS } from "@/lib/products";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatBody = { messages?: unknown };

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
        const { messages } = (await request.json()) as ChatBody;
        if (!Array.isArray(messages)) return new Response("messages required", { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages as UIMessage[] });
      },
    },
  },
});
