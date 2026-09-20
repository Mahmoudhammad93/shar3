#!/usr/bin/env node
/**
 * Boots an empty-catalog mock API, runs next build, and asserts:
 * - build succeeds
 * - no fake detail routes are generated for empty catalogs
 * - list pages still exist
 */
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const ROOT = new URL("..", import.meta.url).pathname;
const PORT = 18011;

function json(data) {
  return Buffer.from(JSON.stringify(data));
}

const emptyList = json({ data: [], meta: { current_page: 1, last_page: 1, total: 0 } });
const emptyHome = json({
  settings: {},
  stats: {},
  featured_courses: [],
  programs: [],
  teachers: [],
  announcements: [],
  faqs: [],
  hero_slides: [],
  testimonials: [],
  homepage_featured_courses_visible: false,
});
const emptySettings = json({ data: {} });
const emptyAcademic = json({ data: [] });

const server = createServer((req, res) => {
  const path = (req.url || "").split("?")[0];
  let body = emptyList;
  if (path.endsWith("/home")) body = emptyHome;
  else if (path.endsWith("/settings")) body = emptySettings;
  else if (path.includes("academic")) body = emptyAcademic;

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": body.length,
  });
  res.end(body);
});

await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));

function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      env: { ...process.env, ...env },
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited ${code}`));
    });
  });
}

const outDir = join(ROOT, "out");
rmSync(outDir, { recursive: true, force: true });
rmSync(join(ROOT, ".next"), { recursive: true, force: true });

try {
  await run("npx", ["next", "build", "--webpack"], {
    NEXT_PUBLIC_API_URL: `http://127.0.0.1:${PORT}/api/v1`,
    NEXT_PUBLIC_ADMIN_URL: `http://127.0.0.1:${PORT}/admin`,
    NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
  });

  assert.equal(existsSync(outDir), true, "out/ missing");
  assert.equal(existsSync(join(outDir, "courses", "index.html")), true);
  assert.equal(existsSync(join(outDir, "programs", "index.html")), true);
  assert.equal(existsSync(join(outDir, "teachers", "index.html")), true);
  assert.equal(existsSync(join(outDir, "news", "index.html")), true);

  const banned = [
    "__build_probe__",
    "__SKIP__",
    "placeholder",
    "dummy",
  ];

  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        for (const token of banned) {
          assert.equal(name.includes(token), false, `fake path segment ${name}`);
        }
        walk(full);
      }
    }
  }
  walk(outDir);

  // Empty API catalogs must not emit detail directories under these list roots.
  for (const segment of ["courses", "programs", "teachers", "news"]) {
    const base = join(outDir, segment);
    const children = readdirSync(base).filter((name) => statSync(join(base, name)).isDirectory());
    assert.deepEqual(children, [], `unexpected detail directories under /${segment}: ${children.join(",")}`);
  }

  console.log("verify:empty-catalog-export PASS");
} finally {
  server.close();
}
