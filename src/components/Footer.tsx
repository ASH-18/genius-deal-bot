import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-gradient-warm grid place-items-center">
              <span className="font-display text-primary-foreground text-lg leading-none">L</span>
            </span>
            <span className="font-display text-xl">Lumen</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            A curated boutique of things worth keeping — matched to you by an AI that actually listens.
          </p>
        </div>
        <FooterCol title="Shop">
          {CATEGORIES.map((c) => (
            <Link key={c} to="/shop" search={{ cat: c, q: undefined, sort: undefined }} className="hover:text-foreground">{c}</Link>
          ))}
        </FooterCol>
        <FooterCol title="Help">
          <a>Shipping & Delivery</a><a>Returns (30 days)</a><a>EMI options</a><a>Contact us</a>
        </FooterCol>
        <FooterCol title="Company">
          <a>About Lumen</a><a>Sustainability</a><a>Press</a><a>Careers</a>
        </FooterCol>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Lumen Commerce · Made with care in India · Prices in ₹
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.16em] text-foreground/70 mb-4">{title}</h4>
      <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
