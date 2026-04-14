interface Env {
  ADMIN_SECRET: string;
  FORMS: KVNamespace;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

function checkAuth(request: Request, env: Env): boolean {
  const auth = request.headers.get("Authorization");
  return !!auth && auth.replace("Bearer ", "") === env.ADMIN_SECRET;
}

// GET: List submissions for a form
export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (!checkAuth(context.request, context.env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  const url = new URL(context.request.url);
  const formId = url.searchParams.get("formId");
  const format = url.searchParams.get("format"); // "csv" for Excel export

  if (!formId) {
    return new Response(JSON.stringify({ error: "Missing formId" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    // Get submission index for this form
    const indexStr = await context.env.FORMS.get(`submissions:${formId}:index`);
    const index: string[] = indexStr ? JSON.parse(indexStr) : [];

    const submissions = [];
    for (const subId of index) {
      const subStr = await context.env.FORMS.get(`submission:${subId}`);
      if (subStr) {
        submissions.push(JSON.parse(subStr));
      }
    }

    // Sort by date descending
    submissions.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    if (format === "csv") {
      // Generate CSV for Excel export
      if (submissions.length === 0) {
        return new Response("Keine Einträge", {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="anmeldungen.csv"`,
          },
        });
      }

      // Collect all unique field labels in order
      const fieldOrder: { id: string; label: string }[] = [];
      const seenFields = new Set<string>();
      for (const sub of submissions) {
        for (const [fieldId, label] of Object.entries(sub.labels || {})) {
          if (!seenFields.has(fieldId)) {
            seenFields.add(fieldId);
            fieldOrder.push({ id: fieldId, label: label as string });
          }
        }
      }

      // BOM for Excel UTF-8 detection
      const BOM = "\uFEFF";
      const sep = ";"; // semicolon works better in European Excel

      // Header row
      const headers = ["Datum", ...fieldOrder.map((f) => f.label)];
      const csvRows = [headers.map(escapeCSV).join(sep)];

      for (const sub of submissions) {
        const row = [
          new Date(sub.submittedAt).toLocaleString("de-CH"),
          ...fieldOrder.map((f) => sub.data[f.id] || ""),
        ];
        csvRows.push(row.map(escapeCSV).join(sep));
      }

      return new Response(BOM + csvRows.join("\r\n"), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="anmeldungen-${formId.slice(0, 8)}.csv"`,
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(JSON.stringify({ submissions, total: submissions.length }), {
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Submissions fetch error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// DELETE: Delete a submission
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  if (!checkAuth(context.request, context.env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  try {
    const { submissionId, formId } = (await context.request.json()) as any;
    if (!submissionId || !formId) {
      return new Response(
        JSON.stringify({ error: "Missing submissionId or formId" }),
        { status: 400, headers: corsHeaders }
      );
    }

    await context.env.FORMS.delete(`submission:${submissionId}`);

    // Update index
    const indexStr = await context.env.FORMS.get(`submissions:${formId}:index`);
    const index: string[] = indexStr ? JSON.parse(indexStr) : [];
    const newIndex = index.filter((i) => i !== submissionId);
    await context.env.FORMS.put(
      `submissions:${formId}:index`,
      JSON.stringify(newIndex)
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Submission delete error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

function escapeCSV(value: string): string {
  if (!value) return '""';
  const str = String(value);
  if (str.includes(";") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
