"use client";

import { HeroSection } from "@/components/HeroSection";
import { SectionCard } from "@/components/SectionCard";
import { SchoolCard } from "@/components/SchoolCard";
import { WaveDivider } from "@/components/WaveDivider";
import { schools } from "@/lib/schools";
import { useLang } from "@/lib/LangContext";
import Link from "next/link";
import { ArrowRight, Heart, Users, Globe, BookOpen } from "lucide-react";

export default function HomePage() {
  const { t } = useLang();

  const sections = [
    {
      title: t.sections.dtsTitle,
      description: t.sections.dtsDescription,
      image: "/images/site/dts-group.jpg",
      href: "/schulen/dts",
    },
    {
      title: t.sections.seminarsTitle,
      description: t.sections.seminarsDescription,
      image: "/images/site/angebote.jpg",
      href: "/angebote",
    },
    {
      title: t.sections.outreachTitle,
      description: t.sections.outreachDescription,
      image: "/images/site/einsatz-1.jpg",
      href: "/einsaetze",
    },
    {
      title: t.sections.schoolsTitle,
      description: t.sections.schoolsDescription,
      image: "/images/site/schulen-nature.jpg",
      href: "/schulen",
    },
  ];

  const stats = [
    { icon: Users, value: "35+", label: t.stats.internationalStaff },
    { icon: Globe, value: "10", label: t.stats.accreditedSchools },
    { icon: BookOpen, value: "20+", label: t.stats.offers },
    { icon: Heart, value: "1981", label: t.stats.since },
  ];

  return (
    <>
      <HeroSection />

      {/* Stats */}
      <section className="py-16 bg-white" data-edit-path="src/lib/i18n/de.ts" data-edit-section="stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-3" />
                <p className="text-3xl font-bold text-[var(--color-primary)]">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-[var(--color-warm)]" data-edit-path="src/lib/i18n/de.ts" data-edit-section="video">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t.video.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.video.subtitle}
            </p>
          </div>
          <div className="relative w-full overflow-hidden rounded-2xl shadow-xl" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/ruzke9nYO54?start=14&rel=0"
              title="JMEM Wiler Video"
              allow="fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-20 bg-white" data-edit-path="src/lib/i18n/de.ts" data-edit-section="discover">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t.discover.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.discover.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sections.map((section, i) => (
              <SectionCard key={section.title} {...section} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Schools Preview */}
      <section className="py-20" data-edit-path="src/lib/schools.ts" data-edit-section="schools-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {t.schools.title}
              </h2>
              <p className="text-gray-600 max-w-xl">
                {t.schools.subtitle}
              </p>
            </div>
            <Link
              href="/schulen"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:gap-3 transition-all"
            >
              {t.schools.allSchools} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.slice(0, 6).map((school, i) => (
              <SchoolCard
                key={school.slug}
                {...school}
                href={`/schulen/${school.slug}`}
                index={i}
                showPrice={false}
              />
            ))}
          </div>
          <div className="sm:hidden text-center mt-8">
            <Link
              href="/schulen"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"
            >
              {t.schools.allSchoolsView} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Wave transition into CTA */}
      <WaveDivider
        topColor="var(--background)"
        bottomColor="var(--color-dark)"
        showLine
      />

      {/* CTA */}
      <section className="py-20 bg-[var(--color-dark)]" data-edit-path="src/lib/i18n/de.ts" data-edit-section="cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t.cta.title}
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/kontakt"
              className="bg-[var(--color-primary)] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[var(--color-primary-light)] transition-colors text-sm"
            >
              {t.cta.contact}
            </Link>
            <Link
              href="/shop"
              className="bg-white/10 backdrop-blur text-white font-medium px-8 py-3.5 rounded-full border border-white/20 hover:bg-white/20 transition-colors text-sm"
            >
              {t.cta.shop}
            </Link>
          </div>
        </div>
      </section>

      {/* Guest Info */}
      <section className="py-20 bg-white" data-edit-path="src/lib/i18n/de.ts" data-edit-section="guest-info">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t.guest.title}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t.guest.description}
              </p>
              <div className="bg-[var(--color-warm)] rounded-xl p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t.guest.overnight}</span>
                  <span className="text-sm font-semibold">{t.guest.overnightPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t.guest.meals}</span>
                  <span className="text-sm font-semibold">{t.guest.mealsPrice}</span>
                </div>
              </div>
            </div>
            <div className="bg-[var(--color-warm)] rounded-2xl p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t.guest.arrival}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                <strong>Adresse:</strong> {t.guest.address}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                <strong>{"\u00f6V:"}</strong> {t.guest.publicTransport}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>Auto:</strong> {t.guest.car}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
