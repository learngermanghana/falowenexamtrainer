import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/GeneralHome.js");
let source = fs.readFileSync(targetPath, "utf8");

const replaceOnce = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`Could not patch ${label}: source anchor was not found.`);
  source = source.replace(before, after);
};

replaceOnce(
  'import HomeMetrics from "./HomeMetrics";',
  'import HomeMetrics from "./HomeMetrics";\nimport HomeClassAccess from "./HomeClassAccess";',
  "compact class access import",
);

replaceOnce(
  `      <HomeMetrics studentProfile={metricsStudentProfile} />\n\n      <ClassCalendarCard id={classCalendarId} initialClassName={preferredClass} program={studentProfile?.program} />`,
  `      <HomeMetrics studentProfile={metricsStudentProfile} />\n\n      <HomeClassAccess className={preferredClass} program={studentProfile?.program} />`,
  "long homepage class calendar",
);

const announcementBlock = `\n      <AnnouncementSection\n        announcements={announcements}\n        announcementStatus={announcementStatus}\n        announcementIndex={announcementIndex}\n        t={t}\n      />\n`;
source = source.replace(announcementBlock, "\n");

if (!source.includes("<HomeClassAccess className={preferredClass}")) {
  throw new Error("Compact Zoom access is missing from the normal Falowen homepage.");
}

const homeMetricsIndex = source.indexOf("<HomeMetrics studentProfile={metricsStudentProfile} />");
const remainingHome = homeMetricsIndex >= 0 ? source.slice(homeMetricsIndex) : source;
if (remainingHome.includes("<ClassCalendarCard id={classCalendarId}")) {
  throw new Error("The long class calendar is still mounted on the normal Falowen homepage.");
}
if (remainingHome.includes("<AnnouncementSection")) {
  throw new Error("The Updates/blog section is still mounted on the normal Falowen homepage.");
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("Falowen Home now keeps only compact Zoom access after Home metrics; the long class calendar and Updates/blog block are removed.");
