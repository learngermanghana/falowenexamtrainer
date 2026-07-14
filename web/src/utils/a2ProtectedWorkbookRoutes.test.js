import fs from "fs";
import path from "path";
import {
  A2_DAY20_DYNAMIC_LESSON_PATH,
  A2_DAY20_LEGACY_WORKBOOK_PATH,
  PROTECTED_A2_WORKBOOK_DAYS,
  hideDuplicateFloatingCourseSubmitButton,
  isDuplicateFloatingCourseSubmitButton,
  resolveProtectedA2WorkbookRedirect,
} from "./a2ProtectedWorkbookRoutes";

const expectedRoutes = {
  21: "/campus/course/a2-day-21-ein-wochenende-planen-workbook",
  22: "/campus/course/a2-day-22-die-woche-planung-workbook",
  23: "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook",
  24: "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
  25: "/campus/course/a2-day-25-tagesablauf-workbook",
  26: "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
  27: "/campus/course/a2-day-27-digitale-kommunikation-workbook",
  28: "/campus/course/a2-day-28-ueber-die-zukunft-sprechen-workbook",
};

describe("protected A2 workbook routes", () => {
  test("keeps Day 20 on the dynamic lesson hub without forcing the workbook", () => {
    expect(PROTECTED_A2_WORKBOOK_DAYS).toEqual([21, 22, 23, 24, 25, 26, 27, 28]);

    expect(
      resolveProtectedA2WorkbookRedirect({
        pathname: A2_DAY20_DYNAMIC_LESSON_PATH,
      }),
    ).toBe("");
    expect(
      resolveProtectedA2WorkbookRedirect({
        pathname: A2_DAY20_DYNAMIC_LESSON_PATH,
        search: "?chapter=7.20",
      }),
    ).toBe("");
  });

  test("keeps the restored Day 20 workbook directly accessible", () => {
    expect(
      resolveProtectedA2WorkbookRedirect({
        pathname: A2_DAY20_LEGACY_WORKBOOK_PATH,
      }),
    ).toBe("");
  });

  test("continues protecting generic A2 Days 21 to 28 with their custom workbook pages", () => {
    PROTECTED_A2_WORKBOOK_DAYS.forEach((day) => {
      expect(
        resolveProtectedA2WorkbookRedirect({
          pathname: `/campus/course/lesson/A2/${day}`,
        }),
      ).toBe(expectedRoutes[day]);
    });
  });

  test("does not redirect other A2 days or explicit grammar and learn views", () => {
    expect(resolveProtectedA2WorkbookRedirect({ pathname: "/campus/course/lesson/A2/19" })).toBe("");
    expect(
      resolveProtectedA2WorkbookRedirect({
        pathname: "/campus/course/lesson/A2/21",
        search: "?view=grammar&chapter=8.21",
      }),
    ).toBe("");
    expect(
      resolveProtectedA2WorkbookRedirect({
        pathname: "/campus/course/lesson/A2/21",
        search: "?view=learn&chapter=8.21",
      }),
    ).toBe("");
    expect(
      resolveProtectedA2WorkbookRedirect({
        pathname: "/campus/course/lesson/A2/21",
        search: "?view=workbook&chapter=8.21",
      }),
    ).toBe(expectedRoutes[21]);
  });

  test("keeps the later Day 20 Hören workbook content", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "../components/A2Day20TypischeReklamationssituationenWorkbookPage.js"),
      "utf8",
    );

    expect(source.length).toBeGreaterThan(15000);
    expect(source).toContain("Teil 1 · Sprechen");
    expect(source).toContain("Sprechen wie bei einer Mini-Präsentation");
    expect(source).toContain("Zentrales Thema: Reklamieren");
    expect(source).toContain("Teil 2 · Schreiben (Formeller Brief)");
    expect(source).toContain("pH1X3E7vOao");
    expect(source).toContain("Warum bringt Laura den Wasserkocher zurück?");
    expect(source).toContain("RadioFirstWorkbookGate");
    expect(source).not.toContain("A2StandardTabbedWorkbookPage");
  });
});

describe("duplicate Course Book submit cleanup", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("hides only the fixed duplicate Submit button near Study Buddy", () => {
    document.body.innerHTML = `
      <button id="header-submit" type="button">Submit work</button>
      <button id="floating-submit" type="button" aria-haspopup="dialog" aria-expanded="false" style="position: fixed">
        <span>✍️</span><span>Submit</span>
      </button>
      <button id="workbook-submit" type="button">Submit</button>
    `;

    const floating = document.getElementById("floating-submit");
    expect(isDuplicateFloatingCourseSubmitButton(floating)).toBe(true);
    expect(hideDuplicateFloatingCourseSubmitButton(document)).toBe(1);
    expect(floating.getAttribute("data-duplicate-course-submit-hidden")).toBe("true");
    expect(floating.getAttribute("aria-hidden")).toBe("true");
    expect(floating.style.display).toBe("none");

    expect(document.getElementById("header-submit").style.display).toBe("");
    expect(document.getElementById("workbook-submit").style.display).toBe("");
  });

  test("does not repeatedly count an already hidden duplicate", () => {
    document.body.innerHTML = `
      <button type="button" aria-haspopup="dialog" aria-expanded="false" style="position: fixed">Submit</button>
    `;

    expect(hideDuplicateFloatingCourseSubmitButton(document)).toBe(1);
    expect(hideDuplicateFloatingCourseSubmitButton(document)).toBe(0);
  });
});
