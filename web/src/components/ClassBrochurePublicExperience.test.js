import fs from "fs";
import path from "path";

const publicClassFile = (name) =>
  fs.readFileSync(path.resolve(__dirname, "../../public/classes", name), "utf8");

describe("public class brochure experience", () => {
  test("generated brochure data owns canonical curriculum and shared policy", () => {
    const data = JSON.parse(publicClassFile("classes-data.json"));

    expect(data.classDefaults.tuitionGhsByLevel.A1).toBe(2800);
    expect(data.classDefaults.tuitionGhsByLevel.A2).toBe(3000);
    expect(data.classDefaults.sessionMinutesByLevel.A1).toBe(60);
    expect(data.classDefaults.sessionMinutesByLevel.A2).toBe(90);
    expect(data.classDefaults.sessionMinutesByLevel.B1).toBe(90);
    expect(data.curriculumByLevel.A2["16"]).toContain("Wohlbefinden und Entspannung");
    expect(data.curriculumByLevel.B1["1"]).toContain("Traumwelten");
    expect(data.coursePolicy).toEqual(
      expect.objectContaining({
        courseDurationWeeks: 10,
        fullPaymentAccessMonths: 6,
        installmentAccessMonths: 1,
        extensionGhsPerMonth: 1000,
      }),
    );
  });

  test("brochure schedule titles come from generated canonical curriculum, not a manual lesson table", () => {
    const source = publicClassFile("brochure.js");

    expect(source).not.toContain("COURSE_TITLES_BY_LEVEL");
    expect(source).toContain("brochureData?.curriculumByLevel");
    expect(source).toContain("FalowenLoadClassCatalog");
    expect(source).toContain("loadBrochureDataOnce");
  });

  test("brochure exposes safe catalogue failure, SEO data, and a render event", () => {
    const source = publicClassFile("brochure.js");

    expect(source).toContain("Live class schedule temporarily unavailable");
    expect(source).toContain('id = "falowenCourseStructuredData"');
    expect(source).toContain('"@type": "Course"');
    expect(source).toContain('new CustomEvent("falowen:brochure-rendered"');
  });

  test("lead capture shows decision-critical class details before contact fields", () => {
    const source = publicClassFile("class-leads.js");

    expect(source).toContain("leadDecisionSummary");
    expect(source).toContain("leadDecisionFee");
    expect(source).toContain("leadDecisionTimes");
    expect(source).toContain("leadDecisionLocation");
    expect(source).toContain("Register for this class");
    expect(source).toContain("Not sure of your level? Take the free placement test.");
    expect(source).toContain("FalowenLoadClassCatalog");
  });

  test("mobile registration, policy copy, and student proof are maintained by brochure enhancements", () => {
    const enhancements = publicClassFile("brochure-enhancements.js");
    const faq = publicClassFile("brochure-faq.js");
    const reviews = publicClassFile("brochure-footer-reviews.js");
    const hero = publicClassFile("class-hero-banner.js");
    const download = publicClassFile("brochure-download.js");

    expect(enhancements).toContain("brochureMobileCta");
    expect(enhancements).toContain("getCoursePolicy");
    expect(enhancements).toContain("What happens after you register?");
    expect(faq).toContain("window.FalowenClassBrochureData?.coursePolicy");
    expect(reviews).toContain("positionReviewsCard");
    expect(hero).toContain("classHeroBannerStyles");
    expect(hero).not.toContain('id="simpleClassFlowStyles"');
    expect(download).toContain("getCoursePolicy");
    expect(download).toContain("fullAccessMonths");
    expect(download).toContain("installmentAccessMonths");
    expect(download).toContain("isSelfLearning");
    expect(download).not.toContain("Includes six months of Falowen access");
  });
});
