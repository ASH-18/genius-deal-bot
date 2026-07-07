import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useShop } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist · Lumen" }, { name: "description", content: "Your saved products at Lumen." }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useShop();
  const items = wishlist.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as typeof PRODUCTS;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Saved for later</div>
        <h1 className="font-display text-4xl">Wishlist <span className="text-muted-foreground">· {items.length}</span></h1>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed border-border rounded-2xl p-16 text-center">
          <Heart className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
          <div className="font-display text-xl mb-2">Nothing saved yet</div>
          <p className="text-sm text-muted-foreground mb-5">Tap the heart on any product to save it here.</p>
          <Link to="/shop" className="inline-flex h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium">Browse the boutique</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
