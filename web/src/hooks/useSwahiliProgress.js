import { useEffect, useState } from "react";
import { db, doc, getDoc } from "../firebase";
import { loadSwahiliSubmissions } from "../utils/swahiliSubmissions";
import { getCurrentSwahiliReview } from "../utils/swahiliWorkbookReview";
import { SWAHILI_ASSIGNMENTS, reviewDocumentId, isSubmitted } from "../data/swahili/curriculumRegistry";

export function useSwahiliProgress(uid, enabled = true) {
  const [state, setState] = useState(null);
  useEffect(() => {
    if (!uid || !enabled || !db) return undefined;
    let active = true;
    loadSwahiliSubmissions(uid).then(submissions => Promise.all(SWAHILI_ASSIGNMENTS.map(async lesson => {
      const submission = submissions.get(lesson.lessonDoc);
      const submitted = isSubmitted(submission);
      const snapshot = submitted ? await getDoc(doc(db, "swahiliTeacherReviews", reviewDocumentId(uid, lesson))) : null;
      return { ...lesson, submitted, submission, review: getCurrentSwahiliReview(submission, snapshot?.data()) };
    }))).then(records => { if (active) setState({uid, records, failed: false}); })
      .catch(() => { if (active) setState({uid, records: null, failed: true}); });
    return () => { active = false; };
  }, [uid, enabled]);
  return enabled && uid && state?.uid === uid ? state : { records: null, failed: false };
}
