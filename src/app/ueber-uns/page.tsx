import Image from "next/image";
import { Users, Globe, BookOpen, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns | JMEM Wiler",
  description: "Jugend mit einer Mission (YWAM) Wiler bei Seedorf - ein überkonfessionelles, internationales Missionswerk.",
};

export default function UeberUnsPage() {
  return (
    <>
      <section className="bg-[var(--color-primary)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Über uns</h1>
          <p className="text-white/80 max-w-2xl text-lg">
            Jugend mit einer Mission (JMEM / YWAM) Wiler bei Seedorf - seit
            1981 im Dienst von Gottes Reich.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                JMEM Wiler
              </h2>
              <div className="prose text-gray-600 leading-relaxed space-y-4">
                <p>
                  JMEM Wiler ist ein Standort von Jugend mit einer Mission
                  (engl. Youth With A Mission, YWAM) in der Schweiz. Wir sind
                  ein überkonfessionelles, internationales Missionswerk mit
                  dem Ziel, Gott bekannt zu machen.
                </p>
                <p>
                  Unser Zentrum befindet sich in Wiler bei Seedorf, am Fuss
                  des Juras im Berner Seeland. Hier leben und arbeiten rund
                  35 internationale Mitarbeiter aus verschiedenen Ländern
                  gemeinsam.
                </p>
                <p>
                  Wir bieten akkreditierte Schulen der University of the
                  Nations (UofN), Seminare, Camps und Einsätze an. Unser
                  Herz schlägt für Training, Gemeinschaft und Mission.
                </p>
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image
                src="/images/site/angebote.jpg"
                alt="JMEM Wiler Team"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Teams */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Unsere Teams
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Generations",
                  description:
                    "Dienst an Familien, Kindern und über Generationen hinweg.",
                  icon: Users,
                },
                {
                  name: "Jüngerschaft",
                  description:
                    "Training und Begleitung junger Menschen auf ihrem Weg mit Gott.",
                  icon: BookOpen,
                },
                {
                  name: "Bibel & Gesellschaft",
                  description:
                    "Biblische Weltanschauung und gesellschaftliches Engagement.",
                  icon: Globe,
                },
                {
                  name: "Supportteam",
                  description:
                    "Verwaltung, Finanzen, Technik und Gastronomie für den laufenden Betrieb.",
                  icon: MapPin,
                },
              ].map((team) => (
                <div
                  key={team.name}
                  className="bg-white rounded-2xl border border-gray-100 p-6"
                >
                  <team.icon className="w-10 h-10 text-[var(--color-primary)] mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {team.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {team.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* JMEM Worldwide */}
          <div id="weltweit" className="bg-[var(--color-warm)] rounded-2xl p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              JMEM weltweit
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-3xl">
              JMEM (Youth With A Mission) wurde 1960 von Loren Cunningham
              gegründet und ist heute mit über 18&apos;000 Vollzeitmitarbeitern
              in mehr als 180 Ländern aktiv. Die drei Säulen von JMEM sind
              Training, Barmherzigkeit und Evangelisation.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)]">
                  180+
                </p>
                <p className="text-sm text-gray-500 mt-1">Länder</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)]">
                  18&apos;000+
                </p>
                <p className="text-sm text-gray-500 mt-1">Mitarbeiter weltweit</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)]">
                  1960
                </p>
                <p className="text-sm text-gray-500 mt-1">Gegründet</p>
              </div>
            </div>
          </div>

          {/* Zentrum */}
          <div id="zentrum" className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Zentrum & Umgebung
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              Unser Zentrum liegt idyllisch im Berner Seeland, eingebettet
              zwischen dem Jura und den Alpen. Die ruhige Lage bietet ideale
              Bedingungen für Studium, Gebet und Gemeinschaft. In der Nähe
              befinden sich der Bielersee und verschiedene Wander- und
              Velowege.
            </p>
          </div>

          {/* Gaeste */}
          <div id="gaeste" className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gäste</h2>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-3xl">
              Wir freuen uns, Gäste bei uns willkommen zu heissen. Unser
              Gästezimmer steht Einzelpersonen und Gruppen zur Verfügung.
            </p>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Preise</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Übernachtung</span>
                  <span className="font-semibold">CHF 30 / Nacht</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mahlzeiten</span>
                  <span className="font-semibold">CHF 21 / Tag</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
