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
    title: "Juengerschaftsschule (Discipleship Training School)",
    description:
      "Die DTS bietet dir die Gelegenheit in einem internationalen Umfeld deine Beziehung zu Gott zu vertiefen, deine Berufung zu entdecken, deine Persoenlichkeit weiterzuentwickeln und gemeinsam mit anderen Missionserfahrungen zu sammeln.",
    descriptionLong:
      "Die Juengerschaftsschule (DTS) ist die Grundausbildung bei JMEM und Voraussetzung fuer alle weiteren Schulen und Programme. In einem internationalen Umfeld vertiefst du deine Beziehung zu Gott, entdeckst deine Berufung und sammelst praktische Missionserfahrungen. Die erste Haelfte besteht aus Vorlesungen mit verschiedenen Referenten, die zweite Haelfte aus einem Missionseinsatz in einem anderen Land.",
    startDate: "April 2026",
    duration: "5 Monate (12 Wochen Vorlesung + 8 Wochen Einsatz)",
    price: "CHF 7'700",
    accredited: true,
    variants: [
      {
        name: "Original DTS",
        subtitle: "Gott kennen und ihn bekannt machen",
        description:
          "Die klassische Juengerschaftsschule: Gott kennen und ihn bekannt machen. Fuer alle ab 18 Jahren, die bereit sind, ihr Leben Gott ganz zur Verfuegung zu stellen.",
      },
      {
        name: "Gerechtigkeits-DTS",
        subtitle: "Gottes Herz fuer die Verletzlichen",
        description:
          "Eine DTS mit besonderem Fokus auf Gerechtigkeit fuer die Verletzlichen und Benachteiligten. Du lernst Gottes Herz fuer die Armen kennen und wie du konkret fuer Veraenderung eintreten kannst.",
      },
      {
        name: "Couples DTS",
        subtitle: "Gemeinsam als Ehepaar wachsen",
        description:
          "Eine DTS speziell fuer verheiratete Paare. Wachst gemeinsam in eurer Beziehung zu Gott und zueinander, und entdeckt eure gemeinsame Berufung.",
      },
      {
        name: "DTS 50plus",
        subtitle: "Bereit durchzustarten",
        description:
          "Du bist ueber 50 und bereit fuer einen Neustart? Diese DTS ist fuer Menschen in der zweiten Lebenshaelfte, die ihre Erfahrung und Reife einsetzen moechten, um die Welt zu veraendern.",
      },
    ],
  },
  {
    slug: "sbcw",
    shortName: "SBCW",
    title: "Schule fuer Biblisch Christliche Weltanschauung",
    description:
      "Die gute Nachricht von Jesus Christus betrifft weit mehr als persoenliche Rettung und ist relevant in allen Bereichen der Gesellschaft. Die SBCW erforscht die 7 Einflussbereiche: Familie, Kirche, Staat, Bildung, Wirtschaft, Medien, Wissenschaft und Kunst.",
    descriptionLong:
      "Die SBCW hilft dir, eine biblische Perspektive auf alle Lebensbereiche zu entwickeln und in Gesellschaft und Kultur hineinzuwirken. Du erforschst die 7 Einflussbereiche der Gesellschaft und lernst, wie das Evangelium in jedem dieser Bereiche relevant ist. Neben dem Unterricht besuchst du verschiedene Organisationen und Projekte vor Ort, die in diesen Bereichen taetig sind.",
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
    title: "Schule fuer Bibelstudium",
    description:
      "Eine spannende Reise durch alle 66 Buecher der Bibel. 9-monatiges Programm in 3 Quartalen. Du lernst die induktive Studienmethode: Beobachtung, Interpretation, Anwendung.",
    descriptionLong:
      "Die Schule fuer Bibelstudium (SBS) fuehrt dich in 9 Monaten durch alle 66 Buecher der Bibel. Du lernst die induktive Studienmethode mit den drei Schritten Beobachtung, Interpretation und Anwendung. Das Programm ist in 3 Quartale unterteilt, jeweils gefolgt von praktischen Einsaetzen. Die SBS ist eine intensive, aber lohnende Erfahrung, die dein Bibelverstaendnis grundlegend vertiefen wird.",
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
      "Rumaenien",
      "Bulgarien",
      "Ungarn",
      "Aethiopien",
      "Madagaskar",
      "Mexiko",
      "Malawi",
      "Himalaya",
    ],
  },
  {
    slug: "dbs",
    shortName: "DBS",
    title: "Juengerschafts-Bibelschule",
    description:
      "Gemeinsam die ganze Bibel entdecken! In dieser Schule lernst du die biblischen Zusammenhaenge besser verstehen.",
    startDate: "April 2026",
    duration: "12 Wochen",
    price: "CHF 3'960",
    accredited: true,
  },
  {
    slug: "svs",
    shortName: "SVS",
    title: "School of Visual Storytelling",
    description:
      "Lerne, wie du mit visuellen Medien Geschichten erzaehlen und damit Menschen fuer Gottes Reich begeistern kannst.",
    duration: "12 Wochen",
    accredited: true,
  },
  {
    slug: "smj",
    shortName: "SMJ",
    title: "School of Missional Justice",
    description:
      "Entdecke Gottes Herz fuer Gerechtigkeit und lerne, wie du in deinem Umfeld fuer Veraenderung eintreten kannst.",
    duration: "12 Wochen",
    price: "CHF 3'850",
    accredited: true,
  },
  {
    slug: "blp",
    shortName: "BLP",
    title: "Ausbildungskurs fuer Leiter (Bible & Leadership Program)",
    description:
      "Ein intensiver Kurs fuer angehende und bestehende Leiter, der biblische Grundlagen mit praktischer Leiterschaftsentwicklung verbindet.",
    duration: "12 Wochen",
    accredited: true,
  },
  {
    slug: "wlc",
    shortName: "WLC",
    title: "Weltanschauungs-Leiterschaftskurs",
    description:
      "Vertiefe dein Verstaendnis christlicher Weltanschauung und entwickle deine Leiterschaftsfaehigkeiten weiter.",
    duration: "6 Monate",
    price: "CHF 3'300",
    accredited: true,
  },
  {
    slug: "b-sbs",
    shortName: "B-SBS",
    title: "Berufsbegleitende Schule fuer Bibelstudium",
    description:
      "Studiere die Bibel intensiv neben deinem Beruf. Modularer Aufbau mit flexiblen Terminen.",
    price: "CHF 450 / Modul",
    accredited: true,
  },
  {
    slug: "uofn",
    shortName: "UofN",
    title: "University of the Nations",
    description:
      "JMEM Wiler ist Teil der University of the Nations mit 15 Fakultaeten weltweit. Akkreditierte Kurse mit internationaler Anerkennung.",
    accredited: true,
  },
];
