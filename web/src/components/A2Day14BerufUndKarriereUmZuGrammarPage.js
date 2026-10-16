import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const formulaStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(16,185,129,0.1)",
  border: "1px solid rgba(16,185,129,0.35)",
  fontWeight: 700,
};

const practiceQuestions = [
  {
    prompt: "Ich mache einen Computerkurs, um ...",
    english: "I take a computer course to improve my computer skills.",
    options: [
      "zu meine Computerkenntnisse verbessern.",
      "meine Computerkenntnisse zu verbessern.",
      "meine Computerkenntnisse verbessern zu.",
    ],
    correctIndex: 1,
    explanation: "Place zu before verbessern (the infinitive), after the other words.",
  },
  {
    prompt: "Ich mache ein Praktikum, ...",
    english: "I do an internship to gain work experience.",
    options: [
      "um Berufserfahrung zu sammeln.",
      "damit Berufserfahrung zu sammeln.",
      "um ich Berufserfahrung sammle.",
    ],
    correctIndex: 0,
    explanation: "The same person does the internship and gains experience: um ... zu works.",
  },
  {
    prompt: "Die Chefin erklärt die Aufgaben, ...",
    english: "The manager explains the tasks so that the employees understand them.",
    options: [
      "um die Mitarbeitenden die Aufgaben verstehen.",
      "um die Mitarbeitenden zu verstehen.",
      "damit die Mitarbeitenden die Aufgaben verstehen.",
    ],
    correctIndex: 2,
    explanation: "Different subjects (Chefin / Mitarbeitende) require damit with the conjugated verb at the end.",
  },
  {
    prompt: "Ich übe jeden Abend, um mich auf das Gespräch ...",
    english: "I practise every evening to prepare for the interview.",
    options: [
      "zu vorbereiten.",
      "vorbereiten zu.",
      "vorzubereiten.",
    ],
    correctIndex: 2,
    explanation: "With the separable verb vorbereiten: vor + zu + bereiten.",
  },
  {
    prompt: "Ich besuche eine Weiterbildung, um ...",
    english: "I take further training to be able to take on more responsibility.",
    options: [
      "mehr Verantwortung zu können übernehmen.",
      "mehr Verantwortung übernehmen zu können.",
      "zu mehr Verantwortung übernehmen können.",
    ],
    correctIndex: 1,
    explanation: "With a modal verb, the two infinitives end the phrase: übernehmen zu können.",
  },
];

const Example = ({ german, english }) => (
  <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, background: "#f8fafc", display: "grid", gap: 5, lineHeight: 1.6 }}>
    <strong lang="de">{german}</strong>
    <span lang="en" style={{ color: "#475569" }}>{english}</span>
  </div>
);

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const MiniPractice = () => {
  const [answers, setAnswers] = useState({});

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Choose the correct German ending. The English meaning helps you understand the goal.
      </p>

      <p aria-live="polite" style={{ margin: 0, color: "#475569" }}>
        {Object.keys(answers).length} of {practiceQuestions.length} answered ·
        {" "}{practiceQuestions.filter((q, index) => answers[index] === q.correctIndex).length} correct
      </p>
      {practiceQuestions.map((question, questionIndex) => {
        const selectedIndex = answers[questionIndex];
        const hasAnswered = Number.isInteger(selectedIndex);
        const isCorrect = hasAnswered && selectedIndex === question.correctIndex;

        return (
          <div
            key={question.prompt}
            style={{
              border: "1px solid rgba(148,163,184,0.4)",
              borderRadius: 12,
              padding: 12,
              display: "grid",
              gap: 10,
              background: "#fff",
            }}
          >
            <strong lang="de">{questionIndex + 1}. {question.prompt}</strong>
            <span lang="en" style={{ fontSize: 14, color: "#475569" }}>Meaning: {question.english}</span>
            <div style={{ display: "grid", gap: 8 }} role="group" aria-label={`Question ${questionIndex + 1}`}>
              {question.options.map((option, optionIndex) => {
                const selected = selectedIndex === optionIndex;
                const optionIsCorrect = optionIndex === question.correctIndex;
                const showCorrect = hasAnswered && optionIsCorrect;
                const showWrong = selected && !optionIsCorrect;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                    aria-pressed={selected}
                    style={{
                      ...styles.secondaryButton,
                      width: "100%",
                      textAlign: "left",
                      justifyContent: "flex-start",
                      padding: "11px 13px",
                      borderRadius: 10,
                      border: showCorrect
                        ? "2px solid #16a34a"
                        : showWrong
                          ? "2px solid #dc2626"
                          : "1px solid #cbd5e1",
                      background: showCorrect
                        ? "#f0fdf4"
                        : showWrong
                          ? "#fef2f2"
                          : "#f8fafc",
                      color: "#0f172a",
                      fontWeight: selected || showCorrect ? 700 : 600,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {hasAnswered ? (
              <p
                role="status"
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: isCorrect ? "#166534" : "#b91c1c",
                }}
              >
                {isCorrect
                  ? `Correct: ${question.prompt} ${question.options[question.correctIndex]}`
                  : "Not quite. " + question.explanation + " Correct answer: " + question.options[question.correctIndex]}
              </p>
            ) : null}
          </div>
        );
      })}
      <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }}
        onClick={() => setAnswers({})} disabled={Object.keys(answers).length === 0}>
        Try again · Reset answers
      </button>
    </div>
  );
};

const FocusedGrammarContent = () => (
  <div data-a2-day14-focused-grammar="true" style={{ display: "grid", gap: 14 }}>
    <header style={{ ...styles.card, display: "grid", gap: 10 }}>
      <span style={{ ...styles.badge, width: "fit-content" }}>A2 · 5.14 · Grammar notes</span>
      <h1 style={{ margin: 0 }}>um ... zu + Infinitiv</h1>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        <strong>Meaning:</strong> <em>in order to / to</em>. We use <strong>um ... zu</strong> to explain
        the <strong>purpose</strong> (German: Ziel / Zweck) of an action.
        Ask <strong>Wozu?</strong> — <em>What for?</em>
      </p>
      <div style={formulaStyle}>Main clause (action) + comma + um + other words + zu + infinitive (goal)</div>
      <Example german="Ich lerne Deutsch, um in Deutschland zu arbeiten."
        english="I am learning German in order to work in Germany." />
    </header>

    <SectionCard title="1. Purpose: Why do we use um ... zu?">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        The first part says <strong>what you do</strong>; the phrase starting with
        <strong> um</strong> says <strong>what you want to achieve</strong>.
        Unlike <em>weil</em> (“because”), this is a <em>goal</em>, not a reason.
      </p>
      <Example german="Ich mache eine Weiterbildung, um eine bessere Stelle zu finden."
        english="I am taking further training to find a better position." />
      <Example german="Sie macht ein Praktikum, um Berufserfahrung zu sammeln."
        english="She is doing an internship to gain work experience." />
    </SectionCard>

    <SectionCard title="2. Same person: When can we use um ... zu?">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        The person doing the action and pursuing the goal must be the same —
        <strong> gleiche Person</strong> (same subject). Do not repeat that subject after <em>um</em>.
      </p>
      <Example german="Ich lerne Deutsch. Ich möchte in Deutschland arbeiten."
        english="I learn German. I want to work in Germany." />
      <Example german="Ich lerne Deutsch, um in Deutschland zu arbeiten."
        english="Combined: I learn German to work in Germany." />
      <Example german="Wir üben Vorstellungsgespräche, um sicherer zu sprechen."
        english="We practise job interviews to speak more confidently." />
      <p style={{ margin: 0, color: "#475569" }}>
        <strong>Incorrect:</strong> <span lang="de">um ich in Deutschland zu arbeiten</span>.
        Do not use <em>ich</em> after <em>um</em>.
      </p>
    </SectionCard>

    <SectionCard title="3. When should I use damit?">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Use <strong>damit</strong> (<em>so that</em>) when there are
        <strong> different subjects</strong>. The subordinate clause has its own subject and a
        <strong> conjugated verb at the end</strong>.
      </p>
      <Example german="Ich spreche langsam, damit der Kunde mich versteht."
        english="I speak slowly so that the customer understands me." />
      <Example german="Die Firma bietet Kurse an, damit die Mitarbeitenden neue Fähigkeiten lernen."
        english="The company offers courses so that employees learn new skills." />
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        <strong>Important:</strong> <em>damit</em> can also be used with the <strong>same</strong> subject.
        Only <em>um ... zu</em> requires the same subject.
      </p>
      <Example german="Ich lerne Deutsch, damit ich in Deutschland arbeiten kann."
        english="I learn German so that I can work in Germany. (Same subject; damit is also correct.)" />
      <div style={formulaStyle}>
        Same subject → um ... zu (or damit) · Different subjects → damit
      </div>
    </SectionCard>

    <SectionCard title="4. Word order: comma and infinitive position">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Use a <strong>comma before um</strong>. Place <strong>zu + infinitive</strong> at the end
        of the goal phrase; the other details usually go between <em>um</em> and <em>zu</em>.
      </p>
      <Example german="Ich bewerbe mich, um eine neue Stelle zu finden."
        english="I am applying in order to find a new position." />
      <div style={formulaStyle}>Ich bewerbe mich, | um | eine neue Stelle | zu finden.</div>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        <strong>With a modal verb:</strong> the action infinitive comes before <em>zu + modal infinitive</em>.
      </p>
      <Example german="Ich mache einen Kurs, um später mehr Verantwortung übernehmen zu können."
        english="I am taking a course to be able to take on more responsibility later." />
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        <strong>With a separable verb:</strong> insert <em>zu</em> between the prefix and main verb.
      </p>
      <Example german="Ich übe Fragen, um mich auf das Vorstellungsgespräch vorzubereiten."
        english="I practise questions to prepare for the interview. (vor + zu + bereiten)" />
    </SectionCard>

    <SectionCard title="5. Career vocabulary · German and English">
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr><th style={{ padding: "10px 12px", borderBottom: "2px solid #cbd5e1" }}>German</th>
              <th style={{ padding: "10px 12px", borderBottom: "2px solid #cbd5e1" }}>English</th></tr>
          </thead>
          <tbody>
            {[
              ["eine Ausbildung machen", "to do vocational training / an apprenticeship"],
              ["eine Weiterbildung machen", "to take further professional training"],
              ["Berufserfahrung sammeln", "to gain work experience"],
              ["sich um eine Stelle bewerben", "to apply for a position"],
              ["eine Stelle finden", "to find a job / position"],
              ["sich auf ein Vorstellungsgespräch vorbereiten", "to prepare for a job interview"],
            ].map(([de, en]) => (
              <tr key={de}>
                <td lang="de" style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>{de}</td>
                <td lang="en" style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>{en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Example german="Ich sammle Berufserfahrung, um später eine bessere Stelle zu finden."
        english="I am gaining work experience to find a better job later." />
    </SectionCard>

    <SectionCard title="6. Common mistakes and quick checks">
      <ul style={listStyle}>
        <li><span lang="de">✗ um zu eine Stelle finden</span> → <strong lang="de">✓ um eine Stelle zu finden</strong>.
          The infinitive follows <em>zu</em>.</li>
        <li><span lang="de">✗ um ich mehr Geld verdienen kann</span> → <strong lang="de">✓ damit ich mehr Geld verdienen kann</strong>.
          Use <em>damit</em> when you include your own subject and conjugated verb.</li>
        <li><span lang="de">✗ um mich auf das Gespräch zu vorbereiten</span> → <strong lang="de">✓ um mich auf das Gespräch vorzubereiten</strong>.
          Place <em>zu</em> between prefix <em>vor</em> and verb <em>bereiten</em>.</li>
      </ul>
      <p style={{ margin: 0, color: "#475569" }}>
        Check: Is this a goal? Is the subject the same? Is there a comma? Is <em>zu</em> in the right place?
      </p>
    </SectionCard>

    <SectionCard title="7. Quick practice · Check your understanding">
      <MiniPractice />
    </SectionCard>
  </div>
);

const A2Day14BerufUndKarriereUmZuGrammarPage = ({ embedded = false }) => {
  if (embedded) return <FocusedGrammarContent />;

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />
        <FocusedGrammarContent />
      </div>
    </div>
  );
};

export default A2Day14BerufUndKarriereUmZuGrammarPage;
