import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import { useAuth } from "../context/AuthContext";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
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

const familyIdeas = [
  "Familienmitglieder: Wer gehört zu deiner Familie? (Mutter, Vater, Geschwister, etc.)",
  "Namen und Alter: Wie heißen deine Familienmitglieder und wie alt sind sie?",
  "Berufe: Was machen deine Familienmitglieder beruflich?",
  "Hobbys: Was sind die Hobbys deiner Familienmitglieder?",
  "Wohnort: Wo wohnt deine Familie?",
];

const hobbiesQuestions = [
  "Spielst du gern Fußball?",
  "Schwimmst du gern?",
  "Liest du gern?",
  "Malst du gern?",
  "Hörst du gern Musik?",
  "Kochst du gern?",
  "Reist du gern?",
  "Machst du gern Gartenarbeit?",
  "Fährst du gern Rad?",
  "Wanderst du gern?",
];

const hobbiesVocabulary = [
  "Reading – Lesen",
  "Swimming – Schwimmen",
  "Playing football – Fußballspielen",
  "Painting – Malen",
  "Listening to music – Musik hören",
  "Cooking – Kochen",
  "Traveling – Reisen",
  "Gardening – Gartenarbeit",
  "Cycling – Radfahren",
  "Hiking – Wandern",
];

const usefulPhrases = [
  "Mein Hobby ist ...",
  "Ich ... gern.",
  "Ich mag ...",
  "In meiner Freizeit ...",
  "Nein, ich ... nicht gern.",
];

const normalizeStoredSections = (stored = {}) => ({
  "teil-1": {
    answers: stored?.["teil-1"]?.answers && typeof stored["teil-1"].answers === "object"
      ? stored["teil-1"].answers
      : {},
  },
  "teil-2": {
    text: String(stored?.["teil-2"]?.text || ""),
  },
  "teil-3": {
    answers: stored?.["teil-3"]?.answers && typeof stored["teil-3"].answers === "object"
      ? stored["teil-3"].answers
      : {},
  },
});

const hasDraftContent = (sections = {}) => {
  const part1 = Object.values(sections?.["teil-1"]?.answers || {}).some((value) => String(value || "").trim());
  const part2 = Boolean(String(sections?.["teil-2"]?.text || "").trim());
  const part3 = Object.values(sections?.["teil-3"]?.answers || {}).some((value) => String(value || "").trim());
  return part1 || part2 || part3;
};

const DraftNotice = ({ savedAt = "", cloudStatus = "" }) => (
  <p role="status" aria-live="polite" style={draftNoticeStyle}>
    {cloudStatus === "saving" ? "Saving draft… " : ""}
    Saved to your assignment draft{savedAt ? ` · ${new Date(savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}. <strong>Not submitted to your tutor yet.</strong>
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
  const hobbiesProgress = countCompletedA1Answers(sections["teil-3"].answers, hobbiesQuestions.length);
  const familyText = sections["teil-2"].text;
  const familyComplete = Boolean(familyText.trim());
  const familyWordCount = familyText.trim() ? familyText.trim().split(/\s+/).filter(Boolean).length : 0;
  const workbookComplete = priceProgress.complete && familyComplete && hobbiesProgress.complete;

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

  const updateFamilyText = (value) => {
    setSections((current) => ({
      ...current,
      "teil-2": { ...current["teil-2"], text: value },
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
      assignmentIntro="Answer all three Teile in the workbook. Falowen saves your work as a draft, but your tutor does not receive it until you open Review & Submit and press the final submit button."
      submitTitle="Review & Submit A1 · Chapter 3"
      submitDescription="Review the mapped workbook draft below. It has not been sent to your tutor yet. The final Submit Assignment button sends it for tutor marking."
    >
      <div
        data-a1-chapter3-draft-guidance="true"
        style={{ ...card, border: "1px solid #fbbf24", background: "#fffbeb" }}
      >
        <strong>Workbook draft — not a submission</strong>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Type your answers directly in each Teil. They are saved automatically so you do not have to copy them later.
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
        <h2 style={sectionTitle}>Teil 2: Writing About Family (Exercise 2)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Schreibe über deine Familie.</strong> Write one short connected text. Use the ideas below as support.
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

        <label style={{ display: "grid", gap: 8 }}>
          <strong>Your family text</strong>
          <textarea
            value={familyText}
            onChange={(event) => updateFamilyText(event.target.value)}
            aria-label="A1 Chapter 3 family writing draft"
            placeholder="Meine Familie ..."
            style={{ ...styles.textArea, minHeight: 190 }}
          />
          <span style={styles.helperText}>{familyWordCount} words · {familyComplete ? "Draft saved" : "Write your answer here"}</span>
        </label>
        <DraftNotice savedAt={savedAt} cloudStatus={cloudStatus} />
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Teil 3: Hobbys (Exercise 3)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Answer each question in a complete sentence using <strong>gern</strong>, <strong>nicht gern</strong> or <strong>mögen</strong>.
        </p>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#f9fafb", display: "grid", gap: 6 }}>
          <strong>How to answer</strong>
          <span>Ja, ich spiele gern Fußball.</span>
          <span>Ja, ich mag Fußball.</span>
          <span>Nein, ich spiele nicht gern Fußball.</span>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {hobbiesQuestions.map((question, index) => {
            const number = index + 1;
            return (
              <label
                key={question}
                style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, display: "grid", gap: 8 }}
              >
                <strong>{number}. {question}</strong>
                <input
                  type="text"
                  value={sections["teil-3"].answers?.[number] || ""}
                  onChange={(event) => updateNumberedAnswer("teil-3", number, event.target.value)}
                  aria-label={`Teil 3 answer ${number}`}
                  placeholder="Ihre Antwort ..."
                  style={answerInputStyle}
                  autoComplete="off"
                />
              </label>
            );
          })}
        </div>

        <div style={{ display: "grid", gap: 10, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
          <h3 style={sectionTitle}>Useful vocabulary</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>{hobbiesVocabulary.join(" · ")}</p>
          <h3 style={sectionTitle}>Useful phrases</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>{usefulPhrases.join(" · ")}</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", fontWeight: 800 }}>
          <span>{hobbiesProgress.completed} of {hobbiesProgress.total} answered</span>
          <span>{hobbiesProgress.complete ? "Teil 3 complete" : `${hobbiesProgress.total - hobbiesProgress.completed} remaining`}</span>
        </div>
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
            <span>Teil 2 · Familie: {familyComplete ? `✓ ${familyWordCount} words saved` : "Writing still required"}</span>
            <span>Teil 3 · Hobbys: {hobbiesProgress.complete ? "✓" : `${hobbiesProgress.completed}/${hobbiesProgress.total}`}</span>
          </div>
          <p style={{ margin: 0, lineHeight: 1.6, fontWeight: 800 }}>
            Your answers are saved as a draft. <strong>They have NOT been sent to your tutor.</strong>
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
