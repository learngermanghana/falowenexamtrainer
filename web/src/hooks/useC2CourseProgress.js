import { useEffect, useMemo, useState } from "react";
import { collection, db, onSnapshot } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { C2_SKILL_DAYS, getC2SkillFocus } from "../data/c2SkillCycle";
import { getC2ListeningPractice } from "../data/c2ListeningPractice";
import { getC2ReadingPractice } from "../data/c2ReadingPractice";

export const buildC2DayProgress = (day, data = {}) => {
  const progress = data?.progress && typeof data.progress === "object" ? data.progress : {};
  const skillFocus = getC2SkillFocus(day);
  const listeningAvailable = skillFocus === "hoeren"
    ? Boolean(String(getC2ListeningPractice(day)?.audioUrl || "").trim())
    : true;

  const skillDone = skillFocus === "lesen"
    ? Boolean(progress.lesenDone)
    : skillFocus === "hoeren"
      ? Boolean(progress.hoerenDone)
      : skillFocus === "speak"
        ? Boolean(progress.speakDone)
        : skillFocus === "write"
          ? Boolean(progress.writeDone)
          : false;

  const dayComplete = Boolean(
    progress.learnDone
      && progress.confidence
      && (skillFocus === "hoeren" && !listeningAvailable ? true : skillDone),
  );

  return {
    day: Number(day),
    skillFocus,
    learnDone: Boolean(progress.learnDone),
    skillDone,
    dayComplete,
    confidence: String(progress.confidence || ""),
    waitingForListeningSource: skillFocus === "hoeren" && !listeningAvailable,
    readingFirstAttemptScore: (() => {
      const practice = getC2ReadingPractice(day);
      const firstAttempts = data?.readingFirstAttempts && typeof data.readingFirstAttempts === "object"
        ? data.readingFirstAttempts
        : {};
      if (!practice?.questions?.length) return null;
      const answered = practice.questions.filter((_, index) => Number.isInteger(firstAttempts[index])).length;
      if (!answered) return null;
      const correct = practice.questions.filter((question, index) => firstAttempts[index] === question.answerIndex).length;
      return { correct, answered, total: practice.questions.length };
    })(),
  };
};

export const summarizeC2SkillProgress = (byDay = {}) =>
  Object.fromEntries(
    Object.entries(C2_SKILL_DAYS).map(([skill, days]) => [
      skill,
      {
        completed: days.filter((day) => Boolean(byDay[day]?.skillDone)).length,
        total: days.length,
        dayComplete: days.filter((day) => Boolean(byDay[day]?.dayComplete)).length,
        waitingForSource: days.filter((day) =>
          Boolean((byDay[day] || buildC2DayProgress(day, {})).waitingForListeningSource)
        ).length,
      },
    ]),
  );

export const useC2CourseProgress = ({ enabled = true } = {}) => {
  const { user } = useAuth();
  const [byDay, setByDay] = useState({});
  const [loading, setLoading] = useState(Boolean(enabled));

  useEffect(() => {
    if (!enabled || !db || !user?.uid) {
      setByDay({});
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const ref = collection(db, "users", user.uid, "c2Drafts");
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const next = Object.fromEntries(
          Array.from({ length: 28 }, (_, index) => {
            const day = index + 1;
            return [day, buildC2DayProgress(day, {})];
          }),
        );
        snapshot.docs.forEach((entry) => {
          const match = String(entry.id || "").match(/^day-(\d+)$/);
          if (!match) return;
          const day = Number(match[1]);
          if (day < 1 || day > 28) return;
          next[day] = buildC2DayProgress(day, entry.data() || {});
        });
        setByDay(next);
        setLoading(false);
      },
      () => {
        setByDay({});
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [enabled, user?.uid]);

  const summary = useMemo(() => summarizeC2SkillProgress(byDay), [byDay]);

  return { byDay, summary, loading };
};

export default useC2CourseProgress;
