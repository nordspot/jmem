interface Env {
  ADMIN_SECRET: string;
  ORDERS: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  // Verify admin auth
  const authHeader = context.request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || token !== context.env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  if (!context.env.ORDERS) {
    return new Response(JSON.stringify({ orders: [] }), {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get order index
    const indexStr = await context.env.ORDERS.get("order:index");
    const index: string[] = indexStr ? JSON.parse(indexStr) : [];

    // Fetch all orders
    const orders = [];
    for (const orderId of index) {
      const orderStr = await context.env.ORDERS.get(`order:${orderId}`);
      if (orderStr) {
        orders.push(JSON.parse(orderStr));
      }
    }

    return new Response(JSON.stringify({ orders }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Orders fetch error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// PUT: Update order status (admin only)
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
    const { orderId, status } = body;

    if (!orderId || !status) {
      return new Response(JSON.stringify({ error: "Missing orderId or status" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const orderStr = await context.env.ORDERS.get(`order:${orderId}`);
    if (!orderStr) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const order = JSON.parse(orderStr);
    order.status = status;

    await context.env.ORDERS.put(`order:${orderId}`, JSON.stringify(order), {
      expirationTtl: 60 * 60 * 24 * 365,
    });

    return new Response(JSON.stringify({ success: true, order }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Order update error:", err);
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
