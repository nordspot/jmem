interface Env {
  PAYREXX_INSTANCE: string;
  PAYREXX_SECRET: string;
  ORDERS: KVNamespace;
  INVENTORY: KVNamespace;
}

interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutRequest {
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
    notes: string;
  };
  customerEmail?: string;
  totalAmount: number;
}

interface Order {
  id: string;
  items: CartItem[];
  customer: CheckoutRequest["customer"];
  customerEmail?: string;
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt: string;
  payrexxGatewayId?: string;
}

function generateOrderId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${date}-${rand}`;
}

async function payrexxSign(query: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(query));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function createPayrexxGateway(
  env: Env,
  order: Order,
  successUrl: string,
  cancelUrl: string
): Promise<{ id: number; link: string } | null> {
  if (!env.PAYREXX_INSTANCE || !env.PAYREXX_SECRET) {
    return null;
  }

  const amountInCents = Math.round(order.totalAmount * 100);

  const params = new URLSearchParams();
  params.set("amount", String(amountInCents));
  params.set("currency", "CHF");
  params.set("successRedirectUrl", successUrl);
  params.set("failedRedirectUrl", cancelUrl);
  params.set("cancelRedirectUrl", cancelUrl);
  params.set("referenceId", order.id);
  params.set("purpose", `JMEM Wiler Bestellung ${order.id}`);
  params.set("fields[email][value]", order.customer.email);
  params.set("fields[forename][value]", order.customer.name.split(" ")[0] || "");
  params.set("fields[surname][value]", order.customer.name.split(" ").slice(1).join(" ") || "");
  params.set("fields[street][value]", order.customer.address);
  params.set("fields[postcode][value]", order.customer.zip);
  params.set("fields[place][value]", order.customer.city);
  params.set("fields[country][value]", order.customer.country);

  const queryString = params.toString();
  const signature = await payrexxSign(queryString, env.PAYREXX_SECRET);

  const url = `https://${env.PAYREXX_INSTANCE}.payrexx.com/api/v1/Gateway/`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `${queryString}&ApiSignature=${encodeURIComponent(signature)}&instance=${env.PAYREXX_INSTANCE}`,
    });

    const data = await res.json();

    if (data.status === "error") {
      console.error("Payrexx error:", data.message);
      return null;
    }

    return {
      id: data.data?.[0]?.id || data.data?.id,
      link: data.data?.[0]?.link || data.data?.link,
    };
  } catch (err) {
    console.error("Payrexx API error:", err);
    return null;
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const body: CheckoutRequest = await context.request.json();

    // Validate request
    if (!body.items || body.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Keine Artikel im Warenkorb." }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!body.customer?.name || !body.customer?.email || !body.customer?.address) {
      return new Response(
        JSON.stringify({ error: "Bitte fülle alle Pflichtfelder aus." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check inventory (if KV is available)
    if (context.env.INVENTORY) {
      for (const item of body.items) {
        const stockStr = await context.env.INVENTORY.get(`stock:${item.sku}`);
        if (stockStr !== null) {
          const stock = parseInt(stockStr, 10);
          if (stock < item.quantity) {
            return new Response(
              JSON.stringify({
                error: `"${item.name}" ist leider nicht mehr in ausreichender Menge verfügbar.`,
              }),
              { status: 400, headers: corsHeaders }
            );
          }
        }
      }
    }

    // Recalculate total server-side
    const calculatedTotal = body.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const order: Order = {
      id: generateOrderId(),
      items: body.items,
      customer: body.customer,
      customerEmail: body.customerEmail || body.customer.email,
      totalAmount: calculatedTotal,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Determine URLs
    const origin = new URL(context.request.url).origin;
    const successUrl = `${origin}/checkout/success?order=${order.id}`;
    const cancelUrl = `${origin}/checkout/cancel`;

    // Create Payrexx gateway
    const gateway = await createPayrexxGateway(
      context.env,
      order,
      successUrl,
      cancelUrl
    );

    if (gateway) {
      order.payrexxGatewayId = String(gateway.id);
    }

    // Store order in KV
    if (context.env.ORDERS) {
      await context.env.ORDERS.put(`order:${order.id}`, JSON.stringify(order), {
        expirationTtl: 60 * 60 * 24 * 365, // 1 year
      });

      // Add to order index
      const indexStr = await context.env.ORDERS.get("order:index");
      const index: string[] = indexStr ? JSON.parse(indexStr) : [];
      index.unshift(order.id);
      await context.env.ORDERS.put("order:index", JSON.stringify(index));
    }

    return new Response(
      JSON.stringify({
        orderId: order.id,
        paymentUrl: gateway?.link || null,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler." }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
