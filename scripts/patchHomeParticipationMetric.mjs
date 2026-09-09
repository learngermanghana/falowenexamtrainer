import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/HomeMetrics.js");
let source = fs.readFileSync(targetPath, "utf8");

const replaceOnce = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`Could not patch ${label}: source anchor was not found.`);
  source = source.replace(before, after);
};

replaceOnce(
  'import { formatCourseAttendanceProgress } from "../utils/courseAttendanceProgress";',
  'import { formatCourseAttendanceProgress } from "../utils/courseAttendanceProgress";\nimport { fetchMyClassParticipation, summarizeClassParticipation } from "../services/classParticipationService";',
  "Home metrics participation service import",
);

replaceOnce(
  '  const [assignmentStats, setAssignmentStats] = useState(null);',
  '  const [assignmentStats, setAssignmentStats] = useState(null);\n  const [participationRecords, setParticipationRecords] = useState([]);',
  "Home metrics participation state",
);

replaceOnce(
  '  const attendanceProgress = useMemo(\n    () => formatCourseAttendanceProgress({ attended: attendance.sessions, level: levelKey }),\n    [attendance.sessions, levelKey]\n  );',
  '  const attendanceProgress = useMemo(\n    () => formatCourseAttendanceProgress({ attended: attendance.sessions, level: levelKey }),\n    [attendance.sessions, levelKey]\n  );\n  const participationSummary = useMemo(\n    () => summarizeClassParticipation(participationRecords),\n    [participationRecords]\n  );',
  "Home metrics participation summary",
);

replaceOnce(
  '        setAssignmentStats(null);\n        setRefreshError("");',
  '        setAssignmentStats(null);\n        setParticipationRecords([]);\n        setRefreshError("");',
  "Home metrics empty participation state",
);

replaceOnce(
  '      const [attendanceResult, scoreResult] = await Promise.allSettled([\n        fetchAttendanceSummary({ className, studentCode, studentUid: user?.uid, level: levelKey }),\n        studentCode ? fetchScoreSummary({ idToken, studentCode }) : Promise.resolve(null),\n      ]);',
  '      const [attendanceResult, scoreResult, participationResult] = await Promise.allSettled([\n        fetchAttendanceSummary({ className, studentCode, studentUid: user?.uid, level: levelKey }),\n        studentCode ? fetchScoreSummary({ idToken, studentCode }) : Promise.resolve(null),\n        user?.uid ? fetchMyClassParticipation({ user }) : Promise.resolve([]),\n      ]);',
  "Home metrics participation refresh",
);

replaceOnce(
  '        setLeaderboard(scoreResponse?.leaderboard || null);\n        setLeaderboardGeneratedAt(scoreResponse?.generatedAt || "");',
  '        setLeaderboard(null);\n        setLeaderboardGeneratedAt("");',
  "remove Home leaderboard presentation",
);

replaceOnce(
  '      setRefreshError(attendanceResult.status === "rejected" ? t("homeMetrics.refreshError") : "");',
  '      if (participationResult.status === "fulfilled") {\n        setParticipationRecords(Array.isArray(participationResult.value) ? participationResult.value : []);\n      } else {\n        setParticipationRecords([]);\n      }\n\n      setRefreshError(attendanceResult.status === "rejected" ? t("homeMetrics.refreshError") : "");',
  "Home metrics participation result",
);

replaceOnce(
  '        <StatCard\n          label={t("homeMetrics.nextRecommendation.label")}',
  '        <StatCard\n          label="Class participation"\n          value={\n            participationSummary.classesRecorded > 0\n              ? `${participationSummary.participated}/${participationSummary.classesRecorded} classes`\n              : "No class responses yet"\n          }\n          helper={\n            participationSummary.classesRecorded > 0\n              ? `${participationSummary.responses} responses · ${participationSummary.correct} correct · ${participationSummary.needsReview} to review`\n              : "Teacher-recorded class responses will appear here."\n          }\n          tone="success"\n        />\n        <StatCard\n          label={t("homeMetrics.nextRecommendation.label")}',
  "Home metrics participation card",
);

const requiredMarkers = [
  'fetchMyClassParticipation, summarizeClassParticipation',
  'label="Class participation"',
  'participationSummary.responses',
  'setLeaderboard(null);',
];
requiredMarkers.forEach((marker) => {
  if (!source.includes(marker)) throw new Error(`Home participation metric marker missing: ${marker}`);
});
if (source.includes('setLeaderboard(scoreResponse?.leaderboard || null)')) {
  throw new Error("Home still enables the leaderboard panel.");
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("Home metrics now include Class Participation and no longer expose the leaderboard panel.");
