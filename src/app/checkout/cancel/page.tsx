"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <XCircle className="w-20 h-20 text-red-400 mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Zahlung abgebrochen
      </h1>
      <p className="text-gray-500 max-w-md mb-8">
        Die Zahlung wurde abgebrochen. Dein Warenkorb bleibt erhalten - du
        kannst es jederzeit erneut versuchen.
      </p>
      <div className="flex gap-4">
        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white font-medium px-6 py-3 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"
        >
          Zurück zum Warenkorb
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Weiter einkaufen
        </Link>
      </div>
    </div>
  );
}
