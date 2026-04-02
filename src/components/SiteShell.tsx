"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LangProvider } from "@/lib/LangContext";
import { CartProvider } from "@/lib/CartContext";
import { CartButton } from "./CartButton";
import { CartDrawer } from "./CartDrawer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <LangProvider>
      <CartProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartButton />
        <CartDrawer />
      </CartProvider>
    </LangProvider>
  );
}
