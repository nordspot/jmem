import { SchoolCard } from "@/components/SchoolCard";
import { schools } from "@/lib/schools";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schulen | JMEM Wiler",
  description:
    "10 akkreditierte Schulen der University of the Nations. DTS, SBCW, SBS, DBS und mehr.",
};

export default function SchulenPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-primary)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Unsere Schulen</h1>
          <p className="text-white/80 max-w-2xl text-lg">
            Lass dich ausbilden! Alle unsere Schulen sind Teil der University of
            the Nations (UofN) und international akkreditiert.
          </p>
        </div>
      </section>

      {/* Schools Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school, i) => (
              <SchoolCard
                key={school.slug}
                {...school}
                href={`/schulen/${school.slug}`}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* UofN Info */}
      <section className="py-16 bg-[var(--color-warm)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            University of the Nations
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Die University of the Nations (UofN) ist die Trainingsplattform von
            JMEM mit ueber 600 Standorten in 160 Laendern. Sie bietet
            akkreditierte Programme in 15 Fakultaeten an. JMEM Wiler ist ein
            akkreditierter UofN-Standort.
          </p>
        </div>
      </section>
    </>
  );
}
