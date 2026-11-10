import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { makeWritingBookSocialHtml } from "./generate-book-social-pages.mjs";

const web = dirname(dirname(fileURLToPath(import.meta.url)));
const root = dirname(web);
const source = readFileSync(join(web, "index.html"), "utf8");
const config = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
const slug = "/books/how-to-unlock-your-german-writing-skills-a1-c2";

test("writing book social page replaces generic homepage previews before JavaScript", () => {
  const html = makeWritingBookSocialHtml(source);
  assert.match(html, /<title>How to Unlock Your German Writing Skills \(A1–C2\) \| Falowen Books<\/title>/);
  assert.match(html, /property="og:title" content="How to Unlock Your German Writing Skills/);
  assert.match(html, /property="og:description"\s+content="A 68-page German writing guide/);
  assert.match(html, /property="og:url" content="https:\/\/www\.falowen\.app\/books\/how-to-unlock-your-german-writing-skills-a1-c2"/);
  assert.match(html, /property="og:image" content="https:\/\/www\.falowen\.app\/books\/previews\/writing-skills-a1-c2-5\.webp"/);
  assert.match(html, /name="twitter:image" content="https:\/\/www\.falowen\.app\/books\/previews\/writing-skills-a1-c2-5\.webp"/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.falowen\.app\/books\/how-to-unlock-your-german-writing-skills-a1-c2"/);
  assert.equal((html.match(/property="og:image"/g) || []).length, 1);
  assert.equal((html.match(/property="og:url"/g) || []).length, 1);
  assert.ok(!html.includes('property="og:url" content="https://www.falowen.app/"'));
  assert.ok(existsSync(join(web, "public", "books", "previews", "writing-skills-a1-c2-5.webp")));
});

test("book details get special static HTML while checkout retains React route", () => {
  const route = config.routes.find(item => item.dest === "/__books/writing-skills-a1-c2.html");
  assert.ok(route, "book social route missing");
  assert.ok(config.routes.indexOf(route) < config.routes.findIndex(item => item.src === "/(.*)"));
  const matches = new RegExp("^" + route.src + "$");
  assert.ok(matches.test(slug));
  assert.ok(matches.test(slug + "/"));
  assert.ok(!matches.test(slug + "/checkout"));
  assert.ok(!matches.test(slug + "/checkout/"));
  assert.equal(config.routes.at(-1).dest, "/index.html");
});

test("book social document fails loudly if the base metadata changes", () => {
  assert.throws(() => makeWritingBookSocialHtml("<html><head></head></html>"), /Missing expected default metadata/);
});
