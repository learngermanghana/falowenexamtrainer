import React from "react";
import { Link } from "react-router-dom";
import trialExams from "../../../functions/functionz/trialExams.json";
import { getMockExam, getMockExamsForLevel } from "../data/mockExamCatalog";
import { getLessonsByLevel } from "../data/lessonCatalog";
import { getTrialLifecycleState } from "../lib/trialAccess";

export function courseTrial(profile) {
  if (!profile || profile.accountType === "exam_only" || profile.program === "swahili" ||
      profile.isTutor || ["admin", "tutor"].includes(profile.role) || !trialExams[profile.level]) return null;
  const state = getTrialLifecycleState(profile);
  return state.active || ["ending_soon", "expired_retained", "retention_ending_soon", "purge_due"].includes(state.key) ? state : null;
}

function firstDayRoutes(level) {
  const prefix = "/campus/course/";
  const routes = new Set([prefix + "lesson/" + level + "/1"]);
  for (const lesson of getLessonsByLevel(level).filter(item => item.day === 1)) {
    for (const path of [lesson.grammarPage, lesson.workbookRoute]) {
      if (path?.startsWith(prefix)) routes.add(path.split("?")[0]);
    }
    if (level === "A1") {
      routes.add(prefix + lesson.chapter);
      routes.add(prefix + "lesson/A1/chapter/" + lesson.chapter);
    }
  }
  const extra = {
    A2: ["a2-day-1-small-talk-workbook"],
    B2: ["b2-self-learning/day-1", "b2-day-1-persoenliche-identitaet-und-selbstverstaendnis-workbook", "b2-day-1-persoenliche-identitaet-und-selbstverstaendnis-grammar-notes"],
    C1: ["c1-self-learning/day-1", "c1-day-1-willkommen-selbstlernstart-workbook"],
  };
  for (const path of extra[level] || []) routes.add(prefix + path);
  return routes;
}

export function TrialCoursePage({ level, path, active, endsAtMs, children }) {
  const [clock, setClock] = React.useState(Date.now);
  React.useEffect(() => {
    if (!active || !Number.isFinite(endsAtMs) || endsAtMs <= clock) return undefined;
    const timer = setTimeout(() => setClock(Date.now()), Math.min(2147483647, Math.max(1, endsAtMs - Date.now())));
    return () => clearTimeout(timer);
  }, [active, endsAtMs, clock]);
  active = active && (!Number.isFinite(endsAtMs) || Date.now() < endsAtMs);
  if (active && firstDayRoutes(level).has(path)) return children;
  const home = path === "/campus/course";
  return <main style={{ padding: 24 }}>
    <h1>{home ? level + " Course Book" : "Unlock the full course"}</h1>
    {active && <p><Link to={["B2", "C1"].includes(level) ? "/campus/course/" + level.toLowerCase() + "-self-learning/day-1" : "/campus/course/lesson/" + level + "/1"}>Open Day 1</Link></p>}
    <p>{active ? "Your trial includes Day 1. Join the full course for Day 2 onward." : "Your course trial has ended."}</p>
    {home && <ul>{[...new Set(getLessonsByLevel(level).filter(item => item.day > 1).map(item => item.day))].map(day =>
      <li key={day}>Day {day} · Full course</li>)}</ul>}
    <Link to="/campus/account?tab=billing">Join the full course</Link>
  </main>;
}

export function TrialExamPage({ level, path, children }) {
  const exam = getMockExam(trialExams[level]?.catalogId);
  if (exam && path === exam.route) return children;
  const library = ["/", "/exams", "/exams/overview", "/exams/mocks"].includes(path);
  return <main style={{ maxWidth: 720, margin: "2rem auto", padding: 20 }}>
    <h1>{library ? level + " exam trial" : "Unlock exam practice"}</h1>
    {exam && <section>
      <h2>{level === "C1" ? "C1 Reading trial" : exam.shortTitle}</h2>
      <p>Included in your trial · {exam.durationLabel}</p>
      <Link to={exam.route}>{level === "C1" ? "Open reading practice" : "Start or resume mock"}</Link>
    </section>}
    <h2>Monthly exam access</h2>
    <p>Unlock individual skill practice and all published mocks at your level.</p>
    {library && <ul>{getMockExamsForLevel(level).filter(item => item.id !== exam?.id && item.status !== "planned").map(item =>
      <li key={item.id}>{item.shortTitle || item.title} · Paid access</li>)}</ul>}
    <Link to="/mock/checkout">Get 30-day exam access</Link>
    <Link to="/mock/account">Manage course type</Link>
  </main>;
}
