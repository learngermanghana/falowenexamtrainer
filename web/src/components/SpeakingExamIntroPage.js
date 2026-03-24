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

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              style={{
                textAlign: "left",
                padding: "8px 10px",
                borderBottom: "2px solid #e6e8ef",
                background: "#f7f8fb",
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.join("-")}>
            {row.map((cell) => (
              <td key={cell} style={{ padding: "8px 10px", borderBottom: "1px solid #e6e8ef" }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
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

const WarningCallout = ({ children }) => (
  <div
    style={{
      background: "#fff7ed",
      borderLeft: "4px solid #fb923c",
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

const ExampleCard = ({ title, items }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 12,
      background: "#f8fafc",
      display: "grid",
      gap: 8,
    }}
  >
    <strong>{title}</strong>
    <BulletList items={items} />
  </div>
);

const SpeakingExamIntroPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
          alt="Students practicing German speaking exam tasks together"
          style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 12 }}
        />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 15: Introduction to Speaking Exams</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Making formal requests with Sie-Imperativ and <strong>können</strong> (Goethe A1 – Sprechen Teil 3).
        </p>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Designed for Goethe A1 candidates · Focus: <strong>Höfliche Bitten</strong> (polite requests)
        </p>
      </div>

      <Section title="Workbook Focus: Making Formal Requests in German">
        <p style={{ margin: 0 }}>
          You will learn two safe structures for Teil 3: the Sie-Imperativ and “Können Sie bitte…?”. Use them to ask
          politely in formal situations.
        </p>
        <Callout>
          <strong>Quick rule to remember</strong>
          <BulletList
            items={[
              "Formal requests always use Sie + bitte.",
              "Können Sie bitte + infinitive is the safest for Teil 3.",
              "The main verb goes to the end with können.",
            ]}
          />
        </Callout>
      </Section>

      <Section title="Section 1 – What is the Sie-Imperativ? (Formal Imperative)">
        <h3 style={{ margin: 0 }}>1.1 Definition</h3>
        <p style={{ margin: 0 }}>
          The Sie-Imperativ is used when you speak formally to one person or several people (Sie).
        </p>
        <BulletList
          items={[
            "Use it in formal situations: office, school, hospital, customer service, police, official settings.",
            "It keeps your request polite and professional.",
          ]}
        />
        <h3 style={{ margin: "12px 0 0" }}>1.2 Form of the Sie-Imperativ</h3>
        <Callout>
          <strong>Basic rule:</strong> Verb + Sie + bitte
        </Callout>
        <Table
          headers={["Infinitiv", "Sie-Imperativ"]}
          rows={[
            ["kommen", "Kommen Sie bitte."],
            ["warten", "Warten Sie bitte."],
            ["hören", "Hören Sie bitte zu."],
            ["schreiben", "Schreiben Sie bitte."],
            ["erklären", "Erklären Sie bitte."],
          ]}
        />
      </Section>

      <Section title="Section 2 – Using “können” for Polite Requests">
        <p style={{ margin: 0 }}>
          In Goethe Sprechen Teil 3, you usually need to make polite requests. The safest structure is below.
        </p>
        <Callout>
          <strong>Key structure:</strong> Können Sie bitte + Infinitiv …?
        </Callout>
        <BulletList
          items={[
            "Können Sie mir bitte helfen?",
            "Können Sie das bitte wiederholen?",
            "Können Sie mir bitte sagen, wo der Bahnhof ist?",
            "Können Sie bitte langsamer sprechen?",
            "Können Sie mir bitte das Formular geben?",
          ]}
        />
      </Section>

      <Section title="Section 3 – Comparison: Imperativ vs. Können">
        <Table
          headers={["Situation", "Sie-Imperativ", "Mit können (more polite)"]}
          rows={[
            ["Ask for help", "Helfen Sie mir bitte.", "Können Sie mir bitte helfen?"],
            ["Ask to wait", "Warten Sie bitte.", "Können Sie bitte warten?"],
            ["Ask to explain", "Erklären Sie das bitte.", "Können Sie das bitte erklären?"],
            ["Ask to repeat", "Wiederholen Sie das bitte.", "Können Sie das bitte wiederholen?"],
          ]}
        />
        <WarningCallout>
          <strong>Exam Tip (Very Important)</strong>
          <p style={{ margin: 0 }}>
            For Goethe Teil 3, prefer “Können Sie bitte…?” — it sounds more polite and natural.
          </p>
        </WarningCallout>
      </Section>

      <Section title="Section 5 – Goethe A1 Sprechen Teil 3 Practice">
        <p style={{ margin: 0 }}>Write a polite request for each situation, then compare with the model answer.</p>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <ExampleCard
            title="Situation 1 – At the Bahnhof"
            items={["Write your request.", "Model: Können Sie mir bitte helfen? Ich suche den Bahnhof."]}
          />
          <ExampleCard
            title="Situation 2 – In the Office"
            items={["Write your request.", "Model: Können Sie mir bitte das Formular geben?"]}
          />
          <ExampleCard
            title="Situation 3 – In a Shop"
            items={["Write your request.", "Model: Können Sie mir bitte einen Rabatt geben?"]}
          />
          <ExampleCard
            title="Situation 4 – Speaking too fast"
            items={["Write your request.", "Model: Können Sie bitte langsamer sprechen?"]}
          />
        </div>
      </Section>

      <Section title="Section 6 – Real Exam Practice (Teil 3: Bitten formulieren)">
        <h3 style={{ margin: 0 }}>6.1 Open the official practice page</h3>
        <p style={{ margin: 0 }}>
          Go to the official Goethe A1 speaking practice page:{" "}
          <a href="https://bfu.goethe.de/a1_sd1/sprechen.php" target="_blank" rel="noreferrer">
            https://bfu.goethe.de/a1_sd1/sprechen.php
          </a>
          .
        </p>
        <h3 style={{ margin: "12px 0 0" }}>6.2 What you see on the page</h3>
        <BulletList
          items={[
            "Speaking exam time: 15 minutes",
            "There are 3 parts (3 Teile)",
            "You speak in a group",
          ]}
        />
        <h3 style={{ margin: "12px 0 0" }}>6.3 Go to Teil 3 and what it means</h3>
        <BulletList
          items={[
            "Teil 3 – „Bitte formulieren und darauf reagieren.”",
            "Bitte formulieren → make a polite request based on a picture.",
            "Darauf reagieren → respond politely (accept or refuse).",
            "Time for Teil 3: about 5 minutes.",
          ]}
        />
        <h3 style={{ margin: "12px 0 0" }}>6.4 Your task with the pictures</h3>
        <p style={{ margin: 0 }}>For each picture, make one formal request using Sie.</p>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <Callout>
            <strong>Option A (Recommended – very polite)</strong>
            <BulletList items={["Können Sie mir bitte helfen?", "Können Sie bitte warten?", "Können Sie bitte die Flasche öffnen?"]} />
          </Callout>
          <Callout>
            <strong>Option B (Formal command – Sie-Imperativ)</strong>
            <BulletList items={["Helfen Sie mir bitte.", "Warten Sie bitte.", "Öffnen Sie bitte die Flasche."]} />
          </Callout>
        </div>
        <h3 style={{ margin: "12px 0 0" }}>6.5 Teil 3 verb trainer (answer with können)</h3>
        <p style={{ margin: 0 }}>
          In Teil 3, you can safely answer most cards with <strong>“Können Sie bitte …?”</strong> and these high-frequency
          verbs:
        </p>
        <Table
          headers={["Verb", "Teil 3 polite request with können"]}
          rows={[
            ["bringen", "Können Sie mir bitte Wasser bringen?"],
            ["nehmen", "Können Sie bitte meinen Koffer nehmen?"],
            ["kaufen", "Können Sie bitte Brot kaufen?"],
            ["aufmachen", "Können Sie bitte das Fenster aufmachen?"],
            ["anmachen", "Können Sie bitte das Licht anmachen?"],
          ]}
        />
        <WarningCallout>
          <strong>Teil 3 note: how to pass</strong>
          <BulletList
            items={[
              "Use one complete polite sentence for every picture: Können Sie bitte + Verb am Ende?",
              "Speak clearly and keep eye contact with your partner/examiner.",
              "After your request, react politely to your partner (Ja, gern / Tut mir leid...).",
              "If you are nervous, use the same safe pattern with a new noun. Correct structure is more important than fancy vocabulary.",
            ]}
          />
        </WarningCallout>
        <h3 style={{ margin: "12px 0 0" }}>6.6 Reacting to your partner’s request</h3>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <ExampleCard title="Positive reaction (accept)" items={["Ja, gern.", "Ja, natürlich.", "Kein Problem."]} />
          <ExampleCard
            title="Negative reaction (refuse politely)"
            items={["Tut mir leid, das geht leider nicht.", "Leider kann ich nicht.", "Es tut mir leid, ich habe keine Zeit."]}
          />
        </div>
        <h3 style={{ margin: "12px 0 0" }}>6.7 Final checklist for students</h3>
        <BulletList
          items={[
            "Did I use Sie?",
            "Did I say bitte?",
            "If I used können, did I put the main verb at the end?",
            "Did I react politely to my partner?",
          ]}
        />
      </Section>
    </div>
  );
};

export default SpeakingExamIntroPage;
