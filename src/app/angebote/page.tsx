import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Angebote | JMEM Wiler",
  description: "Seminare, Camps, Events und Workshops bei JMEM Wiler.",
};

const offerings = [
  { title: "Brunch4Two", description: "Ein besonderer Brunch fuer Paare mit Input zu Beziehungsthemen.", category: "Event", date: "Diverse Termine" },
  { title: "Family Days", description: "Familientage mit Programm fuer Gross und Klein. Gemeinschaft, Spiel und geistliche Impulse.", category: "Camp", date: "Sommerferien" },
  { title: "Summer Dance Intensive", description: "Intensivkurs fuer Taenzer/innen. Technik, Kreativitaet und Anbetung durch Tanz.", category: "Workshop", date: "Juli" },
  { title: "we FOUNDation", description: "Grundlagenkurs fuer junge Erwachsene. Entdecke deine Identitaet und Berufung.", category: "Kurs", date: "Auf Anfrage" },
  { title: "Sofazeit / Ehezeit", description: "Wochenende fuer Ehepaare. Zeit fuer einander in entspannter Atmosphaere.", category: "Seminar", date: "Diverse Termine" },
  { title: "Mental Load Seminar", description: "Seminar zum Thema mentale Belastung in Ehe und Familie.", category: "Seminar", date: "Auf Anfrage" },
  { title: "Esthers Process", description: "Seminar speziell fuer Frauen. Entdecke deine Berufung und Staerke.", category: "Seminar", date: "Auf Anfrage" },
  { title: "The Story", description: "Entdecke die grosse Geschichte der Bibel von Anfang bis Ende.", category: "Kurs", date: "Auf Anfrage" },
  { title: "Career Direct", description: "Professionelle Berufungsberatung mit wissenschaftlichem Assessment.", category: "Workshop", date: "Auf Anfrage" },
  { title: "Reformations-Tour", description: "Historische Tour auf den Spuren der Reformation in der Schweiz.", category: "Event", date: "Auf Anfrage" },
];

const categoryColors: Record<string, string> = {
  Event: "bg-blue-50 text-blue-700",
  Camp: "bg-green-50 text-green-700",
  Workshop: "bg-purple-50 text-purple-700",
  Kurs: "bg-amber-50 text-amber-700",
  Seminar: "bg-rose-50 text-rose-700",
};

export default function AngebotePage() {
  return (
    <>
      <section className="bg-[var(--color-primary)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Angebote</h1>
          <p className="text-white/80 max-w-2xl text-lg">
            Seminare, Camps, Events und Workshops fuer Familien, Paare,
            Jugendliche und Einzelpersonen.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {offerings.map((offering) => (
              <div
                key={offering.title}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    {offering.title}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-3 ${categoryColors[offering.category] || "bg-gray-50 text-gray-700"}`}
                  >
                    {offering.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {offering.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {offering.date}
                  </span>
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
