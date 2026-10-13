import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";

const PLACEMENT_STORAGE_KEY = "falowen.placementTest.progress.v3";
const CLASS_BROCHURE_URL = "/classes/";

const placementTest = {
  title: "Free German placement test",
  subtitle:
    "Check your current German from A1 basics through C1 readiness. Falowen uses your performance across the levels to suggest the best class starting point.",
  sections: [
    {
      id: "a1-basics",
      level: "A1",
      title: "A1 basics: greetings, numbers and simple grammar",
      description: "These questions check if you can handle beginner German structures.",
      questions: [
        {
          id: "a1-1",
          text: "Which sentence is correct?",
          options: ["Ich heißen Ama.", "Ich heiße Ama.", "Ich heißt Ama."],
          correct: "Ich heiße Ama.",
        },
        {
          id: "a1-2",
          text: "Choose the correct answer: Wie alt bist du?",
          options: ["Ich bin 20 Jahre alt.", "Ich habe 20 Jahre.", "Ich ist 20 Jahre alt."],
          correct: "Ich bin 20 Jahre alt.",
        },
        {
          id: "a1-3",
          text: "Which article is correct? ___ Tisch ist neu.",
          options: ["Der", "Die", "Das"],
          correct: "Der",
        },
        {
          id: "a1-4",
          text: "Which sentence uses the verb in the correct position?",
          options: ["Ich gern lerne Deutsch.", "Ich lerne gern Deutsch.", "Ich Deutsch gern lerne."],
          correct: "Ich lerne gern Deutsch.",
        },
        {
          id: "a1-5",
          text: "What is the correct question?",
          options: ["Woher du kommst?", "Woher kommst du?", "Woher du kommen?"],
          correct: "Woher kommst du?",
        },
        {
          id: "a1-6",
          text: "Choose the correct verb: Am Montag ___ ich Deutsch.",
          options: ["lerne", "lernen", "lernt"],
          correct: "lerne",
        },
      ],
    },
    {
      id: "a2-everyday",
      level: "A2",
      title: "A2: everyday situations and Perfekt",
      description: "These questions check everyday comprehension, past events, polite requests and common structures.",
      passage: [
        "Mara war am Samstag in der Stadt. Zuerst hat sie im Supermarkt eingekauft. Danach ist sie mit ihrer Freundin ins Café gegangen. Am Abend hat sie zu Hause gekocht.",
      ],
      questions: [
        {
          id: "a2-1",
          text: "Was hat Mara zuerst gemacht?",
          options: ["Sie ist ins Café gegangen.", "Sie hat eingekauft.", "Sie hat gekocht."],
          correct: "Sie hat eingekauft.",
        },
        {
          id: "a2-2",
          text: "Wählen Sie den richtigen Perfekt-Satz.",
          options: ["Ich habe gestern gelernt.", "Ich bin gestern gelernt.", "Ich habe gestern lernen."],
          correct: "Ich habe gestern gelernt.",
        },
        {
          id: "a2-3",
          text: "Welche Bitte ist höflich?",
          options: ["Gib mir Wasser!", "Könnten Sie mir bitte Wasser geben?", "Du Wasser geben."],
          correct: "Könnten Sie mir bitte Wasser geben?",
        },
        {
          id: "a2-4",
          text: "Ergänzen Sie: Ich gehe zum Arzt, ___ ich krank bin.",
          options: ["weil", "aber", "oder"],
          correct: "weil",
        },
        {
          id: "a2-5",
          text: "Welche Antwort passt? Wie lange lernst du schon Deutsch?",
          options: ["Seit einem Jahr.", "Vor einem Jahr lang.", "Für gestern."],
          correct: "Seit einem Jahr.",
        },
        {
          id: "a2-6",
          text: "Welcher Satz ist korrekt?",
          options: [
            "Ich interessiere mich für Musik.",
            "Ich interessiere mir für Musik.",
            "Ich interessiere für mich Musik.",
          ],
          correct: "Ich interessiere mich für Musik.",
        },
      ],
    },
    {
      id: "b1-reading-opinion",
      level: "B1",
      title: "B1: Meinungen verstehen und Sätze verbinden",
      description: "Ab B1 werden die Aufgaben überwiegend auf Deutsch gestellt.",
      passage: [
        "Viele Jugendliche benutzen ihr Handy auch in der Schule. Einige Lehrer finden das problematisch, weil die Schüler sich nicht konzentrieren. Andere sagen, dass Handys beim Lernen helfen können, wenn man sie richtig benutzt.",
      ],
      questions: [
        {
          id: "b1-1",
          text: "Warum finden einige Lehrer Handys problematisch?",
          options: [
            "Weil sich die Schüler möglicherweise nicht konzentrieren.",
            "Weil Handys zu teuer sind.",
            "Weil Schulen kein Internet haben.",
          ],
          correct: "Weil sich die Schüler möglicherweise nicht konzentrieren.",
        },
        {
          id: "b1-2",
          text: "Welcher Satz ist grammatisch richtig?",
          options: [
            "Ich denke, dass Deutsch wichtig ist.",
            "Ich denke, dass Deutsch ist wichtig.",
            "Ich denke, Deutsch dass wichtig ist.",
          ],
          correct: "Ich denke, dass Deutsch wichtig ist.",
        },
        {
          id: "b1-3",
          text: "Wählen Sie den passenden Konnektor: Ich möchte in Deutschland arbeiten, ___ lerne ich jeden Tag Deutsch.",
          options: ["deshalb", "trotzdem", "obwohl"],
          correct: "deshalb",
        },
        {
          id: "b1-4",
          text: "Welcher Satz drückt eine Meinung mit Begründung aus?",
          options: [
            "Ich finde Online-Unterricht praktisch, weil man von zu Hause lernen kann.",
            "Online-Unterricht und zu Hause.",
            "Ich finde Online-Unterricht, aber lernen.",
          ],
          correct: "Ich finde Online-Unterricht praktisch, weil man von zu Hause lernen kann.",
        },
        {
          id: "b1-5",
          text: "Welcher Satz mit obwohl ist korrekt?",
          options: [
            "Obwohl ich müde bin, lerne ich weiter.",
            "Obwohl ich bin müde, ich lerne weiter.",
            "Obwohl müde ich bin, lerne weiter ich.",
          ],
          correct: "Obwohl ich müde bin, lerne ich weiter.",
        },
        {
          id: "b1-6",
          text: "Ergänzen Sie: Das ist der Kurs, ___ ich dir empfohlen habe.",
          options: ["den", "dem", "der"],
          correct: "den",
        },
      ],
    },
    {
      id: "b2-advanced",
      level: "B2",
      title: "B2: Argumentation und präziser Wortschatz",
      description: "Diese Aufgaben prüfen abstrakteres Textverständnis, Konnektoren und differenziertere Sprache.",
      passage: [
        "Digitale Lernangebote eröffnen vielen Menschen neue Chancen, weil sie unabhängig von Ort und Zeit genutzt werden können. Trotzdem ersetzen sie nicht immer den persönlichen Kontakt, der besonders beim Sprachenlernen wichtig bleibt.",
      ],
      questions: [
        {
          id: "b2-1",
          text: "Welche Aussage fasst den Text am besten zusammen?",
          options: [
            "Digitales Lernen schafft Flexibilität, ersetzt aber nicht immer den persönlichen Kontakt.",
            "Digitales Lernen ist grundsätzlich besser als Präsenzunterricht.",
            "Sprachen kann man online nicht lernen.",
          ],
          correct: "Digitales Lernen schafft Flexibilität, ersetzt aber nicht immer den persönlichen Kontakt.",
        },
        {
          id: "b2-2",
          text: "Wählen Sie das passende Wort: Online-Lernen ___ vielen Menschen neue Möglichkeiten.",
          options: ["eröffnet", "beginnt", "befindet", "verpasst"],
          correct: "eröffnet",
        },
        {
          id: "b2-3",
          text: "Welcher Satz entspricht am ehesten dem B2-Niveau?",
          options: [
            "Einerseits ist Online-Lernen flexibel, andererseits fehlt manchmal der direkte Austausch.",
            "Online gut, Schule auch gut.",
            "Ich mag Online, weil ja.",
          ],
          correct: "Einerseits ist Online-Lernen flexibel, andererseits fehlt manchmal der direkte Austausch.",
        },
        {
          id: "b2-4",
          text: "Welche Bedeutung hat „trotzdem“ in diesem Zusammenhang?",
          options: ["dennoch", "weil", "bevor"],
          correct: "dennoch",
        },
        {
          id: "b2-5",
          text: "Welche Formulierung ist am präzisesten?",
          options: [
            "Die Einführung digitaler Angebote ermöglicht flexibleres Lernen.",
            "Digitale Angebote machen Lernen irgendwie anders.",
            "Wegen digital ist Lernen flexibel sein.",
          ],
          correct: "Die Einführung digitaler Angebote ermöglicht flexibleres Lernen.",
        },
        {
          id: "b2-6",
          text: "Welcher Satz verwendet eine komplexe Vergleichsstruktur korrekt?",
          options: [
            "Je flexibler das Angebot ist, desto leichter lässt es sich in den Alltag integrieren.",
            "Je flexibler ist das Angebot, desto es leichter integrieren lässt.",
            "Je das Angebot flexibler, desto leichter es ist integrieren.",
          ],
          correct: "Je flexibler das Angebot ist, desto leichter lässt es sich in den Alltag integrieren.",
        },
      ],
    },
    {
      id: "c1-readiness",
      level: "C1",
      title: "C1 readiness: Nuancen, Struktur und formelle Sprache",
      description: "Diese letzte Stufe prüft, ob Sie komplexere Zusammenhänge und gehobene Strukturen sicher erkennen.",
      passage: [
        "Viele Unternehmen führen hybride Arbeitsmodelle ein. Sie versprechen mehr Flexibilität und eine bessere Vereinbarkeit von Beruf und Privatleben. Allerdings zeigt sich, dass Freiheit allein nicht automatisch zu höherer Zufriedenheit führt. Entscheidend ist daher nicht nur die technische Ausstattung, sondern auch, inwiefern Führungskräfte verlässliche Kommunikationsstrukturen schaffen und Beschäftigte eigenverantwortlich arbeiten können.",
      ],
      questions: [
        {
          id: "c1-1",
          text: "Welche Aussage gibt die Kernaussage des Textes am treffendsten wieder?",
          options: [
            "Hybride Arbeit kann Vorteile bieten, ihr Erfolg hängt jedoch von zusätzlichen organisatorischen Bedingungen ab.",
            "Hybride Arbeit führt automatisch zu höherer Zufriedenheit.",
            "Technische Ausstattung ist der einzige entscheidende Faktor.",
          ],
          correct: "Hybride Arbeit kann Vorteile bieten, ihr Erfolg hängt jedoch von zusätzlichen organisatorischen Bedingungen ab.",
        },
        {
          id: "c1-2",
          text: "Welche Formulierung drückt eine Einschränkung besonders präzise aus?",
          options: [
            "Die Maßnahme ist insofern sinnvoll, als sie Beschäftigten mehr zeitliche Flexibilität ermöglicht.",
            "Die Maßnahme ist sinnvoll, weil Flexibilität.",
            "Die Maßnahme insofern, sie ist sinnvoll und flexibel.",
          ],
          correct: "Die Maßnahme ist insofern sinnvoll, als sie Beschäftigten mehr zeitliche Flexibilität ermöglicht.",
        },
        {
          id: "c1-3",
          text: "Welche Nominalisierung ist korrekt?",
          options: [
            "die Einführung flexibler Arbeitsmodelle",
            "das Einführen von flexibel Arbeitsmodelle",
            "die eingeführt flexiblen Arbeitsmodelle",
          ],
          correct: "die Einführung flexibler Arbeitsmodelle",
        },
        {
          id: "c1-4",
          text: "Welcher Satz verwendet während adversativ, also als Gegensatz?",
          options: [
            "Während einige Beschäftigte die Flexibilität schätzen, bevorzugen andere feste Bürozeiten.",
            "Während gestern habe ich gearbeitet.",
            "Während zu arbeiten, war das Büro ruhig.",
          ],
          correct: "Während einige Beschäftigte die Flexibilität schätzen, bevorzugen andere feste Bürozeiten.",
        },
        {
          id: "c1-5",
          text: "Welcher Satz enthält ein korrektes Modalpassiv?",
          options: [
            "Die langfristigen Folgen müssen sorgfältig berücksichtigt werden.",
            "Die langfristigen Folgen müssen sorgfältig berücksichtigt geworden.",
            "Die langfristigen Folgen müssen sorgfältig berücksichtigen werden.",
          ],
          correct: "Die langfristigen Folgen müssen sorgfältig berücksichtigt werden.",
        },
      ],
    },
  ],
};

const flattenPlacementQuestions = (sections) => {
  let runningNumber = 1;
  return sections.flatMap((section) =>
    section.questions.map((question) => ({
      ...question,
      number: runningNumber++,
      sectionId: section.id,
      level: section.level,
    }))
  );
};

const buildLevelStats = (sections, answers) =>
  sections.reduce((acc, section) => {
    const correctCount = section.questions.filter((question) => answers[question.id] === question.correct).length;
    const total = section.questions.length;
    return {
      ...acc,
      [section.level]: {
        correct: correctCount,
        total,
        ratio: total ? correctCount / total : 0,
      },
    };
  }, {});

const getPlacementLevel = (levelStats) => {
  const a1 = levelStats.A1?.ratio || 0;
  const a2 = levelStats.A2?.ratio || 0;
  const b1 = levelStats.B1?.ratio || 0;
  const b2 = levelStats.B2?.ratio || 0;
  const c1 = levelStats.C1?.ratio || 0;

  if (a1 < 2 / 3) return "A1";
  if (a2 < 2 / 3) return "A1";
  if (b1 < 2 / 3) return "A2";
  if (b2 < 2 / 3) return "B1";
  if (c1 < 0.8) return "B2";
  return "C1";
};

const getLevelFeedback = (level) => {
  const feedback = {
    A1: "Start with A1. Build greetings, basic sentences, articles, numbers, questions, and daily vocabulary.",
    A2: "A2 is a good fit. You already understand some basics, but you should strengthen everyday conversations, Perfekt, cases, and short messages.",
    B1: "B1 is a good fit. You can handle basic and A2 tasks, so focus on opinions, reasons, longer texts, letters, and speaking structure.",
    B2: "B2 is a good fit. You can handle stronger grammar and abstract texts. Focus on argumentation, advanced vocabulary, and exam-style writing/speaking.",
    C1: "Your answers show C1 readiness. Continue with nuanced argumentation, formal register, complex structures, and sustained writing/speaking practice.",
  };
  return feedback[level] || feedback.A1;
};

const getReadinessLabel = (stat) => {
  const ratio = stat?.ratio || 0;
  if (ratio >= 0.8) return "Strong";
  if (ratio >= 0.6) return "Developing";
  return "Needs work";
};

const getClassBrochureUrl = (level) => `${CLASS_BROCHURE_URL}?level=${encodeURIComponent(level)}`;

const getPlacementProgress = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PLACEMENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    return null;
  }
};

const savePlacementProgress = (progress) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PLACEMENT_STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    // no-op
  }
};

const trackPlacementEvent = (event, payload = {}) => {
  if (typeof window === "undefined") return;
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: "placement_test", action: event, ...payload });
  }
};

const getSectionAnsweredCount = (section, answers) =>
  section.questions.filter((question) => Boolean(answers[question.id])).length;

const isSectionComplete = (section, answers) => getSectionAnsweredCount(section, answers) === section.questions.length;

const isSectionUnlocked = (sections, sectionIndex, answers) =>
  sectionIndex === 0 || sections.slice(0, sectionIndex).every((section) => isSectionComplete(section, answers));

const LevelScoreCard = ({ level, stat }) => {
  const correct = stat?.correct || 0;
  const total = stat?.total || 0;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 10, background: "#ffffff" }}>
      <strong>{level}</strong>
      <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
        {correct}/{total} correct · {percent}% · {getReadinessLabel(stat)}
      </p>
    </div>
  );
};

const ProgressBar = ({ value }) => (
  <div
    aria-hidden="true"
    style={{
      height: 10,
      borderRadius: 999,
      background: "#e5e7eb",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${Math.max(0, Math.min(100, value || 0))}%`,
        height: "100%",
        background: "#2563eb",
        borderRadius: 999,
        transition: "width 180ms ease",
      }}
    />
  </div>
);

const PlacementTestPage = () => {
  const placementQuestions = useMemo(() => flattenPlacementQuestions(placementTest.sections), []);
  const initialProgress = useMemo(() => {
    const saved = getPlacementProgress();
    return {
      answers: saved?.answers || {},
      startedAt: saved?.startedAt || null,
      completedAt: saved?.completedAt || null,
      reviewUnlocked: Boolean(saved?.reviewUnlocked),
      activeSectionIndex: Number.isFinite(Number(saved?.activeSectionIndex)) ? Number(saved.activeSectionIndex) : 0,
    };
  }, []);

  const [placementAnswers, setPlacementAnswers] = useState(initialProgress.answers);
  const [startedAt, setStartedAt] = useState(initialProgress.startedAt);
  const [completedAt, setCompletedAt] = useState(initialProgress.completedAt);
  const [reviewUnlocked, setReviewUnlocked] = useState(initialProgress.reviewUnlocked);
  const [activeSectionIndex, setActiveSectionIndex] = useState(
    Math.min(Math.max(initialProgress.activeSectionIndex, 0), placementTest.sections.length - 1)
  );
  const startTrackedRef = useRef(Boolean(initialProgress.startedAt));
  const completionTrackedRef = useRef(Boolean(initialProgress.completedAt));
  const sectionTrackedRef = useRef(new Set());

  const activeSection = placementTest.sections[activeSectionIndex] || placementTest.sections[0];
  const activeSectionAnsweredCount = getSectionAnsweredCount(activeSection, placementAnswers);
  const activeSectionComplete = isSectionComplete(activeSection, placementAnswers);
  const placementAnsweredCount = Object.keys(placementAnswers).length;
  const placementComplete = placementAnsweredCount === placementQuestions.length && placementQuestions.length > 0;
  const placementProgressPercent = Math.round((placementAnsweredCount / placementQuestions.length) * 100);
  const levelStats = useMemo(() => buildLevelStats(placementTest.sections, placementAnswers), [placementAnswers]);
  const totalCorrect = Object.values(levelStats).reduce((sum, stat) => sum + (stat.correct || 0), 0);
  const totalQuestions = placementQuestions.length;
  const placementLevel = getPlacementLevel(levelStats);
  const canRevealAnswerKey = reviewUnlocked;

  useEffect(() => {
    const pageTitle = placementTest.title;
    const pageDescription = placementTest.subtitle;

    updatePageMeta({
      title: pageTitle,
      description: pageDescription,
      lang: "en",
      canonicalPath: "/placement-test",
      ogType: "article",
      structuredData: [
        {
          id: "article",
          schema: {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: pageTitle,
            description: pageDescription,
            author: { "@type": "Organization", name: "Falowen" },
            publisher: {
              "@type": "Organization",
              name: "Falowen",
              logo: { "@type": "ImageObject", url: "https://www.falowen.app/logo512.png" },
            },
            mainEntityOfPage: "https://www.falowen.app/placement-test",
            dateModified: new Date().toISOString(),
          },
        },
      ],
    });
  }, []);

  useEffect(() => {
    savePlacementProgress({ answers: placementAnswers, startedAt, completedAt, reviewUnlocked, activeSectionIndex });
  }, [placementAnswers, startedAt, completedAt, reviewUnlocked, activeSectionIndex]);

  useEffect(() => {
    if (placementAnsweredCount > 0 && !startTrackedRef.current) {
      const now = Date.now();
      setStartedAt(now);
      startTrackedRef.current = true;
      trackPlacementEvent("start", { questionCount: placementQuestions.length });
    }
  }, [placementAnsweredCount, placementQuestions.length]);

  useEffect(() => {
    placementTest.sections.forEach((section) => {
      if (!isSectionComplete(section, placementAnswers) || sectionTrackedRef.current.has(section.id)) return;
      sectionTrackedRef.current.add(section.id);
      const stat = levelStats[section.level] || {};
      trackPlacementEvent("section_complete", {
        level: section.level,
        correct: stat.correct || 0,
        total: stat.total || section.questions.length,
      });
    });
  }, [levelStats, placementAnswers]);

  useEffect(() => {
    if (placementComplete && !completionTrackedRef.current) {
      const completionTime = Date.now();
      completionTrackedRef.current = true;
      setCompletedAt(completionTime);
      trackPlacementEvent("complete", {
        correct: totalCorrect,
        total: totalQuestions,
        level: placementLevel,
      });
      trackPlacementEvent("level_assigned", { level: placementLevel });
    }
  }, [placementComplete, placementLevel, totalCorrect, totalQuestions]);

  const handlePlacementAnswer = (questionId, option) => {
    setPlacementAnswers((prev) => ({ ...prev, [questionId]: option }));
    trackPlacementEvent("answer", { questionId, selectedOption: option });
  };

  const handleUnlockAnswerReview = () => {
    setReviewUnlocked(true);
    trackPlacementEvent("review_unlock", {});
  };

  const handleReset = () => {
    setPlacementAnswers({});
    setStartedAt(null);
    setCompletedAt(null);
    setReviewUnlocked(false);
    setActiveSectionIndex(0);
    startTrackedRef.current = false;
    completionTrackedRef.current = false;
    sectionTrackedRef.current.clear();
    savePlacementProgress({ answers: {}, startedAt: null, completedAt: null, reviewUnlocked: false, activeSectionIndex: 0 });
  };

  const goToNextSection = () => {
    if (!activeSectionComplete) return;
    setActiveSectionIndex((current) => Math.min(current + 1, placementTest.sections.length - 1));
  };

  const renderPlacementOptionButton = (question, option, optionIndex) => {
    const selected = placementAnswers[question.id] === option;
    const isCorrect = canRevealAnswerKey && option === question.correct;
    const isIncorrect = canRevealAnswerKey && selected && option !== question.correct;
    const optionLetter = String.fromCharCode(65 + optionIndex);

    return (
      <button
        key={option}
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={() => handlePlacementAnswer(question.id, option)}
        style={{
          ...styles.buttonSecondary,
          ...(selected ? styles.buttonSecondaryActive : {}),
          ...(isCorrect
            ? {
                borderColor: "#16a34a",
                background: "#ecfdf3",
                color: "#14532d",
              }
            : {}),
          ...(isIncorrect
            ? {
                borderColor: "#dc2626",
                background: "#fef2f2",
                color: "#991b1b",
              }
            : {}),
          textAlign: "left",
          outlineOffset: 2,
          padding: "12px 14px",
          borderRadius: 12,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <strong>{optionLetter}.</strong>
        <span>{option}</span>
      </button>
    );
  };

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Free placement test</p>
          <h1 style={{ ...styles.sectionTitle, margin: 0 }}>{placementTest.title}</h1>
          <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.6 }}>{placementTest.subtitle}</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
            Back home
          </a>
          <a href={CLASS_BROCHURE_URL} style={{ ...styles.secondaryButton, textDecoration: "none" }}>
            View classes
          </a>
          {placementAnsweredCount ? (
            <button type="button" style={styles.secondaryButton} onClick={handleReset}>
              Start again
            </button>
          ) : null}
        </div>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 12, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>Step-by-step level check</h2>
            <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
              One level appears at a time. The test has {placementQuestions.length} questions and usually takes about 8–10 minutes.
            </p>
            <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
              No login is required. Your result appears immediately and is a placement recommendation, not an official CEFR certificate.
            </p>
          </div>
          <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>
            {placementAnsweredCount}/{placementQuestions.length} answered
          </span>
        </div>
        <ProgressBar value={placementProgressPercent} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {placementTest.sections.map((section, index) => {
            const unlocked = isSectionUnlocked(placementTest.sections, index, placementAnswers);
            const complete = isSectionComplete(section, placementAnswers);
            const active = activeSectionIndex === index;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => unlocked && setActiveSectionIndex(index)}
                disabled={!unlocked}
                style={{
                  ...(active ? styles.primaryButton : styles.secondaryButton),
                  opacity: unlocked ? 1 : 0.55,
                  padding: "8px 12px",
                }}
              >
                {complete ? "✅ " : ""}{index + 1}. {section.level}
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>
              Step {activeSectionIndex + 1} of {placementTest.sections.length} · {activeSection.level}
            </span>
            <h3 style={{ margin: "8px 0 4px", fontSize: 22 }}>
              {activeSectionIndex + 1}. {activeSection.title}
            </h3>
            <p style={{ ...styles.helperText, margin: 0 }}>{activeSection.description}</p>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Answered in this section: {activeSectionAnsweredCount}/{activeSection.questions.length}
            </p>
          </div>

          {Array.isArray(activeSection.passage) && activeSection.passage.length ? (
            <div style={{ ...styles.card, margin: 0, background: "#f8fafc", display: "grid", gap: 6 }}>
              <strong>Short reading text</strong>
              {activeSection.passage.map((paragraph) => (
                <p key={paragraph} style={{ margin: 0, color: "#374151", lineHeight: 1.6 }}>
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          <div style={{ display: "grid", gap: 14 }}>
            {activeSection.questions.map((question, questionIndex) => (
              <div
                key={question.id}
                style={{
                  display: "grid",
                  gap: 8,
                  padding: 12,
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  background: "#ffffff",
                }}
              >
                <p style={{ ...styles.helperText, margin: 0, fontWeight: 800 }}>
                  Question {questionIndex + 1} of {activeSection.questions.length} · Overall no. {question.number}
                </p>
                <p style={{ margin: 0, fontWeight: 800 }}>
                  {questionIndex + 1}. {question.text}
                </p>
                <div role="radiogroup" aria-label={`Question ${question.number}`} style={{ display: "grid", gap: 8 }}>
                  {question.options.map((option, optionIndex) => renderPlacementOptionButton(question, option, optionIndex))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => setActiveSectionIndex((current) => Math.max(current - 1, 0))}
            disabled={activeSectionIndex === 0}
          >
            ← Previous level
          </button>

          {activeSectionIndex < placementTest.sections.length - 1 ? (
            <button type="button" style={styles.primaryButton} onClick={goToNextSection} disabled={!activeSectionComplete}>
              Continue to {activeSectionIndex + 2}. {placementTest.sections[activeSectionIndex + 1]?.level} →
            </button>
          ) : (
            <span style={{ ...styles.badge, background: placementComplete ? "#dcfce7" : "#fef3c7" }}>
              {placementComplete ? "Ready to view result" : "Finish B2 questions to view result"}
            </span>
          )}
        </div>

        {!activeSectionComplete ? (
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            Finish this short numbered section before moving to the next level.
          </div>
        ) : null}
      </section>

      {placementComplete ? (
        <section style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
          <div style={{ ...styles.focusNotice, margin: 0 }}>
            Suggested level: <strong>{placementLevel}</strong> · Score: {totalCorrect}/{totalQuestions}
          </div>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
            {placementTest.sections.map((section) => (
              <LevelScoreCard key={`score-${section.level}`} level={section.level} stat={levelStats[section.level]} />
            ))}
          </div>
          <div style={{ color: "#374151", fontSize: 14 }}>{getLevelFeedback(placementLevel)}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={getClassBrochureUrl(placementLevel)} style={{ ...styles.buttonPrimary, textDecoration: "none", display: "inline-block" }}>
              View {placementLevel} classes
            </a>
            <a href="https://wa.me/233205706589" target="_blank" rel="noopener noreferrer" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
              Ask on WhatsApp
            </a>
          </div>
          {canRevealAnswerKey ? (
            <details style={{ ...styles.card, margin: 0, background: "#ffffff" }}>
              <summary style={{ cursor: "pointer", fontWeight: 800 }}>Answer key</summary>
              <ol style={{ margin: "10px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                {placementQuestions.map((question) => (
                  <li key={`key-${question.id}`}>
                    <strong>{question.number}.</strong> {question.correct}
                  </li>
                ))}
              </ol>
            </details>
          ) : (
            <div style={{ ...styles.card, margin: 0, background: "#ffffff", display: "grid", gap: 10 }}>
              <div style={{ color: "#4b5563", fontSize: 14 }}>
                Open the answer key when you are ready to review your responses.
              </div>
              <button type="button" style={styles.buttonSecondary} onClick={handleUnlockAnswerReview}>
                Review answers
              </button>
            </div>
          )}
        </section>
      ) : null}
    </main>
  );
};

export { placementTest, buildLevelStats, getPlacementLevel, getReadinessLabel };
export default PlacementTestPage;
