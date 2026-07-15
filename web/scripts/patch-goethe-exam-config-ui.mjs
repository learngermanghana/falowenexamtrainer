import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");

function patchFile(relativePath, transform) {
  const filePath = path.join(webRoot, relativePath);
  const before = fs.readFileSync(filePath, "utf8");
  const after = transform(before);
  fs.writeFileSync(filePath, after);
  return after;
}

const examFile = patchFile("src/components/MyExamFilePage.js", (source) => {
  let next = source;
  const oldImport = 'import { goetheExamLevels } from "../data/goetheExamSchedule";';
  const newImport = 'import { useGoetheExamConfig } from "../hooks/useGoetheExamConfig";';
  if (next.includes(oldImport)) next = next.replace(oldImport, newImport);

  const hookAnchor = '  const formatMoney = useCallback((value) => formatCurrency(value, { locale }), [locale]);';
  const hookBlock = `${hookAnchor}\n  const {\n    config: goetheExamConfig,\n    loading: examScheduleLoading,\n    source: examScheduleSource,\n  } = useGoetheExamConfig();\n  const goetheExamLevels = goetheExamConfig.levels;`;
  if (!next.includes("config: goetheExamConfig")) {
    if (!next.includes(hookAnchor)) throw new Error("Exam File shared-config hook anchor was not found.");
    next = next.replace(hookAnchor, hookBlock);
  }

  const visibleLevelsOld = `  const visibleExamLevels = useMemo(() => {\n    if (!detectedLevel || showAllLevels) {\n      return goetheExamLevels;\n    }\n\n    const matchedLevels = goetheExamLevels.filter((levelInfo) => levelInfo.level === detectedLevel);\n    return matchedLevels.length > 0 ? matchedLevels : goetheExamLevels;\n  }, [detectedLevel, showAllLevels]);`;
  const visibleLevelsNew = visibleLevelsOld.replace(
    "[detectedLevel, showAllLevels]",
    "[detectedLevel, goetheExamLevels, showAllLevels]",
  );
  if (next.includes(visibleLevelsOld)) next = next.replace(visibleLevelsOld, visibleLevelsNew);

  const statusAnchor = '          <div style={{ ...styles.helperText, margin: "-2px 0 0" }}>\n            Date format: month day, year (e.g., March 5, 2025). Exams are arranged by level and then by date.\n          </div>';
  const statusBlock = `${statusAnchor}\n          <div style={{ ...styles.helperText, margin: "-2px 0 0", color: examScheduleLoading ? "#92400e" : "#166534" }}>\n            {examScheduleLoading\n              ? "Updating Goethe schedule…"\n              : examScheduleSource === "admin"\n                ? "Schedule synced from Falowen Admin."\n                : examScheduleSource === "cache"\n                  ? "Showing the last saved Admin schedule while checking for updates."\n                  : "Showing the built-in schedule until Admin publishes an update."}\n          </div>`;
  if (!next.includes("Schedule synced from Falowen Admin")) {
    if (!next.includes(statusAnchor)) throw new Error("Exam File schedule-status anchor was not found.");
    next = next.replace(statusAnchor, statusBlock);
  }

  return next;
});

const studyCalendar = patchFile("src/components/StudyCalendarPage.js", (source) => {
  let next = source;
  const oldImport = 'import { goetheExamLevels } from "../data/goetheExamSchedule";';
  const newImport = 'import { useGoetheExamConfig } from "../hooks/useGoetheExamConfig";';
  if (next.includes(oldImport)) next = next.replace(oldImport, newImport);

  const hookAnchor = '  const { level: selectedLevel, setLevel: setSelectedLevel } = useExam();';
  const hookBlock = `${hookAnchor}\n  const { config: goetheExamConfig, loading: examScheduleLoading } = useGoetheExamConfig();\n  const goetheExamLevels = goetheExamConfig.levels;`;
  if (!next.includes("const goetheExamLevels = goetheExamConfig.levels")) {
    if (!next.includes(hookAnchor)) throw new Error("Study Calendar shared-config hook anchor was not found.");
    next = next.replace(hookAnchor, hookBlock);
  }

  const levelMemoOld = `  const levelInfo = useMemo(\n    () => goetheExamLevels.find((level) => level.level === selectedLevel) || goetheExamLevels[0],\n    [selectedLevel]\n  );`;
  const levelMemoNew = levelMemoOld.replace("[selectedLevel]", "[goetheExamLevels, selectedLevel]");
  if (next.includes(levelMemoOld)) next = next.replace(levelMemoOld, levelMemoNew);

  const heroAnchor = '        <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>{t("studyCalendar.hero.subtitle")}</p>';
  const heroBlock = `${heroAnchor}\n        {examScheduleLoading ? <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>Updating Goethe exam dates…</p> : null}`;
  if (!next.includes("Updating Goethe exam dates")) {
    if (!next.includes(heroAnchor)) throw new Error("Study Calendar loading-status anchor was not found.");
    next = next.replace(heroAnchor, heroBlock);
  }

  return next;
});

const checks = [
  [examFile.includes('useGoetheExamConfig'), "Exam File does not import the shared Goethe hook."],
  [examFile.includes("Schedule synced from Falowen Admin"), "Exam File does not show shared schedule status."],
  [examFile.includes("[detectedLevel, goetheExamLevels, showAllLevels]"), "Exam File does not refresh level cards when Admin config arrives."],
  [studyCalendar.includes('useGoetheExamConfig'), "Study Calendar does not import the shared Goethe hook."],
  [studyCalendar.includes("goetheExamConfig.levels"), "Study Calendar is not using shared levels."],
  [studyCalendar.includes("[goetheExamLevels, selectedLevel]"), "Study Calendar does not refresh when Admin config arrives."],
];
for (const [passed, message] of checks) {
  if (!passed) throw new Error(message);
}

console.log("Falowen Goethe Exam File and Study Calendar are wired reactively to the shared Admin configuration.");
