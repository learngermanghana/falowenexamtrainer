import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const requiredMarkers = {
  "web/src/components/A2Day3ComparisonsWorkbookPage.js": [
    'hoerenAudioUrl="https://youtu.be/z0hve7zCDEo"',
  ],
  "web/src/data/selfLearningLessons/c1/day11EngagementUndEhrenamt.js": [
    'url: "https://youtu.be/F67RRmGNK1c"',
  ],
  "web/src/data/b2C1LessonMediaOverrides.js": [
    'key: "b2-day11-gesellschaft-integration-falowen-radio"',
    'youtubeId: "AWEHnJd1o3M"',
    'key: "c1-day16-technologie-alltag-ai-video"',
    'url: "https://youtu.be/H4mPDTiMkwg"',
    'key: "c1-day17-umwelt-verantwortung-ai-video"',
    'url: "https://youtu.be/g-HaC_4ogaQ"',
    'key: "c1-day18-gesellschaft-zusammenhalt-ai-video"',
    'url: "https://youtu.be/ULtTH3LmWBo"',
  ],
  "web/src/components/WritingCheatSheetTabs.js": [
    'writingVideo.badge || "Watch before writing · Essay Ideas"',
    'writingVideo.heading || "Get ideas for this exact essay"',
  ],
  "web/src/data/lessonVideoDictionary.js": [
    'https://youtu.be/7h0XURhtGFg',
    'url: "https://youtu.be/PP38eObAMh8"',
  ],
  "web/src/components/ObjectsAndColorsPage.js": [
    'stem: "5) Das sind ___ Bücher."',
  ],
  "web/src/data/a1TeacherVideoResources.js": [
    '[11, "7", "Understanding Time", "https://youtu.be/8FnvD8LQEu0"],',
  ],
  "web/src/components/Day0StudentWorkflowUpgrade.js": [
    'id: "PP38eObAMh8"',
    'url: "https://youtu.be/PP38eObAMh8"',
  ],
  "web/src/components/A2StandardTabbedWorkbookPage.js": [
    '<SpeakingMindMap config={getA2SpeakingMindMap(day)} />',
  ],
  "web/src/data/speakingMindMaps/a2/index.js": [
    '[2, "a2-day-2-personen-beschreiben", "Deine Beschreibung", "Kannst du eine Person beschreiben? Wie sieht sie aus und was für ein Mensch ist sie?"',
  ],
  "web/src/data/speakingMindMaps/a2/personenBeschreiben.js": [
    'id: "aussehen"',
    'id: "charakter"',
    'id: "kleidung"',
    'id: "besondere-merkmale"',
  ],
};

const forbiddenMarkers = {
  "web/src/components/A2Day3ComparisonsWorkbookPage.js": [
    "https://youtu.be/Ml50uHYxBx8",
  ],
  "web/src/data/courseSchedule.js": [
    'video: "https://youtu.be/AWEHnJd1o3M"',
    'youtube_link: "https://youtu.be/AWEHnJd1o3M"',
  ],
  "web/src/components/A2Day2SmallTalkWorkbookEnhancedPage.js": [
    'data-a2-small-talk-teacher-lecture="true"',
    "wlaJt0xsdP0",
  ],
  "web/src/data/teacherLectureVideoResources.js": [
    "70AgN5VKeqc",
  ],
};

for (const [file, markers] of Object.entries(requiredMarkers)) {
  const source = read(file);
  for (const marker of markers) {
    if (!source.includes(marker)) {
      throw new Error(`Permanent source marker missing in ${file}: ${marker}`);
    }
  }
}

for (const [file, markers] of Object.entries(forbiddenMarkers)) {
  const source = read(file);
  for (const marker of markers) {
    if (source.includes(marker)) {
      throw new Error(`Obsolete source marker returned in ${file}: ${marker}`);
    }
  }
}

console.log("Course media and A2 speaking source audit passed without modifying files.");
