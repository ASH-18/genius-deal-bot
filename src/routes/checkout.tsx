import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { useShop } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import { inr } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · Lumen" }, { name: "description", content: "Secure checkout at Lumen." }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, clearCart } = useShop();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [payment, setPayment] = useState<"upi" | "card" | "cod">("upi");

  const items = cart.map((c) => ({ ...c, product: PRODUCTS.find((p) => p.id === c.id)! })).filter((x) => x.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const place = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setPlaced(true);
      clearCart();
      toast.success("Order placed!");
    }, 700);
  };

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl mb-2">Your bag is empty</h1>
        <Link to="/shop" className="text-primary hover:underline">← Continue shopping</Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <CheckCircle2 className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="font-display text-4xl mb-2">Order placed</h1>
        <p className="text-muted-foreground mb-1">Order #LU-{Math.random().toString(36).slice(2, 8).toUpperCase()}</p>
        <p className="text-sm text-muted-foreground mb-8">A receipt has been sent to your email. Delivery in 2–5 business days.</p>
        <button onClick={() => navigate({ to: "/" })} className="h-11 px-6 rounded-full bg-primary text-primary-foreground font-medium">Back to home</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6"><ArrowLeft className="h-4 w-4" /> Back to bag</Link>
      <h1 className="font-display text-4xl mb-8">Checkout</h1>

      <form onSubmit={place} className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-8">
          <Card title="Contact">
            <Field label="Email" type="email" placeholder="you@example.com" required />
            <Field label="Phone" type="tel" placeholder="+91 98xxxxxx00" required />
          </Card>

          <Card title="Shipping address">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name" required />
              <Field label="Last name" required />
            </div>
            <Field label="Address" required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" required />
              <Field label="PIN code" required />
            </div>
            <Field label="State" required />
          </Card>

          <Card title="Payment">
            <div className="grid grid-cols-3 gap-2">
              {(["upi", "card", "cod"] as const).map((m) => (
                <button
                  type="button" key={m}
                  onClick={() => setPayment(m)}
                  className={`h-11 rounded-full text-sm border transition ${
                    payment === m ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/60"
                  }`}
                >{m === "upi" ? "UPI" : m === "card" ? "Card" : "Cash on delivery"}</button>
              ))}
            </div>
            {payment === "upi" && <Field label="UPI ID" placeholder="you@upi" required />}
            {payment === "card" && (
              <div className="space-y-3 pt-2">
                <Field label="Card number" placeholder="4242 4242 4242 4242" required />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Expiry" placeholder="MM / YY" required />
                  <Field label="CVV" placeholder="123" required />
                </div>
              </div>
            )}
          </Card>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-6 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-display text-2xl">Summary</h2>
          <div className="space-y-3 max-h-64 overflow-auto pr-1">
            {items.map((i) => (
              <div key={i.id} className="flex gap-3">
                <img src={i.product.image} className="h-12 w-12 rounded object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm line-clamp-1">{i.product.name}</div>
                  <div className="text-xs text-muted-foreground">Qty {i.qty} · {inr(i.product.price * i.qty)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-border space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : inr(shipping)}</span></div>
          </div>
          <div className="pt-3 border-t border-border flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl">{inr(total)}</span>
          </div>
          <button type="submit" className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium shadow-glow">Place order · {inr(total)}</button>
          <div className="pt-2 text-xs text-muted-foreground space-y-1.5">
            <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Secure checkout · 256-bit encryption</div>
            <div className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-primary" /> Free shipping over ₹999</div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
      <h3 className="font-display text-xl mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        {...props}
        className="mt-1 w-full h-11 px-4 rounded-lg bg-input/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60"
      />
    </label>
  );
}
