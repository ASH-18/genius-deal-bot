import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Truck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import { inr, daysFromNow } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your bag · Lumen" }, { name: "description", content: "Review your bag and check out securely." }] }),
  component: CartPage,
});

const COUPONS: Record<string, number> = { LUMEN10: 0.10, WINTER15: 0.15, FIRST20: 0.20 };

function CartPage() {
  const { cart, setQty, removeFromCart, clearCart } = useShop();
  const [coupon, setCoupon] = useState("");
  const [discountPct, setDiscountPct] = useState(0);

  const items = cart
    .map((c) => ({ ...c, product: PRODUCTS.find((p) => p.id === c.id)! }))
    .filter((x) => x.product);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const savings = items.reduce((s, i) => s + (i.product.mrp - i.product.price) * i.qty, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const couponDisc = Math.round(subtotal * discountPct);
  const total = subtotal + shipping - couponDisc;

  const applyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (COUPONS[c]) {
      setDiscountPct(COUPONS[c]);
      toast.success(`${c} applied · ${Math.round(COUPONS[c] * 100)}% off`);
    } else if (c) toast.error("Invalid coupon");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="inline-flex h-16 w-16 rounded-full bg-muted grid place-items-center mx-auto mb-6">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl mb-2">Your bag is empty</h1>
        <p className="text-muted-foreground mb-6">Add a few beautiful things and they'll appear here.</p>
        <Link to="/shop" className="inline-flex h-11 px-6 rounded-full bg-primary text-primary-foreground items-center font-medium">Start browsing</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl mb-8">Your bag <span className="text-muted-foreground">· {items.length}</span></h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 p-4 rounded-2xl border border-border bg-card">
              <Link to="/product/$id" params={{ id: i.id }} className="shrink-0">
                <img src={i.product.image} alt={i.product.name} className="h-24 w-24 rounded-lg object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{i.product.brand}</div>
                    <Link to="/product/$id" params={{ id: i.id }} className="font-medium hover:text-primary line-clamp-1">{i.product.name}</Link>
                    <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                      {i.color && <span>Color: {i.color}</span>}
                      {i.size && <span>Size: {i.size}</span>}
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(i.id)} aria-label="Remove" className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center border border-border rounded-full">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="h-9 w-9 grid place-items-center"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center text-sm font-medium">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="h-9 w-9 grid place-items-center"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg">{inr(i.product.price * i.qty)}</div>
                    <div className="text-xs text-muted-foreground">Delivery by {daysFromNow(i.product.deliveryDays)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => { clearCart(); toast("Bag cleared"); }} className="text-sm text-muted-foreground hover:text-destructive">Clear bag</button>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-6 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-display text-2xl">Order summary</h2>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={coupon} onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon (try LUMEN10)"
                className="w-full h-10 pl-10 pr-3 rounded-full bg-input/60 border border-border text-sm"
              />
            </div>
            <button onClick={applyCoupon} className="h-10 px-4 rounded-full border border-border hover:border-primary/60 text-sm">Apply</button>
          </div>

          <div className="space-y-2 text-sm pt-2">
            <Row label="Subtotal" value={inr(subtotal)} />
            {savings > 0 && <Row label="You saved" value={`− ${inr(savings)}`} tone="primary" />}
            {couponDisc > 0 && <Row label={`Coupon`} value={`− ${inr(couponDisc)}`} tone="primary" />}
            <Row label="Shipping" value={shipping === 0 ? "Free" : inr(shipping)} />
          </div>

          <div className="pt-3 border-t border-border flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl">{inr(total)}</span>
          </div>

          <Link to="/checkout" className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium grid place-items-center shadow-glow hover:brightness-110 transition">
            Checkout · {inr(total)}
          </Link>

          <div className="text-xs text-muted-foreground space-y-1.5 pt-2">
            <div className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-primary" /> Free shipping over ₹999</div>
            <div className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-primary" /> Ask Lumen for a smaller bundle</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "primary" }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={tone === "primary" ? "text-primary font-medium" : ""}>{value}</span>
    </div>
  );
}
