import fs from "fs";
import path from "path";
import workbookRoutes from "../data/inAppWorkbookRoutes.json";

const componentsRoot = path.resolve(__dirname);
const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
const standardShellSource = fs.readFileSync(
  path.resolve(__dirname, "A2StandardTabbedWorkbookPage.js"),
  "utf8",
);

const routePathname = (route = "") => String(route || "").split(/[?#]/)[0];

const readComponentSource = (componentName) => {
  const importPattern = new RegExp(
    `import\\s+${componentName}\\s+from\\s+["']\\./components/([^"']+)["']`,
  );
  const importMatch = appSource.match(importPattern);
  if (!importMatch) return { filePath: "", source: "" };
  const filePath = path.resolve(componentsRoot, `${importMatch[1]}.js`);
  return {
    filePath,
    source: fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "",
  };
};

const resolveRouteComponent = (pathname) => {
  const routeIndex = appSource.indexOf(`path=\"${pathname}\"`);
  if (routeIndex < 0) return "";
  const routeWindow = appSource.slice(routeIndex, routeIndex + 700);
  return routeWindow.match(/<(A2[A-Za-z0-9]+Workbook[A-Za-z0-9]*)\b/)?.[1] || "";
};

const includeLegacySource = (source = "") => {
  const legacyImport = source.match(
    /import\s+([A-Za-z0-9]+Legacy)\s+from\s+["']\.\/(A2[^"']+Legacy)["']/,
  );
  if (!legacyImport) return source;
  const legacyPath = path.resolve(componentsRoot, `${legacyImport[2]}.js`);
  return fs.existsSync(legacyPath)
    ? `${source}\n${fs.readFileSync(legacyPath, "utf8")}`
    : source;
};

const countQuestionItems = (source = "") =>
  (source.match(/\b(?:stem|prompt)\s*:/g) || []).length;

const usesStandardShell = (source = "") =>
  source.includes("A2StandardTabbedWorkbookPage");

const hasFourTeilExperience = (source = "") =>
  usesStandardShell(source) ||
  [1, 2, 3, 4].every((teil) => new RegExp(`Teil\\s*${teil}\\b`, "i").test(source));

const hasSubmissionExperience = (source = "") =>
  usesStandardShell(source) ||
  /ContextualAssignmentSubmissionPage|AssignmentSubmissionPage|A2B1WorkbookGuidance|key:\s*["']submit["']|label:\s*["'][^"']*Submit|Submit Workbook|submission area|submit section|submit your final/i.test(
    source,
  );

const routeEntries = Array.from({ length: 28 }, (_, index) => {
  const day = index + 1;
  const route = workbookRoutes?.A2?.[String(day)]?.["*"] || "";
  const pathname = routePathname(route);
  const componentName = resolveRouteComponent(pathname);
  const component = readComponentSource(componentName);
  return {
    day,
    route,
    pathname,
    componentName,
    filePath: component.filePath,
    source: component.source,
    combinedSource: includeLegacySource(component.source),
  };
});

const getDay = (day) => routeEntries.find((entry) => entry.day === day);

describe("A2 workbook integrity", () => {
  it("keeps the shared A2 shell connected to Teil 1–4, Ref and Submit", () => {
    expect(standardShellSource).toContain("STANDARD_WORKBOOK_TABS");
    expect(standardShellSource).toContain('activeTab === "sprechen"');
    expect(standardShellSource).toContain('activeTab === "schreiben"');
    expect(standardShellSource).toContain('activeTab === "lesen"');
    expect(standardShellSource).toContain('activeTab === "hoeren"');
    expect(standardShellSource).toContain('activeTab === "references"');
    expect(standardShellSource).toContain('activeTab === "submit"');
    expect(standardShellSource).toContain("WorkbookReferenceAnswers");
    expect(standardShellSource).toContain("ContextualAssignmentSubmissionPage");
    expect(standardShellSource).toContain("canonicalAssignmentKey: assignmentKey");
  });

  it("registers one internal workbook route and component for every A2 day", () => {
    expect(routeEntries).toHaveLength(28);
    const seenRoutes = new Set();

    routeEntries.forEach(({ day, route, pathname, componentName, filePath, source }) => {
      expect(route).toMatch(/^\/campus\/course\//);
      expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com|^https?:\/\//i);
      expect(pathname).toBeTruthy();
      expect(appSource).toContain(`path=\"${pathname}\"`);
      expect(componentName).toMatch(/^A2/);
      expect(filePath).toBeTruthy();
      expect(fs.existsSync(filePath)).toBe(true);
      expect(source.length).toBeGreaterThan(500);
      expect(seenRoutes.has(route)).toBe(false);
      seenRoutes.add(route);
      expect(componentName).toMatch(new RegExp(`A2Day(?:${day}|2)`, "i"));
    });
  });

  it("keeps every A2 workbook substantive with Teil 1–4 and submission support", () => {
    routeEntries.forEach(({ day, combinedSource }) => {
      expect(combinedSource.length).toBeGreaterThan(1200);
      expect(hasFourTeilExperience(combinedSource)).toBe(true);
      expect(hasSubmissionExperience(combinedSource)).toBe(true);
      expect(combinedSource).not.toMatch(/default workbook|placeholder workbook|coming soon/i);

      if (usesStandardShell(combinedSource)) {
        expect(combinedSource).toContain(`day={${day}}`);
        expect(combinedSource).toMatch(/title=/);
        expect(combinedSource).toMatch(/chapter=/);
        expect(combinedSource).toMatch(/workbookId=/);
        expect(combinedSource).toMatch(/topicPrompt=/);
        expect(combinedSource).toMatch(/schreibenTask=|schreibenContent=/);
        expect(combinedSource).toMatch(/lesenQuestions=/);
        expect(combinedSource).toMatch(/hoerenQuestions=/);
        expect(countQuestionItems(combinedSource)).toBeGreaterThanOrEqual(6);
      }
    });
  });

  it("keeps Days 16, 18, 19, 20 and 21 on the known-good standard layout", () => {
    [16, 18, 19, 20, 21].forEach((day) => {
      const source = getDay(day)?.source || "";
      expect(source).toContain("A2StandardTabbedWorkbookPage");
      expect(source).not.toContain("useNavigate");
      expect(countQuestionItems(source)).toBeGreaterThanOrEqual(6);
    });

    expect(getDay(16)?.source).toContain('title="Wohlbefinden und Entspannung"');
    expect(getDay(18)?.source).toContain('hoerenAudioUrl="https://youtu.be/cHKVQOLWv7c"');
    expect(getDay(19)?.source).toContain('title="Einkaufen? Wo und wie?"');
    expect(getDay(19)?.source).toContain("Wo kaufst du lieber ein: online, im Supermarkt oder auf dem Markt?");
    expect(getDay(20)?.source).toContain('title="Typische Reklamationssituationen üben"');
    expect(getDay(21)?.source).toContain('title="Ein Wochenende planen"');
  });

  it("keeps the existing rich Day 26 custom workbook and final Day 28 workbook", () => {
    const day26 = getDay(26)?.combinedSource || "";
    const day28 = getDay(28)?.combinedSource || "";

    expect(day26).toContain("Gefühle in verschiedenen Situationen");
    expect(day26).toContain("Lesetext: Schwangerschaft");
    expect(day26).toContain('label: "5. Ref"');
    expect(countQuestionItems(day26)).toBeGreaterThanOrEqual(7);

    expect(day28).toMatch(/Teil\s*4/i);
    expect(hasSubmissionExperience(day28)).toBe(true);
  });
});
