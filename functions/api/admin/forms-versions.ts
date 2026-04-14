interface Env {
  ADMIN_SECRET: string;
  FORMS: KVNamespace;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

const MAX_VERSIONS = 20;

function checkAuth(request: Request, env: Env): boolean {
  const auth = request.headers.get("Authorization");
  return !!auth && auth.replace("Bearer ", "") === env.ADMIN_SECRET;
}

// GET: List versions or get a specific version snapshot
export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (!checkAuth(context.request, context.env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  const url = new URL(context.request.url);
  const formId = url.searchParams.get("formId");
  const timestamp = url.searchParams.get("timestamp");

  if (!formId) {
    return new Response(JSON.stringify({ error: "Missing formId" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    if (timestamp) {
      // Return a specific version
      const key = `version:${formId}:${timestamp}`;
      const snapshotStr = await context.env.FORMS.get(key);
      if (!snapshotStr) {
        return new Response(JSON.stringify({ error: "Version not found" }), {
          status: 404,
          headers: corsHeaders,
        });
      }
      return new Response(
        JSON.stringify({ snapshot: JSON.parse(snapshotStr) }),
        { headers: corsHeaders }
      );
    }

    // List versions
    const indexStr = await context.env.FORMS.get(`versions:${formId}:index`);
    const index: { timestamp: string; name: string }[] = indexStr
      ? JSON.parse(indexStr)
      : [];

    return new Response(JSON.stringify({ versions: index }), {
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Versions fetch error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// POST: Save a new version snapshot
export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!checkAuth(context.request, context.env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  try {
    const { formId, snapshot } = (await context.request.json()) as {
      formId: string;
      snapshot: any;
    };

    if (!formId || !snapshot) {
      return new Response(JSON.stringify({ error: "Missing data" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const timestamp = new Date().toISOString();
    const key = `version:${formId}:${timestamp}`;

    // Save snapshot
    await context.env.FORMS.put(key, JSON.stringify(snapshot), {
      expirationTtl: 60 * 60 * 24 * 90, // 90 days
    });

    // Update version index
    const indexStr = await context.env.FORMS.get(`versions:${formId}:index`);
    const index: { timestamp: string; name: string }[] = indexStr
      ? JSON.parse(indexStr)
      : [];

    index.unshift({ timestamp, name: snapshot.name || "Unbenannt" });

    // Cap to MAX_VERSIONS — delete old snapshots
    if (index.length > MAX_VERSIONS) {
      const removed = index.splice(MAX_VERSIONS);
      for (const old of removed) {
        await context.env.FORMS.delete(`version:${formId}:${old.timestamp}`);
      }
    }

    await context.env.FORMS.put(
      `versions:${formId}:index`,
      JSON.stringify(index)
    );

    return new Response(JSON.stringify({ success: true, timestamp }), {
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Version save error:", err);
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
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
