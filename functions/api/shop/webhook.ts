interface Env {
  PAYREXX_SECRET: string;
  ORDERS: KVNamespace;
  INVENTORY: KVNamespace;
}

interface Order {
  id: string;
  items: { sku: string; name: string; price: number; quantity: number }[];
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
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt: string;
  payrexxGatewayId?: string;
  paidAt?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json();
    const transaction = body.transaction;

    if (!transaction) {
      return new Response(JSON.stringify({ error: "No transaction data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const referenceId = transaction.referenceId || transaction.invoice?.referenceId;
    const status = transaction.status;

    if (!referenceId) {
      return new Response(JSON.stringify({ error: "No reference ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Load order from KV
    if (!context.env.ORDERS) {
      return new Response(JSON.stringify({ error: "KV not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const orderStr = await context.env.ORDERS.get(`order:${referenceId}`);
    if (!orderStr) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const order: Order = JSON.parse(orderStr);

    // Update order status based on Payrexx status
    if (status === "confirmed" || status === "authorized") {
      order.status = "paid";
      order.paidAt = new Date().toISOString();

      // Decrease inventory
      if (context.env.INVENTORY) {
        for (const item of order.items) {
          const stockStr = await context.env.INVENTORY.get(`stock:${item.sku}`);
          if (stockStr !== null) {
            const newStock = Math.max(0, parseInt(stockStr, 10) - item.quantity);
            await context.env.INVENTORY.put(`stock:${item.sku}`, String(newStock));
          }
        }
      }
    } else if (status === "declined" || status === "error" || status === "cancelled") {
      order.status = "cancelled";
    }

    // Save updated order
    await context.env.ORDERS.put(`order:${referenceId}`, JSON.stringify(order), {
      expirationTtl: 60 * 60 * 24 * 365,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
