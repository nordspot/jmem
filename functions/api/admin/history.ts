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
  const ghToken = context.env.GITHUB_TOKEN;
  if (!ghToken) {
    return Response.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
  }
  const h = { Authorization: `token ${ghToken}`, Accept: "application/vnd.github.v3+json" };

  try {
    let commits;
    if (query) {
      const res = await fetch(
        `https://api.github.com/search/commits?q=repo:${REPO}+${encodeURIComponent(query)}&sort=author-date&order=desc&per_page=20`,
        { headers: { ...h, Accept: "application/vnd.github.cloak-preview+json" } }
      );
      const data: any = await res.json();
      commits = (data.items || []).map((item: any) => ({
        sha: item.sha, message: item.commit.message, author: item.commit.author.name,
        date: item.commit.author.date, url: item.html_url,
        isAgent: item.commit.message.startsWith("[CMS Agent]"),
      }));
    } else {
      const res = await fetch(`https://api.github.com/repos/${REPO}/commits?per_page=30`, { headers: h });
      if (!res.ok) {
        const text = await res.text();
        return Response.json({ error: `GitHub API ${res.status}: ${text.slice(0, 200)}` }, { status: 502 });
      }
      const data: any = await res.json();
      commits = data.map((c: any) => ({
        sha: c.sha, message: c.commit.message, author: c.commit.author.name,
        date: c.commit.author.date, url: c.html_url,
        isAgent: c.commit.message.startsWith("[CMS Agent]"),
      }));
    }

    if (agentOnly) commits = commits.filter((c: any) => c.isAgent);
    return Response.json({ commits });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
};
