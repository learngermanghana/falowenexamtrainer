import fs from "fs";
import path from "path";

const publicClassFile = (name) =>
  fs.readFileSync(path.resolve(__dirname, "../../public/classes", name), "utf8");

describe("public class brochure experience", () => {
  test("generated brochure data owns canonical curriculum and shared policy", () => {
    const data = JSON.parse(publicClassFile("classes-data.json"));

    expect(data.classDefaults.tuitionGhsByLevel.A1).toBe(3000);
    expect(data.classDefaults.tuitionGhsByLevel.A2).toBe(3000);
    expect(data.classDefaults.sessionMinutesByLevel.A1).toBe(60);
    expect(data.classDefaults.sessionMinutesByLevel.A2).toBe(90);
    expect(data.classDefaults.sessionMinutesByLevel.B1).toBe(90);
    expect(data.curriculumByLevel.A2["16"]).toContain("Wohlbefinden und Entspannung");
    expect(data.curriculumByLevel.B1["1"]).toContain("Traumwelten");
    expect(data.academyProfile).toEqual(
      expect.objectContaining({
        establishedYear: 2022,
        germanLevels: "A1–C2",
        examPassHeadline: "High exam pass rate",
        mapsUrl: "https://maps.app.goo.gl/CPYX7uCj9YSELc1Q9",
        classroomImage: "/classes/llea-classroom.jpg",
      }),
    );
    expect(data.coursePolicy).toEqual(
      expect.objectContaining({
        courseDurationWeeks: 10,
        fullPaymentAccessMonths: 6,
        installmentAccessMonths: 1,
        extensionGhsPerMonth: 1000,
      }),
    );
  });

  test("brochure, signup billing, visitor guide and live class API share the current admissions fee policy", () => {
    const levelFees = fs.readFileSync(path.resolve(__dirname, "../data/levelFees.js"), "utf8");
    const publicClasses = fs.readFileSync(
      path.resolve(__dirname, "../../../functions/functionz/routes/publicClasses.js"),
      "utf8",
    );
    const catalog = fs.readFileSync(path.resolve(__dirname, "../services/publicClassCatalogService.js"), "utf8");
    const sync = fs.readFileSync(path.resolve(__dirname, "../../scripts/sync-class-brochure-data.mjs"), "utf8");
    const data = JSON.parse(publicClassFile("classes-data.json"));

    const levelFeeLiteral = levelFees.match(/export const LEVEL_FEES = (\{[\s\S]*?\n\});/)?.[1];
    const publicFeeLiteral = publicClasses.match(/const TUITION = (\{[^\n]+\});/)?.[1];
    expect(levelFeeLiteral).toBeTruthy();
    expect(publicFeeLiteral).toBeTruthy();

    const signupFees = Function(`return (${levelFeeLiteral});`)();
    const apiFees = Function(`return (${publicFeeLiteral});`)();

    expect(signupFees).toEqual({ A1: 3000, A2: 3000, B1: 3000, B2: 3000, C1: 3000 });
    expect(apiFees).toEqual(signupFees);
    expect(data.classDefaults.tuitionGhsByLevel).toEqual(signupFees);
    expect(catalog).toContain('getTuitionFeeForLevel(level)');
    expect(sync).toContain("canonical tuition settings");
    expect(sync).toContain("tuitionGhsByLevel,");
    expect(publicClasses).toContain("A2: 90");
    expect(publicClasses).toContain("TUITION[level] || data.tuitionGhs");
    expect(publicClasses).not.toContain('level === "A1" ? TUITION.A1');
  });

  test("student reviews follow the visible academy track record and lead card", () => {
    const reviews = publicClassFile("brochure-footer-reviews.js");
    const trackIndex = reviews.indexOf('const trackRecord = document.getElementById("academyTrackRecordCard")');
    const leadIndex = reviews.indexOf('const leadCard = document.getElementById("leadCaptureCard")');
    const anchorIndex = reviews.indexOf("const anchor =");
    const preferredTrackIndex = reviews.indexOf("trackRecord\n      || leadCard");

    expect(trackIndex).toBeGreaterThan(-1);
    expect(leadIndex).toBeGreaterThan(trackIndex);
    expect(anchorIndex).toBeGreaterThan(leadIndex);
    expect(preferredTrackIndex).toBeGreaterThan(anchorIndex);
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

  test("lead capture shows class details below the form fields without another register button", () => {
    const source = publicClassFile("class-leads.js");
    const formGridIndex = source.indexOf('class="lead-form-grid"');
    const formEndIndex = source.indexOf("</form>", formGridIndex);
    const decisionSummaryIndex = source.indexOf('${buildDecisionSummary(selected, data)}', formEndIndex);

    expect(formGridIndex).toBeGreaterThan(-1);
    expect(formEndIndex).toBeGreaterThan(formGridIndex);
    expect(decisionSummaryIndex).toBeGreaterThan(formEndIndex);
    expect(source).toContain("leadDecisionSummary");
    expect(source).toContain("leadDecisionFee");
    expect(source).toContain("leadDecisionTimes");
    expect(source).toContain("leadDecisionLocation");
    expect(source).toContain("lead-track-record");
    expect(source).toContain("High exam pass rate");
    expect(source).toContain("Established");
    expect(source).toContain("Not sure of your level? Take the free placement test.");
    expect(source).not.toContain('id="leadRegisterDirect"');
    expect(source).not.toContain("Register for this class");
    expect(source).toContain("FalowenLoadClassCatalog");
  });

  test("fallback catalogue keeps A1, A2 and B1 available instead of collapsing to B2 and C1", () => {
    const brochure = publicClassFile("brochure.js");
    const filter = publicClassFile("active-class-filter.js");

    expect(brochure).toContain('const liveLevels = ["A1", "A2", "B1"]');
    expect(brochure).toContain('availability: "enquiry"');
    expect(brochure).toContain("buildFallbackClassList");
    expect(brochure).toContain("missingLiveLevelChoices");
    expect(brochure).toContain("Next class date to be announced");
    expect(brochure).toContain('Class schedule: ${classScheduleUrl || "To be announced"}');
    expect(filter).toContain('course.availability === "enquiry"');
    expect(filter).not.toContain('sourceIsLive || course.availability === "always"');
  });

  test("brochure keeps one primary registration CTA", () => {
    const flow = publicClassFile("class-simple-flow.js");
    const enhancements = publicClassFile("brochure-enhancements.js");

    expect(flow).toContain("removeDuplicateRegisterButtons");
    expect(flow).not.toContain("Register right away");
    expect(enhancements).not.toContain('id="heroRegisterCta"');
    expect(enhancements).toContain("removeStickyMobileRegisterBar");
    expect(enhancements).toContain('id="mainSignupCta"');
    expect(enhancements).toContain("Register for this class");
    expect(enhancements).toContain("classDecisionSummary");
    expect(enhancements).toContain("decisionScheduleCta");
    expect(enhancements).toContain("Open Google Maps");
    expect(enhancements).not.toContain('id="heroRegisterCta"');
  });

  test("synthetic enquiry classes hand signup a supported level instead of an unresolved class slug", () => {
    const flow = publicClassFile("class-simple-flow.js");
    const enhancements = publicClassFile("brochure-enhancements.js");

    expect(flow).toContain('(?:next|upcoming)-live-class');
    expect(flow).toContain('"&enquiry=1"');
    expect(enhancements).toContain('course.availability === "enquiry"');
    expect(enhancements).toContain('&enquiry=1');
    expect(enhancements).toContain('params.set("level", level)');
  });

  test("mobile registration, policy copy, and student proof are maintained by brochure enhancements", () => {
    const enhancements = publicClassFile("brochure-enhancements.js");
    const faq = publicClassFile("brochure-faq.js");
    const reviews = publicClassFile("brochure-footer-reviews.js");
    const hero = publicClassFile("class-hero-banner.js");
    const download = publicClassFile("brochure-download.js");

    expect(enhancements).toContain("removeStickyMobileRegisterBar");
    expect(enhancements).toContain("getCoursePolicy");
    expect(enhancements).toContain("What happens after you register?");
    expect(enhancements).toContain("Advanced teaching slides");
    expect(enhancements).toContain("Recorded teacher explanations");
    expect(enhancements).toContain("Tutor-marked assignments");
    expect(enhancements).toContain("Progress tracking");
    expect(enhancements).toContain("Exam preparation");
    expect(enhancements).toContain("More course & payment details");
    expect(enhancements).toContain("Attend in person in Awoshie");
    expect(enhancements).toContain(".intro-video, #brochureToc { display: none !important; }");
    expect(enhancements).toContain("academyTrackRecordCard");
    expect(enhancements).toContain("High exam pass rate");
    expect(enhancements).toContain("Established");
    expect(faq).toContain("window.FalowenClassBrochureData?.coursePolicy");
    expect(reviews).toContain("positionReviewsCard");
    expect(hero).toContain("classHeroBannerStyles");
    expect(hero).not.toContain('id="simpleClassFlowStyles"');
    expect(download).toContain("getCoursePolicy");
    expect(download).toContain("fullAccessMonths");
    expect(download).toContain("installmentAccessMonths");
    expect(download).toContain("isSelfLearning");
    expect(download).toContain("pdf-track-record");
    expect(download).toContain("academyProfile");
    expect(download).toContain("High exam pass rate");
    expect(download).not.toContain("Includes six months of Falowen access");
  });
});
