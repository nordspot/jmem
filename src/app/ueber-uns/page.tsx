"use client";

import Image from "next/image";
import { Users, Globe, BookOpen, MapPin } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import { PageHero } from "@/components/PageHero";

export default function UeberUnsPage() {
  const { t } = useLang();

  const teams = [
    {
      name: t.ueberUns.generations,
      description: t.ueberUns.generationsDesc,
      icon: Users,
    },
    {
      name: t.ueberUns.discipleship,
      description: t.ueberUns.discipleshipDesc,
      icon: BookOpen,
    },
    {
      name: t.ueberUns.bibleSociety,
      description: t.ueberUns.bibleSocietyDesc,
      icon: Globe,
    },
    {
      name: t.ueberUns.support,
      description: t.ueberUns.supportDesc,
      icon: MapPin,
    },
  ];

  return (
    <>
      <PageHero title={t.ueberUns.title} subtitle={t.ueberUns.subtitle} image="/images/site/about-team.jpg" />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t.ueberUns.jmemWiler}
              </h2>
              <div className="prose text-gray-600 leading-relaxed space-y-4">
                <p>{t.ueberUns.p1}</p>
                <p>{t.ueberUns.p2}</p>
                <p>{t.ueberUns.p3}</p>
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image
                src="/images/site/about-team.jpg"
                alt="JMEM Wiler Team"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Image row */}
          <div className="grid md:grid-cols-3 gap-4 mb-20">
            <div className="relative h-56 rounded-2xl overflow-hidden">
              <Image
                src="/images/site/about-group.jpg"
                alt="JMEM Wiler Gruppe"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-56 rounded-2xl overflow-hidden">
              <Image
                src="/images/site/about-worship.jpg"
                alt="JMEM Wiler Worship"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-56 rounded-2xl overflow-hidden">
              <Image
                src="/images/site/about-campus.jpg"
                alt="JMEM Wiler Campus"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Teams */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {t.ueberUns.teamsTitle}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teams.map((team) => (
                <div
                  key={team.name}
                  className="bg-white rounded-2xl border border-gray-100 p-6"
                >
                  <team.icon className="w-10 h-10 text-[var(--color-primary)] mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {team.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {team.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* JMEM Worldwide */}
          <div id="weltweit" className="bg-[var(--color-warm)] rounded-2xl p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t.ueberUns.worldwideTitle}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-3xl">
              {t.ueberUns.worldwideDesc}
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)]">
                  180+
                </p>
                <p className="text-sm text-gray-500 mt-1">{t.ueberUns.countries}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)]">
                  18&apos;000+
                </p>
                <p className="text-sm text-gray-500 mt-1">{t.ueberUns.staffWorldwide}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)]">
                  1960
                </p>
                <p className="text-sm text-gray-500 mt-1">{t.ueberUns.founded}</p>
              </div>
            </div>
          </div>

          {/* Zentrum */}
          <div id="zentrum" className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t.ueberUns.zentrum}
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              {t.ueberUns.zentrumDesc}
            </p>
          </div>

          {/* Gaeste */}
          <div id="gaeste" className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.ueberUns.guests}</h2>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-3xl">
              {t.ueberUns.guestsDesc}
            </p>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t.ueberUns.prices}</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.guest.overnight}</span>
                  <span className="font-semibold">{t.guest.overnightPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.guest.meals}</span>
                  <span className="font-semibold">{t.guest.mealsPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
