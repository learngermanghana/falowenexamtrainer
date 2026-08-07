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

const smallTalkPath = path.join(root, "web", "src", "components", "A2Day2SmallTalkWorkbookEnhancedPage.js");
let smallTalkSource = fs.readFileSync(smallTalkPath, "utf8");

const standardSpeakingBlock = `const speakingContent = (\n  <div data-a2-small-talk-standard-speaking="true" style={{ display: "grid", gap: 14 }}>\n    <WorkbookTaskCard eyebrow="Teil 1 · Sprechen" title="Small Talk im Alltag" practiceOnly>\n      <p style={paragraph}>\n        Sprich etwa 90–120 Sekunden über Small Talk. Nutze die Struktur unten und ergänze deine eigenen Beispiele.\n      </p>\n    </WorkbookTaskCard>\n\n    <WorkbookTaskCard eyebrow="Suggested answer structure" title="So baust du deinen Vortrag auf" practiceOnly>\n      <ol style={list}>\n        <li><strong>Thema vorstellen:</strong> „Heute möchte ich über Small Talk sprechen.“</li>\n        <li><strong>Vorteile:</strong> „Ein Vorteil von Small Talk ist, dass ...“ / „Außerdem ...“</li>\n        <li><strong>Nachteile:</strong> „Ein Nachteil ist, dass ...“ / „Andererseits ...“</li>\n        <li><strong>Situation in deinem Land:</strong> „In meinem Land ist die Situation so, dass ...“</li>\n        <li><strong>Eigene Meinung:</strong> „Meiner Meinung nach ...“ / „Ich bin der Meinung, dass ...“</li>\n        <li><strong>Schluss:</strong> „Zusammenfassend lässt sich sagen, dass ...“ / „Vielen Dank fürs Zuhören.“</li>\n      </ol>\n    </WorkbookTaskCard>\n\n    <div style={topicGrid}>\n      {smallTalkTopics.map((topic) => (\n        <section key={topic.title} style={topicCard}>\n          <h3 style={topicTitle}>{topic.title}</h3>\n          <ul style={list}>\n            {topic.items.map((item) => <li key={item}>{item}</li>)}\n          </ul>\n        </section>\n      ))}\n    </div>\n\n    <div style={topicGrid}>\n      <section style={topicCard}>\n        <h3 style={topicTitle}>Höfliche Ausdrücke</h3>\n        <ul style={list}>\n          {politeExpressions.map((item) => <li key={item}>{item}</li>)}\n        </ul>\n      </section>\n      <section style={topicCard}>\n        <h3 style={topicTitle}>Gespräch beenden</h3>\n        <ul style={list}>\n          {endingExpressions.map((item) => <li key={item}>{item}</li>)}\n        </ul>\n      </section>\n    </div>\n  </div>\n);`;

if (!smallTalkSource.includes('data-a2-small-talk-standard-speaking="true"')) {
  const start = smallTalkSource.indexOf("const speakingContent = (");
  const end = smallTalkSource.indexOf("\n\nconst writingContent = (", start);
  if (start < 0 || end < 0) {
    throw new Error("Could not locate the A2 Small Talk speaking block.");
  }
  smallTalkSource = `${smallTalkSource.slice(0, start)}${standardSpeakingBlock}${smallTalkSource.slice(end)}`;
}

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
console.log("Updated requested teacher videos and standardized A2 Small Talk speaking.");
