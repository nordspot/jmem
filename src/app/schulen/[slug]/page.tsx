import { schools } from "@/lib/schools";
import { testimonials } from "@/lib/testimonials";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  GraduationCap,
  ArrowLeft,
  DollarSign,
  Globe,
  BookOpen,
  MapPin,
} from "lucide-react";
import { TestimonialCard } from "@/components/TestimonialCard";
import { SchoolFormSection } from "@/components/SchoolFormSection";
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

  const schoolTestimonials = testimonials.filter((t) => t.school === slug);

  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <Image src={school.image || "/images/site/schulen-worship.jpg"} alt={school.title} fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-[var(--color-dark)]/75" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  {school.credits && (
                    <span className="text-white/60 ml-2">
                      ({school.credits})
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2" data-edit-path="src/lib/schools.ts" data-edit-section="school-detail">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Über diese Schule
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {school.descriptionLong || school.description}
              </p>

              {/* Curriculum / 7 Spheres */}
              {school.curriculum && school.curriculum.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
                    Die 7 Einflussbereiche
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {school.curriculum.map((topic) => (
                      <div
                        key={topic}
                        className="flex items-center gap-3 bg-[var(--color-warm)] rounded-xl px-4 py-3"
                      >
                        <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full shrink-0" />
                        <span className="text-sm text-gray-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Neben dem Unterricht besuchst du verschiedene Organisationen
                    und Projekte vor Ort, die in diesen Bereichen tätig sind
                    (Field Visits).
                  </p>
                </div>
              )}

              {/* Quarter Structure (SBS) */}
              {school.quarterStructure &&
                school.quarterStructure.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
                      Aufbau (3 Quartale)
                    </h3>
                    <div className="space-y-3">
                      {school.quarterStructure.map((quarter, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 bg-[var(--color-warm)] rounded-xl px-4 py-3"
                        >
                          <div className="w-7 h-7 bg-[var(--color-primary)] text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            Q{i + 1}
                          </div>
                          <span className="text-sm text-gray-700">
                            {quarter}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Outreach Destinations */}
              {school.outreachDestinations &&
                school.outreachDestinations.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                      Einsatzorte
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {school.outreachDestinations.map((dest) => (
                        <span
                          key={dest}
                          className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium px-3 py-1.5 rounded-full"
                        >
                          {dest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Variants (DTS) */}
              {school.variants && school.variants.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Varianten
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {school.variants.map((variant) => (
                      <div
                        key={variant.name}
                        className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-bold text-gray-900 mb-1">
                          {variant.name}
                        </h4>
                        {variant.subtitle && (
                          <p className="text-xs font-medium text-[var(--color-primary)] mb-2">
                            {variant.subtitle}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {variant.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {schoolTestimonials.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Erfahrungsberichte
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {schoolTestimonials.map((testimonial, i) => (
                      <TestimonialCard
                        key={testimonial.name}
                        testimonial={testimonial}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              )}

              <SchoolFormSection slug={slug} />
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
              {school.language && (
                <div className="bg-[var(--color-warm)] rounded-xl p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
                    <Globe className="w-4 h-4 text-[var(--color-primary)]" />
                    Sprache
                  </div>
                  <p className="text-sm text-gray-600">{school.language}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
