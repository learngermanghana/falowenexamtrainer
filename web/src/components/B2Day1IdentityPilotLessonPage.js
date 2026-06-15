import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import { useToast } from "../context/ToastContext";
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

export const speakingTopics = [
  {
    title: "Kultur",
    keywords: ["Traditionen", "Feste", "Herkunft", "Werte", "Zugehörigkeit"],
    examples: [
      ["Welche Traditionen gehören zu deiner Kultur?", "In meiner Kultur spielen Familie und traditionelle Feste eine wichtige Rolle."],
      ["Fühlst du dich mit einer bestimmten Kultur verbunden?", "Ich fühle mich mit meiner ghanaischen Kultur verbunden, obwohl ich auch andere Kulturen interessant finde."],
    ],
  },
  {
    title: "Essen",
    keywords: ["traditionelle Gerichte", "Familienessen", "Essgewohnheiten", "Kindheitserinnerungen", "kulturelle Bedeutung"],
    examples: [
      ["Welches Essen gehört für dich zu deiner Identität?", "Traditionelle Gerichte erinnern mich an meine Familie und meine Kindheit."],
      ["Gibt es ein Gericht, das bei Familienfeiern wichtig ist?", "Bei Familienfeiern essen wir häufig Jollof-Reis oder Fufu."],
    ],
  },
  {
    title: "Sprache",
    keywords: ["Muttersprache", "Deutsch", "Mehrsprachigkeit", "Dialekt oder Akzent", "Zugehörigkeit"],
    examples: [
      ["Welche Sprachen sprichst du?", "Ich spreche Englisch und Twi und lerne außerdem Deutsch."],
      ["Welche Rolle spielt Sprache für deine Identität?", "Durch meine Muttersprache fühle ich mich meiner Familie und meiner Kultur besonders verbunden."],
    ],
  },
  {
    title: "Familie und Werte",
    keywords: ["Erziehung", "Respekt", "Verantwortung", "Religion", "Unterstützung"],
    examples: [
      ["Welche Werte hast du von deiner Familie gelernt?", "Meine Familie hat mir beigebracht, respektvoll und verantwortungsbewusst zu handeln."],
      ["Wer hat dich besonders geprägt?", "Meine Mutter hat mich stark geprägt, weil sie mir gezeigt hat, wie wichtig Ausdauer ist."],
    ],
  },
  {
    title: "Interessen und persönliche Entwicklung",
    keywords: ["Musik", "Sport", "Kleidung", "Hobbys", "persönliche Ziele", "Veränderungen"],
    examples: [
      ["Welche Interessen zeigen deine Persönlichkeit?", "Musik und kreative Arbeit sind ein wichtiger Teil meiner Persönlichkeit."],
      ["Was möchtest du in Zukunft an dir weiterentwickeln?", "Ich möchte selbstbewusster werden und meine Meinung klarer ausdrücken."],
    ],
  },
];

export const SpeakingPoints = () => <div style={{ display: "grid", gap: 10 }}><div><h3 style={{ margin: "0 0 6px" }}>Themen für deine Antwort</h3><p style={{ margin: 0, color: "#475569" }}>Lies die Fragen und Beispiele. Wähle passende Ideen aus und verwende sie in deiner eigenen Sprechübung.</p></div>{speakingTopics.map((topic, index) => <article key={topic.title} style={{ border: "1px solid #c7d2fe", borderRadius: 14, padding: 12, background: "#eef2ff", lineHeight: 1.65, display: "grid", gap: 8 }}><strong>{index + 1}. {topic.title}</strong><div style={{ color: "#475569", fontWeight: 700 }}>{topic.keywords.join(" • ")}</div>{topic.examples.map(([question, answer]) => <div key={question}><div>{question}</div><div style={{ color: "#3730a3" }}>• {answer}</div></div>)}</article>)}</div>;

export default function B2Day1IdentityPilotLessonPage({ lesson, falowenRadio = null }) {
  const { showToast } = useToast();
  const storageKey = "falowen:b2:day1:identity-pilot-progress";
  const [activeTab, setActiveTab] = useState("learn");
  const [writingStatus, setWritingStatus] = useState({ complete: false, completedQuestions: 0, totalQuestions: b2Day1QuestionWritingBuilder.questions.length, wordCount: 0 });
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
          <SpeakingPoints />
          <EmbeddedSpeechPracticePanel />
          <label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}>
            <input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((previous) => ({ ...previous, speakDone: event.target.checked }))} />
            I completed a speaking practice.
          </label>
        </Section>
      ) : null}

      {activeTab === "write" ? (
        <Section title="Guided writing builder">
          <NoteBox><strong>Task:</strong> {lesson.writingTopic}</NoteBox>
          <GuidedWritingWorkspace config={b2Day1QuestionWritingBuilder} storageKey="falowen:b2:day1:question-writing-builder" cloudField="b2Day1GuidedWriting" onStatusChange={setWritingStatus} />
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
