import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";
import { leadLevelOptions, leadModeOptions, leadStartOptions } from "../lib/leadCapture";
import { captureLead } from "../services/leadCaptureService";

const PLACEMENT_STORAGE_KEY = "falowen.placementTest.progress.v1";
const ANSWER_REVIEW_DELAY_MS = 30 * 60 * 1000;

const placementTest = {
  title: "Placement check (paraphrased exam-style tasks)",
  subtitle:
    "Not sure about your level yet? Answer the questions below. Once you finish, you will see the answer key and a suggested level.",
  sections: [
    {
      id: "ticket",
      title: "Kurztext: 29-Euro-Ticket",
      weight: 1,
      passage: [
        "Mit dem neuen 29-Euro-Ticket können Fahrgäste mit Bussen, Straßenbahnen und Regionalzügen in ganz Deutschland fahren.",
        "Das Ticket gilt von Anfang Oktober bis Ende Dezember. Es ist für beliebig viele Fahrten im Nahverkehr gültig.",
      ],
      questions: [
        {
          id: "pt1",
          number: 1,
          text: "Wo dürfen Sie mit dem Ticket unterwegs sein?",
          options: ["In Deutschland und im Ausland.", "Nur in Deutschland.", "Nur in der näheren Umgebung."],
          correct: "Nur in Deutschland.",
        },
        {
          id: "pt2",
          number: 2,
          text: "Bis wann gilt das Ticket?",
          options: ["Bis Mitte November.", "Bis Mitte Dezember.", "Bis Ende Dezember."],
          correct: "Bis Ende Dezember.",
        },
        {
          id: "pt3",
          number: 3,
          text: "Die 29 Euro zahlt man für …",
          options: [
            "eine einfache Hin- und Rückfahrt.",
            "eine Fahrt in der zweiten Klasse.",
            "beliebig viele Fahrten an einem Tag.",
          ],
          correct: "beliebig viele Fahrten an einem Tag.",
        },
      ],
    },
    {
      id: "store",
      title: "Kaufhaus-Übersicht",
      weight: 1,
      passage: [
        "3. Stock: Smartphones, TV, Computer, Drucker, Spiele, Sport- und Arbeitskleidung.",
        "2. Stock: Herrenmode, Wäsche, Möbel für Wohnzimmer/Bad/Küche, Teppiche, Lampen, Deko.",
        "1. Stock: Damen- und Kindermode, Schuhe, Haushaltswaren, Töpfe und Pfannen.",
        "EG: Information, Uhren, Schmuck, Parfüm, Kosmetik, Schreibwaren, Karten, Souvenirs.",
        "UG: Bäckerei, Supermarkt, Reinigungsmittel, Fotoservice, Zeitungen, Reisebüro, Geldautomat.",
      ],
      questions: [
        {
          id: "pt7",
          number: 7,
          text: "Sie möchten Urlaubsfotos ausdrucken lassen. Wohin gehen Sie?",
          options: ["3. Stock", "UG", "anderer Stock"],
          correct: "UG",
        },
        {
          id: "pt8",
          number: 8,
          text: "Sie suchen eine Hose zum Joggen. Wohin gehen Sie?",
          options: ["3. Stock", "2. Stock", "anderer Stock"],
          correct: "3. Stock",
        },
      ],
    },
    {
      id: "ads",
      title: "Welche Anzeige passt?",
      weight: 1.2,
      passage: [
        "A: Schweizer Autoren – leicht gelesen. Vereinfachte Literaturtexte für Deutschlernende.",
        "B: Deutsch-Training online. Zehn kostenlose Lektionen, Grammatik-Erklärungen, alle Übungen im Internet.",
        "C: Deutsch erLesen. Monatsmagazin mit aktuellen Artikeln aus der deutschen Presse für Leser im In- und Ausland.",
        "D: Verlag sucht Lektorin/Lektor für neue Romane und Gedichtbände.",
      ],
      questions: [
        {
          id: "pt11",
          number: 11,
          text: "Mirjeta hat keine Zeit für einen Kurs, möchte sich aber regelmäßig über Neuigkeiten aus Deutschland informieren.",
          options: ["A", "B", "C", "D"],
          correct: "C",
        },
      ],
    },
    {
      id: "phones",
      title: "Meinungen zu Handyverboten in der Schule",
      weight: 1.2,
      passage: [
        "Corinne (37): Handys sind oft nur zum Angeben. In der Schule sollten Kinder sich auf den Unterricht konzentrieren.",
        "Rüdiger (47): Ich musste lange auf meine Tochter warten, weil sie ihr Handy nicht einschalten durfte. Das geht so nicht.",
        "Max (15): Wir gehen zur Schule, um zu lernen. Aber wenn man Handys verbietet, lernt man keinen vernünftigen Umgang.",
      ],
      questions: [
        {
          id: "pt12",
          number: 12,
          text: "Corinne ist für ein Handyverbot.",
          options: ["Ja", "Nein"],
          correct: "Ja",
        },
        {
          id: "pt13",
          number: 13,
          text: "Rüdiger ist für ein Handyverbot.",
          options: ["Ja", "Nein"],
          correct: "Nein",
        },
        {
          id: "pt14",
          number: 14,
          text: "Max ist für ein Handyverbot.",
          options: ["Ja", "Nein"],
          correct: "Nein",
        },
      ],
    },
    {
      id: "murten",
      title: "Zeitreise per Velo",
      weight: 1.4,
      passage: [
        "Mit der Radtour „Zeitreise per Velo“ entdecken Besucherinnen und Besucher Murten aktiv.",
        "Treffpunkt ist der Bahnhof. Wer möchte, bringt das eigene Fahrrad mit oder leiht eines dort aus.",
        "Für alle, die es entspannter mögen, gibt es auch E-Bikes zum Mieten.",
      ],
      questions: [
        {
          id: "pt15",
          number: 15,
          text: "Für die Rundfahrt …",
          options: ["braucht man ein eigenes Velo.", "muss man nicht sportlich sein.", "sollte man mit der Bahn anreisen."],
          correct: "muss man nicht sportlich sein.",
        },
      ],
    },
    {
      id: "digital",
      title: "Digitales Lernen",
      weight: 1.8,
      passage: [
        "DIGITALES LERNEN – UNABHÄNGIG VON ZEIT UND ORT",
        "Alles online: Internetfähige Geräte werden beim E-Learning eingesetzt. In der Praxis (21) das,",
        "dass Teilnehmende von zu Hause oder unterwegs lernen können.",
        "Online-Lernen (22) immer mehr Möglichkeiten und Freiheiten.",
        "Grundkenntnisse sind (23), doch auch Einsteiger werden zu Kursbeginn von Tutor*innen begleitet.",
      ],
      questions: [
        {
          id: "pt21",
          number: 21,
          text: "In der Praxis (21) das,",
          options: ["verheißt", "bedeutet", "befindet", "vermittelt"],
          correct: "bedeutet",
        },
        {
          id: "pt22",
          number: 22,
          text: "Online-Lernen (22) immer mehr Möglichkeiten und Freiheiten.",
          options: ["macht auf", "öffnet", "eröffnet", "beginnt"],
          correct: "eröffnet",
        },
        {
          id: "pt23",
          number: 23,
          text: "Grundkenntnisse sind (23),",
          options: ["im Vorteil", "von Vorteil", "eine Bedeutung", "von Sinnen"],
          correct: "von Vorteil",
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
      weight: section.weight || 1,
    }))
  );
};

const getPlacementLevel = (weightedRatio) => {
  if (weightedRatio >= 0.9) return "C1";
  if (weightedRatio >= 0.76) return "B2";
  if (weightedRatio >= 0.6) return "B1";
  if (weightedRatio >= 0.42) return "A2";
  return "A1";
};

const getPlacementRecommendationRoute = (level) => {
  if (["B2", "C1"].includes(level)) return "/exams/overview";
  if (level === "B1") return "/campus/course";
  return "/signup";
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
      contact: {
        name: saved?.contact?.name || "",
        phone: saved?.contact?.phone || "",
        email: saved?.contact?.email || "",
        levelInterest: saved?.contact?.levelInterest || "",
        preferredMode: saved?.contact?.preferredMode || "",
        startTimeline: saved?.contact?.startTimeline || "",
        submittedAt: saved?.contact?.submittedAt || null,
      },
    };
  }, []);
  const [placementAnswers, setPlacementAnswers] = useState(initialProgress.answers);
  const [startedAt, setStartedAt] = useState(initialProgress.startedAt);
  const [completedAt, setCompletedAt] = useState(initialProgress.completedAt);
  const [reviewUnlocked, setReviewUnlocked] = useState(initialProgress.reviewUnlocked);
  const [contactName, setContactName] = useState(initialProgress.contact.name);
  const [contactPhone, setContactPhone] = useState(initialProgress.contact.phone);
  const [contactEmail, setContactEmail] = useState(initialProgress.contact.email);
  const [contactLevelInterest, setContactLevelInterest] = useState(initialProgress.contact.levelInterest);
  const [contactPreferredMode, setContactPreferredMode] = useState(initialProgress.contact.preferredMode);
  const [contactStartTimeline, setContactStartTimeline] = useState(initialProgress.contact.startTimeline);
  const [contactSubmittedAt, setContactSubmittedAt] = useState(initialProgress.contact.submittedAt);
  const startTrackedRef = useRef(Boolean(initialProgress.startedAt));
  const completionTrackedRef = useRef(Boolean(initialProgress.completedAt));
  const contactTrackedRef = useRef(Boolean(initialProgress.contact.submittedAt));

  const placementAnsweredCount = Object.keys(placementAnswers).length;
  const placementComplete =
    placementAnsweredCount === placementQuestions.length && placementQuestions.length > 0;
  const weightedTotal = placementQuestions.reduce((sum, question) => sum + question.weight, 0);
  const weightedScore = placementQuestions.reduce(
    (sum, question) =>
      placementAnswers[question.id] === question.correct ? sum + question.weight : sum,
    0
  );
  const weightedRatio = weightedTotal > 0 ? weightedScore / weightedTotal : 0;
  const placementLevel = getPlacementLevel(weightedRatio);
  const canRevealAnswerKey = reviewUnlocked || (completedAt && Date.now() - completedAt >= ANSWER_REVIEW_DELAY_MS);
  const placementRecommendationRoute = getPlacementRecommendationRoute(placementLevel);

  useEffect(() => {
    updatePageMeta({
      title: t("placementPage.meta.title", { defaultValue: placementTest.title }),
      description: t("placementPage.meta.description", { defaultValue: placementTest.subtitle }),
      lang: i18n.language,
    });
  }, [i18n.language, t]);

  useEffect(() => {
    savePlacementProgress({
      answers: placementAnswers,
      startedAt,
      completedAt,
      reviewUnlocked,
      contact: {
        name: contactName,
        phone: contactPhone,
        email: contactEmail,
        levelInterest: contactLevelInterest,
        preferredMode: contactPreferredMode,
        startTimeline: contactStartTimeline,
        submittedAt: contactSubmittedAt,
      },
    });
  }, [
    placementAnswers,
    startedAt,
    completedAt,
    reviewUnlocked,
    contactName,
    contactPhone,
    contactEmail,
    contactLevelInterest,
    contactPreferredMode,
    contactStartTimeline,
    contactSubmittedAt,
  ]);

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
        score: Number(weightedScore.toFixed(2)),
        totalWeight: Number(weightedTotal.toFixed(2)),
        ratio: Number(weightedRatio.toFixed(4)),
      });
      trackPlacementEvent("level_assigned", { level: placementLevel });
    }
  }, [placementComplete, placementLevel, weightedRatio, weightedScore, weightedTotal]);

  const handlePlacementAnswer = (questionId, option) => {
    setPlacementAnswers((prev) => ({ ...prev, [questionId]: option }));
    trackPlacementEvent("answer", { questionId, selectedOption: option });
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    const trimmedName = contactName.trim();
    const trimmedPhone = contactPhone.trim();
    const trimmedEmail = contactEmail.trim();

    if (
      !trimmedName ||
      !trimmedPhone ||
      !trimmedEmail ||
      !contactLevelInterest ||
      !contactPreferredMode ||
      !contactStartTimeline
    ) {
      return;
    }

    const submittedAt = Date.now();
    setContactName(trimmedName);
    setContactPhone(trimmedPhone);
    setContactEmail(trimmedEmail);
    setContactSubmittedAt(submittedAt);
    if (!contactTrackedRef.current) {
      contactTrackedRef.current = true;
    }
    captureLead({
      name: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail,
      levelInterest: contactLevelInterest,
      preferredMode: contactPreferredMode,
      startTimeline: contactStartTimeline,
      source: "placement_test",
      cta: "Placement test form",
    });
    trackPlacementEvent("lead_capture", {
      name: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail,
      levelInterest: contactLevelInterest,
      preferredMode: contactPreferredMode,
      startTimeline: contactStartTimeline,
      submittedAt,
    });
  };

  const handleUnlockAnswerReview = () => {
    setReviewUnlocked(true);
    trackPlacementEvent("review_unlock", {});
  };

  const getLevelFeedback = (level) => t(`placementPage.feedback.${level}`, { defaultValue: "" });

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
          <p style={{ ...styles.helperText, margin: 0 }}>{t("placementPage.badge")}</p>
          <h1 style={{ ...styles.sectionTitle, margin: 0 }}>{t("placementPage.title", { defaultValue: placementTest.title })}</h1>
          <p style={{ ...styles.helperText, margin: 0 }}>{t("placementPage.subtitle", { defaultValue: placementTest.subtitle })}</p>
        </div>
        <div>
          <a href="/" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
            {t("placementPage.backHome")}
          </a>
        </div>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ ...styles.card, margin: 0, background: "#f8fafc", display: "grid", gap: 12 }}>
            <div>
              <h3 style={{ margin: 0 }}>{t("placementPage.leadHeading", { defaultValue: "Tell us about you" })}</h3>
              <p style={{ margin: "6px 0 0", color: "#4b5563", fontSize: 14 }}>
                {t("placementPage.leadSubtitle", { defaultValue: "Share your details so we can follow up with the right next step." })}
              </p>
            </div>
            <form onSubmit={handleContactSubmit} style={{ display: "grid", gap: 10 }}>
              <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
                <span>{t("placementPage.leadNameLabel", { defaultValue: "Full name" })}</span>
                <input
                  type="text"
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  placeholder={t("placementPage.leadNamePlaceholder", { defaultValue: "e.g. Alex Schmidt" })}
                  autoComplete="name"
                  required
                  style={{ ...styles.input, borderColor: "#d1d5db" }}
                />
              </label>
              <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
                <span>{t("placementPage.leadPhoneLabel", { defaultValue: "Phone number" })}</span>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(event) => setContactPhone(event.target.value)}
                  placeholder={t("placementPage.leadPhonePlaceholder", { defaultValue: "+233 20 123 4567" })}
                  autoComplete="tel"
                  required
                  style={{ ...styles.input, borderColor: "#d1d5db" }}
                />
              </label>
              <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
                <span>{t("placementPage.leadEmailLabel", { defaultValue: "Email address" })}</span>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                  placeholder={t("placementPage.leadEmailPlaceholder", { defaultValue: "you@example.com" })}
                  autoComplete="email"
                  required
                  style={{ ...styles.input, borderColor: "#d1d5db" }}
                />
              </label>
              <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
                <span>{t("placementPage.leadLevelLabel", { defaultValue: "Level of interest" })}</span>
                <select
                  value={contactLevelInterest}
                  onChange={(event) => setContactLevelInterest(event.target.value)}
                  required
                  style={{ ...styles.input, borderColor: "#d1d5db" }}
                >
                  <option value="">{t("placementPage.leadLevelPlaceholder", { defaultValue: "Select a level" })}</option>
                  {leadLevelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
                <span>{t("placementPage.leadModeLabel", { defaultValue: "Preferred mode" })}</span>
                <select
                  value={contactPreferredMode}
                  onChange={(event) => setContactPreferredMode(event.target.value)}
                  required
                  style={{ ...styles.input, borderColor: "#d1d5db" }}
                >
                  <option value="">{t("placementPage.leadModePlaceholder", { defaultValue: "Select a mode" })}</option>
                  {leadModeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
                <span>{t("placementPage.leadStartLabel", { defaultValue: "Preferred start" })}</span>
                <select
                  value={contactStartTimeline}
                  onChange={(event) => setContactStartTimeline(event.target.value)}
                  required
                  style={{ ...styles.input, borderColor: "#d1d5db" }}
                >
                  <option value="">
                    {t("placementPage.leadStartPlaceholder", { defaultValue: "Select a timeframe" })}
                  </option>
                  {leadStartOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <button type="submit" style={styles.buttonPrimary}>
                  {t("placementPage.leadSubmit", { defaultValue: "Save info" })}
                </button>
                {contactSubmittedAt ? (
                  <span style={{ fontSize: 13, color: "#16a34a" }}>
                    {t("placementPage.leadSaved", { defaultValue: "Saved — thanks!" })}
                  </span>
                ) : null}
              </div>
            </form>
          </div>
          {placementTest.sections.map((section) => (
            <div key={section.id} style={{ display: "grid", gap: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>{section.title}</h3>
              <div style={{ display: "grid", gap: 6, color: "#374151", fontSize: 14 }}>
                {section.passage.map((line, idx) => (
                  <p key={`${section.id}-line-${idx}`} style={{ margin: 0 }}>
                    {line}
                  </p>
                ))}
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {section.questions.map((question) => (
                  <fieldset key={question.id} style={{ display: "grid", gap: 8, border: "none", margin: 0, padding: 0 }}>
                    <legend style={{ fontWeight: 600, padding: 0 }}>
                      {question.number}. {question.text}
                    </legend>
                    <div role="radiogroup" aria-label={`${question.number}. ${question.text}`} style={{ display: "grid", gap: 8 }}>
                      {question.options.map((option) => renderPlacementOptionButton(question, option))}
                    </div>
                  </fieldset>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 14, color: "#4b5563" }}>
            {t("placementPage.answeredStatus", {
              answered: placementAnsweredCount,
              total: placementQuestions.length,
            })}
          </div>
          {placementComplete ? (
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ ...styles.focusNotice, margin: 0 }}>
                {t("placementPage.resultSummary", {
                  score: weightedScore.toFixed(1),
                  total: weightedTotal.toFixed(1),
                  level: placementLevel,
                })}
              </div>
              <div style={{ color: "#374151", fontSize: 14 }}>{getLevelFeedback(placementLevel)}</div>
              <div>
                <a href={placementRecommendationRoute} style={{ ...styles.buttonPrimary, textDecoration: "none", display: "inline-block" }}>
                  {t("placementPage.levelCta", { level: placementLevel })}
                </a>
              </div>
              {canRevealAnswerKey ? (
                <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
                  <h4 style={{ marginTop: 0 }}>{t("placementPage.answerKeyTitle")}</h4>
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
                  <div style={{ color: "#4b5563", fontSize: 14 }}>{t("placementPage.answerReviewLocked")}</div>
                  <button type="button" style={styles.buttonSecondary} onClick={handleUnlockAnswerReview}>
                    {t("placementPage.unlockAnswerReview")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: "#6b7280", fontSize: 14 }}>{t("placementPage.finishPrompt")}</div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PlacementTestPage;
