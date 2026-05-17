import { useEffect, useMemo, useState } from "react";
import { useExam } from "../context/ExamContext";
import { WRITING_PROMPTS } from "../data/writingExamPrompts";
import { speakingSheetQuestions } from "../data/speakingSheet";
import { styles } from "../styles";

const STORAGE_KEY = "falowen_exam_warmup_progress";
const LEGACY_STORAGE_KEY = "falowen_question_of_day_progress";

const GOETHE_PRACTICE_BASE = {
  A1: "https://www.goethe.de/de/spr/kup/prf/prf/gza1/ueb.html",
  A2: "https://www.goethe.de/de/spr/kup/prf/prf/gza2/ueb.html",
  B1: "https://www.goethe.de/de/spr/kup/prf/prf/gzb1/ueb.html",
  B2: "https://www.goethe.de/de/spr/kup/prf/prf/gzb2/ueb.html",
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

const readWarmupProgress = (level) => {
  try {
    const key = getProgressKey(level);
    const currentStore = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const legacyStore = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "{}");
    return Boolean(currentStore[key] || legacyStore[key]);
  } catch {
    return false;
  }
};

const buildSpeakingLabel = (item) => {
  if (!item) return "";
  const parts = [item.teilLabel, item.topicPrompt || item.keywordSubtopic]
    .filter(Boolean)
    .map((part) => String(part).trim())
    .filter(Boolean);
  return parts.length ? `${parts.join(" • ")}: ${item.text}` : item.text;
};

const QuestionOfDayPage = () => {
  const { level } = useExam();
  const [copyStatus, setCopyStatus] = useState("");
  const [practised, setPractised] = useState(() => readWarmupProgress(level));

  useEffect(() => {
    setPractised(readWarmupProgress(level));
    setCopyStatus("");
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
      return `${level} Exam Warm-up (${todayLabel})\nSprechen\nPrepare 3 keywords and practise for 1 minute.\n${dailyTask.prompts
        .map((item) => `- ${buildSpeakingLabel(item)}`)
        .join("\n")}`;
    }

    return "";
  }, [dailyTask, level, todayLabel]);

  const markPractised = () => {
    try {
      const key = getProgressKey(level);
      const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      store[key] = {
        level,
        practisedAt: new Date().toISOString(),
        taskType: dailyTask?.type || "warm-up",
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      setPractised(true);
    } catch {
      setPractised(true);
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
        <div style={{ ...styles.card, margin: "12px 0", background: "#f8fafc" }}>
          <p style={{ ...styles.helperText, marginTop: 0 }}>Today’s short task</p>
          <h3 style={{ marginTop: 0 }}>Sprechen</h3>
          <ol>
            {dailyTask.prompts.map((item) => (
              <li key={item.id || buildSpeakingLabel(item)}>{buildSpeakingLabel(item)}</li>
            ))}
          </ol>
          <p style={{ marginBottom: 0 }}>
            Prepare <strong>3 keywords</strong>, then practise speaking for <strong>1 minute</strong>. Do not spend your full study time here.
          </p>
        </div>
      ) : null}

      {!dailyTask ? (
        <div style={{ ...styles.card, margin: "12px 0", background: "#fef2f2" }}>
          <h3 style={{ marginTop: 0 }}>No warm-up found</h3>
          <p style={{ marginBottom: 0 }}>No Schreiben or Sprechen question is available for {level} yet.</p>
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
        <button type="button" style={practised ? styles.navButtonActive : styles.primaryButton} onClick={markPractised}>
          {practised ? "Warm-up done today" : "I practised this"}
        </button>
        {copyStatus ? <span style={styles.helperText}>{copyStatus}</span> : null}
      </div>
    </section>
  );
};

export default QuestionOfDayPage;
