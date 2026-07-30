import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, "web/src/components/QuestionOfDayPage.js");
let source = fs.readFileSync(filePath, "utf8");
let changed = false;

const importAnchor = 'import { speakingQuestionDictionary } from "../data/speakingDictionary";';
const templateImport = `import {
  insertQuestionOfDayLetterTemplate,
} from "../data/questionOfDayLetterTemplates";`;

if (!source.includes(templateImport)) {
  if (!source.includes(importAnchor)) {
    throw new Error("Question of the Day speaking-dictionary import anchor was not found.");
  }
  source = source.replace(importAnchor, `${importAnchor}\n${templateImport}`);
  changed = true;
}

const insertHandler = `  const insertLetterTemplate = (type) => {
    const nextAnswer = insertQuestionOfDayLetterTemplate({
      currentAnswer: warmupAnswer,
      type,
    });

    setLetterType(type);
    setWarmupAnswer(nextAnswer);
    setSubmitState({ loading: false, success: "", error: "" });

    try {
      const key = getProgressKey(activeLevel);
      const answerStore = readJsonStore(ANSWER_STORAGE_KEY);
      answerStore[key] = {
        level: activeLevel,
        answer: nextAnswer,
        taskTitle: getTaskTitle(dailyTask, activeLevel),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(ANSWER_STORAGE_KEY, JSON.stringify(answerStore));
    } catch {
      // Local saving is helpful but not required.
    }
  };

`;
const handlerAnchor = "  const handleAnswerChange = (event) => {";

if (!source.includes("const insertLetterTemplate = (type) =>")) {
  if (!source.includes(handlerAnchor)) {
    throw new Error("Question of the Day answer-change handler anchor was not found.");
  }
  source = source.replace(handlerAnchor, `${insertHandler}${handlerAnchor}`);
  changed = true;
}

const answerTextarea = `              <textarea
                value={warmupAnswer}
                onChange={handleAnswerChange}
                rows={7}
                placeholder="Write your Goethe-style answer here..."
                style={{ ...styles.textArea, minHeight: 150 }}
              />`;

const templateButtons = `${answerTextarea}
              <div
                data-question-of-day-letter-templates="true"
                style={{
                  marginTop: 10,
                  padding: 12,
                  border: "1px solid #bfdbfe",
                  borderRadius: 12,
                  background: "#eff6ff",
                  display: "grid",
                  gap: 10,
                }}
              >
                <div>
                  <strong>Insert a letter template</strong>
                  <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
                    Use these buttons for an email or letter task. Replace every [placeholder] and delete the greeting you do not need.
                  </p>
                </div>
                <div
                  role="group"
                  aria-label="Insert formal or informal letter template"
                  style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                >
                  <button
                    type="button"
                    aria-pressed={letterType === "formal"}
                    style={letterType === "formal" ? styles.navButtonActive : styles.secondaryButton}
                    onClick={() => insertLetterTemplate("formal")}
                  >
                    Insert formal template
                  </button>
                  <button
                    type="button"
                    aria-pressed={letterType === "informal"}
                    style={letterType === "informal" ? styles.navButtonActive : styles.secondaryButton}
                    onClick={() => insertLetterTemplate("informal")}
                  >
                    Insert informal template
                  </button>
                </div>
              </div>`;

if (!source.includes('data-question-of-day-letter-templates="true"')) {
  if (!source.includes(answerTextarea)) {
    throw new Error("Question of the Day Schreiben textarea anchor was not found.");
  }
  source = source.replace(answerTextarea, templateButtons);
  changed = true;
}

if (changed) {
  fs.writeFileSync(filePath, source, "utf8");
  console.log("Restored formal and informal template insertion in the Exam Warm-up Submit tab.");
} else {
  console.log("Exam Warm-up letter-template insertion is already present.");
}

const updated = fs.readFileSync(filePath, "utf8");
const requiredMarkers = [
  'from "../data/questionOfDayLetterTemplates"',
  "const insertLetterTemplate = (type) =>",
  'data-question-of-day-letter-templates="true"',
  "Insert formal template",
  "Insert informal template",
  'setLetterType(type)',
  'insertQuestionOfDayLetterTemplate({',
];

for (const marker of requiredMarkers) {
  if (!updated.includes(marker)) {
    throw new Error(`Question of the Day letter-template marker missing: ${marker}`);
  }
}

console.log("Question of the Day letter-template validation passed.");
