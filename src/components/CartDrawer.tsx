"use client";

import { useCart } from "@/lib/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setCartOpen,
    getProduct,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Warenkorb
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-sm">
                Dein Warenkorb ist leer.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
              >
                Weiter einkaufen
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const product = getProduct(item.productSku);
                if (!product) return null;
                return (
                  <div
                    key={item.productSku}
                    className="flex gap-3 bg-gray-50 rounded-xl p-3"
                  >
                    <div className="w-16 h-16 relative bg-white rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm font-bold text-[var(--color-primary)] mt-0.5">
                        CHF {(product.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productSku,
                              item.quantity - 1
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productSku,
                              item.quantity + 1
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.productSku)}
                          className="ml-auto w-6 h-6 flex items-center justify-center rounded text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Zwischensumme</span>
              <span className="text-lg font-bold text-gray-900">
                CHF {totalPrice.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full text-center bg-[var(--color-primary)] text-white font-medium py-3 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"
            >
              Zur Kasse
            </Link>
            <button
              onClick={clearCart}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              Warenkorb leeren
            </button>
          </div>
        )}
      </div>
    </>
  );
}
