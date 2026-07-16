import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const exerciseBox = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 12,
  background: "#ffffff",
  display: "grid",
  gap: 7,
};

const optionLine = {
  margin: 0,
  lineHeight: 1.65,
};

const pronounQuestions = [
  {
    stem: "1. Anna kommt aus Ghana. ___ wohnt jetzt in Berlin.",
    options: ["a) Er", "b) Sie", "c) Es"],
  },
  {
    stem: "2. Paul lernt Deutsch. ___ spricht schon ein bisschen Deutsch.",
    options: ["a) Er", "b) Sie", "c) Wir"],
  },
  {
    stem: "3. Anna und Paul lernen zusammen. ___ machen die Hausaufgaben.",
    options: ["a) Ihr", "b) Sie", "c) Du"],
  },
  {
    stem: "4. Maria und ich wohnen in Accra. ___ lernen Deutsch.",
    options: ["a) Wir", "b) Ihr", "c) Sie"],
  },
  {
    stem: "5. Herr Müller, woher kommen ___?",
    options: ["a) du", "b) ihr", "c) Sie"],
  },
  {
    stem: "6. Felix und Ama, lernt ___ heute Deutsch?",
    options: ["a) ihr", "b) wir", "c) er"],
  },
];

const conjugationTasks = [
  "1. ich / wohnen → ______________________________",
  "2. du / lernen → ______________________________",
  "3. er / kommen → ______________________________",
  "4. sie (Singular) / heißen → ______________________________",
  "5. wir / machen → ______________________________",
  "6. ihr / sprechen → ______________________________",
  "7. sie (Plural) / lernen → ______________________________",
  "8. Sie (formal) / wohnen → ______________________________",
];

const sentenceTasks = [
  "1. Ich ________ Kofi. (heißen)",
  "2. Du ________ in Kumasi. (wohnen)",
  "3. Maria ________ aus Österreich. (kommen)",
  "4. Wir ________ Deutsch. (lernen)",
  "5. Ihr ________ die Hausaufgaben. (machen)",
  "6. Herr und Frau Weber ________ Englisch und Deutsch. (sprechen)",
  "7. ________ du aus Ghana? (kommen)",
  "8. Wo ________ Sie? (wohnen)",
];

const correctionTasks = [
  "1. Ich wohnst in Accra.",
  "2. Du lernen Deutsch.",
  "3. Er komme aus Deutschland.",
  "4. Wir spricht Englisch.",
  "5. Ihr machtst die Aufgabe.",
  "6. Sie heißt Herr Becker.",
];

const A1Day2Kapitel11WorkbookPage = () => (
  <A1TutorMarkedWorkbookShell
    day={2}
    chapter="1.1"
    fallbackAssignmentKey="A1-1.1"
    title="A1 · Day 2 Workbook · Personal Pronouns and Verb Conjugation"
    subtitle="Kapitel 1.1 · Tutor-marked assignment"
    assignmentIntro="Complete the personal-pronoun and verb-conjugation exercises. Then open Submit and send all your final answers for tutor marking."
    submitTitle="Submit A1 · Day 2 · Kapitel 1.1"
    submitDescription="This submission is locked to A1-1.1. Submit your answers for personal pronouns and present-tense verb conjugation."
  >
    <div style={{ display: "grid", gap: 16 }} data-a1-day2-chapter11-workbook="true">
      <section style={card}>
        <h2 style={{ margin: 0 }}>Overview</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          In Kapitel 1.1 you practise the German subject pronouns <strong>ich, du, er, sie, es, wir, ihr, sie</strong> and the formal pronoun <strong>Sie</strong>. You also conjugate regular verbs in the present tense.
        </p>
        <div style={{ ...exerciseBox, background: "#eff6ff" }}>
          <strong>Regular verb pattern: lernen</strong>
          <p style={optionLine}>ich lerne · du lernst · er/sie/es lernt</p>
          <p style={optionLine}>wir lernen · ihr lernt · sie/Sie lernen</p>
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Teil 1 · Personalpronomen</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Choose the correct personal pronoun for each sentence.
        </p>
        {pronounQuestions.map((question) => (
          <div key={question.stem} style={exerciseBox}>
            <strong>{question.stem}</strong>
            {question.options.map((option) => (
              <p key={option} style={optionLine}>{option}</p>
            ))}
          </div>
        ))}
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Teil 2 · Verben konjugieren</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Conjugate each verb in the present tense. Write the complete subject and verb form.
        </p>
        {conjugationTasks.map((task) => (
          <div key={task} style={exerciseBox}>{task}</div>
        ))}
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Teil 3 · Sätze ergänzen</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Complete each sentence with the correct verb form.
        </p>
        {sentenceTasks.map((task) => (
          <div key={task} style={exerciseBox}>{task}</div>
        ))}
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Teil 4 · Fehler korrigieren</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Each sentence contains a conjugation or pronoun error. Rewrite every sentence correctly.
        </p>
        {correctionTasks.map((task) => (
          <div key={task} style={exerciseBox}>{task}</div>
        ))}
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Teil 5 · Kurzer Text</h2>
        <div style={{ ...exerciseBox, background: "#f8fafc" }}>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Write 6–8 simple sentences about yourself and one other person. Use at least five different personal pronouns and conjugate the verbs correctly.
          </p>
          <p style={{ margin: 0 }}><strong>Include:</strong></p>
          <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 1.7 }}>
            <li>your name and where you live,</li>
            <li>the languages you speak or learn,</li>
            <li>one sentence about a friend or family member,</li>
            <li>one question with <em>du</em> or formal <em>Sie</em>.</li>
          </ul>
        </div>
      </section>
    </div>
  </A1TutorMarkedWorkbookShell>
);

export default A1Day2Kapitel11WorkbookPage;
