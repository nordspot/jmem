import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, BookOpen, Hash } from "lucide-react";
import { products } from "@/lib/products";
import { AddToCartButton } from "@/components/AddToCartButton";

const categoryLabels: Record<string, string> = {
  books: "Buch",
  music: "Musik",
  kids: "Kinder & Jugend",
  tricks: "Tricks & Hilfsmittel",
};

export function generateStaticParams() {
  return products.map((product) => ({
    sku: product.sku,
  }));
}

type Props = {
  params: Promise<{ sku: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku } = await params;
  const product = products.find((p) => p.sku === sku);

  if (!product) {
    return { title: "Produkt nicht gefunden | JMEM Shop" };
  }

  return {
    title: `${product.name} | JMEM Shop`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { sku } = await params;
  const product = products.find((p) => p.sku === sku);

  if (!product) {
    notFound();
  }

  const isBook = product.category === "books";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product image */}
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
            />
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            {/* Category badge */}
            <span className="inline-block self-start text-xs font-medium bg-[var(--color-warm)] text-[var(--color-primary)] px-3 py-1 rounded-full mb-4">
              {categoryLabels[product.category] || product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Author for books */}
            {isBook && product.author && (
              <p className="text-base text-gray-500 mb-4">
                von {product.author}
              </p>
            )}

            <p className="text-3xl font-bold text-[var(--color-primary)] mb-6">
              CHF {product.price.toFixed(2)}
            </p>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  product.inStock ? "text-green-700" : "text-red-500"
                }`}
              >
                {product.inStock ? "An Lager" : "Nicht verfügbar"}
              </span>
            </div>

            {/* Add to cart */}
            {product.inStock && (
              <div className="mb-8">
                <AddToCartButton sku={product.sku} />
              </div>
            )}

            {/* Description */}
            <div className="border-t border-gray-100 pt-6 mb-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Beschreibung
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Book details */}
            {isBook && (product.pages || product.isbn) && (
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                  Details
                </h2>
                <dl className="space-y-2 text-sm">
                  {product.pages && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <dt className="text-gray-500">Seiten:</dt>
                      <dd className="text-gray-900">{product.pages}</dd>
                    </div>
                  )}
                  {product.isbn && (
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <dt className="text-gray-500">ISBN:</dt>
                      <dd className="text-gray-900">{product.isbn}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
