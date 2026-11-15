/** @jest-environment jsdom */
import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(__dirname, "../../public/classes/class-figma-brochure-detail.js"), "utf8");
const css = fs.readFileSync(path.resolve(__dirname, "../../public/classes/class-figma-brochure-detail.css"), "utf8");

test("published A1 and self-learning brochures render class-owned fees, modes, dates and links", () => {
  window.history.replaceState(null, "", "/classes/?class=a1-stuttgart-klasse&open=1");
  document.body.innerHTML = '<main class="page"><section class="hero"></section><div id="classTitle">A1 Stuttgart Klasse</div><a id="mainSignupCta" href="/signup/?class=a1-stuttgart-klasse">Register</a></main>';

  const a1 = {
    id: "a1-stuttgart-klasse-2026", slug: "a1-stuttgart-klasse", title: "A1 Stuttgart Klasse",
    language: "German", level: "A1", availability: "upcoming", format: "Live hybrid with recorded lessons",
    tuitionGhs: 3000, city: "Stuttgart", location: "Awoshie, Accra, Ghana",
    startDate: "2026-11-11", scheduleUrl: "https://admin.falowen.app/course-schedule/public?level=A1",
    meetingDays: [
      { day: "Monday", startTime: "11:00", endTime: "12:00" },
      { day: "Tuesday", startTime: "11:00", endTime: "12:00" },
      { day: "Wednesday", startTime: "11:00", endTime: "12:00" },
    ],
  };
  // JS executes against the same DOM/event API used by the public brochure.
  Function(source)();
  window.currentBrochureCourse = a1;
  window.dispatchEvent(new CustomEvent("falowen:brochure-rendered", { detail: { course: a1 } }));

  expect(document.querySelectorAll("#figmaBrochureHero")).toHaveLength(1);
  expect(document.getElementById("figmaBrochureCourse")).toHaveTextContent("A1 STUTTGART KLASSE");
  expect(document.getElementById("figmaBrochureHeading")).toHaveTextContent("Start speaking German with confidence.");
  expect(document.getElementById("figmaBrochurePrice")).toHaveTextContent("GHS 3,000");
  expect(document.getElementById("figmaBrochureMode")).toHaveTextContent("Hybrid");
  expect(document.getElementById("figmaBrochureStart")).toHaveTextContent("11 Nov 2026");
  expect(document.body).toHaveClass("figma-brochure-has-full-schedule");
  expect(document.getElementById("figmaBrochureScheduleLink").href).toContain("admin.falowen.app");
  expect(document.querySelector('nav[aria-label="Class brochure sections"] a[data-brochure-schedule]').href).toContain("admin.falowen.app");
  expect(document.querySelector('nav[aria-label="Class brochure sections"] a[href="#courseDetailsDisclosure"]')).not.toBeNull();
  expect(document.getElementById("figmaBrochureHeroRegister").getAttribute("aria-hidden")).toBeNull();
  expect(document.getElementById("figmaBrochureNavRegister").getAttribute("aria-hidden")).toBeNull();
  expect(document.getElementById("figmaBrochureHero").textContent).toContain("Monday to Wednesday");
  expect(document.getElementById("figmaBrochureHero").textContent).toContain("11:00 am");
  expect(document.getElementById("figmaBrochureHero").textContent).toContain("Awoshie, Accra, Ghana");
  expect(document.getElementById("figmaBrochureHeroRegister").href).toContain("/signup/?class=a1-stuttgart-klasse");
  expect(document.querySelector('nav[aria-label="Class brochure sections"] a[href="#faq-section"]')).not.toBeNull();

  const b2 = {
    id: "b2-self-learning", slug: "b2-self-learning", title: "B2 Self-Learning",
    language: "German", level: "B2", availability: "always", isSelfLearning: true,
    format: "Online self-learning", tuitionGhs: 2500, location: "Online", meetingDays: [],
  };
  document.getElementById("mainSignupCta").href = "/signup/?class=b2-self-learning";
  window.currentBrochureCourse = b2;
  window.dispatchEvent(new CustomEvent("falowen:brochure-rendered", { detail: { course: b2 } }));
  expect(document.querySelectorAll("#figmaBrochureHero")).toHaveLength(1);
  expect(document.getElementById("figmaBrochureHeading")).toHaveTextContent("Learn German on your schedule.");
  expect(document.getElementById("figmaBrochureStatus")).toHaveTextContent("START ANYTIME");
  expect(document.getElementById("figmaBrochurePrice")).toHaveTextContent("GHS 2,500");
  expect(document.getElementById("figmaBrochureMode")).toHaveTextContent("Self-learning");
  expect(document.body).not.toHaveClass("figma-brochure-has-full-schedule");
  expect(document.getElementById("figmaBrochureScheduleLink")).toHaveAttribute("hidden");
  expect(document.getElementById("figmaBrochureHero").textContent).not.toContain("Monday to Wednesday");
  expect(document.getElementById("figmaBrochureNavRegister").href).toContain("/signup/?class=b2-self-learning");
  expect(css).toContain("@media (max-width: 790px)");
  expect(css).toContain("#classDecisionSummary");
  expect(css).toContain("body.figma-brochure-detail #classDecisionSummary,");
  expect(css).toContain("body.figma-brochure-detail.figma-brochure-has-full-schedule #meeting-times-section");
  expect(css).toContain(".figma-brochure-hero-actions #downloadBrochureButton");

  document.body.innerHTML = "";
  document.body.className = "";
  window.history.replaceState(null, "", "/");
});

test("compact brochure avoids duplicate explanations and preserves the canonical actions", () => {
  const read = (file) => fs.readFileSync(path.resolve(__dirname, "../../public/classes", file), "utf8");
  const enhancements = read("brochure-enhancements.js");
  const faqs = read("brochure-faq.js");
  const downloadPlacement = read("brochure-download-visible.js");
  const download = read("brochure-download.js");
  const simpleFlow = read("class-simple-flow.js");
  const postLead = read("post-lead-focus.js");

  expect(enhancements).toContain('details.querySelector("summary")');
  expect(enhancements).toContain('heading.textContent = "Payment options"');
  expect(enhancements).toContain('(concise ? ["paymentGuidanceCard"]');
  expect(enhancements).toContain("Live lessons & recordings");
  expect(enhancements).toContain("Tutor feedback");
  expect(enhancements).toContain('document.getElementById("academyTrackRecordCard")?.remove()');
  expect(enhancements).toContain('document.getElementById("afterSignupCard")?.remove()');
  expect(enhancements).toContain('document.getElementById("whoForCard")?.remove()');
  expect(faqs).toContain("[0, 1, 3, 5, 7, 9]");
  expect(faqs).toContain("policy.officialCertificateNote");
  expect(downloadPlacement).toContain('document.querySelector("body.figma-brochure-detail .figma-brochure-hero-actions")');
  expect(download).toContain('document.querySelector("body.figma-brochure-detail .figma-brochure-hero-actions")');
  expect(simpleFlow).toContain('link.classList.contains("figma-brochure-primary")');
  expect(postLead).toContain('!link.classList.contains("figma-brochure-nav-register")');
});

test("detail presentation does not show on the public class chooser", () => {
  expect(source).toContain('if (!isClassPath && !isOpenClass) return;');
  expect(source).toContain('"falowen:brochure-rendered"');
  expect(source).toContain("event?.detail?.course || window.currentBrochureCourse");
  expect(source).toContain("target.origin === window.location.origin");
  expect(source).not.toContain("fetch(");
});
