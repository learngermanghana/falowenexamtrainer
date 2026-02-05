import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

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

const Callout = ({ children }) => (
  <div
    style={{
      background: "#f0f9ff",
      borderLeft: "4px solid #38bdf8",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      display: "grid",
      gap: 6,
    }}
  >
    {children}
  </div>
);

const CourseStructurePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Course book structure & what to expect</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          A quick guide to how each study day is organised so you can plan your learning time.
        </p>
      </div>

      <Section title="How the course book is structured">
        <BulletList
          items={[
            "Each day is a focused study session with a topic, goal, and specific resources.",
            "Most days include Lesen & Hören resources, plus optional Schreiben & Sprechen tasks.",
            "Assignments are flagged so you know what to submit to your tutor.",
            "Use the course level picker to see the plan for your current class.",
          ]}
        />
      </Section>

      <Section title="What to expect each day">
        <BulletList
          items={[
            "Open the day card, read the goal, and follow the instruction note.",
            "Complete the video + workbook items first, then finish any assignments.",
            "Use the search bar to jump to a day, topic, or grammar point quickly.",
          ]}
        />
        <Callout>
          <strong>Tip:</strong> If you finish early, review yesterday's homework and keep a short list of new words.
        </Callout>
      </Section>

      <Section title="Where to get help">
        <BulletList
          items={[
            "Ask your tutor for feedback on assignments or speaking practice.",
            "Use Chat • Grammar • Exams for extra explanations and exam-style prompts.",
            "Check the Exams Room when you want mock exam practice.",
          ]}
        />
      </Section>
    </div>
  );
};

export default CourseStructurePage;
