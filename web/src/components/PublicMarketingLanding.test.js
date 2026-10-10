import fs from "fs";
import path from "path";
import { PUBLIC_MARKETING_FEATURES } from "../data/publicMarketingFeatures";

const read = (relative) => fs.readFileSync(path.resolve(__dirname, relative), "utf8");

describe("Falowen public marketing redesign", () => {
  test("both homepage and visitor guide display the same four marketing promises", () => {
    expect(PUBLIC_MARKETING_FEATURES.map((feature) => feature.key)).toEqual([
      "placement", "exams", "class", "self",
    ]);
    expect(new Set(PUBLIC_MARKETING_FEATURES.map((feature) => feature.key)).size).toBe(4);
    expect(PUBLIC_MARKETING_FEATURES.map((feature) => feature.href)).toEqual([
      "/placement-test", "/exam-practice", "/classes/", "/signup?program=german",
    ]);
    expect(PUBLIC_MARKETING_FEATURES.find((feature) => feature.key === "exams").description).toMatch(/Goethe|Lesen/);
    expect(PUBLIC_MARKETING_FEATURES.find((feature) => feature.key === "class")).toEqual(
      expect.objectContaining({
        href: "/classes/",
        action: "View live classes",
        scheduleHref: "/learn-german-ghana/upcoming-classes",
        scheduleAction: "View full class schedule",
      })
    );

    const landing = read("./LandingPageSimple.js");
    const visitor = read("./PublicAdmissionsVisitorGuidePage.js");
    expect(landing).toContain("PUBLIC_MARKETING_FEATURES.map");
    expect(visitor).toContain("PUBLIC_MARKETING_FEATURES.map");
    expect(visitor).not.toContain("How your course works");
    expect(visitor).not.toContain("Why students study with us");
    expect(landing).not.toContain("Start in three simple steps");
    expect(landing).not.toContain("German A1–C2 courses and exam preparation");
  });

  test("keeps real reviews and admissions class context and mobile access", () => {
    const wrapper = read("./LandingPage.js");
    const landing = read("./LandingPageSimple.js");
    const visitor = read("./PublicAdmissionsVisitorGuidePage.js");
    const styles = read("./LandingPageMarketing.css");
    const guideStyles = read("./PublicAdmissionsVisitorGuidePage.css");
    expect(wrapper).toContain("/homepage-reviews.js");
    expect(landing).toContain("falowen-final-cta");
    expect(landing).toContain("academyProfile.classroomImage");
    expect(landing).toContain("FOOTER_LINKS");
    expect(landing).toContain("falowen-home-feature-schedule");
    expect(visitor).toContain("visitor-guide-marketing-schedule");
    expect(styles).toContain("@media (max-width: 600px)");
    expect(styles).toContain(".falowen-home-feature-actions");
    expect(read("./PublicUpcomingClassesPage.js")).toContain("Weekly class calendar");
    expect(styles).toContain("env(safe-area-inset-bottom)");
    expect(styles).toContain(".falowen-mobile-actions");
    expect(guideStyles).toContain(".visitor-guide-marketing-grid");
    expect(guideStyles).toContain("grid-template-columns: 1fr");
    expect(visitor).toContain("brochureHref");
    expect(visitor).toContain("signupHref");
    expect(visitor).toContain("registration_click");
    expect(visitor).toContain("selectedClass");
  });
});
