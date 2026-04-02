export interface Offering {
  title: string;
  description: string;
  image: string;
  category: string;
}

export const offerings: Offering[] = [
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
