"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  LogOut,
  Loader2,
  Save,
  Package,
} from "lucide-react";
import { useAuth, type Customer } from "@/lib/AuthContext";

function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    plz: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        plz: user.plz,
        city: user.city,
        phone: user.phone,
      });
    }
  }, [user]);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    const err = await updateProfile(form as Partial<Customer>);
    if (err) {
      setError(err);
    } else {
      setMessage("Profil erfolgreich gespeichert.");
    }
    setSaving(false);
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]";

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vorname
          </label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nachname
          </label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          E-Mail
        </label>
        <input
          type="email"
          value={user?.email || ""}
          disabled
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PLZ
          </label>
          <input
            type="text"
            value={form.plz}
            onChange={(e) => updateField("plz", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ort
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefon
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className={inputClass}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white font-medium px-6 py-2.5 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        Speichern
      </button>
    </form>
  );
}

function OrdersTab() {
  const { orders } = useAuth();

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Noch keine Bestellungen vorhanden.</p>
        <Link
          href="/shop"
          className="inline-block mt-4 text-sm text-[var(--color-primary)] font-medium hover:underline"
        >
          Zum Shop
        </Link>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    pending: "Ausstehend",
    paid: "Bezahlt",
    shipped: "Versendet",
    cancelled: "Storniert",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-200 rounded-xl p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-sm font-bold text-gray-900">
                {order.id}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {new Date(order.createdAt).toLocaleDateString("de-CH")}
              </span>
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                statusColors[order.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {statusLabels[order.status] || order.status}
            </span>
          </div>

          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.sku}
                className="flex justify-between text-sm text-gray-600"
              >
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">
                  CHF {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
            <span className="text-sm font-medium text-gray-900">Total</span>
            <span className="text-sm font-bold text-[var(--color-primary)]">
              CHF {order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function KontoPage() {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profil" | "bestellungen">(
    "profil"
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <section className="bg-[var(--color-primary)] py-16">
          <div className="max-w-md mx-auto px-4 sm:px-6">
            <h1 className="text-3xl font-bold text-white">Mein Konto</h1>
            <p className="text-white/70 mt-2">
              Melde dich an oder erstelle ein Konto
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-md mx-auto px-4 sm:px-6 space-y-4">
            <Link
              href="/konto/login"
              className="block w-full text-center bg-[var(--color-primary)] text-white font-medium py-3 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"
            >
              Anmelden
            </Link>
            <Link
              href="/konto/register"
              className="block w-full text-center border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-medium py-3 rounded-xl hover:bg-[var(--color-primary)]/5 transition-colors"
            >
              Konto erstellen
            </Link>
          </div>
        </section>
      </>
    );
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  const tabs = [
    { key: "profil" as const, label: "Profil", icon: User },
    { key: "bestellungen" as const, label: "Bestellungen", icon: ShoppingBag },
  ];

  return (
    <>
      <section className="bg-[var(--color-primary)] py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-white">
            Hallo, {user?.firstName}!
          </h1>
          <p className="text-white/70 mt-2">Verwalte dein Konto und Bestellungen</p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Tab navigation */}
          <div className="flex items-center gap-1 border-b border-gray-200 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors ml-auto border-b-2 border-transparent"
            >
              <LogOut className="w-4 h-4" />
              Abmelden
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "profil" && <ProfileTab />}
          {activeTab === "bestellungen" && <OrdersTab />}
        </div>
      </section>
    </>
  );
}
