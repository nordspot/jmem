interface Env {
  ADMIN_SECRET: string;
  FORMS: KVNamespace;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: corsHeaders,
  });
}

function checkAuth(request: Request, env: Env): boolean {
  const auth = request.headers.get("Authorization");
  return !!auth && auth.replace("Bearer ", "") === env.ADMIN_SECRET;
}

// GET: List all forms (or single form via ?id=)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (!checkAuth(context.request, context.env)) return unauthorized();
  if (!context.env.FORMS) {
    return new Response(JSON.stringify({ forms: [] }), { headers: corsHeaders });
  }

  const url = new URL(context.request.url);
  const formId = url.searchParams.get("id");

  try {
    if (formId) {
      const formStr = await context.env.FORMS.get(`form:${formId}`);
      if (!formStr) {
        return new Response(JSON.stringify({ error: "Form not found" }), {
          status: 404,
          headers: corsHeaders,
        });
      }
      return new Response(formStr, { headers: corsHeaders });
    }

    // List all forms
    const indexStr = await context.env.FORMS.get("form:index");
    const index: string[] = indexStr ? JSON.parse(indexStr) : [];

    const forms = [];
    for (const id of index) {
      const formStr = await context.env.FORMS.get(`form:${id}`);
      if (formStr) {
        const form = JSON.parse(formStr);
        // Return summary only for list
        forms.push({
          id: form.id,
          name: form.name,
          slug: form.slug,
          linkedType: form.linkedType,
          linkedSlug: form.linkedSlug,
          fieldCount: form.fields?.length || 0,
          active: form.active,
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
        });
      }
    }

    return new Response(JSON.stringify({ forms }), { headers: corsHeaders });
  } catch (err) {
    console.error("Forms fetch error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// POST: Create or update a form
export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!checkAuth(context.request, context.env)) return unauthorized();

  try {
    const form = await context.request.json() as any;

    if (!form.id || !form.name) {
      return new Response(JSON.stringify({ error: "Missing id or name" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    form.updatedAt = new Date().toISOString();

    // Save the form
    await context.env.FORMS.put(`form:${form.id}`, JSON.stringify(form));

    // Update index
    const indexStr = await context.env.FORMS.get("form:index");
    const index: string[] = indexStr ? JSON.parse(indexStr) : [];
    if (!index.includes(form.id)) {
      index.push(form.id);
      await context.env.FORMS.put("form:index", JSON.stringify(index));
    }

    return new Response(JSON.stringify({ success: true, form }), {
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Form save error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// DELETE: Delete a form
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  if (!checkAuth(context.request, context.env)) return unauthorized();

  try {
    const { id } = await context.request.json() as any;
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    await context.env.FORMS.delete(`form:${id}`);

    // Update index
    const indexStr = await context.env.FORMS.get("form:index");
    const index: string[] = indexStr ? JSON.parse(indexStr) : [];
    const newIndex = index.filter((i) => i !== id);
    await context.env.FORMS.put("form:index", JSON.stringify(newIndex));

    return new Response(JSON.stringify({ success: true }), {
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Form delete error:", err);
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
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
