import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PRODUCTS, CATEGORIES } from "@/lib/products";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", priority: "1.0", changefreq: "daily" as const },
          { path: "/shop", priority: "0.9", changefreq: "daily" as const },
          { path: "/wishlist", priority: "0.4", changefreq: "monthly" as const },
          { path: "/compare", priority: "0.4", changefreq: "monthly" as const },
          { path: "/cart", priority: "0.3", changefreq: "monthly" as const },
          ...CATEGORIES.map((c) => ({ path: `/shop?cat=${encodeURIComponent(c)}`, priority: "0.7", changefreq: "weekly" as const })),
          ...PRODUCTS.map((p) => ({ path: `/product/${p.id}`, priority: "0.8", changefreq: "weekly" as const })),
        ];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) =>
            `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`
          ),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
