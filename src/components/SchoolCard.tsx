"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, GraduationCap, ArrowRight } from "lucide-react";

interface SchoolCardProps {
  shortName: string;
  title: string;
  description: string;
  image?: string;
  startDate?: string;
  duration?: string;
  price?: string;
  accredited?: boolean;
  href: string;
  index?: number;
  showPrice?: boolean;
}

export function SchoolCard({
  shortName,
  title,
  description,
  image,
  startDate,
  duration,
  price,
  accredited,
  href,
  index = 0,
  showPrice = true,
}: SchoolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={href} className="group block">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all duration-300 h-full">
          {/* Image band */}
          {image && (
            <div className="relative h-40">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* School badge */}
              <div className="absolute bottom-3 left-3 w-12 h-12 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
                {shortName}
              </div>
              {/* UofN badge */}
              {accredited && (
                <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-white bg-green-600/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <GraduationCap className="w-3.5 h-3.5" />
                  UofN
                </span>
              )}
            </div>
          )}

          <div className="p-6">
            {/* Fallback badge row when no image */}
            {!image && (
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center font-bold text-sm">
                  {shortName}
                </div>
                {accredited && (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                    <GraduationCap className="w-3.5 h-3.5" />
                    UofN
                  </span>
                )}
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[var(--color-primary)] transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
              {description}
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              {startDate && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {startDate}
                </span>
              )}
              {duration && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {duration}
                </span>
              )}
            </div>
            {price && showPrice && (
              <p className="text-sm font-semibold text-[var(--color-primary)] mb-3">
                {price}
              </p>
            )}
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] group-hover:gap-3 transition-all">
              Mehr erfahren <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
