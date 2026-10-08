import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import { EXAM_SKILLS, buildExamRoomCoach } from "../lib/examRoomCoach";
import { getReadingPracticeHistory, getReadingPracticeStudentKey } from "../services/readingPracticeHistory";
import {
  getLocalDailyWarmup,
  loadDailyWarmupProgress,
  loadExamRoomResults,
} from "../services/examRoomDashboardService";

const sectionIcons = { lesen: "📖", hoeren: "🎧", schreiben: "✍️", sprechen: "🎤" };
const smallLabel = { color: "#475569", fontSize: 13, margin: 0 };
const secondaryButton = {
  ...styles.secondaryButton, minHeight: 42, borderRadius: 10,
  fontWeight: 700, cursor: "pointer",
};
const actionButton = {
  ...styles.primaryButton, minHeight: 42, borderRadius: 10,
  fontWeight: 700, cursor: "pointer",
};
const readableDate = (value) => {
  const date = new Date(value || "");
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "";
};

export default function ExamsOverviewPage() {
  const navigate = useNavigate();
  const { level } = useExam();
  const { user, idToken, studentProfile } = useAuth();
  const currentLevel = String(level || "A1").toUpperCase();
  const [cloudResults, setCloudResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadIssue, setLoadIssue] = useState("");
  const [limited, setLimited] = useState(false);
  const [dailyCloudStatus, setDailyCloudStatus] = useState(null);
  const localReading = useMemo(() => getReadingPracticeHistory(
    currentLevel, getReadingPracticeStudentKey({ user, studentProfile }),
  ), [currentLevel, user, studentProfile]);
  const localDaily = getLocalDailyWarmup(currentLevel);
  const dailyDone = Boolean(localDaily.practised || dailyCloudStatus?.practised);
  const coach = useMemo(
    () => buildExamRoomCoach({ level: currentLevel, cloudResults, localReading }),
    [currentLevel, cloudResults, localReading],
  );

  useEffect(() => {
    let cancelled = false;
    setCloudResults([]);
    setDailyCloudStatus(null);
    setLimited(false);
    setLoadIssue("");
    if (!idToken || !user?.uid) return undefined;

    setLoading(true);
    loadExamRoomResults({ idToken, level: currentLevel })
      .then(({ results, limited: wasLimited }) => {
        if (cancelled) return;
        setCloudResults(results);
        setLimited(wasLimited);
      })
      .catch(() => {
        if (!cancelled) setLoadIssue("Cloud results are temporarily unavailable. Lesen history from this device may still appear.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    loadDailyWarmupProgress({ userId: user.uid, level: currentLevel })
      .then((progress) => { if (!cancelled) setDailyCloudStatus(progress); })
      .catch(() => { /* Local warm-up progress remains usable offline. */ });

    return () => { cancelled = true; };
  }, [currentLevel, idToken, user?.uid]);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <section style={{
        ...styles.card, margin: 0, padding: "22px 20px", color: "#ffffff",
        background: "linear-gradient(125deg, #0f172a, #1e40af)", border: 0,
      }}>
        <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>
          FALOWEN · YOUR EXAM ROOM
        </p>
        <h2 style={{ margin: "0 0 8px", fontSize: "clamp(23px, 4vw, 30px)" }}>
          Prepare for your {currentLevel} Goethe exam
        </h2>
        <p style={{ margin: "0 0 18px", opacity: 0.9, lineHeight: 1.5, maxWidth: 660 }}>
          Practise a little each day, understand your mistakes and see how your skills improve.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <div style={{
            padding: "12px 16px", background: "rgba(255,255,255,0.12)",
            borderRadius: 12, minWidth: 130,
          }}>
            <strong style={{ display: "block", fontSize: 23 }}>{coach.attempts.length}</strong>
            <span style={{ fontSize: 12 }}>Scored practices</span>
          </div>
          <div style={{
            padding: "12px 16px", background: "rgba(255,255,255,0.12)",
            borderRadius: 12, minWidth: 130,
          }}>
            <strong style={{ display: "block", fontSize: 23 }}>{coach.coveredSkills}/4</strong>
            <span style={{ fontSize: 12 }}>Skills practised</span>
          </div>
          <div style={{
            padding: "12px 16px", background: "rgba(255,255,255,0.12)",
            borderRadius: 12, minWidth: 130,
          }}>
            <strong style={{ display: "block", fontSize: 23 }}>
              {coach.latest ? `${coach.latest.percent}%` : "—"}
            </strong>
            <span style={{ fontSize: 12 }}>Latest practice score</span>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12, marginBottom: 7 }}>
            <span>Practice coverage across exam skills</span>
            <strong>{coach.coveragePercent}%</strong>
          </div>
          <div
            role="progressbar" aria-label="Exam skill practice coverage"
            aria-valuenow={coach.coveragePercent} aria-valuemin={0} aria-valuemax={100}
            style={{ background: "rgba(255,255,255,0.24)", height: 8, borderRadius: 999, overflow: "hidden" }}
          >
            <div style={{ width: `${coach.coveragePercent}%`, background: "#93c5fd", height: "100%", borderRadius: 999 }} />
          </div>
          <p style={{ fontSize: 12, margin: "7px 0 0", opacity: 0.85 }}>
            Coverage means you have recorded a practice result, not that you have passed the exam.
          </p>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))", gap: 14 }}>
        <section style={{ ...styles.card, margin: 0, display: "grid", gap: 10, alignContent: "start" }}>
          <p style={{ ...smallLabel, textTransform: "uppercase", fontWeight: 800 }}>Your daily warm-up</p>
          <h3 style={{ margin: 0, fontSize: 20 }}>{dailyDone ? "Great work today!" : "A little German every day"}</h3>
          <p style={{ ...smallLabel, lineHeight: 1.55 }}>
            {dailyDone
              ? "Today's warm-up is recorded. You can review it or practise another skill."
              : localDaily.hasDraft
                ? "Your saved warm-up draft is here. Continue where you left off."
                : "Start a short writing or speaking task chosen for your level."}
          </p>
          <button type="button" style={actionButton} onClick={() => navigate("/exams/question")}>
            {dailyDone ? "Review today's warm-up" : localDaily.hasDraft ? "Continue warm-up →" : "Start today's warm-up →"}
          </button>
        </section>

        <section style={{ ...styles.card, margin: 0, display: "grid", gap: 10, alignContent: "start", borderColor: "#bfdbfe" }}>
          <p style={{ ...smallLabel, textTransform: "uppercase", fontWeight: 800 }}>Recommended next</p>
          <h3 style={{ margin: 0, fontSize: 20 }}>
            {sectionIcons[coach.focus.key]} {coach.focus.title} practice
          </h3>
          <p style={{ ...smallLabel, lineHeight: 1.55 }}>{coach.focus.reason}</p>
          {coach.focus.weakPart ? (
            <p style={{ ...smallLabel, fontWeight: 700 }}>Focus on {coach.focus.weakPart} when reviewing.</p>
          ) : null}
          <button type="button" style={actionButton} onClick={() => navigate(coach.focus.route)}>
            Practise {coach.focus.title} →
          </button>
        </section>
      </div>

      <section style={{ ...styles.card, margin: 0 }}>
        <h3 style={{ margin: "0 0 6px" }}>Practise the four exam skills</h3>
        <p style={{ ...smallLabel, marginBottom: 14 }}>Choose a skill, or follow your recommended next practice.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))", gap: 10 }}>
          {EXAM_SKILLS.map((skill) => {
            const last = coach.latestBySection[skill.key];
            return (
              <article key={skill.key} style={{
                border: "1px solid #e2e8f0", borderRadius: 12, padding: 14,
                display: "grid", gap: 8, alignContent: "space-between",
              }}>
                <div>
                  <span style={{ fontSize: 23 }} aria-hidden="true">{sectionIcons[skill.key]}</span>
                  <h4 style={{ margin: "7px 0 3px", fontSize: 17 }}>{skill.title}</h4>
                  <p style={smallLabel}>{skill.description}</p>
                </div>
                <p style={{ ...smallLabel, fontWeight: 700 }}>
                  {last ? `Latest: ${last.percent}%` : "No scored practice yet"}
                </p>
                <button type="button" style={secondaryButton} onClick={() => navigate(skill.path)}>
                  {last ? "Practise again" : "Start practice"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section style={{ ...styles.card, margin: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h3 style={{ margin: "0 0 4px" }}>Your recent practice</h3>
            <p style={smallLabel}>Recorded scores help you see your progress over time.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" style={secondaryButton} onClick={() => navigate("/exams/mocks")}>
              Open mock exams →
            </button>
            <button type="button" style={secondaryButton} onClick={() => navigate("/exams/file")}>
              Review your Exam File →
            </button>
          </div>
        </div>
        {loading ? <p style={smallLabel}>Loading saved practice results…</p> : null}
        {loadIssue ? <p role="status" style={{ ...smallLabel, marginTop: 10, color: "#92400e" }}>{loadIssue}</p> : null}
        {limited ? <p style={smallLabel}>Showing recent results from a limited history window.</p> : null}
        {coach.attempts.length ? (
          <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
            {coach.attempts.slice(0, 5).map((attempt, index) => (
              <div key={attempt.id || `${attempt.section}-${index}`}
                style={{
                  border: "1px solid #e2e8f0", padding: "10px 12px", borderRadius: 10,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  flexWrap: "wrap", gap: 8,
                }}>
                <div style={{ minWidth: 0 }}>
                  <strong>{EXAM_SKILLS.find((skill) => skill.key === attempt.section)?.title}</strong>
                  <p style={{ ...smallLabel, marginTop: 3 }}>{readableDate(attempt.completedAt)} · {attempt.title}</p>
                </div>
                <strong>{attempt.percent}%</strong>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ ...smallLabel, marginTop: 14 }}>
            No scored practice recorded yet. Start with today's warm-up or one of the exam skills above.
          </p>
        )}
      </section>
    </div>
  );
}
