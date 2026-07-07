import { createFileRoute, Link } from "@tanstack/react-router";
import { GitCompare, Trophy, X, Star } from "lucide-react";
import { useMemo } from "react";
import { useShop } from "@/lib/store";
import { PRODUCTS, discount } from "@/lib/products";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "Compare · Lumen" }, { name: "description", content: "Compare up to 4 products side by side, with an AI-picked winner." }] }),
  component: ComparePage,
});

function ComparePage() {
  const { compare, toggleCompare, clearCompare } = useShop();
  const items = compare.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean);

  const scores = useMemo(() => items.map((p) => {
    const performance = Math.min(100, Math.round(p.rating * 18 + p.reviews / 200));
    const priceScore = Math.min(100, Math.round((1 - p.price / 200000) * 100));
    const valueScore = Math.round(discount(p) * 2 + p.rating * 10);
    const overall = Math.round(performance * 0.4 + priceScore * 0.3 + valueScore * 0.3);
    return { id: p.id, performance, priceScore, valueScore, overall };
  }), [items]);

  const winnerId = scores.length
    ? scores.reduce((best, s) => (s.overall > best.overall ? s : best), scores[0]).id
    : null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <GitCompare className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <h1 className="font-display text-3xl mb-2">Nothing to compare</h1>
        <p className="text-muted-foreground mb-6">Add up to 4 products from any listing or product page.</p>
        <Link to="/shop" className="inline-flex h-11 px-6 rounded-full bg-primary text-primary-foreground font-medium">Find products</Link>
      </div>
    );
  }

  const allSpecKeys = Array.from(new Set(items.flatMap((p) => Object.keys(p.specs))));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Side-by-side</div>
          <h1 className="font-display text-4xl">Compare</h1>
        </div>
        <button onClick={clearCompare} className="text-sm text-muted-foreground hover:text-destructive">Clear all</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-x-4">
          <thead>
            <tr>
              <th className="w-40"></th>
              {items.map((p) => (
                <th key={p.id} className="text-left align-bottom pb-4 min-w-[200px]">
                  <div className="relative rounded-2xl border border-border bg-card p-4">
                    {winnerId === p.id && (
                      <div className="absolute -top-3 left-4 px-2 py-0.5 rounded-full bg-gradient-warm text-primary-foreground text-[10px] uppercase tracking-widest flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> Winner
                      </div>
                    )}
                    <button
                      onClick={() => toggleCompare(p.id)}
                      className="absolute top-2 right-2 h-7 w-7 grid place-items-center rounded-full hover:bg-muted"
                      aria-label="Remove"
                    ><X className="h-3.5 w-3.5" /></button>
                    <img src={p.image} alt={p.name} className="w-full aspect-square object-cover rounded-lg mb-3" />
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{p.brand}</div>
                    <div className="font-medium text-sm line-clamp-2">{p.name}</div>
                    <div className="font-display text-lg mt-1">{inr(p.price)}</div>
                    <Link to="/product/$id" params={{ id: p.id }} className="mt-3 block text-xs text-primary hover:underline">View product →</Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            <Section label="Scores">
              {items.map((p) => {
                const s = scores.find((x) => x.id === p.id)!;
                return (
                  <td key={p.id} className="align-top py-3 space-y-2">
                    <Bar label="Overall" value={s.overall} />
                    <Bar label="Performance" value={s.performance} />
                    <Bar label="Value" value={s.valueScore} />
                    <Bar label="Price" value={s.priceScore} />
                  </td>
                );
              })}
            </Section>

            <Row label="Rating">
              {items.map((p) => (
                <td key={p.id} className="py-3">
                  <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" />{p.rating.toFixed(1)} · {p.reviews.toLocaleString("en-IN")}</span>
                </td>
              ))}
            </Row>
            <Row label="MRP">
              {items.map((p) => <td key={p.id} className="py-3 text-muted-foreground line-through">{inr(p.mrp)}</td>)}
            </Row>
            <Row label="Discount">
              {items.map((p) => <td key={p.id} className="py-3 text-primary font-medium">−{discount(p)}%</td>)}
            </Row>
            <Row label="Delivery">
              {items.map((p) => <td key={p.id} className="py-3">In {p.deliveryDays} days</td>)}
            </Row>
            <Row label="Stock">
              {items.map((p) => <td key={p.id} className="py-3">{p.stock} available</td>)}
            </Row>

            {allSpecKeys.map((k) => (
              <Row key={k} label={k}>
                {items.map((p) => <td key={p.id} className="py-3">{p.specs[k] ?? <span className="text-muted-foreground">—</span>}</td>)}
              </Row>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <tr><td colSpan={99} className="pt-6 pb-2 text-xs uppercase tracking-widest text-muted-foreground">{label}</td></tr>
      <tr>{children}</tr>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-t border-border/60">
      <td className="py-3 text-xs uppercase tracking-widest text-muted-foreground">{label}</td>
      {children}
    </tr>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        <span>{label}</span><span>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-gradient-warm" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}
