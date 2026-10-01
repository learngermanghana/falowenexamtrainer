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
  assert.match(page, /academyProfile\.team/);
  assert.match(page, /Teaching in practice/);
  assert.match(page, /Useful links/);
  assert.match(page, /publicLinkCopy/);
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

test("shared academy profile contains the current team, teaching media and public links", () => {
  const profile = JSON.parse(read("web/src/data/publicAcademyProfile.json"));

  assert.equal(profile.classroomImage, "/classes/llea-classroom.jpg");
  assert.equal(profile.admissionsUpdatedAt, "2026-10-01");
  assert.equal(profile.links.blog, "https://blog.falowen.app");
  assert.equal(profile.links.linkedin, "https://www.linkedin.com/in/learngermanghana/");
  assert.equal(profile.links.youtube, "https://www.youtube.com/@LLEAGhana");
  assert.equal(profile.links.contractAgreement, "https://legal.falowen.app/");

  assert.deepEqual(profile.team.map((member) => member.name), [
    "Felix Asadu",
    "Sabina Michel",
    "Catherine Agbleze Etornam",
    "Hana",
  ]);
  assert.equal(profile.team.find((member) => member.name === "Catherine Agbleze Etornam")?.image, null);
  assert.match(profile.team.find((member) => member.name === "Sabina Michel")?.role || "", /German Teacher/);
  assert.match(profile.team.find((member) => member.name === "Hana")?.role || "", /Global Mobility Specialist/);
  assert.equal(profile.team.find((member) => member.name === "Hana")?.relationship, "Consulting agency partner");
  assert.equal(profile.teachingGallery.length, 2);

  [
    "web/public/classes/llea-classroom.jpg",
    "web/public/classes/media/classroom.png",
    "web/public/classes/media/felix-asadu.png",
    "web/public/classes/media/felix-zoom.png",
    "web/public/classes/media/sabina-michel.png",
    "web/public/classes/media/sabina-teaching.png",
    "web/public/classes/media/hana.webp",
  ].forEach((relativePath) => assert.ok(fs.existsSync(path.join(root, relativePath))));
});


test("admissions public links and media references stay valid", () => {
  const profile = JSON.parse(read("web/src/data/publicAcademyProfile.json"));
  const publicRoot = path.join(root, "web/public");

  Object.entries(profile.links || {}).forEach(([key, href]) => {
    assert.doesNotThrow(() => new URL(href), `${key} should be a valid URL`);
    assert.equal(new URL(href).protocol, "https:", `${key} should use HTTPS`);
  });

  const media = [
    profile.classroomImage,
    ...(profile.team || []).map((member) => member.image).filter(Boolean),
    ...(profile.teachingGallery || []).map((item) => item.image).filter(Boolean),
  ];

  media.forEach((asset) => {
    assert.ok(asset.startsWith("/"), `${asset} should be a public-root path`);
    assert.ok(fs.existsSync(path.join(publicRoot, asset.replace(/^\//, ""))), `${asset} should exist`);
  });

  const lightClassroom = fs.statSync(path.join(publicRoot, "classes/llea-classroom.jpg")).size;
  const originalClassroom = fs.statSync(path.join(publicRoot, "classes/media/classroom.png")).size;
  assert.ok(lightClassroom < originalClassroom, "public classroom image should use the lighter JPEG asset");
});

test("visitor guide lazy-loads below-the-fold admissions media", () => {
  const page = read("web/src/components/PublicAdmissionsVisitorGuidePage.js");
  assert.match(page, /loading="lazy"/);
  assert.match(page, /decoding="async"/);
  assert.match(page, /Fees and admissions information updated/);
  assert.match(page, /member\.relationship/);
});
