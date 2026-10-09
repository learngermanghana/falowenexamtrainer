import React, { useEffect, useMemo, useState } from "react";
import { updatePageMeta } from "../lib/pageMeta";
import { loadPublicClasses } from "../services/publicClassCatalogService";
import "./PublicUpcomingClassesPage.css";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const normalizedDay = (value) => {
  const day = String(value || "").trim().toLowerCase();
  return WEEKDAYS.find((label) => label.toLowerCase() === day || label.toLowerCase().slice(0, 3) === day.slice(0, 3)) || "";
};

const displayTime = (start, end) => [String(start || "").trim(), String(end || "").trim()]
  .filter(Boolean).join("–") || "Time to be announced";

const displayDate = (raw) => {
  if (!raw) return "Date to be announced";
  const date = new Date(`${String(raw).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "Date to be announced";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(date);
};

const brochureUrl = (course) => course.slug
  ? `/classes/?class=${encodeURIComponent(course.slug)}&open=1`
  : "/classes/";

// These are published class calendar destinations, not arbitrary external links.
// An unknown URL must not turn into a clickable link on the public schedule page.
const verifiedCalendarUrl = (raw) => {
  try {
    const url = new URL(String(raw || "").trim());
    if (url.protocol !== "https:") return null;
    if (!["admin.falowen.app", "drive.google.com"].includes(url.hostname)) return null;
    return url.href;
  } catch (_error) {
    return null;
  }
};

export default function PublicUpcomingClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const description = "Explore Falowen's published German live class calendar, weekly meeting days, start dates and full class schedule links.";
    updatePageMeta({
      title: "Full German Class Schedule & Calendar | Falowen",
      description,
      canonicalPath: "/learn-german-ghana/upcoming-classes",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: "Falowen",
        description,
        url: "https://www.falowen.app/learn-german-ghana/upcoming-classes",
      },
    });

    let active = true;
    loadPublicClasses()
      .then((rows) => { if (active) setClasses(Array.isArray(rows) ? rows : []); })
      .catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const { liveClasses, selfLearning, weeklyCalendar } = useMemo(() => {
    const live = classes.filter((course) => course.availability !== "always" && !course.isSelfLearning);
    const self = classes.filter((course) => course.availability === "always" || course.isSelfLearning);
    const calendar = WEEKDAYS.map((day) => ({
      day,
      entries: live.flatMap((course) =>
        (Array.isArray(course.meetingDays) ? course.meetingDays : [])
          .filter((slot) => normalizedDay(slot.day) === day)
          .map((slot) => ({ course, slot }))
      ).sort((a, b) => String(a.slot.startTime || "").localeCompare(String(b.slot.startTime || ""))),
    }));
    return { liveClasses: live, selfLearning: self, weeklyCalendar: calendar };
  }, [classes]);

  return (
    <main className="falowen-public-schedule">
      <div className="falowen-public-schedule-shell">
        <header className="falowen-schedule-hero">
          <a href="/classes/" className="falowen-schedule-back">← Explore classes</a>
          <span className="falowen-schedule-eyebrow">FALOWEN LIVE CLASSES</span>
          <h1>Full class schedule</h1>
          <p>See when German classes meet, compare upcoming groups and open a detailed class calendar when available.</p>
          <div className="falowen-schedule-meta">
            <span>🕒 Ghana time (GMT)</span>
            <span>🗓 Weekly meeting calendar</span>
          </div>
        </header>

        {loading ? (
          <section className="falowen-schedule-empty" role="status">Loading the latest published class schedule…</section>
        ) : loadError ? (
          <section className="falowen-schedule-empty" role="status">
            The current class schedule is temporarily unavailable. <a href="/classes/">View class information</a>.
          </section>
        ) : (
          <>
            <section className="falowen-schedule-section" aria-labelledby="falowen-week-title">
              <div className="falowen-schedule-section-heading">
                <div>
                  <span className="falowen-schedule-eyebrow">PLAN YOUR WEEK</span>
                  <h2 id="falowen-week-title">Weekly class calendar</h2>
                  <p>These are the currently published recurring meeting times, not an individual learner's attendance calendar.</p>
                </div>
                <span className="falowen-schedule-count">{liveClasses.length} live class{liveClasses.length === 1 ? "" : "es"}</span>
              </div>

              {liveClasses.length ? (
                <div className="falowen-schedule-week" aria-label="Weekly class calendar">
                  {weeklyCalendar.map(({ day, entries }) => (
                    <div className="falowen-schedule-day" key={day}>
                      <h3>{day}</h3>
                      {entries.length ? entries.map(({ course, slot }, index) => (
                        <a className="falowen-schedule-session"
                          href={brochureUrl(course)}
                          key={`${course.id || course.slug || course.title}-${slot.startTime || ""}-${index}`}>
                          <span className="falowen-schedule-session-time">{displayTime(slot.startTime, slot.endTime)}</span>
                          <strong>{course.title}</strong>
                          <span className="falowen-schedule-session-level">{course.level} · Class details →</span>
                        </a>
                      )) : <span className="falowen-schedule-no-session">No published sessions</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="falowen-schedule-empty">No live class meeting times are currently published. Check the class brochure for new dates.</p>
              )}
            </section>

            {liveClasses.length ? (
              <section className="falowen-schedule-section" aria-labelledby="falowen-classes-title">
                <div className="falowen-schedule-section-heading">
                  <div>
                    <span className="falowen-schedule-eyebrow">CHOOSE YOUR CLASS</span>
                    <h2 id="falowen-classes-title">Class dates and full calendars</h2>
                    <p>View the class brochure or open its detailed dated schedule when one is published.</p>
                  </div>
                </div>
                <div className="falowen-schedule-class-grid">
                  {liveClasses.map((course) => {
                    const calendarUrl = verifiedCalendarUrl(course.scheduleUrl);
                    return (
                      <article className="falowen-schedule-class" key={course.id || course.slug || course.title}>
                        <div className="falowen-schedule-class-top">
                          <span className="falowen-schedule-level">{course.level}</span>
                          <span className="falowen-schedule-class-mode">Live class</span>
                        </div>
                        <h3>{course.title}</h3>
                        <p className="falowen-schedule-start">Starts {displayDate(course.startDate)}</p>
                        <div className="falowen-schedule-meetings">
                          {(course.meetingDays || []).length ? course.meetingDays.map((slot, index) => (
                            <div key={`${slot.day}-${slot.startTime}-${index}`}>
                              <strong>{normalizedDay(slot.day) || slot.day}</strong>
                              <span>{displayTime(slot.startTime, slot.endTime)}</span>
                            </div>
                          )) : <span>Meeting times to be announced</span>}
                        </div>
                        <div className="falowen-schedule-actions">
                          <a href={brochureUrl(course)} className="falowen-schedule-action-main">View class details →</a>
                          {calendarUrl ? (
                            <a href={calendarUrl} className="falowen-schedule-action-calendar"
                              target="_blank" rel="noopener noreferrer">🗓 View detailed calendar ↗</a>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {selfLearning.length ? (
              <section className="falowen-schedule-self-learning">
                <div>
                  <h2>Prefer learning at your own pace?</h2>
                  <p>Self-learning courses do not follow the live weekly calendar. You can get started when you're ready.</p>
                </div>
                <a href="/classes/">Explore self-learning →</a>
              </section>
            ) : null}
          </>
        )}
        <footer className="falowen-schedule-footer">
          <a href="/classes/">View all available classes</a>
          <a href="/placement-test">Take the free placement test</a>
        </footer>
      </div>
    </main>
  );
}
