/**
 * GitHub API integration for reading/writing files and managing commits.
 * All operations go through the GitHub REST API since we run on Cloudflare Workers.
 */

const REPO = "nordspot/jmem";

function headers() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  return {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

export async function getFile(path: string): Promise<{ content: string; sha: string } | null> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    headers: headers(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json();
  return {
    content: Buffer.from(data.content, "base64").toString("utf-8"),
    sha: data.sha,
  };
}

export async function listFiles(path: string): Promise<string[]> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    headers: headers(),
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((f: { path: string }) => f.path);
}

interface FileChange {
  path: string;
  content: string;
}

export async function commitFiles(
  changes: FileChange[],
  message: string,
  branch = "master"
): Promise<{ sha: string; url: string }> {
  const h = headers();

  // 1. Get the latest commit SHA on the branch
  const refRes = await fetch(`https://api.github.com/repos/${REPO}/git/ref/heads/${branch}`, { headers: h });
  if (!refRes.ok) throw new Error("Failed to get branch ref");
  const refData = await refRes.json();
  const latestCommitSha = refData.object.sha;

  // 2. Get the tree of the latest commit
  const commitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits/${latestCommitSha}`, { headers: h });
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  // 3. Create blobs for each file
  const treeItems = await Promise.all(
    changes.map(async (change) => {
      const blobRes = await fetch(`https://api.github.com/repos/${REPO}/git/blobs`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({ content: change.content, encoding: "utf-8" }),
      });
      const blobData = await blobRes.json();
      return {
        path: change.path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: blobData.sha,
      };
    })
  );

  // 4. Create a new tree
  const treeRes = await fetch(`https://api.github.com/repos/${REPO}/git/trees`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
  });
  const treeData = await treeRes.json();

  // 5. Create a new commit
  const newCommitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({
      message: `[CMS Agent] ${message}`,
      tree: treeData.sha,
      parents: [latestCommitSha],
      author: {
        name: "JMEM CMS Agent",
        email: "cms@jmemwiler.ch",
        date: new Date().toISOString(),
      },
    }),
  });
  const newCommitData = await newCommitRes.json();

  // 6. Update the branch ref
  await fetch(`https://api.github.com/repos/${REPO}/git/refs/heads/${branch}`, {
    method: "PATCH",
    headers: h,
    body: JSON.stringify({ sha: newCommitData.sha }),
  });

  return { sha: newCommitData.sha, url: newCommitData.html_url };
}

export interface CommitInfo {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
  isAgent: boolean;
}

export async function getCommitHistory(
  page = 1,
  perPage = 30,
  agentOnly = false
): Promise<CommitInfo[]> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/commits?page=${page}&per_page=${perPage}`,
    { headers: headers() }
  );
  if (!res.ok) throw new Error("Failed to get commits");
  const data = await res.json();
  const commits: CommitInfo[] = data.map((c: any) => ({
    sha: c.sha,
    message: c.commit.message,
    author: c.commit.author.name,
    date: c.commit.author.date,
    url: c.html_url,
    isAgent: c.commit.message.startsWith("[CMS Agent]"),
  }));
  return agentOnly ? commits.filter((c) => c.isAgent) : commits;
}

export async function revertCommit(sha: string): Promise<{ sha: string; message: string }> {
  const h = headers();

  // Get the commit to revert
  const commitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits/${sha}`, { headers: h });
  const commitData = await commitRes.json();

  if (!commitData.parents || commitData.parents.length === 0) {
    throw new Error("Cannot revert the initial commit");
  }

  // Get current branch HEAD
  const refRes = await fetch(`https://api.github.com/repos/${REPO}/git/ref/heads/master`, { headers: h });
  const refData = await refRes.json();
  const currentHead = refData.object.sha;

  // Get the parent tree (state before the commit)
  const parentSha = commitData.parents[0].sha;
  const parentCommitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits/${parentSha}`, { headers: h });
  const parentCommitData = await parentCommitRes.json();

  // Create a new commit with the parent's tree (effectively reverting)
  const revertMessage = `[CMS Agent] Revert: ${commitData.message.replace("[CMS Agent] ", "")}`;
  const newCommitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({
      message: revertMessage,
      tree: parentCommitData.tree.sha,
      parents: [currentHead],
      author: {
        name: "JMEM CMS Agent",
        email: "cms@jmemwiler.ch",
        date: new Date().toISOString(),
      },
    }),
  });
  const newCommitData = await newCommitRes.json();

  // Update branch
  await fetch(`https://api.github.com/repos/${REPO}/git/refs/heads/master`, {
    method: "PATCH",
    headers: h,
    body: JSON.stringify({ sha: newCommitData.sha }),
  });

  return { sha: newCommitData.sha, message: revertMessage };
}

export async function searchCommits(query: string): Promise<CommitInfo[]> {
  const res = await fetch(
    `https://api.github.com/search/commits?q=repo:${REPO}+${encodeURIComponent(query)}&sort=author-date&order=desc&per_page=20`,
    {
      headers: {
        ...headers(),
        Accept: "application/vnd.github.cloak-preview+json",
      },
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items || []).map((item: any) => ({
    sha: item.sha,
    message: item.commit.message,
    author: item.commit.author.name,
    date: item.commit.author.date,
    url: item.html_url,
    isAgent: item.commit.message.startsWith("[CMS Agent]"),
  }));
}
