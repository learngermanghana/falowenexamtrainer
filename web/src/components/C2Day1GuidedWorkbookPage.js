import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import { AdvancedSelfLearningTabNav } from "./StandardWorkbookComponents";
import { styles } from "../styles";
import { getC2ExamStandard } from "../data/c2ExamStandardContent";

const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 10px 26px rgba(15,23,42,.06)",
};

const Section = ({ title, children }) => (
  <section style={card}>
    <h2 style={{ margin: 0, fontSize: "1.18rem" }}>{title}</h2>
    {children}
  </section>
);

const ThinkingStep = ({ number, title, question, example }) => (
  <div style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 13, background: "#f8fbff", display: "grid", gap: 6 }}>
    <strong style={{ color: "#1e3a8a" }}>{number}. {title}</strong>
    <span style={{ color: "#334155", lineHeight: 1.6 }}>{question}</span>
    {example ? <span style={{ color: "#64748b", fontSize: 13 }}><strong>Example:</strong> {example}</span> : null}
  </div>
);

const RegisterCard = ({ label, sentence, note }) => (
  <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 13, background: "#fff", display: "grid", gap: 6 }}>
    <strong>{label}</strong>
    <span style={{ fontSize: "1.02rem" }}>{sentence}</span>
    <span style={{ color: "#64748b", fontSize: 13 }}>{note}</span>
  </div>
);

const ProgressCard = ({ label, done, detail }) => (
  <div style={{ border: `1px solid ${done ? "#86efac" : "#cbd5e1"}`, borderRadius: 14, padding: 13, background: done ? "#f0fdf4" : "#fff", display: "grid", gap: 4 }}>
    <strong>{done ? "Complete" : "Not complete"} · {label}</strong>
    <span style={{ color: "#64748b", fontSize: 13 }}>{detail}</span>
  </div>
);

const OpinionBox = ({ children }) => (
  <blockquote
    style={{
      margin: 0,
      padding: "18px 20px",
      border: "1px solid #cbd5e1",
      borderRadius: 14,
      background: "#fff",
      boxShadow: "0 8px 20px rgba(15,23,42,.07)",
      fontSize: "1.03rem",
      fontStyle: "italic",
      lineHeight: 1.7,
    }}
  >
    {children}
  </blockquote>
);

const UmformungCard = ({ number, source, cue, value, onChange, solution }) => (
  <article style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 14, background: "#f8fbff", display: "grid", gap: 10 }}>
    <div style={{ display: "grid", gap: 5 }}>
      <strong>{number}. Ausgangssatz</strong>
      <span style={{ lineHeight: 1.65 }}>{source}</span>
    </div>
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ color: "#475569", fontWeight: 700 }}>Vorgegebenes Wort – nicht verändern:</span>
      <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e3a8a" }}>{cue}</span>
    </div>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={`Formulieren Sie den Satz mit „${cue}“ neu.`}
      style={{ minHeight: 96, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit", lineHeight: 1.65 }}
    />
    <details>
      <summary style={{ cursor: "pointer", fontWeight: 800 }}>Musterlösung anzeigen</summary>
      <p style={{ marginBottom: 0, lineHeight: 1.7 }}>{solution}</p>
    </details>
  </article>
);

const SPEAK_QUOTES = [
  "„Verbraucher tragen die größte Verantwortung für nachhaltigen Konsum.“",
  "„Ohne strengere gesetzliche Vorgaben werden Unternehmen ihr Verhalten kaum ändern.“",
  "„Reparieren und Wiederverwenden sind langfristig wichtiger als Recycling.“",
];

const C2_SPEAK_IDEAS = [
  {
    title: "1. Verantwortung der Verbraucher",
    ideas: ["Wegwerfmentalität", "Kaufentscheidungen", "langlebige Produkte", "Nachfrage verändern"],
    prompt: "Inwiefern können Verbraucher durch ihr Kaufverhalten nachhaltigen Konsum fördern?",
    starter: "Verbraucher tragen insofern Verantwortung, als ...",
    example:
      "Wer langlebige und reparierbare Produkte bevorzugt, kann die Nachfrage nach kurzlebigen Wegwerfprodukten verringern. Allerdings bleibt diese Wirkung begrenzt, wenn nachhaltige Alternativen deutlich teurer oder kaum verfügbar sind.",
  },
  {
    title: "2. Verantwortung der Hersteller",
    ideas: ["Produktlebenszyklen", "Reparierbarkeit", "Ersatzteile", "Wiederverwendbarkeit"],
    prompt: "Welche Verantwortung haben Unternehmen bereits bei der Entwicklung eines Produkts?",
    starter: "Die Verantwortung der Hersteller liegt weniger darin, ... als vielmehr darin, ...",
    example:
      "Unternehmen beeinflussen den Ressourcenverbrauch bereits durch die Produktgestaltung. Wenn Geräte modular aufgebaut, reparierbar und mit Ersatzteilen versorgt werden, verlängert sich ihre Nutzungsdauer erheblich.",
  },
  {
    title: "3. Reparieren und Wiederverwenden statt nur Recycling",
    ideas: ["Ressourcenschonung", "Mehrwegsysteme", "Reparatursysteme", "Rohstoffverbrauch"],
    prompt: "Warum können Reparatur und Wiederverwendung wirksamer sein als Recycling allein?",
    starter: "Recycling ist zwar grundsätzlich sinnvoll, greift jedoch zu kurz, wenn ...",
    example:
      "Recycling gewinnt einen Teil der Rohstoffe zurück, verbraucht aber ebenfalls Energie und Ressourcen. Wiederverwendung und Reparatur können dagegen verhindern, dass ein funktionsfähiges Produkt überhaupt zu Abfall wird.",
  },
  {
    title: "4. Staatliche Rahmenbedingungen und Anreize",
    ideas: ["steuerliche Anreize", "Recht auf Reparatur", "Mindeststandards", "wirtschaftliche Anreize"],
    prompt: "Welche politischen Maßnahmen könnten die Kreislaufwirtschaft wirksamer machen?",
    starter: "Ohne geeignete regulatorische und wirtschaftliche Anreize dürfte es schwierig sein, ...",
    example:
      "Steuerliche Vorteile für Reparaturen, verbindliche Standards für Ersatzteile und klare Anforderungen an die Reparierbarkeit könnten nachhaltige Entscheidungen für Verbraucher und Unternehmen attraktiver machen.",
  },
  {
    title: "5. Differenzierte Schlussposition",
    ideas: ["geteilte Verantwortung", "Verbraucher", "Unternehmen", "Politik", "langfristige Wirkung"],
    prompt: "Welche Akteure müssen zusammenwirken, damit die Wegwerfgesellschaft tatsächlich zurückgedrängt wird?",
    starter: "Zusammenfassend erscheint mir weniger ein einzelner Akteur entscheidend als vielmehr ...",
    example:
      "Eine Kreislaufwirtschaft kann langfristig nur funktionieren, wenn Verbraucher bewusster konsumieren, Unternehmen langlebige Produkte entwickeln und der Staat geeignete Rahmenbedingungen schafft.",
  },
];

const WRITE_OPINIONS = [
  "„Hersteller sollten verpflichtet werden, Produkte so zu bauen, dass sie länger halten und leichter repariert werden können.“",
  "„Nicht Unternehmen, sondern Verbraucher entscheiden mit ihrem Kaufverhalten, ob die Wegwerfgesellschaft bestehen bleibt.“",
  "„Recycling allein reicht nicht aus; entscheidend sind Wiederverwendung und Reparatur.“",
];

const UMFORMUNGEN = [
  {
    source: "Die Regierung möchte durch finanzielle Anreize Reparaturen fördern.",
    cue: "zur",
    solution: "Die Regierung schafft finanzielle Anreize zur Förderung von Reparaturen.",
  },
  {
    source: "Viele Verbraucher waren skeptisch, ob sich Reparaturen finanziell lohnen.",
    cue: "Zweifel",
    solution: "Viele Verbraucher hatten Zweifel daran, ob sich Reparaturen finanziell lohnen.",
  },
  {
    source: "Die Unternehmen erkannten, dass langlebige Produkte stärker nachgefragt werden.",
    cue: "klar",
    solution: "Den Unternehmen wurde klar, dass langlebige Produkte stärker nachgefragt werden.",
  },
];

export default function C2Day1GuidedWorkbookPage() {
  const standard = getC2ExamStandard(1);
  const topicKnowledge = standard?.topicKnowledge;
  const storageKey = "falowen:c2:day1:guided-workbook";
  const [active, setActive] = useState("learn");
  const [progress, setProgress] = useState(() => {
    try {
      return {
        learnDone: false,
        speakDone: false,
        writeDone: false,
        confidence: "",
        reflection: "",
        ...JSON.parse(window.localStorage.getItem(storageKey) || "{}"),
      };
    } catch {
      return { learnDone: false, speakDone: false, writeDone: false, confidence: "", reflection: "" };
    }
  });
  const [speakPlan, setSpeakPlan] = useState("");
  const [writingPlan, setWritingPlan] = useState("");
  const [writingDraft, setWritingDraft] = useState("");
  const [reformulations, setReformulations] = useState({ 0: "", 1: "", 2: "" });

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress]);

  const wordCount = useMemo(() => writingDraft.trim() ? writingDraft.trim().split(/\s+/).length : 0, [writingDraft]);
  const finishReady = progress.learnDone && progress.speakDone && progress.writeDone && Boolean(progress.confidence);

  if (!standard || !topicKnowledge) return null;

  return (
    <main style={{ ...styles.container, display: "grid", gap: 18 }} data-c2-day1-guided-workbook="true">
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={{ ...card, padding: "clamp(20px,4vw,34px)", background: "linear-gradient(135deg,#0f172a,#1e3a8a 58%,#2563eb)", color: "#fff" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.14)", color: "#fff" }}>C2</span>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.14)", color: "#fff" }}>Day 1</span>
          <span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Chapter {topicKnowledge.chapter}</span>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem,5vw,3.2rem)" }}>{standard.title}</h1>
          <p style={{ margin: "10px 0 0", color: "#dbeafe", lineHeight: 1.65 }}>{standard.topic}</p>
        </div>
        <div style={{ border: "1px solid rgba(255,255,255,.2)", borderRadius: 14, padding: 13, background: "rgba(255,255,255,.08)" }}>
          <strong>Today’s C2 control:</strong> {standard.grammarFocus}
        </div>
      </header>

      <AdvancedSelfLearningTabNav level="C2" day={1} activeTab={active} onChange={setActive} />

      {active === "learn" ? <>
        <Section title="Thema verstehen · Kreislaufwirtschaft zuerst verstehen">
          <div data-c2-day1-topic-foundation="true" style={{ display: "grid", gap: 14 }}>
            <div style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 14, background: "#eff6ff", lineHeight: 1.7 }}>
              <strong>In simple English</strong>
              <p style={{ margin: "7px 0 0" }}>{topicKnowledge.englishDefinition}</p>
            </div>
            <div style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 14, background: "#fff", lineHeight: 1.7 }}>
              <strong>Auf Deutsch</strong>
              <p style={{ margin: "7px 0 0" }}>{topicKnowledge.germanDefinition}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 10 }}>
              <div style={{ border: "1px solid #fecaca", borderRadius: 14, padding: 14, background: "#fff7f7" }}>
                <strong>Wegwerfgesellschaft · linear</strong>
                <p style={{ marginBottom: 0, lineHeight: 1.7 }}>{topicKnowledge.linearModel}</p>
              </div>
              <div style={{ border: "1px solid #bbf7d0", borderRadius: 14, padding: 14, background: "#f0fdf4" }}>
                <strong>Kreislaufwirtschaft · circular</strong>
                <p style={{ marginBottom: 0, lineHeight: 1.7 }}>{topicKnowledge.circularModel}</p>
              </div>
            </div>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, lineHeight: 1.7 }}>
              <strong>{topicKnowledge.exampleTitle}</strong>
              <p style={{ marginBottom: 0 }}>{topicKnowledge.example}</p>
            </div>
            <div>
              <strong style={{ display: "block", marginBottom: 8 }}>Wer trägt Verantwortung?</strong>
              <div style={{ display: "grid", gap: 8 }}>
                {topicKnowledge.actors.map(([actor, role]) => (
                  <div key={actor} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
                    <strong>{actor}</strong> — {role}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <strong style={{ display: "block", marginBottom: 8 }}>Welche Interessen geraten in Spannung?</strong>
              <div style={{ display: "grid", gap: 8 }}>
                {topicKnowledge.tensions.map(([left, right]) => (
                  <div key={left} style={{ border: "1px solid #fde68a", borderRadius: 12, padding: 12, background: "#fffbeb" }}>
                    <strong>{left}</strong> ↔ <strong>{right}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ border: "1px solid #c7d2fe", borderRadius: 14, padding: 14, background: "#eef2ff", lineHeight: 1.7 }}>
              <strong>Kernfrage für die Stunde</strong>
              <p style={{ marginBottom: 0 }}>{topicKnowledge.coreQuestion}</p>
            </div>
            <div>
              <strong style={{ display: "block", marginBottom: 8 }}>Die drei Kursaussagen verstehen</strong>
              <div style={{ display: "grid", gap: 8 }}>
                {topicKnowledge.perspectives.map(([claim, guide]) => (
                  <div key={claim} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, display: "grid", gap: 5 }}>
                    <strong>{claim}</strong>
                    <span style={{ color: "#475569" }}>{guide}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Think first · Topic knowledge before sophisticated German">
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
            At C2, strong German is not enough if the topic itself is unclear. First understand the issue, the actors and the conflict of interests. Then choose precise German to evaluate those ideas.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            <ThinkingStep number="1" title="Meaning" question="What exactly do I want to communicate? Agreement, criticism, distance, solidarity, uncertainty?" example="I disagree with the position." />
            <ThinkingStep number="2" title="Relationship" question="Who is listening or reading? Friend, colleague, examiner, academic audience, authority?" example="An academic discussion requires controlled criticism rather than emotional slang." />
            <ThinkingStep number="3" title="Register" question="Should the sentence sound informal, neutral-professional or formal-academic?" example="Das ist Quatsch. → Ich halte diese Position für wenig überzeugend. → Diese Position erscheint nur bedingt tragfähig." />
            <ThinkingStep number="4" title="Precision" question="Which verb, noun or collocation expresses the exact stance?" example="problematisch, nur bedingt überzeugend, kritisch zu beurteilen" />
            <ThinkingStep number="5" title="Naturalness check" question="Would an educated native speaker actually say this here, or have I made it complicated only to sound advanced?" />
          </div>
        </Section>

        <Section title="Register ladder">
          <RegisterCard label="Informal" sentence="Das finde ich echt nicht gut." note="Personal, direct, emotional. Appropriate in an informal conversation." />
          <RegisterCard label="Neutral / professional" sentence="Ich halte diese Entwicklung für problematisch." note="Clear and controlled. Suitable for professional discussion." />
          <RegisterCard label="Formal / academic" sentence="Diese Entwicklung ist meines Erachtens kritisch zu beurteilen." note="More distanced and evaluative. Appropriate in academic argumentation." />
        </Section>

        <Section title="Precise vocabulary and collocations">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 10 }}>
            {topicKnowledge.vocabulary.map(([word, meaning]) => <div key={word} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}><strong>{word}</strong><div style={{ color: "#64748b" }}>{meaning}</div></div>)}
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {topicKnowledge.collocations.map(([phrase, meaning, example]) => <div key={phrase} style={{ border: "1px solid #dbeafe", borderRadius: 12, padding: 12, background: "#eff6ff" }}><strong>{phrase}</strong> — {meaning}<p style={{ margin: "6px 0 0" }}>{example}</p></div>)}
          </div>
        </Section>

        <Section title="Topic check · Vorbereitung auf die Unterrichtsfragen">
          <div style={{ display: "grid", gap: 10 }}>
            {topicKnowledge.checks.map((check, index) => (
              <details key={check.question} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
                <summary style={{ cursor: "pointer", fontWeight: 800 }}>{index + 1}. {check.question}</summary>
                <ol style={{ lineHeight: 1.7 }}>{check.options.map((option) => <li key={option}>{option}</li>)}</ol>
                <p><strong>Antwort:</strong> {check.options[check.answerIndex]}</p>
                <p style={{ marginBottom: 0 }}>{check.explanation}</p>
              </details>
            ))}
          </div>
          <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontWeight: 700, lineHeight: 1.5 }}>
            <input type="checkbox" checked={progress.learnDone} onChange={(e) => setProgress((old) => ({ ...old, learnDone: e.target.checked }))} style={{ marginTop: 4 }} />
            I understand the topic, can explain the main conflict, and can use at least one suitable collocation before I start speaking.
          </label>
        </Section>
      </> : null}

      {active === "speak" ? <Section title="Speaking builder">
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <strong style={{ display: "block", marginBottom: 6 }}>Thema 1: Kreislaufwirtschaft und Wegwerfgesellschaft</strong>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              Sie sind Teilnehmer oder Teilnehmerin an einem Seminar zum Thema nachhaltiger Konsum und halten dort einen fünfminütigen Vortrag zum Thema „Kreislaufwirtschaft und Wegwerfgesellschaft“. Im Anschluss beantworten Sie Fragen dazu.
            </p>
          </div>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Wägen Sie unterschiedliche Standpunkte ab. Sie können sich an folgenden Zitaten orientieren. Geben Sie auch Beispiele.
          </p>
          <div style={{ display: "grid", gap: 10, padding: "clamp(14px,3vw,24px)", borderRadius: 16, background: "#f1f5f9" }}>
            {SPEAK_QUOTES.map((quote) => <OpinionBox key={quote}>{quote}</OpinionBox>)}
          </div>

          <div
            data-c2-day1-speaking-ideas="true"
            style={{ display: "grid", gap: 12, padding: "clamp(14px,3vw,22px)", borderRadius: 16, border: "1px solid #c7d2fe", background: "#eef2ff" }}
          >
            <div>
              <strong style={{ display: "block", fontSize: "1.05rem" }}>Ideen für Ihren Vortrag</strong>
              <p style={{ margin: "5px 0 0", color: "#475569", lineHeight: 1.65 }}>
                Wie bei A2 und B1: Wählen Sie 3–4 Ideen und bauen Sie daraus Ihre eigene Antwort.
                Entwickeln Sie jeden Punkt als <strong>Aussage → Begründung → Beispiel → Einordnung</strong>.
                Sie müssen nicht alle Ideen verwenden.
              </p>
            </div>
            {C2_SPEAK_IDEAS.map((branch) => (
              <div
                key={branch.title}
                style={{ border: "1px solid #c7d2fe", borderRadius: 14, padding: 13, background: "#fff", display: "grid", gap: 7 }}
              >
                <strong>{branch.title}</strong>
                <div><strong>Ideen:</strong> {branch.ideas.join(" · ")}</div>
                <div><strong>Leitfrage:</strong> {branch.prompt}</div>
                <div style={{ color: "#1e3a8a" }}><strong>C2-Satzanfang:</strong> {branch.starter}</div>
                <div style={{ color: "#334155" }}><strong>So können Sie den Gedanken entwickeln:</strong> {branch.example}</div>
              </div>
            ))}
          </div>

          <div style={{ lineHeight: 1.7 }}>
            <strong>Achten Sie darauf, dass Sie</strong>
            <ul style={{ marginBottom: 0 }}>
              <li>Ihren Vortrag gut strukturieren,</li>
              <li>anspruchsvolle Sprache (Wörter, Strukturen) einsetzen,</li>
              <li>Ihre persönliche Einstellung zum Thema klar machen.</li>
            </ul>
          </div>
          <label style={{ display: "grid", gap: 7 }}>
            <strong>Vortragsplan</strong>
            <textarea
              value={speakPlan}
              onChange={(event) => setSpeakPlan(event.target.value)}
              placeholder="Einleitung → Standpunkt 1 → Standpunkt 2 → Beispiel → eigene Position → Schluss"
              style={{ minHeight: 150, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit", lineHeight: 1.7 }}
            />
          </label>
          <EmbeddedSpeechPracticePanel />
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
            <input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />
            I completed the five-minute C2 presentation practice.
          </label>
        </div>
      </Section> : null}

      {active === "write" ? <>
        <Section title="Schreiben · Aufgabe 2">
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <strong style={{ display: "block", marginBottom: 6 }}>Thema 1: Kreislaufwirtschaft und Wegwerfgesellschaft</strong>
              <p style={{ margin: 0, lineHeight: 1.75 }}>
                Sie haben im Fernsehen eine Diskussionsrunde zum Thema „Kreislaufwirtschaft und Wegwerfgesellschaft“ verfolgt. Nach der Sendung wurden die Zuschauer aufgefordert, ihre Meinung abzugeben. Sie schreiben eine ausführliche E-Mail (circa 350 Wörter) an die Redaktion, in der Sie sich auf die drei folgenden Diskussionsbeiträge beziehen und Ihre Meinung dazu äußern.
              </p>
            </div>
            <div style={{ display: "grid", gap: 12, padding: "clamp(14px,3vw,24px)", borderRadius: 16, background: "#f1f5f9" }}>
              {WRITE_OPINIONS.map((opinion) => <OpinionBox key={opinion}>{opinion}</OpinionBox>)}
            </div>
            <label style={{ display: "grid", gap: 7 }}>
              <strong>Planung</strong>
              <textarea
                value={writingPlan}
                onChange={(event) => setWritingPlan(event.target.value)}
                placeholder="Beitrag 1 → Beitrag 2 → Beitrag 3 → eigene Position → Beispiele → Schluss"
                style={{ minHeight: 140, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit", lineHeight: 1.7 }}
              />
            </label>
            <label style={{ display: "grid", gap: 7 }}>
              <strong>Ihre E-Mail an die Redaktion</strong>
              <textarea
                value={writingDraft}
                onChange={(event) => setWritingDraft(event.target.value)}
                placeholder="Schreiben Sie hier Ihren vollständigen C2-Text..."
                style={{ minHeight: 380, border: "1px solid #94a3b8", borderRadius: 12, padding: 14, font: "inherit", lineHeight: 1.75 }}
              />
            </label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", color: "#475569", fontWeight: 700 }}>
              <span>{wordCount} Wörter</span>
              <span>Ziel: circa 350 Wörter</span>
            </div>
          </div>
        </Section>

        <Section title="Schreiben · Aufgabe 1 · Umformung">
          <p style={{ margin: 0, lineHeight: 1.7, color: "#475569" }}>
            Formulieren Sie die markierte Aussage neu. Verwenden Sie das vorgegebene Wort unverändert und erhalten Sie die Bedeutung.
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {UMFORMUNGEN.map((item, index) => (
              <UmformungCard
                key={`${item.cue}-${index}`}
                number={index + 1}
                source={item.source}
                cue={item.cue}
                value={reformulations[index] || ""}
                onChange={(value) => setReformulations((old) => ({ ...old, [index]: value }))}
                solution={item.solution}
              />
            ))}
          </div>
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
            <input type="checkbox" checked={progress.writeDone} onChange={(event) => setProgress((old) => ({ ...old, writeDone: event.target.checked }))} />
            I completed the 350-word writing task and the three Umformungen.
          </label>
        </Section>
      </> : null}

      {active === "finish" ? <Section title="Finish C2 Day 1">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
          <ProgressCard label="Learn" done={progress.learnDone} detail="Topic, conflict and C2 language understood" />
          <ProgressCard label="Speak" done={progress.speakDone} detail="Five-minute Goethe-style presentation completed" />
          <ProgressCard label="Write" done={progress.writeDone} detail={`${wordCount} words · essay and Umformung practice completed`} />
        </div>
        <label style={{ display: "grid", gap: 7 }}><strong>Confidence</strong><select value={progress.confidence} onChange={(e) => setProgress((old) => ({ ...old, confidence: e.target.value }))} style={styles.select}><option value="">Select confidence</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        <label style={{ display: "grid", gap: 7 }}><strong>Reflection</strong><textarea value={progress.reflection} onChange={(e) => setProgress((old) => ({ ...old, reflection: e.target.value }))} placeholder="What was difficult in the Vortrag, essay or Umformung today?" style={{ minHeight: 110, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit" }} /></label>
        <div style={{ border: `1px solid ${finishReady ? "#86efac" : "#fde68a"}`, borderRadius: 14, padding: 13, background: finishReady ? "#f0fdf4" : "#fffbeb" }}>
          {finishReady ? "Day 1 requirements complete." : "Complete Learn, Speak, Write and choose your confidence level before treating Day 1 as complete."}
        </div>
      </Section> : null}

      {active === "references" ? <>
        <Section title="Umformung reference">
          <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Rule:</strong> Preserve the meaning, use the supplied word exactly as given, and make every grammatical change required by the new structure.</p>
          <p><strong>Example:</strong> Die Regierung möchte durch finanzielle Anreize Reparaturen fördern. → Die Regierung schafft finanzielle Anreize <strong>zur Förderung</strong> von Reparaturen.</p>
        </Section>
        <Section title="C2 challenge">
          <p style={{ margin: 0, lineHeight: 1.7 }}>{topicKnowledge.challenge}</p>
          <strong>Final control: topic knowledge · argument · register · precision · nuance · natural collocation.</strong>
        </Section>
      </> : null}
    </main>
  );
}
