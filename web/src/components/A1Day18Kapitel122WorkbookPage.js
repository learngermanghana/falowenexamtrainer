import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import { styles } from "../styles";

const LEVEL = "A1";
const DAY = 18;
const CHAPTER = "12.2";
const FALLBACK_ASSIGNMENT_KEY = "A1-12.2";
const YOUTUBE_VIDEO_ID = "eLLPA6ltEUg";

const card = { ...styles.card, display: "grid", gap: 12 };
const questionCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 9,
  background: "#fff",
};

const trainQuestions = [
  {
    stem: "Wann fährt der Zug von Hamburg nach Berlin ab?",
    options: ["a) Um 8:00 Uhr", "b) Um 9:00 Uhr", "c) Um 10:00 Uhr", "d) Um 11:00 Uhr"],
  },
  {
    stem: "Wann kommt der Zug von Hamburg nach Berlin an?",
    options: ["a) Um 11:00 Uhr", "b) Um 12:00 Uhr", "c) Um 13:00 Uhr", "d) Um 14:00 Uhr"],
  },
  {
    stem: "Wann fährt der Rückzug von Berlin nach Hamburg ab?",
    options: ["a) Um 17:00 Uhr", "b) Um 18:00 Uhr", "c) Um 19:00 Uhr", "d) Um 20:00 Uhr"],
  },
  {
    stem: "Wann kommt der Rückzug von Berlin nach Hamburg an?",
    options: ["a) Um 20:00 Uhr", "b) Um 21:00 Uhr", "c) Um 22:00 Uhr", "d) Um 23:00 Uhr"],
  },
  {
    stem: "Was kann man in dem Bürogeschäft kaufen?",
    options: [
      "a) Schreibtische und Stühle",
      "b) Computer und Drucker",
      "c) Bürobedarf für eine produktive Arbeitsumgebung",
      "d) Alles Genannte",
    ],
  },
];

const listeningQuestions = [
  {
    stem: "Wann fährt Felix' Zug von Hamburg nach Berlin ab?",
    options: ["a) Um 8:00 Uhr", "b) Um 9:00 Uhr", "c) Um 10:00 Uhr", "d) Um 11:00 Uhr"],
  },
  {
    stem: "Wann kommt Felix' Zug in Berlin an?",
    options: ["a) Um 11:00 Uhr", "b) Um 12:00 Uhr", "c) Um 13:00 Uhr", "d) Um 14:00 Uhr"],
  },
  {
    stem: "Welche Objekte stehen auf Felix' Schreibtisch im Büro?",
    options: [
      "a) Ein Computer und ein Drucker",
      "b) Ein Telefon und ein Drucker",
      "c) Ein Computer und ein Telefon",
      "d) Ein Drucker und ein Scanner",
    ],
  },
  {
    stem: "Wo bewahrt Felix wichtige Dokumente auf?",
    options: ["a) In einem Regal", "b) In einer Schublade", "c) In einem Aktenschrank", "d) In einer Tasche"],
  },
  {
    stem: "Wie bezahlt Felix gerne, wenn er Büroartikel kauft?",
    options: ["a) Mit Kreditkarte", "b) Mit Scheck", "c) Bar", "d) Per Überweisung"],
  },
];

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 12 }}>
    {questions.map((question, index) => (
      <div key={question.stem} style={questionCard}>
        <strong>{index + 1}. {question.stem}</strong>
        <div style={{ display: "grid", gap: 7, paddingLeft: 4 }}>
          {question.options.map((option) => (
            <div key={option} style={{ lineHeight: 1.55 }}>{option}</div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const A1Day18Kapitel122WorkbookPage = () => {
  const youtubeViewUrl = `https://youtu.be/${YOUTUBE_VIDEO_ID}`;
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`;

  return (
    <A1TutorMarkedWorkbookShell
      fallbackAssignmentKey="A1-12.2"
      title="A1 · Day 18 Workbook · Kapitel 12.2"
      subtitle="Dative Prepositions · Tutor-marked assignment"
      assignmentIntro="Complete all three Teile. Record your answers in the draft controls, then open Review & Submit to send the complete assignment."
      submitTitle="Review & Submit A1 · Day 18 · Kapitel 12.2"
      submitDescription="Review the mapped Lesen and Hören answers for A1-12.2, make any final edits, then press Submit Assignment."
    >
      <section style={card}>
        <h2 style={{ margin: 0 }}>Teil 1 · Lesen Sie den Aufsatz und schreiben Sie die richtige Antwort</h2>
        <p style={{ margin: 0, color: "#475569" }}>Read the essay and write the correct response.</p>
        <h3 style={{ margin: 0 }}>Ein Tag im Leben eines Arztes</h3>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Felix Meier ist Arzt und wohnt in Berlin mit seiner Frau und seinen drei Kindern. Jeden Morgen fährt er mit seinem Auto zur Arbeit ins Krankenhaus. Er arbeitet dort von 7:30 Uhr bis 17:00 Uhr und hilft gerne Menschen. Felix bezahlt gerne bar, wenn er einkaufen geht.
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {[
            "Wo wohnt Felix?",
            "Mit wem wohnt Felix?",
            "Wie fährt Felix zur Arbeit?",
            "Wann beginnt Felix' Arbeitstag?",
          ].map((question, index) => (
            <div key={question} style={questionCard}>
              <strong>{index + 1}. {question}</strong>
              <span>Schreiben Sie Ihre Antwort in die Abgabe.</span>
            </div>
          ))}
          <div style={questionCard}>
            <strong>5. Wie bezahlt Felix gerne beim Einkaufen?</strong>
            <div style={{ display: "grid", gap: 7, paddingLeft: 4 }}>
              <div>a) Barzahlung (cash)</div>
              <div>b) Kreditkarte (credit card)</div>
            </div>
          </div>
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Teil 2 · Lesen Sie die Anzeigen und beantworten Sie die Fragen</h2>
        <article style={questionCard}>
          <strong>Anzeige 1: Reisen mit der Bahn</strong>
          <h3 style={{ margin: 0 }}>Schnell und bequem mit der Bahn reisen</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Der Zug von Hamburg nach Berlin fährt täglich um 9:00 Uhr ab und kommt um 12:00 Uhr in Berlin an. Der Rückzug von Berlin nach Hamburg fährt um 18:00 Uhr ab und kommt um 21:00 Uhr in Hamburg an.
          </p>
        </article>
        <article style={questionCard}>
          <strong>Anzeige 2: Büroartikel für den Arbeitsplatz</strong>
          <h3 style={{ margin: 0 }}>Alles für Ihr Büro</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In unserem Bürogeschäft finden Sie Schreibtische, Stühle, Computer, Drucker und vieles mehr. Wir haben alles, was Sie für eine produktive Arbeitsumgebung benötigen.
          </p>
        </article>
        <QuestionList questions={trainQuestions} />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Teil 3 · Hören</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Sehen und hören Sie das Video. Wählen Sie danach die richtige Antwort.
        </p>
        <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", background: "#0f172a" }}>
          <iframe
            title="Kapitel 12.2 Hören video"
            src={youtubeEmbedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
        <a
          href={youtubeViewUrl}
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Open video on YouTube
        </a>
        <QuestionList questions={listeningQuestions} />
      </section>
    </A1TutorMarkedWorkbookShell>
  );
};

export default A1Day18Kapitel122WorkbookPage;
