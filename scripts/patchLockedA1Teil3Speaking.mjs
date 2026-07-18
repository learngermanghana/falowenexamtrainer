import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function patchSpeakingPage() {
  const file = path.join(root, "web/src/components/SpeakingPage.js");
  let source = fs.readFileSync(file, "utf8");

  const replaceOnce = (before, after, label) => {
    if (source.includes(after)) return;
    if (!source.includes(before)) throw new Error(`Locked speaking patch anchor missing: ${label}`);
    source = source.replace(before, after);
  };

  replaceOnce(
    'import { speakingQuestionDictionary } from "../data/speakingDictionary";',
    'import { speakingQuestionDictionary } from "../data/speakingDictionary";\nimport {\n  getVisibleSpeakingTabs,\n  normalizeLockedSpeakingLevel,\n  normalizeLockedSpeakingTeil,\n  resolveInitialSpeakingFilters,\n} from "../lib/speakingExamLock";',
    "speaking lock imports",
  );

  replaceOnce(
    'const SpeakingPage = ({ mode = "exam" }) => {',
    'const SpeakingPage = ({\n  mode = "exam",\n  lockedLevel: lockedLevelProp = "",\n  lockedTeil: lockedTeilProp = "",\n  examOnly = false,\n  contextLabel = "",\n}) => {',
    "speaking page props",
  );

  replaceOnce(
    '  const isCourseMode = mode === "course";\n  const userId = user?.uid || "";',
    '  const isCourseMode = mode === "course";\n  const normalizedLockedLevel = normalizeLockedSpeakingLevel(lockedLevelProp);\n  const normalizedLockedTeil = normalizeLockedSpeakingTeil(lockedTeilProp);\n  const initialSpeakingFilters = resolveInitialSpeakingFilters({\n    lockedLevel: normalizedLockedLevel,\n    lockedTeil: normalizedLockedTeil,\n    examLevel,\n  });\n  const userId = user?.uid || "";',
    "normalized speaking locks",
  );

  replaceOnce(
    '  const [selectedLevel, setSelectedLevel] = useState((examLevel || "A1").toUpperCase());\n  const [selectedTeil, setSelectedTeil] = useState("all");',
    '  const [selectedLevel, setSelectedLevel] = useState(initialSpeakingFilters.level);\n  const [selectedTeil, setSelectedTeil] = useState(initialSpeakingFilters.teil);',
    "locked speaking initial state",
  );

  replaceOnce(
    `  const visibleSpeakingTabs = useMemo(
    () => (isCourseMode ? [{ key: "custom", label: "Custom chat" }] : [
      { key: "exam", label: "Exam prompts" },
      { key: "custom", label: "Custom chat" },
    ]),
    [isCourseMode]
  );`,
    `  const visibleSpeakingTabs = useMemo(
    () => getVisibleSpeakingTabs({ isCourseMode, examOnly }),
    [examOnly, isCourseMode]
  );`,
    "locked speaking tabs",
  );

  replaceOnce(
    `  useEffect(() => {
    if (isExamMode && examLevel) {
      setSelectedLevel(String(examLevel).toUpperCase());
    }
  }, [examLevel, isExamMode]);`,
    `  useEffect(() => {
    if (normalizedLockedLevel) {
      setSelectedLevel(normalizedLockedLevel);
    } else if (isExamMode && examLevel) {
      setSelectedLevel(String(examLevel).toUpperCase());
    }
    if (normalizedLockedTeil) {
      setSelectedTeil(normalizedLockedTeil);
    }
  }, [examLevel, isExamMode, normalizedLockedLevel, normalizedLockedTeil]);`,
    "enforce speaking locks",
  );

  replaceOnce(
    `      const shouldUseSavedLevel = !(isExamMode && examLevel);
      if (saved?.selectedLevel && shouldUseSavedLevel) {
        setSelectedLevel(String(saved.selectedLevel).toUpperCase());
      }
      if (saved?.selectedTeil) setSelectedTeil(saved.selectedTeil);`,
    `      const shouldUseSavedLevel = !normalizedLockedLevel && !(isExamMode && examLevel);
      if (saved?.selectedLevel && shouldUseSavedLevel) {
        setSelectedLevel(String(saved.selectedLevel).toUpperCase());
      }
      if (saved?.selectedTeil && !normalizedLockedTeil) setSelectedTeil(saved.selectedTeil);`,
    "protect locks from saved progress",
  );

  replaceOnce(
    '  }, [examLevel, isExamMode, mode, studentCode, userId]);',
    '  }, [examLevel, isExamMode, mode, normalizedLockedLevel, normalizedLockedTeil, studentCode, userId]);',
    "locked progress dependencies",
  );

  replaceOnce(
    '  const totalCount = speakingQuestionDictionary.filter((question) => question.level === selectedLevel).length;',
    '  const totalCount = baseFilteredQuestions.length;',
    "locked progress total",
  );

  replaceOnce(
    '              Speaking Exams {examLevel ? `• Level ${examLevel}` : ""}',
    '              {contextLabel || `Speaking Exams${selectedLevel ? ` • Level ${selectedLevel}` : ""}${normalizedLockedTeil ? ` • Teil ${normalizedLockedTeil}` : ""}`}',
    "speaking context label",
  );

  replaceOnce(
    `            <div style={{ display: "grid", gap: 6 }}>
              <label style={styles.label}>Teil</label>
              <select style={styles.select} value={selectedTeil} onChange={(event) => setSelectedTeil(event.target.value)}>
                <option value="all">All</option>
                <option value="1">Teil 1</option>
                <option value="2">Teil 2</option>
                <option value="3">Teil 3</option>
              </select>
            </div>`,
    `            <div style={{ display: "grid", gap: 6 }}>
              <label style={styles.label}>Teil</label>
              {normalizedLockedTeil ? (
                <div style={{ ...styles.input, background: "#EEF2FF", fontWeight: 700 }}>Teil {normalizedLockedTeil}</div>
              ) : (
                <select style={styles.select} value={selectedTeil} onChange={(event) => setSelectedTeil(event.target.value)}>
                  <option value="all">All</option>
                  <option value="1">Teil 1</option>
                  <option value="2">Teil 2</option>
                  <option value="3">Teil 3</option>
                </select>
              )}
            </div>`,
    "locked Teil display",
  );

  fs.writeFileSync(file, source, "utf8");
}

function patchSpeakingIntroPage() {
  const file = path.join(root, "web/src/components/SpeakingExamIntroPage.js");
  let source = fs.readFileSync(file, "utf8");

  if (!source.includes('import A1Teil3SpeakingPracticePanel from "./A1Teil3SpeakingPracticePanel";')) {
    const importAnchor = 'import AppBackButton from "./navigation/AppBackButton";';
    if (!source.includes(importAnchor)) throw new Error("Speaking intro import anchor missing.");
    source = source.replace(
      importAnchor,
      `${importAnchor}\nimport A1Teil3SpeakingPracticePanel from "./A1Teil3SpeakingPracticePanel";`,
    );
  }

  if (!source.includes("<A1Teil3SpeakingPracticePanel />")) {
    const closing = "      </Section>\n    </div>\n  );";
    const index = source.lastIndexOf(closing);
    if (index < 0) throw new Error("Speaking intro final section anchor missing.");
    const replacement = "      </Section>\n\n      <A1Teil3SpeakingPracticePanel />\n    </div>\n  );";
    source = `${source.slice(0, index)}${replacement}${source.slice(index + closing.length)}`;
  }

  fs.writeFileSync(file, source, "utf8");
}

patchSpeakingPage();
patchSpeakingIntroPage();
console.log("Applied locked Goethe A1 Teil 3 practice after the speaking notes.");
