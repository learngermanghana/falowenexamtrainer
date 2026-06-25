import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=80";

const tabs = [
  { key: "orientation", label: "Teil 1 · Orientierung" },
  { key: "course", label: "Teil 2 · B1 course flow" },
  { key: "platform", label: "Teil 3 · Falowen workflow" },
  { key: "test", label: "Teil 4 · Knowledge test" },
  { key: "references", label: "5. Ref" },
  { key: "submit", label: "6. Submit" },
];

const palette = {
  ink: "#172033",
  muted: "#5f6b7c",
  border: "#dfe6ef",
  blue: "#2563eb",
  blueSoft: "#eff6ff",
  indigo: "#4338ca",
  indigoSoft: "#eef2ff",
  green: "#15803d",
  greenSoft: "#f0fdf4",
  amber: "#b45309",
  amberSoft: "#fffbeb",
  rose: "#be123c",
  roseSoft: "#fff1f2",
};

const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: `1px solid ${palette.border}`,
  borderRadius: 18,
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
};

const sectionTitle = {
  margin: 0,
  color: palette.ink,
  fontSize: "clamp(1.25rem, 3vw, 1.65rem)",
};

const listStyle = {
  margin: 0,
  paddingLeft: 22,
  display: "grid",
  gap: 8,
  lineHeight: 1.65,
};

const testQuestions = [
  {
    question: "What level are you preparing for in this course?",
    options: ["A1", "B1", "C1"],
    answer: 1,
    explanation: "This course develops B1 communication and B1 exam readiness.",
  },
  {
    question: "What should you do on every study day?",
    options: [
      "Read the instruction, use the lesson resources, complete the workbook, and submit only the required parts",
      "Wait until class before opening the lesson",
      "Skip directly to the Submit tab",
    ],
    answer: 0,
    explanation: "B1 progress depends on preparation before class, not only attendance.",
  },
  {
    question: "What is Teil 1 mainly used for?",
    options: ["Speaking preparation and group practice", "Final certificate collection", "Listening only"],
    answer: 0,
    explanation: "Teil 1 prepares you to speak actively in class. It is not normally submitted.",
  },
  {
    question: "Which workbook parts are normally submitted for marking?",
    options: ["Teil 1 only", "Teil 2, Teil 3 and Teil 4", "Every rough note from all tabs"],
    answer: 1,
    explanation: "Writing, reading and listening form the usual submitted assignment parts.",
  },
  {
    question: "What changes when you move from A2 to B1?",
    options: [
      "You explain ideas more independently and give reasons and examples",
      "You only memorise isolated sentences",
      "You stop doing speaking tasks",
    ],
    answer: 0,
    explanation: "B1 requires clearer, more independent communication.",
  },
  {
    question: "Where is assignment submission now located?",
    options: ["Inside the Course Book Submit tab", "Only in Google Drive", "Only through WhatsApp"],
    answer: 0,
    explanation: "Use the Submit tab inside the lesson or workbook flow.",
  },
  {
    question: "How do you record attendance before class?",
    options: [
      "Use the check-in link or QR code provided for the session",
      "Attendance is automatic without check-in",
      "Send only a private message to another student",
    ],
    answer: 0,
    explanation: "The session check-in records attendance, and the Attendance page shows your record.",
  },
  {
    question: "What should you do with tutor and AI videos?",
    options: [
      "Use them as learning support before grammar notes and workbook practice",
      "Treat each video as a separate assignment",
      "Ignore the workbook after watching a video",
    ],
    answer: 0,
    explanation: "Videos support learning; the workbook is where you practise and prepare final answers.",
  },
  {
    question: "Choose the correct sentence with weil.",
    options: [
      "Ich lerne jeden Tag, weil ich die B1-Prüfung bestehen möchte.",
      "Ich lerne jeden Tag, weil möchte ich die B1-Prüfung bestehen.",
      "Ich lerne jeden Tag, weil ich möchte die B1-Prüfung bestehen.",
    ],
    answer: 0,
    explanation: "In a weil-clause, the conjugated verb goes to the end.",
  },
  {
    question: "Choose the correct sentence with deshalb.",
    options: [
      "Ich habe morgen einen Test, deshalb ich lerne heute Abend.",
      "Ich habe morgen einen Test, deshalb lerne ich heute Abend.",
      "Ich habe morgen einen Test, deshalb heute Abend ich lerne.",
    ],
    answer: 1,
    explanation: "After deshalb, the verb comes directly after the connector.",
  },
  {
    question: "Choose the correct sentence with dass.",
    options: [
      "Ich denke, dass Deutsch wichtig ist.",
      "Ich denke, dass Deutsch ist wichtig.",
      "Ich denke, dass ist Deutsch wichtig.",
    ],
    answer: 0,
    explanation: "In a dass-clause, the conjugated verb goes to the end.",
  },
  {
    question: "Choose the correct sentence with obwohl.",
    options: [
      "Obwohl ich müde bin, lerne ich weiter.",
      "Obwohl ich bin müde, lerne ich weiter.",
      "Obwohl müde ich bin, lerne ich weiter.",
    ],
    answer: 0,
    explanation: "The verb goes to the end of the obwohl-clause.",
  },
  {
    question: "Choose the correct Perfekt sentence.",
    options: ["Ich habe gestern viel gelernt.", "Ich bin gestern viel gelernt.", "Ich habe gestern viel lernen."],
    answer: 0,
    explanation: "The correct participle is gelernt and the auxiliary is haben.",
  },
  {
    question: "Choose the correct Präteritum sentence.",
    options: ["Ich war gestern zu Hause.", "Ich bin gestern zu Hause war.", "Ich waren gestern zu Hause."],
    answer: 0,
    explanation: "The correct simple-past form of sein for ich is war.",
  },
  {
    question: "Choose the correct modal-verb sentence.",
    options: [
      "Ich muss meine Hausaufgaben machen.",
      "Ich muss mache meine Hausaufgaben.",
      "Ich meine Hausaufgaben muss machen.",
    ],
    answer: 0,
    explanation: "The second verb stays in the infinitive at the end.",
  },
  {
    question: "Which phrase gives a B1 opinion correctly?",
    options: [
      "Meiner Meinung nach ist tägliches Lernen sehr wichtig.",
      "Meiner Meinung nach tägliches Lernen ist sehr wichtig.",
      "Meiner Meinung nach sehr wichtig ist tägliches Lernen.",
    ],
    answer: 0,
    explanation: "Meiner Meinung nach is followed by normal main-clause word order.",
  },
  {
    question: "Which is the best beginning for a formal email?",
    options: ["Sehr geehrte Damen und Herren,", "Hallo mein Freund,", "Liebe Grüße"],
    answer: 0,
    explanation: "Sehr geehrte Damen und Herren is a standard formal greeting.",
  },
  {
    question: "Which order is best for a B1 writing task?",
    options: [
      "Greeting → reason for writing → main points with details → request or questions → closing",
      "Closing → no explanation → greeting",
      "Only one sentence without structure",
    ],
    answer: 0,
    explanation: "A B1 text should be organised, complete and easy to follow.",
  },
];

const TabButton = ({ active, complete, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      ...styles.secondaryButton,
      borderColor: active ? palette.blue : complete ? "#86efac" : "#d1d5db",
      background: active ? palette.blueSoft : complete ? palette.greenSoft : "#fff",
      color: active ? "#1d4ed8" : complete ? "#166534" : palette.ink,
      minHeight: 42,
    }}
  >
    {complete ? "✓ " : ""}{children}
  </button>
);

const PreparedCheckbox = ({ checked, onChange, label = "I completed this part." }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, color: palette.ink }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    {label}
  </label>
);

const InfoCard = ({ icon, title, children, tone = "plain" }) => {
  const tones = {
    plain: { background: "#fff", border: palette.border },
    blue: { background: palette.blueSoft, border: "#bfdbfe" },
    green: { background: palette.greenSoft, border: "#bbf7d0" },
    amber: { background: palette.amberSoft, border: "#fde68a" },
  };
  const selected = tones[tone] || tones.plain;
  return (
    <article style={{ border: `1px solid ${selected.border}`, background: selected.background, borderRadius: 15, padding: 14, display: "grid", gap: 7 }}>
      <strong style={{ color: palette.ink, fontSize: 16 }}>{icon} {title}</strong>
      <div style={{ color: palette.muted, lineHeight: 1.65 }}>{children}</div>
    </article>
  );
};

const QuestionCard = ({ item, index, selected, onSelect }) => (
  <article
    style={{
      border: `1px solid ${selected !== undefined ? (selected === item.answer ? "#86efac" : "#fda4af") : palette.border}`,
      background: selected !== undefined ? (selected === item.answer ? palette.greenSoft : palette.roseSoft) : "#fff",
      borderRadius: 15,
      padding: 14,
      display: "grid",
      gap: 10,
    }}
  >
    <strong style={{ color: palette.ink }}>{index + 1}. {item.question}</strong>
    <div style={{ display: "grid", gap: 7 }}>
      {item.options.map((option, optionIndex) => {
        const active = selected === optionIndex;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(index, optionIndex)}
            style={{
              ...styles.secondaryButton,
              textAlign: "left",
              justifyContent: "flex-start",
              borderColor: active ? palette.blue : "#d1d5db",
              background: active ? palette.blueSoft : "#fff",
            }}
          >
            {String.fromCharCode(65 + optionIndex)}) {option}
          </button>
        );
      })}
    </div>
    {selected !== undefined ? (
      <p style={{ margin: 0, color: selected === item.answer ? "#166534" : "#9f1239", lineHeight: 1.55 }}>
        <strong>{selected === item.answer ? "Correct." : `Correct answer: ${String.fromCharCode(65 + item.answer)}.`}</strong> {item.explanation}
      </p>
    ) : null}
  </article>
);

const B1Day0OrientationKnowledgeTestWorkbookPageModern = () => {
  const [activeTab, setActiveTab] = useState("orientation");
  const [prepared, setPrepared] = useState({ orientation: false, course: false, platform: false, references: false });
  const [answers, setAnswers] = useState({});

  const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);
  const answeredCount = Object.keys(answers).length;
  const testComplete = answeredCount === testQuestions.length;
  const score = useMemo(
    () => testQuestions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers],
  );
  const percent = testComplete ? Math.round((score / testQuestions.length) * 100) : 0;
  const completionMap = {
    orientation: prepared.orientation,
    course: prepared.course,
    platform: prepared.platform,
    test: testComplete,
    references: prepared.references,
    submit: false,
  };
  const completedCoreParts = [prepared.orientation, prepared.course, prepared.platform, testComplete, prepared.references].filter(Boolean).length;
  const readyForDay1 = completedCoreParts === 5;

  const setPreparedFor = (key) => (event) => setPrepared((old) => ({ ...old, [key]: event.target.checked }));
  const answerQuestion = (index, optionIndex) => setAnswers((old) => ({ ...old, [index]: optionIndex }));

  return (
    <div data-b1-day0-redesign="true" style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Day 0 Workbook · Orientation + Knowledge Test</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Orientation only. Learn the B1 workflow, understand the workbook tabs, check your platform knowledge, and confirm that you are ready for Day 1.
        </p>
        <img
          src={HERO_IMAGE}
          alt="B1 students preparing together before the course begins"
          loading="lazy"
          style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 12 }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              active={tab.key === activeTab}
              complete={completionMap[tab.key]}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>
        <div style={{ display: "grid", gap: 7 }}>
          <p style={{ margin: 0, color: palette.muted }}>Tab {activeIndex + 1} of {tabs.length}</p>
          <div style={{ height: 8, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
            <div style={{ width: `${((activeIndex + 1) / tabs.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,#2563eb,#7c3aed)" }} />
          </div>
        </div>
      </div>

      {activeTab === "orientation" && (
        <section style={card}>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
            alt="Students preparing for B1 orientation"
            loading="lazy"
            style={{ width: "100%", maxHeight: 250, objectFit: "cover", borderRadius: 12 }}
          />
          <h2 style={sectionTitle}>Teil 1 · Start here</h2>
          <InfoCard icon="🧭" title="Day 0 is orientation only" tone="blue">
            There is no new grammar lesson and no graded assignment today. Your job is to understand the B1 learning system before teaching begins on Day 1.
          </InfoCard>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12 }}>
            <InfoCard icon="📘" title="Course level">B1 expects clearer explanations, fuller sentences, reasons, examples and more independent communication than A2.</InfoCard>
            <InfoCard icon="✅" title="Completion">Read all orientation tabs, finish the knowledge test, review the corrections and check the Submit tab.</InfoCard>
            <InfoCard icon="🎯" title="Goal">Begin Day 1 already knowing how to learn, prepare, submit work, check attendance and use Falowen support.</InfoCard>
          </div>
          <h3 style={{ margin: "4px 0 0", color: palette.ink }}>What you must do today</h3>
          <ol style={listStyle}>
            <li>Understand what changes from A2 to B1.</li>
            <li>Learn the purpose of Teil 1, Teil 2, Teil 3 and Teil 4.</li>
            <li>Learn the correct daily order for lesson resources.</li>
            <li>Understand attendance, submission, results and Falowen AI support.</li>
            <li>Complete the Day 0 knowledge test and review every correction.</li>
          </ol>
          <PreparedCheckbox checked={prepared.orientation} onChange={setPreparedFor("orientation")} />
        </section>
      )}

      {activeTab === "course" && (
        <section style={card}>
          <img
            src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80"
            alt="Open book and notes for a structured B1 course"
            loading="lazy"
            style={{ width: "100%", maxHeight: 250, objectFit: "cover", borderRadius: 12 }}
          />
          <h2 style={sectionTitle}>Teil 2 · How the B1 workbook works</h2>
          <p style={{ margin: 0, color: palette.muted, lineHeight: 1.7 }}>
            B1 uses the same four-part workbook structure every day. Prepare Teil 1 before class, then complete the written assignment parts carefully.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            <InfoCard icon="🗣️" title="Teil 1 · Sprechen" tone="blue">Prepare opinions, reasons, examples and useful phrases for class discussion. This part is normally group practice and is not submitted.</InfoCard>
            <InfoCard icon="✍️" title="Teil 2 · Schreiben">Write organised emails, letters, opinions or longer responses with connectors and clear details.</InfoCard>
            <InfoCard icon="📖" title="Teil 3 · Lesen">Read for the main idea, important details and exam-style meaning. Send the required final answers in Submit.</InfoCard>
            <InfoCard icon="🎧" title="Teil 4 · Hören">Listen for key information, intentions and meaning. Submit only the final requested answers.</InfoCard>
          </div>
          <InfoCard icon="📊" title="How your score works" tone="green">
            Teil 2, Teil 3 and Teil 4 normally combine to make the assignment score out of 100%. Teil 1 prepares your speaking performance in class.
          </InfoCard>
          <h3 style={{ margin: "4px 0 0", color: palette.ink }}>What strong B1 work looks like</h3>
          <ul style={listStyle}>
            <li>Complete sentences instead of isolated words.</li>
            <li>Reasons with weil, denn or deshalb.</li>
            <li>Opinions with phrases such as Meiner Meinung nach ...</li>
            <li>Examples that support your main point.</li>
            <li>Clear structure in writing and active participation in speaking.</li>
          </ul>
          <PreparedCheckbox checked={prepared.course} onChange={setPreparedFor("course")} />
        </section>
      )}

      {activeTab === "platform" && (
        <section style={card}>
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3ac?auto=format&fit=crop&w=1600&q=80"
            alt="Laptop used for the Falowen B1 learning workflow"
            loading="lazy"
            style={{ width: "100%", maxHeight: 250, objectFit: "cover", borderRadius: 12 }}
          />
          <h2 style={sectionTitle}>Teil 3 · Your Falowen workflow</h2>
          <InfoCard icon="➡️" title="Use the resources in this order" tone="blue">
            <strong>Instruction → tutor video → AI video → grammar notes → workbook → Submit.</strong> When one resource is unavailable, continue with the next available step.
          </InfoCard>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            <InfoCard icon="🎬" title="Videos">Tutor and AI videos are learning resources. They support explanations, pronunciation and revision; they are not separate submissions.</InfoCard>
            <InfoCard icon="📤" title="Submit tab">Submission is inside the Course Book. Select the correct day and send only the required clean final answers.</InfoCard>
            <InfoCard icon="📍" title="Attendance">Use the class check-in link or QR code before each session, then track your record on the Attendance page.</InfoCard>
            <InfoCard icon="🤖" title="Falowen AI">Use Grammar support, Mark My Letter and the speaking coach to practise before sending final work.</InfoCard>
            <InfoCard icon="📈" title="Results">Check tutor corrections, scores and improvement areas on the Results page.</InfoCard>
            <InfoCard icon="💬" title="Discussion">Use group discussion when your tutor asks the class to prepare or exchange ideas.</InfoCard>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/campus/attendance" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Attendance</a>
            <a href="/campus/grammar" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Grammar Support</a>
            <a href="/campus/results" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Results</a>
          </div>
          <PreparedCheckbox checked={prepared.platform} onChange={setPreparedFor("platform")} />
        </section>
      )}

      {activeTab === "test" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Day 0 Knowledge Test</h2>
          <p style={{ margin: 0, color: palette.muted, lineHeight: 1.7 }}>
            Choose one answer for every question. Corrections appear immediately so you can learn from mistakes before Day 1.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <strong style={{ color: palette.ink }}>Progress: {answeredCount}/{testQuestions.length}</strong>
            {testComplete ? <strong style={{ color: percent >= 70 ? palette.green : palette.amber }}>Score: {score}/{testQuestions.length} · {percent}%</strong> : null}
          </div>
          <div style={{ height: 9, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
            <div style={{ width: `${(answeredCount / testQuestions.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,#2563eb,#7c3aed)", transition: "width .25s ease" }} />
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {testQuestions.map((question, index) => (
              <QuestionCard
                key={question.question}
                item={question}
                index={index}
                selected={answers[index]}
                onSelect={answerQuestion}
              />
            ))}
          </div>
          {testComplete ? (
            <InfoCard icon={percent >= 70 ? "✅" : "📚"} title={percent >= 70 ? "Knowledge test complete" : "Review before Day 1"} tone={percent >= 70 ? "green" : "amber"}>
              {percent >= 70
                ? "You understand the main B1 workflow. Review any wrong answers, then open Ref and Submit."
                : "Read Teil 1, Teil 2 and Teil 3 again, correct the weak areas and repeat the test before starting Day 1."}
            </InfoCard>
          ) : null}
          <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => setAnswers({})}>Restart knowledge test</button>
        </section>
      )}

      {activeTab === "references" && (
        <section style={card}>
          <h2 style={sectionTitle}>5. Ref · B1 quick reference</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 12 }}>
            <InfoCard icon="📚" title="Daily study order" tone="blue">Instruction → videos → grammar notes → workbook → Submit.</InfoCard>
            <InfoCard icon="📤" title="Submit rule" tone="green">Prepare Teil 1 for class. Submit the required final work from Teil 2, Teil 3 and Teil 4.</InfoCard>
            <InfoCard icon="🧠" title="B1 communication">Give an opinion, explain why, add an example and finish with a clear conclusion.</InfoCard>
            <InfoCard icon="🔗" title="Verb position">weil, dass and obwohl send the verb to the end. deshalb and trotzdem are followed by the verb.</InfoCard>
            <InfoCard icon="✉️" title="Writing order">Greeting → reason for writing → main points and details → request or questions → closing.</InfoCard>
            <InfoCard icon="✅" title="Before class">Open the day, prepare Teil 1, complete the workbook tasks and use the session attendance check-in.</InfoCard>
          </div>
          <PreparedCheckbox checked={prepared.references} onChange={setPreparedFor("references")} label="I reviewed the B1 quick reference." />
        </section>
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={sectionTitle}>6. Submit · Complete Day 0</h2>
          <InfoCard icon="ℹ️" title="No graded assignment today" tone="blue">
            Day 0 is orientation and self-check only. You do not upload a writing, reading or listening assignment for Day 0.
          </InfoCard>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
            {[
              ["Teil 1", prepared.orientation],
              ["Teil 2", prepared.course],
              ["Teil 3", prepared.platform],
              ["Teil 4 test", testComplete],
              ["Ref", prepared.references],
            ].map(([label, complete]) => (
              <div key={label} style={{ border: `1px solid ${complete ? "#86efac" : palette.border}`, background: complete ? palette.greenSoft : "#fff", borderRadius: 14, padding: 13, display: "flex", alignItems: "center", gap: 8 }}>
                <span aria-hidden="true">{complete ? "✅" : "⬜"}</span>
                <strong style={{ color: complete ? "#166534" : palette.ink }}>{label}</strong>
              </div>
            ))}
          </div>
          <div style={{ border: `1px solid ${readyForDay1 ? "#86efac" : "#fde68a"}`, background: readyForDay1 ? palette.greenSoft : palette.amberSoft, borderRadius: 16, padding: 16, display: "grid", gap: 7 }}>
            <strong style={{ color: readyForDay1 ? "#166534" : "#92400e", fontSize: 19 }}>
              {readyForDay1 ? "Day 0 complete — you are ready for Day 1" : `${completedCoreParts}/5 orientation parts complete`}
            </strong>
            <span style={{ color: palette.muted, lineHeight: 1.6 }}>
              {readyForDay1
                ? `Knowledge-test score: ${score}/${testQuestions.length} (${percent}%). Review any corrections, then begin Day 1 with Teil 1 speaking preparation.`
                : "Return to the unfinished tabs, complete the reading and answer every knowledge-test question."}
            </span>
          </div>
          <a
            href="/campus/course/lesson/B1/1?view=workbook"
            style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content", opacity: readyForDay1 ? 1 : 0.6 }}
            aria-disabled={!readyForDay1}
          >
            Continue to B1 Day 1 workbook
          </a>
        </section>
      )}
    </div>
  );
};

export default B1Day0OrientationKnowledgeTestWorkbookPageModern;
