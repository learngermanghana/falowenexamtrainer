import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const courseTabPath = path.join(root, "web/src/components/CourseTab.js");
const generalHomePath = path.join(root, "web/src/components/GeneralHome.js");
const classCalendarPath = path.join(root, "web/src/components/ClassCalendarCardV2.js");

let courseTab = fs.readFileSync(courseTabPath, "utf8");
let generalHome = fs.readFileSync(generalHomePath, "utf8");
let classCalendar = fs.readFileSync(classCalendarPath, "utf8");

// Course Book: the compact hero already shows the next lesson, so keep one action
// and remove the duplicate next-assignment card that appears again underneath it.
if (!courseTab.includes("Continue next assignment")) {
  const continueMarker = `                  Continue learning\n                </button>`;
  if (!courseTab.includes(continueMarker)) {
    throw new Error("Student cleanup patch anchor missing: compact Course Book continue action");
  }
  courseTab = courseTab.replace(
    continueMarker,
    `                  Continue next assignment\n                </button>`,
  );
}

const duplicateNextCardMarker = 'data-a1-coursebook-next-card="true"';
if (courseTab.includes(duplicateNextCardMarker)) {
  const markerIndex = courseTab.indexOf(duplicateNextCardMarker);
  const start = courseTab.lastIndexOf("          {nextLesson ? (", markerIndex);
  const end = courseTab.indexOf('          <section className="course-book-toolbar"', markerIndex);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Student cleanup patch anchor missing: duplicate Course Book next-assignment card");
  }
  courseTab = `${courseTab.slice(0, start)}${courseTab.slice(end)}`;
}

// Class card: keep the two student actions small and direct. The timetable itself
// already contains the schedule, so a large download action is unnecessary here.
// Zoom access must obey the same join window as the session-level actions.
const oldClassActions = `          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={styles.primaryButton} onClick={() => downloadCanonicalCalendar(canonicalSummary)}>Download class calendar</button>
            <a href="/campus/course" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Course Book</a>
          </div>`;
const compactClassActions = `          <div data-class-compact-actions="true" style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
            {!classEnded && nextSession && canJoinLiveClass(nextSession, now) && zoom?.url ? (
              <a
                href={zoom.url}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.primaryButton, minHeight: 34, width: "fit-content", padding: "6px 10px", borderRadius: 9, fontSize: 12, lineHeight: 1.15, textDecoration: "none" }}
              >
                Join Zoom
              </a>
            ) : null}
            <a
              href="/campus/course"
              style={{ ...styles.secondaryButton, minHeight: 34, width: "fit-content", padding: "6px 10px", borderRadius: 9, fontSize: 12, lineHeight: 1.15, textDecoration: "none" }}
            >
              Open Course
            </a>
          </div>`;

if (!classCalendar.includes('data-class-compact-actions="true"')) {
  if (!classCalendar.includes(oldClassActions)) {
    throw new Error("Student cleanup patch anchor missing: class calendar actions");
  }
  classCalendar = classCalendar.replace(oldClassActions, compactClassActions);
}

// Dashboard: the live-class block is the final dashboard content. Keep only a
// lightweight Falowen Blog link beneath it; announcements/subscription cards no
// longer compete with the student's class information. Remove the hidden
// announcement machinery too so no feed requests or rotation rerenders remain.
generalHome = generalHome
  .replace(
    'import React, { useCallback, useEffect, useMemo, useState } from "react";\n',
    'import React, { useCallback, useMemo } from "react";\n',
  )
  .replace('import { fetchAnnouncements } from "../services/announcementService";\n', "")
  .replace('import YouTubeSubscribeButton from "./YouTubeSubscribeButton";\n', "")
  .replace(
    '  const [announcements, setAnnouncements] = useState([]);\n  const [announcementStatus, setAnnouncementStatus] = useState("idle");\n  const [announcementIndex, setAnnouncementIndex] = useState(0);\n',
    "",
  );

const announcementComponentStart = generalHome.indexOf("const AnnouncementSection =");
const generalHomeComponentStart = generalHome.indexOf("const GeneralHome =");
if (announcementComponentStart !== -1) {
  if (generalHomeComponentStart === -1 || generalHomeComponentStart <= announcementComponentStart) {
    throw new Error("Student cleanup patch anchor missing: GeneralHome component after announcements");
  }
  generalHome = `${generalHome.slice(0, announcementComponentStart)}${generalHome.slice(generalHomeComponentStart)}`;
}

const announcementLoadEffectStart = generalHome.indexOf(`  useEffect(() => {\n    let mounted = true;\n    const loadAnnouncements = async () => {`);
if (announcementLoadEffectStart !== -1) {
  const announcementLoadEffectEndMarker = `  }, [locale, studentProfile?.className, studentProfile?.program]);\n`;
  const announcementLoadEffectEnd = generalHome.indexOf(announcementLoadEffectEndMarker, announcementLoadEffectStart);
  if (announcementLoadEffectEnd === -1) {
    throw new Error("Student cleanup patch anchor missing: announcement loading effect end");
  }
  generalHome = `${generalHome.slice(0, announcementLoadEffectStart)}${generalHome.slice(announcementLoadEffectEnd + announcementLoadEffectEndMarker.length)}`;
}

const announcementRotationEffectStart = generalHome.indexOf(`  useEffect(() => {\n    if (announcements.length <= 1) {`);
if (announcementRotationEffectStart !== -1) {
  const announcementRotationEffectEndMarker = `  }, [announcements]);\n`;
  const announcementRotationEffectEnd = generalHome.indexOf(announcementRotationEffectEndMarker, announcementRotationEffectStart);
  if (announcementRotationEffectEnd === -1) {
    throw new Error("Student cleanup patch anchor missing: announcement rotation effect end");
  }
  generalHome = `${generalHome.slice(0, announcementRotationEffectStart)}${generalHome.slice(announcementRotationEffectEnd + announcementRotationEffectEndMarker.length)}`;
}

if (!generalHome.includes('data-dashboard-footer-blog="true"')) {
  const classCardAnchor = `      <ClassCalendarCard id={classCalendarId} initialClassName={preferredClass} initialClassId={preferredClassId} program={studentProfile?.program} />`;
  const classCardStart = generalHome.lastIndexOf(classCardAnchor);
  if (classCardStart === -1) {
    throw new Error("Student cleanup patch anchor missing: dashboard class card");
  }
  const afterClassCard = classCardStart + classCardAnchor.length;
  const dashboardClose = generalHome.indexOf(`    </div>\n  );\n};`, afterClassCard);
  if (dashboardClose === -1) {
    throw new Error("Student cleanup patch anchor missing: dashboard closing block");
  }

  const blogFooter = `

      <div data-dashboard-footer-blog="true" style={{ display: "flex", justifyContent: "center", padding: "2px 0 4px" }}>
        <a
          href="https://blog.falowen.app/blogs/"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#2563eb", fontSize: 13, fontWeight: 800, textDecoration: "none" }}
        >
          Falowen Blog
        </a>
      </div>
`;
  generalHome = `${generalHome.slice(0, afterClassCard)}${blogFooter}${generalHome.slice(dashboardClose)}`;
}

fs.writeFileSync(courseTabPath, courseTab, "utf8");
fs.writeFileSync(generalHomePath, generalHome, "utf8");
fs.writeFileSync(classCalendarPath, classCalendar, "utf8");
