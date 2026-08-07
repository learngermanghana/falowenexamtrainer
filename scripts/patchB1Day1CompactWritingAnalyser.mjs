import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const targetPath = path.join(repoRoot, "web", "src", "components", "B1Day1TraumweltWorkbookPageLegacy.js");

let source = fs.readFileSync(targetPath, "utf8");

const writingPageImport = 'import WritingPage from "./WritingPage";';
const analyserImport = 'import B1InlineWritingAnalyser from "./B1InlineWritingAnalyser";';

if (source.includes(writingPageImport)) {
  source = source.replace(writingPageImport, analyserImport);
} else if (!source.includes(analyserImport)) {
  const anchor = 'import CourseInlinePracticePanel from "./CourseInlinePracticePanel";';
  if (!source.includes(anchor)) throw new Error("Could not locate B1 Day 1 import anchor.");
  source = source.replace(anchor, `${anchor}\n${analyserImport}`);
}

const stateAnchor = '  const [writingView, setWritingView] = useState("schreiben");';
const draftState = '  const [writingDraft, setWritingDraft] = useState("");';
if (!source.includes(draftState)) {
  if (!source.includes(stateAnchor)) throw new Error("Could not locate B1 Day 1 writing state anchor.");
  source = source.replace(stateAnchor, `${stateAnchor}\n${draftState}`);
}

const oldBlock = `          {writingView === "schreiben" && (\n            <div style={writingPanelStyle}>\n              <strong>Schreiben</strong>\n              <p style={mobileTextStyle}>\n                Write your complete German letter below. When you finish, click <strong>Mark My Letter</strong> to get your score and corrections before submitting the final version.\n              </p>\n              <WritingPage\n                mode="course"\n                initialTab="mark"\n                enabledTabs={["mark"]}\n                hideTabList\n                markLabel="Mark My Letter"\n                submitLabel="Mark My Letter"\n                markDescription="Write your complete German letter in this box, then click Mark My Letter below it to check your work."\n                draftLabel="Your complete German letter"\n                draftPlaceholder={'Liebe Forum-Mitglieder,\\n\\nich bin der Meinung, dass ...'}\n                writingContext={{\n                  level: "B1",\n                  courseLevel: "B1",\n                  day: 1,\n                  lessonId: "B1-day-1",\n                  workbookId: "B1-day-1",\n                  writingTaskId: "B1-day-1-teil-2-writing",\n                  taskTitle: "Ist persönlicher Kontakt im Traumberuf wichtiger als flexible Arbeit im Homeoffice?",\n                }}\n              />\n            </div>\n          )}`;

const legacyBlock = `          {writingView === "schreiben" && (\n            <div style={writingPanelStyle}>\n              <strong>Schreiben</strong>\n              <p style={mobileTextStyle}>Type your draft here first. When it is finished, copy it to the Submit tab.</p>\n              <textarea\n                value={writingDraft}\n                onChange={(event) => setWritingDraft(event.target.value)}\n                placeholder="Liebe Forum-Mitglieder,\\n\\nich bin der Meinung, dass ..."\n                style={writingTextareaStyle}\n              />\n            </div>\n          )}`;

const newBlock = `          {writingView === "schreiben" && (\n            <div style={writingPanelStyle}>\n              <strong>Schreiben</strong>\n              <p style={mobileTextStyle}>\n                Write your complete text here. When you are finished, click <strong>Analyse my text</strong> below.\n              </p>\n              <textarea\n                value={writingDraft}\n                onChange={(event) => setWritingDraft(event.target.value)}\n                placeholder="Liebe Forum-Mitglieder,\\n\\nich bin der Meinung, dass ..."\n                style={writingTextareaStyle}\n              />\n              <B1InlineWritingAnalyser\n                text={writingDraft}\n                taskTitle="Ist persönlicher Kontakt im Traumberuf wichtiger als flexible Arbeit im Homeoffice?"\n              />\n            </div>\n          )}`;

if (!source.includes(newBlock)) {
  if (source.includes(oldBlock)) {
    source = source.replace(oldBlock, newBlock);
  } else if (source.includes(legacyBlock)) {
    source = source.replace(legacyBlock, newBlock);
  } else {
    throw new Error("Could not locate the B1 Day 1 Schreiben block to patch.");
  }
}

if (!source.includes("const writingTextareaStyle =")) {
  const styleAnchor = `const writingPanelStyle = {\n  ...questionCardStyle,\n  border: "1px solid #bfdbfe",\n  background: "#f8fbff",\n  gap: 12,\n};`;
  const textareaStyle = `${styleAnchor}\n\nconst writingTextareaStyle = {\n  width: "100%",\n  minHeight: 260,\n  border: "1px solid #cbd5e1",\n  borderRadius: 14,\n  padding: 12,\n  fontSize: "clamp(1rem, 4vw, 1.05rem)",\n  lineHeight: 1.7,\n  resize: "vertical",\n  boxSizing: "border-box",\n  overflowWrap: "anywhere",\n};`;
  if (!source.includes(styleAnchor)) throw new Error("Could not locate B1 Day 1 writing style anchor.");
  source = source.replace(styleAnchor, textareaStyle);
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("B1 Day 1 uses the compact Analyse my text writing layout.");
