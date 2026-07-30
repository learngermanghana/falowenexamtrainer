import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function updateFile(relativePath, transform) {
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const updated = transform(source);
  fs.writeFileSync(filePath, updated, "utf8");
}

updateFile("web/src/components/A2Day3ComparisonsWorkbookPage.js", (source) => {
  const oldUrl = 'hoerenAudioUrl="https://youtu.be/Ml50uHYxBx8"';
  const newUrl = 'hoerenAudioUrl="https://youtu.be/z0hve7zCDEo"';
  if (source.includes(newUrl)) return source;
  if (!source.includes(oldUrl)) {
    throw new Error("A2 Day 1.3 old Teil 4 listening link was not found.");
  }
  return source.replace(oldUrl, newUrl);
});

updateFile("web/src/data/selfLearningLessons/c1/day11EngagementUndEhrenamt.js", (source) => {
  const marker = '  heroImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80",';
  const videoBlock = `  videoResource: {
    title: "C1 Day 11 · AI video: Engagement und Ehrenamt",
    description: "AI explanation for C1 Day 11, chapter 3.1: Engagement, Ehrenamt, gesellschaftliche Verantwortung and nachhaltige Unterstützung.",
    url: "https://youtu.be/51cNSMK5F0g?si=npQ1tReOKcrLhY-T",
  },`;

  if (source.includes('url: "https://youtu.be/51cNSMK5F0g?si=npQ1tReOKcrLhY-T"')) return source;
  if (!source.includes(marker)) {
    throw new Error("C1 Day 11 hero image anchor was not found.");
  }
  return source.replace(marker, `${marker}\n${videoBlock}`);
});

const requestedB2RadioEntries = [
  {
    key: "b2-day16-digitalisierung-alltag-falowen-radio",
    block: `
    16: Object.freeze({
      key: "b2-day16-digitalisierung-alltag-falowen-radio",
      title: "Digitalisierung im Alltag 4.1",
      youtubeId: "owg4yrfE3AU",
      duration: "",
      instruction:
        "Höre aufmerksam zu und stimme dich auf Digitalisierung, digitale Werkzeuge und ihren Einfluss auf den Alltag ein. Danach gehst du weiter zum Lernteil.",
    }),`,
  },
  {
    key: "b2-day17-mobilitaet-stadtleben-falowen-radio",
    block: `
    17: Object.freeze({
      key: "b2-day17-mobilitaet-stadtleben-falowen-radio",
      title: "Mobilität und Stadtleben 4.2",
      youtubeId: "YHbNyjnrlFI",
      duration: "",
      instruction:
        "Höre aufmerksam zu und stimme dich auf Mobilität, Stadtplanung und Lebensqualität ein. Danach gehst du weiter zum Lernteil.",
    }),`,
  },
  {
    key: "b2-day18-natur-klima-verantwortung-falowen-radio",
    block: `
    18: Object.freeze({
      key: "b2-day18-natur-klima-verantwortung-falowen-radio",
      title: "Natur, Klima und Verantwortung 4.3",
      youtubeId: "Muq_KlmZuBM",
      duration: "",
      instruction:
        "Höre aufmerksam zu und stimme dich auf Natur, Klimaschutz und persönliche Verantwortung ein. Danach gehst du weiter zum Lernteil.",
    }),`,
  },
  {
    key: "b2-day19-freiwilligenarbeit-engagement-falowen-radio",
    block: `
    19: Object.freeze({
      key: "b2-day19-freiwilligenarbeit-engagement-falowen-radio",
      title: "Freiwilligenarbeit und Engagement 4.4",
      youtubeId: "Mte_sT9D-Pg",
      duration: "",
      instruction:
        "Höre aufmerksam zu und stimme dich auf Freiwilligenarbeit, gesellschaftliche Hilfe und persönliche Motivation ein. Danach gehst du weiter zum Lernteil.",
    }),`,
  },
  {
    key: "b2-day20-technologie-arbeit-zukunft-falowen-radio",
    block: `
    20: Object.freeze({
      key: "b2-day20-technologie-arbeit-zukunft-falowen-radio",
      title: "Technologie und Arbeit der Zukunft 4.5",
      youtubeId: "v8kHCzl7EN0",
      duration: "",
      instruction:
        "Höre aufmerksam zu und stimme dich auf Technologie, Automatisierung und die Arbeit der Zukunft ein. Danach gehst du weiter zum Lernteil.",
    }),`,
  },
];

updateFile("web/src/data/b2C1LessonMediaOverrides.js", (source) => {
  const missingEntries = requestedB2RadioEntries.filter(
    ({ key }) => !source.includes(`key: "${key}"`),
  );
  if (missingEntries.length === 0) return source;

  const radioStart = source.indexOf("export const B2_C1_LESSON_RADIO_OVERRIDES");
  const b2EndMarker = "  }),\n  C1: Object.freeze({";
  const b2End = source.indexOf(b2EndMarker, radioStart);
  if (radioStart < 0 || b2End < 0) {
    throw new Error("The B2 Falowen Radio override insertion point was not found.");
  }

  const insertion = missingEntries.map(({ block }) => block).join("");
  return `${source.slice(0, b2End)}${insertion}\n${source.slice(b2End)}`;
});

updateFile("web/src/components/WritingCheatSheetTabs.js", (source) => {
  let updated = source;
  const badgeBefore = "        Watch before writing · Essay Ideas";
  const badgeAfter = '        {writingVideo.badge || "Watch before writing · Essay Ideas"}';
  const headingBefore = "          Get ideas for this exact essay";
  const headingAfter = '          {writingVideo.heading || "Get ideas for this exact essay"}';

  if (!updated.includes(badgeAfter)) {
    if (!updated.includes(badgeBefore)) {
      throw new Error("Writing support badge anchor was not found.");
    }
    updated = updated.replace(badgeBefore, badgeAfter);
  }

  if (!updated.includes(headingAfter)) {
    if (!updated.includes(headingBefore)) {
      throw new Error("Writing support heading anchor was not found.");
    }
    updated = updated.replace(headingBefore, headingAfter);
  }

  return updated;
});

const a2Source = fs.readFileSync(path.join(root, "web/src/components/A2Day3ComparisonsWorkbookPage.js"), "utf8");
const c1Source = fs.readFileSync(path.join(root, "web/src/data/selfLearningLessons/c1/day11EngagementUndEhrenamt.js"), "utf8");
const b2C1MediaSource = fs.readFileSync(path.join(root, "web/src/data/b2C1LessonMediaOverrides.js"), "utf8");
const courseScheduleSource = fs.readFileSync(path.join(root, "web/src/data/courseSchedule.js"), "utf8");
const writingTabsSource = fs.readFileSync(path.join(root, "web/src/components/WritingCheatSheetTabs.js"), "utf8");

if (a2Source.includes("https://youtu.be/Ml50uHYxBx8")) {
  throw new Error("The old A2 Day 1.3 listening link is still present.");
}
if (!a2Source.includes("https://youtu.be/z0hve7zCDEo")) {
  throw new Error("The new A2 Day 1.3 listening link is missing.");
}
if (!c1Source.includes("https://youtu.be/51cNSMK5F0g?si=npQ1tReOKcrLhY-T")) {
  throw new Error("The C1 Day 11 AI video is missing.");
}
if (!b2C1MediaSource.includes('key: "b2-day11-gesellschaft-integration-falowen-radio"') || !b2C1MediaSource.includes('youtubeId: "AWEHnJd1o3M"')) {
  throw new Error("The B2 Day 11 chapter 3.1 Falowen Radio mapping is missing.");
}
for (const { key, block } of requestedB2RadioEntries) {
  const youtubeId = block.match(/youtubeId: "([^"]+)"/)?.[1];
  if (!b2C1MediaSource.includes(`key: "${key}"`) || !youtubeId || !b2C1MediaSource.includes(`youtubeId: "${youtubeId}"`)) {
    throw new Error(`The requested B2 Falowen Radio mapping is missing: ${key}`);
  }
}
if (courseScheduleSource.includes('video: "https://youtu.be/AWEHnJd1o3M"') || courseScheduleSource.includes('youtube_link: "https://youtu.be/AWEHnJd1o3M"')) {
  throw new Error("B2 Day 11 Falowen Radio must not be injected into ordinary lesson video fields.");
}
if (!writingTabsSource.includes('writingVideo.badge || "Watch before writing · Essay Ideas"')) {
  throw new Error("Writing support does not use resource-specific badge text.");
}
if (!writingTabsSource.includes('writingVideo.heading || "Get ideas for this exact essay"')) {
  throw new Error("Writing support does not use resource-specific heading text.");
}

console.log("Applied requested course media and writing support labels.");
