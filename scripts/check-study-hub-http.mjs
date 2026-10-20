import assert from "node:assert/strict";
import { spawn } from "node:child_process";
const port = 3197;
const origin = `http://127.0.0.1:${port}`;
const env = {
  ...process.env,
  SUPABASE_URL: "",
  SUPABASE_PUBLISHABLE_KEY: "",
  STUDY_HUB_OWNER_ID: "",
};
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  { env, stdio: ["ignore", "pipe", "pipe"] },
);
let logs = "";
server.stdout.on("data", (d) => {
  logs += d;
});
server.stderr.on("data", (d) => {
  logs += d;
});
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(origin);
      ready = true;
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  assert.ok(ready, `Server did not start: ${logs}`);
  for (const path of [
    "/study-hub",
    "/study-hub/opportunities",
    "/study-hub/tasks",
    "/study-hub/settings",
    "/study-hub/opportunities/10000000-0000-4000-8000-000000000001",
  ]) {
    const r = await fetch(origin + path, { redirect: "manual" });
    assert.equal(r.status, 307, path);
    assert.equal(r.headers.get("location"), "/study-hub/login");
    assert.match(r.headers.get("cache-control"), /no-store/);
    assert.match(r.headers.get("x-robots-tag"), /noindex/);
    assert.equal(r.headers.get("x-frame-options"), "DENY");
    console.log(`PASS denied ${path}`);
  }
  const login = await fetch(origin + "/study-hub/login");
  assert.equal(login.status, 200);
  assert.match(await login.text(), /Setup required/);
  const home = await fetch(origin);
  assert.equal(home.status, 200);
  assert.equal(home.headers.get("x-robots-tag"), null);
  console.log("PASS fail-closed setup screen and public portfolio response");
} finally {
  server.kill("SIGTERM");
}
