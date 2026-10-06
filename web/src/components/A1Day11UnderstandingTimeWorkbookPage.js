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
  { stem: "1. Wie lange bleibt Thomas in Hamburg?", options: ["a) Einen Tag", "b) Zwei Tage", "c) Eine Woche"] },
  { stem: "2. Wie lange geht Thomas zu Fuß zum Schiff?", options: ["a) 10 Minuten", "b) Eine Stunde", "c) 20 Minuten"] },
  { stem: "3. Wie lange dauert die Fahrt mit dem Schiff?", options: ["a) 10 Minuten", "b) Eine Stunde", "c) Zwei Tage"] },
  { stem: "4. Wann beginnt das Konzert?", options: ["a) Um 10 Uhr", "b) Um 12 Uhr", "c) Um 20 Uhr"] },
  { stem: "5. Wie lange dauert der Besuch im Museum?", options: ["a) 10 Minuten", "b) Zwei Stunden", "c) Den ganzen Tag"] },
];

const teil2Questions = [
  { stem: "1. Es ist Viertel nach drei.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "2. Der Deutschkurs fängt um fünf Uhr an.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "3. Anna steht um halb sieben auf.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "4. Wann macht der Supermarkt zu?", options: ["a) Um vier Uhr.", "b) Um sechs Uhr.", "c) Um acht Uhr."] },
  { stem: "5. Wann ruft Tom Anna an, und was macht er dann?", options: ["a) Um Viertel vor sechs, er holt Anna ab.", "b) Um halb sieben, er kauft ein.", "c) Um acht Uhr, er sieht fern."] },
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
        <h2 style={sectionTitle}>Teil 1 (Lesen): Thomas in Hamburg</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Goethe A1.1 · 5 einfache Fragen. Lesen Sie den Text und wählen Sie a, b oder c.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Text:</strong> Hallo! Ich bin Thomas. Ich bin in Hamburg. Ich bleibe <strong>zwei Tage</strong>.
          Ich gehe <strong>10 Minuten</strong> zu Fuß zum Schiff. Die Fahrt mit dem Schiff dauert <strong>eine Stunde</strong>.
          Heute Abend gehe ich in ein Konzert. Das Konzert beginnt <strong>um 20 Uhr</strong>. Ich esse Fisch im Restaurant
          <em> Seeblick</em>. Morgen gehe ich in ein Museum. Der Besuch dauert <strong>zwei Stunden</strong>.
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
          Sehen und hören Sie das Video. Beantworten Sie die fünf Fragen. Aufgaben 1–3: Richtig oder falsch? Aufgaben 4–5: Wählen Sie die richtige Antwort.
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

        {teil2Questions.map((question) => (
          <div key={question.stem} style={questionBlock}>
            <p style={{ margin: 0 }}><strong>{question.stem}</strong></p>
            {question.options.map((option) => (
              <p key={option} style={optionLine}>{option}</p>
            ))}
          </div>
        ))}

        <div style={{ ...questionBlock, background: "#f8fafc" }}>
          <p style={{ margin: 0 }}><strong>Zusatzaufgabe · trennbare Verben</strong></p>
          <p style={{ margin: 0 }}>Ergänzen Sie: „Ich ___ um sieben Uhr ___ (aufstehen).“</p>
          <p style={{ margin: 0, color: "#64748b" }}>Diese Zusatzaufgabe ist Übung und gehört nicht zu den fünf benoteten Hören-Fragen.</p>
        </div>
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
