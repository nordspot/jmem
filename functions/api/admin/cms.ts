interface Env {
  ADMIN_SECRET: string;
  GITHUB_TOKEN: string;
}

const REPO = "nordspot/jmem";

const FILES = [
  "src/lib/schools.ts",
  "src/lib/products.ts",
  "src/lib/testimonials.ts",
  "src/lib/i18n/de.ts",
  "src/app/angebote/page.tsx",
];

async function ghGet(path: string, token: string) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "jmem-cms",
    },
  });
  if (!res.ok) return null;
  const data: any = await res.json();
  return { content: atob(data.content), sha: data.sha };
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = context.request.headers.get("authorization");
  if (!auth || auth.replace("Bearer ", "") !== context.env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const files: Record<string, string | null> = {};
  for (const path of FILES) {
    const result = await ghGet(path, context.env.GITHUB_TOKEN);
    files[path] = result ? result.content : null;
  }

  return Response.json({ files });
};
