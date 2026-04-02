export interface Testimonial {
  quote: string;
  quoteEn?: string;
  name: string;
  country: string;
  school: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Diese DTS war phänomenal und eine der besten Entscheidungen, die ich je getroffen habe. Die Erfahrungen hier waren lebensverändernd.",
    name: "Kelsey",
    country: "USA",
    school: "dts",
  },
  {
    quote:
      "Die SBCW hat mir geholfen, Gottes perfekten Plan für mein Leben zu erkennen und die Vision umzusetzen, die er mir gegeben hat.",
    name: "Simon",
    country: "India",
    school: "sbcw",
  },
  {
    quote:
      "Meine Perspektive auf Gott und die ganze Welt hat sich durch diese Schule komplett verändert.",
    name: "Dayana",
    country: "Colombia",
    school: "sbcw",
  },
  {
    quote:
      "Ich habe gelernt, dass Gottes Reich nicht nur darum geht, in den Himmel zu kommen. Es geschieht hier und jetzt.",
    name: "Fogan",
    country: "Togo",
    school: "sbcw",
  },
  {
    quote:
      "Die SBS hat mir geholfen, den roten Faden durch die Bibel zu sehen und viele Schätze zu entdecken.",
    name: "Stefan",
    country: "CH",
    school: "sbs",
  },
  {
    quote:
      "Die ganze Bibel in der SBS zu studieren ist harte Arbeit, aber die Frucht davon ist atemberaubend und ewig.",
    name: "Wilawan",
    country: "Thailand",
    school: "sbs",
  },
];
