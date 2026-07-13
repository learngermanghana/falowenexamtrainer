const fs = require("fs");
const path = require("path");

const webRoot = path.resolve(__dirname, "..");
const componentsRoot = path.join(webRoot, "src/components");
const appSource = fs.readFileSync(path.join(webRoot, "src/App.js"), "utf8");
const completionTabsSource = fs.readFileSync(
  path.join(componentsRoot, "A2LegacyWorkbookCompletionTabs.js"),
  "utf8",
);
const workbookRoutes = JSON.parse(
  fs.readFileSync(path.join(webRoot, "src/data/inAppWorkbookRoutes.json"), "utf8"),
);

const routePathname = (route = "") => String(route || "").split(/[?#]/)[0];
const questionCount = (source = "") =>
  (String(source || "").match(/\b(?:stem|prompt)\s*:/g) || []).length;

const resolveRouteComponent = (pathname) => {
  const routeIndex = appSource.indexOf(`path=\"${pathname}\"`);
  if (routeIndex < 0) return "";
  return (
    appSource
      .slice(routeIndex, routeIndex + 800)
      .match(/<(A2[A-Za-z0-9]+Workbook[A-Za-z0-9]*)\b/)?.[1] || ""
  );
};

const readComponent = (componentName) => {
  const importMatch = appSource.match(
    new RegExp(`import\\s+${componentName}\\s+from\\s+["']\\./components/([^"']+)["']`),
  );
  if (!importMatch) return { file: "", source: "" };
  const file = path.join(componentsRoot, `${importMatch[1]}.js`);
  return {
    file: path.relative(webRoot, file),
    source: fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "",
  };
};

const includeLegacy = (source = "") => {
  const match = source.match(
    /import\s+([A-Za-z0-9]+Legacy)\s+from\s+["']\.\/(A2[^"']+Legacy)["']/,
  );
  if (!match) return source;
  const legacyPath = path.join(componentsRoot, `${match[2]}.js`);
  return fs.existsSync(legacyPath)
    ? `${source}\n${fs.readFileSync(legacyPath, "utf8")}`
    : source;
};

const usesStandardShell = (source = "") => source.includes("A2StandardTabbedWorkbookPage");
const hasFourTeile = (source = "") =>
  usesStandardShell(source) ||
  [1, 2, 3, 4].every((teil) => new RegExp(`Teil\\s*${teil}\\b`, "i").test(source));
const hasCompletionRoute = (pathname = "") =>
  Boolean(pathname && completionTabsSource.includes(`\"${pathname}\"`));
const hasSubmission = (source = "", pathname = "") =>
  usesStandardShell(source) ||
  hasCompletionRoute(pathname) ||
  /ContextualAssignmentSubmissionPage|AssignmentSubmissionPage|A2B1WorkbookGuidance|key:\s*["']submit["']|label:\s*["'][^"']*Submit|Submit Workbook|submission area|submit your final/i.test(source);

const restoredMinimums = {
  16: { characters: 22000, questions: 10 },
  18: { characters: 20000, questions: 10 },
  19: { characters: 22000, questions: 12 },
  20: { characters: 18000, questions: 13 },
  21: { characters: 16000, questions: 5 },
  26: { characters: 15000, questions: 7 },
};

const report = [];
for (let day = 1; day <= 28; day += 1) {
  const route = workbookRoutes?.A2?.[String(day)]?.["*"] || "";
  const pathname = routePathname(route);
  const componentName = resolveRouteComponent(pathname);
  const component = readComponent(componentName);
  const source = includeLegacy(component.source);
  const warnings = [];

  if (!route.startsWith("/campus/course/")) warnings.push("route is not internal");
  if (/drive\.google\.com|docs\.google\.com|^https?:\/\//i.test(route)) warnings.push("external workbook route");
  if (!pathname || !appSource.includes(`path=\"${pathname}\"`)) warnings.push("route is not registered");
  if (!componentName || !component.source) warnings.push("component is missing");
  if (source.length < 1200) warnings.push("component is too small");
  if (!hasFourTeile(source)) warnings.push("Teil 1–4 coverage is incomplete");
  if (!hasSubmission(source, pathname)) warnings.push("submission support is missing");
  if (/default workbook|placeholder workbook|coming soon/i.test(source)) warnings.push("placeholder text detected");

  if (usesStandardShell(source)) {
    ["title=", "chapter=", "workbookId=", "topicPrompt=", "lesenQuestions=", "hoerenQuestions="].forEach(
      (marker) => {
        if (!source.includes(marker)) warnings.push(`missing ${marker}`);
      },
    );
    if (!/schreibenTask=|schreibenContent=/.test(source)) warnings.push("writing task is missing");
    if (questionCount(source) < 7) warnings.push("too few standard-shell question items");
  }

  const restored = restoredMinimums[day];
  if (restored) {
    if (source.length < restored.characters) warnings.push("restored full content was reduced");
    if (questionCount(source) < restored.questions) warnings.push("restored question set was reduced");
    if (!hasCompletionRoute(pathname)) warnings.push("restored Ref/Submit completion route is missing");
  }

  if (day === 18 && !source.includes("cHKVQOLWv7c")) {
    warnings.push("Day 18 YouTube listening video is missing");
  }

  report.push({
    day,
    route,
    pathname,
    componentName,
    componentFile: component.file,
    sourceCharacters: source.length,
    questionItems: questionCount(source),
    usesStandardShell: usesStandardShell(source),
    hasFourTeile: hasFourTeile(source),
    hasSubmission: hasSubmission(source, pathname),
    hasCompletionRoute: hasCompletionRoute(pathname),
    warnings,
  });
}

const warningDays = report.filter((entry) => entry.warnings.length).map((entry) => entry.day);
const output = {
  generatedAt: new Date().toISOString(),
  totalDays: report.length,
  warningDays,
  report,
};

fs.writeFileSync(
  path.join(webRoot, "a2-workbook-audit.json"),
  `${JSON.stringify(output, null, 2)}\n`,
);
console.log(JSON.stringify(output, null, 2));

if (warningDays.length) {
  console.error(`A2 workbook integrity failed for day(s): ${warningDays.join(", ")}`);
  process.exitCode = 1;
}
