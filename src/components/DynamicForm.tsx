"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import type { FormField } from "@/lib/forms";

interface PublicForm {
  id: string;
  name: string;
  fields: FormField[];
  responsePage: { title?: string; message?: string };
}

interface DynamicFormProps {
  formId?: string;
  formSlug?: string;
}

export function DynamicForm({ formId, formSlug }: DynamicFormProps) {
  const [form, setForm] = useState<PublicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [privacy, setPrivacy] = useState(false);
  const [response, setResponse] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    loadForm();
  }, [formId, formSlug]);

  async function loadForm() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (formId) params.set("formId", formId);
      if (formSlug) params.set("slug", formSlug);

      const res = await fetch(`/api/forms/submit?${params}`);
      const data = await res.json();

      if (data.id) {
        setForm(data);
        // Initialize values
        const initial: Record<string, string> = {};
        for (const field of data.fields) {
          if (field.type !== "display" && field.type !== "privacy") {
            initial[field.id] = "";
          }
        }
        setValues(initial);
      }
    } catch {
      setError("Formular konnte nicht geladen werden.");
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form || submitting) return;

    setError("");
    setFieldError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: form.id,
          data: values,
          privacy,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setResponse(data.responsePage);
      } else {
        setError(data.error || "Ein Fehler ist aufgetreten.");
        if (data.fieldId) setFieldError(data.fieldId);
      }
    } catch {
      setError("Verbindungsfehler. Bitte versuche es erneut.");
    }

    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  if (!form) {
    return null; // Don't show anything if form not found
  }

  // Success state
  if (submitted && response) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">{response.title}</h3>
        <p className="text-gray-600 whitespace-pre-wrap">{response.message}</p>
      </div>
    );
  }

  // Group half-width fields into rows
  const rows: FormField[][] = [];
  let currentRow: FormField[] = [];
  for (const field of form.fields) {
    if (field.width === "half") {
      currentRow.push(field);
      if (currentRow.length === 2) {
        rows.push(currentRow);
        currentRow = [];
      }
    } else {
      if (currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
      }
      rows.push([field]);
    }
  }
  if (currentRow.length > 0) rows.push(currentRow);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={row.length > 1 ? "grid sm:grid-cols-2 gap-5" : ""}
        >
          {row.map((field) => (
            <div key={field.id}>
              {field.type === "display" ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {field.displayText}
                </p>
              ) : field.type === "privacy" ? (
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={privacy}
                    onChange={(e) => setPrivacy(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
                  />
                  <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {field.displayText}
                  </span>
                </label>
              ) : field.type === "checkbox" ? (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values[field.id] === "Ja"}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [field.id]: e.target.checked ? "Ja" : "Nein",
                      }))
                    }
                    className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
                  />
                  <span className="text-sm text-gray-700">{field.label}</span>
                </label>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label}
                    {field.required && (
                      <span className="text-[var(--color-accent)] ml-0.5">*</span>
                    )}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={values[field.id] || ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [field.id]: e.target.value,
                        }))
                      }
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={4}
                      className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] resize-none transition-colors ${
                        fieldError === field.id
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={values[field.id] || ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [field.id]: e.target.value,
                        }))
                      }
                      required={field.required}
                      className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors ${
                        fieldError === field.id
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    >
                      <option value="">
                        {field.placeholder || "Bitte wählen..."}
                      </option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={
                        field.type === "email"
                          ? "email"
                          : field.type === "number"
                            ? "number"
                            : field.type === "date"
                              ? "date"
                              : field.type === "phone"
                                ? "tel"
                                : "text"
                      }
                      value={values[field.id] || ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [field.id]: e.target.value,
                        }))
                      }
                      placeholder={field.placeholder}
                      required={field.required}
                      className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors ${
                        fieldError === field.id
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="bg-[var(--color-primary)] text-white font-medium px-8 py-3 rounded-full hover:bg-[var(--color-primary-light)] transition-colors text-sm disabled:opacity-60 flex items-center gap-2"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitting ? "Wird gesendet..." : "Anmeldung absenden"}
      </button>
    </form>
  );
}
