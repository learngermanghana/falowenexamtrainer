import React from "react";
import A1ProtectedAudioPlayer from "./A1ProtectedAudioPlayer";
import { useA1TutorWorkbookDraft } from "./A1TutorWorkbookDraftContext";

// Keep the question text, option letters and the Admin reference key in sync.
// Audio: a1/day-08/day-08.mp3 in the falowen-course-audio R2 bucket.
export const A1_DAY8_LISTENING_VERSION = "A1-4-LISTENING-V2";
export const A1_DAY8_LISTENING_QUESTIONS = Object.freeze([
  {
    number: 1,
    question: "Woher kommt die Frau?",
    choices: ["Aus Spanien", "Aus Italien", "Aus Deutschland"],
  },
  {
    number: 2,
    question: "Wo wohnt der Mann?",
    choices: ["In Hamburg", "In Berlin", "In Madrid"],
  },
  {
    number: 3,
    question: "Welche Sprachen spricht die Frau?",
    choices: ["Deutsch und Englisch", "Spanisch und ein bisschen Italienisch", "Französisch und Englisch"],
  },
  {
    number: 4,
    question: "Wie oft übt die Frau Deutsch?",
    choices: ["Jeden Tag", "Jede Woche", "Nie"],
  },
  {
    number: 5,
    question: "Was macht die Frau gern in ihrer Freizeit?",
    choices: ["Bücher lesen und spazieren gehen", "Fußball spielen und Musik hören", "Kochen und schwimmen"],
  },
]);

const sectionCard = {
  border: "1px solid #dbeafe",
  borderRadius: 14,
  background: "#ffffff",
  padding: 16,
  display: "grid",
  gap: 12,
};

export default function A1Day8ListeningPractice() {
  const draftContext = useA1TutorWorkbookDraft();
  const answers = draftContext?.draft?.sections?.["teil-3"]?.answers || {};
  const completed = A1_DAY8_LISTENING_QUESTIONS.filter(({ number }) => /^[ABC]$/.test(String(answers[number] || ""))).length;
  const letters = ["A", "B", "C"];

  return (
    <div data-a1-day8-listening={A1_DAY8_LISTENING_VERSION} style={{ display: "grid", gap: 16 }}>
      <div style={{ ...sectionCard, background: "#eff6ff", borderColor: "#bfdbfe" }}>
        <p style={{ margin: 0, color: "#1e3a8a", fontWeight: 800 }}>Hören · Herkunft und Sprachen</p>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          Sie hören ein Gespräch zwischen zwei Freunden. Hören Sie aufmerksam zu und wählen Sie für jede Frage die richtige Antwort: a, b oder c.
        </p>
        <A1ProtectedAudioPlayer
          day={8}
          audioKey="a1/day-08/day-08.mp3"
          fallbackUrl="https://cdn.ng-resource.com/product/resource/notegpt/podcast/2026/10/16/podcast_dbd788fe-3db0-4200-9f87-de135eb6a714-1792176523.mp3"
        />
        <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>Sie können das Gespräch noch einmal hören. Wählen Sie nur eine Antwort pro Frage.</p>
      </div>

      {A1_DAY8_LISTENING_QUESTIONS.map(({ number, question, choices }) => (
        <fieldset key={number} style={{ ...sectionCard, minWidth: 0 }}>
          <legend style={{ fontWeight: 800, padding: "0 6px", color: "#0f172a" }}>{number}. {question}</legend>
          {choices.map((choice, index) => {
            const letter = letters[index];
            const selected = answers[number] === letter;
            return (
              <label key={letter} style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                minHeight: 46,
                padding: "10px 12px",
                borderRadius: 10,
                border: `1px solid ${selected ? "#2563eb" : "#cbd5e1"}`,
                background: selected ? "#eff6ff" : "#ffffff",
                color: "#0f172a",
                cursor: "pointer",
                fontWeight: selected ? 750 : 500,
              }}>
                <input
                  type="radio"
                  name={`a1-day8-listening-${number}`}
                  value={letter}
                  checked={selected}
                  onChange={() => draftContext?.updateAnswer?.("teil-3", number, letter)}
                  aria-label={`Frage ${number}: ${letter}) ${choice}`}
                  style={{ width: 18, height: 18, flexShrink: 0, margin: 0 }}
                />
                <span><strong>{letter.toLowerCase()})</strong> {choice}</span>
              </label>
            );
          })}
        </fieldset>
      ))}
      <div aria-live="polite" style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", color: "#475569", fontSize: 13, fontWeight: 750 }}>
        <span>{completed} von 5 beantwortet</span>
        <span>{draftContext?.saveState === "saving" ? "Antworten werden gespeichert…" : "Antworten als Entwurf gespeichert. Noch nicht abgegeben."}</span>
      </div>
    </div>
  );
}
