import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/CourseTab.js");
let source = fs.readFileSync(targetPath, "utf8");

const replaceOnce = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`Could not patch ${label}: source anchor was not found.`);
  source = source.replace(before, after);
};

replaceOnce(
  'import { buildCourseCompletionProgress, findCourseBookEntryForRequirement, readSelfLearningProgressByDay } from "../data/courseCompletionJourney";',
  'import { buildCourseCompletionProgress, findCourseBookEntryForRequirement, readSelfLearningProgressByDay } from "../data/courseCompletionJourney";\nimport { persistCourseCompletionSnapshot } from "../services/courseCompletionSnapshotService";',
  "CourseTab snapshot service import",
);

const progressAnchor = `  const nextLesson = findCourseBookEntryForRequirement(courseLessons, courseCompletion.next);`;
const progressWithSync = `${progressAnchor}\n\n  useEffect(() => {\n    if (loadingLessonProgress || !user?.uid || !courseCompletion?.total) return undefined;\n    const timer = setTimeout(() => {\n      persistCourseCompletionSnapshot({\n        progress: courseCompletion,\n        level: normalizedSelectedCourseLevel,\n        user,\n        studentProfile,\n      }).catch((error) => {\n        console.warn("Could not sync Course Book completion snapshot", error);\n      });\n    }, 500);\n    return () => clearTimeout(timer);\n  }, [courseCompletion, loadingLessonProgress, normalizedSelectedCourseLevel, studentProfile, user]);`;
replaceOnce(progressAnchor, progressWithSync, "CourseTab snapshot effect");

const requiredMarkers = [
  'from "../services/courseCompletionSnapshotService"',
  "persistCourseCompletionSnapshot({",
  'console.warn("Could not sync Course Book completion snapshot"',
];
requiredMarkers.forEach((marker) => {
  if (!source.includes(marker)) throw new Error(`Course completion snapshot marker missing: ${marker}`);
});

fs.writeFileSync(targetPath, source, "utf8");
console.log("Canonical Course Book completion now persists a shared Firestore snapshot.");
await import("./patchClassParticipationCard.mjs");
