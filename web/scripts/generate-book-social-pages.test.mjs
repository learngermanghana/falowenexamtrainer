import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { makeBookSocialHtml, pages } from "./generate-book-social-pages.mjs";

const read = path => readFileSync(new URL(path, import.meta.url));
const source = read("../index.html").toString();
const { routes } = JSON.parse(read("../../vercel.json"));

for (const [id, page] of Object.entries(pages)) {
  test(id + " serves its own public share card before React loads", () => {
    const route = routes.find(item => item.dest === "/__books/" + id + ".html");
    const matches = new RegExp("^" + route.src + "$");
    assert.ok(matches.test(page.href) && matches.test(page.href + "/"));
    assert.ok(!matches.test(page.href + "/checkout"));
    assert.ok(routes.indexOf(route) < routes.findIndex(item => item.src === "/(.*)"));
    const html = makeBookSocialHtml(source, page);
    for (const key of ['property="og:image"', 'name="twitter:image"']) {
      assert.ok(html.includes(key + ' content="https://www.falowen.app' + page.thumbnail + '"'));
      assert.equal(html.split(key).length, 2);
    }
    assert.ok(html.includes('rel="canonical" href="https://www.falowen.app' + page.href + '"'));
    assert.ok(html.includes(page.description));
    assert.equal(read("../public" + page.thumbnail).readUInt16BE(0), 0xffd8);
  });
}

test("missing default metadata fails the build", () => {
  assert.throws(() => makeBookSocialHtml("<html></html>", pages.catalog), /Missing expected default metadata/);
});
