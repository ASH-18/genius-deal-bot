import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, GitCompare, ShoppingBag, Search, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/lib/store";
import { CATEGORIES } from "@/lib/products";
import { cn } from "@/lib/utils";

export function Header({ onOpenAI }: { onOpenAI: () => void }) {
  const { cart, wishlist, compare } = useShop();
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/shop", search: { q: q || undefined, cat: undefined, sort: undefined } });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="h-8 w-8 rounded-lg bg-gradient-warm grid place-items-center shadow-glow">
                <span className="font-display text-primary-foreground text-lg leading-none">L</span>
              </span>
              <span className="font-display text-xl tracking-tight">Lumen</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/shop" className="hover:text-foreground transition-colors">Shop All</Link>
              {CATEGORIES.slice(0, 4).map((c) => (
                <Link
                  key={c}
                  to="/shop"
                  search={{ cat: c, q: undefined, sort: undefined }}
                  className="hover:text-foreground transition-colors"
                >{c}</Link>
              ))}
            </nav>
          </div>

          <form onSubmit={submit} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, brands, occasions…"
                className="w-full h-10 rounded-full bg-input/60 border border-border pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onOpenAI}
              className="hidden sm:flex items-center gap-2 h-10 pl-3 pr-4 rounded-full bg-gradient-warm text-primary-foreground text-sm font-medium shadow-glow hover:brightness-105 transition"
            >
              <Sparkles className="h-4 w-4" />
              Ask Lumen
            </button>
            <HeaderIcon to="/wishlist" label="Wishlist" count={wishlist.length}>
              <Heart className="h-5 w-5" />
            </HeaderIcon>
            <HeaderIcon to="/compare" label="Compare" count={compare.length}>
              <GitCompare className="h-5 w-5" />
            </HeaderIcon>
            <HeaderIcon to="/cart" label="Cart" count={cartCount}>
              <ShoppingBag className="h-5 w-5" />
            </HeaderIcon>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden h-10 w-10 grid place-items-center text-muted-foreground hover:text-foreground"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-border/60 space-y-3">
            <form onSubmit={submit} className="md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search…"
                  className="w-full h-10 rounded-full bg-input/60 border border-border pl-10 pr-4 text-sm"
                />
              </div>
            </form>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link to="/shop" onClick={() => setMobileOpen(false)} className="p-3 rounded-lg bg-card border border-border">Shop All</Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c} to="/shop" search={{ cat: c, q: undefined, sort: undefined }}
                  onClick={() => setMobileOpen(false)}
                  className="p-3 rounded-lg bg-card border border-border"
                >{c}</Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function HeaderIcon({
  to, label, count, children,
}: { to: string; label: string; count: number; children: React.ReactNode }) {
  return (
    <Link
      to={to as never}
      className="relative h-10 w-10 grid place-items-center text-muted-foreground hover:text-foreground transition-colors"
      aria-label={label}
    >
      {children}
      {count > 0 && (
        <span className={cn(
          "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold",
        )}>{count}</span>
      )}
    </Link>
  );
}
