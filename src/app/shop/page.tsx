"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import { Search } from "lucide-react";

const categories = [
  { key: "all", label: "Alle" },
  { key: "books", label: "Bücher" },
  { key: "music", label: "Musik" },
  { key: "kids", label: "Kinder & Jugend" },
  { key: "tricks", label: "Tricks & Hilfsmittel" },
];

export default function ShopPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchesCategory = category === "all" || p.category === category;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="bg-[var(--color-primary)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Shop</h1>
          <p className="text-white/80 max-w-2xl text-lg">
            Bücher, Musik, Materialien für die Kinder- und Jugendarbeit und
            kreative Hilfsmittel.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Produkt suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`text-sm font-medium px-4 py-2.5 rounded-xl transition-colors ${
                    category === cat.key
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 mb-6">
            {filtered.length} Produkt{filtered.length !== 1 ? "e" : ""}
          </p>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.sku}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                inStock={product.inStock}
                index={i}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500">
                Keine Produkte gefunden. Versuche einen anderen Suchbegriff.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
