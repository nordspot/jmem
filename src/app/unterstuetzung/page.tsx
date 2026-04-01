import { Heart, CreditCard, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unterstützung | JMEM Wiler",
  description: "Unterstütze die Arbeit von JMEM Wiler durch Gebet, Spenden oder Mitarbeit.",
};

export default function UnterstuetzungPage() {
  return (
    <>
      <section className="bg-[var(--color-primary)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Unterstützung</h1>
          <p className="text-white/80 max-w-2xl text-lg">
            JMEM Wiler wird getragen von der grosszügigen Unterstützung von
            Freunden und Partnern. Jeder Beitrag macht einen Unterschied.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <Heart className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gebet</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Bete für unsere Mitarbeiter, Studenten, Schulen und Einsätze.
                Abonniere unseren Newsletter für aktuelle Gebetsanliegen.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <CreditCard className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Spenden</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Unterstütze unsere Arbeit finanziell. Jeder Beitrag hilft uns,
                Menschen auszubilden und in die Welt zu senden.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <Mail className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mitarbeit</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Komm als Freiwillige/r oder Langzeitmitarbeiter/in zu uns.
                Wir suchen Menschen mit verschiedenen Gaben und Fähigkeiten.
              </p>
            </div>
          </div>

          {/* Bank Details */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-[var(--color-warm)] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Bankverbindung für Spenden
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-900">Bank</span>
                  <span>PostFinance AG, 3030 Bern</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-900">IBAN</span>
                  <span className="font-mono">CH90 0900 0000 2501 5842 2</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-900">BIC/SWIFT</span>
                  <span className="font-mono">POFICHBEXXX</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-900">Kontoinhaber</span>
                  <span className="text-right">
                    Jugend mit einer Mission
                    <br />
                    Hauptstrasse 15, 3266 Wiler
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
