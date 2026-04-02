import { NextRequest, NextResponse } from "next/server";
import { getCommitHistory, searchCommits } from "@/lib/github";

function validateAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  return auth.replace("Bearer ", "") === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!validateAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const agentOnly = searchParams.get("agent") === "true";

  try {
    const commits = query
      ? await searchCommits(query)
      : await getCommitHistory(page, 30, agentOnly);
    return NextResponse.json({ commits });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
