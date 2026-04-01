"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { WaveDivider } from "./WaveDivider";

export function HeroSection() {
  const { t } = useLang();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <Image
        src="/images/site/hero-dts.jpg"
        alt="JMEM Wiler"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-[var(--color-dark)]/80" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Large JMEM Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <Image
              src="/images/site/logo.svg"
              alt="JMEM Wiler"
              width={500}
              height={125}
              className="w-[320px] sm:w-[420px] lg:w-[500px] h-auto"
              priority
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/90 font-[var(--font-heading)] tracking-[0.3em] uppercase text-lg sm:text-xl mb-6"
          >
            {t.hero.tagline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 max-w-3xl"
          >
            {t.hero.welcome}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-lg text-white/80 leading-relaxed mb-10 max-w-2xl"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="/schulen/dts"
              className="bg-[var(--color-accent)] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[var(--color-accent)]/90 transition-colors text-sm"
            >
              {t.hero.ctaDTS}
            </Link>
            <Link
              href="/angebote"
              className="bg-white/10 backdrop-blur text-white font-medium px-8 py-3.5 rounded-full border border-white/20 hover:bg-white/20 transition-colors text-sm"
            >
              {t.hero.ctaAngebote}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave bottom - transition from hero to white section */}
      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider
          topColor="transparent"
          bottomColor="white"
          showLine
        />
      </div>
    </section>
  );
}
