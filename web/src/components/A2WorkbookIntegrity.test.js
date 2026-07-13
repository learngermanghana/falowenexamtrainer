import fs from "fs";
import path from "path";
import workbookRoutes from "../data/inAppWorkbookRoutes.json";

const componentsRoot = path.resolve(__dirname);
const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");

const routePathname = (route = "") => String(route || "").split(/[?#]/)[0];

const readComponentSource = (componentName) => {
  const importPattern = new RegExp(
    `import\\s+${componentName}\\s+from\\s+[\"']\\./components/([^\"']+)[\"']`,
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

const getMeaningfulLineCount = (source = "") =>
  String(source)
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("//")).length;

const hasFourTeilExperience = (source = "") => {
  if (source.includes("A2StandardTabbedWorkbookPage")) return true;
  return [1, 2, 3, 4].every((teil) => new RegExp(`Teil\\s*${teil}\\b`, "i").test(source));
};

const hasSubmissionExperience = (source = "") =>
  /A2StandardTabbedWorkbookPage|ContextualAssignmentSubmissionPage|AssignmentSubmissionPage|Submit Workbook|submit tab/i.test(
    source,
  );

const countQuestionStems = (source = "") => (source.match(/\bstem\s*:/g) || []).length;

const routeEntries = Array.from({ length: 28 }, (_, index) => {
  const day = index + 1;
  const route = workbookRoutes?.A2?.[String(day)]?.["*"] || "";
  const pathname = routePathname(route);
  const componentName = resolveRouteComponent(pathname);
  const component = readComponentSource(componentName);
  const combinedSource = includeLegacySource(component.source);
  return {
    day,
    route,
    pathname,
    componentName,
    filePath: component.filePath,
    source: component.source,
    combinedSource,
  };
});

describe("A2 workbook integrity", () => {
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

  it("keeps every A2 workbook substantive and exposes Teil 1–4 plus submission", () => {
    routeEntries.forEach(({ day, combinedSource }) => {
      expect(getMeaningfulLineCount(combinedSource)).toBeGreaterThan(25);
      expect(hasFourTeilExperience(combinedSource)).toBe(true);
      expect(hasSubmissionExperience(combinedSource)).toBe(true);
      expect(combinedSource).not.toMatch(/default workbook|placeholder workbook|coming soon/i);

      if (combinedSource.includes("A2StandardTabbedWorkbookPage")) {
        expect(combinedSource).toContain(`day={${day}}`);
        expect(combinedSource).toMatch(/title=/);
        expect(combinedSource).toMatch(/chapter=/);
        expect(combinedSource).toMatch(/workbookId=/);
        expect(combinedSource).toMatch(/topicPrompt=/);
        expect(combinedSource).toMatch(/schreibenTask=|schreibenContent=/);
        expect(combinedSource).toMatch(/lesenQuestions=/);
        expect(combinedSource).toMatch(/hoerenQuestions=/);
        expect(countQuestionStems(combinedSource)).toBeGreaterThanOrEqual(10);
      }
    });
  });

  it("keeps the restored Day 16 workbook and the final Day 28 workbook complete", () => {
    const day16 = routeEntries.find((entry) => entry.day === 16);
    const day28 = routeEntries.find((entry) => entry.day === 28);

    expect(day16?.combinedSource).toContain("Zentrales Thema");
    expect(day16?.combinedSource).toContain("Anzeige F");
    expect(countQuestionStems(day16?.combinedSource)).toBeGreaterThanOrEqual(10);

    expect(day28?.combinedSource).toMatch(/Teil\s*4/i);
    expect(hasSubmissionExperience(day28?.combinedSource)).toBe(true);
  });
});
