interface Env {
  ADMIN_SECRET: string;
  ANTHROPIC_API_KEY: string;
  GITHUB_TOKEN: string;
}

const REPO = "nordspot/jmem";

const SYSTEM_PROMPT = `You are the CMS agent for the JMEM Wiler website (jmemwiler.ch). You help the admin manage the website content by modifying files in the codebase.

## Your capabilities:
- Add/edit/remove products in the shop (src/lib/products.ts)
- Add/edit/remove schools and their details (src/lib/schools.ts)
- Add/edit/remove offerings/programs (src/app/angebote/page.tsx)
- Add/edit/remove testimonials (src/lib/testimonials.ts)
- Edit page content (src/app/*/page.tsx)
- Edit translations (src/lib/i18n/de.ts, src/lib/i18n/en.ts)

## Rules:
1. Always respond with a JSON object containing:
   - "message": A human-readable summary of what you did (in German)
   - "changes": An array of file changes, each with "path" and "content" (full file content)
   - "commitMessage": A concise commit message describing the change
2. If you need to see a file before editing, respond with:
   - "needsFiles": An array of file paths you need to read
3. If the request is unclear, respond with:
   - "question": A clarifying question (in German)
4. NEVER modify core framework files, only content/data files
5. Keep the same code style and formatting
6. Write commit messages in English, summaries in German`;

async function ghGet(path: string, token: string) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "jmem-cms" },
  });
  if (!res.ok) return null;
  const data: any = await res.json();
  return { content: atob(data.content), sha: data.sha };
}

async function ghCommit(changes: { path: string; content: string }[], message: string, token: string) {
  const h = { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "jmem-cms", "Content-Type": "application/json" };

  const refRes = await fetch(`https://api.github.com/repos/${REPO}/git/ref/heads/master`, { headers: h });
  const refData: any = await refRes.json();
  const latestSha = refData.object.sha;

  const commitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits/${latestSha}`, { headers: h });
  const commitData: any = await commitRes.json();

  const treeItems = await Promise.all(changes.map(async (c) => {
    const blobRes = await fetch(`https://api.github.com/repos/${REPO}/git/blobs`, {
      method: "POST", headers: h, body: JSON.stringify({ content: c.content, encoding: "utf-8" }),
    });
    const blob: any = await blobRes.json();
    return { path: c.path, mode: "100644" as const, type: "blob" as const, sha: blob.sha };
  }));

  const treeRes = await fetch(`https://api.github.com/repos/${REPO}/git/trees`, {
    method: "POST", headers: h, body: JSON.stringify({ base_tree: commitData.tree.sha, tree: treeItems }),
  });
  const tree: any = await treeRes.json();

  const newCommitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits`, {
    method: "POST", headers: h,
    body: JSON.stringify({
      message: `[CMS Agent] ${message}`, tree: tree.sha, parents: [latestSha],
      author: { name: "JMEM CMS Agent", email: "cms@jmemwiler.ch", date: new Date().toISOString() },
    }),
  });
  const newCommit: any = await newCommitRes.json();

  await fetch(`https://api.github.com/repos/${REPO}/git/refs/heads/master`, {
    method: "PATCH", headers: h, body: JSON.stringify({ sha: newCommit.sha }),
  });

  return { sha: newCommit.sha };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = context.request.headers.get("authorization");
  if (!auth || auth.replace("Bearer ", "") !== context.env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const { prompt, fileContents } = await context.request.json() as any;
  if (!prompt) return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });

  let userContent = prompt;
  if (fileContents && Object.keys(fileContents).length > 0) {
    let ctx = "Here are the current file contents:\n\n";
    for (const [path, content] of Object.entries(fileContents)) {
      ctx += `### ${path}\n\`\`\`\n${content}\n\`\`\`\n\n`;
    }
    userContent = ctx + `\nNow, please process this request: ${prompt}`;
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": context.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8192, system: SYSTEM_PROMPT, messages: [{ role: "user", content: userContent }] }),
  });

  if (!res.ok) return new Response(JSON.stringify({ error: `Claude API error: ${res.status}` }), { status: 502 });

  const data: any = await res.json();
  const text = data.content?.[0]?.text;
  if (!text) return new Response(JSON.stringify({ error: "Empty response" }), { status: 502 });

  let parsed;
  try {
    const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    parsed = JSON.parse(m ? m[1] : text);
  } catch {
    return Response.json({ type: "message", content: text });
  }

  if (parsed.needsFiles) {
    const files: Record<string, string> = {};
    for (const p of parsed.needsFiles) {
      const f = await ghGet(p, context.env.GITHUB_TOKEN);
      if (f) files[p] = f.content;
    }
    return Response.json({ type: "needsFiles", files, originalPrompt: prompt });
  }

  if (parsed.question) return Response.json({ type: "question", content: parsed.question });

  if (parsed.changes?.length > 0) {
    const result = await ghCommit(parsed.changes, parsed.commitMessage || "Content update", context.env.GITHUB_TOKEN);
    return Response.json({
      type: "committed", message: parsed.message, commitSha: result.sha,
      filesChanged: parsed.changes.map((c: any) => c.path),
    });
  }

  return Response.json({ type: "message", content: parsed.message || text });
};
