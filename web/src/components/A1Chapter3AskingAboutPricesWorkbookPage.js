import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import { useAuth } from "../context/AuthContext";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import A1FamilyRecording from "./A1FamilyRecording";
import { styles } from "../styles";
import {
  buildA1WorkbookSubmissionText,
  countCompletedA1Answers,
  readA1WorkbookDraft,
  saveA1WorkbookDraft,
} from "../utils/a1WorkbookDraft";
import {
  loadA1WorkbookCloudDraft,
  saveA1WorkbookCloudDraft,
} from "../utils/a1WorkbookCloudDraft";

const ASSIGNMENT_KEY = "A1-3";
const CLOUD_AUTOSAVE_DELAY_MS = 900;

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const listSpacing = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const draftNoticeStyle = {
  margin: 0,
  border: "1px solid #bfdbfe",
  borderRadius: 10,
  background: "#eff6ff",
  color: "#1e3a8a",
  padding: "10px 12px",
  fontWeight: 800,
  lineHeight: 1.55,
};

const answerInputStyle = {
  ...styles.input,
  minHeight: 44,
  width: "100%",
};

const priceQuestions = [
  { prompt: "Wie viel kostet das Buch?", suffix: "kostet 20 Euro." },
  { prompt: "Wie viel kostet die Lampe?", suffix: "kostet 15 Euro." },
  { prompt: "Wie viel kostet das Auto?", suffix: "kostet 25.000 Euro." },
  { prompt: "Wie viel kostet der Stuhl?", suffix: "kostet 50 Euro." },
];

const GRAMMAR_REVISION = "a1-3-recorded-family-grammar-v2";
const grammarQuestions = [
  { before: "Ich schwimme sehr", after: ".", slots: [1], choices: ["gern", "mag"] },
  { before: "", after: "du Pizza?", slots: [2], choices: ["Gern", "Magst"] },
  { before: "Mein Bruder kocht", after: "für die Familie.", slots: [3], choices: ["gern", "mag"] },
  { before: "Wir", after: "moderne Kunst.", slots: [4], choices: ["mögen", "gern"] },
  { before: "Anna hört", after: "Musik, aber sie", end: "keinen Jazz.", slots: [5, 6], choices: ["gern", "mag"] },
];

const familyIdeas = [
  "Familienmitglieder: Wer gehört zu deiner Familie? (Mutter, Vater, Geschwister, etc.)",
  "Namen und Alter: Wie heißen deine Familienmitglieder und wie alt sind sie?",
  "Berufe: Was machen deine Familienmitglieder beruflich?",
  "Hobbys: Was sind die Hobbys deiner Familienmitglieder?",
  "Wohnort: Wo wohnt deine Familie?",
];

const normalizeStoredSections = (stored = {}) => ({
  "teil-1": {
    answers: stored?.["teil-1"]?.answers && typeof stored["teil-1"].answers === "object"
      ? stored["teil-1"].answers
      : {},
  },
  "teil-2": {
    text: String(stored?.["teil-2"]?.recording?.transcript || ""),
    recording: stored?.["teil-2"]?.recording || null,
  },
  "teil-3": {
    revision: GRAMMAR_REVISION,
    answers: stored?.["teil-3"]?.revision === GRAMMAR_REVISION ? stored["teil-3"].answers || {} : {},
  },
});

const hasDraftContent = (sections = {}) => {
  const part1 = Object.values(sections?.["teil-1"]?.answers || {}).some((value) => String(value || "").trim());
  const part2 = Boolean(String(sections?.["teil-2"]?.text || "").trim());
  return part1 || part2 || Object.values(sections?.["teil-3"]?.answers || {}).some(value => String(value || "").trim());
};

const DraftNotice = ({ savedAt = "", cloudStatus = "" }) => (
  <p role="status" aria-live="polite" style={draftNoticeStyle}>
    {cloudStatus === "error" ? "Cloud save failed. Your draft is saved on this device; try again before leaving. " : cloudStatus === "saving" ? "Saving draft… " : ""}
    Saved to your assignment draft{savedAt ? ` · ${new Date(savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}. <strong>Not submitted for marking yet.</strong>
  </p>
);

const A1Chapter3AskingAboutPricesWorkbookPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, studentProfile } = useAuth();
  const assignment = useMemo(() => getA1Assignment(ASSIGNMENT_KEY), []);
  const initialDraft = useMemo(() => readA1WorkbookDraft(ASSIGNMENT_KEY), []);
  const [sections, setSections] = useState(() => normalizeStoredSections(initialDraft.sections));
  const [savedAt, setSavedAt] = useState(initialDraft.updatedAt || "");
  const [cloudReady, setCloudReady] = useState(false);
  const [cloudStatus, setCloudStatus] = useState("checking");

  useEffect(() => {
    const saved = saveA1WorkbookDraft({ assignmentKey: ASSIGNMENT_KEY, sections });
    setSavedAt(saved.updatedAt);
  }, [sections]);

  useEffect(() => {
    let cancelled = false;

    const restoreCloudDraft = async () => {
      if (!user?.uid || !assignment) {
        if (!cancelled) {
          setCloudReady(true);
          setCloudStatus("local-only");
        }
        return;
      }

      setCloudStatus("checking");
      const result = await loadA1WorkbookCloudDraft({ user, studentProfile, assignment });
      if (cancelled) return;

      if (result.ok && !result.empty && result.data?.workbookSections) {
        const localUpdatedAt = new Date(initialDraft.updatedAt || 0).getTime();
        if (!hasDraftContent(initialDraft.sections) || result.updatedAtMillis > localUpdatedAt) {
          const restored = normalizeStoredSections(result.data.workbookSections);
          setSections(restored);
          const localCopy = saveA1WorkbookDraft({ assignmentKey: ASSIGNMENT_KEY, sections: restored });
          setSavedAt(localCopy.updatedAt);
        }
      }

      setCloudReady(true);
      setCloudStatus(result.ok ? "ready" : "error");
    };

    restoreCloudDraft();
    return () => {
      cancelled = true;
    };
  }, [assignment, initialDraft.sections, initialDraft.updatedAt, studentProfile, user]);

  const buildSubmissionText = (nextSections = sections) =>
    buildA1WorkbookSubmissionText({
      assignment,
      draft: { assignmentKey: ASSIGNMENT_KEY, sections: nextSections },
    });

  const syncDraftToCloud = async (source = "a1-chapter3-workbook") => {
    if (!user?.uid || !assignment) return { ok: false, reason: "auth" };
    const submissionText = buildSubmissionText();
    if (!submissionText.trim()) return { ok: false, reason: "empty" };
    setCloudStatus("saving");
    const result = await saveA1WorkbookCloudDraft({
      user,
      studentProfile,
      assignment,
      sections,
      submissionText,
      source,
    });
    setCloudStatus(result.ok ? "saved" : "error");
    return result;
  };

  useEffect(() => {
    if (!cloudReady || !user?.uid || !assignment || !hasDraftContent(sections)) return undefined;
    const timer = window.setTimeout(() => {
      syncDraftToCloud("a1-chapter3-react-autosave");
    }, CLOUD_AUTOSAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
    // syncDraftToCloud intentionally uses the current render's sections.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment, cloudReady, sections, studentProfile, user?.uid]);

  const priceProgress = countCompletedA1Answers(sections["teil-1"].answers, priceQuestions.length);
  const familyRecording = sections["teil-2"].recording;
  const familyText = familyRecording?.transcript || "";
  const familyComplete = Boolean(familyText.trim() && /^https:\/\//i.test(familyRecording?.audioUrl || ""));
  const familyWordCount = familyText.trim() ? familyText.trim().split(/\s+/).filter(Boolean).length : 0;
  const grammarProgress = countCompletedA1Answers(sections["teil-3"].answers, 6);
  const workbookComplete = priceProgress.complete && familyComplete && grammarProgress.complete;

  const updateNumberedAnswer = (sectionKey, number, value) => {
    setSections((current) => ({
      ...current,
      [sectionKey]: {
        ...current[sectionKey],
        answers: {
          ...(current[sectionKey]?.answers || {}),
          [number]: value,
        },
      },
    }));
  };

  const updateFamilyRecording = (recording) => {
    setSections((current) => ({
      ...current,
      "teil-2": {
        recording,
        text: recording.transcript,
      },
    }));
  };

  const openSubmit = () => {
    if (!workbookComplete) return;

    // Review should open from the already-saved local draft immediately.
    // Cloud persistence continues in the background instead of blocking the UI.
    if (user?.uid) void syncDraftToCloud("a1-chapter3-open-review-submit");

    const search = new URLSearchParams(location.search || "");
    search.set("workbookTab", "submit");
    search.set("assignmentKey", ASSIGNMENT_KEY);
    search.set("assignmentId", ASSIGNMENT_KEY);
    search.set("level", "A1");
    navigate(
      { pathname: location.pathname, search: `?${search.toString()}` },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level: "A1",
          day: 7,
          chapter: "3",
          assignmentKey: ASSIGNMENT_KEY,
          assignmentId: ASSIGNMENT_KEY,
          canonicalAssignmentKey: ASSIGNMENT_KEY,
          inlineCourseSubmission: true,
        },
      },
    );
  };

  return (
    <A1TutorMarkedWorkbookShell
      fallbackAssignmentKey={ASSIGNMENT_KEY}
      title="A1 · Chapter 3 Workbook · Asking About Prices"
      subtitle="Day 7 · Chapter 3 · Tutor-marked assignment"
      assignmentIntro="Complete all three Teile in the workbook. Falowen saves your work as a draft, but it is not marked until you open Review & Submit and press the final submit button."
      submitTitle="Review & Submit A1 · Chapter 3"
      submitDescription="Review the mapped workbook draft below. It has not been submitted for marking yet. The final Submit Assignment button sends the complete assignment for automatic marking."
    >
      <div
        data-a1-chapter3-draft-guidance="true"
        style={{ ...card, border: "1px solid #fbbf24", background: "#fffbeb" }}
      >
        <strong>Workbook draft — not a submission</strong>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Enter the price answers, record your family description and complete the gern/mögen exercise. They are saved automatically so you do not have to copy them later.
          Your work becomes final only after you open <strong>Review & Submit</strong> and press the final <strong>Submit Assignment</strong> button.
        </p>
      </div>

      <section style={card}>
        <h2 style={sectionTitle}>Teil 1: Preise und Kosten (Exercise 1)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Übung 3: Frage nach dem Preis.</strong> Use the correct pronoun to complete each answer.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {priceQuestions.map((question, index) => {
            const number = index + 1;
            return (
              <label
                key={question.prompt}
                style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, display: "grid", gap: 8 }}
              >
                <strong>{number}. {question.prompt}</strong>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(100px, 180px) 1fr", gap: 8, alignItems: "center" }}>
                  <input
                    type="text"
                    value={sections["teil-1"].answers?.[number] || ""}
                    onChange={(event) => updateNumberedAnswer("teil-1", number, event.target.value)}
                    aria-label={`Teil 1 answer ${number}`}
                    placeholder="Pronomen"
                    style={answerInputStyle}
                    autoComplete="off"
                  />
                  <span>{question.suffix}</span>
                </div>
              </label>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", fontWeight: 800 }}>
          <span>{priceProgress.completed} of {priceProgress.total} answered</span>
          <span>{priceProgress.complete ? "Teil 1 complete" : `${priceProgress.total - priceProgress.completed} remaining`}</span>
        </div>
        <DraftNotice savedAt={savedAt} cloudStatus={cloudStatus} />
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Teil 2: Sprechen über die Familie (Exercise 2)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Sprich über deine Familie.</strong> Record a short description in German. Use the ideas below as support, then save your recording. AI marks the complete assignment after final submission.
        </p>
        <ol style={listSpacing}>
          {familyIdeas.map((item) => <li key={item}>{item}</li>)}
        </ol>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#f9fafb" }}>
          <h3 style={{ ...sectionTitle, marginBottom: 8 }}>Beispiel</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Meine Familie ist klein. Meine Mutter heißt Anna und sie ist Lehrerin. Mein Vater heißt Peter und er ist Ingenieur.
            Ich habe eine Schwester. Wir wohnen in Berlin. Meine Mutter liest gern und mein Vater spielt gern Fußball.
          </p>
        </div>

        <A1FamilyRecording value={familyRecording} onMarked={updateFamilyRecording} />
        <DraftNotice savedAt={savedAt} cloudStatus={cloudStatus} />
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Teil 3: gern oder mögen? (Exercise 3)</h2>
        <p><strong>gern oder mögen? Ergänzen Sie die richtige Form.</strong></p>
        <ol style={listSpacing}>
          {grammarQuestions.map((question, index) => (
            <li key={index} style={{ marginBottom: 16 }}>
              {question.before}{" "}
              {question.slots.map((number, slotIndex) => (
                <React.Fragment key={number}>
                  {slotIndex > 0 ? <> {question.after} </> : null}
                  <select aria-label={`Teil 3 blank ${number}`} value={sections["teil-3"].answers[number] || ""}
                    onChange={event => updateNumberedAnswer("teil-3", number, event.target.value)}
                    style={{ ...answerInputStyle, width: "auto", display: "inline-block" }}>
                    <option value="">________</option>
                    {question.choices.map(choice => <option key={choice} value={choice}>{choice}</option>)}
                  </select>
                </React.Fragment>
              ))}
              {" "}{question.end || question.after} ({question.choices.join(" / ")})
            </li>
          ))}
        </ol>
        <p>{grammarProgress.completed} of 6 blanks completed</p>
        <DraftNotice savedAt={savedAt} cloudStatus={cloudStatus} />
        <div
          data-a1-chapter3-workbook-completion="true"
          style={{
            ...styles.card,
            border: `2px solid ${workbookComplete ? "#22c55e" : "#fbbf24"}`,
            background: workbookComplete ? "#f0fdf4" : "#fffbeb",
            display: "grid",
            gap: 10,
            marginTop: 4,
          }}
        >
          <strong>{workbookComplete ? "Workbook complete" : "Finish the workbook before submitting"}</strong>
          <div style={{ display: "grid", gap: 5 }}>
            <span>Teil 1 · Preise: {priceProgress.complete ? "✓" : `${priceProgress.completed}/${priceProgress.total}`}</span>
            <span>Teil 2 · Familie: {familyComplete ? `✓ ${familyWordCount} words · recording saved` : "Record and save your answer"}</span>
            <span>Teil 3 · gern oder mögen: {grammarProgress.complete ? "✓" : `${grammarProgress.completed}/6`}</span>
          </div>
          <p style={{ margin: 0, lineHeight: 1.6, fontWeight: 800 }}>
            Your answers are saved as a draft. <strong>They have NOT been submitted for marking.</strong>
          </p>
          <button
            type="button"
            onClick={openSubmit}
            style={{ ...styles.primaryButton, width: "fit-content", minHeight: 46 }}
            disabled={!workbookComplete || cloudStatus === "saving"}
          >
            {cloudStatus === "saving" ? "Saving draft…" : "Review & Submit Assignment"}
          </button>
          {!workbookComplete ? (
            <span style={styles.helperText}>Complete every required answer above to unlock Review & Submit.</span>
          ) : null}
        </div>
      </section>
    </A1TutorMarkedWorkbookShell>
  );
};

export default A1Chapter3AskingAboutPricesWorkbookPage;
