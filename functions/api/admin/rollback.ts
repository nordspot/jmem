interface Env {
  ADMIN_SECRET: string;
  GITHUB_TOKEN: string;
}

const REPO = "nordspot/jmem";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = context.request.headers.get("authorization");
  if (!auth || auth.replace("Bearer ", "") !== context.env.ADMIN_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sha } = await context.request.json() as any;
  if (!sha) return Response.json({ error: "Missing commit SHA" }, { status: 400 });

  const h = { Authorization: `token ${context.env.GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" };

  try {
    const commitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits/${sha}`, { headers: h });
    const commitData: any = await commitRes.json();
    if (!commitData.parents?.length) throw new Error("Cannot revert initial commit");

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
    return Response.json({ error: e.message }, { status: 500 });
  }
};
