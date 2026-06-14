import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { EmbeddedSpeechPracticePanel, EmbeddedWritingPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loadWritingProgress, saveWritingProgress } from "../services/writingProgressService";
import b2Day1QuestionWritingBuilder from "../data/writingQuestionBuilders/b2Day1PersoenlicheIdentitaet";
import { styles } from "../styles";

const tabs = [
  { id: "learn", label: "1. Learn" },
  { id: "speak", label: "2. Speak" },
  { id: "write", label: "3. Write" },
  { id: "finish", label: "4. Finish" },
];

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
};

const tabBarStyle = {
  position: "sticky",
  top: 0,
  zIndex: 5,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: 8,
  padding: 10,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  background: "rgba(248, 250, 252, 0.94)",
  backdropFilter: "blur(12px)",
};

const countWords = (text = "") => String(text || "").trim().split(/\s+/).filter(Boolean).length;

const getYouTubeEmbedUrl = (url = "") => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const videoId = host === "youtu.be"
      ? parsed.pathname.replace(/^\//, "")
      : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch (error) {
    return "";
  }
};

const Section = ({ title, children }) => (
  <section style={cardStyle}>
    <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>
    {children}
  </section>
);

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", background: "#eff6ff", color: "#1e3a8a" },
    green: { border: "#bbf7d0", background: "#f0fdf4", color: "#14532d" },
    amber: { border: "#fde68a", background: "#fffbeb", color: "#92400e" },
  };
  const selected = tones[tone] || tones.blue;
  return (
    <div style={{ border: `1px solid ${selected.border}`, borderRadius: 14, padding: 12, background: selected.background, color: selected.color, lineHeight: 1.65 }}>
      {children}
    </div>
  );
};

const ProgressCard = ({ label, complete, detail }) => (
  <div style={{ border: `1px solid ${complete ? "#86efac" : "#cbd5e1"}`, borderRadius: 14, padding: 13, background: complete ? "#f0fdf4" : "#fff", display: "grid", gap: 5 }}>
    <strong>{complete ? "✅" : "⬜"} {label}</strong>
    <span style={{ color: "#64748b", fontSize: 13 }}>{detail}</span>
  </div>
);

const SpeakingBrainMap = ({ lesson }) => {
  const branches = [
    {
      title: "Persönlichkeit",
      prompt: "Welche 2–3 Eigenschaften beschreiben dich?",
      starter: "Ich würde mich als ... beschreiben, weil ...",
    },
    {
      title: "Werte",
      prompt: "Welche Werte sind dir besonders wichtig?",
      starter: "Ein wichtiger Wert in meinem Leben ist ..., denn ...",
    },
    {
      title: "Prägende Erfahrung",
      prompt: "Welche Erfahrung hat dich verändert?",
      starter: "Eine Erfahrung, die mich geprägt hat, war ...",
    },
    {
      title: "Online und offline",
      prompt: "Wo gibt es Unterschiede in deinem Verhalten?",
      starter: "Online wirke ich ..., während ich im echten Leben ...",
    },
    {
      title: "Zukunft",
      prompt: "Welche Eigenschaft möchtest du weiterentwickeln?",
      starter: "In Zukunft möchte ich ... stärker entwickeln.",
    },
  ];

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ justifySelf: "center", width: "min(260px, 90%)", minHeight: 120, borderRadius: 999, display: "grid", placeItems: "center", textAlign: "center", padding: 20, color: "#fff", background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", boxShadow: "0 16px 34px rgba(37, 99, 235, 0.28)" }}>
        <div>
          <small style={{ opacity: 0.82, fontWeight: 800 }}>SPRECHEN-BRAIN-MAP</small>
          <h3 style={{ margin: "5px 0 0", fontSize: "1.25rem" }}>{lesson.title}</h3>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
        {branches.map((branch, index) => (
          <article key={branch.title} style={{ border: "1px solid #c7d2fe", borderRadius: 16, padding: 14, background: index % 2 === 0 ? "#eef2ff" : "#f8fafc", display: "grid", gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: 999, display: "grid", placeItems: "center", background: "#1d4ed8", color: "#fff", fontWeight: 900 }}>{index + 1}</span>
            <strong>{branch.title}</strong>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.55 }}>{branch.prompt}</p>
            <div style={{ borderLeft: "4px solid #818cf8", paddingLeft: 10, color: "#3730a3", lineHeight: 1.55 }}>{branch.starter}</div>
          </article>
        ))}
      </div>
      <NoteBox tone="amber"><strong>Speaking order:</strong> Persönlichkeit → Werte → Erfahrung → Online/Offline → Zukunft. Sprich 2–3 Minuten und gib mindestens zwei konkrete Beispiele.</NoteBox>
    </div>
  );
};

const makeEmptyWritingState = () => ({
  answers: {},
  finalEssay: "",
  view: "questions",
  updatedAt: "",
});

function B2Day1GuidedWritingBuilder({ onStatusChange }) {
  const config = b2Day1QuestionWritingBuilder;
  const storageKey = "falowen:b2:day1:question-writing-builder";
  const { user, studentProfile } = useAuth();
  const userId = user?.uid || "";
  const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || userId;
  const hasCloudOwner = Boolean(studentCode || userId);
  const [state, setState] = useState(() => {
    try {
      return {
        ...makeEmptyWritingState(),
        ...JSON.parse(localStorage.getItem(storageKey) || "{}"),
      };
    } catch (error) {
      return makeEmptyWritingState();
    }
  });
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [cloudSaveStatus, setCloudSaveStatus] = useState("idle");
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    let active = true;

    if (!hasCloudOwner) {
      setCloudLoaded(true);
      setCloudSaveStatus("device");
      return undefined;
    }

    setCloudSaveStatus("loading");
    loadWritingProgress({ userId, studentCode, mode: "course" })
      .then((saved) => {
        if (!active) return;
        const cloudDraft = saved?.b2Day1GuidedWriting;
        if (cloudDraft && typeof cloudDraft === "object") {
          setState((current) => {
            const cloudTime = Date.parse(cloudDraft.updatedAt || "") || 0;
            const localTime = Date.parse(current.updatedAt || "") || 0;
            if (localTime > cloudTime) return current;
            return {
              ...makeEmptyWritingState(),
              ...cloudDraft,
              answers: cloudDraft.answers && typeof cloudDraft.answers === "object" ? cloudDraft.answers : {},
            };
          });
        }
        setCloudSaveStatus("saved");
      })
      .catch(() => {
        if (active) setCloudSaveStatus("error");
      })
      .finally(() => {
        if (active) setCloudLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [hasCloudOwner, studentCode, userId]);

  useEffect(() => {
    if (!cloudLoaded || !hasCloudOwner) return undefined;
    setCloudSaveStatus("saving");
    const timer = window.setTimeout(async () => {
      const saved = await saveWritingProgress({
        userId,
        studentCode,
        mode: "course",
        data: { b2Day1GuidedWriting: state },
      });
      setCloudSaveStatus(saved ? "saved" : "error");
    }, 800);
    return () => window.clearTimeout(timer);
  }, [cloudLoaded, hasCloudOwner, state, studentCode, userId]);

  const questionStats = useMemo(
    () => config.questions.map((item) => {
      const words = countWords(state.answers?.[item.id]);
      return { ...item, words, complete: words >= item.minimumWords };
    }),
    [config.questions, state.answers],
  );
  const completedQuestions = questionStats.filter((item) => item.complete).length;
  const totalWords = questionStats.reduce((sum, item) => sum + item.words, 0);
  const allComplete = completedQuestions === questionStats.length;
  const combinedAnswers = questionStats
    .map((item) => String(state.answers?.[item.id] || "").trim())
    .filter(Boolean)
    .join("\n\n");

  useEffect(() => {
    onStatusChange?.({
      complete: allComplete && Boolean(state.finalEssay.trim()),
      completedQuestions,
      totalQuestions: questionStats.length,
      wordCount: countWords(state.finalEssay),
    });
  }, [allComplete, completedQuestions, onStatusChange, questionStats.length, state.finalEssay]);

  const updateState = (updater) => {
    setState((previous) => {
      const next = typeof updater === "function" ? updater(previous) : { ...previous, ...updater };
      return { ...next, updatedAt: new Date().toISOString() };
    });
  };

  const updateAnswer = (id, value) => {
    updateState((previous) => ({
      ...previous,
      answers: { ...(previous.answers || {}), [id]: value },
    }));
  };

  const combineAnswers = () => {
    if (!allComplete) return;
    updateState((previous) => ({
      ...previous,
      finalEssay: combinedAnswers,
      view: "final",
    }));
  };

  const copyEssay = async () => {
    try {
      await navigator.clipboard.writeText(state.finalEssay || "");
      setCopyMessage("Essay copied.");
    } catch (error) {
      setCopyMessage("Copy failed. Select the text manually.");
    }
  };

  const saveLabel = !hasCloudOwner
    ? "Saved on this device"
    : cloudSaveStatus === "loading"
      ? "Loading saved work..."
      : cloudSaveStatus === "saving"
        ? "Saving to Falowen..."
        : cloudSaveStatus === "error"
          ? "Cloud save failed — device copy is safe"
          : "Saved to Falowen";

  return (
    <div style={{ border: "1px solid #c7d2fe", borderRadius: 18, background: "linear-gradient(180deg, #ffffff, #f8fafc)", padding: 16, display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <span style={{ ...styles.badge, width: "fit-content", background: "#eef2ff", color: "#3730a3" }}>Guided B2 Writing</span>
        <h3 style={{ margin: 0 }}>Answer 6 questions and combine your essay</h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>Write one focused section at a time. When every section reaches its minimum, Falowen combines your answers into one editable essay.</p>
        <small style={{ color: cloudSaveStatus === "error" ? "#b91c1c" : "#166534", fontWeight: 800 }}>{saveLabel}</small>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
        <ProgressCard label="Questions" complete={allComplete} detail={`${completedQuestions}/${questionStats.length} complete`} />
        <ProgressCard label="Words written" complete={totalWords >= config.targetWords} detail={`${totalWords}/${config.targetWords} words`} />
      </div>

      {state.view !== "final" ? (
        <>
          <div style={{ display: "grid", gap: 14 }}>
            {questionStats.map((item, index) => (
              <article key={item.id} style={{ border: `1px solid ${item.complete ? "#86efac" : "#e2e8f0"}`, borderRadius: 16, padding: 14, background: item.complete ? "#f0fdf4" : "#fff", display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <strong>Question {index + 1} of {questionStats.length} · {item.section}</strong>
                  <span style={{ ...styles.badge, background: item.complete ? "#dcfce7" : "#fef3c7", color: item.complete ? "#166534" : "#92400e" }}>{item.words}/{item.minimumWords} words {item.complete ? "✓" : ""}</span>
                </div>
                <h4 style={{ margin: 0, fontSize: "1.03rem" }}>{item.question}</h4>
                <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>{item.help}</p>
                <div style={{ borderLeft: "4px solid #818cf8", padding: "9px 11px", background: "#f8fafc", borderRadius: 8 }}><strong>Starter:</strong> {item.starter}</div>
                <textarea
                  value={state.answers?.[item.id] || ""}
                  onChange={(event) => updateAnswer(item.id, event.target.value)}
                  placeholder={`Write at least ${item.minimumWords} words...`}
                  style={{ minHeight: 125, width: "100%", boxSizing: "border-box", border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, resize: "vertical", font: "inherit", lineHeight: 1.6 }}
                />
                <small style={{ color: item.complete ? "#166534" : "#92400e", fontWeight: 800 }}>
                  {item.complete ? "Section completed." : `Add ${Math.max(item.minimumWords - item.words, 0)} more words.`}
                </small>
              </article>
            ))}
          </div>
          <button type="button" onClick={combineAnswers} disabled={!allComplete} style={{ ...styles.primaryButton, opacity: allComplete ? 1 : 0.5 }}>
            Combine my answers into an essay
          </button>
          {!allComplete ? <p style={{ margin: 0, textAlign: "center", color: "#64748b" }}>Complete all six minimum word requirements to unlock the combined essay.</p> : null}
        </>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          <NoteBox tone="green"><strong>Your essay draft is ready.</strong> Improve transitions, grammar and paragraph flow before using the AI writing coach.</NoteBox>
          <textarea
            value={state.finalEssay || ""}
            onChange={(event) => updateState((previous) => ({ ...previous, finalEssay: event.target.value }))}
            style={{ minHeight: 340, width: "100%", boxSizing: "border-box", border: "1px solid #94a3b8", borderRadius: 12, padding: 14, resize: "vertical", font: "inherit", lineHeight: 1.7 }}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>Words: {countWords(state.finalEssay)}</span>
            <span style={{ ...styles.badge, background: "#fef3c7", color: "#92400e" }}>Target: about {config.targetWords}</span>
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
            <strong>Final checklist</strong>
            <ul style={{ marginBottom: 0, paddingLeft: 20, lineHeight: 1.7 }}>{config.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={styles.secondaryButton} onClick={() => updateState((previous) => ({ ...previous, view: "questions" }))}>Back to questions</button>
            <button type="button" style={styles.secondaryButton} onClick={combineAnswers}>Refresh from answers</button>
            <button type="button" style={styles.primaryButton} onClick={copyEssay} disabled={!state.finalEssay}>Copy final essay</button>
          </div>
          {copyMessage ? <small style={{ color: "#475569", fontWeight: 700 }}>{copyMessage}</small> : null}
        </div>
      )}
    </div>
  );
}

export default function B2Day1IdentityPilotLessonPage({ lesson, falowenRadio = null }) {
  const { showToast } = useToast();
  const storageKey = "falowen:b2:day1:identity-pilot-progress";
  const [activeTab, setActiveTab] = useState("learn");
  const [writingStatus, setWritingStatus] = useState({ complete: false, completedQuestions: 0, totalQuestions: 6, wordCount: 0 });
  const [progress, setProgress] = useState(() => {
    try {
      return {
        learnDone: false,
        speakDone: false,
        reflection: "",
        completed: false,
        ...JSON.parse(localStorage.getItem(storageKey) || "{}"),
      };
    } catch (error) {
      return { learnDone: false, speakDone: false, reflection: "", completed: false };
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);

  const videoEmbed = getYouTubeEmbedUrl(lesson.videoResource?.url);
  const finishReady = progress.learnDone && progress.speakDone && writingStatus.complete;
  const grammarRules = (lesson.grammarLesson?.rules || []).slice(0, 5);
  const grammarExamples = (lesson.grammarLesson?.examples || []).slice(0, 4);

  const markComplete = () => {
    if (!finishReady) return;
    setProgress((previous) => ({ ...previous, completed: true, completedAt: new Date().toISOString() }));
    showToast("B2 Day 1 completed. Your progress was saved.", "success");
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={{ borderRadius: 22, overflow: "hidden", color: "#fff", backgroundImage: `linear-gradient(135deg, rgba(2,6,23,.94), rgba(30,64,175,.72)), url(${lesson.heroImage})`, backgroundSize: "cover", backgroundPosition: "center", padding: "clamp(22px, 4vw, 42px)", display: "grid", gap: 16, minHeight: 300, alignContent: "space-between", boxShadow: "0 20px 52px rgba(15,23,42,.18)" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>B2</span>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>Day 1</span>
          <span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Self-learning pilot</span>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3.8rem)", lineHeight: 1.04 }}>{lesson.title}</h1>
          <p style={{ margin: "10px 0 0", color: "#e2e8f0", fontSize: "1.05rem", lineHeight: 1.6 }}>{lesson.topic}</p>
        </div>
      </header>

      {falowenRadio ? (
        <FalowenRadioTabContent level="B2" day={1} resource={falowenRadio} onContinue={() => setActiveTab("learn")} />
      ) : null}

      <div style={tabBarStyle}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{ ...(activeTab === tab.id ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, minHeight: 44 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "learn" ? (
        <>
          <Section title="AI video">
            <NoteBox><strong>Keep this tab simple:</strong> Watch the video, study the core grammar and mark the section complete.</NoteBox>
            <div style={{ display: "grid", gap: 10 }}>
              <strong>{lesson.videoResource?.title}</strong>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{lesson.videoResource?.description}</p>
              {videoEmbed ? (
                <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#0f172a" }}>
                  <iframe title={lesson.videoResource?.title || "B2 AI video"} src={videoEmbed} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
                </div>
              ) : null}
            </div>
          </Section>
          <Section title="Grammar: Adjektivdeklination und klare Begründungen">
            <NoteBox tone="amber"><strong>Focus:</strong> {lesson.grammarFocus}</NoteBox>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              <div><h3>Core rules</h3><ul style={{ paddingLeft: 20, lineHeight: 1.75 }}>{grammarRules.map((rule) => <li key={rule}>{rule}</li>)}</ul></div>
              <div><h3>Model sentences</h3><ul style={{ paddingLeft: 20, lineHeight: 1.75 }}>{grammarExamples.map((example) => <li key={example}>{example}</li>)}</ul></div>
            </div>
            <NoteBox><strong>Mini practice:</strong> {lesson.grammarLesson?.miniExercise}</NoteBox>
            <label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}>
              <input type="checkbox" checked={progress.learnDone} onChange={(event) => setProgress((previous) => ({ ...previous, learnDone: event.target.checked }))} />
              I watched the AI video and reviewed the grammar.
            </label>
          </Section>
        </>
      ) : null}

      {activeTab === "speak" ? (
        <Section title="Speaking builder">
          <SpeakingBrainMap lesson={lesson} />
          <EmbeddedSpeechPracticePanel />
          <label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}>
            <input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((previous) => ({ ...previous, speakDone: event.target.checked }))} />
            I used the brain map and completed a speaking practice.
          </label>
        </Section>
      ) : null}

      {activeTab === "write" ? (
        <Section title="Guided writing builder">
          <NoteBox><strong>Task:</strong> {lesson.writingTopic}</NoteBox>
          <B2Day1GuidedWritingBuilder onStatusChange={setWritingStatus} />
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 14, display: "grid", gap: 10 }}>
            <h3 style={{ margin: 0 }}>AI writing coach and marking</h3>
            <p style={{ margin: 0, color: "#64748b" }}>After combining your essay, copy it into the coach below for feedback and correction.</p>
            <EmbeddedWritingPracticePanel />
          </div>
        </Section>
      ) : null}

      {activeTab === "finish" ? (
        <Section title="Finish B2 Day 1">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
            <ProgressCard label="Learn" complete={progress.learnDone} detail="AI video and grammar reviewed" />
            <ProgressCard label="Speak" complete={progress.speakDone} detail="Brain map speaking practice completed" />
            <ProgressCard label="Write" complete={writingStatus.complete} detail={`${writingStatus.completedQuestions}/${writingStatus.totalQuestions} questions · ${writingStatus.wordCount} final words`} />
          </div>
          <label style={{ display: "grid", gap: 7 }}>
            <strong>Short reflection</strong>
            <span style={{ color: "#64748b", fontSize: 13 }}>What did you learn about your identity, and what should you improve next?</span>
            <textarea value={progress.reflection} onChange={(event) => setProgress((previous) => ({ ...previous, reflection: event.target.value }))} style={{ minHeight: 120, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit", resize: "vertical" }} />
          </label>
          {!finishReady ? <NoteBox tone="amber">Complete Learn, Speak and the guided writing task before marking the lesson complete.</NoteBox> : null}
          {progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> B2 Day 1 is saved as complete on this device.</NoteBox> : null}
          <button type="button" style={{ ...styles.primaryButton, opacity: finishReady ? 1 : 0.5 }} disabled={!finishReady} onClick={markComplete}>
            {progress.completed ? "Mark complete again" : "Mark B2 Day 1 complete"}
          </button>
        </Section>
      ) : null}
    </div>
  );
}
