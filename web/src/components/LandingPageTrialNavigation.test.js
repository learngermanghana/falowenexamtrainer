import fs from "fs";
import path from "path";

const read = (file) => fs.readFileSync(path.join(__dirname, file), "utf8");

describe("Falowen public landing calls to action", () => {
  const landing = read("./LandingPageSimple.js");
  const app = read("../App.js");
  const features = read("../data/publicMarketingFeatures.js");

  test("keeps sign-up and login actions available to visitors", () => {
    expect(landing).toContain('start: "Start 7 days free trial"');
    expect(landing).toContain('start: "7 Tage kostenlos testen"');
    expect(landing).toContain('start: "Essayer gratuitement pendant 7 jours"');
    expect(landing).toContain('onClick={signup}>{copy.signup} ↗');
    expect(landing).toContain('onClick={login}>{copy.login}');
    expect(landing).toContain('onSignUp={signup}');
  });

  test("sends all View live classes actions to the upcoming classes page", () => {
    expect(features).toContain('href: "/classes"');
    expect(features).toContain('scheduleHref: "/classes"');
    expect(landing).toContain('href="/classes"');
    expect(app).toContain('location.pathname === "/classes" || location.pathname === "/classes/"');
    expect(app).toContain('return <PublicUpcomingClassesPage />;');
  });

  test("About us opens the academy page via its canonical route", () => {
    expect(landing).toContain('navHelp: "About us"');
    expect(landing).toContain('navHelp: "Über uns"');
    expect(landing).toContain('navHelp: "À propos"');
    expect(landing).toContain('footerHelp: "About us"');
    expect(landing).toContain('href="/about-us">{copy.navHelp}');
    expect(landing).toContain('href="/about-us">{copy.all}');
    expect(landing).toContain('{ href: "/about-us", labelKey: "footerHelp" }');
    expect(app).toContain('location.pathname === "/about-us"');
    expect(app).toContain('return <PublicAdmissionsVisitorGuidePage />;');
    expect(app).toContain('location.pathname === "/visitor-guide"');
    expect(app).toContain('return <Navigate to={`/about-us${location.search}${location.hash}`} replace />;');
  });

  test("old visitor guide bookmarks redirect to About Us and page metadata is canonical", () => {
    const vercel = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../..", "vercel.json"), "utf8"));
    const oldRoute = vercel.routes.find((route) => route.src === "/visitor-guide/?");
    expect(oldRoute).toMatchObject({ status: 308, headers: { Location: "/about-us" } });
    expect(vercel.routes.indexOf(oldRoute)).toBeLessThan(vercel.routes.findIndex((route) => route.handle === "filesystem"));

    const aboutPage = read("./PublicAdmissionsVisitorGuidePage.js");
    expect(aboutPage).toContain('canonicalPath: "/about-us"');
    expect(aboutPage).toContain('url: "https://www.falowen.app/about-us"');
    expect(aboutPage).toContain('title: "About Us | Learn Language Education Academy & Falowen"');
    expect(aboutPage).toContain('event: "visitor_guide_open"'); // Retain historical engagement event.
    const brochure = read("../../public/classes/brochure-enhancements.js");
    expect(brochure).toContain('return `/about-us?${params.toString()}`;');
    const sitemap = fs.readFileSync(path.resolve(__dirname, "../../public/sitemap.xml"), "utf8");
    expect(sitemap).toContain("<loc>https://www.falowen.app/about-us</loc>");
    expect(sitemap).not.toContain("<loc>https://www.falowen.app/visitor-guide</loc>");
  });
});
