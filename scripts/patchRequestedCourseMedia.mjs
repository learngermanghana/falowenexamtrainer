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

updateFile("web/src/data/b2C1LessonMediaOverrides.js", (source) => {
  const marker = "  C1: Object.freeze({\n";
  const requestedUrls = [
    "https://youtu.be/H4mPDTiMkwg",
    "https://youtu.be/g-HaC_4ogaQ",
    "https://youtu.be/ULtTH3LmWBo",
  ];
  const videoBlock = `    16: Object.freeze({
      videoResources: Object.freeze([
        Object.freeze({
          key: "c1-day16-technologie-alltag-ai-video",
          chapter: "4.1",
          title: "C1 Day 16 · Technologie im Alltag · AI video",
          description:
            "AI video lesson for evaluating digital tools, permanent availability, digital overload and self-determined technology use at C1 level.",
          url: "https://youtu.be/H4mPDTiMkwg",
        }),
      ]),
    }),
    17: Object.freeze({
      videoResources: Object.freeze([
        Object.freeze({
          key: "c1-day17-umwelt-verantwortung-ai-video",
          chapter: "4.2",
          title: "C1 Day 17 · Umwelt und Verantwortung · AI video",
          description:
            "AI video lesson for discussing sustainability, climate responsibility and personal action in a differentiated way at C1 level.",
          url: "https://youtu.be/g-HaC_4ogaQ",
        }),
      ]),
    }),
    18: Object.freeze({
      videoResources: Object.freeze([
        Object.freeze({
          key: "c1-day18-gesellschaft-zusammenhalt-ai-video",
          chapter: "4.3",
          title: "C1 Day 18 · Gesellschaft und Zusammenhalt · AI video",
          description:
            "AI video lesson for analysing community, conflict, solidarity and social cohesion at C1 level.",
          url: "https://youtu.be/ULtTH3LmWBo",
        }),
      ]),
    }),
`;

  if (requestedUrls.every((url) => source.includes(url))) return source;
  if (requestedUrls.some((url) => source.includes(url))) {
    throw new Error("C1 Days 16–18 AI video mappings are only partially present.");
  }
  if (!source.includes(marker)) {
    throw new Error("C1 lesson video override anchor was not found.");
  }
  return source.replace(marker, `${marker}${videoBlock}`);
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
[
  {
    key: 'key: "c1-day16-technologie-alltag-ai-video"',
    chapter: 'chapter: "4.1"',
    url: 'url: "https://youtu.be/H4mPDTiMkwg"',
  },
  {
    key: 'key: "c1-day17-umwelt-verantwortung-ai-video"',
    chapter: 'chapter: "4.2"',
    url: 'url: "https://youtu.be/g-HaC_4ogaQ"',
  },
  {
    key: 'key: "c1-day18-gesellschaft-zusammenhalt-ai-video"',
    chapter: 'chapter: "4.3"',
    url: 'url: "https://youtu.be/ULtTH3LmWBo"',
  },
].forEach((mapping) => {
  if (!b2C1MediaSource.includes(mapping.key) || !b2C1MediaSource.includes(mapping.chapter) || !b2C1MediaSource.includes(mapping.url)) {
    throw new Error(`Requested C1 AI video mapping is missing: ${mapping.key}`);
  }
});
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