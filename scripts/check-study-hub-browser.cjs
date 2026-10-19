const { createServer } = require("node:http");
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");
// Synthetic Auth/PostgREST fixture. Never connects to a real Supabase project.
const { chromium } = require("playwright");
const path = require("node:path");
const fs = require("node:fs");
const artifacts = path.resolve(__dirname, "../artifacts/study-hub-browser");
fs.mkdirSync(artifacts, { recursive: true });

const id = "00000000-0000-4000-8000-000000000001";
const user = {
  id,
  aud: "authenticated",
  role: "authenticated",
  email: "synthetic@example.test",
  email_confirmed_at: "2026-01-01T00:00:00Z",
  app_metadata: {},
  user_metadata: {},
  created_at: "2026-01-01T00:00:00Z",
};
const token =
  [
    { alg: "HS256", typ: "JWT" },
    {
      sub: id,
      role: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
  ]
    .map((x) => Buffer.from(JSON.stringify(x)).toString("base64url"))
    .join(".") + ".testsignature";
const rows = [];
const tasks = [];
const deny = false;
const api = createServer(async (req, res) => {
  let body = "";
  for await (const c of req) body += c;
  const u = new URL(req.url, "http://localhost");
  res.setHeader("Content-Type", "application/json");
  if (u.pathname === "/auth/v1/token")
    return res.end(
      JSON.stringify({
        access_token: token,
        refresh_token: "synthetic-refresh-token",
        token_type: "bearer",
        expires_in: 3600,
        user,
      }),
    );
  if (u.pathname === "/auth/v1/user")
    return res.end(
      JSON.stringify(
        deny ? { ...user, id: "00000000-0000-4000-8000-000000000002" } : user,
      ),
    );
  if (u.pathname === "/auth/v1/logout") return res.end("{}");
  if (u.pathname === "/rest/v1/rpc/study_is_owner") return res.end("true");
  const table = u.pathname.split("/").at(-1);
  let data = table === "study_opportunities" ? rows : tasks;
  if (req.method === "POST") {
    const value = JSON.parse(body);
    const item = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      status: table === "study_opportunities" ? "discovered" : "queued",
      verification_status: "unverified",
      attempts: 0,
      ...value,
    };
    data.push(item);
    res.statusCode = 201;
    return res.end(JSON.stringify(u.searchParams.has("select") ? item : null));
  }
  if (req.method === "PATCH") {
    for (const row of data)
      if ("eq." + row.id === u.searchParams.get("id"))
        Object.assign(row, JSON.parse(body));
  }
  for (const key of ["id", "status", "kind", "funding"])
    if (u.searchParams.get(key)?.startsWith("eq."))
      data = data.filter((r) => r[key] === u.searchParams.get(key).slice(3));
  res.setHeader(
    "Content-Range",
    `0-${Math.max(0, data.length - 1)}/${data.length}`,
  );
  res.end(JSON.stringify(data));
});
(async () => {
  await new Promise((r) => api.listen(3198, "127.0.0.1", r));
  const server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3199",
    ],
    {
      cwd: path.resolve(__dirname, ".."),
      env: {
        ...process.env,
        SUPABASE_URL: "http://127.0.0.1:3198",
        SUPABASE_PUBLISHABLE_KEY: "synthetic-publishable-key",
        STUDY_HUB_OWNER_ID: id,
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let logs = "";
  server.stdout.on("data", (d) => (logs += d));
  server.stderr.on("data", (d) => (logs += d));
  let browser;
  try {
    for (let i = 0; i < 60; i++) {
      try {
        await fetch("http://127.0.0.1:3199/study-hub/login");
        break;
      } catch {
        await new Promise((r) => setTimeout(r, 250));
      }
    }
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.STUDY_HUB_TEST_BROWSER || undefined,
      args: process.env.STUDY_HUB_TEST_BROWSER
        ? [
            "--no-sandbox",
            "--no-zygote",
            "--single-process",
            "--use-gl=angle",
            "--use-angle=swiftshader",
            "--enable-unsafe-swiftshader",
          ]
        : [],
    });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:3199/study-hub/login");
    await page.screenshot({ path: path.join(artifacts, "login-desktop.png") });
    await page
      .getByLabel("Email", { exact: true })
      .fill("synthetic@example.test");
    await page
      .getByLabel("Password", { exact: true })
      .fill("synthetic-test-password");
    await page.getByRole("button", { name: "Enter your workspace" }).click();
    await page.waitForURL("**/study-hub");
    await page.getByText("Make room for what’s next.").waitFor();
    await page.screenshot({
      path: path.join(artifacts, "dashboard-desktop.png"),
    });
    await page
      .getByRole("link", { name: "Add an opportunity", exact: true })
      .click();
    await page
      .getByLabel("Programme or position")
      .fill("Synthetic MSc for browser testing");
    await page.getByLabel("Country", { exact: true }).fill("Example country");
    await page
      .getByLabel("Official source URL")
      .fill("https://example.edu/programme");
    await page.getByLabel("Private notes").fill("Synthetic fixture only.");
    await page
      .getByRole("button", { name: "Save opportunity", exact: true })
      .click();
    await page.waitForURL(/\/opportunities\/[a-f0-9-]+$/);
    await page
      .getByRole("heading", { name: "Synthetic MSc for browser testing" })
      .waitFor();
    await page.getByLabel("Application stage").selectOption("shortlisted");
    await page
      .getByRole("button", { name: "Save status", exact: true })
      .click();
    await page.getByText("Status saved.").waitFor();
    assert.equal(rows[0].status, "shortlisted");
    await page.getByLabel("Research action").selectOption("verification");
    await page.getByRole("button", { name: "Queue research request" }).click();
    await page
      .getByText(
        "Request saved. Execution is waiting for a worker integration.",
      )
      .waitFor();
    assert.equal(tasks.length, 1);
    assert.equal(tasks[0].status, "queued");
    await page.reload();
    assert.equal(
      await page.getByLabel("Application stage").inputValue(),
      "shortlisted",
    );
    await page.screenshot({ path: path.join(artifacts, "detail-desktop.png") });
    await page
      .getByRole("link", { name: "All opportunities", exact: true })
      .click();
    await page.screenshot({
      path: path.join(artifacts, "explorer-desktop.png"),
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(artifacts, "explorer-mobile.png"),
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page
      .getByRole("button", { name: "Sign out", exact: true })
      .filter({ visible: true })
      .click();
    await page.waitForURL("**/study-hub/login");
    await page.screenshot({ path: path.join(artifacts, "login-mobile.png") });
    assert.deepEqual(errors, []);
    console.log(
      "PASS browser fixture: login, create, stage update, queued request, reload, mobile no-overflow, logout; no page errors.",
    );
    console.log(
      "Synthetic Auth/PostgREST fixture; not a live Supabase validation.",
    );
  } catch (e) {
    console.error(e);
    console.error(logs);
    process.exitCode = 1;
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
    api.close();
  }
})();
