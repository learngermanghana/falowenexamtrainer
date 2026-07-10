import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const day0HeroImage =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80";

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

const defaultTodayTasks = [
  "Read how the current Course Book works for your level.",
  "Understand the new Campus and Exams Room navigation.",
  "Learn where assignments are submitted.",
  "Read the study advice and enable notifications.",
  "Complete the final knowledge test from your previous level.",
  "Review every correction before starting Day 1.",
];

const listStyle = {
  margin: 0,
  paddingLeft: 22,
  display: "grid",
  gap: 7,
  lineHeight: 1.65,
};

const SectionCard = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { background: "#eff6ff", border: "#bfdbfe", color: "#1e3a8a" },
    green: { background: "#f0fdf4", border: "#bbf7d0", color: "#166534" },
    amber: { background: "#fffbeb", border: "#fde68a", color: "#92400e" },
  };
  const selected = tones[tone] || tones.blue;

  return (
    <div
      style={{
        border: `1px solid ${selected.border}`,
        background: selected.background,
        color: selected.color,
        borderRadius: 12,
        padding: 14,
        lineHeight: 1.65,
      }}
    >
      {children}
    </div>
  );
};

const QuestionCard = ({ item, index, selected, onSelect }) => (
  <li style={{ display: "grid", gap: 8 }}>
    <p style={{ margin: 0, fontWeight: 700 }}>
      {index + 1}. {item.question}
    </p>

    <div style={{ display: "grid", gap: 6 }}>
      {item.options.map((option, optionIndex) => {
        const isCorrect = selected !== undefined && optionIndex === item.answer;
        const isWrong = selected === optionIndex && optionIndex !== item.answer;

        return (
          <button
            key={`${item.question}-${option}`}
            type="button"
            onClick={() => onSelect(index, optionIndex)}
            style={{
              ...styles.secondaryButton,
              textAlign: "left",
              justifyContent: "flex-start",
              borderColor: isCorrect ? "#16a34a" : isWrong ? "#dc2626" : undefined,
              background: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : undefined,
            }}
          >
            {String.fromCharCode(65 + optionIndex)}) {option}
          </button>
        );
      })}
    </div>

    {selected !== undefined ? (
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
        <strong>{selected === item.answer ? "Correct." : "Not correct."}</strong>{" "}
        Correct answer: {String.fromCharCode(65 + item.answer)}. {item.explanation}
      </p>
    ) : null}
  </li>
);

const CurrentDay0OrientationPage = ({ config }) => {
  const [answers, setAnswers] = useState({});
  const questions = config.questions || [];
  const answeredCount = Object.keys(answers).length;
  const testComplete = questions.length > 0 && answeredCount === questions.length;
  const score = useMemo(
    () =>
      questions.reduce(
        (total, question, index) => total + (answers[index] === question.answer ? 1 : 0),
        0
      ),
    [answers, questions]
  );
  const percent = testComplete ? Math.round((score / questions.length) * 100) : 0;
  const passedReadiness = testComplete && percent >= config.threshold;
  const introText =
    config.introText ||
    "Day 0 is not a graded assignment. It helps you understand the current Falowen workflow, check the knowledge from your previous level and prepare properly for Day 1.";
  const todayTasks = config.todayTasks || defaultTodayTasks;
  const submitNoteTitle = config.submitNoteTitle || "Submit directly inside the Course Book.";
  const submitNoteText = config.submitNoteText || null;
  const finishText =
    config.finishText ||
    "There is no normal assignment submission for Day 0. Finish the knowledge test, review the corrections and continue to Day 1.";
  const testAdvice =
    config.testAdvice ||
    "Answer every question. A score of";

  const answerQuestion = (index, optionIndex) => {
    setAnswers((old) => ({ ...old, [index]: optionIndex }));
  };

  return (
    <div
      data-current-day0-orientation={config.level}
      style={{ ...styles.container, display: "grid", gap: 16 }}
    >
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          {config.level} Day 0 Workbook: Orientation + Knowledge Test
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>{config.subtitle}</p>

        <img
          src={day0HeroImage}
          alt={`${config.level} Day 0 orientation`}
          style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12 }}
        />
      </div>

      <SectionCard title={`Congratulations on starting ${config.level}`}>
        <NoteBox tone="green">
          <strong>This is an important step in your German journey.</strong> Be proud of the
          progress that brought you here. Start with confidence, stay consistent, participate
          actively and do not be afraid of mistakes. Mistakes show you what to improve.
        </NoteBox>
        <p style={{ margin: 0, lineHeight: 1.65 }}>{introText}</p>
      </SectionCard>

      <SectionCard title="Day 0 Orientation">
        <p style={{ margin: 0 }}>
          <strong>Chapter:</strong> Orientation
        </p>
        <p style={{ margin: 0 }}>
          <strong>Activity type:</strong> Practice and readiness check
        </p>
        <p style={{ margin: 0 }}>
          <strong>Marking:</strong> Immediate self-check
        </p>
        <p style={{ margin: 0 }}>
          <strong>Status:</strong> Complete after reading the guide and answering every question
        </p>
        <p style={{ margin: 0 }}>
          <strong>Pass guidance:</strong> {config.threshold}% or higher shows good readiness
        </p>
      </SectionCard>

      <SectionCard title="What you must do today">
        <ol style={listStyle}>
          {todayTasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ol>
      </SectionCard>

      <SectionCard title="How the current Course Book works">
        <NoteBox>
          <strong>Your learning flow:</strong> {config.courseFlow}
        </NoteBox>

        <ul style={listStyle}>
          {config.courseNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>

        <NoteBox tone="green">
          {submitNoteText ? (
            <>
              <strong>{submitNoteTitle}</strong> {submitNoteText}
            </>
          ) : config.selfLearning ? (
            <>
              <strong>For B2 self-learning:</strong> complete Learn, Speak, Write and Finish,
              improve your work with feedback, and record your confidence honestly. The normal
              daily B2 flow does not use tutor assignment submission.
            </>
          ) : (
            <>
              <strong>Submit directly inside the Course Book.</strong> Open the assignment
              workbook and use its Submit tab. The correct day and assignment are selected
              automatically. Do not use old Google Drive links and do not search for a separate
              student submission page.
            </>
          )}
        </NoteBox>
      </SectionCard>

      <SectionCard title="Current Falowen navigation">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          From Falowen Home, choose <strong>Campus</strong> for your course, progress and class
          tools. Choose <strong>Exams Room</strong> for separate exam-style practice.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 12,
          }}
        >
          <NoteBox>
            <strong>Campus</strong>
            <br />
            {config.campusItems.join(" · ")}
            <br />
            <span style={{ fontSize: 14 }}>
              Use the Course Book for normal daily learning and assignment submission.
            </span>
          </NoteBox>

          <NoteBox tone="amber">
            <strong>Exams Room</strong>
            <br />
            {examRoomItems.join(" · ")}
            <br />
            <span style={{ fontSize: 14 }}>
              The Exams Room supports exam practice. It does not replace the Course Book and is
              not where normal daily assignments are submitted.
            </span>
          </NoteBox>
        </div>

        <ul style={listStyle}>
          <li>
            <strong>Results:</strong> read your score, tutor corrections and improvement advice
            before starting another assignment.
          </li>
          {!config.selfLearning ? (
            <li>
              <strong>Attendance:</strong> use the class check-in link or QR code and review your
              attendance record.
            </li>
          ) : null}
          <li>
            <strong>Falowen AI:</strong> practise and improve your own answer. Do not copy AI
            answers blindly.
          </li>
          <li>
            <strong>Notifications:</strong> open Account and enable notifications for scores,
            reminders and important announcements.
          </li>
        </ul>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href="/campus/course"
            style={{ ...styles.primaryButton, textDecoration: "none" }}
          >
            Open Course Book
          </a>
          <a
            href="/exams/question"
            style={{ ...styles.secondaryButton, textDecoration: "none" }}
          >
            Open Exams Room
          </a>
          <a
            href="/campus/results"
            style={{ ...styles.secondaryButton, textDecoration: "none" }}
          >
            Open Results
          </a>
        </div>
      </SectionCard>

      <SectionCard title={`Advice for succeeding at ${config.level}`}>
        <ul style={listStyle}>
          <li>Open the lesson before class or study time and prepare your ideas early.</li>
          <li>Complete every requested part and submit clean final answers, not rough notes.</li>
          <li>Read feedback carefully, correct weak sentences and reuse improved structures.</li>
          <li>The assignment pass mark is 60%. Completion depends on required work, not only attendance.</li>
          <li>Speak actively. Waiting for perfect German will slow your progress.</li>
          <li>Use Falowen AI for explanations and practice, then write the final answer in your own words.</li>
        </ul>
      </SectionCard>

      <SectionCard title={config.testTitle}>
        <p style={{ margin: 0, lineHeight: 1.65 }}>{config.testIntro}</p>

        <NoteBox tone="amber">
          {testAdvice} <strong>{config.threshold}% or higher</strong> shows
          good readiness. A lower score means you should revise the corrected topics before Day 1.
        </NoteBox>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <strong>
            Progress: {answeredCount}/{questions.length}
          </strong>
          {testComplete ? (
            <strong style={{ color: passedReadiness ? "#166534" : "#92400e" }}>
              Score: {score}/{questions.length} · {percent}%
            </strong>
          ) : null}
        </div>

        <ol style={{ ...listStyle, gap: 18 }}>
          {questions.map((question, index) => (
            <QuestionCard
              key={question.question}
              item={question}
              index={index}
              selected={answers[index]}
              onSelect={answerQuestion}
            />
          ))}
        </ol>

        {testComplete ? (
          <NoteBox tone={passedReadiness ? "green" : "amber"}>
            <strong>
              {passedReadiness ? "Knowledge test complete." : "Revision recommended."}
            </strong>{" "}
            {passedReadiness
              ? `Well done. You reached ${percent}%. Review any wrong answers before Day 1.`
              : `You reached ${percent}%. Revise the corrected topics before beginning ${config.level}.`}
          </NoteBox>
        ) : null}

        <button
          type="button"
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => setAnswers({})}
        >
          Restart knowledge test
        </button>
      </SectionCard>

      <SectionCard title="Finish Day 0">
        <p style={{ margin: 0, lineHeight: 1.65 }}>{finishText}</p>

        {testComplete ? (
          <NoteBox tone={passedReadiness ? "green" : "amber"}>
            <strong>
              {passedReadiness
                ? `Day 0 complete — welcome to ${config.level}.`
                : "Day 0 complete — revise before Day 1."}
            </strong>{" "}
            Your readiness score is {score}/{questions.length} ({percent}%).
          </NoteBox>
        ) : (
          <NoteBox tone="amber">
            Complete all {questions.length} questions before moving to Day 1.
          </NoteBox>
        )}

        <a
          href={config.nextLink}
          style={{
            ...styles.primaryButton,
            textDecoration: "none",
            width: "fit-content",
            opacity: testComplete ? 1 : 0.6,
            pointerEvents: testComplete ? "auto" : "none",
          }}
          aria-disabled={!testComplete}
        >
          {config.nextLabel}
        </a>
      </SectionCard>
    </div>
  );
};

export default CurrentDay0OrientationPage;
