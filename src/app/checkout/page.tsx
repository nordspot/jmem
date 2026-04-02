"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { items, getProduct, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    zip: "",
    city: "",
    country: "CH",
    phone: "",
    notes: "",
  });

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cartItems = items.map((item) => {
        const product = getProduct(item.productSku);
        return {
          sku: item.productSku,
          name: product?.name || "",
          price: product?.price || 0,
          quantity: item.quantity,
        };
      });

      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          customer: form,
          totalAmount: totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Fehler beim Erstellen der Bestellung.");
        setLoading(false);
        return;
      }

      // Redirect to Payrexx payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        // Fallback: go to success page directly (for testing without Payrexx)
        clearCart();
        window.location.href = `/checkout/success?order=${data.orderId}`;
      }
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dein Warenkorb ist leer
        </h1>
        <p className="text-gray-500 mb-6">
          Füge Produkte hinzu, bevor du zur Kasse gehst.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white font-medium px-6 py-3 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zum Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="bg-[var(--color-primary)] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Kasse</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Order Summary */}
            <div className="md:col-span-2 order-2 md:order-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Bestellübersicht
                </h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => {
                    const product = getProduct(item.productSku);
                    if (!product) return null;
                    return (
                      <div
                        key={item.productSku}
                        className="flex gap-3 items-start"
                      >
                        <div className="w-12 h-12 relative bg-white rounded-lg overflow-hidden shrink-0">
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
                          <p className="text-xs text-gray-500">
                            {item.quantity} x CHF {product.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 shrink-0">
                          CHF {(product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="text-xl font-bold text-[var(--color-primary)]">
                      CHF {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="md:col-span-3 order-1 md:order-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Rechnungs- & Lieferadresse
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-Mail *
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse *
                      </label>
                      <input
                        required
                        type="text"
                        value={form.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PLZ *
                      </label>
                      <input
                        required
                        type="text"
                        value={form.zip}
                        onChange={(e) => updateField("zip", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ort *
                      </label>
                      <input
                        required
                        type="text"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Land
                      </label>
                      <select
                        value={form.country}
                        onChange={(e) => updateField("country", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                      >
                        <option value="CH">Schweiz</option>
                        <option value="DE">Deutschland</option>
                        <option value="AT">Österreich</option>
                        <option value="LI">Liechtenstein</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bemerkungen
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => updateField("notes", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                        placeholder="Optionale Bemerkungen zur Bestellung..."
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white font-medium py-3.5 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Bestellung wird verarbeitet...
                    </>
                  ) : (
                    <>Jetzt bezahlen - CHF {totalPrice.toFixed(2)}</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
