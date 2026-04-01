"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  {
    name: "Schulen",
    href: "/schulen",
    children: [
      { name: "DTS - Juengerschaftsschule", href: "/schulen/dts" },
      { name: "SBCW - Bibl. Christl. Weltanschauung", href: "/schulen/sbcw" },
      { name: "SBS - Bibelstudium", href: "/schulen/sbs" },
      { name: "DBS - Juengerschafts-Bibelschule", href: "/schulen/dbs" },
      { name: "SVS - Visual Storytelling", href: "/schulen/svs" },
      { name: "SMJ - Missional Justice", href: "/schulen/smj" },
      { name: "BLP - Leiterschaftskurs", href: "/schulen/blp" },
      { name: "WLC - Weltanschauung Leiterschaft", href: "/schulen/wlc" },
      { name: "B-SBS - Berufsbegleitend", href: "/schulen/b-sbs" },
      { name: "UofN - University of the Nations", href: "/schulen/uofn" },
    ],
  },
  {
    name: "Angebote",
    href: "/angebote",
    children: [
      { name: "Agenda", href: "/angebote" },
      { name: "Unsere Angebote", href: "/angebote" },
    ],
  },
  { name: "Einsaetze", href: "/einsaetze" },
  { name: "Unterstuetzung", href: "/unterstuetzung" },
  {
    name: "Ueber uns",
    href: "/ueber-uns",
    children: [
      { name: "JMEM Wiler", href: "/ueber-uns" },
      { name: "Zentrum & Umgebung", href: "/ueber-uns#zentrum" },
      { name: "Gaeste", href: "/ueber-uns#gaeste" },
      { name: "Kontakt", href: "/kontakt" },
    ],
  },
  { name: "Shop", href: "/shop" },
];

function NavDropdown({
  item,
}: {
  item: (typeof navigation)[0];
}) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className="text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors px-3 py-2"
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={item.href}
        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors px-3 py-2"
      >
        {item.name}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </Link>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="py-2">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[var(--color-warm)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/site/logo.svg"
              alt="JMEM Wiler"
              width={48}
              height={48}
              className="h-10 w-auto lg:h-12"
            />
            <div className="hidden sm:block">
              <p className="text-lg font-bold text-[var(--color-primary)]">
                JMEM Wiler
              </p>
              <p className="text-xs text-gray-500 -mt-0.5">
                passion - training - mission
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <NavDropdown key={item.name} item={item} />
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/kontakt"
              className="bg-[var(--color-primary)] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[var(--color-primary-light)] transition-colors"
            >
              Kontakt
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-[var(--color-warm)] rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-8 py-2 text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ))}
              <Link
                href="/kontakt"
                className="block mx-4 mt-4 text-center bg-[var(--color-primary)] text-white font-medium px-5 py-3 rounded-full hover:bg-[var(--color-primary-light)] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Kontakt
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
