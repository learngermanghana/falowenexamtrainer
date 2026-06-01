import { useEffect, useMemo, useState } from "react";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { WRITING_PROMPTS } from "../data/writingExamPrompts";
import { speakingQuestionDictionary } from "../data/speakingDictionary";
import {
  isTutorReviewCloudEnabled,
  saveExamLetterForTutorReview,
  subscribeTutorReviewsForStudent,
} from "../services/tutorReviewService";
import { styles } from "../styles";

const STORAGE_KEY = "falowen_exam_warmup_progress";
const ANSWER_STORAGE_KEY = "falowen_exam_warmup_answers";
const LEGACY_STORAGE_KEY = "falowen_question_of_day_progress";
const MIN_WRITING_WORDS = 30;
const CHECKLIST_ERROR_PREFIX = "Before submitting, tick all checklist items.";
const A1_DAILY_SPEAKING_COUNT_PER_PART = 5;

const LETTER_TYPE_OPTIONS = [
  { value: "formal", label: "Formal letter/email" },
  { value: "informal", label: "Informal letter/email" },
];

const PRE_SUBMISSION_CHECKLIST = [
  "I understood the question before writing.",
  "I added a short introduction/opening sentence.",
  "I selected the correct letter type: formal or informal.",
  "I added a conclusion, closing, or Gruß.",
  "I answered every point in the task.",
  "I asked a W-question or a yes/no question where needed.",
  "I used weil correctly with the conjugated verb at the end.",
  "I made a polite request using Könnten / Können Sie bitte ...?",
];

const WRITING_GUIDE_BY_LEVEL = {
  A1: {
    minutes: "15 minutes",
    instruction:
      "Schreiben Sie zu jedem Punkt ein bis zwei Sätze in das Eingabetextfeld (ca. 30 Wörter). Schreiben Sie auch eine Anrede und einen Gruß.",
    details: "A1 Schreiben: ca. 30 Wörter, Anrede und Gruß sind Pflicht.",
  },
  A2: {
    minutes: "15 minutes",
    instruction: "Write a short message/email. Answer every point. Add a greeting and a closing.",
    details: "A2 Schreiben: short message/email, answer every point, greeting and closing required.",
  },
  B1: {
    minutes: "20 minutes",
    instruction: "Write an email/letter. Answer all points and include a reason or example.",
    details: "B1 Schreiben: email/letter, answer all points, give reason/example.",
  },
  B2: {
    minutes: "25 minutes",
    instruction: "Write a structured opinion text with arguments, examples, and a conclusion.",
    details: "B2 Schreiben: structured opinion text, arguments, examples, conclusion.",
  },
  C1: {
    minutes: "30 minutes",
    instruction: "Write an advanced argumentative text with balanced arguments and a clear conclusion.",
    details: "C1 Schreiben: advanced argumentative text, balanced argument, clear conclusion.",
  },
};

const SPEAKING_GUIDE_BY_LEVEL = {
  A1: [
    {
      teil: "Teil 1",
      rule: "Teil 1: introduce yourself.",
      doThis: "Say your name, age, country, languages, job/school, family or hobby.",
      expect: "The examiner may ask you to spell something or give a number. Speak slowly and clearly.",
    },
    {
      teil: "Teil 2",
      rule: "Teil 2: ask/answer simple questions.",
      doThis: "Use the topic and keyword to make a question, then answer your partner's question briefly.",
      expect: "A short correct question is enough. Focus on word order and clear pronunciation.",
    },
    {
      teil: "Teil 3",
      rule: "Teil 3: requests.",
      doThis: "Ask politely for something, or respond with yes/no and a short reason.",
      expect: "Use polite phrases like Bitte, Können Sie bitte ...? or Ja, gern.",
    },
  ],
  A2: [
    {
      teil: "Teil 1",
      rule: "Teil 1: intro/follow-up.",
      doThis: "Give short answers about yourself, your daily life, school, work, family, hobbies, or plans.",
      expect: "The examiner wants simple but complete answers, not long speeches.",
    },
    {
      teil: "Teil 2",
      rule: "Teil 2: exchange info.",
      doThis: "Answer the prompt, ask one simple question, and react to your partner.",
      expect: "Use everyday vocabulary and give one small reason or example.",
    },
    {
      teil: "Teil 3",
      rule: "Teil 3: plan together.",
      doThis: "Suggest time, place, activity, and one detail. Agree or disagree politely.",
      expect: "Show interaction: make suggestions, ask questions, and come to a simple decision.",
    },
  ],
  B1: [
    {
      teil: "Teil 1",
      rule: "Teil 1: plan together.",
      doThis: "Make suggestions, react to your partner, ask questions, agree, disagree, and decide together.",
      expect: "The examiner checks interaction, not memorised speech. Keep the conversation moving.",
    },
    {
      teil: "Teil 2",
      rule: "Teil 2: presentation.",
      doThis: "Use a clear structure: introduction, experience/example, opinion, situation in your country, conclusion.",
      expect: "Speak in connected sentences and give reasons. Do not only list words.",
    },
    {
      teil: "Teil 3",
      rule: "Teil 3: questions.",
      doThis: "Ask your partner one relevant question and answer the examiner/partner clearly.",
      expect: "Show that you understood the topic and can react naturally.",
    },
  ],
  B2: [
    {
      teil: "Teil 1",
      rule: "Teil 1: presentation.",
      doThis: "State the topic, compare options, give advantages/disadvantages, examples, and your opinion.",
      expect: "Use clear structure and connectors. Give reasons, not only short answers.",
    },
    {
      teil: "Teil 2",
      rule: "Teil 2: discussion.",
      doThis: "React to the other opinion, agree or disagree politely, justify your view, and suggest a solution.",
      expect: "The examiner checks interaction, argument quality, vocabulary, and fluency.",
    },
  ],
  C1: [
    {
      teil: "Teil 1",
      rule: "Teil 1: advanced presentation.",
      doThis: "Explain the issue, compare viewpoints, support your argument, and conclude clearly.",
      expect: "Use advanced connectors and precise vocabulary. Avoid memorised, empty sentences.",
    },
    {
      teil: "Teil 2",
      rule: "Teil 2: discussion/defence.",
      doThis: "Listen, respond directly, challenge politely, justify your opinion, and propose a balanced solution.",
      expect: "The examiner checks fluency, flexibility, argumentation, and interaction.",
    },
  ],
};

const REVIEW_STATUS_LABELS = {
  pending: "Waiting for tutor",
  approved: "Approved",
  needs_improvement: "Needs correction",
  redo_required: "Redo required",
};

const getDaySeed = () => {
  const now = new Date();
  const utcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor(utcMidnight / 86400000);
};

const pickIndexByDay = (length, salt = 0) => {
  if (!length) return 0;
  return Math.abs((getDaySeed() * 17 + salt * 31) % length);
};

const pickByDay = (items, salt = 0) => {
  if (!Array.isArray(items) || items.length === 0) return null;
  return items[pickIndexByDay(items.length, salt)];
};

const pickBatchByDay = (items, count, salt = 0) => {
  if (!Array.isArray(items) || items.length === 0 || count <= 0) return [];
  const start = pickIndexByDay(items.length, salt);
  return Array.from({ length: Math.min(count, items.length) }, (_, offset) => items[(start + offset) % items.length]);
};

const buildA1SpeakingPrompts = (levelSpeaking) => {
  const teil2 = levelSpeaking.filter((item) => item.teilId === "teil-2");
  const teil3 = levelSpeaking.filter((item) => item.teilId === "teil-3");

  const prompts = [
    ...pickBatchByDay(teil2, A1_DAILY_SPEAKING_COUNT_PER_PART, 11),
    ...pickBatchByDay(teil3, A1_DAILY_SPEAKING_COUNT_PER_PART, 19),
  ];

  if (prompts.length >= A1_DAILY_SPEAKING_COUNT_PER_PART) return prompts;

  const fallbackPool = levelSpeaking.filter((item) => item.teilId === "teil-2" || item.teilId === "teil-3");
  return pickBatchByDay(fallbackPool.length ? fallbackPool : levelSpeaking, A1_DAILY_SPEAKING_COUNT_PER_PART, 11);
};

const getProgressKey = (level) => `${getDaySeed()}-${level}`;

const readJsonStore = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
};

const readWarmupStatus = (level) => {
  try {
    const key = getProgressKey(level);
    const currentStore = readJsonStore(STORAGE_KEY);
    const legacyStore = readJsonStore(LEGACY_STORAGE_KEY);
    const entry = currentStore[key] || legacyStore[key] || null;
    return {
      practised: Boolean(entry),
      submittedToTutor: Boolean(entry?.submittedToTutor),
    };
  } catch {
    return { practised: false, submittedToTutor: false };
  }
};

const readWarmupAnswer = (level) => {
  const key = getProgressKey(level);
  const answerStore = readJsonStore(ANSWER_STORAGE_KEY);
  return answerStore[key]?.answer || "";
};

const buildSpeakingLabel = (item) => {
  if (!item) return "";
  const parts = [item.teilLabel, item.topicPrompt || item.keywordSubtopic]
    .filter(Boolean)
    .map((part) => String(part).trim())
    .filter(Boolean);
  return parts.length ? `${parts.join(" • ")}: ${item.text}` : item.text;
};

const getTaskTitle = (dailyTask, level) => {
  if (!dailyTask) return `${level} Exam Warm-up`;
  if (dailyTask.type === "writing") {
    return `${level} Exam Warm-up - Schreiben - ${dailyTask.prompt?.Thema || "Writing"}`;
  }
  return `${level} Exam Warm-up - Sprechen`;
};

const getReviewTimestampMs = (review) => {
  const reviewedAtMs = Date.parse(review?.reviewedAt || "");
  if (Number.isFinite(reviewedAtMs)) return reviewedAtMs;
  if (typeof review?.createdAtMs === "number" && Number.isFinite(review.createdAtMs)) return review.createdAtMs;
  const createdAtMs = Date.parse(review?.createdAt || "");
  if (Number.isFinite(createdAtMs)) return createdAtMs;
  return 0;
};

const formatDate = (value) => {
  const timestamp = Date.parse(value || "");
  if (!Number.isFinite(timestamp)) return "—";
  return new Date(timestamp).toLocaleString();
};

const countWords = (text) =>
  text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

const groupSpeakingPrompts = (prompts = []) =>
  prompts.reduce((groups, prompt) => {
    const key = prompt?.teilLabel || "Sprechen";
    return {
      ...groups,
      [key]: [...(groups[key] || []), prompt],
    };
  }, {});

const TutorFeedbackHistory = ({ reviews, errorMessage }) => {
  const [filter, setFilter] = useState("all");
  const sortedReviews = useMemo(
    () => [...reviews].sort((a, b) => getReviewTimestampMs(b) - getReviewTimestampMs(a)),
    [reviews]
  );
  const commentedCount = sortedReviews.filter((review) => review?.tutorFeedback?.trim()).length;
  const waitingCount = sortedReviews.filter((review) => !review?.tutorFeedback?.trim()).length;
  const latestTutorResponse = sortedReviews.find((review) => review?.tutorFeedback?.trim());

  const filteredReviews = useMemo(() => {
    if (filter === "commented") return sortedReviews.filter((review) => review?.tutorFeedback?.trim());
    if (filter === "waiting") return sortedReviews.filter((review) => !review?.tutorFeedback?.trim());
    if (filter === "needs_correction") return sortedReviews.filter((review) => review?.reviewStatus === "needs_improvement");
    if (filter === "approved") return sortedReviews.filter((review) => review?.reviewStatus === "approved");
    return sortedReviews;
  }, [filter, sortedReviews]);

  const filters = [
    { key: "all", label: "All" },
    { key: "commented", label: "Commented" },
    { key: "waiting", label: "Waiting" },
    { key: "needs_correction", label: "Needs correction" },
    { key: "approved", label: "Approved" },
  ];

  return (
    <div style={{ ...styles.card, marginTop: 12, background: "#ffffff", border: "2px solid #e5e7eb" }}>
      <h3 style={{ marginTop: 0 }}>Tutor Feedback History</h3>
      {errorMessage ? (
        <p style={{ marginBottom: 0, color: "#b91c1c" }}>Tutor feedback could not load right now. Please try again later.</p>
      ) : (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            <span style={{ background: "#f3f4f6", padding: "6px 10px", borderRadius: 999 }}>Total: {sortedReviews.length}</span>
            <span style={{ background: "#fef3c7", padding: "6px 10px", borderRadius: 999 }}>Waiting: {waitingCount}</span>
            <span style={{ background: "#dcfce7", padding: "6px 10px", borderRadius: 999 }}>Commented: {commentedCount}</span>
          </div>

          {latestTutorResponse ? (
            <div style={{ background: "#ecfeff", border: "2px solid #86efac", borderRadius: 12, padding: 14, marginBottom: 12 }}>
              <p style={{ margin: "0 0 6px" }}><strong>Latest tutor response</strong></p>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}>{latestTutorResponse.tutorFeedback}</p>
            </div>
          ) : null}

          {sortedReviews.length === 0 ? (
            <p style={{ marginBottom: 0 }}>
              No tutor feedback yet. Submit a Schreiben task first. After your tutor marks it, your feedback will appear here.
            </p>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                {filters.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    style={filter === item.key ? styles.navButtonActive : styles.secondaryButton}
                    onClick={() => setFilter(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {filteredReviews.map((review, index) => (
                  <div key={`${review?.promptTitle || "review"}-${review?.createdAt || index}`} style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: 12 }}>
                    <p style={{ margin: "0 0 4px" }}><strong>{review?.promptTitle || "Writing task"}</strong></p>
                    <p style={{ ...styles.helperText, margin: "0 0 4px" }}>
                      Level: {review?.level || "—"} • Source: {review?.source || "—"}
                    </p>
                    <p style={{ ...styles.helperText, margin: "0 0 4px" }}>
                      Status: {REVIEW_STATUS_LABELS[review?.reviewStatus] || "Waiting for tutor"}
                    </p>
                    <p style={{ ...styles.helperText, margin: "0 0 4px" }}>
                      Submitted: {formatDate(review?.createdAt)}
                    </p>
                    <p style={{ ...styles.helperText, margin: "0 0 8px" }}>
                      Reviewed: {review?.reviewedAt ? formatDate(review?.reviewedAt) : "—"}
                    </p>
                    {review?.tutorFeedback?.trim() ? (
                      <p style={{ margin: 0 }}>{review.tutorFeedback}</p>
                    ) : (
                      <p style={{ margin: 0 }}>No tutor comment yet. Your work is saved. Please wait for your tutor to mark it.</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

const QuestionOfDayPage = () => {
  const { level } = useExam();
  const { user, studentProfile } = useAuth();
  const activeLevel = String(level || "A1").toUpperCase();
  const [practised, setPractised] = useState(() => readWarmupStatus(activeLevel).practised);
  const [submittedToTutor, setSubmittedToTutor] = useState(() => readWarmupStatus(activeLevel).submittedToTutor);
  const [warmupAnswer, setWarmupAnswer] = useState(() => readWarmupAnswer(activeLevel));
  const [submitState, setSubmitState] = useState({ loading: false, success: "", error: "" });
  const [tutorComment, setTutorComment] = useState("");
  const [letterType, setLetterType] = useState("");
  const [checklistState, setChecklistState] = useState(() =>
    PRE_SUBMISSION_CHECKLIST.reduce((acc, label) => ({ ...acc, [label]: false }), {})
  );
  const [tutorReviews, setTutorReviews] = useState([]);
  const [tutorReviewsError, setTutorReviewsError] = useState("");
  const tutorReviewCloudEnabled = isTutorReviewCloudEnabled();

  useEffect(() => {
    const warmupStatus = readWarmupStatus(activeLevel);
    setPractised(warmupStatus.practised);
    setSubmittedToTutor(warmupStatus.submittedToTutor);
    setWarmupAnswer(readWarmupAnswer(activeLevel));
    setSubmitState({ loading: false, success: "", error: "" });
    setLetterType("");
    setChecklistState(PRE_SUBMISSION_CHECKLIST.reduce((acc, label) => ({ ...acc, [label]: false }), {}));
  }, [activeLevel]);

  useEffect(() => {
    const unsubscribe = subscribeTutorReviewsForStudent(
      { userId: user?.uid, studentCode: studentProfile?.studentCode || studentProfile?.studentcode },
      (reviews) => {
        setTutorReviews(Array.isArray(reviews) ? reviews : []);
        setTutorReviewsError("");
      },
      () => {
        setTutorReviews([]);
        setTutorReviewsError("load_error");
      }
    );
    return () => unsubscribe?.();
  }, [user?.uid, studentProfile?.studentCode, studentProfile?.studentcode]);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }),
    []
  );

  const dailyTask = useMemo(() => {
    const levelWriting = Array.isArray(WRITING_PROMPTS[activeLevel]) ? WRITING_PROMPTS[activeLevel] : [];
    const levelSpeaking = speakingQuestionDictionary.filter((item) => item.level === activeLevel);
    const shareWritingToday = getDaySeed() % 2 === 0;

    if (shareWritingToday && levelWriting.length > 0) {
      return {
        type: "writing",
        title: `${activeLevel} Schreiben warm-up`,
        prompt: pickByDay(levelWriting, 1),
      };
    }

    if (levelSpeaking.length > 0) {
      const prompts = activeLevel === "A1" ? buildA1SpeakingPrompts(levelSpeaking) : [pickByDay(levelSpeaking, 2)].filter(Boolean);
      return {
        type: "speaking",
        title: `${activeLevel} Sprechen warm-up`,
        promptSummary:
          activeLevel === "A1"
            ? `A1 Sprechen: practise ${A1_DAILY_SPEAKING_COUNT_PER_PART} Teil 2 question cards and ${A1_DAILY_SPEAKING_COUNT_PER_PART} Teil 3 request cards today.`
            : "One speaking prompt for today.",
        prompts,
      };
    }

    if (levelWriting.length > 0) {
      return {
        type: "writing",
        title: `${activeLevel} Schreiben warm-up`,
        prompt: pickByDay(levelWriting, 1),
      };
    }

    return null;
  }, [activeLevel]);

  const speakingRules = SPEAKING_GUIDE_BY_LEVEL[activeLevel] || SPEAKING_GUIDE_BY_LEVEL.B1;
  const speakingPromptGroups = useMemo(() => groupSpeakingPrompts(dailyTask?.prompts || []), [dailyTask?.prompts]);

  const shareText = useMemo(() => {
    if (!dailyTask) return "";

    if (dailyTask.type === "writing" && dailyTask.prompt) {
      const points = Array.isArray(dailyTask.prompt.Punkte)
        ? dailyTask.prompt.Punkte.map((point) => `- ${point}`).join("\n")
        : "";

      return `${activeLevel} Exam Warm-up (${todayLabel})\nSchreiben\nThema: ${dailyTask.prompt.Thema}\n${(WRITING_GUIDE_BY_LEVEL[activeLevel] || WRITING_GUIDE_BY_LEVEL.B1).instruction}\n${points}`.trim();
    }

    if (dailyTask.type === "speaking" && Array.isArray(dailyTask.prompts)) {
      return `${activeLevel} Exam Warm-up (${todayLabel})\nSprechen\nRecord your answer as a WhatsApp voice note and send it to your tutor.\n${dailyTask.prompts
        .map((item) => `- ${buildSpeakingLabel(item)}`)
        .join("\n")}`;
    }

    return "";
  }, [dailyTask, activeLevel, todayLabel]);

  const saveWarmupLocally = ({ submittedToTutor = false, reviewId = "", sentOnWhatsapp = false } = {}) => {
    try {
      const key = getProgressKey(activeLevel);
      const progressStore = readJsonStore(STORAGE_KEY);
      progressStore[key] = {
        level: activeLevel,
        practisedAt: new Date().toISOString(),
        taskType: dailyTask?.type || "warm-up",
        submittedToTutor,
        reviewId,
        sentOnWhatsapp,
        taskStatus: "done",
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressStore));

      const answerStore = readJsonStore(ANSWER_STORAGE_KEY);
      answerStore[key] = {
        level: activeLevel,
        answer: warmupAnswer,
        taskTitle: getTaskTitle(dailyTask, activeLevel),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(ANSWER_STORAGE_KEY, JSON.stringify(answerStore));
      setPractised(true);
      setSubmittedToTutor(Boolean(submittedToTutor));
    } catch {
      setPractised(true);
      setSubmittedToTutor(Boolean(submittedToTutor));
    }
  };

  const markPractised = () => {
    saveWarmupLocally({ sentOnWhatsapp: dailyTask?.type === "speaking", submittedToTutor: false });
    if (dailyTask?.type === "speaking") {
      setSubmitState({
        loading: false,
        success: "Marked done. Make sure your WhatsApp voice note has been sent to your tutor.",
        error: "",
      });
    }
  };

  const handleAnswerChange = (event) => {
    const nextAnswer = event.target.value;
    setWarmupAnswer(nextAnswer);
    setSubmitState({ loading: false, success: "", error: "" });

    try {
      const key = getProgressKey(activeLevel);
      const answerStore = readJsonStore(ANSWER_STORAGE_KEY);
      answerStore[key] = {
        level: activeLevel,
        answer: nextAnswer,
        taskTitle: getTaskTitle(dailyTask, activeLevel),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(ANSWER_STORAGE_KEY, JSON.stringify(answerStore));
    } catch {
      // Local saving is helpful but not required.
    }
  };

  const submitWarmupToTutor = async () => {
    const trimmedAnswer = warmupAnswer.trim();

    if (!dailyTask) {
      setSubmitState({ loading: false, success: "", error: "No warm-up task is available to submit." });
      return;
    }

    if (dailyTask.type !== "writing") {
      setSubmitState({
        loading: false,
        success: "",
        error: "For Sprechen, record a WhatsApp voice note and send it to your tutor instead of typing here.",
      });
      return;
    }

    if (!trimmedAnswer) {
      setSubmitState({ loading: false, success: "", error: "Type your Schreiben answer in the box before sending to your tutor." });
      return;
    }

    const wordCount = countWords(trimmedAnswer);
    if (wordCount < MIN_WRITING_WORDS) {
      setSubmitState({
        loading: false,
        success: "",
        error: `Please write at least ${MIN_WRITING_WORDS} words before sending. You currently have ${wordCount}.`,
      });
      return;
    }

    const missingChecklistItems = [];
    if (!letterType) missingChecklistItems.push("Letter type: formal or informal");
    PRE_SUBMISSION_CHECKLIST.forEach((label) => {
      if (!checklistState[label]) missingChecklistItems.push(label);
    });
    if (missingChecklistItems.length > 0) {
      const topMissing = missingChecklistItems.slice(0, 3).join(" | ");
      setSubmitState({
        loading: false,
        success: "",
        error: `${CHECKLIST_ERROR_PREFIX} Missing: ${topMissing}`,
      });
      return;
    }

    if (!tutorReviewCloudEnabled) {
      setSubmitState({ loading: false, success: "", error: "Tutor feedback is not connected in this environment yet." });
      return;
    }

    setSubmitState({ loading: true, success: "", error: "" });

    const checklistReflection = [
      "Student pre-submission checklist:",
      `Letter type: ${letterType}`,
      ...PRE_SUBMISSION_CHECKLIST.map((label) => `- ${label}: ${checklistState[label] ? "Yes" : "No"}`),
    ];
    if (tutorComment.trim()) checklistReflection.push("", `Tutor note: ${tutorComment.trim()}`);

    try {
      const result = await saveExamLetterForTutorReview({
        user,
        studentProfile,
        level: activeLevel,
        promptId: `exam-warmup-${getProgressKey(activeLevel)}`,
        promptTitle: getTaskTitle(dailyTask, activeLevel),
        draft: trimmedAnswer,
        aiFeedback: "",
        revisedDraft: trimmedAnswer,
        reflection: `Submitted from Exam Warm-up. Task:\n${shareText}\n\n${checklistReflection.join("\n")}`,
        source: "exam-warm-up",
      });
      saveWarmupLocally({ submittedToTutor: true, reviewId: result?.id || "" });
      setSubmitState({
        loading: false,
        success: "Work submitted to tutor and saved in the tutor review queue. Scroll down to Tutor Feedback on this page to see updates. Feedback usually appears within 24 hours. You can also open the Writing tab and click Tutor Feedback.",
        error: "",
      });
    } catch (error) {
      setSubmitState({
        loading: false,
        success: "",
        error: error?.message || "Could not submit to tutor right now. Please try again in a moment.",
      });
    }
  };

  const showSubmissionBanner = dailyTask?.type === "writing" && submittedToTutor;
  const questionPanelStyle = {
    ...styles.card,
    margin: "12px 0",
    background: "#f8fafc",
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  };
  const writingWorkspaceStyle = {
    ...styles.card,
    margin: "12px 0",
    background: "#ffffff",
    border: "2px solid #bfdbfe",
    display: "grid",
    gap: 12,
  };

  return (
    <section style={{ ...styles.card, marginTop: 0 }}>
      <h2 style={{ marginTop: 0 }}>Exam Warm-up</h2>
      <div style={{ ...styles.card, margin: "10px 0", background: "#f8fafc", border: "1px solid #dbeafe" }}>
        <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 1.6 }}>
          <li>This page is for learners who are done with the course and are preparing for exams.</li>
          <li>A2 and above receive one speaking question per speaking day.</li>
          <li>A1 speaking receives a short set: 5 Teil 2 cards and 5 Teil 3 request cards.</li>
          <li>For Schreiben: save your response, then scroll down to Tutor Feedback.</li>
          <li>For Sprechen: record your voice and send it to your tutor on WhatsApp.</li>
        </ul>
      </div>

      {showSubmissionBanner ? (
        <div style={{ ...styles.card, margin: "10px 0", background: "#fff7ed", border: "2px solid #fb923c" }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 800, lineHeight: 1.4 }}>
            ✅ Work submitted to tutor. Scroll down to <strong>Tutor Feedback</strong> below.
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 16, fontWeight: 600 }}>
            Feedback usually appears within 24 hours. You can also go to the <strong>Writing</strong> tab and click <strong>Tutor Feedback</strong>.
          </p>
        </div>
      ) : null}

      {dailyTask?.type === "writing" && dailyTask?.prompt ? (
        <div style={questionPanelStyle}>
          <div>
            <p style={{ ...styles.helperText, marginTop: 0 }}>Question for the day</p>
            <h3 style={{ marginTop: 0 }}>Schreiben</h3>
            <p><strong>Thema:</strong> {dailyTask.prompt.Thema}</p>
            <ul>
              {dailyTask.prompt.Punkte?.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p style={{ marginBottom: 0 }}>
              <strong>{(WRITING_GUIDE_BY_LEVEL[activeLevel] || WRITING_GUIDE_BY_LEVEL.B1).instruction}</strong>
            </p>
          </div>
          <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 12, padding: 12 }}>
            <p style={{ ...styles.helperText, marginTop: 0 }}>Work submitted to tutor</p>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              {submittedToTutor
                ? "✅ Submitted. Scroll down to Tutor Feedback. Feedback usually appears within 24 hours."
                : "Not submitted yet. Send your Schreiben below to receive tutor feedback."}
            </p>
          </div>
        </div>
      ) : null}

      {dailyTask?.type === "speaking" && Array.isArray(dailyTask?.prompts) ? (
        <>
          <div style={questionPanelStyle}>
            <div>
              <p style={{ ...styles.helperText, marginTop: 0 }}>Question set for the day</p>
              <h3 style={{ marginTop: 0 }}>Sprechen</h3>
              {dailyTask.promptSummary ? <p style={{ ...styles.helperText, marginTop: 0 }}>{dailyTask.promptSummary}</p> : null}
              {Object.entries(speakingPromptGroups).map(([teilLabel, prompts]) => (
                <div key={teilLabel} style={{ marginTop: 10 }}>
                  <h4 style={{ margin: "0 0 6px" }}>{teilLabel}</h4>
                  <ol style={{ marginTop: 0 }}>
                    {prompts.map((item) => (
                      <li key={item.id || buildSpeakingLabel(item)}>{buildSpeakingLabel(item)}</li>
                    ))}
                  </ol>
                </div>
              ))}
              <p style={{ marginBottom: 0 }}>
                <strong>Do not type your answer. Record a WhatsApp voice note and send it to your tutor.</strong>
              </p>
            </div>
          </div>

          <div style={{ ...styles.card, margin: "12px 0", background: "#eef2ff", border: "2px solid #c7d2fe" }}>
            <h3 style={{ marginTop: 0 }}>Goethe Sprechen rules for {activeLevel}</h3>
            <p style={{ ...styles.helperText, marginTop: 0 }}>
              Before recording, check what each Teil expects. Keep the voice note short and clear.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {speakingRules.map((rule) => (
                <div key={rule.teil} style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 12, padding: 12 }}>
                  <strong>{rule.teil}: {rule.rule}</strong>
                  <p style={{ margin: "6px 0 4px" }}><strong>Do this:</strong> {rule.doThis}</p>
                  <p style={{ ...styles.helperText, margin: 0 }}><strong>Expect:</strong> {rule.expect}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={writingWorkspaceStyle}>
            <h3 style={{ marginTop: 0 }}>Record and send on WhatsApp</h3>
            <ol style={{ marginTop: 0 }}>
              <li>Open WhatsApp.</li>
              <li>Record your voice note for today’s task.</li>
              <li>Send it directly to your tutor.</li>
              <li>Come back here and tap the button below.</li>
            </ol>
            <button type="button" style={practised ? styles.navButtonActive : styles.primaryButton} onClick={markPractised}>
              {practised ? "Recording sent today" : "I recorded and sent to tutor"}
            </button>
            {submitState.error ? <p style={{ ...styles.helperText, color: "#b91c1c", marginBottom: 0 }}>{submitState.error}</p> : null}
            {submitState.success ? <p style={{ ...styles.helperText, color: "#166534", marginBottom: 0 }}>{submitState.success}</p> : null}
          </div>
        </>
      ) : null}

      {dailyTask?.type === "writing" ? (
        <div style={{ ...styles.card, margin: "12px 0", background: "#eef2ff", border: "1px solid #c7d2fe" }}>
          <h3 style={{ marginTop: 0 }}>Goethe Schreiben rules for {activeLevel}</h3>
          <p style={{ margin: "0 0 6px" }}><strong>Time:</strong> {(WRITING_GUIDE_BY_LEVEL[activeLevel] || WRITING_GUIDE_BY_LEVEL.B1).minutes}</p>
          <p style={{ margin: "0 0 6px" }}>{(WRITING_GUIDE_BY_LEVEL[activeLevel] || WRITING_GUIDE_BY_LEVEL.B1).details}</p>
          <p style={{ margin: 0 }}>{(WRITING_GUIDE_BY_LEVEL[activeLevel] || WRITING_GUIDE_BY_LEVEL.B1).instruction}</p>
        </div>
      ) : null}

      {!dailyTask ? (
        <div style={{ ...styles.card, margin: "12px 0", background: "#fef2f2" }}>
          <h3 style={{ marginTop: 0 }}>No warm-up found</h3>
          <p style={{ marginBottom: 0 }}>No Schreiben or Sprechen question is available for {activeLevel} yet.</p>
        </div>
      ) : null}

      {dailyTask?.type === "writing" ? (
        <div style={writingWorkspaceStyle}>
          <label style={{ ...styles.label, fontSize: 16 }}>Your Schreiben answer box</label>
          <p style={{ ...styles.helperText, margin: "4px 0 8px" }}>
            Write your answer here and send it to tutor review when ready.
          </p>
          <textarea
            value={warmupAnswer}
            onChange={handleAnswerChange}
            rows={7}
            placeholder="Write your Goethe-style answer here..."
            style={{ ...styles.textArea, minHeight: 150 }}
          />
          <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
            Minimum {MIN_WRITING_WORDS} words. Current: {countWords(warmupAnswer)} words.
          </p>
          <label style={{ ...styles.label, marginTop: 12 }}>Comment for tutor (optional)</label>
          <textarea
            value={tutorComment}
            onChange={(event) => setTutorComment(event.target.value)}
            rows={3}
            placeholder="Add any note or question for your tutor..."
            style={{ ...styles.textArea, minHeight: 90 }}
          />
          <div style={{ marginTop: 12, padding: 12, border: "1px solid #d1d5db", borderRadius: 10, background: "#f9fafb" }}>
            <h4 style={{ margin: "0 0 6px" }}>Before you submit</h4>
            <p style={{ ...styles.helperText, margin: "0 0 10px" }}>
              Tick every box. If one box is not ticked, submission will not go through.
            </p>
            <div style={{ marginBottom: 10 }}>
              <p style={{ margin: "0 0 6px" }}><strong>Letter type (required)</strong></p>
              {LETTER_TYPE_OPTIONS.map((option) => (
                <label key={option.value} style={{ display: "block", marginBottom: 6 }}>
                  <input
                    type="radio"
                    name="letterType"
                    value={option.value}
                    checked={letterType === option.value}
                    onChange={(event) => {
                      setLetterType(event.target.value);
                      setSubmitState({ loading: false, success: "", error: "" });
                    }}
                  />{" "}
                  {option.label}
                </label>
              ))}
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              {PRE_SUBMISSION_CHECKLIST.map((label) => (
                <label key={label} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={Boolean(checklistState[label])}
                    onChange={(event) => {
                      setChecklistState((prev) => ({ ...prev, [label]: event.target.checked }));
                      setSubmitState({ loading: false, success: "", error: "" });
                    }}
                    style={{ marginTop: 2 }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 10 }}>
            <button type="button" style={styles.primaryButton} onClick={submitWarmupToTutor} disabled={submitState.loading}>
              {submitState.loading ? "Sending..." : "Send Schreiben to tutor"}
            </button>
          </div>
          {submitState.error ? <p style={{ ...styles.helperText, color: "#b91c1c", marginBottom: 0 }}>{submitState.error}</p> : null}
          {submitState.success ? <p style={{ ...styles.helperText, color: "#166534", marginBottom: 0 }}>{submitState.success}</p> : null}
        </div>
      ) : null}

      <TutorFeedbackHistory reviews={tutorReviews} errorMessage={tutorReviewsError} />
    </section>
  );
};

export default QuestionOfDayPage;
