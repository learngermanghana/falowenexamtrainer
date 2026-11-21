const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const root = join(__dirname, "..");
const read = (name) => readFileSync(join(root, name), "utf8");

test("static public music metadata is browser cached with bounded TTLs", () => {
  const config = JSON.parse(read("vercel.json"));
  assert.equal(config.ignoreCommand, "node scripts/vercelIgnoreBuild.cjs");
  const headers = (src) => config.headers.find((row) => row.source === src)?.headers || [];
  const cache = (src) => headers(src).find((row) => row.key === "Cache-Control")?.value;
  assert.match(cache("/music/catalog.json"), /max-age=900/);
  assert.match(cache("/music/covers/artwork-map.json"), /max-age=3600/);
  assert.match(cache("/music/covers/photo-sources.json"), /max-age=3600/);
  assert.match(cache("/music/swahili-catalog.json"), /max-age=3600/);
  assert.match(cache("/campus/:path*"), /no-store/);
  assert.match(cache("/exams/:path*"), /no-store/);
});

test("public R2 music listing has a two-minute cache but still uses CORS", () => {
  const api = read("api/music-library.js");
  assert.match(api, /max-age=120/);
  assert.match(api, /expiresAt:now\+120000/);
  assert.match(api, /Access-Control-Allow-Origin.*\*/);
  assert.match(api, /listMusicTracks\(\)/);
});

test("student classes, auth, and protected course data stay uncached", () => {
  const classes = read("functions/functionz/routes/publicClasses.js");
  assert.match(classes, /no-store, no-cache, must-revalidate/);
  const config = JSON.parse(read("vercel.json"));
  for (const path of ["/index.html", "/onboarding", "/login/:path*", "/signup/:path*"]) {
    const headers = config.headers.find((entry) => entry.source === path)?.headers || [];
    assert.ok(headers.some((entry) => entry.key === "Cache-Control" && entry.value.includes("no-store")), path);
  }
});
