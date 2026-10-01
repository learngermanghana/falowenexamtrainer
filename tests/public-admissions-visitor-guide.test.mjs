import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

test("public admissions visitor guide is available before auth loading", () => {
  const app = read("web/src/App.js");
  assert.match(app, /PublicAdmissionsVisitorGuidePage/);
  const routeIndex = app.indexOf('location.pathname === "\/visitor-guide"'.replace("\\/", "/"));
  const authLoadingIndex = app.indexOf("if (authLoading)");
  assert.ok(routeIndex >= 0);
  assert.ok(authLoadingIndex >= 0);
  assert.ok(routeIndex < authLoadingIndex);
});

test("visitor guide explains school, selected class, learning flow and actions", () => {
  const page = read("web/src/components/PublicAdmissionsVisitorGuidePage.js");
  assert.match(page, /Learn Language Education Academy/);
  assert.match(page, /Your selected class/);
  assert.match(page, /Why students study with us/);
  assert.match(page, /How your course works/);
  assert.match(page, /The people behind the school/);
  assert.match(page, /Visit LLEA/);
  assert.match(page, /Open exact location in Google Maps/);
  assert.match(page, /LLEA classroom · Awoshie, Accra/);
  assert.match(page, /In person in Awoshie, live online, or recorded lesson catch-up/);
  assert.match(page, /publicAcademyProfile\.json/);
  assert.ok(page.indexOf("Visit LLEA") < page.indexOf("Why students study with us"));
  assert.match(page, /View class brochure/);
  assert.match(page, /Register now/);
  assert.match(page, /Felix Asadu/);
  assert.match(page, /Catherine Agbleze Etornam/);
  assert.match(page, /visitor_guide_open/);
  assert.match(page, /brochure_open/);
  assert.match(page, /registration_click/);
});

test("class brochure preserves admissions reference and records engagement", () => {
  const index = read("web/public/classes/index.html");
  const tracker = read("web/public/classes/admissions-engagement.js");
  assert.match(index, /admissions-engagement\.js/);
  assert.match(tracker, /brochure_open/);
  assert.match(tracker, /registration_click/);
  assert.match(tracker, /brochureVisitorGuideLink/);
  assert.match(tracker, /About the school & how Falowen works/);
  assert.match(tracker, /url\.searchParams\.set\("ref", ref\)/);
});

test("admissions engagement endpoint stores only non-personal funnel status", () => {
  const route = read("functions/functionz/routes/admissionsEngagement.js");
  const api = read("api/index.js");
  assert.match(route, /admissionsEngagement/);
  assert.match(route, /brochure_open/);
  assert.match(route, /visitor_guide_open/);
  assert.match(route, /registration_click/);
  assert.match(route, /Access-Control-Allow-Origin/);
  assert.doesNotMatch(route, /studentName|phone|email/i);
  assert.match(api, /public\/admissions-engagement/);
});

test("signup records direct tracked registration visits", () => {
  const app = read("web/src/App.js");
  assert.match(app, /event: "registration_click"/);
  assert.match(app, /params\.get\("ref"\)/);
  assert.match(app, /params\.get\("class"\)/);
});


test("shared visitor-guide links preserve class and lead context without authentication", () => {
  const app = read("web/src/App.js");
  const page = read("web/src/components/PublicAdmissionsVisitorGuidePage.js");
  const engagement = read("web/src/services/admissionsEngagementService.js");

  assert.match(app, /location\.pathname === "\/visitor-guide"/);
  assert.match(page, /params\.get\("class"\)/);
  assert.match(page, /resolveAdmissionsRef\(search\)/);
  assert.match(page, /selectedClass.*requestedSlug/s);
  assert.match(engagement, /params\.get\("ref"\)/);
  assert.match(page, /visitor_guide_open/);
});
