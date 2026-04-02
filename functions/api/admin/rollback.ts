interface Env {
  ADMIN_SECRET: string;
  GITHUB_TOKEN: string;
}

const REPO = "nordspot/jmem";

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = context.request.headers.get("authorization");
  if (!auth || auth.replace("Bearer ", "") !== context.env.ADMIN_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = context.request.headers.get("cf-connecting-ip") || "unknown";
  if (!checkRateLimit(ip)) {
    return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { sha } = await context.request.json() as any;
  if (!sha || typeof sha !== "string") {
    return Response.json({ error: "Missing commit SHA" }, { status: 400 });
  }

  // SECURITY: Validate SHA format (40 hex chars)
  if (!/^[0-9a-f]{40}$/i.test(sha)) {
    return Response.json({ error: "Invalid SHA format" }, { status: 400 });
  }

  const h = { Authorization: `token ${context.env.GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json", "User-Agent": "jmem-cms", "Content-Type": "application/json" };

  try {
    const commitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits/${sha}`, { headers: h });
    if (!commitRes.ok) {
      return Response.json({ error: "Commit not found" }, { status: 404 });
    }
    const commitData: any = await commitRes.json();

    // SECURITY: Only allow reverting agent commits
    if (!commitData.message?.startsWith("[CMS Agent]")) {
      return Response.json({ error: "Nur CMS-Agent-Commits können rückgängig gemacht werden." }, { status: 403 });
    }

    if (!commitData.parents?.length) {
      return Response.json({ error: "Cannot revert initial commit" }, { status: 400 });
    }

    const refRes = await fetch(`https://api.github.com/repos/${REPO}/git/ref/heads/master`, { headers: h });
    const refData: any = await refRes.json();

    const parentRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits/${commitData.parents[0].sha}`, { headers: h });
    const parentData: any = await parentRes.json();

    const revertMsg = `[CMS Agent] Revert: ${commitData.message.replace("[CMS Agent] ", "")}`;
    const newCommitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits`, {
      method: "POST", headers: h,
      body: JSON.stringify({
        message: revertMsg, tree: parentData.tree.sha, parents: [refData.object.sha],
        author: { name: "JMEM CMS Agent", email: "cms@jmemwiler.ch", date: new Date().toISOString() },
      }),
    });
    const newCommit: any = await newCommitRes.json();

    await fetch(`https://api.github.com/repos/${REPO}/git/refs/heads/master`, {
      method: "PATCH", headers: h, body: JSON.stringify({ sha: newCommit.sha }),
    });

    return Response.json({ success: true, message: revertMsg, sha: newCommit.sha });
  } catch (e: any) {
    return Response.json({ error: "Rollback fehlgeschlagen" }, { status: 500 });
  }
};
