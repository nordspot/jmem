export interface Product {
  sku: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: "books" | "music" | "kids" | "tricks";
  inStock: boolean;
}

export const products: Product[] = [
  // MUSIC
  { sku: "101", name: "Doppel-CD: Ich und meine Freunde (Schwizerdeutsch)", price: 5, description: "Kinder-Lobpreis Doppel-CD ab 7 Jahren. Songs und Raps auf Schwizerdeutsch. Inklusive Playback-CD, Liedtexte mit Akkorden und Videoclips.", image: "/images/products/101-ich-und-meine-freunde-ch.jpg", category: "music", inStock: true },
  { sku: "102", name: "Doppel-CD: Ich und meine Freunde (Hochdeutsch)", price: 5, description: "Kinder-Lobpreis Doppel-CD ab 7 Jahren auf Hochdeutsch. Neu und peppig arrangierte Songs und Raps.", image: "/images/products/102-ich-und-meine-freunde-de.jpg", category: "music", inStock: true },
  { sku: "103", name: "Du bisch de Strom i minere Leitig", price: 5, description: "10 Songs, davon 8 mit Playbacks. Alle Lieder als Notenblaetter und Textfolien. Mit Videoclip. Von Stefan Huesler.", image: "/images/products/103-du-bisch-de-strom.jpg", category: "music", inStock: true },
  { sku: "104", name: "Plausch im Raege", price: 10, description: "Zweite Kinder-Lobpreis-CD mit Schweizerdeutschen Liedern zum Tanzen und Huepfen.", image: "/images/products/104-plausch-im-raege.jpg", category: "music", inStock: true },
  { sku: "105", name: "Kombi: Plausch im Raege + Du bisch de Strom", price: 12, description: "Beide CDs von Stefan Huesler im Kombi-Angebot.", image: "/images/products/105-kombi-plausch-strom.jpg", category: "music", inStock: true },
  // BOOKS
  { sku: "201", name: "Bist du es, Herr?", price: 15, description: "Biografie von Loren Cunningham und die Gruendung von JMEM. 216 Seiten.", image: "/images/products/201-bist-du-es-herr.jpg", category: "books", inStock: false },
  { sku: "202", name: "Das Buch, das Nationen transformiert", price: 10, description: "Die Kraft der Bibel, jede Nation zu veraendern. Von Loren Cunningham und Janice Rogers. 256 Seiten.", image: "/images/products/202-buch-nationen-transformiert.jpg", category: "books", inStock: true },
  { sku: "203", name: "Gefangen im Iran", price: 10, description: "Dan Baumanns Reise in den Iran 1996/97 und seine Gefangenschaft im Evin-Gefaengnis. 220 Seiten.", image: "/images/products/203-gefangen-im-iran.jpg", category: "books", inStock: true },
  { sku: "205", name: "Graf Zinzendorf", price: 6, description: "Was tust du fuer mich? Von Janet & Geoff Benge. 160 Seiten.", image: "/images/products/205-graf-zinzendorf.jpg", category: "books", inStock: true },
  { sku: "206", name: "Cameron W. Townsend", price: 6, description: "Biografie des Gruenders der Wycliffe Bibeluebersetzer. Von Janet & Geoff Benge. 192 Seiten.", image: "/images/products/206-cameron-townsend.jpg", category: "books", inStock: true },
  { sku: "207", name: "Die AT-Formel", price: 15, description: "Biblische Perspektive auf das Berufsleben von Landa Cope. 296 Seiten.", image: "/images/products/207-at-formel.jpg", category: "books", inStock: true },
  { sku: "208", name: "Beziehungen", price: 10, description: "Von Dean Sherman ueber Beziehungen aus christlicher Perspektive. 120 Seiten.", image: "/images/products/208-beziehungen.jpg", category: "books", inStock: true },
  { sku: "209", name: "Die fuenf Sprachen der Liebe - Teenager", price: 20, description: "Von Gary Chapman. Wie Eltern die Liebessprache ihres Teenagers verstehen. 224 Seiten.", image: "/images/products/209-sprachen-liebe-teenager.jpg", category: "books", inStock: true },
  { sku: "210", name: "Die fuenf Sprachen der Liebe fuer Kinder", price: 20, description: "Von Gary Chapman. Die Liebessprache deines Kindes verstehen. ", image: "/images/products/210-sprachen-liebe-kinder.jpg", category: "books", inStock: true },
  { sku: "211", name: "Kinder sind wie ein Spiegel", price: 14, description: "Von Ross Campbell. Wie Eltern konkrete Liebe zeigen koennen. 144 Seiten.", image: "/images/products/211-kinder-spiegel.jpg", category: "books", inStock: true },
  { sku: "212", name: "So stell ich mir Familie vor", price: 12, description: "Von Gary Chapman. 5 Merkmale einer funktionierenden Familie. 205 Seiten.", image: "/images/products/212-so-stell-ich-mir-familie-vor.jpg", category: "books", inStock: true },
  { sku: "215", name: "Abenteuer, Familien im Dienst", price: 14, description: "Von Andreas & Angela Fresz. Impulse und Anregungen fuer Familien im Dienst. 172 Seiten.", image: "/images/products/215-abenteuer-familien.jpg", category: "books", inStock: true },
  { sku: "217", name: "Der wahre Reichtum", price: 9, description: "Von Samuel Boerner. Biblische Perspektiven zum Umgang mit Geld. 60 Seiten.", image: "/images/products/217-der-wahre-reichtum.jpg", category: "books", inStock: true },
  { sku: "218", name: "Wie sollen wir denn denken?", price: 15, description: "Von Darrow L. Miller. Christliche Weltanschauung und gesellschaftliche Entwicklung.", image: "/images/products/218-wie-sollen-wir-denken.jpg", category: "books", inStock: true },
  { sku: "219", name: "Das Buch der Mitte", price: 25, description: "Von Vishal Mangalwadi. Die Bibel als Herzstueck der westlichen Kultur. 524 Seiten.", image: "/images/products/219-buch-der-mitte.jpg", category: "books", inStock: true },
  { sku: "220", name: "Wahrheit und Wandlung", price: 20, description: "Analyse von Weltanschauungen und kulturellen Trends. Nicht-westliche Perspektive auf europaeische Wurzeln.", image: "/images/products/220-wahrheit-und-wandlung.jpg", category: "books", inStock: true },
  { sku: "221", name: "Gottes Wort unser Schatz", price: 8, description: "Von Loren Cunningham. Vision fuer die Verbreitung von Gottes Wort weltweit.", image: "/images/products/221-gottes-wort-schatz.jpg", category: "books", inStock: true },
  // KIDS/YOUTH
  { sku: "301", name: "Preteens Handbuch", price: 25, description: "20 thematische und 20 praktische Lektionen fuer die Preteens-Arbeit. King's Kids Schweiz / BESJ.", image: "/images/products/301-preteens-handbuch.jpg", category: "kids", inStock: true },
  { sku: "302", name: "Gegenstandslektionen 1", price: 15, description: "60 Gegenstandslektionen zu: Abraham, Glaube, Geben, Gottes Wort, Fuer Gott leben, Liebe. King's Kids.", image: "/images/products/302-gegenstandslektionen-1.jpg", category: "kids", inStock: true },
  { sku: "303", name: "Gegenstandslektionen 2", price: 15, description: "54 Gegenstandslektionen zu: Evangelisation, Wunder, Gehorsam, Gebet, Suende, Josef. King's Kids.", image: "/images/products/303-gegenstandslektionen-2.jpg", category: "kids", inStock: true },
  { sku: "304", name: "100 kreative Gebetsspiele", price: 15, description: "Tolle Ideen, um das Gebet in spielerischer Form zu unterstuetzen.", image: "/images/products/304-kreative-gebetsspiele.jpg", category: "kids", inStock: true },
  { sku: "305", name: "Geschichten sprechen fuer sich", price: 21, description: "57 Geschichten passend zu den Gegenstandslektionen 1 und 2. Fuer Kinder 6-12 Jahre.", image: "/images/products/305-geschichten-sprechen.jpg", category: "kids", inStock: true },
  { sku: "306", name: "100 Spiele die es in sich haben", price: 25, description: "Ueber 100 begeisternde Spielideen fuer Kids und Teens in 12 Kategorien.", image: "/images/products/306-100-spiele.jpg", category: "kids", inStock: true },
  { sku: "307", name: "EISBRECHER-SPIELIDEEN", price: 12.80, description: "55 actionsgeladene Aufwaerm-Spielideen fuer Gruppen. Wenig Material noetig.", image: "/images/products/307-eisbrecher-spielideen.jpg", category: "kids", inStock: true },
  // TRICKS
  { sku: "401", name: "Kids EE-Wuerfel", price: 12.80, description: "Faltbarer Wuerfel mit Illustrationen, um Kindern das Evangelium zu erklaeren.", image: "/images/products/401-kids-ee-wuerfel.jpg", category: "tricks", inStock: true },
  { sku: "402", name: "Flashpaper", price: 10, description: "Magnesiumpapier, verbrennt ohne Rueckstaende. 4 Stueck, 20x25cm.", image: "/images/products/402-flashpaper.jpg", category: "tricks", inStock: true },
  { sku: "403", name: "Slush Powder", price: 10, description: "Pulver, das Wasser in Sekunden zu Gel werden laesst.", image: "/images/products/403-slush-powder.jpg", category: "tricks", inStock: true },
  { sku: "404", name: "Snow Powder", price: 13, description: "Pulver, das Wasser in kuenstlichen Schnee verwandelt.", image: "/images/products/404-snow-powder.jpg", category: "tricks", inStock: true },
  { sku: "405", name: "Magic Coloring Book", price: 12, description: "Malbuch mit leeren Seiten, Konturen oder farbigen Zeichnungen - je nach Blaettertechnik.", image: "/images/products/405-magic-coloring-book.jpg", category: "tricks", inStock: true },
  { sku: "407", name: "Paper to Hat", price: 6, description: "Gefaltetes Seidenpapier wird zum Hut. 4 Stueck im Pack.", image: "/images/products/407-paper-to-hat.jpg", category: "tricks", inStock: true },
  { sku: "411", name: "Trickdaumen", price: 8, description: "Ein farbiges Tuch verschwindet in der Hand.", image: "/images/products/411-trickdaumen.jpg", category: "tricks", inStock: true },
  { sku: "412", name: "Abknickende Trickblume", price: 8, description: "Trickblume, die sich knicken laesst.", image: "/images/products/412-trickblume.jpg", category: "tricks", inStock: true },
  { sku: "413", name: "Nadel durch Ballon", price: 15, description: "Mit einer grossen Nadel durch den Ballon stechen, ohne dass er zerplatzt.", image: "/images/products/413-nadel-durch-ballon.jpg", category: "tricks", inStock: true },
  { sku: "414", name: "Verknuepfte Tuecher", price: 18.50, description: "Seidenschal-Zaubertrick - verbundene Tuecher trennen sich.", image: "/images/products/414-verknuepfte-tuecher.jpg", category: "tricks", inStock: true },
];
