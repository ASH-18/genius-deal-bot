import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  qty: number;
  color?: string;
  size?: string;
}

interface ShopState {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  compare: string[];
  addToCart: (id: string, opts?: { color?: string; size?: string; qty?: number }) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  addRecentlyViewed: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
}

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      recentlyViewed: [],
      compare: [],
      addToCart: (id, opts) => {
        const existing = get().cart.find((c) => c.id === id);
        if (existing) {
          set({ cart: get().cart.map((c) => (c.id === id ? { ...c, qty: c.qty + (opts?.qty ?? 1) } : c)) });
        } else {
          set({ cart: [...get().cart, { id, qty: opts?.qty ?? 1, color: opts?.color, size: opts?.size }] });
        }
      },
      removeFromCart: (id) => set({ cart: get().cart.filter((c) => c.id !== id) }),
      setQty: (id, qty) =>
        set({ cart: get().cart.map((c) => (c.id === id ? { ...c, qty: Math.max(1, qty) } : c)) }),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (id) => {
        const has = get().wishlist.includes(id);
        set({ wishlist: has ? get().wishlist.filter((x) => x !== id) : [...get().wishlist, id] });
      },
      addRecentlyViewed: (id) => {
        const list = [id, ...get().recentlyViewed.filter((x) => x !== id)].slice(0, 12);
        set({ recentlyViewed: list });
      },
      toggleCompare: (id) => {
        const has = get().compare.includes(id);
        if (has) set({ compare: get().compare.filter((x) => x !== id) });
        else if (get().compare.length < 4) set({ compare: [...get().compare, id] });
      },
      clearCompare: () => set({ compare: [] }),
    }),
    { name: "lumen-shop" },
  ),
);
