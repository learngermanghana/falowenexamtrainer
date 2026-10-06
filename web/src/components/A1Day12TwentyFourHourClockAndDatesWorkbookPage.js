import React, { useState } from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import { useAuth } from "../context/AuthContext";
import { fetchA1AudioPlaybackUrl } from "../services/a1AudioService";
import { styles } from "../styles";

const GRAMMAR_ROUTE = "/campus/course/a1-day-12-the-24-hour-clock-and-dates";
const DAY12_AUDIO_KEY = "a1/day-12/day-12.mp3";

const pageGrid = {
  display: "grid",
  gap: 16,
  minHeight: 1,
  width: "100%",
};

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
  marginBottom: 0,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const paragraph = {
  margin: 0,
  lineHeight: 1.7,
};

const questionBlock = {
  display: "grid",
  gap: 7,
  padding: "12px 14px",
  border: "1px solid #dbeafe",
  borderRadius: 12,
  background: "#ffffff",
};

const instructionBox = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  color: "#1e3a8a",
  lineHeight: 1.65,
  padding: "12px 14px",
};

const teil1Questions = [
  { stem: "1. Um wie viel Uhr beginnt die Schiffsfahrt am 10. Oktober?", options: ["a) Um 08:00 Uhr", "b) Um 14:00 Uhr", "c) Um 20:00 Uhr"] },
  { stem: "2. Wann treffen sie sich vor dem Restaurant?", options: ["a) Um 14:00 Uhr", "b) Um 18:30 Uhr", "c) Um 20:00 Uhr"] },
  { stem: "3. Um wie viel Uhr fängt das Konzert an?", options: ["a) Um 14:00 Uhr", "b) Um 18:30 Uhr", "c) Um 20:00 Uhr"] },
  { stem: "4. An welchem Datum fliegt Thomas zurück?", options: ["a) Am 10. Oktober", "b) Am 12. Oktober", "c) Am 20. Oktober"] },
  { stem: "5. Wann ist der Flug am 12. Oktober?", options: ["a) Um 08:00 Uhr morgens", "b) Um 14:00 Uhr nachmittags", "c) Um 20:00 Uhr abends"] },
];

const horenQuestions = [
  { stem: "1. Der Zug nach Berlin fährt am Freitag ab.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "2. Der Zug kommt um neunzehn Uhr zwanzig in Berlin an.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "3. Es ist jetzt vierzehn Uhr zehn.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "4. Wann fährt der Zug nach Berlin ab?", options: ["a) Am 12. Mai um 14:45 Uhr.", "b) Am 14. Mai um 18:30 Uhr.", "c) Am 12. Mai um 19:20 Uhr."] },
  { stem: "5. Wann fährt Anna zurück?", options: ["a) Am Freitag, den 12. Mai.", "b) Am Sonntag, den 14. Mai, um 18:30 Uhr.", "c) Am Sonntag, den 14. Mai, um 13:10 Uhr."] },
];

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question) => (
      <div key={question.stem} style={questionBlock}>
        <p style={{ ...paragraph, fontWeight: 800 }}>{question.stem}</p>
        {question.options.map((option) => (
          <p key={option} style={paragraph}>{option}</p>
        ))}
      </div>
    ))}
  </div>
);

export default function A1Day12TwentyFourHourClockAndDatesWorkbookPage() {
  const { idToken } = useAuth();
  const [showScript, setShowScript] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioError, setAudioError] = useState("");
  const [loadingAudio, setLoadingAudio] = useState(false);

  const loadAudio = async () => {
    if (audioUrl || loadingAudio) return;
    setLoadingAudio(true);
    setAudioError("");
    try {
      const playback = await fetchA1AudioPlaybackUrl({
        day: 12,
        key: DAY12_AUDIO_KEY,
        idToken,
      });
      setAudioUrl(playback.url);
    } catch (error) {
      setAudioError(error?.response?.data?.error || error?.message || "Audio could not be loaded.");
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <A1TutorMarkedWorkbookShell
      day={12}
      chapter="8"
      fallbackAssignmentKey="A1-8"
      title="A1 · Day 12 Workbook · The 24-Hour Clock and Dates"
      subtitle="Chapter 8 · Tutor-marked assignment"
      assignmentIntro="Complete the five Lesen questions and five Hören questions. The listening script is optional support and can be opened only when needed."
      submitTitle="Submit A1 · Day 12 · Chapter 8"
    >
      <div data-a1-day12-workbook-content="true" style={pageGrid}>
        <section style={{ ...card, border: "1px solid #93c5fd", background: "linear-gradient(135deg, #eff6ff, #ffffff)" }}>
          <p style={{ margin: 0, color: "#1d4ed8", fontSize: 12, fontWeight: 900, letterSpacing: ".05em", textTransform: "uppercase" }}>
            Workbook content
          </p>
          <h2 style={sectionTitle}>Start here</h2>
          <p style={paragraph}>
            This assignment has two graded parts: Lesen and Hören. Complete five questions in each part, then submit your numbered answers.
          </p>
          <a href={GRAMMAR_ROUTE} style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}>
            Review the grammar notes first
          </a>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>Teil 1: Lesen · Nachricht von Thomas</h2>
          <div style={instructionBox}>
            Wähle bei jeder Aufgabe die richtige Lösung <strong>a</strong>, <strong>b</strong> oder <strong>c</strong>.
          </div>
          <p style={paragraph}>
            <strong>Hallo Maria!</strong> Ich bin in Hamburg. Mein Urlaub ist vom <strong>10. Oktober</strong> bis zum <strong>12. Oktober</strong>.
            Heute ist der <strong>10. Oktober</strong>: Die Schiffsfahrt im Hafen beginnt um <strong>14:00 Uhr</strong>.
            Wir treffen uns um <strong>18:30 Uhr</strong> vor dem Restaurant. Das Konzert in der Elbphilharmonie fängt um <strong>20:00 Uhr</strong> an.
            Mein Flug zurück geht am <strong>12. Oktober</strong> um <strong>08:00 Uhr</strong> morgens.
          </p>
          <QuestionList questions={teil1Questions} />
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>Teil 2: Hören · Zug nach Berlin</h2>
          <div style={instructionBox}>
            Aufgaben 1–3: Richtig oder falsch? Aufgaben 4–5: Wählen Sie die richtige Antwort.
          </div>

          <div style={{ ...questionBlock, background: "#f8fafc" }}>
            {!audioUrl ? (
              <button
                type="button"
                onClick={loadAudio}
                disabled={loadingAudio}
                style={{ ...styles.secondaryButton, width: "fit-content" }}
              >
                {loadingAudio ? "Audio wird geladen …" : "Hören starten"}
              </button>
            ) : (
              <audio controls preload="metadata" src={audioUrl} style={{ width: "100%" }}>
                Ihr Browser unterstützt dieses Audio nicht.
              </audio>
            )}
            {audioError ? <p style={{ margin: 0, color: "#b91c1c" }}>{audioError}</p> : null}
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <button
              type="button"
              onClick={() => setShowScript((current) => !current)}
              style={{ ...styles.secondaryButton, width: "fit-content" }}
              aria-expanded={showScript}
            >
              {showScript ? "Script ausblenden" : "Script optional anzeigen"}
            </button>
            <p style={{ margin: 0, color: "#64748b" }}>
              The script contains new travel vocabulary. Use it only if you need extra support after listening.
            </p>
          </div>

          {showScript ? (
            <div style={{ ...questionBlock, background: "#f8fafc" }}>
              <p style={paragraph}><strong>Anna:</strong> Entschuldigung, wann fährt der Zug nach Berlin ab?</p>
              <p style={paragraph}><strong>Tom:</strong> Guten Tag! Der Zug fährt am Freitag, den zwölften Mai, um vierzehn Uhr fünfundvierzig ab.</p>
              <p style={paragraph}><strong>Anna:</strong> Und wann kommt der Zug in Berlin an?</p>
              <p style={paragraph}><strong>Tom:</strong> Er kommt um neunzehn Uhr zwanzig an.</p>
              <p style={paragraph}><strong>Anna:</strong> Danke! Und wie spät ist es jetzt?</p>
              <p style={paragraph}><strong>Tom:</strong> Jetzt ist es dreizehn Uhr zehn.</p>
              <p style={paragraph}><strong>Anna:</strong> Ich möchte auch zurückfahren. Geht ein Zug am Sonntag, den vierzehnten Mai?</p>
              <p style={paragraph}><strong>Tom:</strong> Ja, am Sonntag fährt ein Zug um achtzehn Uhr dreißig ab.</p>
              <p style={paragraph}><strong>Anna:</strong> Super, vielen Dank! Auf Wiedersehen!</p>
              <p style={paragraph}><strong>Tom:</strong> Gern geschehen. Auf Wiedersehen!</p>
            </div>
          ) : null}

          <QuestionList questions={horenQuestions} />

          <div style={{ ...questionBlock, background: "#f8fafc" }}>
            <p style={{ margin: 0 }}><strong>Zusatzaufgabe · nicht benotet</strong></p>
            <p style={{ margin: 0 }}>
              Schreiben Sie die Uhrzeit im 12-Stunden-Format: „vierzehn Uhr fünfundvierzig“ = <strong>Viertel vor drei (nachmittags)</strong>.
            </p>
          </div>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>Vocabulary reminder</h2>
          <p style={paragraph}>
            Time: vierzehn Uhr fünfundvierzig, neunzehn Uhr zwanzig, dreizehn Uhr zehn, achtzehn Uhr dreißig.
          </p>
          <p style={paragraph}>
            Dates and days: Freitag, Sonntag, der zwölfte Mai, der vierzehnte Mai.
          </p>
          <p style={paragraph}>
            Trennbare Verben: <strong>abfahren</strong>, <strong>ankommen</strong>, <strong>zurückfahren</strong>.
          </p>
        </section>
      </div>
    </A1TutorMarkedWorkbookShell>
  );
}
