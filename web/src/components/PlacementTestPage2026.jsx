import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { makePlacementAttemptId, postPlacementEvent, sendPlacementEventOnce, answersToIndices } from "../lib/placementMonitoring";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";
import {
  placementTest,
  placementQuestions,
  PLACEMENT_DURATION_MS,
  PLACEMENT_STORAGE_KEY,
  buildLevelStats,
  getPlacementLevel,
  getRemainingMs,
  formatRemaining,
} from "./placementTest2026Data";
import { swahiliPlacementTest, swahiliPlacementQuestions, SWAHILI_PLACEMENT_STORAGE_KEY } from "./swahiliPlacementTestData";

const initialSession = () => ({
  id: null,
  startedAt: null,
  completedAt: null,
  completionReason: null,
  answers: {},
  serverScore: null,
  activeIndex: 0,
});

const readSession = (language = "german") => {
  if (typeof window === "undefined") return initialSession();
  const questions = language === "swahili" ? swahiliPlacementQuestions : placementQuestions;
  const storageKey = language === "swahili" ? SWAHILI_PLACEMENT_STORAGE_KEY : PLACEMENT_STORAGE_KEY;
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    if (!saved || typeof saved !== "object" || !Number.isFinite(saved.startedAt)) return initialSession();
    const startedAt = saved.startedAt;
    const timedOut = Date.now() >= startedAt + PLACEMENT_DURATION_MS;
    const wasCompleted = Number.isFinite(saved.completedAt);
    return {
      id: /^pt_[a-zA-Z0-9-]{12,90}$/.test(String(saved.id||"")) ? saved.id : makePlacementAttemptId(),
      ticket: saved.ticket || null,
      startedAt,
      completedAt: wasCompleted ? saved.completedAt : timedOut ? startedAt + PLACEMENT_DURATION_MS : null,
      completionReason: wasCompleted ? saved.completionReason || "submitted" : timedOut ? "time" : null,
      answers: Object.fromEntries(
        Object.entries(saved.answers || {}).filter(([id, value]) =>
          questions.some((question) => question.id === id && question.options.includes(value))
        )
      ),
      serverScore: saved.serverScore && ["A1","A2","B1"].includes(saved.serverScore.level) ? saved.serverScore : null,
      activeIndex: Math.max(0, Math.min(29, Number.isInteger(saved.activeIndex) ? saved.activeIndex : 0)),
    };
  } catch (_error) {
    return initialSession();
  }
};

const recordEvent = (action, payload = {}) => {
  if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: "placement_test", action, ...payload });
  }
};

const buttonBase = {
  minHeight: 44,
  borderRadius: 12,
  padding: "11px 16px",
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#1e293b",
  font: "inherit",
  fontWeight: 750,
  cursor: "pointer",
};
const primaryButton = { ...buttonBase, borderColor: "#1d4ed8", background: "#1d4ed8", color: "#fff" };
const subtleText = { fontSize: 14, color: "#64748b", lineHeight: 1.55 };

export default function PlacementTestPage2026({ language = "german" }) {
  const { t, i18n } = useTranslation();
  const isSwahili = language === "swahili";
  const test = isSwahili ? swahiliPlacementTest : placementTest;
  const questions = isSwahili ? swahiliPlacementQuestions : placementQuestions;
  const storageKey = isSwahili ? SWAHILI_PLACEMENT_STORAGE_KEY : PLACEMENT_STORAGE_KEY;
  const [session, setSession] = useState(() => readSession(language));
  const [now, setNow] = useState(() => Date.now());
  const trackedCompletion = useRef(Boolean(session.completedAt && (!isSwahili || session.serverScore)));
  const [starting,setStarting] = useState(false);
  const [startError,setStartError] = useState("");
  const [delivery,setDelivery] = useState("");
  const [retry,setRetry] = useState(0);
  const started = Boolean(session.startedAt);
  const finished = Boolean(session.completedAt);
  const remaining = finished ? 0 : getRemainingMs(session.startedAt, now);
  const activeQuestion = questions[session.activeIndex];
  const levelStats = useMemo(() => isSwahili
    ? Object.fromEntries(["A1","A2","B1"].map(level => [level, {
        correct: Number(session.serverScore?.[level.toLowerCase()] || 0),
        answered: questions.filter(q => q.level === level && Object.prototype.hasOwnProperty.call(session.answers,q.id)).length,
        total: 10,
      }]))
    : buildLevelStats(test.sections, session.answers),
    [isSwahili, session.serverScore, session.answers, questions, test.sections]);
  const correct = isSwahili ? Number(session.serverScore?.total || 0) : Object.values(levelStats).reduce((sum, stat) => sum + stat.correct, 0);
  const answered = questions.filter((question) => Object.prototype.hasOwnProperty.call(session.answers, question.id)).length;
  const suggestedLevel = isSwahili ? (session.serverScore?.level || "A1") : getPlacementLevel(levelStats);

  useEffect(() => {
    const pageTitle = isSwahili ? test.title : t("placement2026.title", { defaultValue: test.title });
    const pageDescription = isSwahili ? test.subtitle : t("placement2026.description", { defaultValue: test.subtitle });
    updatePageMeta({
      title: pageTitle,
      description: pageDescription,
      lang: i18n.language,
      canonicalPath: "/placement-test",
      ogType: "article",
      structuredData: [{
        id: "article",
        schema: {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: pageTitle,
          description: pageDescription,
          author: { "@type": "Organization", name: "Falowen" },
          publisher: { "@type": "Organization", name: "Falowen", logo: { "@type": "ImageObject", url: "https://www.falowen.app/logo512.png" } },
          mainEntityOfPage: "https://www.falowen.app/placement-test",
          dateModified: new Date().toISOString(),
        },
      }],
    });
  }, [i18n.language, t, isSwahili, test.title, test.subtitle]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(session));
    } catch (_error) {
      // Private browsing or storage quotas should not prevent taking the test.
    }
  }, [session, storageKey]);

  useEffect(() => {
    if (!started || finished) return undefined;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      setSession((previous) => {
        if (!previous.startedAt || previous.completedAt) return previous;
        if (current < previous.startedAt + PLACEMENT_DURATION_MS) return previous;
        return { ...previous, completedAt: previous.startedAt + PLACEMENT_DURATION_MS, completionReason: "time" };
      });
    };
    tick();
    const intervalId = window.setInterval(tick, 1000);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [started, finished]);

  useEffect(() => {
    if (!started) recordEvent("contact_prompt_view");
  }, [started]);

  useEffect(() => {
    if (!session.id || !session.completedAt || (isSwahili && session.serverScore)) return undefined;
    let active = true;
    const payload = {id:session.id, action:"complete", language, ticket:session.ticket,
      answers:answersToIndices(session.answers,questions)};
    const send = async () => {
      if (active) setDelivery("saving");
      try {
        // Kiswahili needs the server-owned score. Re-requesting a completed attempt
        // is safe: the existing private outbox deduplicates by attempt ID.
        const response = isSwahili ? await postPlacementEvent(payload) : await sendPlacementEventOnce(payload);
        if (isSwahili && !response.score) throw new Error("Private placement score unavailable");
        if (active) {
          if (isSwahili) setSession(previous => ({...previous, serverScore:response.score}));
          setDelivery("queued");
        }
      } catch (_) {
        if (active) setDelivery("failed");
      }
    };
    send();
    window.addEventListener("online",send);
    return () => { active = false; window.removeEventListener("online",send); };
  }, [session.id,session.completedAt,session.answers,session.ticket,session.serverScore,retry,isSwahili,language,questions]);

  useEffect(() => {
    if (!finished || trackedCompletion.current || (isSwahili && !session.serverScore)) return;
    trackedCompletion.current = true;
    recordEvent("complete", {
      correct,
      total: questions.length,
      language,
      level: suggestedLevel,
      reason: session.completionReason,
    });
    recordEvent("level_assigned", { level: suggestedLevel });
  }, [finished, correct, suggestedLevel, session.completionReason, session.serverScore, isSwahili, language, questions.length]);

  const begin = async (event) => {
    event.preventDefault();
    if (starting) return;
    const data = new FormData(event.currentTarget);
    setStarting(true);
    setStartError("");
    let result;
    try {
      result = await postPlacementEvent({action:"start",language,id:makePlacementAttemptId(),
        email:data.get("email"),name:data.get("name"),classEmails:data.has("classEmails")});
      if (!result.ticket) throw new Error("Please refresh and try again.");
    } catch (error) {
      setStartError(error.message || "Could not save your email. Please try again.");
      return;
    } finally { setStarting(false); }
    setDelivery("");
    const current = Date.now();
    setNow(current);
    trackedCompletion.current = false;
    setSession({ ...initialSession(), id:result.id, ticket:result.ticket, startedAt: current });
    recordEvent("start", { questionCount: questions.length, durationMinutes: 20, language });
  };

  const answer = (question, option) => {
    if (!started || finished) return;
    const current = Date.now();
    if (current >= session.startedAt + PLACEMENT_DURATION_MS) {
      setNow(current);
      setSession((previous) => previous.completedAt ? previous : {
        ...previous, completedAt: previous.startedAt + PLACEMENT_DURATION_MS, completionReason: "time"
      });
      return;
    }
    setSession((previous) => ({
      ...previous,
      answers: { ...previous.answers, [question.id]: option },
    }));
  };

  const navigate = (index) => {
    if (finished) return;
    setSession((previous) => ({ ...previous, activeIndex: Math.max(0, Math.min(29, index)) }));
  };

  const submit = () => {
    if (!started || finished) return;
    const current = Date.now();
    setNow(current);
    setSession((previous) => previous.completedAt ? previous : ({
      ...previous,
      completedAt: Math.min(current, previous.startedAt + PLACEMENT_DURATION_MS),
      completionReason: current >= previous.startedAt + PLACEMENT_DURATION_MS ? "time" : "submitted",
    }));
  };

  const label = remaining <= 60000 && started ? "Final minute" : remaining <= 5 * 60000 && started ? "Five minutes or less remaining" : "Time left";
  const timerColor = remaining <= 60000 ? "#b91c1c" : remaining <= 5 * 60000 ? "#b45309" : "#1d4ed8";

  return (
    <main style={{ ...styles.container, maxWidth: 880, display: "grid", gap: 16, paddingBottom: 56 }}>
      <section style={{ ...styles.card, display: "grid", gap: 9 }}>
        <p style={{ ...subtleText, margin: 0, color: "#1d4ed8", fontWeight: 850 }}>FREE {isSwahili ? "KISWAHILI" : "GERMAN"} LEVEL CHECK</p>
        <h1 style={{ ...styles.sectionTitle, margin: 0 }}>{test.title}</h1>
        <p style={{ ...subtleText, margin: 0 }}>{test.subtitle}</p>
        <p style={{ ...subtleText, margin: 0 }}>This is a preliminary placement recommendation, not an official CEFR certificate.</p>
      </section>

      {!started ? (
        <section style={{ ...styles.card, display: "grid", gap: 14 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {test.sections.map((section) => (
              <span key={section.id} style={{ ...styles.badge, background: "#eff6ff", color: "#1e40af", padding: "9px 13px" }}>
                {section.level} · 10 questions
              </span>
            ))}
          </div>
          <div style={{ padding: 14, border: "1px solid #bfdbfe", borderRadius: 14, background: "#eff6ff" }}>
            <strong>20-minute timed assessment</strong>
            <p style={{ ...subtleText, margin: "6px 0 0" }}>
              Select Start test when ready. You can skip questions and return before submitting.
              The timer keeps running if you refresh or leave the page. At 00:00 your responses submit automatically.
            </p>
          </div>
          <form onSubmit={begin} style={{display:"grid",gap:12,maxWidth:480}}>
            <strong>Where should we send your {isSwahili ? "Kiswahili" : "German"} placement result?</strong>
            <span>We’ll email your score and recommended starting level. No account is required.</span>
            <label>Email address <input name="email" type="email" required maxLength={180} autoComplete="email" /></label>
            <label>First name (optional) <input name="name" maxLength={120} autoComplete="given-name" /></label>
            <label><input name="classEmails" type="checkbox" /> Also email me about upcoming {isSwahili ? "Kiswahili learning opportunities" : "German classes"} at my level.</label>
            {startError && <span role="alert">{startError}</span>}
            <button type="submit" disabled={starting} style={{...primaryButton,justifySelf:"start"}}>{starting ? "Starting…" : "Start test →"}</button>
          </form>
        </section>
      ) : (
        <>
          {!finished ? (
            <section
              aria-label="Placement test progress and timer"
              style={{
                ...styles.card,
                display: "grid",
                gap: 10,
                position: "sticky",
                top: 8,
                zIndex: 10,
                background: remaining <= 60000 ? "#fef2f2" : "#fff",
                border: "1px solid #cbd5e1",
                boxShadow: "0 4px 18px rgba(15,23,42,0.08)",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div>
                  <strong>{activeQuestion.level} · Question {activeQuestion.number} of 30</strong>
                  <div style={subtleText}>{answered} of 30 answered</div>
                </div>
                <div aria-label={label + ": " + formatRemaining(remaining)} style={{ textAlign: "right", color: timerColor }}>
                  <div style={{ fontSize: 12, fontWeight: 750 }}>{label}</div>
                  <strong style={{ fontSize: 26, fontVariantNumeric: "tabular-nums" }}>{formatRemaining(remaining)}</strong>
                </div>
              </div>
              <div aria-hidden="true" style={{ background: "#e2e8f0", height: 8, borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: Math.round(answered / 30 * 100) + "%", background: "#2563eb", height: "100%" }} />
              </div>
              {remaining <= 5 * 60000 ? (
                <p aria-live="polite" style={{ margin: 0, color: timerColor, fontSize: 13, fontWeight: 650 }}>
                  {remaining <= 60000 ? "Final minute. Submit now or your responses will be submitted automatically." : "Five minutes left. Unanswered questions count as incorrect."}
                </p>
              ) : null}
            </section>
          ) : null}

          {!finished ? (
            <section style={{ ...styles.card, display: "grid", gap: 16 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {test.sections.map((section, index) => {
                  const isActive = activeQuestion.level === section.level;
                  const count = section.questions.filter((q) => Object.prototype.hasOwnProperty.call(session.answers, q.id)).length;
                  return (
                    <button key={section.id} type="button" style={isActive ? primaryButton : buttonBase} onClick={() => navigate(index * 10)}>
                      {section.level} <span style={{ fontWeight: 450 }}>({count}/10)</span>
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "grid", gap: 5 }}>
                <span style={{ ...subtleText, fontWeight: 750 }}>{activeQuestion.topic}</span>
                <h2 style={{ fontSize: 22, color: "#0f172a", lineHeight: 1.45, margin: 0 }}>
                  {activeQuestion.number}. {activeQuestion.text}
                </h2>
              </div>
              <fieldset style={{ display: "grid", gap: 10, padding: 0, margin: 0, border: 0 }}>
                <legend style={{ ...subtleText, marginBottom: 10 }}>Choose one answer.</legend>
                {activeQuestion.options.map((option, index) => {
                  const selected = session.answers[activeQuestion.id] === option;
                  return (
                    <label key={index} style={{
                      display: "flex", alignItems: "center", gap: 12, minHeight: 48,
                      cursor: "pointer", padding: "12px 14px", borderRadius: 12,
                      border: selected ? "2px solid #2563eb" : "1px solid #cbd5e1",
                      background: selected ? "#eff6ff" : "#fff", color: "#0f172a",
                    }}>
                      <input
                        type="radio"
                        name={"placement-" + activeQuestion.id}
                        checked={selected}
                        onChange={() => answer(activeQuestion, option)}
                        aria-label={String.fromCharCode(65 + index) + ". " + option}
                      />
                      <strong style={{ minWidth: 22 }}>{String.fromCharCode(65 + index)}.</strong>
                      <span>{option}</span>
                    </label>
                  );
                })}
              </fieldset>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <button type="button" style={{ ...buttonBase, opacity: activeQuestion.number === 1 ? 0.5 : 1 }} disabled={activeQuestion.number === 1} onClick={() => navigate(session.activeIndex - 1)}>← Previous</button>
                {activeQuestion.number < 30 ? (
                  <button type="button" style={primaryButton} onClick={() => navigate(session.activeIndex + 1)}>Next question →</button>
                ) : (
                  <button type="button" style={primaryButton} onClick={submit}>Finish test</button>
                )}
              </div>
              <div style={{ display: "grid", gap: 5 }}>
                <span style={subtleText}>Jump to a question</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {questions.slice(Math.floor(session.activeIndex / 10) * 10, Math.floor(session.activeIndex / 10) * 10 + 10).map((question) => (
                    <button
                      key={question.id} type="button" title={"Question " + question.number}
                      aria-label={"Go to question " + question.number}
                      aria-current={question.number === activeQuestion.number ? "step" : undefined}
                      onClick={() => navigate(question.number - 1)}
                      style={{
                        ...buttonBase, padding: 0, minHeight: 40, minWidth: 40,
                        background: question.number === activeQuestion.number ? "#1d4ed8" : Object.prototype.hasOwnProperty.call(session.answers, question.id) ? "#dbeafe" : "#fff",
                        color: question.number === activeQuestion.number ? "#fff" : "#1e293b",
                      }}
                    >{question.number}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={subtleText}>You can finish early. Unanswered questions count as incorrect.</span>
                <button type="button" style={buttonBase} onClick={submit}>Submit test</button>
              </div>
            </section>
          ) : (isSwahili && !session.serverScore) ? (
            <section role="status" style={{ ...styles.card, display:"grid", gap:12 }}>
              <strong>{delivery === "failed" ? "Your result could not be saved yet." : "Your Kiswahili answers have been submitted."}</strong>
              <p>We are checking your answers securely. Your test is saved in this browser; please keep this page open until your recommended level appears.</p>
              {delivery === "failed" ? <button type="button" style={primaryButton} onClick={() => setRetry(n => n + 1)}>Retry saving my result</button> : null}
            </section>
          ) : (
            <section data-placement-language={language} data-placement-registered={Boolean(session.ticket)} data-placement-attempt-id={session.id||""} data-placement-a1={levelStats.A1.correct} data-placement-a2={levelStats.A2.correct} data-placement-b1={levelStats.B1.correct} style={{ ...styles.card, display: "grid", gap: 15, border: "1px solid #bfdbfe" }}>
              <div style={{ padding: 14, background: "#eff6ff", borderRadius: 12 }}>
                <p style={{ ...subtleText, margin: 0, fontWeight: 800 }}>{session.completionReason === "time" ? "Time is up · answers submitted automatically" : "Assessment complete"}</p>
                <h2 style={{ fontSize: 27, margin: "7px 0", color: "#0f172a" }}>Your suggested starting level: {suggestedLevel}</h2>
                <div style={{ fontSize: 17 }}>Suggested level: <strong>{suggestedLevel}</strong> · Score: {correct}/30</div>
                <p style={{ ...subtleText, marginBottom: 0 }}>Based on 30 grammar and vocabulary questions. Confirm with a speaking or writing check before final class placement.</p>
              </div>
              {session.ticket && <div role="status">{delivery === "queued" ? "Your result is queued for email." :
                delivery === "failed" ? <>We couldn’t queue your result email. <button type="button" onClick={()=>setRetry(n=>n+1)}>Retry email</button></> :
                "Saving your result for email…"}</div>}
              <h3 style={{ margin: 0 }}>Your results by level</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
                {test.sections.map((section) => {
                  const score = levelStats[section.level];
                  return (
                    <div key={section.level} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14 }}>
                      <strong>{section.level}</strong>
                      <div style={{ fontSize: 23, fontWeight: 850 }}>{score.correct}/10</div>
                      <div style={subtleText}>{score.answered}/10 answered</div>
                      <div aria-hidden="true" style={{ marginTop: 8, background: "#e2e8f0", height: 7, borderRadius: 8, overflow: "hidden" }}>
                        <div style={{ width: (score.correct * 10) + "%", height: "100%", background: "#2563eb" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ ...subtleText, margin: 0 }}>
                {isSwahili ? (suggestedLevel === "A1"
                  ? "Start with core expressions, everyday vocabulary and basic Kiswahili grammar."
                  : suggestedLevel === "A2"
                    ? "Continue building A2 skills before moving to more complex B1 structures."
                    : "You showed strong performance across all three sections. B1 is a suggested starting point.")
                  : (suggestedLevel === "A1" ? "Build stronger foundations in everyday grammar and vocabulary before advancing."
                    : suggestedLevel === "A2" ? "Your A1 and A2 foundations are strong; A2 can help you prepare for B1 structures."
                    : "You showed strong performance across all three sections. B1 is a suggested starting point.")}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a onClick={()=>recordEvent("recommended_class_click",{level:suggestedLevel,language})} href={isSwahili ? "/signup?program=swahili&level="+encodeURIComponent(suggestedLevel)+"&source=placement-test" : "/classes/?level=" + encodeURIComponent(suggestedLevel)} style={{ ...primaryButton, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{isSwahili ? "Continue with Kiswahili" : `View ${suggestedLevel} classes`}</a>
                <button type="button" style={buttonBase} onClick={() => setSession(initialSession())}>Retake test</button>
              </div>
              <details style={{ padding: 12, border: "1px solid #e2e8f0", borderRadius: 12 }}>
                <summary style={{ cursor: "pointer", fontWeight: 800 }}>{isSwahili ? "Review your submitted answers" : "Review answers (after submission)"}</summary>
                <ol style={{ paddingLeft: 22, display: "grid", gap: 14 }}>
                  {questions.map((question) => {
                    const selected = session.answers[question.id];
                    return (
                      <li key={question.id}>
                        <div><strong>{question.level} · {question.text}</strong></div>
                        <div style={{ ...subtleText, color: isSwahili ? "#475569" : selected === question.correct ? "#166534" : "#b91c1c" }}>
                          Your answer: {selected || "Not answered"}
                        </div>
                        {!isSwahili && <div style={{ ...subtleText, color: "#166534" }}>Correct: {question.correct}</div>}
                      </li>
                    );
                  })}
                </ol>
              </details>
            </section>
          )}
        </>
      )}
    </main>
  );
}
