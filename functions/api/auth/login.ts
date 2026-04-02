interface Env {
  CUSTOMERS: KVNamespace;
  JWT_SECRET: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const [saltB64, hashB64] = hash.split(":");
  const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    key,
    256
  );
  return btoa(String.fromCharCode(...new Uint8Array(bits))) === hashB64;
}

async function createJWT(
  payload: object,
  secret: string
): Promise<string> {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(
    JSON.stringify({ ...payload, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 })
  );
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${header}.${body}`)
  );
  return `${header}.${body}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body: LoginRequest = await context.request.json();

    if (!body.email || !body.password) {
      return new Response(
        JSON.stringify({ error: "E-Mail und Passwort sind erforderlich." }),
        { status: 400, headers: corsHeaders }
      );
    }

    const email = body.email.toLowerCase().trim();

    // Look up customer
    const customerStr = await context.env.CUSTOMERS.get(`customer:${email}`);
    if (!customerStr) {
      return new Response(
        JSON.stringify({ error: "E-Mail oder Passwort ist falsch." }),
        { status: 401, headers: corsHeaders }
      );
    }

    const customer = JSON.parse(customerStr);

    // Verify password
    const valid = await verifyPassword(body.password, customer.passwordHash);
    if (!valid) {
      return new Response(
        JSON.stringify({ error: "E-Mail oder Passwort ist falsch." }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Create JWT
    const token = await createJWT(
      { email, firstName: customer.firstName, lastName: customer.lastName },
      context.env.JWT_SECRET
    );

    // Return token and customer data (without password)
    const { passwordHash: _, ...safeCustomer } = customer;

    return new Response(
      JSON.stringify({ token, customer: safeCustomer }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Login error:", err);
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
