import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const bestsellers = PRODUCTS.filter((p) => p.bestseller);
  const newArrivals = PRODUCTS.filter((p) => p.newArrival);
  const flashDeals = PRODUCTS.filter((p) => p.flashDeal);
  const { recentlyViewed } = useShop();
  const recent = recentlyViewed
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p))
    .slice(0, 6);

  return (
    <div className="bg-gradient-hero">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 md:pt-16 pb-20">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-curated · Winter 2026
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
              Things worth
              <br />
              <span className="italic text-primary">keeping.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-md">
              A quiet boutique of thoughtful design — matched to your taste, budget, and moments by an AI that actually listens.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground font-medium hover:brightness-110 transition shadow-glow"
              >
                Explore the boutique <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop"
                search={{ cat: "Fashion", q: undefined, sort: undefined }}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-border hover:border-primary/60 hover:text-primary transition"
              >
                Gift edit
              </Link>
            </div>
            <div className="pt-2 flex flex-wrap gap-x-8 gap-y-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Free shipping over ₹999</span>
              <span className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-primary" /> 30-day free returns</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Authenticity guaranteed</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elegant">
              <img src={heroImage} alt="A curated still life of premium products" width={1600} height={1200} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <div className="text-xs uppercase tracking-widest text-primary/90 mb-2">The Winter Edit</div>
                <div className="font-display text-2xl text-white">24 pieces, one warm mood.</div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 hidden md:flex items-center gap-3 rounded-2xl glass px-4 py-3 shadow-elegant">
              <span className="h-8 w-8 rounded-full bg-gradient-warm grid place-items-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <div className="text-xs">
                <div className="font-medium">Lumen Concierge</div>
                <div className="text-muted-foreground">Try "gift for my sister"</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to="/shop"
                search={{ cat: c, q: undefined, sort: undefined }}
                className="block rounded-2xl border border-border bg-card hover:border-primary/60 hover:bg-primary/5 p-5 transition group"
              >
                <div className="font-display text-lg group-hover:text-primary transition-colors">{c}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {PRODUCTS.filter((p) => p.category === c).length} pieces
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <Section title="Continue browsing" subtitle="Where you left off">
          <Grid>{recent.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</Grid>
        </Section>
      )}

      <Section title="Bestsellers" subtitle="Loved by thousands">
        <Grid>{bestsellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</Grid>
      </Section>

      <Section title="Flash sales" subtitle="Ends soon · limited stock" accent>
        <Grid>{flashDeals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</Grid>
      </Section>

      <Section title="New arrivals" subtitle="Freshly picked">
        <Grid>{newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</Grid>
      </Section>

      <Section title="Recommended for you" subtitle="Based on what customers like you love">
        <Grid>{PRODUCTS.slice(8, 16).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</Grid>
      </Section>
    </div>
  );
}

function Section({ title, subtitle, accent, children }: { title: string; subtitle?: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          {subtitle && <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">{subtitle}</div>}
          <h2 className={`font-display text-3xl md:text-4xl ${accent ? "text-primary" : ""}`}>{title}</h2>
        </div>
        <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{children}</div>;
}
