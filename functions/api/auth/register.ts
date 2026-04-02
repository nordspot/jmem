interface Env {
  CUSTOMERS: KVNamespace;
  JWT_SECRET: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  plz: string;
  city: string;
  phone: string;
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
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
  return (
    btoa(String.fromCharCode(...salt)) +
    ":" +
    btoa(String.fromCharCode(...new Uint8Array(bits)))
  );
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
    const body: RegisterRequest = await context.request.json();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({ error: "Bitte gib eine gueltige E-Mail-Adresse ein." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate password
    if (!body.password || body.password.length < 8) {
      return new Response(
        JSON.stringify({
          error: "Das Passwort muss mindestens 8 Zeichen lang sein.",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate required fields
    if (!body.firstName || !body.lastName) {
      return new Response(
        JSON.stringify({ error: "Vor- und Nachname sind erforderlich." }),
        { status: 400, headers: corsHeaders }
      );
    }

    const email = body.email.toLowerCase().trim();

    // Check if email already exists
    const existing = await context.env.CUSTOMERS.get(`customer:${email}`);
    if (existing) {
      return new Response(
        JSON.stringify({
          error: "Diese E-Mail-Adresse ist bereits registriert.",
        }),
        { status: 409, headers: corsHeaders }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(body.password);

    // Create customer record
    const customer = {
      email,
      firstName: body.firstName,
      lastName: body.lastName,
      address: body.address || "",
      plz: body.plz || "",
      city: body.city || "",
      phone: body.phone || "",
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    // Store in KV
    await context.env.CUSTOMERS.put(
      `customer:${email}`,
      JSON.stringify(customer)
    );

    // Create JWT
    const token = await createJWT(
      { email, firstName: customer.firstName, lastName: customer.lastName },
      context.env.JWT_SECRET
    );

    // Return token and customer data (without password)
    const { passwordHash: _, ...safeCustomer } = customer;

    return new Response(
      JSON.stringify({ token, customer: safeCustomer }),
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Register error:", err);
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
