import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { PRODUCTS, CATEGORIES, BRANDS, type Category } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

const searchSchema = z.object({
  q: z.string().optional(),
  cat: z.enum(["Electronics", "Fashion", "Home", "Beauty", "Sports", "Books"]).optional(),
  sort: z.enum(["popular", "price-asc", "price-desc", "rating"]).optional(),
});

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop the Lumen Boutique" },
      { name: "description", content: "Browse the full Lumen catalog — electronics, fashion, home, beauty, and more. Filter by category, brand, price and rating." },
    ],
  }),
  validateSearch: (s) => searchSchema.parse(s),
  component: ShopPage,
});

function ShopPage() {
  const { q, cat, sort } = Route.useSearch();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (cat) list = list.filter((p) => p.category === cat);
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.brand.toLowerCase().includes(needle) ||
          p.tags.some((t) => t.toLowerCase().includes(needle)) ||
          p.description.toLowerCase().includes(needle),
      );
    }
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [q, cat, sort]);

  const setSearch = (patch: Partial<{ q?: string; cat?: Category; sort?: "popular" | "price-asc" | "price-desc" | "rating" }>) =>
    navigate({ to: "/shop", search: { q, cat, sort, ...patch } });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">The boutique</div>
          <h1 className="font-display text-4xl md:text-5xl">
            {cat ?? "All pieces"}
            {q && <span className="text-muted-foreground italic"> · "{q}"</span>}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{filtered.length} products</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sort ?? "popular"}
            onChange={(e) => setSearch({ sort: e.target.value as never })}
            className="h-10 rounded-full bg-input/60 border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            <option value="popular">Most popular</option>
            <option value="rating">Highest rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Category
            </div>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              <FilterChip active={!cat} onClick={() => setSearch({ cat: undefined })}>All</FilterChip>
              {CATEGORIES.map((c) => (
                <FilterChip key={c} active={cat === c} onClick={() => setSearch({ cat: c })}>{c}</FilterChip>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Brands</div>
            <div className="flex flex-col gap-1.5 max-h-56 overflow-auto pr-2">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setSearch({ q: b })}
                  className="text-left text-sm text-muted-foreground hover:text-foreground transition"
                >{b}</button>
              ))}
            </div>
          </div>
          {(q || cat) && (
            <button
              onClick={() => navigate({ to: "/shop", search: { q: undefined, cat: undefined, sort: undefined } })}
              className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" /> Clear filters
            </button>
          )}
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl p-16 text-center">
              <Search className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
              <div className="font-display text-xl mb-2">Nothing matches yet</div>
              <p className="text-sm text-muted-foreground">
                Try a different keyword, or ask the Lumen Concierge for recommendations.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border transition ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/60"
      }`}
    >{children}</button>
  );
}
