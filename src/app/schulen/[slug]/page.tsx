import { schools } from "@/lib/schools";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  GraduationCap,
  ArrowLeft,
  DollarSign,
} from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return schools.map((school) => ({ slug: school.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const school = schools.find((s) => s.slug === slug);
  if (!school) return { title: "Schule nicht gefunden" };
  return {
    title: `${school.shortName} - ${school.title} | JMEM Wiler`,
    description: school.description,
  };
}

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = schools.find((s) => s.slug === slug);
  if (!school) notFound();

  return (
    <>
      <section className="bg-[var(--color-primary)] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/schulen"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Alle Schulen
          </Link>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
              {school.shortName}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{school.title}</h1>
              {school.accredited && (
                <span className="inline-flex items-center gap-1.5 text-sm text-green-300 mt-2">
                  <GraduationCap className="w-4 h-4" />
                  UofN akkreditiert
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Über diese Schule
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {school.description}
              </p>

              <div className="mt-12">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Interesse?
                </h3>
                <p className="text-gray-600 mb-6">
                  Nimm Kontakt mit uns auf für weitere Informationen oder um
                  dich anzumelden.
                </p>
                <Link
                  href="/kontakt"
                  className="inline-flex bg-[var(--color-primary)] text-white font-medium px-6 py-3 rounded-full hover:bg-[var(--color-primary-light)] transition-colors text-sm"
                >
                  Kontakt aufnehmen
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {school.startDate && (
                <div className="bg-[var(--color-warm)] rounded-xl p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
                    <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                    Nächster Start
                  </div>
                  <p className="text-sm text-gray-600">{school.startDate}</p>
                </div>
              )}
              {school.duration && (
                <div className="bg-[var(--color-warm)] rounded-xl p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
                    <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                    Dauer
                  </div>
                  <p className="text-sm text-gray-600">{school.duration}</p>
                </div>
              )}
              {school.price && (
                <div className="bg-[var(--color-warm)] rounded-xl p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
                    <DollarSign className="w-4 h-4 text-[var(--color-primary)]" />
                    Kosten
                  </div>
                  <p className="text-sm text-gray-600">{school.price}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
