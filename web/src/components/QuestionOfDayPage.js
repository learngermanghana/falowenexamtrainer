import { useEffect, useMemo, useState } from "react";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { WRITING_PROMPTS } from "../data/writingExamPrompts";
import { speakingSheetQuestions } from "../data/speakingSheet";
import {
  isTutorReviewCloudEnabled,
  saveExamLetterForTutorReview,
} from "../services/tutorReviewService";
import { styles } from "../styles";

const STORAGE_KEY = "falowen_exam_warmup_progress";
const ANSWER_STORAGE_KEY = "falowen_exam_warmup_answers";
const LEGACY_STORAGE_KEY = "falowen_question_of_day_progress";

const GOETHE_PRACTICE_BASE = {
  A1: "https://www.goethe.de/de/spr/kup/prf/prf/gza1/ueb.html",
  A2: "https://www.goethe.de/de/spr/kup/prf/prf/gza2/ueb.html",
  B1: "https://www.goethe.de/de/spr/kup/prf/prf/gzb1/ueb.html",
  B2: "https://www.goethe.de/de/spr/kup/prf/prf/gzb2/ueb.html",
};

const SPEAKING_GUIDE_BY_LEVEL = {
  A1: [
    {
      teil: "Teil 1",
      rule: "Introduce yourself with short personal information.",
      doThis: "Say your name, age, country, languages, job/school, family or hobby.",
      expect: "The examiner may ask you to spell something or give a number. Speak slowly and clearly.",
    },
    {
      teil: "Teil 2",
      rule: "Ask and answer one simple question from the card.",
      doThis: "Use the topic and keyword to make a question, then answer your partner's question briefly.",
      expect: "A short correct question is enough. Focus on word order and clear pronunciation.",
    },
    {
      teil: "Teil 3",
      rule: "Make or answer a simple request.",
      doThis: "Ask politely for something, or respond with yes/no and a short reason.",
      expect: "Use polite phrases like Bitte, Können Sie bitte ...? or Ja, gern.",
    },
  ],
  A2: [
    {
      teil: "Teil 1",
      rule: "Introduce yourself and answer personal follow-up questions.",
      doThis: "Give short answers about yourself, your daily life, school, work, family, hobbies, or plans.",
      expect: "The examiner wants simple but complete answers, not long speeches.",
    },
    {
      teil: "Teil 2",
      rule: "Speak about a familiar topic and exchange information.",
      doThis: "Answer the prompt, ask one simple question, and react to your partner.",
      expect: "Use everyday vocabulary and give one small reason or example.",
    },
    {
      teil: "Teil 3",
      rule: "Plan something together with your partner.",
      doThis: "Suggest time, place, activity, and one detail. Agree or disagree politely.",
      expect: "Show interaction: make suggestions, ask questions, and come to a simple decision.",
    },
  ],
  B1: [
    {
      teil: "Teil 1",
      rule: "Plan something together.",
      doThis: "Make suggestions, react to your partner, ask questions, agree, disagree, and decide together.",
      expect: "The examiner checks interaction, not memorised speech. Keep the conversation moving.",
    },
    {
      teil: "Teil 2",
      rule: "Give a short presentation on a topic.",
      doThis: "Use a clear structure: introduction, experience/example, opinion, situation in your country, conclusion.",
      expect: "Speak in connected sentences and give reasons. Do not only list words.",
    },
    {
      teil: "Teil 3",
      rule: "Ask and answer questions about the presentation.",
      doThis: "Ask your partner one relevant question and answer the examiner/partner clearly.",
      expect: "Show that you understood the topic and can react naturally.",
    },
  ],
  B2: [
    {
      teil: "Teil 1",
      rule: "Give a structured talk or presentation.",
      doThis: "State the topic, compare options, give advantages/disadvantages, examples, and your opinion.",
      expect: "Use clear structure and connectors. Give reasons, not only short answers.",
    },
    {
      teil: "Teil 2",
      rule: "Discuss a topic with your partner.",
      doThis: "React to the other opinion, agree or disagree politely, justify your view, and suggest a solution.",
      expect: "The examiner checks interaction, argument quality, vocabulary, and fluency.",
    },
  ],
  C1: [
    {
      teil: "Teil 1",
      rule: "Present a topic with a clear argument.",
      doThis: "Explain the issue, compare viewpoints, support your argument, and conclude clearly.",
      expect: "Use advanced connectors and precise vocabulary. Avoid memorised, empty sentences.",
    },
    {
      teil: "Teil 2",
      rule: "Discuss, defend, and react to another viewpoint.",
      doThis: "Listen, respond directly, challenge politely, justify your opinion, and propose a balanced solution.",
      expect: "The examiner checks fluency, flexibility, argumentation, and interaction.",
    },
  ],
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

const getProgressKey = (level) => `${getDaySeed()}-${level}`;

const readJsonStore = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
};

const readWarmupProgress = (level) => {
  try {
    const key = getProgressKey(level);
    const currentStore = readJsonStore(STORAGE_KEY);
    const legacyStore = readJsonStore(LEGACY_STORAGE_KEY);
    return Boolean(currentStore[key] || legacyStore[key]);
  } catch {
    return false;
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

const QuestionOfDayPage = () => {
  const { level } = useExam();
  const { user, studentProfile } = useAuth();
  const [copyStatus, setCopyStatus] = useState("");
  const [practised, setPractised] = useState(() => readWarmupProgress(level));
  const [warmupAnswer, setWarmupAnswer] = useState(() => readWarmupAnswer(level));
  const [submitState, setSubmitState] = useState({ loading: false, success: "", error: "" });
  const tutorReviewCloudEnabled = isTutorReviewCloudEnabled();

  useEffect(() => {
    setPractised(readWarmupProgress(level));
    setWarmupAnswer(readWarmupAnswer(level));
    setCopyStatus("");
    setSubmitState({ loading: false, success: "", error: "" });
  }, [level]);

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
    const levelWriting = Array.isArray(WRITING_PROMPTS[level]) ? WRITING_PROMPTS[level] : [];
    const levelSpeaking = speakingSheetQuestions.filter((item) => item.level === level);
    const shareWritingToday = getDaySeed() % 2 === 0;

    if (shareWritingToday && levelWriting.length > 0) {
      return {
        type: "writing",
        title: `${level} Schreiben warm-up`,
        prompt: pickByDay(levelWriting, 1),
      };
    }

    if (levelSpeaking.length > 0) {
      const a1SpeakingPool = levelSpeaking.filter((item) => item.teilId === "teil-1" || item.teilId === "teil-2");
      const speakingPool = level === "A1" && a1SpeakingPool.length > 0 ? a1SpeakingPool : levelSpeaking;
      const prompts = level === "A1" ? pickBatchByDay(speakingPool, 2, 11) : [pickByDay(speakingPool, 2)].filter(Boolean);

      return {
        type: "speaking",
        title: `${level} Sprechen warm-up`,
        prompts,
      };
    }

    if (levelWriting.length > 0) {
      return {
        type: "writing",
        title: `${level} Schreiben warm-up`,
        prompt: pickByDay(levelWriting, 1),
      };
    }

    return null;
  }, [level]);

  const speakingRules = SPEAKING_GUIDE_BY_LEVEL[level] || SPEAKING_GUIDE_BY_LEVEL.B1;
  const resourceBase = GOETHE_PRACTICE_BASE[level] || GOETHE_PRACTICE_BASE.B1;

  const shareText = useMemo(() => {
    if (!dailyTask) return "";

    if (dailyTask.type === "writing" && dailyTask.prompt) {
      const points = Array.isArray(dailyTask.prompt.Punkte)
        ? dailyTask.prompt.Punkte.map((point) => `- ${point}`).join("\n")
        : "";

      return `${level} Exam Warm-up (${todayLabel})\nSchreiben\nThema: ${dailyTask.prompt.Thema}\nWrite only 3–5 sentences.\n${points}`.trim();
    }

    if (dailyTask.type === "speaking" && Array.isArray(dailyTask.prompts)) {
      return `${level} Exam Warm-up (${todayLabel})\nSprechen\nRecord your answer as a WhatsApp voice note and send it to your tutor.\n${dailyTask.prompts
        .map((item) => `- ${buildSpeakingLabel(item)}`)
        .join("\n")}`;
    }

    return "";
  }, [dailyTask, level, todayLabel]);

  const saveWarmupLocally = ({ submittedToTutor = false, reviewId = "", sentOnWhatsapp = false } = {}) => {
    try {
      const key = getProgressKey(level);
      const progressStore = readJsonStore(STORAGE_KEY);
      progressStore[key] = {
        level,
        practisedAt: new Date().toISOString(),
        taskType: dailyTask?.type || "warm-up",
        submittedToTutor,
        reviewId,
        sentOnWhatsapp,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressStore));

      const answerStore = readJsonStore(ANSWER_STORAGE_KEY);
      answerStore[key] = {
        level,
        answer: warmupAnswer,
        taskTitle: getTaskTitle(dailyTask, level),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(ANSWER_STORAGE_KEY, JSON.stringify(answerStore));
      setPractised(true);
    } catch {
      setPractised(true);
    }
  };

  const markPractised = () => {
    saveWarmupLocally({ sentOnWhatsapp: dailyTask?.type === "speaking" });
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
      const key = getProgressKey(level);
      const answerStore = readJsonStore(ANSWER_STORAGE_KEY);
      answerStore[key] = {
        level,
        answer: nextAnswer,
        taskTitle: getTaskTitle(dailyTask, level),
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

    if (!tutorReviewCloudEnabled) {
      setSubmitState({ loading: false, success: "", error: "Tutor feedback is not connected in this environment yet." });
      return;
    }

    setSubmitState({ loading: true, success: "", error: "" });

    try {
      const result = await saveExamLetterForTutorReview({
        user,
        studentProfile,
        level,
        promptId: `exam-warmup-${getProgressKey(level)}`,
        promptTitle: getTaskTitle(dailyTask, level),
        draft: trimmedAnswer,
        aiFeedback: "",
        revisedDraft: trimmedAnswer,
        reflection: `Submitted from Exam Warm-up. Task:\n${shareText}`,
        source: "exam-warm-up",
      });
      saveWarmupLocally({ submittedToTutor: true, reviewId: result?.id || "" });
      setSubmitState({
        loading: false,
        success: "Sent to tutor. When your tutor marks it, open Writing → Tutor feedback to see the comment.",
        error: "",
      });
    } catch (error) {
      setSubmitState({
        loading: false,
        success: "",
        error: error?.message || "Could not send the warm-up to tutor right now.",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!navigator?.clipboard?.writeText || !shareText) return;
    await navigator.clipboard.writeText(shareText);
    setCopyStatus("Copied");
  };

  return (
    <section style={{ ...styles.card, marginTop: 0 }}>
      <p style={{ ...styles.helperText, marginTop: 0 }}>Exams • Exam Warm-up</p>
      <h2 style={{ marginTop: 0 }}>Exam Warm-up</h2>
      <div
        style={{
          ...styles.card,
          margin: "0 0 12px",
          background: "#fff7ed",
          border: "1px solid #fed7aa",
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Main Course first.</strong> This is only a short exam warm-up after your course work. Use 3–5 minutes only.
        </p>
        <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
          Do not replace your workbook assignment with this task. Full exam practice still belongs in the Schreiben and Sprechen tabs.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 8,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          marginBottom: 12,
        }}
      >
        <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Today’s course work</p>
          <strong>Complete first</strong>
        </div>
        <div style={{ ...styles.card, margin: 0, background: practised ? "#ecfdf5" : "#f8fafc" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Exam Warm-up</p>
          <strong>{practised ? "Warm-up done today" : "Available after course work"}</strong>
        </div>
        <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Time limit</p>
          <strong>3–5 minutes</strong>
        </div>
      </div>

      <p style={styles.helperText}>Task date (UTC): {todayLabel}</p>
      <p style={styles.helperText}>
        The warm-up uses the existing Schreiben and Sprechen question dictionaries. No new question bank is created here.
      </p>

      {dailyTask?.type === "writing" && dailyTask?.prompt ? (
        <div style={{ ...styles.card, margin: "12px 0", background: "#f8fafc" }}>
          <p style={{ ...styles.helperText, marginTop: 0 }}>Today’s short task</p>
          <h3 style={{ marginTop: 0 }}>Schreiben</h3>
          <p><strong>Thema:</strong> {dailyTask.prompt.Thema}</p>
          <ul>
            {dailyTask.prompt.Punkte?.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p style={{ marginBottom: 0 }}>
            Write only <strong>3–5 sentences</strong>. This is a warm-up, not your full course assignment.
          </p>
        </div>
      ) : null}

      {dailyTask?.type === "speaking" && Array.isArray(dailyTask?.prompts) ? (
        <>
          <div style={{ ...styles.card, margin: "12px 0", background: "#f8fafc" }}>
            <p style={{ ...styles.helperText, marginTop: 0 }}>Today’s short task</p>
            <h3 style={{ marginTop: 0 }}>Sprechen</h3>
            <ol>
              {dailyTask.prompts.map((item) => (
                <li key={item.id || buildSpeakingLabel(item)}>{buildSpeakingLabel(item)}</li>
              ))}
            </ol>
            <p style={{ marginBottom: 0 }}>
              Do not type this answer. <strong>Record a WhatsApp voice note</strong> and send it to your tutor.
            </p>
          </div>

          <div style={{ ...styles.card, margin: "12px 0", background: "#eef2ff", border: "2px solid #c7d2fe" }}>
            <h3 style={{ marginTop: 0 }}>Goethe Sprechen rules for {level}</h3>
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

          <div style={{ ...styles.card, margin: "12px 0", background: "#ffffff", border: "2px solid #bfdbfe" }}>
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

      {!dailyTask ? (
        <div style={{ ...styles.card, margin: "12px 0", background: "#fef2f2" }}>
          <h3 style={{ marginTop: 0 }}>No warm-up found</h3>
          <p style={{ marginBottom: 0 }}>No Schreiben or Sprechen question is available for {level} yet.</p>
        </div>
      ) : null}

      {dailyTask?.type === "writing" ? (
        <div style={{ ...styles.card, margin: "12px 0", background: "#ffffff", border: "2px solid #bfdbfe" }}>
          <label style={{ ...styles.label, fontSize: 16 }}>Your Schreiben answer box</label>
          <p style={{ ...styles.helperText, margin: "4px 0 8px" }}>
            Write your short answer here. Your tutor can mark this from the admin review queue.
          </p>
          <textarea
            value={warmupAnswer}
            onChange={handleAnswerChange}
            rows={7}
            placeholder="Write 3–5 sentences here..."
            style={{ ...styles.textArea, minHeight: 150 }}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 10 }}>
            <button type="button" style={styles.primaryButton} onClick={submitWarmupToTutor} disabled={submitState.loading}>
              {submitState.loading ? "Sending..." : "Send Schreiben to tutor"}
            </button>
            <button type="button" style={practised ? styles.navButtonActive : styles.secondaryButton} onClick={markPractised}>
              {practised ? "Warm-up done today" : "I practised this"}
            </button>
          </div>
          {submitState.error ? <p style={{ ...styles.helperText, color: "#b91c1c", marginBottom: 0 }}>{submitState.error}</p> : null}
          {submitState.success ? <p style={{ ...styles.helperText, color: "#166534", marginBottom: 0 }}>{submitState.success}</p> : null}
        </div>
      ) : null}

      <p style={styles.helperText}>
        Optional extra practice: use the Goethe links only after your main course task is complete.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <a href={resourceBase} target="_blank" rel="noreferrer noopener" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Optional Reading practice</a>
        <a href={`${resourceBase}#section-3`} target="_blank" rel="noreferrer noopener" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Optional Listening practice</a>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" style={styles.navButton} onClick={copyToClipboard}>Copy warm-up</button>
        {copyStatus ? <span style={styles.helperText}>{copyStatus}</span> : null}
      </div>
    </section>
  );
};

export default QuestionOfDayPage;
