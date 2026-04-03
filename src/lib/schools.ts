export interface SchoolVariant {
  name: string;
  subtitle?: string;
  description: string;
}

export interface School {
  slug: string;
  shortName: string;
  title: string;
  description: string;
  descriptionLong?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  price?: string;
  duration?: string;
  language?: string;
  credits?: string;
  accredited: boolean;
  variants?: SchoolVariant[];
  curriculum?: string[];
  outreachDestinations?: string[];
  quarterStructure?: string[];
}

export const schools: School[] = [
  {
    slug: "dts",
    shortName: "DTS",
    title: "Jüngerschaftsschule (Discipleship Training School)",
    image: "/images/site/sbcw-classroom.jpg",
    description:
      "Die DTS bietet dir die Gelegenheit in einem internationalen Umfeld deine Beziehung zu Gott zu vertiefen, deine Berufung zu entdecken, deine Persönlichkeit weiterzuentwickeln und gemeinsam mit anderen Missionserfahrungen zu sammeln.",
    descriptionLong:
      "Die Jüngerschaftsschule (DTS) ist die Grundausbildung bei JMEM und Voraussetzung für alle weiteren Schulen und Programme. In einem internationalen Umfeld vertiefst du deine Beziehung zu Gott, entdeckst deine Berufung und sammelst praktische Missionserfahrungen. Die erste Hälfte besteht aus Vorlesungen mit verschiedenen Referenten, die zweite Hälfte aus einem Missionseinsatz in einem anderen Land.",
    startDate: "April 2026",
    duration: "5 Monate (12 Wochen Vorlesung + 8 Wochen Einsatz)",
    price: "CHF 7'700",
    accredited: true,
    variants: [
      {
        name: "Original DTS",
        subtitle: "Gott kennen und ihn bekannt machen",
        description:
          "Die klassische Jüngerschaftsschule: Gott kennen und ihn bekannt machen. Für alle ab 18 Jahren, die bereit sind, ihr Leben Gott ganz zur Verfügung zu stellen.",
      },
      {
        name: "Gerechtigkeits-DTS",
        subtitle: "Gottes Herz für die Verletzlichen",
        description:
          "Eine DTS mit besonderem Fokus auf Gerechtigkeit für die Verletzlichen und Benachteiligten. Du lernst Gottes Herz für die Armen kennen und wie du konkret für Veränderung eintreten kannst.",
      },
      {
        name: "Couples DTS",
        subtitle: "Gemeinsam als Ehepaar wachsen",
        description:
          "Eine DTS speziell für verheiratete Paare. Wachst gemeinsam in eurer Beziehung zu Gott und zueinander, und entdeckt eure gemeinsame Berufung.",
      },
      {
        name: "DTS 50plus",
        subtitle: "Bereit durchzustarten",
        description:
          "Du bist über 50 und bereit für einen Neustart? Diese DTS ist für Menschen in der zweiten Lebenshälfte, die ihre Erfahrung und Reife einsetzen möchten, um die Welt zu verändern.",
      },
    ],
  },
  {
    slug: "sbcw",
    shortName: "SBCW",
    title: "Schule für Biblisch Christliche Weltanschauung",
    image: "/images/site/about-group.jpg",
    description:
      "Die gute Nachricht von Jesus Christus betrifft weit mehr als persönliche Rettung und ist relevant in allen Bereichen der Gesellschaft. Die SBCW erforscht die 7 Einflussbereiche: Familie, Kirche, Staat, Bildung, Wirtschaft, Medien, Wissenschaft und Kunst.",
    descriptionLong:
      "Die SBCW hilft dir, eine biblische Perspektive auf alle Lebensbereiche zu entwickeln und in Gesellschaft und Kultur hineinzuwirken. Du erforschst die 7 Einflussbereiche der Gesellschaft und lernst, wie das Evangelium in jedem dieser Bereiche relevant ist. Neben dem Unterricht besuchst du verschiedene Organisationen und Projekte vor Ort, die in diesen Bereichen tätig sind.",
    startDate: "September 2026",
    duration: "12 Wochen",
    price: "CHF 3'300",
    language: "Englisch",
    credits: "UofN HMT/SCI 213 (12 Credits)",
    accredited: true,
    curriculum: [
      "Familie",
      "Kirche",
      "Staat / Regierung",
      "Bildung",
      "Wirtschaft",
      "Medien",
      "Wissenschaft und Kunst",
    ],
  },
  {
    slug: "sbs",
    shortName: "SBS",
    title: "Schule für Bibelstudium",
    image: "/images/site/sbs-group.jpg",
    description:
      "Eine spannende Reise durch alle 66 Bücher der Bibel. 9-monatiges Programm in 3 Quartalen. Du lernst die induktive Studienmethode: Beobachtung, Interpretation, Anwendung.",
    descriptionLong:
      "Die Schule für Bibelstudium (SBS) führt dich in 9 Monaten durch alle 66 Bücher der Bibel. Du lernst die induktive Studienmethode mit den drei Schritten Beobachtung, Interpretation und Anwendung. Das Programm ist in 3 Quartale unterteilt, jeweils gefolgt von praktischen Einsätzen. Die SBS ist eine intensive, aber lohnende Erfahrung, die dein Bibelverständnis grundlegend vertiefen wird.",
    startDate: "September 2026",
    duration: "9 Monate (3 Quartale)",
    price: "CHF 7'920",
    accredited: true,
    quarterStructure: [
      "1. Quartal: Altes Testament (Teil 1)",
      "2. Quartal: Altes Testament (Teil 2) & Evangelien",
      "3. Quartal: Apostelgeschichte, Briefe & Offenbarung",
    ],
    outreachDestinations: [
      "Rumänien",
      "Bulgarien",
      "Ungarn",
      "Äthiopien",
      "Madagaskar",
      "Mexiko",
      "Malawi",
      "Himalaya",
    ],
  },
  {
    slug: "dbs",
    shortName: "DBS",
    title: "Jüngerschafts-Bibelschule",
    image: "/images/site/dbs-fondue.jpg",
    description:
      "Gemeinsam die ganze Bibel entdecken! In dieser Schule lernst du die biblischen Zusammenhänge besser verstehen.",
    startDate: "April 2026",
    duration: "12 Wochen",
    price: "CHF 3'960",
    accredited: true,
  },
  {
    slug: "svs",
    shortName: "SVS",
    title: "School of Visual Storytelling",
    image: "/images/site/svs-visual.jpg",
    description:
      "Lerne, wie du mit visuellen Medien Geschichten erzählen und damit Menschen für Gottes Reich begeistern kannst.",
    duration: "12 Wochen",
    accredited: true,
  },
  {
    slug: "smj",
    shortName: "SMJ",
    title: "School of Missional Justice",
    image: "/images/site/einsatz-1.jpg",
    description:
      "Entdecke Gottes Herz für Gerechtigkeit und lerne, wie du in deinem Umfeld für Veränderung eintreten kannst.",
    duration: "12 Wochen",
    price: "CHF 3'850",
    accredited: true,
  },
  {
    slug: "blp",
    shortName: "BLP",
    title: "Ausbildungskurs für Leiter (Bible & Leadership Program)",
    image: "/images/site/blp-leadership.jpg",
    description:
      "Ein intensiver Kurs für angehende und bestehende Leiter, der biblische Grundlagen mit praktischer Leiterschaftsentwicklung verbindet.",
    duration: "12 Wochen",
    accredited: true,
  },
  {
    slug: "wlc",
    shortName: "WLC",
    title: "Weltanschauungs-Leiterschaftskurs",
    image: "/images/site/sbcw-4.jpg",
    description:
      "Vertiefe dein Verständnis christlicher Weltanschauung und entwickle deine Leiterschaftsfähigkeiten weiter.",
    duration: "6 Monate",
    price: "CHF 3'300",
    accredited: true,
  },
  {
    slug: "b-sbs",
    shortName: "B-SBS",
    title: "Berufsbegleitende Schule für Bibelstudium",
    image: "/images/site/bsbs-parttime.jpg",
    description:
      "Studiere die Bibel intensiv neben deinem Beruf. Modularer Aufbau mit flexiblen Terminen.",
    price: "CHF 450 / Modul",
    accredited: true,
  },
  {
    slug: "uofn",
    shortName: "UofN",
    title: "University of the Nations",
    image: "/images/site/sbcw-3.jpg",
    description:
      "JMEM Wiler ist Teil der University of the Nations mit 15 Fakultäten weltweit. Akkreditierte Kurse mit internationaler Anerkennung.",
    accredited: true,
  },
];
