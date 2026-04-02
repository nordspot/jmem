import { NextRequest, NextResponse } from "next/server";
import { getFile, listFiles, commitFiles } from "@/lib/github";

const SYSTEM_PROMPT = `You are the CMS agent for the JMEM Wiler website (jmemwiler.ch). You help the admin manage the website content by modifying files in the codebase.

## Your capabilities:
- Add/edit/remove products in the shop (src/lib/products.ts)
- Add/edit/remove schools and their details (src/lib/schools.ts)
- Add/edit/remove offerings/programs (src/app/angebote/page.tsx)
- Add/edit/remove testimonials (src/lib/testimonials.ts)
- Edit page content (src/app/*/page.tsx)
- Edit translations (src/lib/i18n/de.ts, src/lib/i18n/en.ts)
- Edit site settings and contact info

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
5. When editing TypeScript files, maintain the existing types and exports
6. Keep the same code style and formatting
7. Write commit messages in English, summaries in German

## Current file structure:
- src/lib/products.ts — Shop products (Product[] array)
- src/lib/schools.ts — School data (School[] array)
- src/lib/testimonials.ts — Testimonials
- src/lib/i18n/de.ts — German translations
- src/lib/i18n/en.ts — English translations
- src/app/angebote/page.tsx — Offerings page with inline data
- src/app/*/page.tsx — Page components
- public/images/ — Image assets`;

function validateAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace("Bearer ", "");
  return token === process.env.ADMIN_SECRET;
}

export async function POST(req: NextRequest) {
  if (!validateAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { prompt, fileContents } = body;

  if (!prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  // Build messages with file context if provided
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

  if (fileContents && Object.keys(fileContents).length > 0) {
    let contextMsg = "Here are the current file contents:\n\n";
    for (const [path, content] of Object.entries(fileContents)) {
      contextMsg += `### ${path}\n\`\`\`\n${content}\n\`\`\`\n\n`;
    }
    contextMsg += `\nNow, please process this request: ${prompt}`;
    messages.push({ role: "user", content: contextMsg });
  } else {
    messages.push({ role: "user", content: prompt });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Claude API error: ${err}` }, { status: 502 });
    }

    const data = await res.json();
    const responseText = data.content?.[0]?.text;

    if (!responseText) {
      return NextResponse.json({ error: "Empty response from Claude" }, { status: 502 });
    }

    // Parse the JSON response
    let parsed;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[1] : responseText);
    } catch {
      // If it's not JSON, return as a plain message
      return NextResponse.json({ type: "message", content: responseText });
    }

    // If agent needs to read files first
    if (parsed.needsFiles) {
      const fileContents: Record<string, string> = {};
      for (const path of parsed.needsFiles) {
        const file = await getFile(path);
        if (file) fileContents[path] = file.content;
      }
      return NextResponse.json({ type: "needsFiles", files: fileContents, originalPrompt: prompt });
    }

    // If agent has a question
    if (parsed.question) {
      return NextResponse.json({ type: "question", content: parsed.question });
    }

    // If agent wants to make changes
    if (parsed.changes && parsed.changes.length > 0) {
      const result = await commitFiles(parsed.changes, parsed.commitMessage || "Content update");
      return NextResponse.json({
        type: "committed",
        message: parsed.message,
        commitSha: result.sha,
        commitUrl: result.url,
        filesChanged: parsed.changes.map((c: { path: string }) => c.path),
      });
    }

    return NextResponse.json({ type: "message", content: parsed.message || responseText });
  } catch (error) {
    return NextResponse.json(
      { error: `Agent error: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
