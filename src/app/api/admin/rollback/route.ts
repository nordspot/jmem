import { NextRequest, NextResponse } from "next/server";
import { revertCommit } from "@/lib/github";

function validateAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  return auth.replace("Bearer ", "") === process.env.ADMIN_SECRET;
}

export async function POST(req: NextRequest) {
  if (!validateAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sha } = await req.json();
  if (!sha) {
    return NextResponse.json({ error: "Missing commit SHA" }, { status: 400 });
  }

  try {
    const result = await revertCommit(sha);
    return NextResponse.json({
      success: true,
      message: result.message,
      sha: result.sha,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Rollback failed" },
      { status: 500 }
    );
  }
}
