import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const replacements = [
  {
    file: "web/src/data/a1TeacherVideoResources.js",
    before: '[11, "7", "Understanding Time", "https://youtu.be/qrkQJc5kQJQ"],',
    after: '[11, "7", "Understanding Time", "https://youtu.be/8FnvD8LQEu0"],',
    label: "A1 Day 11 teacher lecture video",
  },
  {
    file: "web/src/data/lessonVideoDictionary.js",
    before: 'url: "https://youtu.be/qPwxBYlu3CE",',
    after: 'url: "https://youtu.be/PP38eObAMh8",',
    label: "A1 Day 0 orientation dictionary video",
  },
  {
    file: "web/src/components/Day0StudentWorkflowUpgrade.js",
    before: 'id: "qPwxBYlu3CE",\n      url: "https://youtu.be/qPwxBYlu3CE",',
    after: 'id: "PP38eObAMh8",\n      url: "https://youtu.be/PP38eObAMh8",',
    label: "A1 Day 0 workflow orientation video",
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

const smallTalkPath = path.join(root, "web", "src", "components", "A2Day2SmallTalkWorkbookEnhancedPage.js");
let smallTalkSource = fs.readFileSync(smallTalkPath, "utf8");

const teacherLectureMarker = 'data-a2-small-talk-teacher-lecture="true"';
if (!smallTalkSource.includes(teacherLectureMarker)) {
  const workbookAnchor = 'const SmallTalkWorkbook = () => (\n  <A2StandardTabbedWorkbookPage';
  if (!smallTalkSource.includes(workbookAnchor)) {
    throw new Error("Could not locate A2 Small Talk workbook anchor for teacher lecture.");
  }
  const teacherLecture = `const TeacherLecture = () => (\n  <section data-a2-small-talk-teacher-lecture="true" style={{ ...topicCard, marginBottom: 14 }}>\n    <h3 style={topicTitle}>Teacher lecture · Small Talk</h3>\n    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", background: "#000" }}>\n      <iframe\n        title="A2 Small Talk teacher lecture"\n        src="https://www.youtube-nocookie.com/embed/wlaJt0xsdP0"\n        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"\n        allowFullScreen\n        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}\n      />\n    </div>\n  </section>\n);\n\n`;
  smallTalkSource = smallTalkSource.replace(workbookAnchor, `${teacherLecture}${workbookAnchor}`);
  smallTalkSource = smallTalkSource.replace(
    'sprechenContent={speakingContent}',
    'sprechenContent={<><TeacherLecture />{speakingContent}</>}',
  );
}

fs.writeFileSync(smallTalkPath, smallTalkSource, "utf8");
console.log("Updated requested teacher lecture videos and A1 Day 0 orientation video without changing A2 speaking structure.");