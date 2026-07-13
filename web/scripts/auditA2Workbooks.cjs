const fs = require("fs");
const path = require("path");

const webRoot = path.resolve(__dirname, "..");
const componentsRoot = path.join(webRoot, "src/components");
const appSource = fs.readFileSync(path.join(webRoot, "src/App.js"), "utf8");
const workbookRoutes = JSON.parse(
  fs.readFileSync(path.join(webRoot, "src/data/inAppWorkbookRoutes.json"), "utf8"),
);

const routePathname = (route = "") => String(route || "").split(/[?#]/)[0];
const count = (source, pattern) => (String(source || "").match(pattern) || []).length;
const lineCount = (source) => String(source || "").split("\n").filter((line) => line.trim()).length;

const resolveRouteComponent = (pathname) => {
  const routeIndex = appSource.indexOf(`path=\"${pathname}\"`);
  if (routeIndex < 0) return "";
  return appSource
    .slice(routeIndex, routeIndex + 800)
    .match(/<(A2[A-Za-z0-9]+Workbook[A-Za-z0-9]*)\b/)?.[1] || "";
};

const readComponent = (componentName) => {
  const importMatch = appSource.match(
    new RegExp(`import\\s+${componentName}\\s+from\\s+[\"']\\./components/([^\"']+)[\"']`),
  );
  if (!importMatch) return { file: "", source: "" };
  const file = path.join(componentsRoot, `${importMatch[1]}.js`);
  return { file: path.relative(webRoot, file), source: fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "" };
};

const includeLegacy = (source) => {
  const match = String(source || "").match(
    /import\s+([A-Za-z0-9]+Legacy)\s+from\s+["']\.\/(A2[^"']+Legacy)["']/,
  );
  if (!match) return { source, legacyFile: "" };
  const legacyPath = path.join(componentsRoot, `${match[2]}.js`);
  if (!fs.existsSync(legacyPath)) return { source, legacyFile: "" };
  return {
    source: `${source}\n${fs.readFileSync(legacyPath, "utf8")}`,
    legacyFile: path.relative(webRoot, legacyPath),
  };
};

const report = [];
for (let day = 1; day <= 28; day += 1) {
  const route = workbookRoutes?.A2?.[String(day)]?.["*"] || "";
  const pathname = routePathname(route);
  const componentName = resolveRouteComponent(pathname);
  const component = readComponent(componentName);
  const combined = includeLegacy(component.source);
  const source = combined.source || "";
  const usesStandardShell = source.includes("A2StandardTabbedWorkbookPage");
  const teilCoverage = [1, 2, 3, 4].map((teil) =>
    usesStandardShell || new RegExp(`Teil\\s*${teil}\\b`, "i").test(source),
  );
  const requiredStandardProps = [
    "title=",
    "chapter=",
    "workbookId=",
    "topicPrompt=",
    "lesenQuestions=",
    "hoerenQuestions=",
  ];
  const missingStandardProps = usesStandardShell
    ? requiredStandardProps.filter((marker) => !source.includes(marker))
    : [];
  if (usesStandardShell && !/schreibenTask=|schreibenContent=/.test(source)) {
    missingStandardProps.push("schreibenTask or schreibenContent");
  }

  const questionStems = count(source, /\bstem\s*:/g);
  const hasSubmit = /ContextualAssignmentSubmissionPage|AssignmentSubmissionPage|Submit Workbook|submit tab/i.test(source);
  const hasGuidance = /A2B1WorkbookGuidance/.test(source);
  const warnings = [];
  if (!route || !pathname) warnings.push("missing route");
  if (!appSource.includes(`path=\"${pathname}\"`)) warnings.push("route not registered");
  if (!componentName || !component.source) warnings.push("component missing");
  if (lineCount(source) < 80) warnings.push("very short component");
  if (!teilCoverage.every(Boolean)) warnings.push("missing Teil coverage");
  if (!hasSubmit && !hasGuidance) warnings.push("no visible Submit support in component");
  if (usesStandardShell && questionStems < 10) warnings.push(`only ${questionStems} question stems`);
  if (missingStandardProps.length) warnings.push(`missing standard props: ${missingStandardProps.join(", ")}`);
  if (/default workbook|placeholder workbook|coming soon/i.test(source)) warnings.push("placeholder content detected");

  report.push({
    day,
    route,
    pathname,
    componentName,
    componentFile: component.file,
    legacyFile: combined.legacyFile,
    meaningfulLines: lineCount(source),
    usesStandardShell,
    questionStems,
    teilCoverage,
    hasSubmit,
    hasGuidance,
    missingStandardProps,
    warnings,
  });
}

const output = {
  generatedAt: new Date().toISOString(),
  totalDays: report.length,
  warningDays: report.filter((entry) => entry.warnings.length).map((entry) => entry.day),
  report,
};
const outputPath = path.join(webRoot, "a2-workbook-audit.json");
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
