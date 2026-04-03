"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/CartContext";

interface AddToCartButtonProps {
  sku: string;
}

export function AddToCartButton({ sku }: AddToCartButtonProps) {
  const { addItem, setCartOpen } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(sku);
    setAdded(true);
    setCartOpen(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-medium text-base transition-colors ${
        added
          ? "bg-green-500 text-white"
          : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]"
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Hinzugefügt
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          In den Warenkorb
        </>
      )}
    </button>
  );
}
