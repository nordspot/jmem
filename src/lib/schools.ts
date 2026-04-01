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
    title: "Jüngerschaftsschule (Discipleship Training School)",
    description:
      "Die DTS bietet dir die Gelegenheit in einem internationalen Umfeld deine Beziehung zu Gott zu vertiefen, deine Berufung zu entdecken, deine Persönlichkeit weiterzuentwickeln und gemeinsam mit anderen Missionserfahrungen zu sammeln.",
    startDate: "April 2026",
    duration: "5 Monate (12 Wochen Vorlesung + 8 Wochen Einsatz)",
    price: "CHF 7'700",
    accredited: true,
  },
  {
    slug: "sbcw",
    shortName: "SBCW",
    title: "Schule für Biblisch Christliche Weltanschauung",
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
    title: "Schule für Bibelstudium",
    description:
      "Tauche tief ein in Gottes Wort mit induktivem Bibelstudium. Lerne die Bibel selbständig zu studieren und zu lehren.",
    startDate: "September 2026",
    duration: "9 Monate",
    price: "CHF 7'920",
    accredited: true,
  },
  {
    slug: "dbs",
    shortName: "DBS",
    title: "Jüngerschafts-Bibelschule",
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
    description:
      "Lerne, wie du mit visuellen Medien Geschichten erzählen und damit Menschen für Gottes Reich begeistern kannst.",
    duration: "12 Wochen",
    accredited: true,
  },
  {
    slug: "smj",
    shortName: "SMJ",
    title: "School of Missional Justice",
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
    description:
      "Ein intensiver Kurs für angehende und bestehende Leiter, der biblische Grundlagen mit praktischer Leiterschaftsentwicklung verbindet.",
    duration: "12 Wochen",
    accredited: true,
  },
  {
    slug: "wlc",
    shortName: "WLC",
    title: "Weltanschauungs-Leiterschaftskurs",
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
      "JMEM Wiler ist Teil der University of the Nations mit 15 Fakultäten weltweit. Akkreditierte Kurse mit internationaler Anerkennung.",
    accredited: true,
  },
];
