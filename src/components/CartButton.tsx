"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export function CartButton() {
  const { totalItems, setCartOpen } = useCart();

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:bg-[var(--color-primary-light)] transition-all hover:scale-105 flex items-center justify-center"
      aria-label="Warenkorb öffnen"
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
