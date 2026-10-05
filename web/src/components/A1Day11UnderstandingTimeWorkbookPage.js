import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";

import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const questionBlock = {
  display: "grid",
  gap: 6,
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#fff",
};

const optionLine = {
  margin: 0,
  paddingLeft: 12,
  lineHeight: 1.7,
};

const videoWrapper = {
  position: "relative",
  width: "100%",
  paddingTop: "56.25%",
  overflow: "hidden",
  borderRadius: 12,
  background: "#000",
};

const videoFrame = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: 0,
};

const teil1Questions = [
  { stem: "1. Wann steht Maria jeden Morgen auf?", options: ["a) Um Viertel nach sechs", "b) Um Viertel vor sieben", "c) Um halb sieben"] },
  { stem: "2. Wann frühstückt Maria?", options: ["a) Um Viertel nach sieben", "b) Um halb acht", "c) Um halb neun"] },
  { stem: "3. Wann geht Maria zur Arbeit?", options: ["a) Um Viertel vor acht", "b) Um halb neun", "c) Um Viertel nach acht"] },
  {
    stem: "4. An welchen Tagen hat Maria Deutschunterricht?",
    options: ["a) Am Montag und Mittwoch", "b) Am Dienstag und Donnerstag", "c) Am Dienstag und Freitag"],
  },
  { stem: "5. Wann ist der Deutschunterricht zu Ende?", options: ["a) Um Viertel vor sieben", "b) Um Viertel nach sechs", "c) Um halb sieben"] },
  { stem: "6. Wann geht Maria am Freitag ins Kino?", options: ["a) Um Viertel vor sieben", "b) Um halb acht", "c) Um Viertel nach sieben"] },
  { stem: "7. Wann steht Maria am Samstag auf?", options: ["a) Um Viertel nach neun", "b) Um halb zehn", "c) Um Viertel vor zehn"] },
];

const teil2Text1Questions = [
  { stem: "1. Wann steht Maria auf?", options: ["a) Um sechs Uhr", "b) Um sieben Uhr", "c) Um acht Uhr"] },
  { stem: "2. Wann frühstückt Maria?", options: ["a) Um sieben Uhr", "b) Um acht Uhr", "c) Um neun Uhr"] },
  { stem: "3. Wann kommt Maria nach Hause?", options: ["a) Um fünf Uhr", "b) Um sechs Uhr", "c) Um sieben Uhr"] },
  { stem: "4. Wann geht Maria ins Bett?", options: ["a) Um neun Uhr", "b) Um zehn Uhr", "c) Um elf Uhr"] },
  {
    stem: "5. Was macht Maria nach dem Frühstück?",
    options: ["a) Sie geht zur Arbeit.", "b) Sie geht spazieren.", "c) Sie geht einkaufen."],
  },
];

const teil2Text2Questions = [
  { stem: "6. Um wie viel Uhr hat Paul Deutschunterricht?", options: ["a) Um acht Uhr", "b) Um neun Uhr", "c) Um zehn Uhr"] },
  {
    stem: "7. Was macht Paul nach dem Unterricht?",
    options: ["a) Er geht nach Hause.", "b) Er geht in die Bibliothek.", "c) Er geht einkaufen."],
  },
  {
    stem: "8. Bis wann lernt Paul in der Bibliothek?",
    options: ["a) Bis ein Uhr nachmittags", "b) Bis zwei Uhr nachmittags", "c) Bis drei Uhr nachmittags"],
  },
  {
    stem: "9. Wann geht Paul nach Hause?",
    options: ["a) Um zwei Uhr nachmittags", "b) Um drei Uhr nachmittags", "c) Um vier Uhr nachmittags"],
  },
  { stem: "10. Wann isst Paul zu Abend?", options: ["a) Um sechs Uhr", "b) Um sieben Uhr", "c) Um acht Uhr"] },
];

const A1Day11UnderstandingTimeWorkbookPage = () => {
  return (
    <A1TutorMarkedWorkbookShell
      day={11}
      chapter="7"
      fallbackAssignmentKey="A1-7"
      title="A1 · Day 11 Workbook · Understanding Time"
      subtitle="Chapter 7 · Tutor-marked assignment"
      submitTitle="Submit A1 · Day 11 · Chapter 7"
      submitDescription="Submit your completed Chapter 7 answers here when both Teile are finished."
    >
      <div style={card}>
        <img
          src="https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=1600&q=80"
          alt="Wall clock showing time for a daily routine lesson"
          loading="lazy"
          style={{ width: "100%", borderRadius: 10, maxHeight: 280, objectFit: "cover" }}
        />
        <h2 style={sectionTitle}>Teil 1 (Lesen): Die Uhrzeit (12-Stunden-Uhr), Präpositionen der Zeit, Wochentage</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>A1 · Anspruchsvollere Version · 7 Fragen. Lesen Sie den Text und wählen Sie a, b oder c.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Text:</strong> Heute ist Montag. Maria steht jeden Morgen um Viertel vor sieben auf. Um halb acht
          frühstückt sie mit ihrer Familie. Um Viertel nach acht geht sie zur Arbeit. Am Dienstag und Donnerstag
          hat sie Deutschunterricht. Der Unterricht beginnt um halb sechs und ist um Viertel vor sieben zu Ende.
          Am Freitag geht sie um Viertel nach sieben mit ihren Freunden ins Kino. Der Film beginnt um halb acht.
          Am Samstag schläft sie lange und steht erst um Viertel nach neun auf.
        </p>

        {teil1Questions.map((question) => (
          <div key={question.stem} style={questionBlock}>
            <p style={{ margin: 0 }}><strong>{question.stem}</strong></p>
            {question.options.map((option) => (
              <p key={option} style={optionLine}>{option}</p>
            ))}
          </div>
        ))}
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Teil 2 (Hören): Listening Questions</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Sehen und hören Sie das Video. Beantworten Sie die 10 Fragen: Text 1 (Fragen 1–5) und Text 2 (Fragen 6–10).
        </p>

        <div style={videoWrapper}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/W0tEZWxndLo"
            title="A1 Day 11 Hören – Understanding Time"
            style={videoFrame}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <h3 style={{ ...sectionTitle, fontSize: "1rem" }}>Text 1: 12-Hour Clock</h3>
        {teil2Text1Questions.map((question) => (
          <div key={question.stem} style={questionBlock}>
            <p style={{ margin: 0 }}><strong>{question.stem}</strong></p>
            {question.options.map((option) => (
              <p key={option} style={optionLine}>{option}</p>
            ))}
          </div>
        ))}

        <h3 style={{ ...sectionTitle, fontSize: "1rem" }}>Text 2: Prepositions of Time</h3>
        {teil2Text2Questions.map((question) => (
          <div key={question.stem} style={questionBlock}>
            <p style={{ margin: 0 }}><strong>{question.stem}</strong></p>
            {question.options.map((option) => (
              <p key={option} style={optionLine}>{option}</p>
            ))}
          </div>
        ))}
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Vokabeln</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>12-Stunden-Uhr:</strong> Uhr, morgens, mittags, nachmittags, abends, nachts, eine Stunde, halb, Viertel nach, Viertel vor, um, früh, spät.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Präpositionen der Zeit:</strong> um, am, im, vor, nach, von ... bis, seit, ab.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Wochentage:</strong> Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag, Wochentag, Wochenende, heute, morgen, übermorgen, gestern, vorgestern.</p>
      </div>
    </A1TutorMarkedWorkbookShell>
  );
};

export default A1Day11UnderstandingTimeWorkbookPage;
