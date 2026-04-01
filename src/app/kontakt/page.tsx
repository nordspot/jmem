import { Mail, Phone, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt | JMEM Wiler",
  description: "Nimm Kontakt auf mit JMEM Wiler. Hauptstrasse 15, 3266 Wiler bei Seedorf.",
};

export default function KontaktPage() {
  return (
    <>
      <section className="bg-[var(--color-primary)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Kontakt</h1>
          <p className="text-white/80 max-w-2xl text-lg">
            Wir freuen uns auf deine Nachricht. Nimm Kontakt mit uns auf!
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Schreib uns
              </h2>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Vorname
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nachname
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Betreff
                  </label>
                  <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]">
                    <option>Allgemeine Anfrage</option>
                    <option>Schulen / Anmeldung</option>
                    <option>Angebote / Events</option>
                    <option>Gästezimmer</option>
                    <option>Shop</option>
                    <option>Unterstützung / Spenden</option>
                    <option>Sonstiges</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nachricht
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[var(--color-primary)] text-white font-medium px-8 py-3 rounded-full hover:bg-[var(--color-primary-light)] transition-colors text-sm"
                >
                  Nachricht senden
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Kontaktdaten
                </h2>
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[var(--color-warm)] rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Adresse</p>
                      <p className="text-sm text-gray-600">
                        Jugend mit einer Mission
                        <br />
                        Hauptstrasse 15
                        <br />
                        3266 Wiler bei Seedorf
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[var(--color-warm)] rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Telefon</p>
                      <a
                        href="tel:+41323917030"
                        className="text-sm text-[var(--color-primary)] hover:underline"
                      >
                        +41 (0)32 391 70 30
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[var(--color-warm)] rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">E-Mail</p>
                      <a
                        href="mailto:info@jmemwiler.ch"
                        className="text-sm text-[var(--color-primary)] hover:underline"
                      >
                        info@jmemwiler.ch
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[var(--color-warm)] rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Telefonzeiten
                      </p>
                      <p className="text-sm text-gray-600">
                        Mo-Mi, Fr: 09:00-12:00 &amp; 14:00-17:00
                        <br />
                        Do: 09:00-12:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking */}
              <div className="bg-[var(--color-warm)] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Bankverbindung
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Bank:</strong> PostFinance AG, 3030 Bern
                  </p>
                  <p>
                    <strong>IBAN:</strong> CH90 0900 0000 2501 5842 2
                  </p>
                  <p>
                    <strong>BIC/SWIFT:</strong> POFICHBEXXX
                  </p>
                  <p>
                    <strong>Kontoinhaber:</strong> Jugend mit einer Mission,
                    Hauptstrasse 15, 3266 Wiler bei Seedorf
                  </p>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
                <p className="text-sm text-gray-400">
                  Karte: Hauptstrasse 15, 3266 Wiler bei Seedorf
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
