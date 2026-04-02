"use client";

import Image from "next/image";
import { SchoolCard } from "@/components/SchoolCard";
import { schools } from "@/lib/schools";
import { useLang } from "@/lib/LangContext";

export default function SchulenPage() {
  const { t } = useLang();

  return (
    <>
      {/* Hero with background image */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <Image
          src="/images/site/schulen-worship.jpg"
          alt="Schulen"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[var(--color-primary)]/85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">{t.schools.title}</h1>
          <p className="text-white/80 max-w-2xl text-lg">
            {t.schools.heroSubtitle}
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
            {t.schools.uofnTitle}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t.schools.uofnDescription}
          </p>
        </div>
      </section>
    </>
  );
}
