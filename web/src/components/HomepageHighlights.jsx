import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeCanonicalLiveClass } from "../services/canonicalLiveClassService";
import { isAppAssessment } from "../utils/appAssessment";
import {
  GHANA_TIMEZONE,
  asLiveClassDate,
  liveClassCleanTitle,
  liveClassLessonLabel,
  liveClassLessonLink,
  liveClassLevel,
  liveClassSessionStatus,
  loadLiveClassSummaryCache,
  saveLiveClassSummaryCache,
} from "../utils/liveClassCardPresentation";
import "./HomepageHighlights.css";

const LEVEL_BOOKS = Object.freeze({
  A1: { label: "Deutsch A1", subtitle: "Course & Workbook", cover: "/books/a1-cover.svg" },
  A2: { label: "Deutsch A2", subtitle: "Course & Workbook", cover: "/books/a2-cover.svg" },
  B1: { label: "Deutsch B1", subtitle: "Course & Workbook", cover: "/books/b1-cover.svg" },
});
const WRITING_BOOK = Object.freeze({
  label: "German Writing Skills", subtitle: "A1–C2 Writing Guide",
  cover: "/books/writing-skills-a1-c2-cover.svg",
});
const INACTIVE_SESSION_STATUSES = new Set(["cancelled", "superseded", "deleted"]);

export const selectNextHomepageSession = (summary, now = new Date()) => {
  if (!summary) return null;
  const candidates = Array.isArray(summary.sessions) && summary.sessions.length
    ? summary.sessions
    : summary.nextSession ? [summary.nextSession] : [];
  return [...candidates]
    .filter((session) => {
      if (!session || isAppAssessment(session) || session.superseded) return false;
      const status = String(session.status || session.sessionStatus || "scheduled").toLowerCase();
      if (INACTIVE_SESSION_STATUSES.has(status)) return false;
      const start = asLiveClassDate(session.startsAt);
      const end = asLiveClassDate(session.endsAt);
      return Boolean(start && (end ? end.getTime() : start.getTime() + 2 * 60 * 60 * 1000) >= now.getTime());
    })
    .sort((a, b) => asLiveClassDate(a.startsAt).getTime() - asLiveClassDate(b.startsAt).getTime())[0] || null;
};

const formatClassDate = (session) => {
  const start = asLiveClassDate(session?.startsAt);
  if (!start) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: GHANA_TIMEZONE, weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(start);
};
const formatClassRange = (session) => {
  const start = asLiveClassDate(session?.startsAt);
  const end = asLiveClassDate(session?.endsAt);
  if (!start) return "";
  const time = date => new Intl.DateTimeFormat("en-GB", {
    timeZone: GHANA_TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(date);
  return end ? `${time(start)}–${time(end)} Ghana time` : `${time(start)} Ghana time`;
};

export default function HomepageHighlights({ className = "", classId = "", level = "", program = "" }) {
  const navigate = useNavigate();
  const assignedClassName = String(className || "").trim();
  const assignedClassId = String(classId || "").trim();
  const hasAssignedClass = Boolean(assignedClassName || assignedClassId) && program !== "french";
  const identity = useMemo(
    () => ({ classId: assignedClassId, className: assignedClassName }),
    [assignedClassId, assignedClassName],
  );
  const [summary, setSummary] = useState(() => hasAssignedClass ? loadLiveClassSummaryCache(identity) : null);
  const [scheduleStatus, setScheduleStatus] = useState("loading");
  const [now, setNow] = useState(() => new Date());
  const [activeId, setActiveId] = useState(hasAssignedClass ? "class" : "music");

  useEffect(() => {
    if (!hasAssignedClass) {
      setSummary(null);
      setScheduleStatus("unavailable");
      return undefined;
    }
    const cached = loadLiveClassSummaryCache(identity);
    setSummary(cached);
    setScheduleStatus("loading");
    return subscribeCanonicalLiveClass({
      classId: assignedClassId,
      className: assignedClassName,
      onChange: fresh => {
        setSummary(fresh);
        saveLiveClassSummaryCache(identity, fresh);
        setScheduleStatus("ready");
      },
      onUnavailable: () => setScheduleStatus(cached ? "cached" : "unavailable"),
      onError: () => setScheduleStatus(cached ? "cached" : "unavailable"),
    });
  }, [assignedClassId, assignedClassName, hasAssignedClass, identity]);

  useEffect(() => {
    if (!hasAssignedClass) return undefined;
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, [hasAssignedClass]);

  const nextSession = hasAssignedClass ? selectNextHomepageSession(summary, now) : null;
  const showClass = Boolean(nextSession || (hasAssignedClass && scheduleStatus === "loading"));
  const slideIds = useMemo(() => showClass ? ["class", "music", "books"] : ["music", "books"], [showClass]);
  const selectedId = slideIds.includes(activeId) ? activeId : slideIds[0];
  const activeIndex = slideIds.indexOf(selectedId);
  const changeSlide = useCallback(offset => {
    setActiveId(slideIds[(activeIndex + offset + slideIds.length) % slideIds.length]);
  }, [activeIndex, slideIds]);

  const selectedLevel = String(level || "").trim().toUpperCase();
  const featuredBook = LEVEL_BOOKS[selectedLevel] || WRITING_BOOK;
  const fullCalendarParams = new URLSearchParams();
  const resolvedClassId = summary?.klass?.id || summary?.klass?.classId || assignedClassId;
  const resolvedClassName = summary?.klass?.name || summary?.klass?.className || assignedClassName;
  if (resolvedClassId) fullCalendarParams.set("classId", resolvedClassId);
  const scheduleUrl = `/campus/course/full-class-calendar/${encodeURIComponent(resolvedClassName || "class")}${fullCalendarParams.toString() ? `?${fullCalendarParams.toString()}` : ""}`;

  const goTo = url => navigate(url);
  const dateLabel = formatClassDate(nextSession);
  const status = nextSession ? liveClassSessionStatus(nextSession, now) : "";
  const isLoadingClass = !nextSession && scheduleStatus === "loading";

  return (
    <section className="fh-highlights" aria-label="Falowen Highlights">
      <header className="fh-highlights__header">
        <div>
          <span className="fh-highlights__eyebrow">DISCOVER MORE ON FALOWEN</span>
          <h2>Falowen Highlights</h2>
        </div>
        {nextSession ? (
          <button type="button" className="fh-highlights__reminder"
            onClick={() => setActiveId("class")} aria-label="Show your upcoming class">
            <span aria-hidden="true">◷</span> Next class · {dateLabel}
          </button>
        ) : null}
      </header>

      <div className="fh-highlights__stage" aria-live="off">
        {selectedId === "class" && (
          <div className="fh-highlights__slide fh-highlights__slide--class">
            <div className="fh-highlights__copy">
              <span className="fh-highlights__tag">YOUR NEXT CLASS</span>
              <h3>{isLoadingClass ? "Checking your next class" : "Your next live lesson"}</h3>
              <p>{isLoadingClass
                ? "Getting the latest schedule for your assigned class."
                : "See your lesson details and open your Course Book when you are ready."}</p>
              {nextSession ? (
                <div className="fh-highlights__actions">
                  <button type="button" className="fh-highlights__button"
                    onClick={() => goTo(liveClassLessonLink(summary, nextSession))}>Open lesson <span aria-hidden="true">→</span></button>
                  <button type="button" className="fh-highlights__text-link"
                    onClick={() => goTo(scheduleUrl)}>View schedule</button>
                </div>
              ) : null}
            </div>
            <div className="fh-highlights__class-detail">
              {nextSession ? (
                <>
                  <span className="fh-highlights__tag">{status} · {resolvedClassName || "Your class"}</span>
                  <strong>{liveClassCleanTitle(nextSession)}</strong>
                  <span>{liveClassLessonLabel(nextSession, liveClassLevel(summary, nextSession))}</span>
                  <div className="fh-highlights__date">{dateLabel}<span>{formatClassRange(nextSession)}</span></div>
                </>
              ) : (
                <>
                  <span className="fh-highlights__tag">CLASS SCHEDULE</span>
                  <strong>{assignedClassName || "Your assigned class"}</strong>
                  <span>Loading the next scheduled lesson…</span>
                </>
              )}
            </div>
          </div>
        )}

        {selectedId === "music" && (
          <div className="fh-highlights__slide fh-highlights__slide--music">
            <div className="fh-highlights__copy">
              <span className="fh-highlights__tag">FALOWEN MUSIC</span>
              <h3>Listen. Sing. Learn German.</h3>
              <p>Practise listening, pronunciation and useful vocabulary with German songs.</p>
              <button type="button" className="fh-highlights__button"
                onClick={() => goTo("/campus/music")}>Explore Music <span aria-hidden="true">→</span></button>
            </div>
            <div className="fh-highlights__music-art" aria-hidden="true">
              <span className="fh-highlights__music-symbol">♫</span>
              <strong>DEUTSCH MIT MUSIK</strong>
              <div className="fh-highlights__sound-bars">
                {[14, 27, 19, 34, 22, 12, 29, 17, 24, 11].map((height, i) => (
                  <span key={i} style={{ height }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedId === "books" && (
          <div className="fh-highlights__slide fh-highlights__slide--books">
            <div className="fh-highlights__copy">
              <span className="fh-highlights__tag">THE FALOWEN BOOK LIBRARY</span>
              <h3>Keep learning with German books</h3>
              <p>Explore course books, guided exercises and the A1–C2 Writing Skills guide.</p>
              <button type="button" className="fh-highlights__button"
                onClick={() => goTo("/books")}>Browse all books <span aria-hidden="true">→</span></button>
            </div>
            <div className="fh-highlights__book-art">
              <img src={featuredBook.cover} alt={featuredBook.label + " book cover"} loading="lazy" />
              <div><strong>{featuredBook.label}</strong><span>{featuredBook.subtitle}</span></div>
            </div>
          </div>
        )}
      </div>

      <nav className="fh-highlights__controls" aria-label="Choose Falowen highlight">
        <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous highlight"
          className="fh-highlights__arrow">‹</button>
        <div className="fh-highlights__dots">
          {slideIds.map(id => (
            <button type="button" key={id} onClick={() => setActiveId(id)}
              className={selectedId === id ? "fh-highlights__dot is-selected" : "fh-highlights__dot"}
              aria-label={id === "class" ? "Show Next Class" : id === "music" ? "Show Music" : "Show Books"}
              aria-current={selectedId === id ? "true" : undefined} />
          ))}
        </div>
        <button type="button" onClick={() => changeSlide(1)} aria-label="Next highlight"
          className="fh-highlights__arrow">›</button>
      </nav>
    </section>
  );
}
