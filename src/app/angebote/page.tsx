"use client";

import Image from "next/image";
import Link from "next/link";

const offerings = [
  // Familien & Paare
  { title: "Family Adventure Camp", description: "Eine Woche voller Spass und Qualitätszeit für die ganze Familie.", image: "/images/site/angebot-family-camp.jpg", category: "Familie" },
  { title: "Verliebte, Verlobte", description: "Programm für Dating- und verlobte Paare. 3,5 Tage intensive Zeit.", image: "/images/site/angebot-verlobte.jpg", category: "Paare" },
  { title: "Sofazeit? Ehezeit!", description: "Online-Impulse für die Ehe. Bequem von zu Hause aus.", image: "/images/site/angebot-sofa.jpg", category: "Paare" },
  { title: "Raus aus dem Sofa!", description: "Gemeinschaft und Inspiration für Ehepaare.", image: "/images/site/angebot-raus.jpg", category: "Paare" },
  { title: "Ehe-Coaching & Paargespräche", description: "Professionelles Coaching für Ehepaare.", image: "/images/site/angebot-coaching.jpg", category: "Paare" },
  { title: "Brunch 4 Two", description: "Brunch mit Input für Ehepaare.", image: "/images/site/angebot-brunch.jpg", category: "Paare" },
  { title: "Ehe-Wochenende", description: "Wochenend-Retreat für Ehepaare.", image: "/images/site/angebot-ehe-wochenende.jpg", category: "Paare" },
  // Kinder & Jugend
  { title: "Kids-Club", description: "Für Kinder vom Kindergarten bis zur 2. Klasse.", image: "/images/site/angebot-kids-club.jpg", category: "Kinder" },
  { title: "Eltern & Kids-Treff", description: "Gemeinsamer Treff für Eltern mit Kindern.", image: "/images/site/angebot-eltern-kids.jpg", category: "Kinder" },
  { title: "Von Anfang an...", description: "Programm für Kinder von 0-4 Jahren.", image: "/images/site/angebot-von-anfang.jpg", category: "Kinder" },
  { title: "Vater & Tochter", description: "Abenteuer-Wochenende für Väter und Töchter.", image: "/images/site/angebot-vater-tochter.jpg", category: "Familie" },
  { title: "Mutter & Sohn", description: "Wochenende für Mütter und Söhne.", image: "/images/site/angebot-mutter-sohn.jpg", category: "Familie" },
  { title: "Mutter & Tochter", description: "Wochenende für Mütter und Töchter.", image: "/images/site/angebot-mutter-tochter.jpg", category: "Familie" },
  { title: "Vater & Sohn", description: "Abenteuer-Wochenende für Väter und Söhne.", image: "/images/site/angebot-vater-sohn.jpg", category: "Familie" },
  // Kurse & Seminare
  { title: "Summer Dance Intensive", description: "Intensivkurs für Tänzer/innen. Technik, Kreativität und Anbetung.", image: "/images/site/angebot-dance.jpg", category: "Workshop" },
  { title: "Slum Survivor", description: "Erfahrungsprogramm: Armut und Ungerechtigkeit hautnah erleben.", image: "/images/site/angebot-slum.jpg", category: "Erfahrung" },
  { title: "Bibel-Seminare", description: "Vertiefende Seminare zu biblischen Themen.", image: "/images/site/angebot-bibel.jpg", category: "Seminar" },
  { title: "Reformations-Tour", description: "Historische Tour in Genf oder Bern auf den Spuren der Reformation.", image: "/images/site/angebot-reformation.jpg", category: "Tour" },
  { title: "Career Direct", description: "Professionelle Berufungsberatung mit wissenschaftlichem Assessment.", image: "/images/site/angebot-career.jpg", category: "Workshop" },
  { title: "Referate", description: "Besuche in Gemeinden und Jugendgruppen. Wir kommen zu euch!", image: "/images/site/angebot-referate.jpg", category: "Service" },
];

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
