interface Env {
  ADMIN_SECRET: string;
  INVENTORY: KVNamespace;
}

// GET: Public - get stock counts
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (!context.env.INVENTORY) {
    return new Response(JSON.stringify({ inventory: {} }), {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // List all stock keys
    const list = await context.env.INVENTORY.list({ prefix: "stock:" });
    const inventory: Record<string, number> = {};

    for (const key of list.keys) {
      const val = await context.env.INVENTORY.get(key.name);
      if (val !== null) {
        const sku = key.name.replace("stock:", "");
        inventory[sku] = parseInt(val, 10);
      }
    }

    return new Response(JSON.stringify({ inventory }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Inventory fetch error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// PUT: Admin only - update inventory
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  const authHeader = context.request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || token !== context.env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  try {
    const body = await context.request.json();
    const { sku, stock } = body;

    if (!sku || stock === undefined) {
      return new Response(JSON.stringify({ error: "Missing sku or stock" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    await context.env.INVENTORY.put(`stock:${sku}`, String(Math.max(0, stock)));

    return new Response(JSON.stringify({ success: true, sku, stock }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Inventory update error:", err);
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
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
