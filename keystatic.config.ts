import { config, fields, collection, singleton } from "@keystatic/core";

const isProd = process.env.NODE_ENV === "production";

export default config({
  storage: isProd
    ? {
        kind: "github",
        repo: "nordspot/jmem",
      }
    : {
        kind: "local",
      },
  collections: {
    schools: collection({
      label: "Schulen",
      slugField: "title",
      path: "src/content/schools/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Titel" } }),
        shortName: fields.text({ label: "Kurzname (z.B. DTS, SBCW)" }),
        description: fields.text({ label: "Kurzbeschreibung", multiline: true }),
        content: fields.markdoc({ label: "Inhalt" }),
        image: fields.image({
          label: "Bild",
          directory: "public/images/schools",
          publicPath: "/images/schools/",
        }),
        startDate: fields.text({ label: "Startdatum" }),
        endDate: fields.text({ label: "Enddatum" }),
        price: fields.text({ label: "Preis (CHF)" }),
        duration: fields.text({ label: "Dauer" }),
        language: fields.text({ label: "Sprache" }),
        accredited: fields.checkbox({ label: "UofN akkreditiert" }),
        order: fields.integer({ label: "Reihenfolge", defaultValue: 0 }),
      },
    }),
    offerings: collection({
      label: "Angebote",
      slugField: "title",
      path: "src/content/offerings/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Titel" } }),
        description: fields.text({ label: "Beschreibung", multiline: true }),
        content: fields.markdoc({ label: "Inhalt" }),
        image: fields.image({
          label: "Bild",
          directory: "public/images/offerings",
          publicPath: "/images/offerings/",
        }),
        date: fields.text({ label: "Datum" }),
        price: fields.text({ label: "Preis" }),
        category: fields.select({
          label: "Kategorie",
          options: [
            { label: "Seminar", value: "seminar" },
            { label: "Camp", value: "camp" },
            { label: "Event", value: "event" },
            { label: "Kurs", value: "kurs" },
            { label: "Workshop", value: "workshop" },
          ],
          defaultValue: "event",
        }),
        order: fields.integer({ label: "Reihenfolge", defaultValue: 0 }),
      },
    }),
    products: collection({
      label: "Shop Produkte",
      slugField: "name",
      path: "src/content/products/*",
      schema: {
        name: fields.slug({ name: { label: "Produktname" } }),
        sku: fields.text({ label: "SKU" }),
        price: fields.number({ label: "Preis (CHF)", defaultValue: 0 }),
        description: fields.text({ label: "Beschreibung", multiline: true }),
        image: fields.image({
          label: "Produktbild",
          directory: "public/images/products",
          publicPath: "/images/products/",
        }),
        category: fields.select({
          label: "Kategorie",
          options: [
            { label: "Bücher", value: "books" },
            { label: "Musik", value: "music" },
            { label: "Kinder & Jugend", value: "kids" },
            { label: "Tricks & Hilfsmittel", value: "tricks" },
          ],
          defaultValue: "books",
        }),
        inStock: fields.checkbox({ label: "Auf Lager", defaultValue: true }),
        order: fields.integer({ label: "Reihenfolge", defaultValue: 0 }),
      },
    }),
    team: collection({
      label: "Team",
      slugField: "name",
      path: "src/content/team/*",
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        role: fields.text({ label: "Rolle / Funktion" }),
        teamGroup: fields.select({
          label: "Team",
          options: [
            { label: "Generations", value: "generations" },
            { label: "Jüngerschaft", value: "juengerschaft" },
            { label: "Bibel & Gesellschaft", value: "bibel-gesellschaft" },
            { label: "Supportteam", value: "support" },
            { label: "Leitung", value: "leitung" },
          ],
          defaultValue: "support",
        }),
        image: fields.image({
          label: "Foto",
          directory: "public/images/team",
          publicPath: "/images/team/",
        }),
        bio: fields.text({ label: "Bio", multiline: true }),
        order: fields.integer({ label: "Reihenfolge", defaultValue: 0 }),
      },
    }),
  },
  singletons: {
    siteSettings: singleton({
      label: "Website Einstellungen",
      path: "src/content/pages/settings",
      schema: {
        orgName: fields.text({
          label: "Organisationsname",
          defaultValue: "Jugend mit einer Mission",
        }),
        tagline: fields.text({
          label: "Tagline",
          defaultValue: "passion - training - mission",
        }),
        address: fields.text({
          label: "Adresse",
          defaultValue: "Hauptstrasse 15, 3266 Wiler bei Seedorf",
        }),
        phone: fields.text({
          label: "Telefon",
          defaultValue: "+41 (0)32 391 70 30",
        }),
        email: fields.text({
          label: "E-Mail",
          defaultValue: "info@jmemwiler.ch",
        }),
        facebook: fields.text({
          label: "Facebook URL",
          defaultValue: "https://www.facebook.com/ywamwiler/",
        }),
        instagram: fields.text({
          label: "Instagram URL",
          defaultValue: "https://www.instagram.com/ywamwiler/",
        }),
        youtube: fields.text({
          label: "YouTube URL",
          defaultValue: "https://www.youtube.com/channel/UC1nmur0qZBrfxwEDb3H3RWA",
        }),
        iban: fields.text({
          label: "IBAN",
          defaultValue: "CH90 0900 0000 2501 5842 2",
        }),
        phoneHours: fields.text({
          label: "Telefonzeiten",
          multiline: true,
          defaultValue:
            "Mo-Mi, Fr: 09:00-12:00 und 14:00-17:00\nDo: 09:00-12:00",
        }),
      },
    }),
    homepage: singleton({
      label: "Startseite",
      path: "src/content/pages/homepage",
      format: { contentField: "content" },
      schema: {
        heroTitle: fields.text({
          label: "Hero Titel",
          defaultValue:
            "Willkommen bei Jugend mit einer Mission (JMEM) Wiler",
        }),
        heroSubtitle: fields.text({
          label: "Hero Untertitel",
          defaultValue: "passion - training - mission",
        }),
        content: fields.markdoc({ label: "Inhalt" }),
      },
    }),
    aboutPage: singleton({
      label: "Über uns",
      path: "src/content/pages/about",
      format: { contentField: "content" },
      schema: {
        title: fields.text({
          label: "Titel",
          defaultValue: "JMEM Wiler",
        }),
        content: fields.markdoc({ label: "Inhalt" }),
      },
    }),
  },
});
