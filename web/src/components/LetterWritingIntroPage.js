import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <div style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </div>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const LetterWritingIntroPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Introduction to Letter Writing 12.3</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Use this guide to structure your formal and informal letters before submitting your assignment.
        </p>
      </div>

      <Section title="Formal Letter Structure">
        <BulletList
          items={[
            "Sehr geehrte Frau + Name – use this for female.",
            "Sehr geehrter Herr + Name – use this for male.",
            "Sehr geehrte Damen und Herren – use this when the receiver is unknown (e.g., school or travel agency).",
          ]}
        />
        <p style={{ margin: 0 }}>
          <strong>Opening line:</strong> Ich hoffe, es geht Ihnen gut. Ich schreibe Ihnen, weil [reason for writing]. When
          using <em>weil</em>, move the verb or modal verb to the end.
        </p>
        <BulletList
          items={[
            "Example 1: Ich kann nicht kommen... Ich schreibe Ihnen, weil ich nicht kommen kann.",
            "Example 2: Ich komme nicht... Ich schreibe Ihnen, weil ich nicht komme.",
            'Tip: Start with "Ich" and end with "möchte" because of "weil". Example: Ich schreibe Ihnen, weil ich den Termin absagen möchte.',
          ]}
        />
        <p style={{ margin: 0 }}>
          <strong>Main body:</strong> Use the conjunctions <em>Ich möchte wissen, ob</em>, <em>deshalb</em>, and{" "}
          <em>weil</em>. Keep sentences clear and well-structured.
        </p>
        <p style={{ margin: 0 }}>
          <strong>Conclusion:</strong> Ich freue mich im Voraus auf Ihre Antwort. (Do not change.) Mit freundlichen
          Grüßen, <strong>[Your Full Name]</strong>.
        </p>
      </Section>

      <Section title="Informal Letter Structure">
        <BulletList
          items={[
            "Hallo [use this for both male and female],",
            "Liebe (Female) / Lieber (Male) [Recipient’s First Name],",
          ]}
        />
        <p style={{ margin: 0 }}>
          <strong>Opening line:</strong> Wie geht es dir? Ich hoffe, es geht dir gut. Ich schreibe dir, weil [reason for
          writing]. When using <em>weil</em>, move the verb or modal verb to the end.
        </p>
        <BulletList
          items={[
            "Example 1: Ich kann nicht kommen... Ich schreibe dir, weil ich nicht kommen kann.",
            "Example 2: Ich komme nicht... Ich schreibe dir, weil ich nicht komme.",
            'Tip: Start with "Ich" and end with "möchte" because of "weil". Example: Ich schreibe dir, weil ich den Termin absagen möchte.',
          ]}
        />
        <p style={{ margin: 0 }}>
          <strong>Main body:</strong> Use the conjunctions <em>Ich möchte wissen, ob</em>, <em>deshalb</em>, and{" "}
          <em>weil</em>. Keep sentences clear and well-structured.
        </p>
        <p style={{ margin: 0 }}>
          <strong>Conclusion:</strong> Ich freue mich im Voraus auf deine Antwort. (Do not change.) Liebe Grüße or Viele
          Grüße. <strong>[Your First Name]</strong>.
        </p>
      </Section>

      <Section title="Assignment: Informal Letter (Birthday Letter Question Book)">
        <p style={{ margin: 0 }}>
          Write a letter to your friend who has a birthday. Follow these steps:
        </p>
        <BulletList
          items={[
            "Start with an informal greeting.",
            "Explain why you are writing.",
            "Give your birthday wishes.",
            "Ask if they are planning a celebration.",
            "Conclude the letter politely.",
          ]}
        />
        <p style={{ margin: 0 }}>
          <strong>Sample question:</strong> Ihr Freund hat Geburtstag. Schreiben Sie an Ihren Freund: • Warum schreiben
          Sie? • Gratulieren Sie ihm. • Fragen Sie, ob er eine Feier plant?
        </p>
        <p style={{ margin: 0 }}>
          After writing: Go to the Schreiben Trainer, paste the question into the Ideas Generator, and follow the prompt
          to write the letter. Submit it the same way you already submit assignments.
        </p>
      </Section>

      <Section title="Assignment: Formal Letter (Formal Letter Question Book)">
        <p style={{ margin: 0 }}>
          Write a formal letter to a language school because you want to attend a German course. Follow these steps:
        </p>
        <BulletList
          items={[
            "Start with a formal greeting.",
            "Explain why you are writing.",
            "Request information about the courses.",
            "Ask about course dates, prices, and payment options.",
            "Conclude the letter politely.",
          ]}
        />
        <p style={{ margin: 0 }}>
          <strong>Sample question:</strong> Sie möchten einen Deutschkurs besuchen. Schreiben Sie an die Sprachschule: •
          Warum schreiben Sie? • Bitten Sie um Informationen über Kurse. • Fragen Sie nach Kursterminen, Preisen und
          Zahlungsmethoden.
        </p>
        <p style={{ margin: 0 }}>
          After writing: Use the same procedure (Schreiben Trainer → Ideas Generator → submit as usual).
        </p>
      </Section>
    </div>
  );
};

export default LetterWritingIntroPage;
