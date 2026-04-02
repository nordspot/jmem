"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, Users, Calendar, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import { PageHero } from "@/components/PageHero";

const galleryImages = [
  { src: "/images/site/einsatz-1.jpg", alt: "Einsatz 1" },
  { src: "/images/site/einsatz-2.jpg", alt: "Einsatz 2" },
  { src: "/images/site/einsatz-3.jpg", alt: "Einsatz 3" },
  { src: "/images/site/einsatz-4.jpg", alt: "Einsatz 4" },
  { src: "/images/site/einsatz-5.jpg", alt: "Einsatz 5" },
  { src: "/images/site/einsatz-pflanzen.jpg", alt: "Einsatz Pflanzen" },
  { src: "/images/site/einsatz-bauen.jpg", alt: "Einsatz Bauen" },
  { src: "/images/site/einsatz-group.jpg", alt: "Einsatz Gruppe" },
];

export default function EinsaetzePage() {
  const { t } = useLang();

  return (
    <>
      <PageHero title={t.einsaetze.title} subtitle={t.einsaetze.subtitle} image="/images/site/einsatz-1.jpg" />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t.einsaetze.missionTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t.einsaetze.missionP1}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t.einsaetze.missionP2}
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[var(--color-warm)] rounded-xl p-5 text-center">
                  <Globe className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{t.einsaetze.worldwide}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t.einsaetze.worldwideDesc}
                  </p>
                </div>
                <div className="bg-[var(--color-warm)] rounded-xl p-5 text-center">
                  <Users className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{t.einsaetze.inTeam}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t.einsaetze.inTeamDesc}
                  </p>
                </div>
                <div className="bg-[var(--color-warm)] rounded-xl p-5 text-center">
                  <Calendar className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{t.einsaetze.flexible}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t.einsaetze.flexibleDesc}
                  </p>
                </div>
              </div>

              <Link
                href="/kontakt"
                className="inline-flex bg-[var(--color-primary)] text-white font-medium px-6 py-3 rounded-full hover:bg-[var(--color-primary-light)] transition-colors text-sm"
              >
                {t.common.learnMore}
              </Link>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {t.einsaetze.dtsOutreach}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {t.einsaetze.dtsOutreachDesc}
                </p>
                <Link
                  href="/schulen/dts"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"
                >
                  {t.common.learnMore} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {t.einsaetze.shortTerm}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {t.einsaetze.shortTermDesc}
                </p>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"
                >
                  {t.common.inquire} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 bg-[var(--color-warm)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t.einsaetze.galleryTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <div
                key={img.src}
                className={`relative overflow-hidden rounded-xl ${
                  i === 0 || i === 7 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div className={`relative ${i === 0 || i === 7 ? "h-64 md:h-full min-h-[300px]" : "h-48 md:h-56"}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
