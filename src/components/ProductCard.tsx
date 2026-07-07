import { Link } from "@tanstack/react-router";
import { Heart, GitCompare, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useShop } from "@/lib/store";
import { discount, type Product } from "@/lib/products";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { wishlist, toggleWishlist, compare, toggleCompare } = useShop();
  const isWished = wishlist.includes(product.id);
  const isComparing = compare.includes(product.id);
  const off = discount(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block overflow-hidden rounded-2xl bg-card border border-border/60 hover:border-primary/50 transition-colors shadow-elegant"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.bestseller && <Badge>Bestseller</Badge>}
            {product.newArrival && <Badge tone="ivory">New</Badge>}
            {product.flashDeal && <Badge tone="destructive">Flash · {off}% off</Badge>}
            {!product.flashDeal && off >= 20 && <Badge tone="ghost">−{off}%</Badge>}
          </div>
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <IconBtn
              active={isWished}
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
              label="Wishlist"
            >
              <Heart className={cn("h-4 w-4", isWished && "fill-current")} />
            </IconBtn>
            <IconBtn
              active={isComparing}
              onClick={(e) => { e.preventDefault(); toggleCompare(product.id); }}
              label="Compare"
            >
              <GitCompare className="h-4 w-4" />
            </IconBtn>
          </div>
        </div>
        <div className="p-4 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <span>{product.brand}</span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {product.rating.toFixed(1)}
            </span>
          </div>
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug min-h-[2.5em]">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-lg text-foreground">{inr(product.price)}</span>
            {off > 0 && <span className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Badge({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "ivory" | "destructive" | "ghost" }) {
  const cls =
    tone === "primary" ? "bg-primary text-primary-foreground"
    : tone === "ivory" ? "bg-foreground text-background"
    : tone === "destructive" ? "bg-destructive text-destructive-foreground"
    : "glass text-foreground";
  return (
    <span className={cn("text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-medium", cls)}>
      {children}
    </span>
  );
}

function IconBtn({
  children, active, onClick, label,
}: { children: React.ReactNode; active?: boolean; onClick: (e: React.MouseEvent) => void; label: string }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={cn(
        "h-9 w-9 rounded-full grid place-items-center border transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "glass text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary",
      )}
    >
      {children}
    </button>
  );
}
