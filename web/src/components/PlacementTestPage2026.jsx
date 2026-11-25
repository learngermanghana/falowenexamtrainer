import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { makePlacementAttemptId, postPlacementEvent, sendPlacementEventOnce, answersToIndices } from "../lib/placementMonitoring";
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
import { swahiliPlacementTest, swahiliPlacementQuestions, SWAHILI_PLACEMENT_STORAGE_KEY, SWAHILI_PLACEMENT_VERSION, shufflePlacementItems } from "./swahiliPlacementTestData";

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
      serverScore: saved.serverScore && (language === "swahili" ? ["A1","A2","B1","B2"] : ["A1","A2","B1"]).includes(saved.serverScore.level) ? saved.serverScore : null,
      activeIndex: Math.max(0, Math.min(questions.length - 1, Number.isInteger(saved.activeIndex) ? saved.activeIndex : 0)),
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

export default function PlacementTestPage2026({ language = "german" }) {
  const { t, i18n } = useTranslation();
  const isSwahili = language === "swahili";
  const test = isSwahili ? swahiliPlacementTest : placementTest;
  const canonicalQuestions = isSwahili ? swahiliPlacementQuestions : placementQuestions;
  const storageKey = isSwahili ? SWAHILI_PLACEMENT_STORAGE_KEY : PLACEMENT_STORAGE_KEY;
  const [session, setSession] = useState(() => readSession(language));
  const questions = useMemo(() => isSwahili && session.id
    ? test.sections.map((_,index)=>index*10).flatMap(offset => shufflePlacementItems(canonicalQuestions.slice(offset, offset + 10), session.id + ":section:" + offset))
        .map((q, index) => ({ ...q, number: index + 1, options: shufflePlacementItems(q.options, session.id + ":" + q.id) }))
    : canonicalQuestions, [isSwahili, session.id, canonicalQuestions, test.sections]);
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
    ? Object.fromEntries(test.sections.map(({level}) => [level, {
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
      answers:answersToIndices(session.answers,canonicalQuestions)};
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
  }, [session.id,session.completedAt,session.answers,session.ticket,session.serverScore,retry,isSwahili,language,canonicalQuestions]);

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
      result = await postPlacementEvent({action:"start",language,...(isSwahili ? {version:SWAHILI_PLACEMENT_VERSION} : {}),id:makePlacementAttemptId(),
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
    setSession((previous) => ({ ...previous, activeIndex: Math.max(0, Math.min(questions.length - 1, index)) }));
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

  const languageName = isSwahili ? "Kiswahili" : "German";
  const resultUrl = isSwahili
    ? (suggestedLevel === "B2" ? "/learn-swahili" : "/signup?program=swahili&level=" + encodeURIComponent(suggestedLevel) + "&source=placement-test")
    : "/classes/?level=" + encodeURIComponent(suggestedLevel);

  return (
    <main className="falowen-placement-main">
      {!started ? (
        <section className="falowen-placement-intro" aria-label={languageName + " placement test introduction"}>
          <div className="falowen-placement-intro-copy">
            <span className="falowen-placement-kicker">Free {languageName} level check</span>
            <h1>{test.title}</h1>
            <p className="falowen-placement-summary">{test.subtitle}</p>
            <div className="falowen-placement-levels" aria-label="Assessment levels">
              {test.sections.map((section, index) => (
                <div className="falowen-placement-level" key={section.id}>
                  <div className="falowen-placement-level-top">
                    <strong>{section.level}</strong>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <small>{section.questions.length} questions</small>
                </div>
              ))}
            </div>
            <div className="falowen-placement-time-note">
              <div className="falowen-placement-time-heading">
                <strong>20-minute timed assessment</strong>
                <span>20:00</span>
              </div>
              <p>Select Start test when ready. You can skip questions and return before submitting. The timer keeps running if you refresh or leave the page. At 00:00 your responses submit automatically.</p>
            </div>
            <p className="falowen-placement-disclaimer">
              This is a preliminary class-placement recommendation, not an official {isSwahili ? "CEFR" : "Goethe or CEFR"} certificate.
            </p>
          </div>
          <div className="falowen-placement-start-card">
            <div className="falowen-placement-start-meta">
              <span>Before you begin</span>
              <span>100% free</span>
            </div>
            <h2>Where should we send your {languageName} placement result?</h2>
            <p>We’ll email your score and recommended starting level. No account is required.</p>
            <form onSubmit={begin} aria-label={languageName + " placement registration"}>
              <label className="falowen-placement-form-label">
                Email address
                <input name="email" type="email" placeholder="you@example.com" required maxLength={180} autoComplete="email" />
              </label>
              <label className="falowen-placement-form-label">
                First name (optional)
                <input name="name" placeholder="Your first name" maxLength={120} autoComplete="given-name" />
              </label>
              <label className="falowen-placement-checkbox">
                <input name="classEmails" type="checkbox" />
                <span>Also email me about upcoming {isSwahili ? "Kiswahili learning opportunities" : "German classes"} at my level.</span>
              </label>
              {startError ? <div className="falowen-placement-error" role="alert">{startError}</div> : null}
              <button className="falowen-placement-primary falowen-placement-start-submit" type="submit" disabled={starting}>
                <span>{starting ? "Starting…" : "Start test"}</span>
                <span className="falowen-placement-primary-arrow" aria-hidden="true">→</span>
              </button>
              <p className="falowen-placement-start-note">Your 20 minutes begin when you start.</p>
            </form>
          </div>
        </section>
      ) : (
        <div className="falowen-placement-workspace">
          <div className="falowen-placement-workspace-top">
            <div>
              <span className="falowen-placement-kicker">{finished ? "Your placement result" : "Placement assessment in progress"}</span>
              <h1>{languageName} · {isSwahili ? "A1–B2" : "A1–B1"}</h1>
            </div>
            <span className="falowen-placement-free">{finished ? "Completed" : `${questions.length} questions · 20 minutes`}</span>
          </div>
          {!finished ? (
            <section className="falowen-placement-progress-shell" aria-label="Placement test progress and timer">
              <div className="falowen-placement-progress-top">
                <div>
                  <strong>{activeQuestion.level} · Question {activeQuestion.number} of {questions.length}</strong>
                  <small>{answered} of {questions.length} answered</small>
                </div>
                <div className={"falowen-placement-countdown" + (remaining <= 60000 ? " is-critical" : remaining <= 5 * 60000 ? " is-warning" : "")}
                  aria-label={label + ": " + formatRemaining(remaining)}>
                  <small>{label}</small>
                  <strong>{formatRemaining(remaining)}</strong>
                </div>
              </div>
              <div className="falowen-placement-progress" role="progressbar" aria-label="Questions answered" aria-valuenow={answered} aria-valuemin={0} aria-valuemax={questions.length}>
                <div style={{ width: Math.round(answered / questions.length * 100) + "%" }} />
              </div>
              {remaining <= 5 * 60000 ? (
                <p className="falowen-placement-timer-warning" aria-live="polite">
                  {remaining <= 60000 ? "Final minute. Submit now or your responses will be submitted automatically." : "Five minutes left. Unanswered questions count as incorrect."}
                </p>
              ) : null}
            </section>
          ) : null}
          {!finished ? (
            <section className="falowen-placement-question-card">
              <nav className="falowen-placement-section-nav" aria-label="Assessment sections">
                {test.sections.map((section, index) => {
                  const count = section.questions.filter(q => Object.prototype.hasOwnProperty.call(session.answers, q.id)).length;
                  return (
                    <button key={section.id} type="button" aria-pressed={activeQuestion.level === section.level} onClick={() => navigate(index * 10)}>
                      {section.level} <span>({count}/10)</span>
                    </button>
                  );
                })}
              </nav>
              <div className="falowen-placement-question-heading">
                <small>{activeQuestion.level}{!isSwahili && ` · ${activeQuestion.topic}`}</small>
                <h2>{activeQuestion.number}. {activeQuestion.text}</h2>
              </div>
              <fieldset className="falowen-placement-options">
                <legend>Choose one answer.</legend>
                {activeQuestion.options.map((option, index) => {
                  const selected = session.answers[activeQuestion.id] === option;
                  return (
                    <label key={index} className={"falowen-placement-option" + (selected ? " is-selected" : "")}>
                      <input type="radio" name={"placement-" + activeQuestion.id} checked={selected}
                        onChange={() => answer(activeQuestion, option)}
                        aria-label={String.fromCharCode(65 + index) + ". " + option} />
                      <span className="falowen-placement-option-index">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                    </label>
                  );
                })}
              </fieldset>
              <div className="falowen-placement-question-actions">
                <button className="falowen-placement-outline" type="button" disabled={activeQuestion.number === 1}
                  onClick={() => navigate(session.activeIndex - 1)}>← Previous</button>
                {activeQuestion.number < questions.length ? (
                  <button className="falowen-placement-primary" type="button"
                    onClick={() => navigate(session.activeIndex + 1)}>Next question →</button>
                ) : (
                  <button className="falowen-placement-primary" type="button" onClick={submit}>Finish test →</button>
                )}
              </div>
              <div className="falowen-placement-jump">
                <span className="falowen-placement-jump-label">Jump to a question</span>
                <div className="falowen-placement-jump-grid">
                  {questions.slice(Math.floor(session.activeIndex / 10) * 10, Math.floor(session.activeIndex / 10) * 10 + 10).map(question => (
                    <button key={question.id} type="button" title={"Question " + question.number}
                      aria-label={"Go to question " + question.number}
                      aria-current={question.number === activeQuestion.number ? "step" : undefined}
                      className={Object.prototype.hasOwnProperty.call(session.answers, question.id) ? "is-answered" : ""}
                      onClick={() => navigate(question.number - 1)}>
                      {question.number}
                    </button>
                  ))}
                </div>
              </div>
              <div className="falowen-placement-finish-row">
                <small>You can finish early. Unanswered questions count as incorrect.</small>
                <button className="falowen-placement-outline" type="button" onClick={submit}>Submit test</button>
              </div>
            </section>
          ) : isSwahili && !session.serverScore ? (
            <section className="falowen-placement-pending" role="status">
              <strong>{delivery === "failed" ? "Your result could not be saved yet." : "Your Kiswahili answers have been submitted."}</strong>
              <p>We are checking your answers securely. Your test is saved in this browser; keep this page open until your recommended level appears.</p>
              {delivery === "failed" ? (
                <button className="falowen-placement-primary" type="button" onClick={() => setRetry(n => n + 1)}>Retry saving my result →</button>
              ) : null}
            </section>
          ) : (
            <section className="falowen-placement-results-card"
              data-placement-language={language}
              data-placement-registered={Boolean(session.ticket)}
              data-placement-attempt-id={session.id || ""}
              data-placement-a1={levelStats.A1.correct}
              data-placement-a2={levelStats.A2.correct}
              data-placement-b1={levelStats.B1.correct} data-placement-b2={isSwahili ? levelStats.B2.correct : undefined}>
              <div className="falowen-placement-results-hero">
                <span className="falowen-placement-kicker">{session.completionReason === "time" ? "Time is up · answers submitted automatically" : "Assessment complete"}</span>
                <h2>Your suggested starting level: {suggestedLevel}</h2>
                <div className="falowen-placement-results-scoreline">
                  Suggested level: <strong>{suggestedLevel}</strong> · Score: {correct}/{questions.length}
                </div>
                <p>Based on {questions.length} grammar and vocabulary questions. Confirm with a speaking or writing check before final class placement.</p>
              </div>
              {session.ticket ? (
                <div className="falowen-placement-email-status" role="status">
                  {delivery === "queued" ? "Your result is queued for email." : delivery === "failed" ? (
                    <>We couldn’t queue your result email. <button type="button" className="falowen-placement-outline" onClick={() => setRetry(n => n + 1)}>Retry email</button></>
                  ) : "Saving your result for email…"}
                </div>
              ) : null}
              <h3 className="falowen-placement-results-heading">Your results by level</h3>
              <div className="falowen-placement-results-grid">
                {test.sections.map(section => {
                  const score = levelStats[section.level];
                  return (
                    <div className="falowen-placement-result-level" key={section.level}>
                      <strong>{section.level}</strong>
                      <div className="score">{score.correct}/10</div>
                      <small>{score.answered}/10 answered</small>
                      <div className="falowen-placement-results-bar" aria-hidden="true">
                        <div style={{ width: (score.correct * 10) + "%" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="falowen-placement-results-guidance">
                {isSwahili ? (
                  suggestedLevel === "A1" ? "Start with core expressions, everyday vocabulary and basic Kiswahili grammar."
                  : suggestedLevel === "A2" ? "Continue building A2 skills before moving to more complex B1 structures."
                  : suggestedLevel === "B2" ? "Your objective answers suggest B2. Confirm your level with a teacher before enrolling." : "Your objective answers suggest B1. Confirm your level with a teacher before enrolling."
                ) : (
                  suggestedLevel === "A1" ? "Build stronger foundations in everyday grammar and vocabulary before advancing."
                  : suggestedLevel === "A2" ? "Your A1 and A2 foundations are strong; A2 can help you prepare for B1 structures."
                  : "You showed strong performance across all three sections. B1 is a suggested starting point."
                )}
              </p>
              <div className="falowen-placement-results-actions">
                <a className="falowen-placement-primary" href={resultUrl}
                  onClick={() => recordEvent("recommended_class_click", { level: suggestedLevel, language })}>
                  {isSwahili ? (suggestedLevel === "B2" ? "Contact Kiswahili admissions" : "Continue with Kiswahili") : "View " + suggestedLevel + " classes"} →
                </a>
                <button className="falowen-placement-outline" type="button" onClick={() => setSession(initialSession())}>Retake test</button>
              </div>
              {isSwahili && <details className="falowen-placement-review" open><summary>Teacher follow-up · Kuandika / Kuzungumza</summary><p>These tasks are not included in the automatic score. Complete the A1 introduction in writing, or use the A2–B2 task with your teacher to confirm your level.</p>{test.sections.map(section => <div key={section.id}><h4>{section.level} · Kuandika | Writing</h4><p>{section.writingPrompt}</p></div>)}</details>}
              <details className="falowen-placement-review">
                <summary>{isSwahili ? "Review your submitted answers" : "Review answers (after submission)"}</summary>
                <ol>
                  {questions.map(question => {
                    const selected = session.answers[question.id];
                    return (
                      <li key={question.id}>
                        <strong>{question.level} · {question.text}</strong>
                        <div>Your answer: {selected || "Not answered"}</div>
                        {!isSwahili ? <div>Correct: {question.correct}</div> : null}
                      </li>
                    );
                  })}
                </ol>
              </details>
            </section>
          )}
        </div>
      )}
      <footer className="falowen-placement-foot">
        <strong>{isSwahili ? "Karibu! A good place to begin learning Kiswahili." : "A little German. A great place to start."}</strong>
        <span>{isSwahili ? "A1–B2" : "A1–B1"} placement&nbsp; / &nbsp;{questions.length} questions&nbsp; / &nbsp;20 minutes</span>
      </footer>
    </main>
  );
}
