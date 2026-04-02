interface Env {
  ADMIN_SECRET: string;
  GITHUB_TOKEN: string;
}

const REPO = "nordspot/jmem";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = context.request.headers.get("authorization");
  if (!auth || auth.replace("Bearer ", "") !== context.env.ADMIN_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(context.request.url);
  const query = url.searchParams.get("q");
  const agentOnly = url.searchParams.get("agent") === "true";

  // SECURITY: Sanitize search query — max 100 chars, no special chars
  const safeQuery = query ? query.slice(0, 100).replace(/[<>"'`;{}()]/g, "") : null;

  const ghToken = context.env.GITHUB_TOKEN;
  if (!ghToken) {
    return Response.json({ error: "Service not configured" }, { status: 500 });
  }
  const h = { Authorization: `token ${ghToken}`, Accept: "application/vnd.github.v3+json", "User-Agent": "jmem-cms" };

  try {
    let commits;
    if (safeQuery) {
      const res = await fetch(
        `https://api.github.com/search/commits?q=repo:${REPO}+${encodeURIComponent(safeQuery)}&sort=author-date&order=desc&per_page=20`,
        { headers: { ...h, Accept: "application/vnd.github.cloak-preview+json" } }
      );
      if (!res.ok) return Response.json({ error: "Search failed" }, { status: 502 });
      const data: any = await res.json();
      commits = (data.items || []).map((item: any) => ({
        sha: item.sha,
        message: item.commit?.message || "",
        author: item.commit?.author?.name || "Unknown",
        date: item.commit?.author?.date || "",
        isAgent: (item.commit?.message || "").startsWith("[CMS Agent]"),
      }));
    } else {
      const res = await fetch(`https://api.github.com/repos/${REPO}/commits?per_page=30`, { headers: h });
      if (!res.ok) {
        return Response.json({ error: "Failed to fetch history" }, { status: 502 });
      }
      const data: any = await res.json();
      commits = data.map((c: any) => ({
        sha: c.sha,
        message: c.commit?.message || "",
        author: c.commit?.author?.name || "Unknown",
        date: c.commit?.author?.date || "",
        isAgent: (c.commit?.message || "").startsWith("[CMS Agent]"),
      }));
    }

    // SECURITY: Strip any env var references from commit messages before returning
    commits = commits.map((c: any) => ({
      ...c,
      message: c.message.replace(/ghp_[A-Za-z0-9_]+/g, "[REDACTED]")
                         .replace(/github_pat_[A-Za-z0-9_]+/g, "[REDACTED]")
                         .replace(/sk-ant-[A-Za-z0-9_-]+/g, "[REDACTED]"),
    }));

    if (agentOnly) commits = commits.filter((c: any) => c.isAgent);
    return Response.json({ commits });
  } catch {
    return Response.json({ error: "Service unavailable" }, { status: 500 });
  }
};
