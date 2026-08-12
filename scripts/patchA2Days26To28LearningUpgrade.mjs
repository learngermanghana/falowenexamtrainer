import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentImport = 'import A2Days26To28LearningUpgrade from "./A2Days26To28LearningUpgrade";';

function patchFile(relativePath, transform) {
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const updated = transform(source);
  fs.writeFileSync(filePath, updated, "utf8");
}

patchFile("web/src/components/A2B1WorkbookGuidance.js", (source) => {
  let updated = source;
  if (!updated.includes(componentImport)) {
    const anchor = 'import A2MiniLearningBlock from "./A2MiniLearningBlock";';
    if (!updated.includes(anchor)) throw new Error("A2 shared guidance import anchor was not found.");
    updated = updated.replace(anchor, `${anchor}\n${componentImport}`);
  }

  const fallbackComponent = `const A2Days26To28FallbackLearning = ({ level = "" }) => {
  const workbookLevel = useMemo(() => resolveWorkbookLevel(level), [level]);
  const workbookDay = useMemo(() => {
    if (typeof window === "undefined") return null;
    return resolveA2B1WorkbookDayFromLocation(
      workbookLevel,
      \`${"${window.location.pathname || \"\"}"}${"${window.location.search || \"\"}"}\`,
    );
  }, [workbookLevel]);

  if (workbookLevel !== "A2" || workbookDay !== 26) return null;
  return <A2Days26To28LearningUpgrade day={26} />;
};`;

  if (!updated.includes("const A2Days26To28FallbackLearning =")) {
    const anchor = "const detectTabKey = (text = \"\") => {";
    if (!updated.includes(anchor)) throw new Error("A2 shared guidance helper anchor was not found.");
    updated = updated.replace(anchor, `${fallbackComponent}\n\n${anchor}`);
  }

  const mount = "      <A2Days26To28FallbackLearning level={workbookLevel} />";
  if (!updated.includes(mount)) {
    const anchor = "      <A2Days11To15QuickLearning level={workbookLevel} />";
    if (!updated.includes(anchor)) throw new Error("A2 shared guidance learning mount anchor was not found.");
    updated = updated.replace(anchor, `${anchor}\n${mount}`);
  }

  return updated;
});

patchFile("web/src/components/A2Day27DigitaleKommunikationWorkbookPage.js", (source) => {
  let updated = source;
  if (!updated.includes(componentImport)) {
    const anchor = 'import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";';
    if (!updated.includes(anchor)) throw new Error("A2 Day 27 guidance import anchor was not found.");
    updated = updated.replace(anchor, `${anchor}\n${componentImport}`);
  }
  const mount = '      <A2Days26To28LearningUpgrade day={27} />';
  if (!updated.includes(mount)) {
    const anchor = '      <A2B1WorkbookGuidance level="A2" />';
    if (!updated.includes(anchor)) throw new Error("A2 Day 27 guidance mount was not found.");
    updated = updated.replace(anchor, `${anchor}\n${mount}`);
  }
  return updated;
});

patchFile("web/src/components/A2Day28UeberDieZukunftSprechenWorkbookPage.js", (source) => {
  let updated = source;
  if (!updated.includes(componentImport)) {
    const anchor = 'import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";';
    if (!updated.includes(anchor)) throw new Error("A2 Day 28 guidance import anchor was not found.");
    updated = updated.replace(anchor, `${anchor}\n${componentImport}`);
  }
  const mount = '      <A2Days26To28LearningUpgrade day={28} />';
  if (!updated.includes(mount)) {
    const anchor = '      <A2B1WorkbookGuidance />';
    if (!updated.includes(anchor)) throw new Error("A2 Day 28 guidance mount was not found.");
    updated = updated.replace(anchor, `${anchor}\n${mount}`);
  }
  return updated;
});

const guidance = fs.readFileSync(path.join(root, "web/src/components/A2B1WorkbookGuidance.js"), "utf8");
const day27 = fs.readFileSync(path.join(root, "web/src/components/A2Day27DigitaleKommunikationWorkbookPage.js"), "utf8");
const day28 = fs.readFileSync(path.join(root, "web/src/components/A2Day28UeberDieZukunftSprechenWorkbookPage.js"), "utf8");
if (!guidance.includes("<A2Days26To28LearningUpgrade day={26} />")) throw new Error("A2 Day 26 learning block is not wired into the shared fallback.");
if (!guidance.includes("workbookDay !== 26")) throw new Error("A2 Day 26 shared fallback guard is missing.");
if (!day27.includes("<A2Days26To28LearningUpgrade day={27} />")) throw new Error("A2 Day 27 learning block is missing.");
if (!day28.includes("<A2Days26To28LearningUpgrade day={28} />")) throw new Error("A2 Day 28 learning block is missing.");
console.log("Wired A2 Days 26-28 concise learning blocks into active production workbook paths.");
