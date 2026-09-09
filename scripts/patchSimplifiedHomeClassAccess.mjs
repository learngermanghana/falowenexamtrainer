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

const announcementImport = 'import { fetchAnnouncements } from "../services/announcementService";\n';
source = source.replace(announcementImport, "");

const announcementComponentStart = source.indexOf("const AnnouncementSection = (");
if (announcementComponentStart >= 0) {
  const generalHomeStart = source.indexOf("const GeneralHome = ({", announcementComponentStart);
  if (generalHomeStart < 0) {
    throw new Error("Could not remove AnnouncementSection: GeneralHome anchor was not found.");
  }
  source = `${source.slice(0, announcementComponentStart)}${source.slice(generalHomeStart)}`;
}

source = source
  .replace('  const [announcements, setAnnouncements] = useState([]);\n', "")
  .replace('  const [announcementStatus, setAnnouncementStatus] = useState("idle");\n', "")
  .replace('  const [announcementIndex, setAnnouncementIndex] = useState(0);\n', "");

const announcementEffectsStart = source.indexOf(
  "  useEffect(() => {\n    let mounted = true;\n    const loadAnnouncements = async () => {",
);
if (announcementEffectsStart >= 0) {
  const onboardingStart = source.indexOf("\n\n  if (!onboardingCompleted) {", announcementEffectsStart);
  if (onboardingStart < 0) {
    throw new Error("Could not remove announcement effects: onboarding anchor was not found.");
  }
  source = `${source.slice(0, announcementEffectsStart)}${source.slice(onboardingStart)}`;
}

const announcementBlock = `\n      <AnnouncementSection\n        announcements={announcements}\n        announcementStatus={announcementStatus}\n        announcementIndex={announcementIndex}\n        t={t}\n      />\n`;
source = source.replace(announcementBlock, "\n");

if (!source.includes("useState(")) {
  source = source.replace(
    'import React, { useCallback, useEffect, useMemo, useState } from "react";',
    'import React, { useCallback, useEffect, useMemo } from "react";',
  );
}
if (!source.includes("useEffect(")) {
  source = source.replace(
    'import React, { useCallback, useEffect, useMemo } from "react";',
    'import React, { useCallback, useMemo } from "react";',
  );
}

if (!source.includes("<HomeClassAccess className={preferredClass}")) {
  throw new Error("Compact Zoom access is missing from the normal Falowen homepage.");
}

const homeMetricsIndex = source.indexOf("<HomeMetrics studentProfile={metricsStudentProfile} />");
const remainingHome = homeMetricsIndex >= 0 ? source.slice(homeMetricsIndex) : source;
if (remainingHome.includes("<ClassCalendarCard id={classCalendarId}")) {
  throw new Error("The long class calendar is still mounted on the normal Falowen homepage.");
}
if (source.includes("fetchAnnouncements(") || source.includes("announcementService")) {
  throw new Error("Falowen Home still loads announcements after the Updates/blog UI was removed.");
}
if (
  source.includes("<AnnouncementSection") ||
  source.includes("const AnnouncementSection =") ||
  source.includes("announcementStatus") ||
  source.includes("announcementIndex")
) {
  throw new Error("The Updates/blog implementation is still present on the normal Falowen homepage.");
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("Falowen Home keeps compact Zoom access only; the long class calendar and unused announcement loading are removed.");
