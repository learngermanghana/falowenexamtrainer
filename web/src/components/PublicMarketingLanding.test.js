import fs from "fs";
import path from "path";
import { PUBLIC_MARKETING_FEATURES } from "../data/publicMarketingFeatures";

const read = (relative) => fs.readFileSync(path.resolve(__dirname, relative), "utf8");

describe("Falowen public marketing redesign", () => {
  test("four German homepage marketing promises remain intact without duplicate cards on About Us", () => {
    expect(PUBLIC_MARKETING_FEATURES.map((feature) => feature.key)).toEqual([
      "placement", "exams", "class", "self",
    ]);
    expect(new Set(PUBLIC_MARKETING_FEATURES.map((feature) => feature.key)).size).toBe(4);
    expect(PUBLIC_MARKETING_FEATURES.map((feature) => feature.href)).toEqual([
      "/placement-test", "/exam-practice", "/classes", "/signup?program=german",
    ]);
    expect(PUBLIC_MARKETING_FEATURES.find((feature) => feature.key === "exams").description).toMatch(/Goethe|Lesen/);
    expect(PUBLIC_MARKETING_FEATURES.find((feature) => feature.key === "class")).toEqual(
      expect.objectContaining({
        href: "/classes",
        action: "View live classes",
        scheduleHref: "/classes",
        scheduleAction: "View full class schedule",
      })
    );

    const landing = read("./LandingPageSimple.js");
    const visitor = read("./PublicAdmissionsVisitorGuidePage.js");
    expect(landing).toContain("<FalowenHomepageCarousel");
    const carousel = read("./FalowenHomepageCarousel.js");
    for (const href of ["/signup", "/placement-test", "/exam-practice", "/books", "/learn-german-with-chatgpt"]) expect(carousel).toContain(`href:"${href}"`);
    expect(carousel).toContain('support:"View German classes"');
    expect(visitor).not.toContain("visitor-guide-language-grid");
    expect(visitor).not.toContain("Choose the language you want to learn");
    expect(visitor).toContain("We teach German and Kiswahili");
    expect(visitor).toContain("How we support language learners");
    expect(visitor).not.toContain("PUBLIC_MARKETING_FEATURES.map");
    expect(visitor).not.toContain("How your course works");
    expect(visitor).not.toContain("Why students study with us");
    expect(landing).not.toContain("Start in three simple steps");
    expect(landing).not.toContain("German A1–C2 courses and exam preparation");
  });

  test("leaves review score to the existing data-driven Google review renderer", () => {
    const homepage = read("./LandingPageSimple.js");
    const loader = read("../../public/homepage-reviews.js");
    expect(homepage).not.toContain("★★★★★");
    expect(loader).toContain("summary(reviews)");
    expect(loader).toContain("stats.average");
    expect(loader).toContain('fetch("/reviews.json"');
    expect(loader).toContain(".catch(function (error)");
  });

  test("keeps real reviews and admissions class context and mobile access", () => {
    const wrapper = read("./LandingPage.js");
    const landing = read("./LandingPageSimple.js");
    const visitor = read("./PublicAdmissionsVisitorGuidePage.js");
    const styles = read("./LandingPageMarketing.css");
    const guideStyles = read("./PublicAdmissionsVisitorGuidePage.css");
    expect(wrapper).toContain("/homepage-reviews.js");
    expect(landing).toContain("falowen-team-section");
    expect(landing).toContain("academyProfile.team");
    expect(landing).not.toContain('className="falowen-home-support"');
    expect(landing).not.toContain('className="falowen-home-hybrid"');
    expect(landing).toContain("falowen-home-reviews-intro");
    expect(landing).toContain("academyProfile.classroomImage");
    expect(landing).toContain("FOOTER_LINKS");
    expect(landing).toContain("falowen-home-nav-links");
    expect(read("./FalowenHomepageCarousel.js")).toContain("View German classes");
    expect(visitor).toContain("visitor-guide-language-final-actions");
    expect(visitor).toContain('href="/swahili"');
    expect(visitor).not.toContain("swahiliSignupHref");
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
