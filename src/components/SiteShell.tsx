"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LangProvider } from "@/lib/LangContext";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <LangProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </LangProvider>
  );
}
