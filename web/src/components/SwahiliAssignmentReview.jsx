import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, doc, getDoc } from "../firebase";
import { saveSwahiliWorkbook } from "../services/swahiliWorkbookService";
import { getCurrentSwahiliReview } from "../utils/swahiliWorkbookReview";
import { canSubmitSwahiliWorkbook } from "../utils/campusProgram";
import { isLegacySwahiliDayFourSubmission, swahiliDayFourDraftVersion } from "../utils/swahiliDayFourVersion";
import SwahiliReviewDraft, { SwahiliFinalSubmit, useSwahiliReviewDraft } from "./SwahiliReviewDraft";

export function useSwahiliAssignment(lesson, preview, activeTab, readingQuestions, listeningQuestions = []) {
  const { user, studentProfile } = useAuth();
  const canSubmit = canSubmitSwahiliWorkbook({ user, studentProfile, preview });
  const [writing, setWriting] = useState("");
  const [reading, setReading] = useState({});
  const [listeningAnswers, setListeningAnswers] = useState({});
  const [submission, setSubmission] = useState("idle");
  const [submittedAnswers, setSubmittedAnswers] = useState("");
  const [legacyReadingSubmission, setLegacyReadingSubmission] = useState(false);
  const answers = { writing, reading, listeningAnswers };
  const restoreDraft = useCallback(draft => {
    setWriting(typeof draft.writing === "string" ? draft.writing : "");
    setReading(draft.reading || {});
    setListeningAnswers(draft.listeningAnswers || {});
  }, []);
  const draft = useSwahiliReviewDraft(canSubmit ? user.uid : null, lesson.day, answers, restoreDraft,
    swahiliDayFourDraftVersion(lesson.day));
  const snapshot = JSON.stringify(answers);
  const submitted = submittedAnswers === snapshot;
  const [feedback, setFeedback] = useState("");
  const uid = user?.uid;
  const day = lesson.day;
  useEffect(() => {
    if (!canSubmit || !db || activeTab !== "submit") return;
    let active = true;
    async function restoreSubmission() {
      const work = (await getDoc(doc(db, "users", uid, "swahiliLessons", `day-${day}`))).data();
      if (!active || work?.status !== "submitted") return;
      const previous = {
        writing: work.writing?.[day === 11 ? "dialogue" : "response"] || "",
        reading: work.readingAnswers || {}, listeningAnswers: work.listeningAnswers || {},
      };
      if (isLegacySwahiliDayFourSubmission(day, work)) {
        // Day 4 reading IDs were reused after replacing a 3-question, ungraded
        // short-answer exercise. Do not present old responses as new answers.
        setLegacyReadingSubmission(true);
        setSubmittedAnswers("");
        setFeedback("");
        setWriting(value => value || previous.writing);
        return;
      }
      setLegacyReadingSubmission(false);
      setWriting(value => value || previous.writing);
      setReading(value => ({ ...previous.reading, ...value }));
      setListeningAnswers(value => ({ ...previous.listeningAnswers, ...value }));
      setSubmittedAnswers(JSON.stringify(previous));
      const review = await getDoc(doc(db, "swahiliTeacherReviews", `${uid}_day-${day}`));
      if (active) setFeedback(getCurrentSwahiliReview(work, review.data())?.feedback || "");
    }
    restoreSubmission().catch(() => {});
    return () => { active = false; };
  }, [uid, day, canSubmit, activeTab]);

  function answered(questions, values) {
    return questions.every(({ id, choices }) => choices ? choices.includes(values[id]) : !!values[id]?.trim());
  }
  const complete = writing.trim() && answered(readingQuestions, reading) && answered(listeningQuestions, listeningAnswers);

  async function submitWork() {
    if (!canSubmit || !complete || !db || submitted || submission === "sending") return;
    setSubmission("sending");
    try {
      await saveSwahiliWorkbook(user, {
        studentId: user.uid, userId: user.uid, program: "swahili", level: "A1",
        day: lesson.day, lessonId: `swahili-day-${lesson.day}`, title: lesson.title,
        status: "submitted", writing: { [lesson.day === 11 ? "dialogue" : "response"]: writing.trim() },
        ...(lesson.day === 4 ? { readingVersion: 2 } : {}), readingAnswers: reading,
        listeningAnswers, listeningTeacherLed: false, 
        studentName: studentProfile?.name || studentProfile?.displayName || user.displayName || "",
        studentEmail: user.email || "",
      });
      setFeedback("");
      setLegacyReadingSubmission(false);
      setSubmittedAnswers(snapshot);
      setSubmission("idle");
    } catch {
      setSubmission("error");
    }
  }

  return { writing, setWriting, reading, setReading, listeningAnswers, setListeningAnswers,
    readingQuestions, listeningQuestions, draft, canSubmit, complete, submission, submitted, feedback,
    legacyReadingSubmission, submitWork };
}

export default function SwahiliAssignmentReview({ assignment }) {
  const { writing, reading, listeningAnswers, readingQuestions, listeningQuestions,
    draft, canSubmit, complete, submission, submitted, feedback, legacyReadingSubmission, submitWork } = assignment;
  return <>
    <h2>Review &amp; Submit · Wasilisha</h2>
    {legacyReadingSubmission && <p role="status">You previously submitted Day 4 with the older three-question reading task. Your earlier result remains in <Link to="/campus/results">Campus Results</Link>. Complete the new five Lesen and five Hören questions for a new tutor-marked submission.</p>}
    <SwahiliReviewDraft writing={{ Kuandika: writing }} questions={readingQuestions}
      reading={reading} listening={listeningAnswers} listeningQuestions={listeningQuestions}
      draft={canSubmit ? draft : null} />
    {canSubmit ? <>
      {!complete && <p>Complete your writing and all questions in the assigned sections before submitting.</p>}
      <SwahiliFinalSubmit requireListening={listeningQuestions.length > 0} disabled={!complete || !db || submission === "sending" || submitted} onSubmit={submitWork}>
        {submission === "sending" ? "Submitting…" : "Wasilisha kazi · Submit to tutor"}
      </SwahiliFinalSubmit>
      {feedback && <p><strong>Tutor feedback</strong> {feedback}</p>}
      {submitted && <p role="status">Submitted for tutor review. <Link to="/campus/results">View results</Link></p>}
      {submission === "error" && <p role="alert">Submission failed. Your answers are still here. Please try again.</p>}
    </> : <p>Open this lesson in your signed-in Kiswahili Campus to submit.</p>}
  </>;
}
