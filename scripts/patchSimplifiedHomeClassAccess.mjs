import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/GeneralHome.js");
let source = fs.readFileSync(targetPath, "utf8");

const hasNextClassHome = source.includes('import HomeNextClassCard from "./HomeNextClassCard";') ||
  source.includes("<HomeNextClassCard className={preferredClass}");
const hasCompactClassAccess = source.includes('import HomeClassAccess from "./HomeClassAccess";') ||
  source.includes("<HomeClassAccess className={preferredClass}");

if (!hasNextClassHome && !hasCompactClassAccess) {
  const metricsImport = 'import HomeMetrics from "./HomeMetrics";';
  if (!source.includes(metricsImport)) {
    throw new Error("Could not patch compact class access import: HomeMetrics import was not found.");
  }
  source = source.replace(
    metricsImport,
    `${metricsImport}\nimport HomeClassAccess from "./HomeClassAccess";`,
  );
}

const longCalendarBlock = `      <HomeMetrics studentProfile={metricsStudentProfile} />\n\n      <ClassCalendarCard id={classCalendarId} initialClassName={preferredClass} program={studentProfile?.program} />`;
const compactClassBlock = `      <HomeMetrics studentProfile={metricsStudentProfile} />\n\n      <HomeClassAccess className={preferredClass} program={studentProfile?.program} />`;
if (source.includes(longCalendarBlock)) {
  source = source.replace(longCalendarBlock, compactClassBlock);
} else if (
  !source.includes("<HomeClassAccess className={preferredClass}") &&
  !source.includes("<HomeNextClassCard className={preferredClass}")
) {
  throw new Error("Could not patch long homepage class calendar: no compact or Next Class replacement is present.");
}

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

if (
  !source.includes("<HomeClassAccess className={preferredClass}") &&
  !source.includes("<HomeNextClassCard className={preferredClass}")
) {
  throw new Error("Compact class access or Next Class is missing from the normal Falowen homepage.");
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
console.log("Falowen Home keeps compact class access/Next Class; long calendar and unused announcements are removed.");
