import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const replacements = [
  {
    file: "web/src/components/A2Day2PersonenBeschreibenWorkbookPage.js",
    before: 'hoerenAudioUrl="https://youtu.be/5ttnGcZWo-Q"',
    after: 'hoerenAudioUrl="https://youtu.be/iB-yVVqI1DQ"',
    label: "A2 Day 2 teacher lecture video",
  },
  {
    file: "web/src/data/a1TeacherVideoResources.js",
    before: '[11, "7", "Understanding Time", "https://youtu.be/qrkQJc5kQJQ"],',
    after: '[11, "7", "Understanding Time", "https://youtu.be/8FnvD8LQEu0"],',
    label: "A1 Day 11 teacher lecture video",
  },
];

for (const { file, before, after, label } of replacements) {
  const filePath = path.join(root, file);
  let source = fs.readFileSync(filePath, "utf8");
  if (!source.includes(after)) {
    if (!source.includes(before)) {
      throw new Error(`Could not find the current ${label} entry in ${file}.`);
    }
    source = source.replace(before, after);
    fs.writeFileSync(filePath, source, "utf8");
  }
}

const smallTalkPath = path.join(
  root,
  "web",
  "src",
  "components",
  "A2Day2SmallTalkWorkbookEnhancedPage.js",
);
let smallTalkSource = fs.readFileSync(smallTalkPath, "utf8");

const teacherLectureMarker = 'data-a2-small-talk-teacher-lecture="true"';
if (!smallTalkSource.includes(teacherLectureMarker)) {
  const speakingAnchor = `const speakingContent = (\n  <>`;
  if (!smallTalkSource.includes(speakingAnchor)) {
    throw new Error("Could not locate A2 Small Talk speaking content anchor.");
  }

  const teacherLectureBlock = `const speakingContent = (\n  <>\n    <section\n      data-a2-small-talk-teacher-lecture="true"\n      style={{ ...topicCard, border: "1px solid #bfdbfe", background: "#eff6ff" }}\n    >\n      <h3 style={topicTitle}>Teacher lecture</h3>\n      <p style={paragraph}>Watch the lesson video before starting the Small Talk activities.</p>\n      <div\n        style={{\n          position: "relative",\n          width: "100%",\n          paddingTop: "56.25%",\n          borderRadius: 12,\n          overflow: "hidden",\n          background: "#000",\n        }}\n      >\n        <iframe\n          title="A2 Small Talk teacher lecture"\n          src="https://www.youtube-nocookie.com/embed/wlaJt0xsdP0"\n          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"\n          allowFullScreen\n          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}\n        />\n      </div>\n      <a\n        href="https://youtu.be/wlaJt0xsdP0"\n        target="_blank"\n        rel="noreferrer"\n        style={{ ...chip, width: "fit-content", textDecoration: "none" }}\n      >\n        Open teacher lecture in YouTube\n      </a>\n    </section>`;

  smallTalkSource = smallTalkSource.replace(speakingAnchor, teacherLectureBlock);
  fs.writeFileSync(smallTalkPath, smallTalkSource, "utf8");
}

console.log("Updated requested teacher lecture videos, including A2 Small Talk.");
