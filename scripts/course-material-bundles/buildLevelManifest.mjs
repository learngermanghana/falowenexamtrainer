import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const allowedLevels = new Set(["A1", "A2", "B1", "B2", "C1"]);
const requestedLevel = String(process.argv[2] || "").trim().toUpperCase();

if (!allowedLevels.has(requestedLevel)) {
  throw new Error(`Choose one level: ${[...allowedLevels].join(", ")}`);
}

const curriculumPath = path.join(repoRoot, "shared", "curriculumCanonical.json");
const outputDir = path.join(repoRoot, "artifacts", "course-material-bundles", requestedLevel);
const outputPath = path.join(outputDir, `Falowen-${requestedLevel}-Course-Materials-manifest.json`);

const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));

const normalizeLevel = (value) => String(value || "").trim().toUpperCase();
const normalizeDay = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
};

const lessonCandidates = [];
const seenObjects = new WeakSet();

const visit = (value, inheritedLevel = "") => {
  if (!value || typeof value !== "object") return;
  if (seenObjects.has(value)) return;
  seenObjects.add(value);

  if (Array.isArray(value)) {
    value.forEach((item) => visit(item, inheritedLevel));
    return;
  }

  const objectLevel = normalizeLevel(
    value.level || value.courseLevel || value.languageLevel || inheritedLevel,
  );
  const day = normalizeDay(value.day ?? value.dayNumber ?? value.lessonDay);
  const title = String(
    value.title || value.topic || value.lessonTitle || value.name || "",
  ).trim();

  if (objectLevel === requestedLevel && day !== null && title) {
    lessonCandidates.push({
      day,
      chapter: String(value.chapter || value.chapterNumber || "").trim(),
      title,
      sourceUrl: String(
        value.url || value.route || value.path || value.workbookUrl || value.lessonUrl || "",
      ).trim(),
    });
  }

  Object.values(value).forEach((child) => visit(child, objectLevel || inheritedLevel));
};

visit(curriculum);

const byDay = new Map();
for (const lesson of lessonCandidates) {
  const existing = byDay.get(lesson.day);
  if (!existing || (!existing.sourceUrl && lesson.sourceUrl)) {
    byDay.set(lesson.day, lesson);
  }
}

const lessons = [...byDay.values()]
  .sort((a, b) => a.day - b.day)
  .map((lesson) => {
    const route = lesson.sourceUrl.startsWith("/")
      ? lesson.sourceUrl
      : `/campus/course/lesson/${requestedLevel}/${lesson.day}`;
    const printKind = ["B2", "C1"].includes(requestedLevel)
      ? "combined"
      : "review-required";

    return {
      ...lesson,
      route,
      printKind,
      status: printKind === "review-required"
        ? "needs-route-classification"
        : "ready-for-render-audit",
    };
  });

if (!lessons.length) {
  throw new Error(`No ${requestedLevel} lessons were found in shared/curriculumCanonical.json`);
}

const expectedDays = lessons.map((lesson) => lesson.day);
const firstDay = Math.min(...expectedDays);
const lastDay = Math.max(...expectedDays);
const missingDays = [];
for (let day = firstDay; day <= lastDay; day += 1) {
  if (!byDay.has(day)) missingDays.push(day);
}

const unresolvedLessons = lessons
  .filter((lesson) => lesson.printKind === "review-required")
  .map(({ day, chapter, title, route }) => ({ day, chapter, title, route }));
const curriculumComplete = missingDays.length === 0;
const routesClassified = unresolvedLessons.length === 0;

const manifest = {
  schemaVersion: 2,
  level: requestedLevel,
  curriculumSource: "shared/curriculumCanonical.json",
  generatedAt: new Date().toISOString(),
  generator: "scripts/course-material-bundles/buildLevelManifest.mjs",
  lessonCount: lessons.length,
  firstDay,
  lastDay,
  missingDays,
  unresolvedLessonCount: unresolvedLessons.length,
  unresolvedLessons,
  curriculumComplete,
  routesClassified,
  readyForPdfGeneration: curriculumComplete && routesClassified,
  lessons,
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Created ${outputPath}`);
console.log(`${requestedLevel}: ${lessons.length} lessons, ${missingDays.length} missing day(s)`);
console.log(`Unresolved printable routes: ${unresolvedLessons.length}`);
console.log(`Ready for PDF generation: ${manifest.readyForPdfGeneration}`);
