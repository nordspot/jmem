"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  // Clear cart on mount (in case redirected from Payrexx)
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Get order ID from URL params
  const orderId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("order")
      : null;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Vielen Dank für deine Bestellung!
      </h1>
      <p className="text-gray-500 max-w-md mb-2">
        Deine Bestellung wurde erfolgreich aufgenommen. Du erhältst eine
        Bestätigung per E-Mail.
      </p>
      {orderId && (
        <p className="text-sm text-gray-400 mb-8">
          Bestellnummer:{" "}
          <span className="font-mono font-medium text-gray-600">
            {orderId}
          </span>
        </p>
      )}
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white font-medium px-6 py-3 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}
