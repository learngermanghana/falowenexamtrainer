import React, { useMemo, useState } from "react";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getQuickReply = (question, context) => {
  const normalized = question.toLowerCase();

  if (normalized.includes("attendance")) {
    return context.attendanceLabel === "Not synced"
      ? "Your attendance data isn't synced yet. Ask your tutor to confirm your sessions, and I'll track it here."
      : `You're currently at ${context.attendanceLabel}. Aim for the next session to keep momentum.`;
  }

  if (normalized.includes("result") || normalized.includes("score")) {
    return context.resultsLabel === "No results yet"
      ? "Once your first marked task lands, I'll summarize the trend and recommend the next focus area."
      : `Your latest result shows ${context.resultsLabel}. Want a practice plan based on that score?`;
  }

  if (normalized.includes("assignment")) {
    return context.assignmentLabel === "Awaiting recommendation"
      ? "No assignment recommendation yet. Tell me which chapter you're on, and I'll suggest the next task."
      : `Next up: ${context.assignmentLabel}. I can help you plan how to finish it.`;
  }

  return "Got it! Share what you're working on, and I'll suggest the best next step.";
};

const StudyBuddyBar = ({ studentProfile }) => {
  const [question, setQuestion] = useState("");
  const [lastAnswer, setLastAnswer] = useState("");

  const latestScore = useMemo(
    () =>
      toNumber(
        studentProfile?.latestScore ??
          studentProfile?.latestResultScore ??
          studentProfile?.score ??
          studentProfile?.lastScore
      ),
    [studentProfile]
  );
  const attendanceRate = useMemo(
    () =>
      toNumber(
        studentProfile?.attendanceRate ??
          studentProfile?.attendancePercent ??
          studentProfile?.attendancePercentage
      ),
    [studentProfile]
  );
  const attendanceSessions = studentProfile?.attendanceSessions ?? studentProfile?.attendance?.sessions ?? null;
  const assignmentLabel =
    studentProfile?.nextAssignment ||
    studentProfile?.assignmentRecommendation ||
    studentProfile?.assignmentTitle ||
    "Awaiting recommendation";

  const resultsLabel = latestScore !== null ? `${latestScore}/100` : "No results yet";
  const attendanceLabel = attendanceRate !== null ? `${Math.round(attendanceRate)}%` : attendanceSessions
    ? `${attendanceSessions} sessions`
    : "Not synced";

  const suggestions = useMemo(() => {
    const tips = [];

    if (latestScore !== null && latestScore < 60) {
      tips.push("Focus on the last marked task and redo corrections before starting a new assignment.");
    }

    if (attendanceRate !== null && attendanceRate < 80) {
      tips.push("Aim to attend the next two classes to keep your progress steady.");
    }

    if (assignmentLabel && assignmentLabel !== "Awaiting recommendation") {
      tips.push(`Plan 2 short study blocks this week to finish ${assignmentLabel}.`);
    }

    if (!tips.length) {
      tips.push("Share your current goal, and I'll build a quick weekly plan for you.");
    }

    return tips;
  }, [attendanceRate, assignmentLabel, latestScore]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    const context = { resultsLabel, attendanceLabel, assignmentLabel };
    setLastAnswer(getQuickReply(trimmed, context));
    setQuestion("");
  };

  return (
    <section className="study-buddy-bar" aria-label="Study buddy">
      <div className="study-buddy-inner">
        <div className="study-buddy-header">
          <div>
            <div className="study-buddy-title">Study Buddy</div>
            <div className="study-buddy-subtitle">
              Always-on guidance with your results, attendance, and next assignment.
            </div>
          </div>
          <div className="study-buddy-tags">
            <span className="study-buddy-tag">Results</span>
            <span className="study-buddy-tag">Attendance</span>
            <span className="study-buddy-tag">Assignments</span>
            <span className="study-buddy-tag">Quick Q&amp;A</span>
          </div>
        </div>

        <div className="study-buddy-grid">
          <div className="study-buddy-card">
            <div className="study-buddy-label">Latest result</div>
            <div className="study-buddy-value">{resultsLabel}</div>
            <div className="study-buddy-helper">Track progress after each marked task.</div>
          </div>
          <div className="study-buddy-card">
            <div className="study-buddy-label">Attendance</div>
            <div className="study-buddy-value">{attendanceLabel}</div>
            <div className="study-buddy-helper">Stay consistent to improve faster.</div>
          </div>
          <div className="study-buddy-card">
            <div className="study-buddy-label">Next assignment</div>
            <div className="study-buddy-value">{assignmentLabel}</div>
            <div className="study-buddy-helper">Based on your latest submissions.</div>
          </div>
        </div>

        <div className="study-buddy-lower">
          <div className="study-buddy-suggestions">
            <div className="study-buddy-label">Suggestions</div>
            <ul>
              {suggestions.map((tip, index) => (
                <li key={`tip-${index}`}>{tip}</li>
              ))}
            </ul>
          </div>
          <form className="study-buddy-qa" onSubmit={handleSubmit}>
            <label className="study-buddy-label" htmlFor="study-buddy-question">
              Ask a quick question
            </label>
            <div className="study-buddy-input-row">
              <input
                id="study-buddy-question"
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="e.g. What should I revise for the next class?"
              />
              <button type="submit">Send</button>
            </div>
            {lastAnswer ? <div className="study-buddy-answer">{lastAnswer}</div> : null}
          </form>
        </div>
      </div>
    </section>
  );
};

export default StudyBuddyBar;
