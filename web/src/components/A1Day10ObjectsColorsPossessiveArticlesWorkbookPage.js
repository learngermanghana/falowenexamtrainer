import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import A1ProtectedAudioPlayer from "./A1ProtectedAudioPlayer";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const questionStyle = { padding: "12px", border: "1px solid #e2e8f0", borderRadius: 10, display: "grid", gap: 7 };
const lesen = [
  { statement: "Das Fahrrad ist schwarz.", answer: "Falsch" },
  { statement: "Das Fahrrad kostet 45 Euro.", answer: "Richtig" },
  { statement: "Claudias Buch ist rot.", answer: "Richtig" },
  { statement: "Die Brille liegt auf einem braunen Stuhl.", answer: "Falsch" },
  { statement: "Der Schlüssel im Fundbüro ist gelb.", answer: "Richtig" },
];
const hoeren = [
  { question: "Welche Farbe hat Arias Lampe?", options: ["a) Grau", "b) Weiß", "c) Blau"] },
  { question: "Was gehört Marcus?", options: ["a) Ein grauer Stuhl", "b) Eine rote Tasche", "c) Eine weiße Lampe"] },
  { question: "Welche Farbe hat Arias Schal?", options: ["a) Blau", "b) Grün", "c) Rot"] },
  { question: "Was trinkt Aria meistens aus ihrer Tasse?", options: ["a) Tee", "b) Kaffee", "c) Wasser"] },
  { question: "Welche Farbe hat Marcus' Notizbuch?", options: ["a) Gelb", "b) Schwarz", "c) Grün"] },
];

// Cloudflare R2 private object name must match the uploaded MP3 exactly.
// Set the verified key in the deployment configuration before enabling playback.
const hoerenAudioKey = "a1/day-10/day-10.mp3";

export default function A1Day10ObjectsColorsPossessiveArticlesWorkbookPage() {
  return (
    <A1TutorMarkedWorkbookShell
      day={10}
      chapter="6"
      fallbackAssignmentKey="A1-6"
      title="A1 · Day 10 · Gegenstände, Farben und Possessivartikel"
      subtitle="Kapitel 6 · Grammar focus · Lesen & Hören"
      submitTitle="Submit A1 · Day 10 · Chapter 6"
      submitDescription="Complete all five reading and five listening answers, then review and submit."
    >
      <section style={card}>
        <h2>Teil 1 · Lesen: Gegenstände und Farben</h2>
        <p>Lesen Sie die drei kurzen Texte und die Aufgaben 1–5. Ist die Aussage richtig oder falsch?</p>
        <article style={questionStyle}>
          <h3 style={{ margin: 0 }}>Text 1: Zettel am Schwarzen Brett</h3>
          <p style={{ margin: 0 }}><strong>Verkaufe Fahrrad!</strong> Ich verkaufe mein altes Fahrrad. Es ist <strong>grün</strong> und hat einen <strong>schwarzen Korb</strong>. Es funktioniert sehr gut.</p>
          <p style={{ margin: 0 }}><strong>Preis:</strong> 45 Euro · <strong>Telefon:</strong> 0176-443322 (ab 18 Uhr)</p>
        </article>
        <article style={questionStyle}>
          <h3 style={{ margin: 0 }}>Text 2: E-Mail von Claudia</h3>
          <p style={{ margin: 0 }}>Hallo Stefan,</p>
          <p style={{ margin: 0 }}>ich suche meine Brille! Sie liegt auf dem <strong>braunen Tisch</strong> im Wohnzimmer. Neben der Brille liegt auch <strong>mein rotes Buch</strong>. Kannst du mir die Brille heute Abend mitbringen?</p>
          <p style={{ margin: 0 }}>Vielen Dank!<br />Claudia</p>
        </article>
        <article style={questionStyle}>
          <h3 style={{ margin: 0 }}>Text 3: Aushang im Sprachinstitut</h3>
          <p style={{ margin: 0 }}><strong>Gefunden im Büro (Raum 12):</strong> Wir haben eine <strong>blau-weiße Tasche</strong> gefunden. In der Tasche liegen ein kleiner Regenschirm und ein <strong>gelber Schlüssel</strong>. Abholung: Montag bis Freitag von 9 bis 12 Uhr.</p>
        </article>
        <h3>Aufgaben 1–5: Richtig oder Falsch?</h3>
        {lesen.map((item, index) => (
          <div key={item.statement} style={questionStyle}>
            <strong>{index + 1}. {item.statement}</strong>
            <p style={{ margin: 0, color: "#475569" }}>Wählen Sie Richtig oder Falsch in der Antwortkarte unten.</p>
          </div>
        ))}
      </section>
      <section style={card}>
        <h2>Teil 2 · Hören: Aria und Marcus</h2>
        <p>Hören Sie das Gespräch über Gegenstände und Farben. Wählen Sie a, b oder c. Sie können das Gespräch noch einmal hören.</p>
        {hoerenAudioKey ? (
          <A1ProtectedAudioPlayer day={10} audioKey={hoerenAudioKey} />
        ) : (
          <p role="status" style={{ padding: 12, background: "#fff7ed", borderRadius: 10 }}>
            Die Audioaufnahme wird eingerichtet. Bitte fragen Sie Ihre Lehrkraft, wenn sie noch nicht verfügbar ist.
          </p>
        )}
        {hoeren.map((item, index) => (
          <div key={item.question} style={questionStyle}>
            <strong>{index + 1}. {item.question}</strong>
            {item.options.map((option) => <p key={option} style={{ margin: 0 }}>{option}</p>)}
          </div>
        ))}
      </section>
    </A1TutorMarkedWorkbookShell>
  );
}
