import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";

const PLACEMENT_STORAGE_KEY = "falowen.placementTest.progress.v2";
const ANSWER_REVIEW_DELAY_MS = 30 * 60 * 1000;
const CLASS_BROCHURE_URL = "/classes/";

const placementTest = {
  title: "Free German placement test",
  subtitle:
    "Not sure about your level yet? Start from A1 basics and continue through A2, B1, and B2 tasks. When you finish, Falowen will suggest the best class level for you.",
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
      ],
    },
    {
      id: "a2-everyday",
      level: "A2",
      title: "A2: everyday situations and Perfekt",
      description: "These questions check if you can understand simple everyday situations and past events.",
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
          text: "Choose the correct Perfekt sentence.",
          options: ["Ich habe gestern gelernt.", "Ich bin gestern gelernt.", "Ich habe gestern lernen."],
          correct: "Ich habe gestern gelernt.",
        },
        {
          id: "a2-3",
          text: "Which sentence is polite?",
          options: ["Gib mir Wasser!", "Könnten Sie mir bitte Wasser geben?", "Du Wasser geben."],
          correct: "Könnten Sie mir bitte Wasser geben?",
        },
        {
          id: "a2-4",
          text: "Complete: Ich gehe zum Arzt, ___ ich krank bin.",
          options: ["weil", "aber", "oder"],
          correct: "weil",
        },
      ],
    },
    {
      id: "b1-reading-opinion",
      level: "B1",
      title: "B1: reading opinions and sentence connection",
      description: "These questions check if you can understand opinions and connect ideas clearly.",
      passage: [
        "Viele Jugendliche benutzen ihr Handy auch in der Schule. Einige Lehrer finden das problematisch, weil die Schüler sich nicht konzentrieren. Andere sagen, dass Handys beim Lernen helfen können, wenn man sie richtig benutzt.",
      ],
      questions: [
        {
          id: "b1-1",
          text: "Why do some teachers think phones are problematic?",
          options: ["Because students may not concentrate.", "Because phones are too expensive.", "Because schools have no internet."],
          correct: "Because students may not concentrate.",
        },
        {
          id: "b1-2",
          text: "Which sentence is correct?",
          options: [
            "Ich denke, dass Deutsch wichtig ist.",
            "Ich denke, dass Deutsch ist wichtig.",
            "Ich denke, Deutsch dass wichtig ist.",
          ],
          correct: "Ich denke, dass Deutsch wichtig ist.",
        },
        {
          id: "b1-3",
          text: "Choose the best connector: Ich möchte in Deutschland arbeiten, ___ lerne ich jeden Tag Deutsch.",
          options: ["deshalb", "trotzdem", "obwohl"],
          correct: "deshalb",
        },
        {
          id: "b1-4",
          text: "Which sentence gives an opinion with a reason?",
          options: [
            "Ich finde Online-Unterricht praktisch, weil man von zu Hause lernen kann.",
            "Online-Unterricht und zu Hause.",
            "Ich finde Online-Unterricht, aber lernen.",
          ],
          correct: "Ich finde Online-Unterricht praktisch, weil man von zu Hause lernen kann.",
        },
      ],
    },
    {
      id: "b2-advanced",
      level: "B2",
      title: "B2: argumentation and advanced vocabulary",
      description: "These questions check if you can follow more abstract ideas and choose precise language.",
      passage: [
        "Digitale Lernangebote eröffnen vielen Menschen neue Chancen, weil sie unabhängig von Ort und Zeit genutzt werden können. Trotzdem ersetzen sie nicht immer den persönlichen Kontakt, der besonders beim Sprachenlernen wichtig bleibt.",
      ],
      questions: [
        {
          id: "b2-1",
          text: "What is the main idea of the text?",
          options: [
            "Digital learning creates flexibility but does not always replace personal contact.",
            "Digital learning is always better than classroom learning.",
            "Language learning is impossible online.",
          ],
          correct: "Digital learning creates flexibility but does not always replace personal contact.",
        },
        {
          id: "b2-2",
          text: "Choose the best word: Online-Lernen ___ vielen Menschen neue Möglichkeiten.",
          options: ["eröffnet", "beginnt", "befindet", "verpasst"],
          correct: "eröffnet",
        },
        {
          id: "b2-3",
          text: "Which sentence is more B2-like?",
          options: [
            "Einerseits ist Online-Lernen flexibel, andererseits fehlt manchmal der direkte Austausch.",
            "Online gut, Schule auch gut.",
            "Ich mag Online, weil ja."],
          correct: "Einerseits ist Online-Lernen flexibel, andererseits fehlt manchmal der direkte Austausch.",
        },
        {
          id: "b2-4",
          text: "Choose the correct meaning of trotzdem in this context.",
          options: ["nevertheless", "because", "before"],
          correct: "nevertheless",
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

  if (a1 < 0.6) return "A1";
  if (a2 < 0.55) return "A1";
  if (b1 < 0.55) return "A2";
  if (b2 < 0.55) return "B1";
  return "B2";
};

const getLevelFeedback = (level) => {
  const feedback = {
    A1: "Start with A1. Build greetings, basic sentences, articles, numbers, questions, and daily vocabulary.",
    A2: "A2 is a good fit. You already understand some basics, but you should strengthen everyday conversations, Perfekt, cases, and short messages.",
    B1: "B1 is a good fit. You can handle basic and A2 tasks, so focus on opinions, reasons, longer texts, letters, and speaking structure.",
    B2: "B2 is a good fit. You can handle stronger grammar and abstract texts. Focus on argumentation, advanced vocabulary, and exam-style writing/speaking.",
  };
  return feedback[level] || feedback.A1;
};

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

const LevelScoreCard = ({ level, stat }) => {
  const correct = stat?.correct || 0;
  const total = stat?.total || 0;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 10, background: "#ffffff" }}>
      <strong>{level}</strong>
      <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
        {correct}/{total} correct · {percent}%
      </p>
    </div>
  );
};

const PlacementTestPage = () => {
  const { t, i18n } = useTranslation();
  const placementQuestions = useMemo(() => flattenPlacementQuestions(placementTest.sections), []);
  const initialProgress = useMemo(() => {
    const saved = getPlacementProgress();
    return {
      answers: saved?.answers || {},
      startedAt: saved?.startedAt || null,
      completedAt: saved?.completedAt || null,
      reviewUnlocked: Boolean(saved?.reviewUnlocked),
    };
  }, []);

  const [placementAnswers, setPlacementAnswers] = useState(initialProgress.answers);
  const [startedAt, setStartedAt] = useState(initialProgress.startedAt);
  const [completedAt, setCompletedAt] = useState(initialProgress.completedAt);
  const [reviewUnlocked, setReviewUnlocked] = useState(initialProgress.reviewUnlocked);
  const startTrackedRef = useRef(Boolean(initialProgress.startedAt));
  const completionTrackedRef = useRef(Boolean(initialProgress.completedAt));

  const placementAnsweredCount = Object.keys(placementAnswers).length;
  const placementComplete = placementAnsweredCount === placementQuestions.length && placementQuestions.length > 0;
  const levelStats = useMemo(() => buildLevelStats(placementTest.sections, placementAnswers), [placementAnswers]);
  const totalCorrect = Object.values(levelStats).reduce((sum, stat) => sum + (stat.correct || 0), 0);
  const totalQuestions = placementQuestions.length;
  const placementLevel = getPlacementLevel(levelStats);
  const canRevealAnswerKey = reviewUnlocked || (completedAt && Date.now() - completedAt >= ANSWER_REVIEW_DELAY_MS);

  useEffect(() => {
    const pageTitle = t("placementPage.meta.title", { defaultValue: placementTest.title });
    const pageDescription = t("placementPage.meta.description", { defaultValue: placementTest.subtitle });

    updatePageMeta({
      title: pageTitle,
      description: pageDescription,
      lang: i18n.language,
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
  }, [i18n.language, t]);

  useEffect(() => {
    savePlacementProgress({ answers: placementAnswers, startedAt, completedAt, reviewUnlocked });
  }, [placementAnswers, startedAt, completedAt, reviewUnlocked]);

  useEffect(() => {
    if (placementAnsweredCount > 0 && !startTrackedRef.current) {
      const now = Date.now();
      setStartedAt(now);
      startTrackedRef.current = true;
      trackPlacementEvent("start", { questionCount: placementQuestions.length });
    }
  }, [placementAnsweredCount, placementQuestions.length]);

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
    startTrackedRef.current = false;
    completionTrackedRef.current = false;
    savePlacementProgress({ answers: {}, startedAt: null, completedAt: null, reviewUnlocked: false });
  };

  const renderPlacementOptionButton = (question, option) => {
    const selected = placementAnswers[question.id] === option;
    const isCorrect = canRevealAnswerKey && option === question.correct;
    const isIncorrect = canRevealAnswerKey && selected && option !== question.correct;

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
        }}
      >
        {option}
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

      <section style={{ ...styles.card, display: "grid", gap: 10, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>How this test works</h2>
        <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 1.6 }}>
          <li>Start with simple A1 questions.</li>
          <li>Continue to A2, B1, and B2 questions.</li>
          <li>Your suggested level is based on how far you perform strongly.</li>
          <li>No student data is collected here. After the result, choose a class and submit your details on the classes page.</li>
        </ul>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 16 }}>
        {placementTest.sections.map((section) => (
          <div key={section.id} style={{ display: "grid", gap: 12 }}>
            <div>
              <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>{section.level}</span>
              <h3 style={{ margin: "8px 0 4px", fontSize: 18 }}>{section.title}</h3>
              <p style={{ ...styles.helperText, margin: 0 }}>{section.description}</p>
            </div>
            {Array.isArray(section.passage) && section.passage.length ? (
              <div style={{ ...styles.card, margin: 0, background: "#f8fafc", display: "grid", gap: 6 }}>
                {section.passage.map((paragraph) => (
                  <p key={paragraph} style={{ margin: 0, color: "#374151", lineHeight: 1.6 }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
            <div style={{ display: "grid", gap: 12 }}>
              {section.questions.map((question) => (
                <div key={question.id} style={{ display: "grid", gap: 8 }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>
                    {question.number}. {question.text}
                  </p>
                  <div role="radiogroup" aria-label={`Question ${question.number}`} style={{ display: "grid", gap: 8 }}>
                    {question.options.map((option) => renderPlacementOptionButton(question, option))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 14, color: "#4b5563" }}>
            Answered: {placementAnsweredCount}/{placementQuestions.length}
          </div>
          {placementComplete ? (
            <div style={{ display: "grid", gap: 12 }}>
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
                <a href={CLASS_BROCHURE_URL} style={{ ...styles.buttonPrimary, textDecoration: "none", display: "inline-block" }}>
                  Choose a {placementLevel} class
                </a>
                <a href="https://wa.me/233205706589" target="_blank" rel="noopener noreferrer" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
                  Ask on WhatsApp
                </a>
              </div>
              {canRevealAnswerKey ? (
                <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
                  <h4 style={{ marginTop: 0 }}>Answer key</h4>
                  <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                    {placementQuestions.map((question) => (
                      <li key={`key-${question.id}`}>
                        <strong>{question.number}.</strong> {question.correct}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <div style={{ ...styles.card, margin: 0, background: "#f8fafc", display: "grid", gap: 10 }}>
                  <div style={{ color: "#4b5563", fontSize: 14 }}>
                    Review the questions first. You can unlock the answer key after you finish.
                  </div>
                  <button type="button" style={styles.buttonSecondary} onClick={handleUnlockAnswerReview}>
                    Show answer key
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: "#6b7280", fontSize: 14 }}>Finish all questions to see your suggested level.</div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PlacementTestPage;
