"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  index?: number;
}

export function SectionCard({
  title,
  description,
  image,
  href,
  index = 0,
}: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={href} className="group block">
        <div className="relative h-72 rounded-2xl overflow-hidden mb-5">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          {description}
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] group-hover:gap-3 transition-all">
          Mehr erfahren <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </motion.div>
  );
}
