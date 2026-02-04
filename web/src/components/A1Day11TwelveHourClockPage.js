import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const OrderedOptions = ({ items }) => (
  <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
    {items.map((item) => (
      <li key={item.question} style={{ display: "grid", gap: 6 }}>
        <span>{item.question}</span>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
          {item.options.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ul>
      </li>
    ))}
  </ol>
);

const A1Day11TwelveHourClockPage = () => {
  const navigate = useNavigate();
  const [submission, setSubmission] = useState("");

  const readingSections = useMemo(
    () => [
      {
        title: "Topic: 12-Hour Clock",
        description: "Lesen Sie den Text und beantworten Sie die Fragen: Read the text and write the answers in your book.",
        text:
          "Es ist sieben Uhr morgens. Maria steht um sieben Uhr auf und macht sich fertig für den Tag. Sie frühstückt um acht Uhr mit ihrer Familie. Danach geht sie zur Arbeit. Am Abend um sechs Uhr kommt sie nach Hause und isst zu Abend. Um zehn Uhr geht sie ins Bett.",
        questions: [
          {
            question: "1. Wann steht Maria auf?",
            options: ["a) Um sechs Uhr", "b) Um sieben Uhr", "c) Um acht Uhr"],
          },
          {
            question: "2. Wann frühstückt Maria?",
            options: ["a) Um sieben Uhr", "b) Um acht Uhr", "c) Um neun Uhr"],
          },
          {
            question: "3. Wann kommt Maria nach Hause?",
            options: ["a) Um fünf Uhr", "b) Um sechs Uhr", "c) Um sieben Uhr"],
          },
          {
            question: "4. Wann geht Maria ins Bett?",
            options: ["a) Um neun Uhr", "b) Um zehn Uhr", "c) Um elf Uhr"],
          },
        ],
      },
      {
        title: "Topic: Prepositions of Time",
        description: "Lesen Sie den Text und beantworten Sie die Fragen.",
        text:
          "Paul hat jeden Morgen um neun Uhr Deutschunterricht. Nach dem Unterricht geht er in die Bibliothek und lernt dort bis zwei Uhr nachmittags. Nachmittags um drei Uhr geht er nach Hause und macht seine Hausaufgaben. Abends um sieben Uhr isst er zu Abend und entspannt sich.",
        questions: [
          {
            question: "5. Um wie viel Uhr hat Paul Deutschunterricht?",
            options: ["a) Um acht Uhr", "b) Um neun Uhr", "c) Um zehn Uhr"],
          },
          {
            question: "6. Wann geht Paul nach Hause?",
            options: ["a) Morgens", "b) Mittags", "c) Nachmittags"],
          },
          {
            question: "7. Wann isst Paul zu Abend?",
            options: ["a) Um sechs Uhr", "b) Um sieben Uhr", "c) Um acht Uhr"],
          },
        ],
      },
      {
        title: "Topic: Days of the Week",
        description: "Lesen Sie den Text und beantworten Sie die Fragen.",
        text:
          "Heute ist Montag. Peter hat am Dienstag und Donnerstag Fußballtraining. Am Freitag geht er mit seinen Freunden ins Kino. Am Wochenende besucht er seine Großeltern. Am Samstag spielt er oft im Park und am Sonntag ruht er sich aus.",
        questions: [
          {
            question: "8. Welcher Tag ist heute?",
            options: ["a) Montag", "b) Dienstag", "c) Freitag"],
          },
          {
            question: "9. Wann hat Peter Fußballtraining?",
            options: ["a) Am Montag", "b) Am Dienstag und Donnerstag", "c) Am Samstag und Sonntag"],
          },
          {
            question: "10. Was macht Peter am Sonntag?",
            options: ["a) Er spielt im Park.", "b) Er ruht sich aus.", "c) Er geht ins Kino."],
          },
        ],
      },
    ],
    []
  );

  const listeningSections = useMemo(
    () => [
      {
        title: "Text 1: 12-Hour Clock",
        note: "The audio link is shared under this text.",
        link: "https://drive.google.com/file/d/1RZJsjFSwLVDPMMYboyqYcS2kovRtlKtt/view?usp=sharing",
        questions: [
          {
            question: "1. Wann steht Maria auf?",
            options: ["a) Um sechs Uhr", "b) Um sieben Uhr", "c) Um acht Uhr"],
          },
          {
            question: "2. Wann frühstückt Maria?",
            options: ["a) Um sieben Uhr", "b) Um acht Uhr", "c) Um neun Uhr"],
          },
          {
            question: "3. Wann kommt Maria nach Hause?",
            options: ["a) Um fünf Uhr", "b) Um sechs Uhr", "c) Um sieben Uhr"],
          },
          {
            question: "4. Wann geht Maria ins Bett?",
            options: ["a) Um neun Uhr", "b) Um zehn Uhr", "c) Um elf Uhr"],
          },
          {
            question: "5. Was macht Maria nach dem Frühstück?",
            options: ["a) Sie geht zur Arbeit.", "b) Sie geht spazieren.", "c) Sie geht einkaufen."],
          },
        ],
      },
      {
        title: "Text 2: Prepositions of Time",
        note: "Audio link is available below.",
        link: "https://drive.google.com/file/d/1EQm1zg_8_8VWx0f28klS8XBe738--Iuw/view?usp=sharing",
        questions: [
          {
            question: "6. Um wie viel Uhr hat Paul Deutschunterricht?",
            options: ["a) Um acht Uhr", "b) Um neun Uhr", "c) Um zehn Uhr"],
          },
          {
            question: "7. Was macht Paul nach dem Unterricht?",
            options: ["a) Er geht nach Hause.", "b) Er geht in die Bibliothek.", "c) Er geht einkaufen."],
          },
          {
            question: "8. Bis wann lernt Paul in der Bibliothek?",
            options: ["a) Bis ein Uhr nachmittags", "b) Bis zwei Uhr nachmittags", "c) Bis drei Uhr nachmittags"],
          },
          {
            question: "9. Wann geht Paul nach Hause?",
            options: ["a) Um zwei Uhr nachmittags", "b) Um drei Uhr nachmittags", "c) Um vier Uhr nachmittags"],
          },
          {
            question: "10. Wann isst Paul zu Abend?",
            options: ["a) Um sechs Uhr", "b) Um sieben Uhr", "c) Um acht Uhr"],
          },
        ],
      },
    ],
    []
  );

  const vocabularySections = useMemo(
    () => [
      {
        title: "12-Stunden-Uhr",
        items: [
          "Uhr (o'clock)",
          "morgens (in the morning)",
          "mittags (at noon)",
          "nachmittags (in the afternoon)",
          "abends (in the evening)",
          "nachts (at night)",
          "eine Stunde (one hour)",
          "halb (half past)",
          "Viertel nach (quarter past)",
          "Viertel vor (quarter to)",
          "um (at) - z.B., um 8 Uhr (at 8 o'clock)",
          "früh (early)",
          "spät (late)",
        ],
      },
      {
        title: "Präpositionen der Zeit",
        items: [
          "um (at) - z.B., um 9 Uhr (at 9 o'clock)",
          "am (on) - z.B., am Montag (on Monday)",
          "im (in) - z.B., im Juli (in July)",
          "vor (before) - z.B., vor der Schule (before school)",
          "nach (after) - z.B., nach der Arbeit (after work)",
          "von ... bis (from ... to) - z.B., von 8 bis 10 Uhr (from 8 to 10 o'clock)",
          "seit (since/for) - z.B., seit 2010 (since 2010)",
          "ab (from/as of) - z.B., ab morgen (from tomorrow)",
        ],
      },
      {
        title: "Wochentage",
        items: [
          "Montag (Monday)",
          "Dienstag (Tuesday)",
          "Mittwoch (Wednesday)",
          "Donnerstag (Thursday)",
          "Freitag (Friday)",
          "Samstag (Saturday)",
          "Sonntag (Sunday)",
          "Wochentag (weekday)",
          "Wochenende (weekend)",
          "heute (today)",
          "morgen (tomorrow)",
          "übermorgen (the day after tomorrow)",
          "gestern (yesterday)",
          "vorgestern (the day before yesterday)",
        ],
      },
    ],
    []
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = submission.trim();
    if (!trimmed) return;
    const query = new URLSearchParams({ answers: trimmed }).toString();
    window.location.assign(`https://www.falowen.app/campus/submit?${query}`);
  };

  const isSubmitDisabled = !submission.trim();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 Day 11 — 12 Hour Clock</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 7 • 12-Hour Clock assignment</p>
      </div>

      <Section title="Assignment Overview">
        <p style={{ margin: 0 }}>
          <strong>Topic:</strong> 12-Hour Clock, Prepositions of Time, Days of the Week
        </p>
        <p style={{ margin: 0 }}>
          <strong>Goal:</strong> Read and listen to time-related passages, then answer multiple-choice questions.
        </p>
        <p style={{ margin: 0 }}>
          <strong>Assignment:</strong> Teil 1 (Lesen) + Teil 2 (Hören) + Vokabeln review.
        </p>
      </Section>

      <Section title="Teil 1 — Lesen">
        <p style={{ margin: 0 }}>Lesen Sie den Text und beantworten Sie die Fragen.</p>
        <div style={{ display: "grid", gap: 16 }}>
          {readingSections.map((section) => (
            <div key={section.title} style={{ display: "grid", gap: 10, padding: 12, background: "#f8fafc", borderRadius: 12 }}>
              <strong>{section.title}</strong>
              <p style={{ margin: 0 }}>{section.description}</p>
              <p style={{ margin: 0 }}>{section.text}</p>
              <OrderedOptions items={section.questions} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Teil 2 — Hören">
        <p style={{ margin: 0 }}>Hören Sie die Texte und beantworten Sie die Fragen.</p>
        <div style={{ display: "grid", gap: 16 }}>
          {listeningSections.map((section) => (
            <div key={section.title} style={{ display: "grid", gap: 8, padding: 12, background: "#f8fafc", borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <strong>{section.title}</strong>
                <a href={section.link} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 600 }}>
                  Open audio
                </a>
              </div>
              <p style={{ margin: 0 }}>{section.note}</p>
              <OrderedOptions items={section.questions} />
            </div>
          ))}
        </div>
        <p style={{ margin: 0 }}>
          Note: The audio has been uploaded among the files in this chapter or you can also copy the link into your browser to listen.
        </p>
      </Section>

      <Section title="Vokabeln">
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {vocabularySections.map((section) => (
            <div key={section.title} style={{ display: "grid", gap: 6 }}>
              <strong>{section.title}</strong>
              <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Submit your assignment">
        <p style={{ margin: 0 }}>
          Type your answers below. When you click <strong>Submit assignment</strong>, you will be redirected to submit.
        </p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <textarea
            style={{ ...styles.input, minHeight: 160, resize: "vertical", paddingTop: 12 }}
            placeholder="Type your answers here..."
            value={submission}
            onChange={(event) => setSubmission(event.target.value)}
          />
          <button style={styles.primaryButton} type="submit" disabled={isSubmitDisabled}>
            Submit assignment
          </button>
        </form>
      </Section>
    </div>
  );
};

export default A1Day11TwelveHourClockPage;
