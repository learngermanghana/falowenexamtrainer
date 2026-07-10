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

const teil1Questions = [
  { stem: "1. Wann steht Maria auf?", options: ["a) Um sechs Uhr", "b) Um sieben Uhr", "c) Um acht Uhr"] },
  { stem: "2. Wann frühstückt Maria?", options: ["a) Um sieben Uhr", "b) Um acht Uhr", "c) Um neun Uhr"] },
  { stem: "3. Wann kommt Maria nach Hause?", options: ["a) Um fünf Uhr", "b) Um sechs Uhr", "c) Um sieben Uhr"] },
  { stem: "4. Wann geht Maria ins Bett?", options: ["a) Um neun Uhr", "b) Um zehn Uhr", "c) Um elf Uhr"] },
  { stem: "5. Um wie viel Uhr hat Paul Deutschunterricht?", options: ["a) Um acht Uhr", "b) Um neun Uhr", "c) Um zehn Uhr"] },
  { stem: "6. Wann geht Paul nach Hause?", options: ["a) Morgens", "b) Mittags", "c) Nachmittags"] },
  { stem: "7. Wann isst Paul zu Abend?", options: ["a) Um sechs Uhr", "b) Um sieben Uhr", "c) Um acht Uhr"] },
  { stem: "8. Welcher Tag ist heute?", options: ["a) Montag", "b) Dienstag", "c) Freitag"] },
  {
    stem: "9. Wann hat Peter Fußballtraining?",
    options: ["a) Am Montag", "b) Am Dienstag und Donnerstag", "c) Am Samstag und Sonntag"],
  },
  { stem: "10. Was macht Peter am Sonntag?", options: ["a) Er spielt im Park.", "b) Er ruht sich aus.", "c) Er geht ins Kino."] },
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
      submitDescription="This submission box is locked to A1-7, so students can send their final Chapter 7 answers from this workbook."
    >
      <div style={card}>
        <img
          src="https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=1600&q=80"
          alt="Wall clock showing time for a daily routine lesson"
          loading="lazy"
          style={{ width: "100%", borderRadius: 10, maxHeight: 280, objectFit: "cover" }}
        />
        <h2 style={sectionTitle}>Teil 1 (Lesen): 12-Hour Clock, Prepositions of Time, Days of the Week</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Text 1:</strong> "Es ist sieben Uhr morgens. Maria steht um sieben Uhr auf und macht sich fertig für den Tag.
          Sie frühstückt um acht Uhr mit ihrer Familie. Danach geht sie zur Arbeit. Am Abend um sechs Uhr kommt sie
          nach Hause und isst zu Abend. Um zehn Uhr geht sie ins Bett."
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Text 2:</strong> "Paul hat jeden Morgen um neun Uhr Deutschunterricht. Nach dem Unterricht geht er in die
          Bibliothek und lernt dort bis zwei Uhr nachmittags. Nachmittags um drei Uhr geht er nach Hause und macht
          seine Hausaufgaben. Abends um sieben Uhr isst er zu Abend und entspannt sich."
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Text 3:</strong> "Heute ist Montag. Peter hat am Dienstag und Donnerstag Fußballtraining. Am Freitag geht er
          mit seinen Freunden ins Kino. Am Wochenende besucht er seine Großeltern. Am Samstag spielt er oft im Park
          und am Sonntag ruht er sich aus."
        </p>

        {teil1Questions.map((question) => (
          <div key={question.stem} style={questionBlock}>
            <p style={{ margin: 0, fontWeight: 700 }}>{question.stem}</p>
            {question.options.map((option) => (
              <p key={option} style={optionLine}>{option}</p>
            ))}
          </div>
        ))}
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Teil 2 (Hören): Listening Questions</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Hören Sie die Texte und beantworten Sie die Fragen. Nutzen Sie für jeden Text den passenden Audio-Link.
        </p>

        <h3 style={{ ...sectionTitle, fontSize: "1rem" }}>Text 1: 12-Hour Clock</h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Audio-Link: {" "}
          <a href="https://drive.google.com/file/d/1RZJsjFSwLVDPMMYboyqYcS2kovRtlKtt/view?usp=sharing" target="_blank" rel="noreferrer">
            Open Audio 1
          </a>
        </p>
        {teil2Text1Questions.map((question) => (
          <div key={question.stem} style={questionBlock}>
            <p style={{ margin: 0, fontWeight: 700 }}>{question.stem}</p>
            {question.options.map((option) => (
              <p key={option} style={optionLine}>{option}</p>
            ))}
          </div>
        ))}

        <h3 style={{ ...sectionTitle, fontSize: "1rem" }}>Text 2: Prepositions of Time</h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          "Paul hat jeden Morgen um neun Uhr Deutschunterricht. Nach dem Unterricht geht er in die Bibliothek und
          lernt dort bis zwei Uhr nachmittags. Nachmittags um drei Uhr geht er nach Hause und macht seine
          Hausaufgaben. Abends um sieben Uhr isst er zu Abend und entspannt sich."
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Audio-Link: {" "}
          <a href="https://drive.google.com/file/d/1EQm1zg_8_8VWx0f28klS8XBe738--Iuw/view?usp=sharing" target="_blank" rel="noreferrer">
            Open Audio 2
          </a>
        </p>
        {teil2Text2Questions.map((question) => (
          <div key={question.stem} style={questionBlock}>
            <p style={{ margin: 0, fontWeight: 700 }}>{question.stem}</p>
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
