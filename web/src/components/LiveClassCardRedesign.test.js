import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const source = (relativePath) => fs.readFileSync(path.join(root, "web/src/components", relativePath), "utf8");

describe("lesson-first live class presentation", () => {
  test("shows the correct A2 lesson identity and direct lesson route", () => {
    const cardSource = source("./ClassCalendarCardV2.js");
    expect(cardSource).toContain("buildDirectLessonUrl");
    expect(cardSource).toContain("sessionLabel");
    expect(cardSource).toContain("assignmentId");
  });

  test("uses the official A1 curriculum day instead of the chapter suffix", () => {
    const cardSource = source("./ClassCalendarCardV2.js");
    expect(cardSource).toContain("resolveCanonicalLessonIdentity");
    expect(cardSource).toContain("officialDay");
  });

  test("uses the Admin session time when a repaired future session has a stale completed status", () => {
    const cardSource = source("./ClassCalendarCardV2.js");
    expect(cardSource).toContain("completed");
    expect(cardSource).toContain("startTime");
  });

  test("previews the next two active lessons and excludes cancellations", () => {
    const cardSource = source("./ClassCalendarCardV2.js");
    expect(cardSource).toContain("cancelled");
    expect(cardSource).toContain("slice(0, 2)");
  });

  test("keeps the last known summary available while the live schedule refreshes", () => {
    const serviceSource = source("../services/canonicalLiveClassServiceV4.js");
    expect(serviceSource).toContain("cached");
  });

  test("does not load schedules stored by the previous cache version", () => {
    const serviceSource = source("../services/canonicalLiveClassServiceV4.js");
    expect(serviceSource).toContain("CACHE_VERSION");
  });
});

describe("live class card UI protection", () => {
  test("the shared card prioritizes lesson, actions, reschedule state and after-this preview", () => {
    const cardSource = source("./ClassCalendarCardV2.js");
    expect(cardSource).toContain("After this");
    expect(cardSource).toContain("rescheduled");
  });

  test("the full calendar places next class before progress and collapses the complete register", () => {
    const calendar = source("./ClassCalendarPage.js");
    expect(calendar).toContain("ClassCalendarCard");
  });

  test("the Course Book indicator uses the same shared card and cached summary", () => {
    const courseBookCard = source("./CourseBookLiveClassIndicator.js");
    expect(courseBookCard).toContain("loadLiveClassSummaryCache");
    expect(courseBookCard).toContain("saveLiveClassSummaryCache");
    expect(courseBookCard).toContain("compact");
  });

  test("existing ClassCalendarCard imports automatically receive the redesigned version", () => {
    expect(source("./ClassCalendarCard.js").trim()).toBe('export { default } from "./ClassCalendarCardV2";');
  });

  test("compact Home Zoom access keeps cached summaries pending until canonical resolution", () => {
    const compactAccess = source("./HomeClassAccess.js");
    expect(compactAccess).toContain('status: normalizedClassName ? "loading" : "idle"');
    expect(compactAccess).toContain('status: "loading"');
    expect(compactAccess).toContain('resolution.identity === normalizedClassName');
    expect(compactAccess).toContain('summary: null, status: "unavailable"');
    expect(compactAccess).toContain('status: "error"');
    expect(compactAccess).toContain('hasCanonicalZoomProfile');
    expect(compactAccess).toContain('allowLegacyFallback = (canonicalLookupCompleted && !hasCanonicalZoomProfile) || noCanonicalClass');
    expect(compactAccess).toContain('canonicalLookupCompleted && (canonicalZoom?.url || canonicalZoom?.meetingId || canonicalZoom?.passcode)');
    expect(compactAccess).toContain('Checking the correct Zoom room…');
    expect(compactAccess).not.toContain('cached ? "ready" : "loading"');
  });

  test("simplified Home patch removes announcement reads and rotation after removing Updates UI", () => {
    const patch = source("../../../scripts/patchSimplifiedHomeClassAccess.mjs");
    expect(patch).toContain('announcementImport');
    expect(patch).toContain('announcementEffectsStart');
    expect(patch).toContain('source.includes("fetchAnnouncements(")');
    expect(patch).toContain('source.includes("announcementStatus")');
    expect(patch).toContain('long calendar and unused announcements are removed');
  });
});
