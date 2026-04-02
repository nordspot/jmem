interface Env {
  CUSTOMERS: KVNamespace;
  ORDERS: KVNamespace;
  JWT_SECRET: string;
}

async function verifyJWT(
  token: string,
  secret: string
): Promise<{ email: string; firstName: string; lastName: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;

    // Verify signature
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(`${header}.${body}`)
    );
    if (!valid) return null;

    // Parse payload
    const payload = JSON.parse(atob(body));

    // Check expiration
    if (payload.exp && payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const authHeader = context.request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Nicht autorisiert." }),
        { status: 401, headers: corsHeaders }
      );
    }

    const payload = await verifyJWT(token, context.env.JWT_SECRET);
    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Token ungueltig oder abgelaufen." }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Get customer data
    const customerStr = await context.env.CUSTOMERS.get(
      `customer:${payload.email}`
    );
    if (!customerStr) {
      return new Response(
        JSON.stringify({ error: "Kunde nicht gefunden." }),
        { status: 404, headers: corsHeaders }
      );
    }

    const customer = JSON.parse(customerStr);
    const { passwordHash: _, ...safeCustomer } = customer;

    // Fetch customer orders
    let orders: unknown[] = [];
    if (context.env.ORDERS) {
      try {
        const indexStr = await context.env.ORDERS.get("order:index");
        const index: string[] = indexStr ? JSON.parse(indexStr) : [];

        for (const orderId of index) {
          const orderStr = await context.env.ORDERS.get(`order:${orderId}`);
          if (orderStr) {
            const order = JSON.parse(orderStr);
            const emailMatch =
              order.customerEmail?.toLowerCase() ===
                payload.email.toLowerCase() ||
              order.customer?.email?.toLowerCase() ===
                payload.email.toLowerCase();
            if (emailMatch) {
              orders.push(order);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    }

    return new Response(
      JSON.stringify({ customer: safeCustomer, orders }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Me endpoint error:", err);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler." }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// PUT: Update customer profile
export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const authHeader = context.request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Nicht autorisiert." }),
        { status: 401, headers: corsHeaders }
      );
    }

    const payload = await verifyJWT(token, context.env.JWT_SECRET);
    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Token ungueltig oder abgelaufen." }),
        { status: 401, headers: corsHeaders }
      );
    }

    const customerStr = await context.env.CUSTOMERS.get(
      `customer:${payload.email}`
    );
    if (!customerStr) {
      return new Response(
        JSON.stringify({ error: "Kunde nicht gefunden." }),
        { status: 404, headers: corsHeaders }
      );
    }

    const customer = JSON.parse(customerStr);
    const updates = await context.request.json();

    // Only allow updating certain fields
    const allowedFields = [
      "firstName",
      "lastName",
      "address",
      "plz",
      "city",
      "phone",
    ];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        customer[field] = updates[field];
      }
    }

    await context.env.CUSTOMERS.put(
      `customer:${payload.email}`,
      JSON.stringify(customer)
    );

    const { passwordHash: _, ...safeCustomer } = customer;

    return new Response(
      JSON.stringify({ customer: safeCustomer }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Profile update error:", err);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler." }),
      { status: 500, headers: corsHeaders }
    );
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
