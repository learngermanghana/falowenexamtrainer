import fs from "fs";
import path from "path";

const read = (file) => fs.readFileSync(path.join(__dirname, file), "utf8");

describe("Falowen public landing calls to action", () => {
  const landing = read("./LandingPageSimple.js");
  const app = read("../App.js");
  const features = read("../data/publicMarketingFeatures.js");

  test("promotes the 7-day free trial but keeps login for registered students", () => {
    expect(landing).toContain('start: "Start 7 days free trial"');
    expect(landing).toContain('start: "7 Tage kostenlos testen"');
    expect(landing).toContain('start: "Essayer gratuitement pendant 7 jours"');
    expect(landing).toContain('onClick={signup}>{copy.start}');
    expect(landing).toContain('onClick={login}>{copy.returning} {copy.login}');
  });

  test("sends all View live classes actions to the upcoming classes page", () => {
    expect(features).toContain('href: "/classes"');
    expect(features).toContain('scheduleHref: "/classes"');
    expect(landing).toContain('href="/classes"');
    expect(app).toContain('location.pathname === "/classes" || location.pathname === "/classes/"');
    expect(app).toContain('return <PublicUpcomingClassesPage />;');
  });

  test("How Falowen works opens the visitor guide rather than generic help", () => {
    expect(landing).toContain('href="/visitor-guide">{copy.navHelp}');
    expect(landing).toContain('href="/visitor-guide">{copy.supportLink}');
    expect(landing).toContain('{ href: "/visitor-guide", labelKey: "footerHelp" }');
    expect(app).toContain('location.pathname === "/visitor-guide"');
  });
});
