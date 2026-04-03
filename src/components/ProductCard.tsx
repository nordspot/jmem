"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/CartContext";

interface ProductCardProps {
  sku: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export function ProductCard({
  sku,
  name,
  price,
  image,
  category,
  inStock,
}: ProductCardProps) {
  const { addItem, setCartOpen } = useCart();
  const [added, setAdded] = useState(false);

  const categoryLabels: Record<string, string> = {
    books: "Buch",
    music: "Musik",
    kids: "Kinder & Jugend",
    tricks: "Tricks & Hilfsmittel",
  };

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(sku);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setCartOpen(true);
  }

  return (
    <Link
      href={`/shop/${sku}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 block"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-medium bg-[var(--color-warm)] text-[var(--color-primary)] px-2.5 py-1 rounded-full">
            {categoryLabels[category] || category}
          </span>
        </div>
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow">
              Nicht verfügbar
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-[var(--color-primary)]">
            CHF {price.toFixed(2)}
          </p>
          {inStock && (
            <button
              onClick={handleAddToCart}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]"
              }`}
            >
              {added ? (
                <Check className="w-4 h-4" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        {added && (
          <p className="text-xs text-green-600 mt-1 text-right">
            Hinzugefügt
          </p>
        )}
      </div>
    </Link>
  );
}
