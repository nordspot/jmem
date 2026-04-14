interface Env {
  FORMS: KVNamespace;
  MAILCHANNELS_DKIM_DOMAIN?: string;
  MAILCHANNELS_DKIM_SELECTOR?: string;
  MAILCHANNELS_DKIM_PRIVATE_KEY?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

// POST: Submit a form (public, no auth)
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      formId: string;
      data: Record<string, string>;
      privacy?: boolean;
    };

    const { formId, data, privacy } = body;

    if (!formId || !data) {
      return new Response(JSON.stringify({ error: "Missing formId or data" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Load the form definition
    const formStr = await context.env.FORMS.get(`form:${formId}`);
    if (!formStr) {
      return new Response(JSON.stringify({ error: "Form not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const form = JSON.parse(formStr);

    if (!form.active) {
      return new Response(
        JSON.stringify({ error: "This form is no longer accepting submissions" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate required fields
    for (const field of form.fields) {
      if (field.required && field.type !== "display" && field.type !== "privacy") {
        if (!data[field.id] || !data[field.id].trim()) {
          return new Response(
            JSON.stringify({
              error: `Feld "${field.label}" ist erforderlich`,
              fieldId: field.id,
            }),
            { status: 400, headers: corsHeaders }
          );
        }
      }
    }

    // Check privacy acceptance
    const hasPrivacyField = form.fields.some((f: any) => f.type === "privacy");
    if (hasPrivacyField && !privacy) {
      return new Response(
        JSON.stringify({ error: "Bitte akzeptiere die Datenschutzbestimmungen" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Build labels map
    const labels: Record<string, string> = {};
    for (const field of form.fields) {
      if (field.type !== "display" && field.type !== "privacy") {
        labels[field.id] = field.label;
      }
    }

    // Create submission
    const submissionId = crypto.randomUUID();
    const submission = {
      id: submissionId,
      formId,
      formName: form.name,
      data,
      labels,
      submittedAt: new Date().toISOString(),
    };

    // Save submission
    await context.env.FORMS.put(
      `submission:${submissionId}`,
      JSON.stringify(submission),
      { expirationTtl: 60 * 60 * 24 * 365 * 2 } // 2 years
    );

    // Update submission index
    const indexStr = await context.env.FORMS.get(`submissions:${formId}:index`);
    const index: string[] = indexStr ? JSON.parse(indexStr) : [];
    index.push(submissionId);
    await context.env.FORMS.put(
      `submissions:${formId}:index`,
      JSON.stringify(index)
    );

    // Build merge data for email templates
    const mergeData: Record<string, string> = {};
    for (const field of form.fields) {
      if (field.mergeTag && data[field.id]) {
        mergeData[field.mergeTag] = data[field.id];
      }
      // Also allow access by label (lowercase, no spaces)
      if (data[field.id]) {
        mergeData[field.label.toLowerCase().replace(/\s+/g, "_")] = data[field.id];
      }
    }

    // Build "all fields" summary for admin email
    const allFieldsSummary = form.fields
      .filter((f: any) => f.type !== "display" && f.type !== "privacy" && data[f.id])
      .map((f: any) => `${f.label}: ${data[f.id]}`)
      .join("\n");
    mergeData["alle_felder"] = allFieldsSummary;

    // Send emails (fire and forget — don't block the response)
    const emailPromises: Promise<void>[] = [];

    // Email to admin
    if (form.emailToAdmin?.enabled && form.adminRecipients?.length > 0) {
      const subject = replaceMergeTags(
        form.emailToAdmin.subject || `Neue Anmeldung: ${form.name}`,
        mergeData
      );
      const body =
        form.emailToAdmin.body
          ? replaceMergeTags(form.emailToAdmin.body, mergeData)
          : allFieldsSummary;

      for (const recipient of form.adminRecipients) {
        emailPromises.push(
          sendEmail(
            {
              to: recipient,
              from: form.emailToAdmin.fromEmail || "noreply@jmemwiler.ch",
              fromName: form.emailToAdmin.fromName || "JMEM Wiler",
              subject,
              body,
            },
            context.env
          )
        );
      }
    }

    // Email to visitor
    if (form.emailToVisitor?.enabled) {
      // Find the email field
      const emailField = form.fields.find(
        (f: any) => f.type === "email" || f.mergeTag === "email"
      );
      const visitorEmail = emailField ? data[emailField.id] : null;

      if (visitorEmail) {
        const subject = replaceMergeTags(
          form.emailToVisitor.subject || `Bestätigung: ${form.name}`,
          mergeData
        );
        const body = replaceMergeTags(
          form.emailToVisitor.body || "Vielen Dank für deine Anmeldung!",
          mergeData
        );

        emailPromises.push(
          sendEmail(
            {
              to: visitorEmail,
              from: form.emailToVisitor.fromEmail || "noreply@jmemwiler.ch",
              fromName: form.emailToVisitor.fromName || "JMEM Wiler",
              subject,
              body,
            },
            context.env
          )
        );
      }
    }

    // Don't await emails — they happen in the background
    context.waitUntil(Promise.allSettled(emailPromises));

    // Build response page content
    const responsePage = form.responsePage || {};
    const responseTitle = replaceMergeTags(
      responsePage.title || "Vielen Dank!",
      mergeData
    );
    const responseMessage = replaceMergeTags(
      responsePage.message || "Deine Anmeldung wurde erfolgreich gesendet.",
      mergeData
    );

    return new Response(
      JSON.stringify({
        success: true,
        submissionId,
        responsePage: { title: responseTitle, message: responseMessage },
      }),
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("Form submission error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

function replaceMergeTags(
  template: string,
  data: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (match, tag) => {
    return data[tag] || match;
  });
}

async function sendEmail(
  params: {
    to: string;
    from: string;
    fromName: string;
    subject: string;
    body: string;
  },
  env: Env
): Promise<void> {
  try {
    const payload: any = {
      personalizations: [{ to: [{ email: params.to }] }],
      from: { email: params.from, name: params.fromName },
      subject: params.subject,
      content: [{ type: "text/plain", value: params.body }],
    };

    // Add DKIM if configured
    if (
      env.MAILCHANNELS_DKIM_DOMAIN &&
      env.MAILCHANNELS_DKIM_SELECTOR &&
      env.MAILCHANNELS_DKIM_PRIVATE_KEY
    ) {
      payload.personalizations[0].dkim_domain = env.MAILCHANNELS_DKIM_DOMAIN;
      payload.personalizations[0].dkim_selector = env.MAILCHANNELS_DKIM_SELECTOR;
      payload.personalizations[0].dkim_private_key =
        env.MAILCHANNELS_DKIM_PRIVATE_KEY;
    }

    await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
}

// GET: Get form definition (public, for rendering)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const formId = url.searchParams.get("formId");
  const slug = url.searchParams.get("slug");

  if (!formId && !slug) {
    return new Response(JSON.stringify({ error: "Missing formId or slug" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    let formStr: string | null = null;

    if (formId) {
      formStr = await context.env.FORMS.get(`form:${formId}`);
    } else if (slug) {
      // Search by slug — check index
      const indexStr = await context.env.FORMS.get("form:index");
      const index: string[] = indexStr ? JSON.parse(indexStr) : [];
      for (const id of index) {
        const str = await context.env.FORMS.get(`form:${id}`);
        if (str) {
          const form = JSON.parse(str);
          if (form.slug === slug && form.active) {
            formStr = str;
            break;
          }
        }
      }
    }

    if (!formStr) {
      return new Response(JSON.stringify({ error: "Form not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const form = JSON.parse(formStr);

    // Return only public-safe fields
    return new Response(
      JSON.stringify({
        id: form.id,
        name: form.name,
        slug: form.slug,
        fields: form.fields,
        active: form.active,
        responsePage: form.responsePage,
      }),
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("Form fetch error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
