import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "web/src/components/B2Day7To16GuidedLessonPage.js");
let source = fs.readFileSync(file, "utf8");

function replaceOnce(before, after, label) {
  if (source.includes(after)) return;
  if (!source.includes(before)) {
    throw new Error(`B2 Day 9–12 content patch anchor missing: ${label}`);
  }
  source = source.replace(before, after);
}

replaceOnce(
  'import B2Day7To13GrammarNotes from "./B2Day7To13GrammarNotes";',
  'import B2Day7To13GrammarNotes from "./B2Day7To13GrammarNotes";\nimport B2Day10And12AdvancedGrammarNotes from "./B2Day10And12AdvancedGrammarNotes";',
  "advanced notes import",
);

replaceOnce(
  'import { styles } from "../styles";',
  'import { styles } from "../styles";\nimport { B2_C1_LESSON_VIDEO_OVERRIDES } from "../data/b2C1LessonMediaOverrides";',
  "requested AI video import",
);

replaceOnce(
  `  if (day >= 8 && day <= 13) {
    return <B2Day7To13GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />;
  }`,
  `  if ([10, 12].includes(Number(day))) {
    return <B2Day10And12AdvancedGrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />;
  }
  if (day >= 8 && day <= 13) {
    return <B2Day7To13GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />;
  }`,
  "advanced grammar routing",
);

if (!source.includes("const requestedAiVideo")) {
  const videoCandidates = [
    '  const video = lesson.videoResource || canonicalLesson?.resources?.aiVideo || canonicalLesson?.resources?.teacherVideo || null;',
    '  const video = lesson.videoResource || canonicalLesson?.resources?.aiVideo || null;',
  ];
  const videoAnchor = videoCandidates.find((candidate) => source.includes(candidate));
  if (!videoAnchor) {
    throw new Error("B2 Day 9–12 content patch anchor missing: guided AI video selection");
  }
  source = source.replace(
    videoAnchor,
    `  const requestedAiVideo = B2_C1_LESSON_VIDEO_OVERRIDES.B2?.[day]?.videoResources?.[0] || null;
  const video = requestedAiVideo || lesson.videoResource || canonicalLesson?.resources?.aiVideo || null;`,
  );
}

fs.writeFileSync(file, source, "utf8");
console.log("Applied B2 Day 9/12 AI videos and advanced Day 10/12 grammar notes.");
