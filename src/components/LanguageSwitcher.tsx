"use client";

import { useLang } from "@/lib/LangContext";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "de" ? "en" : "de")}
      className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors ${className}`}
      title={lang === "de" ? "Switch to English" : "Auf Deutsch wechseln"}
    >
      <span className={lang === "de" ? "font-bold" : "opacity-60"}>DE</span>
      <span className="opacity-40">|</span>
      <span className={lang === "en" ? "font-bold" : "opacity-60"}>EN</span>
    </button>
  );
}
