"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DynamicForm } from "./DynamicForm";

interface SchoolFormSectionProps {
  slug: string;
}

export function SchoolFormSection({ slug }: SchoolFormSectionProps) {
  const [hasForm, setHasForm] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check if there's a form linked to this school
    fetch(`/api/forms/submit?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) setHasForm(data.id);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [slug]);

  if (!checked) return null;

  if (hasForm) {
    return (
      <div className="mt-12">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Anmeldung</h3>
        <DynamicForm formId={hasForm} />
      </div>
    );
  }

  // Fallback: simple contact link
  return (
    <div className="mt-12">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Interesse?</h3>
      <p className="text-gray-600 mb-6">
        Nimm Kontakt mit uns auf für weitere Informationen oder um dich
        anzumelden.
      </p>
      <Link
        href="/kontakt"
        className="inline-flex bg-[var(--color-primary)] text-white font-medium px-6 py-3 rounded-full hover:bg-[var(--color-primary-light)] transition-colors text-sm"
      >
        Kontakt aufnehmen
      </Link>
    </div>
  );
}
