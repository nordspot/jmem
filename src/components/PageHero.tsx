import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
  children?: React.ReactNode;
}

const defaultImages: Record<string, string> = {
  shop: "/images/site/schulen-dbs.jpg",
  angebote: "/images/site/angebot-family-camp.jpg",
  einsaetze: "/images/site/einsatz-1.jpg",
  kontakt: "/images/site/about-campus.jpg",
  unterstuetzung: "/images/site/about-worship.jpg",
  "ueber-uns": "/images/site/about-team.jpg",
  schulen: "/images/site/schulen-worship.jpg",
};

export function PageHero({ title, subtitle, image, children }: PageHeroProps) {
  const bgImage = image || "/images/site/hero-dts.jpg";

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <Image
        src={bgImage}
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-[var(--color-dark)]/75" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
        {subtitle && (
          <p className="text-white/80 max-w-2xl text-lg">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}
