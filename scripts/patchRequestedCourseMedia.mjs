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
if (!writingTabsSource.includes('writingVideo.badge || "Watch before writing · Essay Ideas"')) {
  throw new Error("Writing support does not use resource-specific badge text.");
}
if (!writingTabsSource.includes('writingVideo.heading || "Get ideas for this exact essay"')) {
  throw new Error("Writing support does not use resource-specific heading text.");
}

console.log("Applied requested course media and writing support labels.");
