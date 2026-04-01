"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  index?: number;
}

export function ProductCard({
  name,
  price,
  image,
  category,
  inStock,
  index = 0,
}: ProductCardProps) {
  const categoryLabels: Record<string, string> = {
    books: "Buch",
    music: "Musik",
    kids: "Kinder & Jugend",
    tricks: "Tricks & Hilfsmittel",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
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
              Nicht verfuegbar
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
            <button className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center hover:bg-[var(--color-primary-light)] transition-colors">
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
