import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import AssignmentForm from "./AssignmentForm";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const QUESTIONS = [
  {
    id: "r1",
    prompt: "Wann steht Maria auf?",
  },
  {
    id: "r2",
    prompt: "Wann frühstückt Maria?",
  },
  {
    id: "r3",
    prompt: "Wann kommt Maria nach Hause?",
  },
  {
    id: "r4",
    prompt: "Wann geht Maria ins Bett?",
  },
  {
    id: "p1",
    prompt: "Um wie viel Uhr hat Paul Deutschunterricht?",
  },
  {
    id: "p2",
    prompt: "Wann geht Paul nach Hause?",
  },
  {
    id: "p3",
    prompt: "Wann isst Paul zu Abend?",
  },
  {
    id: "d1",
    prompt: "Welcher Tag ist heute?",
  },
  {
    id: "d2",
    prompt: "Wann hat Peter Fußballtraining?",
  },
  {
    id: "d3",
    prompt: "Was macht Peter am Sonntag?",
  },
  {
    id: "l1",
    prompt: "Hören Text 1: Wann steht Maria auf?",
  },
  {
    id: "l2",
    prompt: "Hören Text 1: Wann frühstückt Maria?",
  },
  {
    id: "l3",
    prompt: "Hören Text 1: Wann kommt Maria nach Hause?",
  },
  {
    id: "l4",
    prompt: "Hören Text 1: Wann geht Maria ins Bett?",
  },
  {
    id: "l5",
    prompt: "Hören Text 1: Was macht Maria nach dem Frühstück?",
  },
  {
    id: "l6",
    prompt: "Hören Text 2: Um wie viel Uhr hat Paul Deutschunterricht?",
  },
  {
    id: "l7",
    prompt: "Hören Text 2: Was macht Paul nach dem Unterricht?",
  },
  {
    id: "l8",
    prompt: "Hören Text 2: Bis wann lernt Paul in der Bibliothek?",
  },
  {
    id: "l9",
    prompt: "Hören Text 2: Wann geht Paul nach Hause?",
  },
  {
    id: "l10",
    prompt: "Hören Text 2: Wann isst Paul zu Abend?",
  },
];

const Day11TwelveHourClockAssignmentPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 11 Assignment: 12-Hour Clock</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Lesen &amp; Hören — Complete the workbook in the form below.</p>
      </div>

      <Section title="Workbook text (read first)">
        <h3 style={{ margin: "6px 0 0" }}>Text 1: 12-Hour Clock</h3>
        <p style={{ margin: 0 }}>
          Es ist sieben Uhr morgens. Maria steht um sieben Uhr auf und macht sich fertig für den Tag. Sie frühstückt um
          acht Uhr mit ihrer Familie. Danach geht sie zur Arbeit. Am Abend um sechs Uhr kommt sie nach Hause und isst
          zu Abend. Um zehn Uhr geht sie ins Bett.
        </p>
        <h3 style={{ margin: "12px 0 0" }}>Text 2: Prepositions of Time</h3>
        <p style={{ margin: 0 }}>
          Paul hat jeden Morgen um neun Uhr Deutschunterricht. Nach dem Unterricht geht er in die Bibliothek und lernt
          dort bis zwei Uhr nachmittags. Nachmittags um drei Uhr geht er nach Hause und macht seine Hausaufgaben. Abends
          um sieben Uhr isst er zu Abend und entspannt sich.
        </p>
        <h3 style={{ margin: "12px 0 0" }}>Text 3: Days of the Week</h3>
        <p style={{ margin: 0 }}>
          Heute ist Montag. Peter hat am Dienstag und Donnerstag Fußballtraining. Am Freitag geht er mit seinen
          Freunden ins Kino. Am Wochenende besucht er seine Großeltern. Am Samstag spielt er oft im Park und am Sonntag
          ruht er sich aus.
        </p>
      </Section>

      <Section title="Listening audio links">
        <p style={{ margin: 0 }}>
          The audio files are available in this chapter. You can also open the links below in your browser.
        </p>
        <BulletList
          items={[
            "Audio 1: https://drive.google.com/file/d/1RZJsjFSwLVDPMMYboyqYcS2kovRtlKtt/view?usp=sharing",
            "Audio 2: https://drive.google.com/file/d/1EQm1zg_8_8VWx0f28klS8XBe738--Iuw/view?usp=sharing",
          ]}
        />
      </Section>

      <AssignmentForm
        title="Assignment Form"
        intro="Answer the reading and listening questions in German. Copy your answers and paste them into the assignment submission page."
        questions={QUESTIONS}
        onOpenSubmission={() => navigate("/campus/submit")}
      />
    </div>
  );
};

export default Day11TwelveHourClockAssignmentPage;
