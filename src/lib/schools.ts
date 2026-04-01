export interface School {
  slug: string;
  shortName: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  price?: string;
  duration?: string;
  accredited: boolean;
}

export const schools: School[] = [
  {
    slug: "dts",
    shortName: "DTS",
    title: "Juengerschaftsschule (Discipleship Training School)",
    description:
      "Die DTS bietet dir die Gelegenheit in einem internationalen Umfeld deine Beziehung zu Gott zu vertiefen, deine Berufung zu entdecken, deine Persoenlichkeit weiterzuentwickeln und gemeinsam mit anderen Missionserfahrungen zu sammeln.",
    startDate: "April 2026",
    duration: "5 Monate (12 Wochen Vorlesung + 8 Wochen Einsatz)",
    price: "CHF 7'700",
    accredited: true,
  },
  {
    slug: "sbcw",
    shortName: "SBCW",
    title: "Schule fuer Biblisch Christliche Weltanschauung",
    description:
      "Lerne eine biblische Perspektive auf alle Lebensbereiche zu entwickeln und in Gesellschaft und Kultur hineinzuwirken.",
    startDate: "September 2026",
    duration: "12 Wochen",
    price: "CHF 3'850",
    accredited: true,
  },
  {
    slug: "sbs",
    shortName: "SBS",
    title: "Schule fuer Bibelstudium",
    description:
      "Tauche tief ein in Gottes Wort mit induktivem Bibelstudium. Lerne die Bibel selbststaendig zu studieren und zu lehren.",
    startDate: "September 2026",
    duration: "9 Monate",
    price: "CHF 7'920",
    accredited: true,
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
