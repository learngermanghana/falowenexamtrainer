import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generalHomePath = path.join(root, "web/src/components/GeneralHome.js");
const homeMetricsPath = path.join(root, "web/src/components/HomeMetrics.js");

let home = fs.readFileSync(generalHomePath, "utf8");
let metrics = fs.readFileSync(homeMetricsPath, "utf8");

const compactGuide = `const CompactCourseGuide = ({ studentProfile, levelKey }) => {
  const className = studentProfile?.className || "Not assigned yet";
  const courseName = levelKey ? \`${"${levelKey}"} ${"${selfLearningLevels.has(levelKey) ? \"Self-learning\" : \"Course\"}"}\` : "Course not selected";

  return (
    <section
      data-home-access-navigation="open"
      style={{ ...styles.card, display: "grid", gap: 14, border: "1px solid #bfdbfe", background: "#f8fafc" }}
    >
      <SectionHeader
        eyebrow="Course guide"
        title="Your access and navigation"
        subtitle="Your course, assigned class and the main navigation areas in Falowen."
      />

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#ffffff" }}>
          <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>Course</p>
          <strong>{courseName}</strong>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#ffffff" }}>
          <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>Assigned class</p>
          <strong>{className}</strong>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#ffffff" }}>
          <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>Access</p>
          <strong>{formatContractStatus(studentProfile)}</strong>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #dbe3ee", paddingTop: 12 }}>
        <NavigationGuide />
      </div>
    </section>
  );
};`;

if (!home.includes('data-home-access-navigation="open"')) {
  const guideStart = home.indexOf("const CompactCourseGuide =");
  const guideEnd = home.indexOf("const AnnouncementSection =", guideStart);
  if (guideStart < 0 || guideEnd < 0) {
    throw new Error("Could not find CompactCourseGuide in GeneralHome.js");
  }
  home = home.slice(0, guideStart) + compactGuide + "\n\n" + home.slice(guideEnd);
}

home = home.replace(/const day0WorkbookByLevel = \{[\s\S]*?\};\n\n/, "");
home = home.replace(/\n  const day0WorkbookLink = day0WorkbookByLevel\[levelKey\] \|\| "\/campus\/account";/, "");
home = home.replace(/\n  const openDay0 = useCallback\(\(\) => \{[\s\S]*?\n  \}, \[day0WorkbookLink, navigate, playOpenFeedback\]\);\n/, "\n");
home = home.replace(
  /      <CompactCourseGuide[\s\S]*?\n      \/>/,
  "      <CompactCourseGuide studentProfile={studentProfile} levelKey={levelKey} />"
);

if (home.includes("Expand course guide, access and navigation help")) {
  throw new Error("Collapsed Home course guide still present");
}
if (home.includes("Open Day 0 Orientation") || home.includes("Continue Course Book")) {
  throw new Error("Duplicate Home study actions still present in course guide");
}

metrics = metrics.replace('import { useCourseCompletionProgress } from "../hooks/useCourseCompletionProgress";\n', "");
metrics = metrics.replace('import CourseCompletionProgressCard from "./CourseCompletionProgressCard";\n', "");
metrics = metrics.replace(
  /\n  const \{\n    loading: courseProgressLoading,\n    data: courseProgress,\n    error: courseProgressError,\n    refresh: refreshCourseProgress,\n  \} = useCourseCompletionProgress\(\{ student: user, currentLevel: userLevel \}\);\n/,
  "\n"
);
metrics = metrics.replace(/\n  const isCanonicalCourseComplete = Boolean\(courseProgress\?\.isCourseComplete\);\n/, "\n");
metrics = metrics.replace(
  "const isCourseCompleter = isCanonicalCourseComplete;",
  "const isCourseCompleter = hasCompletedAllRequired && normalizedPassCount >= expectedAssessmentCount && normalizedFailCount === 0;"
);
metrics = metrics.replace(
  /\n      <CourseCompletionProgressCard\n        loading=\{courseProgressLoading\}\n        data=\{courseProgress\}\n        error=\{courseProgressError\}\n        onRefresh=\{refreshCourseProgress\}\n        layout="wide"\n        showNextAction\n      \/>\n/,
  "\n"
);

if (metrics.includes("CourseCompletionProgressCard") || metrics.includes("useCourseCompletionProgress")) {
  throw new Error("Canonical course progress is still rendered on Home");
}

fs.writeFileSync(generalHomePath, home, "utf8");
fs.writeFileSync(homeMetricsPath, metrics, "utf8");

console.log("Home now keeps access/navigation open and leaves canonical course progress in Course Book.");
