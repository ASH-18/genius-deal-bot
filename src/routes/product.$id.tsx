import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart, GitCompare, ShoppingBag, Star, Truck, RotateCcw, ShieldCheck,
  ChevronLeft, ChevronRight, Sparkles, Check,
} from "lucide-react";
import { getProduct, discount, similarProducts, frequentlyBought, PRODUCTS, type Product } from "@/lib/products";
import { inr, daysFromNow } from "@/lib/format";
import { useShop } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} · Lumen` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: loaderData.name },
          { property: "og:description", content: loaderData.description },
          { property: "og:image", content: loaderData.image },
          { property: "og:type", content: "product" },
        ]
      : [{ title: "Product · Lumen" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl py-24 text-center">
      <div className="font-display text-3xl mb-2">Product not found</div>
      <Link to="/shop" className="text-primary hover:underline">← Back to boutique</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-xl py-24 text-center">
      <div className="font-display text-2xl mb-2">Something went wrong</div>
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const p = Route.useLoaderData() as Product;
  const navigate = useNavigate();
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState<string | undefined>(p.colors?.[0]);
  const [size, setSize] = useState<string | undefined>(p.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [aiSummary, setAiSummary] = useState<null | { pros: string[]; cons: string[]; summary: string }>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const { addToCart, toggleWishlist, wishlist, toggleCompare, compare, addRecentlyViewed } = useShop();
  const off = discount(p);
  const isWished = wishlist.includes(p.id);
  const isComparing = compare.includes(p.id);

  useEffect(() => { addRecentlyViewed(p.id); }, [p.id, addRecentlyViewed]);

  // Simulated AI review summary (deterministic, product-derived)
  const generateAiSummary = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiSummary({
        summary: `${p.name} is consistently praised for ${p.highlights[0]?.toLowerCase() ?? "quality"} and ${p.highlights[1]?.toLowerCase() ?? "value"}. ${p.reviews.toLocaleString("en-IN")} verified buyers rate it ${p.rating.toFixed(1)}/5.`,
        pros: [
          `Excellent ${p.highlights[0] ?? "build quality"}`,
          `${p.highlights[1] ?? "Great performance"} for the price`,
          "Ships fast and packaging is premium",
        ],
        cons: [
          off < 20 ? "Priced at a premium" : "Limited stock at this deal",
          p.category === "Electronics" ? "Warranty could be longer" : "Handle with care during first uses",
        ],
      });
      setAiLoading(false);
    }, 800);
  };

  const handleAdd = () => {
    addToCart(p.id, { color, size, qty });
    toast.success(`${p.name} added to cart`);
  };

  const handleBuy = () => {
    addToCart(p.id, { color, size, qty });
    navigate({ to: "/cart" });
  };

  const similar = similarProducts(p, 4);
  const bought = frequentlyBought(p, 3);
  const bundleTotal = bought.reduce((s, x) => s + x.price, p.price);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
      <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to="/shop" search={{ cat: p.category, q: undefined, sort: undefined }} className="hover:text-foreground">{p.category}</Link>
        <span>/</span>
        <span className="text-foreground">{p.name}</span>
      </nav>

      <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16">
        {/* GALLERY */}
        <div className="space-y-4">
          <motion.div
            key={imgIdx}
            initial={{ opacity: 0.4, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border shadow-elegant group"
          >
            <img src={p.gallery[imgIdx]} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            {p.gallery.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((i) => (i - 1 + p.gallery.length) % p.gallery.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass grid place-items-center opacity-0 group-hover:opacity-100 transition"
                  aria-label="Previous image"
                ><ChevronLeft className="h-4 w-4" /></button>
                <button
                  onClick={() => setImgIdx((i) => (i + 1) % p.gallery.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass grid place-items-center opacity-0 group-hover:opacity-100 transition"
                  aria-label="Next image"
                ><ChevronRight className="h-4 w-4" /></button>
              </>
            )}
          </motion.div>
          <div className="grid grid-cols-4 gap-3">
            {p.gallery.map((src: string, i: number) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`aspect-square rounded-lg overflow-hidden border transition ${
                  imgIdx === i ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-primary/60"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-6">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{p.brand}</div>
            <h1 className="font-display text-3xl md:text-4xl mt-2 leading-tight">{p.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium">{p.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({p.reviews.toLocaleString("en-IN")} reviews)</span>
              </div>
              {p.stock < 20 && <span className="text-xs text-destructive">Only {p.stock} left</span>}
            </div>
          </div>

          <div className="flex items-baseline gap-3 pb-6 border-b border-border">
            <span className="font-display text-4xl">{inr(p.price)}</span>
            {off > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">{inr(p.mrp)}</span>
                <span className="text-sm font-medium text-primary">Save {off}%</span>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{p.description}</p>

          <ul className="grid grid-cols-2 gap-2 text-sm">
            {p.highlights.map((h: string) => (
              <li key={h} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {h}
              </li>
            ))}
          </ul>

          {p.colors && (
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Color · <span className="text-foreground normal-case">{color}</span></div>
              <div className="flex gap-2">
                {p.colors.map((c: string) => (
                  <button
                    key={c} onClick={() => setColor(c)}
                    className={`px-4 h-10 rounded-full text-sm border transition ${
                      color === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/60"
                    }`}
                  >{c}</button>
                ))}
              </div>
            </div>
          )}

          {p.sizes && (
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Size · <span className="text-foreground normal-case">{size}</span></div>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s: string) => (
                  <button
                    key={s} onClick={() => setSize(s)}
                    className={`min-w-[3.5rem] h-10 px-3 rounded-lg text-sm border transition ${
                      size === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/60"
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-stretch gap-3">
            <div className="flex items-center border border-border rounded-full">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-11 w-11 grid place-items-center text-lg">−</button>
              <span className="w-8 text-center font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="h-11 w-11 grid place-items-center text-lg">+</button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 h-11 rounded-full border border-border hover:border-primary/60 hover:text-primary font-medium inline-flex items-center justify-center gap-2 transition"
            >
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </button>
            <button
              onClick={handleBuy}
              className="flex-1 h-11 rounded-full bg-primary text-primary-foreground font-medium hover:brightness-110 transition shadow-glow"
            >Buy now</button>
          </div>

          <div className="flex gap-2 text-sm">
            <button
              onClick={() => { toggleWishlist(p.id); toast(isWished ? "Removed from wishlist" : "Added to wishlist"); }}
              className={`flex-1 h-10 rounded-full border inline-flex items-center justify-center gap-2 transition ${
                isWished ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            ><Heart className={`h-4 w-4 ${isWished ? "fill-current" : ""}`} /> {isWished ? "Wishlisted" : "Wishlist"}</button>
            <button
              onClick={() => { toggleCompare(p.id); toast(isComparing ? "Removed from compare" : "Added to compare"); }}
              className={`flex-1 h-10 rounded-full border inline-flex items-center justify-center gap-2 transition ${
                isComparing ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            ><GitCompare className="h-4 w-4" /> {isComparing ? "In compare" : "Compare"}</button>
          </div>

          <div className="rounded-2xl border border-border bg-card/50 p-4 space-y-3 text-sm">
            <Row icon={<Truck className="h-4 w-4 text-primary" />} label={`Free delivery by ${daysFromNow(p.deliveryDays)}`} />
            <Row icon={<RotateCcw className="h-4 w-4 text-primary" />} label="30-day free returns · no questions asked" />
            <Row icon={<ShieldCheck className="h-4 w-4 text-primary" />} label={`${p.brand} 2-year warranty · authenticity guaranteed`} />
            {p.price >= 3000 && (
              <Row icon={<span className="text-primary text-xs font-semibold">EMI</span>} label={`From ${inr(Math.round(p.price / 12))}/month · No-cost EMI on select banks`} />
            )}
          </div>
        </div>
      </div>

      {/* AI SUMMARY */}
      <section className="mt-16 rounded-3xl border border-border bg-gradient-surface p-6 md:p-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" /> AI Summary
            </div>
            <h3 className="font-display text-2xl">What buyers think</h3>
          </div>
          {!aiSummary && (
            <button
              onClick={generateAiSummary}
              disabled={aiLoading}
              className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
            >{aiLoading ? "Analysing…" : "Generate summary"}</button>
          )}
        </div>

        {aiSummary ? (
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="md:col-span-1">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Overview</div>
              <p className="leading-relaxed">{aiSummary.summary}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-primary mb-2">Pros</div>
              <ul className="space-y-2">
                {aiSummary.pros.map((x) => (
                  <li key={x} className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-destructive mb-2">Cons</div>
              <ul className="space-y-2">
                {aiSummary.cons.map((x) => (
                  <li key={x} className="flex gap-2 text-muted-foreground">— {x}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Tap "Generate summary" for an AI-condensed view of {p.reviews.toLocaleString("en-IN")} reviews.</p>
        )}
      </section>

      {/* SPECS */}
      <section className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-border p-6">
          <h3 className="font-display text-xl mb-4">Specifications</h3>
          <dl className="space-y-2 text-sm">
            {Object.entries(p.specs as Record<string, string>).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border/60 py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-foreground font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-2xl border border-border p-6">
          <h3 className="font-display text-xl mb-4">Tags & occasions</h3>
          <div className="flex flex-wrap gap-2">
            {p.tags.map((t: string) => (
              <span key={t} className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs">#{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FBT */}
      {bought.length > 0 && (
        <section className="mt-16">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Frequently bought together</div>
            <h3 className="font-display text-2xl">Complete the look · {inr(bundleTotal)}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            <ProductCard product={p} index={0} />
            {bought.map((b, i) => (
              <div key={b.id} className="flex flex-col gap-2 items-center">
                <span className="text-2xl text-muted-foreground -mb-4">+</span>
                <ProductCard product={b} index={i + 1} />
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              addToCart(p.id, { color, size });
              bought.forEach((b) => addToCart(b.id));
              toast.success("Bundle added to cart");
            }}
            className="mt-6 h-11 px-6 rounded-full bg-primary text-primary-foreground font-medium shadow-glow hover:brightness-110 transition"
          >Add bundle · {inr(bundleTotal)}</button>
        </section>
      )}

      {similar.length > 0 && (
        <section className="mt-16">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Similar picks</div>
            <h3 className="font-display text-2xl">You may also love</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {similar.map((s, i) => <ProductCard key={s.id} product={s} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <div className="flex items-center gap-3"><span className="h-6 w-6 grid place-items-center">{icon}</span><span>{label}</span></div>;
}

// Silence unused import warning
void PRODUCTS;
