"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <Image
        src="/images/site/hero-dts.jpg"
        alt="JMEM Wiler"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-dark)]/90 via-[var(--color-primary)]/70 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--color-accent)] font-medium tracking-widest uppercase text-sm mb-4"
          >
            passion &middot; training &middot; mission
          </motion.p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Willkommen bei{" "}
            <span className="text-[var(--color-accent)]">JMEM</span> Wiler
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl">
            Jugend mit einer Mission - Gott besser kennenlernen und ihn bekannt
            machen. Entdecke unsere Schulen, Seminare und Einsaetze.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/schulen"
              className="bg-[var(--color-accent)] text-[var(--color-primary-dark)] font-semibold px-8 py-3.5 rounded-full hover:bg-[var(--color-accent-light)] transition-colors text-sm"
            >
              Unsere Schulen entdecken
            </Link>
            <Link
              href="/angebote"
              className="bg-white/10 backdrop-blur text-white font-medium px-8 py-3.5 rounded-full border border-white/20 hover:bg-white/20 transition-colors text-sm"
            >
              Angebote ansehen
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120V60C240 20 480 0 720 20C960 40 1200 80 1440 60V120H0Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  );
}
