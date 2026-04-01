/**
 * CMS Starter Script
 *
 * Creates temporary Keystatic routes, starts Next.js dev server,
 * and cleans up on exit. The CMS admin is available at http://localhost:3000/keystatic
 *
 * Usage: node scripts/start-cms.js
 */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const routes = [
  {
    dir: "src/app/keystatic",
    files: {
      "layout.tsx": `import KeystaticApp from "./keystatic";
export default function KeystaticLayout() {
  return <KeystaticApp />;
}`,
      "keystatic.tsx": `"use client";
import { makePage } from "@keystatic/next/ui/app";
import config from "../../../keystatic.config";
export default makePage(config);`,
    },
  },
  {
    dir: "src/app/api/keystatic/[...params]",
    files: {
      "route.ts": `import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";
export const { POST, GET } = makeRouteHandler({ config });`,
    },
  },
];

const root = path.resolve(__dirname, "..");

// Create routes
for (const route of routes) {
  const dir = path.join(root, route.dir);
  fs.mkdirSync(dir, { recursive: true });
  for (const [file, content] of Object.entries(route.files)) {
    fs.writeFileSync(path.join(dir, file), content);
  }
}

console.log("\n  CMS routes created. Starting dev server...");
console.log("  Admin UI: http://localhost:3000/keystatic\n");

// Start next dev without static export
const child = spawn("npx", ["next", "dev"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, KEYSTATIC: "true" },
});

function cleanup() {
  console.log("\n  Cleaning up CMS routes...");
  for (const route of routes) {
    const dir = path.join(root, route.dir);
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // Also clean up empty parent dirs
  fs.rmSync(path.join(root, "src/app/api/keystatic"), { recursive: true, force: true });
  fs.rmSync(path.join(root, "src/app/api"), { recursive: true, force: true });
  console.log("  Done.\n");
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
child.on("exit", cleanup);
