"use client";

import Image from "next/image";
import Link from "next/link";
import { offerings } from "@/lib/offerings";

const categoryColors: Record<string, string> = {
  Familie: "bg-emerald-50 text-emerald-700",
  Paare: "bg-rose-50 text-rose-700",
  Kinder: "bg-amber-50 text-amber-700",
  Workshop: "bg-purple-50 text-purple-700",
  Seminar: "bg-blue-50 text-blue-700",
  Tour: "bg-teal-50 text-teal-700",
  Erfahrung: "bg-orange-50 text-orange-700",
  Service: "bg-gray-50 text-gray-700",
};

export default function AngebotePage() {
  return (
    <>
      <section className="bg-[var(--color-primary)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">Angebote</h1>
          <p className="text-white/80 max-w-2xl text-lg">
            Seminare, Camps, Events und Workshops für Familien, Paare,
            Kinder, Jugendliche und Einzelpersonen.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offerings.map((offering) => (
              <div
                key={offering.title}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={offering.image}
                    alt={offering.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[offering.category] || "bg-gray-50 text-gray-700"}`}
                    >
                      {offering.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {offering.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {offering.description}
                  </p>
                  <Link
                    href="/kontakt"
                    className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                  >
                    Anfragen
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
