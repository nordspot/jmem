import { HeroSection } from "@/components/HeroSection";
import { SectionCard } from "@/components/SectionCard";
import { SchoolCard } from "@/components/SchoolCard";
import { schools } from "@/lib/schools";
import Link from "next/link";
import { ArrowRight, Heart, Users, Globe, BookOpen } from "lucide-react";

const sections = [
  {
    title: "Juengerschaftsschule DTS",
    description:
      "Gott besser kennenlernen und ihn bekannt machen. Die DTS ist dein Start bei JMEM.",
    image: "/images/site/hero-dts.jpg",
    href: "/schulen/dts",
  },
  {
    title: "Seminare & Events",
    description:
      "Brunch4Two, Family Days, Summer Dance Intensive und viele weitere Angebote.",
    image: "/images/site/angebote.jpg",
    href: "/angebote",
  },
  {
    title: "Einsaetze",
    description:
      "Komm mit uns auf Einsatz. Erlebe Mission hautnah in verschiedenen Laendern.",
    image: "/images/site/einsaetze.jpg",
    href: "/einsaetze",
  },
  {
    title: "Schulen & Kurse",
    description:
      "Lass dich ausbilden. 10 verschiedene Schulen mit UofN-Akkreditierung.",
    image: "/images/site/schulen.jpg",
    href: "/schulen",
  },
];

const stats = [
  { icon: Users, value: "35+", label: "Internationale Mitarbeiter" },
  { icon: Globe, value: "10", label: "Akkreditierte Schulen" },
  { icon: BookOpen, value: "20+", label: "Angebote & Seminare" },
  { icon: Heart, value: "1981", label: "Seit" },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-8 h-8 text-[var(--color-accent)] mx-auto mb-3" />
                <p className="text-3xl font-bold text-[var(--color-primary)]">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-20 bg-[var(--color-warm)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Entdecke JMEM Wiler
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Training, Gemeinschaft und Mission - bei uns findest du vielfaeltige
              Moeglichkeiten, Gott zu erleben und die Welt zu veraendern.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sections.map((section, i) => (
              <SectionCard key={section.title} {...section} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Schools Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Unsere Schulen
              </h2>
              <p className="text-gray-600 max-w-xl">
                10 akkreditierte Schulen der University of the Nations.
                Vollzeit und berufsbegleitend.
              </p>
            </div>
            <Link
              href="/schulen"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:gap-3 transition-all"
            >
              Alle Schulen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.slice(0, 6).map((school, i) => (
              <SchoolCard
                key={school.slug}
                {...school}
                href={`/schulen/${school.slug}`}
                index={i}
              />
            ))}
          </div>
          <div className="sm:hidden text-center mt-8">
            <Link
              href="/schulen"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"
            >
              Alle Schulen ansehen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--color-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bereit fuer dein Abenteuer?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Ob Juengerschaftsschule, Kurzeinsatz oder Seminar - bei JMEM Wiler
            findest du deinen Platz. Nimm Kontakt mit uns auf!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/kontakt"
              className="bg-[var(--color-accent)] text-[var(--color-primary-dark)] font-semibold px-8 py-3.5 rounded-full hover:bg-[var(--color-accent-light)] transition-colors text-sm"
            >
              Kontakt aufnehmen
            </Link>
            <Link
              href="/shop"
              className="bg-white/10 backdrop-blur text-white font-medium px-8 py-3.5 rounded-full border border-white/20 hover:bg-white/20 transition-colors text-sm"
            >
              Shop besuchen
            </Link>
          </div>
        </div>
      </section>

      {/* Guest Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Zu Gast bei uns
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Unser Zentrum in Wiler bei Seedorf bietet Gaestezimmer fuer
                Einzelpersonen und Gruppen. Geniesse die ruhige Umgebung am
                Fuss des Juras und die Gemeinschaft mit unserem internationalen
                Team.
              </p>
              <div className="bg-[var(--color-warm)] rounded-xl p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Uebernachtung</span>
                  <span className="text-sm font-semibold">CHF 30 / Nacht</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mahlzeiten</span>
                  <span className="text-sm font-semibold">CHF 21 / Tag</span>
                </div>
              </div>
            </div>
            <div className="bg-[var(--color-warm)] rounded-2xl p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Anreise</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                <strong>Adresse:</strong> Hauptstrasse 15, 3266 Wiler bei Seedorf
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                <strong>oeV:</strong> Zug nach Seedorf oder Aarberg, dann Bus
                Linie 74 bis Wiler bei Seedorf.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>Auto:</strong> A1 Ausfahrt Kerzers, Richtung Aarberg,
                dann Seedorf/Wiler.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
