import { useMemo, useState } from "react";
import { useExam } from "../context/ExamContext";
import { WRITING_PROMPTS } from "../data/writingExamPrompts";
import { speakingSheetQuestions } from "../data/speakingSheet";
import { styles } from "../styles";

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


const STORAGE_KEY = "falowen_question_of_day_progress";

const GOETHE_PRACTICE_BASE = {
  A1: "https://www.goethe.de/de/spr/kup/prf/prf/gza1/ueb.html",
  A2: "https://www.goethe.de/de/spr/kup/prf/prf/gza2/ueb.html",
  B1: "https://www.goethe.de/de/spr/kup/prf/prf/gzb1/ueb.html",
  B2: "https://www.goethe.de/de/spr/kup/prf/prf/gzb2/ueb.html",
};

const QuestionOfDayPage = () => {
  const { level } = useExam();
  const [copyStatus, setCopyStatus] = useState("");
  const [submitted, setSubmitted] = useState(() => {
    try {
      const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return Boolean(store[`${getDaySeed()}-${level}`]);
    } catch {
      return false;
    }
  });

  const todayLabel = useMemo(() => new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }), []);

  const dailyTask = useMemo(() => {
    const levelWriting = Array.isArray(WRITING_PROMPTS[level]) ? WRITING_PROMPTS[level] : [];
    const levelSpeaking = speakingSheetQuestions.filter((item) => item.level === level);

    if (level === "A1") {
      const teilOneTwo = levelSpeaking.filter((item) => item.teilId === "teil-1" || item.teilId === "teil-2");
      const teilThree = levelSpeaking.filter((item) => item.teilId === "teil-3");
      const speakingPool = teilOneTwo.length >= 5 ? teilOneTwo : levelSpeaking;
      return {
        type: "speaking",
        title: "A1 Speaking Challenge",
        intro: "Today's A1 task: record these 5 prompts on your phone and send to your tutor.",
        tasks: pickBatchByDay(speakingPool, 5, 11).map((item) => `${item.teilLabel}: ${item.text}`),
        bonus: pickByDay(teilThree, 3),
      };
    }

    const shareWritingToday = getDaySeed() % 2 === 0;
    if (shareWritingToday && levelWriting.length > 0) {
      return {
        type: "writing",
        title: `${level} Letter of the Day`,
        prompt: pickByDay(levelWriting, 1),
      };
    }

    return {
      type: "speaking",
      title: `${level} Speaking Task of the Day`,
      prompt: pickByDay(levelSpeaking, 2),
    };
  }, [level]);

  const resourceBase = GOETHE_PRACTICE_BASE[level] || GOETHE_PRACTICE_BASE.B1;

  const shareText = useMemo(() => {
    if (!dailyTask) return "";
    if (dailyTask.type === "writing" && dailyTask.prompt) {
      return `${level} Question of the Day (${todayLabel}): Schreiben\nThema: ${dailyTask.prompt.Thema}`;
    }
    if (dailyTask.type === "speaking" && Array.isArray(dailyTask.tasks)) {
      return `${level} Question of the Day (${todayLabel}): A1 speaking mini set\n${dailyTask.tasks.join("\n")}`;
    }
    if (dailyTask.prompt) {
      return `${level} Question of the Day (${todayLabel}): Sprechen\n${dailyTask.prompt.teilLabel}: ${dailyTask.prompt.text}`;
    }
    return "";
  }, [dailyTask, level, todayLabel]);

  const markSubmitted = () => {
    try {
      const key = `${getDaySeed()}-${level}`;
      const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      store[key] = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  const copyToClipboard = async () => {
    if (!navigator?.clipboard?.writeText || !shareText) return;
    await navigator.clipboard.writeText(shareText);
    setCopyStatus("Copied");
  };

  return (
    <section style={{ ...styles.card, marginTop: 0 }}>
      <p style={{ ...styles.helperText, marginTop: 0 }}>Exams • Question of the day</p>
      <h2 style={{ marginTop: 0 }}>{dailyTask?.title || "Question of the Day"}</h2>
      <p style={{ marginTop: 0 }}><strong>One task is shared each day for your selected exam level.</strong></p>
      <p style={styles.helperText}>Task date (UTC): {todayLabel}</p>
      <p style={styles.helperText}>
        This page gives one daily exam task so tutors do not need to manually send questions to students.
      </p>
      <p>
        For Hören and Lesen practice, use the links below. If you have registered for the exam, follow all instructions your tutor gives you.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <a href={resourceBase} target="_blank" rel="noreferrer noopener" style={{ ...styles.primaryButton, textDecoration: "none" }}>Open Reading links</a>
        <a href={`${resourceBase}#section-3`} target="_blank" rel="noreferrer noopener" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Listening links</a>
      </div>

      {dailyTask?.type === "writing" && dailyTask?.prompt ? (
        <div style={{ ...styles.card, margin: "12px 0", background: "#f8fafc" }}>
          <h3 style={{ marginTop: 0 }}>Schreiben</h3>
          <p><strong>Thema:</strong> {dailyTask.prompt.Thema}</p>
          <ul>
            {dailyTask.prompt.Punkte?.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {dailyTask?.type === "speaking" && Array.isArray(dailyTask?.tasks) ? (
        <div style={{ ...styles.card, margin: "12px 0", background: "#f8fafc" }}>
          <h3 style={{ marginTop: 0 }}>Sprechen</h3>
          <p>{dailyTask.intro}</p>
          <ol>
            {dailyTask.tasks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          {dailyTask.bonus ? <p><strong>Bonus (Teil 3):</strong> {dailyTask.bonus.text}</p> : null}
        </div>
      ) : null}

      {dailyTask?.type === "speaking" && dailyTask?.prompt ? (
        <div style={{ ...styles.card, margin: "12px 0", background: "#f8fafc" }}>
          <h3 style={{ marginTop: 0 }}>Sprechen</h3>
          <p><strong>{dailyTask.prompt.teilLabel}:</strong> {dailyTask.prompt.text}</p>
          <p style={{ marginBottom: 0 }}>Record your answer on your phone and share with your tutor.</p>
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" style={styles.navButton} onClick={copyToClipboard}>Copy task</button>
        <button type="button" style={submitted ? styles.navButtonActive : styles.primaryButton} onClick={markSubmitted}>
          {submitted ? "Submitted today" : "Mark as submitted"}
        </button>
        {copyStatus ? <span style={styles.helperText}>{copyStatus}</span> : null}
      </div>
    </section>
  );
};

export default QuestionOfDayPage;
