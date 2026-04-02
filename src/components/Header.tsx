"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/LangContext";
import { useAuth } from "@/lib/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavItem {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}

function NavDropdown({
  item,
  isHome,
  scrolled,
}: {
  item: NavItem;
  isHome: boolean;
  scrolled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const textClass =
    isHome && !scrolled
      ? "text-white/90 hover:text-white"
      : "text-gray-700 hover:text-[var(--color-accent)]";

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={`text-sm font-medium transition-colors px-3 py-2 ${textClass}`}
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
        className={`flex items-center gap-1 text-sm font-medium transition-colors px-3 py-2 ${textClass}`}
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
                  key={child.href + child.name}
                  href={child.href}
                  className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[var(--color-warm)] hover:text-[var(--color-accent)] transition-colors"
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { t } = useLang();
  const { isLoggedIn, user } = useAuth();

  const navigation: NavItem[] = [
    {
      name: t.nav.schulen,
      href: "/schulen",
      children: [
        { name: "DTS - " + t.schools.dts.title, href: "/schulen/dts" },
        { name: "SBCW - " + t.schools.sbcw.title, href: "/schulen/sbcw" },
        { name: "SBS - " + t.schools.sbs.title, href: "/schulen/sbs" },
        { name: "DBS - " + t.schools.dbs.title, href: "/schulen/dbs" },
        { name: "SVS - " + t.schools.svs.title, href: "/schulen/svs" },
        { name: "SMJ - " + t.schools.smj.title, href: "/schulen/smj" },
        { name: "BLP - " + t.schools.blp.title, href: "/schulen/blp" },
        { name: "WLC - " + t.schools.wlc.title, href: "/schulen/wlc" },
        { name: "B-SBS - " + t.schools.bsbs.title, href: "/schulen/b-sbs" },
        { name: "UofN - " + t.schools.uofn.title, href: "/schulen/uofn" },
      ],
    },
    {
      name: t.nav.angebote,
      href: "/angebote",
      children: [
        { name: t.nav.agenda, href: "/angebote" },
        { name: t.nav.unsereAngebote, href: "/angebote" },
      ],
    },
    { name: t.nav.einsaetze, href: "/einsaetze" },
    { name: t.nav.unterstuetzung, href: "/unterstuetzung" },
    {
      name: t.nav.ueberUns,
      href: "/ueber-uns",
      children: [
        { name: t.nav.jmemWiler, href: "/ueber-uns" },
        { name: t.nav.zentrumUmgebung, href: "/ueber-uns#zentrum" },
        { name: t.nav.gaeste, href: "/ueber-uns#gaeste" },
        { name: t.nav.kontakt, href: "/kontakt" },
      ],
    },
    { name: t.nav.shop, href: "/shop" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerBg =
    isHome && !scrolled
      ? "bg-transparent border-transparent"
      : "bg-white/90 backdrop-blur-md border-gray-100";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${headerBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="shrink-0">
            {(!isHome || scrolled) ? (
              <Image
                src="/images/site/jmem_bl.svg"
                alt="JMEM Wiler"
                width={180}
                height={45}
                className="h-8 lg:h-10 w-auto"
              />
            ) : (
              <span className="text-lg font-bold text-white">JMEM Wiler</span>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <NavDropdown
                key={item.name}
                item={item}
                isHome={isHome}
                scrolled={scrolled}
              />
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher
              className={
                isHome && !scrolled
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }
            />
            <Link
              href="/konto"
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full transition-colors ${
                isHome && !scrolled
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-gray-700 hover:text-[var(--color-accent)] hover:bg-gray-50"
              }`}
              title={isLoggedIn ? "Mein Konto" : "Anmelden"}
            >
              {isLoggedIn ? (
                <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="hidden xl:inline">
                {isLoggedIn ? "Mein Konto" : "Anmelden"}
              </span>
            </Link>
            <Link
              href="/kontakt"
              className={`text-sm font-medium px-5 py-2.5 rounded-full transition-colors ${
                isHome && !scrolled
                  ? "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                  : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]"
              }`}
            >
              {t.nav.kontakt}
            </Link>
          </div>

          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isHome && !scrolled
                ? "text-white hover:bg-white/10"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
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
                      key={child.href + child.name}
                      href={child.href}
                      className="block px-8 py-2 text-sm text-gray-500 hover:text-[var(--color-accent)] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="px-4 pt-2">
                <LanguageSwitcher className="border-gray-200 text-gray-700 hover:bg-gray-50" />
              </div>
              <Link
                href="/konto"
                className="flex items-center gap-2 mx-4 mt-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-[var(--color-warm)] rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <User className="w-5 h-5" />
                {isLoggedIn ? "Mein Konto" : "Anmelden"}
              </Link>
              <Link
                href="/kontakt"
                className="block mx-4 mt-2 text-center bg-[var(--color-primary)] text-white font-medium px-5 py-3 rounded-full hover:bg-[var(--color-primary-light)] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {t.nav.kontakt}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
