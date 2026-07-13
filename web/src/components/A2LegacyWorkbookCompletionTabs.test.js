import fs from "fs";
import path from "path";

const componentSource = fs.readFileSync(
  path.resolve(__dirname, "A2LegacyWorkbookCompletionTabs.js"),
  "utf8",
);
const routeServicesSource = fs.readFileSync(
  path.resolve(__dirname, "RouteScopedAppServices.js"),
  "utf8",
);

const restoredRoutes = [
  "/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook",
  "/campus/course/a2-day-18-die-bank-anrufen-workbook",
  "/campus/course/a2-day-19-einkaufen-wo-und-wie-workbook",
  "/campus/course/a2-day-20-typische-reklamationssituationen-workbook",
  "/campus/course/a2-day-21-ein-wochenende-planen-workbook",
  "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
];

describe("A2LegacyWorkbookCompletionTabs", () => {
  it("covers every restored rich workbook route", () => {
    restoredRoutes.forEach((route) => {
      expect(componentSource).toContain(`\"${route}\"`);
    });

    [16, 18, 19, 20, 21, 26].forEach((day) => {
      expect(componentSource).toContain(`day: ${day}`);
    });
  });

  it("injects missing Ref and Submit controls into four-part legacy workbooks", () => {
    expect(componentSource).toContain('label: "5. Ref"');
    expect(componentSource).toContain('label: "Submit"');
    expect(componentSource).toContain('data-a2-legacy-completion-tab');
    expect(componentSource).toContain('["teil1", "teil2", "teil3", "teil4"]');
    expect(componentSource).toMatch(/keys\.has\("references"\)/);
    expect(componentSource).toMatch(/keys\.has\("submit"\)/);
  });

  it("connects Ref and Submit to the real workbook services", () => {
    expect(componentSource).toContain("WorkbookReferenceAnswers");
    expect(componentSource).toContain("ContextualAssignmentSubmissionPage");
    expect(componentSource).toContain("canonicalAssignmentKey: assignmentKey");
    expect(componentSource).toContain("workbookId: config.workbookId");
  });

  it("mounts the completion tabs for route-scoped workbook pages", () => {
    expect(routeServicesSource).toContain(
      'import A2LegacyWorkbookCompletionTabs from "./A2LegacyWorkbookCompletionTabs";',
    );
    expect(routeServicesSource).toContain("<A2LegacyWorkbookCompletionTabs />");
  });
});
