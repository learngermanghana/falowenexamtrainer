import fs from "fs";
import path from "path";

const readSource = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, "..", relativePath), "utf8");

describe("homepage and Exams Room student-facing cleanup", () => {
  const homeSource = readSource("components/GeneralHome.js");
  const classCardSource = readSource("components/ClassCalendarCardV2.js");
  const nextClassSource = readSource("components/NextLiveClassCard.js");
  const mockLibrarySource = readSource("components/MockExamLibraryPage.js");
  const examFileSource = readSource("components/MyExamFilePage.js");
  const writingSource = readSource("components/WritingPage.js");
  const footerSource = readSource("components/LegalFooter.js");

  test("normal homepage ends with compact class access and the footer", () => {
    expect(homeSource).toContain("homepageCompact");
    expect((homeSource.match(/homepageCompact/g) || []).length).toBe(1);
    expect(homeSource).not.toContain("AnnouncementSection");
    expect(homeSource).not.toContain("fetchAnnouncements");
    expect(homeSource).not.toContain("YouTubeSubscribeButton");

    const classCardIndex = homeSource.lastIndexOf("<ClassCalendarCard");
    const footerIndex = homeSource.lastIndexOf("<LegalFooter");
    expect(classCardIndex).toBeGreaterThan(0);
    expect(footerIndex).toBeGreaterThan(classCardIndex);
  });

  test("compact homepage class area contains only next class and Zoom, not the long class feed", () => {
    const canonicalStart = classCardSource.indexOf("{canonicalSummary ? (");
    const compactStart = classCardSource.indexOf("homepageCompact ? (", canonicalStart);
    const zoomIndex = classCardSource.indexOf("<HomeZoomAccessCard", compactStart);
    const fullStart = classCardSource.indexOf("        ) : (\n        <>", zoomIndex);
    const compactBranch = classCardSource.slice(compactStart, fullStart);

    expect(compactStart).toBeGreaterThan(canonicalStart);
    expect(zoomIndex).toBeGreaterThan(compactStart);
    expect(fullStart).toBeGreaterThan(zoomIndex);
    expect(compactBranch).toContain("<NextLiveClassCard");
    expect(compactBranch).toContain("simple");
    expect(compactBranch).toContain("<HomeZoomAccessCard");
    expect(compactBranch).not.toContain("Latest completed class");
    expect(compactBranch).not.toContain("<SessionsPreview");
    expect(compactBranch).not.toContain("Download class calendar");
    expect(compactBranch).not.toContain("Course progress");
  });

  test("simple next-class card hides timetable, duplicate Zoom action and after-this list", () => {
    expect(nextClassSource).toContain("simple = false");
    expect(nextClassSource).toContain("{!simple ? (");
    expect(nextClassSource).toContain("{!simple && afterThis.length ? (");
  });

  test("homepage footer has a clean Falowen brand and legal links", () => {
    expect(footerSource).toContain('aria-label="Falowen footer"');
    expect(footerSource).toContain("Learning by Learn Language Education Academy");
    expect(footerSource).toContain("Enrollment Agreement");
    expect(footerSource).toContain("Privacy");
    expect(footerSource).toContain("Terms");
  });

  test("Mock Exams does not expose implementation details", () => {
    [
      "question-set ID",
      "exam engine",
      "question set:",
      "reusable question set",
      "Open preview",
    ].forEach((phrase) => expect(mockLibrarySource).not.toContain(phrase));

    expect(mockLibrarySource).toContain("Choose a full timed mock when available");
    expect(mockLibrarySource).toContain("does not yet generate one final combined score");
    expect(mockLibrarySource).toContain("Open practice");
  });

  test("Exam File and writing feedback avoid source/backend wording", () => {
    expect(examFileSource).not.toContain("Schedule synced from Falowen Admin");
    expect(examFileSource).not.toContain("last saved schedule");
    expect(examFileSource).not.toContain("built-in schedule");
    expect(writingSource).not.toContain("Backend rubric");
  });

  test("legacy mock practice pages use student labels instead of preview/developer badges", () => {
    const mockFiles = [
      "components/A1GoetheReadingMockTeil1Preview.jsx",
      "components/A1GoetheReadingMockTeil2Preview.jsx",
      "components/A1GoetheReadingMockTeil3Preview.jsx",
      "components/A1GoetheListeningMockPreview.jsx",
      "components/A1GoetheWritingMockPreview.jsx",
      "components/A1GoetheSpeakingMockPreview.jsx",
      "components/A2GoetheReadingMockPreview.jsx",
      "components/A2GoetheListeningMockTeil1Preview.jsx",
      "components/A2GoetheListeningMockTeil2Preview.jsx",
      "components/A2GoetheListeningMockTeil3Preview.jsx",
      "components/A2GoetheListeningMockTeil4Preview.jsx",
      "components/A2GoetheWritingMockPreview.jsx",
      "components/A2GoetheSpeakingMockTeil1Preview.jsx",
      "components/A2GoetheSpeakingMockTeil2Preview.jsx",
      "components/A2GoetheSpeakingMockTeil3Preview.jsx",
    ];

    mockFiles.forEach((file) => {
      const source = readSource(file);
      expect(source).not.toContain("preview only");
      expect(source).not.toContain("not in Course Book");
      expect(source).not.toContain("R2 audio");
      expect(source).not.toContain("AI marked");
    });
  });

  test("final mocks use plain saved-progress wording", () => {
    const a1 = readSource("components/A1FinalMockExamPage.jsx");
    const a2 = readSource("components/A2FinalMockExamPage.jsx");
    expect(a1).not.toContain("answers autosaved");
    expect(a1).not.toContain("Your progress is autosaved");
    expect(a2).not.toContain("answers autosaved");
    expect(a2).not.toContain("Your progress is autosaved");
    expect(a2).not.toContain("Your answers are autosaved");
  });
});
