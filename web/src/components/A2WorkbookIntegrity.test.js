import fs from "fs";
import path from "path";
import workbookRoutes from "../data/inAppWorkbookRoutes.json";

const componentsRoot = path.resolve(__dirname);
const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
const completionTabsSource = fs.readFileSync(
  path.resolve(__dirname, "A2LegacyWorkbookCompletionTabs.js"),
  "utf8",
);
const routeServicesSource = fs.readFileSync(
  path.resolve(__dirname, "RouteScopedAppServices.js"),
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

const hasFourTeilExperience = (source = "") => {
  if (source.includes("A2StandardTabbedWorkbookPage")) return true;
  return [1, 2, 3, 4].every((teil) => new RegExp(`Teil\\s*${teil}\\b`, "i").test(source));
};

const hasRouteScopedCompletion = (pathname = "") =>
  Boolean(pathname && completionTabsSource.includes(`\"${pathname}\"`));

const hasSubmissionExperience = (source = "", pathname = "") =>
  hasRouteScopedCompletion(pathname) ||
  /A2StandardTabbedWorkbookPage|ContextualAssignmentSubmissionPage|AssignmentSubmissionPage|A2B1WorkbookGuidance|key:\s*["']submit["']|label:\s*["'][^"']*Submit|Submit Workbook|submission area|submit section|submit your final/i.test(
    source,
  );

const countQuestionItems = (source = "") =>
  (source.match(/\b(?:stem|prompt)\s*:/g) || []).length;

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

const getDay = (day) => routeEntries.find((entry) => entry.day === day);

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

  it("keeps every A2 workbook substantive with Teil 1–4 and a submission path", () => {
    expect(routeServicesSource).toContain("<A2LegacyWorkbookCompletionTabs />");

    routeEntries.forEach(({ day, pathname, combinedSource }) => {
      expect(combinedSource.length).toBeGreaterThan(1200);
      expect(hasFourTeilExperience(combinedSource)).toBe(true);
      expect(hasSubmissionExperience(combinedSource, pathname)).toBe(true);
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
        expect(countQuestionItems(combinedSource)).toBeGreaterThanOrEqual(7);
      }
    });
  });

  it("keeps restored full lesson content instead of generic fallback text", () => {
    const day16 = getDay(16)?.combinedSource || "";
    const day18 = getDay(18)?.combinedSource || "";
    const day19 = getDay(19)?.combinedSource || "";
    const day20 = getDay(20)?.combinedSource || "";
    const day21 = getDay(21)?.combinedSource || "";
    const day26 = getDay(26)?.combinedSource || "";

    expect(day16).toContain("Anzeige F");
    expect(day16).toContain("Sprechen wie bei einer Mini-Präsentation");
    expect(countQuestionItems(day16)).toBeGreaterThanOrEqual(10);

    expect(day18).toContain("Choosing a Bank: Anzeige");
    expect(day18).toContain("ING-DiBa");
    expect(day18).toContain("cHKVQOLWv7c");
    expect(countQuestionItems(day18)).toBeGreaterThanOrEqual(10);

    expect(day19).toContain("Konsumverhalten in der modernen Gesellschaft");
    expect(day19).toContain("Fair Trade-Produkte");
    expect(day19).toContain("Sprechen wie bei einer Mini-Präsentation");
    expect(countQuestionItems(day19)).toBeGreaterThanOrEqual(10);

    expect(day20).toContain("Zentrales Thema: Reklamieren");
    expect(day20).toContain("Warum bringt Laura den Wasserkocher zurück?");
    expect(day20).toContain("Sprechen wie bei einer Mini-Präsentation");
    expect(countQuestionItems(day20)).toBeGreaterThanOrEqual(10);

    expect(day21).toContain("Sprechen wie bei einer Mini-Präsentation");
    expect(day21).toMatch(/Wochenende/i);
    expect(countQuestionItems(day21)).toBeGreaterThanOrEqual(8);

    expect(day26).toContain("Gefühle in verschiedenen Situationen");
    expect(day26).toContain("Sprechen wie bei einer Mini-Präsentation");
    expect(day26).toContain("Lesetext: Schwangerschaft");
    expect(countQuestionItems(day26)).toBeGreaterThanOrEqual(7);
  });

  it("keeps the final Day 28 workbook complete", () => {
    const day28 = getDay(28)?.combinedSource || "";
    expect(day28).toMatch(/Teil\s*4/i);
    expect(hasSubmissionExperience(day28, getDay(28)?.pathname)).toBe(true);
  });
});
