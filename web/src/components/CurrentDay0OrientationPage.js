import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const palette = {
  ink: "#172033",
  muted: "#5f6b7c",
  border: "#dfe6ef",
  blue: "#2563eb",
  blueSoft: "#eff6ff",
  green: "#15803d",
  greenSoft: "#f0fdf4",
  amber: "#b45309",
  amberSoft: "#fffbeb",
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

const listStyle = {
  margin: 0,
  paddingLeft: 22,
  display: "grid",
  gap: 8,
  lineHeight: 1.65,
};

const navigationTabs = [
  { key: "welcome", label: "1. Welcome" },
  { key: "course", label: "2. Course Book" },
  { key: "navigation", label: "3. App navigation" },
  { key: "test", label: "4. Readiness test" },
  { key: "advice", label: "5. Advice" },
  { key: "finish", label: "6. Finish" },
];

const examRoomItems = [
  "Question of the day",
  "Reading",
  "Speaking",
  "Writing",
  "Vocab",
  "Listening",
  "Resources",
  "Exam File",
];

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

const PreparedCheckbox = ({ checked, onChange, label = "I completed this section." }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, color: palette.ink }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    {label}
  </label>
);

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
      {item.options.map((option, optionIndex) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(index, optionIndex)}
          style={{
            ...styles.secondaryButton,
            textAlign: "left",
            justifyContent: "flex-start",
            borderColor: selected === optionIndex ? palette.blue : "#d1d5db",
            background: selected === optionIndex ? palette.blueSoft : "#fff",
          }}
        >
          {String.fromCharCode(65 + optionIndex)}) {option}
        </button>
      ))}
    </div>
    {selected !== undefined ? (
      <p style={{ margin: 0, color: selected === item.answer ? "#166534" : "#9f1239", lineHeight: 1.55 }}>
        <strong>{selected === item.answer ? "Correct." : `Correct answer: ${String.fromCharCode(65 + item.answer)}.`}</strong> {item.explanation}
      </p>
    ) : null}
  </article>
);

const CurrentDay0OrientationPage = ({ config }) => {
  const [activeTab, setActiveTab] = useState("welcome");
  const [prepared, setPrepared] = useState({ welcome: false, course: false, navigation: false, advice: false });
  const [answers, setAnswers] = useState({});
  const questions = config.questions || [];
  const answeredCount = Object.keys(answers).length;
  const testComplete = questions.length > 0 && answeredCount === questions.length;
  const score = useMemo(
    () => questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers, questions]
  );
  const percent = testComplete ? Math.round((score / questions.length) * 100) : 0;
  const passedReadiness = testComplete && percent >= config.threshold;
  const activeIndex = navigationTabs.findIndex((tab) => tab.key === activeTab);
  const completionMap = {
    welcome: prepared.welcome,
    course: prepared.course,
    navigation: prepared.navigation,
    test: testComplete,
    advice: prepared.advice,
    finish: false,
  };
  const completedCount = [prepared.welcome, prepared.course, prepared.navigation, testComplete, prepared.advice].filter(Boolean).length;
  const readyForDay1 = completedCount === 5;
  const setPreparedFor = (key) => (event) => setPrepared((old) => ({ ...old, [key]: event.target.checked }));
  const answerQuestion = (index, optionIndex) => setAnswers((old) => ({ ...old, [index]: optionIndex }));

  return (
    <div data-current-day0-orientation={config.level} style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ width: "fit-content", padding: "6px 10px", borderRadius: 999, background: palette.greenSoft, color: "#166534", fontWeight: 800, fontSize: 13 }}>
          Congratulations — you are starting {config.level}
        </span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>{config.level} · Day 0 Orientation and Readiness Test</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>{config.subtitle}</p>
        <div style={{ borderRadius: 16, padding: 18, color: "#eef2ff", background: "linear-gradient(135deg,#312e81,#2563eb)", display: "grid", gap: 7 }}>
          <strong style={{ fontSize: 21 }}>Welcome to your new level</strong>
          <span style={{ lineHeight: 1.65 }}>
            Starting a new level is an achievement. Be consistent, prepare before class or practice, learn from corrections and do not fear mistakes. Day 0 is not a graded assignment; it prepares you to use the current Falowen app correctly.
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {navigationTabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} complete={completionMap[tab.key]} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>
        <p style={{ margin: 0, color: palette.muted }}>Section {activeIndex + 1} of {navigationTabs.length}</p>
      </div>

      {activeTab === "welcome" ? (
        <section style={card}>
          <h2 style={{ margin: 0, color: palette.ink }}>1. Congratulations and your Day 0 goal</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12 }}>
            <InfoCard icon="🎉" title="You have progressed" tone="green">Starting {config.level} means you are building on earlier learning. Give yourself credit and begin with confidence.</InfoCard>
            <InfoCard icon="🧭" title="Day 0 is orientation" tone="blue">Learn the app flow, complete the readiness test and review every correction before Day 1.</InfoCard>
            <InfoCard icon="📅" title="Consistency wins">Open the Course Book regularly and correct weak areas as soon as they appear.</InfoCard>
          </div>
          <ol style={listStyle}>
            <li>Understand the current Course Book workflow.</li>
            <li>Learn the difference between Campus and Exams Room.</li>
            <li>Complete the readiness test and review wrong answers.</li>
            <li>Read the study advice and enable notifications.</li>
          </ol>
          <PreparedCheckbox checked={prepared.welcome} onChange={setPreparedFor("welcome")} />
        </section>
      ) : null}

      {activeTab === "course" ? (
        <section style={card}>
          <h2 style={{ margin: 0, color: palette.ink }}>2. How the current Course Book works</h2>
          <InfoCard icon="➡️" title="Your level flow" tone="blue"><strong>{config.courseFlow}</strong></InfoCard>
          <ul style={listStyle}>{config.courseNotes.map((note) => <li key={note}>{note}</li>)}</ul>
          <InfoCard icon={config.selfLearning ? "✅" : "📤"} title={config.selfLearning ? "B2 self-learning completion" : "Submit inside the Course Book"} tone="green">
            {config.selfLearning
              ? "Complete Learn, Speak, Write and Finish, improve your work with feedback, then record confidence honestly. The normal B2 daily flow does not use tutor assignment submission."
              : "Open the assignment workbook and use its Submit tab. The correct day and assignment are selected automatically; do not use old Google Drive links or search for a separate student submission page."}
          </InfoCard>
          <PreparedCheckbox checked={prepared.course} onChange={setPreparedFor("course")} />
        </section>
      ) : null}

      {activeTab === "navigation" ? (
        <section style={card}>
          <h2 style={{ margin: 0, color: palette.ink }}>3. Current Falowen navigation</h2>
          <InfoCard icon="🏠" title="Falowen Home" tone="blue">Choose <strong>Campus</strong> for your course and progress, or <strong>Exams Room</strong> for separate exam-style practice.</InfoCard>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
            <InfoCard icon="🎓" title="Campus"><strong>{config.campusItems.join(" · ")}</strong><p style={{ margin: "8px 0 0" }}>Some items appear only when they apply to your level and class type.</p></InfoCard>
            <InfoCard icon="🎯" title="Exams Room"><strong>{examRoomItems.join(" · ")}</strong><p style={{ margin: "8px 0 0" }}>Exam practice does not replace the Course Book and is not where normal daily assignments are submitted.</p></InfoCard>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
            <InfoCard icon="📈" title="Results">Read scores, corrections and improvement advice before starting another assignment.</InfoCard>
            {config.selfLearning ? null : <InfoCard icon="📍" title="Attendance">Use the session check-in link or QR code and review your record on Attendance.</InfoCard>}
            <InfoCard icon="🤖" title="Falowen AI">Use AI to practise and improve your own answer. Do not copy blindly.</InfoCard>
            <InfoCard icon="🔔" title="Notifications">Open Account and enable notifications for scores, reminders and announcements.</InfoCard>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/campus/course" style={{ ...styles.primaryButton, textDecoration: "none" }}>Open Course Book</a>
            <a href="/exams/question" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Exams Room</a>
            <a href="/campus/results" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Results</a>
          </div>
          <PreparedCheckbox checked={prepared.navigation} onChange={setPreparedFor("navigation")} />
        </section>
      ) : null}

      {activeTab === "test" ? (
        <section style={card}>
          <h2 style={{ margin: 0, color: palette.ink }}>4. {config.testTitle}</h2>
          <p style={{ margin: 0, color: palette.muted, lineHeight: 1.7 }}>{config.testIntro}</p>
          <InfoCard icon="ℹ️" title="How to use the result" tone="amber">Answer every question. A score of <strong>{config.threshold}% or higher</strong> shows good readiness; a lower score means you should revise the corrected topics before Day 1.</InfoCard>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <strong>Progress: {answeredCount}/{questions.length}</strong>
            {testComplete ? <strong style={{ color: passedReadiness ? palette.green : palette.amber }}>Score: {score}/{questions.length} · {percent}%</strong> : null}
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {questions.map((question, index) => <QuestionCard key={question.question} item={question} index={index} selected={answers[index]} onSelect={answerQuestion} />)}
          </div>
          {testComplete ? (
            <InfoCard icon={passedReadiness ? "✅" : "📚"} title={passedReadiness ? "Readiness test complete" : "Revision recommended"} tone={passedReadiness ? "green" : "amber"}>
              {passedReadiness ? `Well done. You reached ${percent}%. Review any wrong answers before Day 1.` : `You reached ${percent}%. Revise the corrected topics before beginning ${config.level}.`}
            </InfoCard>
          ) : null}
          <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => setAnswers({})}>Restart readiness test</button>
        </section>
      ) : null}

      {activeTab === "advice" ? (
        <section style={card}>
          <h2 style={{ margin: 0, color: palette.ink }}>5. Advice for succeeding at {config.level}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            <InfoCard icon="⏰" title="Prepare early" tone="blue">Open the lesson before class or practice and prepare speaking or writing ideas.</InfoCard>
            <InfoCard icon="✍️" title="Send quality work">Submit clean final answers, not rough notes, and check every requested part.</InfoCard>
            <InfoCard icon="🔁" title="Use corrections">Read tutor or AI feedback, correct weak sentences and reuse improved structures.</InfoCard>
            <InfoCard icon="🏅" title="Pass and completion" tone="green">The assignment pass mark is 60%. Completion depends on required work, not only attendance or opening lessons.</InfoCard>
            <InfoCard icon="🗣️" title="Speak actively">Mistakes are part of learning. Participate instead of waiting for perfect German.</InfoCard>
            <InfoCard icon="🧠" title="Use AI responsibly">Ask for explanations and feedback, then produce the final answer in your own words.</InfoCard>
          </div>
          <PreparedCheckbox checked={prepared.advice} onChange={setPreparedFor("advice")} label="I read and understood the study advice." />
        </section>
      ) : null}

      {activeTab === "finish" ? (
        <section style={card}>
          <h2 style={{ margin: 0, color: palette.ink }}>6. Finish Day 0</h2>
          <InfoCard icon="ℹ️" title="No graded Day 0 assignment" tone="blue">Day 0 is orientation and readiness checking. You do not submit a normal writing, reading or listening assignment for this page.</InfoCard>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
            {[["Welcome", prepared.welcome], ["Course Book", prepared.course], ["Navigation", prepared.navigation], ["Readiness test", testComplete], ["Advice", prepared.advice]].map(([label, complete]) => (
              <div key={label} style={{ border: `1px solid ${complete ? "#86efac" : palette.border}`, background: complete ? palette.greenSoft : "#fff", borderRadius: 14, padding: 13 }}>
                <strong style={{ color: complete ? "#166534" : palette.ink }}>{complete ? "✅" : "⬜"} {label}</strong>
              </div>
            ))}
          </div>
          <div style={{ border: `1px solid ${readyForDay1 ? "#86efac" : "#fde68a"}`, background: readyForDay1 ? palette.greenSoft : palette.amberSoft, borderRadius: 16, padding: 16, display: "grid", gap: 7 }}>
            <strong style={{ color: readyForDay1 ? "#166534" : "#92400e", fontSize: 19 }}>{readyForDay1 ? `Day 0 complete — welcome to ${config.level}` : `${completedCount}/5 orientation parts complete`}</strong>
            <span style={{ color: palette.muted }}>{readyForDay1 ? `Readiness score: ${score}/${questions.length} (${percent}%). Review corrections and begin Day 1.` : "Complete the unfinished sections before starting Day 1."}</span>
          </div>
          <a href={config.nextLink} style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content", opacity: readyForDay1 ? 1 : 0.6 }} aria-disabled={!readyForDay1}>{config.nextLabel}</a>
        </section>
      ) : null}
    </div>
  );
};

export default CurrentDay0OrientationPage;
