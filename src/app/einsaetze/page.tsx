import Link from "next/link";
import { Globe, Users, Calendar, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Einsaetze | JMEM Wiler",
  description: "Kurzeinsaetze und Missionseinsaetze mit JMEM Wiler weltweit.",
};

export default function EinsaetzePage() {
  return (
    <>
      <section className="bg-[var(--color-primary)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Einsaetze</h1>
          <p className="text-white/80 max-w-2xl text-lg">
            Komm mit uns auf Einsatz! Erlebe Mission hautnah und diene
            Menschen in verschiedenen Laendern und Kulturen.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Mission erleben
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Bei JMEM Wiler hast du die Moeglichkeit, an verschiedenen
                Einsaetzen teilzunehmen. Ob Kurzeinsatz ueber wenige Wochen
                oder laengerfristiger Dienst - wir finden den passenden
                Einsatz fuer dich.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Die Einsaetze sind Teil unserer Schulen (z.B. DTS) oder werden
                als separate Kurzeinsaetze angeboten. Du kannst in
                verschiedenen Bereichen dienen: Evangelisation, soziale Arbeit,
                Kinderprogramme, Bau und vieles mehr.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[var(--color-warm)] rounded-xl p-5 text-center">
                  <Globe className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Weltweit</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Einsaetze auf allen Kontinenten
                  </p>
                </div>
                <div className="bg-[var(--color-warm)] rounded-xl p-5 text-center">
                  <Users className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Im Team</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Gemeinsam mit anderen
                  </p>
                </div>
                <div className="bg-[var(--color-warm)] rounded-xl p-5 text-center">
                  <Calendar className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Flexibel</p>
                  <p className="text-xs text-gray-500 mt-1">
                    2 Wochen bis mehrere Monate
                  </p>
                </div>
              </div>

              <Link
                href="/kontakt"
                className="inline-flex bg-[var(--color-primary)] text-white font-medium px-6 py-3 rounded-full hover:bg-[var(--color-primary-light)] transition-colors text-sm"
              >
                Mehr erfahren
              </Link>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  DTS-Einsatz
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Im Rahmen der Juengerschaftsschule (DTS) geht jedes Team auf
                  einen 8-woechigen Einsatz. Bisherige Einsatzlaender umfassen
                  Regionen in Europa, Asien und Afrika.
                </p>
                <Link
                  href="/schulen/dts"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"
                >
                  Zur DTS <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Kurzeinsaetze
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Kurzeinsaetze von 2 bis 6 Wochen fuer Einzelpersonen und
                  Gruppen. Ideal fuer einen ersten Einblick in die
                  Missionsarbeit.
                </p>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"
                >
                  Anfragen <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
