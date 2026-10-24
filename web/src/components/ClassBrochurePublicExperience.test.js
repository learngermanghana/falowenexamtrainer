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
        links: expect.objectContaining({
          blog: "https://blog.falowen.app",
          linkedin: "https://www.linkedin.com/in/learngermanghana/",
          youtube: "https://www.youtube.com/@LLEAGhana",
          contractAgreement: "https://legal.falowen.app/",
        }),
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

  test("student reviews sit after course and payment details", () => {
    const reviews = publicClassFile("brochure-footer-reviews.js");

    expect(reviews).toContain('const courseDetails = document.getElementById("courseDetailsDisclosure")');
    expect(reviews).toContain('const agreement = document.getElementById("payment-agreement-section")');
    expect(reviews).not.toContain('const trackRecord = document.getElementById("academyTrackRecordCard")');
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

  test("class selection and other-class cards stay responsive across phone and desktop", () => {
    const leads = publicClassFile("class-leads.js");
    const flow = publicClassFile("class-simple-flow.js");
    const hero = publicClassFile("class-hero-banner.js");
    const postLead = publicClassFile("post-lead-focus.js");

    expect(leads).toContain("@media (min-width: 900px)");
    expect(leads).toContain("grid-template-columns: minmax(0, 1.1fr) minmax(320px, .9fr)");
    expect(leads).toContain(".lead-decision-grid, .lead-track-record { grid-template-columns: 1fr; }");
    expect(flow).toContain("lead-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}");
    expect(hero).toContain("@media(min-width:680px)");
    expect(hero).toContain("@media(min-width:1040px)");
    expect(postLead).toContain('link.textContent = "View all classes"');
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
    expect(enhancements).toContain("Falowen access with full payment");
    expect(enhancements).not.toContain('id="heroRegisterCta"');
  });

  test("legacy brochure scripts do not override the cleaned detail hierarchy", () => {
    const hero = publicClassFile("class-hero-banner.js");
    const location = publicClassFile("class-location-details.js");
    const download = publicClassFile("brochure-download-visible.js");
    const faq = publicClassFile("brochure-faq.js");

    expect(hero).toContain('link.textContent = "Register for this class"');
    expect(hero).toContain('cta.textContent = "Register for this class"');
    expect(hero).not.toContain('cta.textContent = "Register Now"');
    expect(location).toContain('document.getElementById("classDecisionSummary")');
    expect(download).toContain('document.querySelector(".decision-summary-actions")');
    expect(download).toContain("grid-column: 1 / -1");
    expect(faq).toContain('const academy = document.getElementById("academyTrackRecordCard")');
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
    expect(enhancements).toContain("function enforceBrochureOrder()");
    expect(enhancements).toContain("Meeting times & class schedule");
    expect(enhancements).toContain("mergeMeetingAndSchedule");
    expect(enhancements).toContain("brochure-detail-clean");
    expect(enhancements).toContain("document.getElementById(\"classLocationCard\")?.remove()");
    expect(enhancements).not.toContain(".intro-video, #brochureToc, .class-main-card { display: none !important; }");
    expect(enhancements).toContain("Attend in person in Awoshie");
    expect(enhancements).toContain("academyTrackRecordCard");
    expect(enhancements).toContain("academy-school-reference");
    expect(enhancements).toContain("academy-trust-links");
    expect(enhancements).toContain("About the school & team");
    expect(enhancements).toContain("Legal / Contract");
    expect(enhancements).not.toContain("<h2>Our track record</h2>");
    expect(enhancements).not.toContain("academy-track-record-grid");
    expect(enhancements).not.toContain("https://register.falowen.app/");
    expect(faq).toContain("window.FalowenClassBrochureData?.coursePolicy");
    expect(reviews).toContain("positionReviewsCard");
    expect(hero).toContain("classHeroBannerStyles");
    expect(hero).not.toContain('id="simpleClassFlowStyles"');
    expect(download).toContain("getCoursePolicy");
    expect(download).toContain("fullAccessMonths");
    expect(download).toContain("installmentAccessMonths");
    expect(download).toContain("isSelfLearning");
    expect(download).not.toContain('<section class="pdf-track-record">');
    expect(download).toContain('class="pdf-page pdf-page-three"');
    expect(download).toContain("pdf-location-hero");
    expect(download).toContain("pdf-classroom-photo");
    expect(download).toContain("academyProfile");
    expect(download).toContain("High exam pass rate");
    expect(download).not.toContain("Includes six months of Falowen access");
  });
});
