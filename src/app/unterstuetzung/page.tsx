import {
  Heart,
  CreditCard,
  Mail,
  Briefcase,
  Package,
  GraduationCap,
  Users,
  Monitor,
  Megaphone,
  Palette,
  Baby,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unterstuetzung | JMEM Wiler",
  description:
    "Unterstuetze die Arbeit von JMEM Wiler durch Gebet, Spenden oder Mitarbeit.",
};

const openPositions = [
  {
    title: "Schulen (DTS, SBCW, DBS, SMJ)",
    description: "Mitarbeit in der Leitung und Durchfuehrung unserer Schulen.",
    icon: GraduationCap,
  },
  {
    title: "Kinder-, Jugend- und Familienarbeit",
    description:
      "Begleitung und Foerderung von Kindern, Jugendlichen und Familien auf dem Campus.",
    icon: Baby,
  },
  {
    title: "IT-Support und Netzwerkpflege",
    description: "Technische Unterstuetzung und Wartung unserer IT-Infrastruktur.",
    icon: Monitor,
  },
  {
    title: "Kommunikation und Marketing",
    description:
      "Oeffentlichkeitsarbeit, Social Media und Kommunikation nach aussen.",
    icon: Megaphone,
  },
  {
    title: "Webdesign und Grafik",
    description: "Gestaltung von Webauftritten, Flyern und visuellen Materialien.",
    icon: Palette,
  },
];

export default function UnterstuetzungPage() {
  return (
    <>
      <section className="bg-[var(--color-primary)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Unterstuetzung</h1>
          <p className="text-white/80 max-w-2xl text-lg">
            JMEM Wiler wird getragen von der grosszuegigen Unterstuetzung von
            Freunden und Partnern. Jeder Beitrag macht einen Unterschied.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Three pillars */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <Heart className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gebet</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Bete fuer unsere Mitarbeiter, Studenten, Schulen und Einsaetze.
                Abonniere unseren Newsletter fuer aktuelle Gebetsanliegen.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <CreditCard className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Spenden</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Unterstuetze unsere Arbeit finanziell. Jeder Beitrag hilft uns,
                Menschen auszubilden und in die Welt zu senden.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <Mail className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mitarbeit</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Komm als Freiwillige/r oder Langzeitmitarbeiter/in zu uns. Wir
                suchen Menschen mit verschiedenen Gaben und Faehigkeiten.
              </p>
            </div>
          </div>

          {/* Donation categories */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Spendenzwecke
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Stipendienfonds
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Unterstuetze Studenten aus finanziell benachteiligten Laendern,
                  damit auch sie an unseren Schulen teilnehmen koennen. Dein
                  Beitrag ermoeglicht Menschen aus der ganzen Welt eine
                  Ausbildung bei JMEM Wiler.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Allgemeiner Betrieb JMEM Wiler
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Unterstuetze den allgemeinen Betrieb unseres Standorts in Wiler
                  bei Utzenstorf. Dein Beitrag hilft bei der Instandhaltung,
                  Verwaltung und dem taeglichen Betrieb der Gemeinschaft.
                </p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-[var(--color-warm)] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Bankverbindung fuer Spenden
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

          {/* Open Positions */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Offene Stellen
              </h2>
              <p className="text-sm text-gray-500">
                Voraussetzung: abgeschlossene DTS (Juengerschaftsschule)
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {openPositions.map((position) => {
                const Icon = position.icon;
                return (
                  <div
                    key={position.title}
                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
                  >
                    <Icon className="w-8 h-8 text-[var(--color-primary)] mb-3" />
                    <h3 className="font-bold text-gray-900 text-sm mb-1">
                      {position.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {position.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Material Support */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <Package className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Sachspenden
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Wir freuen uns ueber Spenden von Moebeln, Haushaltswaren und
                Verbrauchsmaterial. Nimm bitte vorher Kontakt mit uns auf, damit
                wir absprechen koennen, was aktuell benoetigt wird.
              </p>
              <a
                href="/kontakt"
                className="inline-flex bg-[var(--color-primary)] text-white font-medium px-6 py-3 rounded-full hover:bg-[var(--color-primary-light)] transition-colors text-sm"
              >
                Kontakt aufnehmen
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
