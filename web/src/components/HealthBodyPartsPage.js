import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
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

const HealthBodyPartsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 22: Health and Body Parts</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 14.1</p>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Learn vocabulary for health and body parts, then use it in a short appointment-cancellation letter.
        </p>
      </div>

      <Section title="Part 1: Health and Body Parts Vocabulary">
        <BulletList
          items={[
            "der Kopf (head)",
            "der Bauch (stomach)",
            "der Rücken (back)",
            "der Hals (throat)",
            "der Arm / die Hand (arm / hand)",
            "das Bein / der Fuß (leg / foot)",
            "Ich habe Kopfschmerzen. (I have a headache.)",
            "Mir ist schlecht. (I feel sick.)",
          ]}
        />
      </Section>

      <Section title="Part 2: Cancel an Appointment (Termin absagen)">
        <p style={{ margin: 0 }}>
          Use a health reason when writing your message. Core sentence:
          <strong> Ich möchte den Termin absagen.</strong>
        </p>
        <div style={{ background: "#f7f8fb", borderRadius: 10, padding: 12 }}>
          <strong>Example (formal):</strong>
          <p style={{ margin: "8px 0 0" }}>
            Sehr geehrte Damen und Herren, <br />
            ich möchte den Termin am Montag absagen, weil ich krank bin und starke Kopfschmerzen habe. <br />
            Mit freundlichen Grüßen
          </p>
        </div>
      </Section>

      <Section title="Part 3: Request a New Appointment">
        <p style={{ margin: 0 }}>After cancelling, politely ask for a new date:</p>
        <BulletList
          items={[
            "Könnten wir bitte einen neuen Termin vereinbaren?",
            "Haben Sie am Donnerstag einen freien Termin?",
            "Ich kann nächste Woche am Dienstag oder Freitag.",
          ]}
        />
      </Section>
    </div>
  );
};

export default HealthBodyPartsPage;
