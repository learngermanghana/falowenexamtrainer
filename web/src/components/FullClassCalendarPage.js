import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import "./FullClassCalendarPage.css";
import { groupTimetableSessionsByMonth, selectFeaturedTimetableSession } from "../utils/fullClassTimetableView";
import { styles } from "../styles";
import { classCatalog } from "../data/classCatalog";
import { courseSchedulesByName } from "../data/courseSchedules";
import { subscribeCanonicalLiveClass } from "../services/canonicalLiveClassService";
import {
  GHANA_TIMEZONE,
  asLiveClassDate,
  liveClassAssignmentLabel,
  liveClassCleanTitle,
  liveClassLessonLabel,
  liveClassLessonLink,
  liveClassLevel,
  liveClassSessionStatus,
} from "../utils/liveClassCardPresentation";

const INACTIVE_SESSION_STATUSES = new Set(["cancelled", "superseded", "deleted"]);

const parseDate = (value) => {
  const canonical = asLiveClassDate(value);
  if (canonical) return canonical;
  const raw = String(value || "").trim();
  if (!raw) return null;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(raw)
    ? new Date(`${raw}T00:00:00`)
    : new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value, locale = "en") => {
  const date = parseDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale, {
    timeZone: GHANA_TIMEZONE,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatTime = (value, locale = "en") => {
  const date = parseDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale, {
    timeZone: GHANA_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const sessionTimestamp = (session = {}) => asLiveClassDate(session.startsAt)?.getTime() || 0;

const isActiveSessionRecord = (session = {}) => {
  const status = String(session.status || session.sessionStatus || "scheduled").trim().toLowerCase();
  return !INACTIVE_SESSION_STATUSES.has(status) && session.superseded !== true && session.isSuperseded !== true;
};

const formatSpotlightDate = value => {
  const date = asLiveClassDate(value);
  if (!date) return "DATE TO BE CONFIRMED";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: GHANA_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date).toUpperCase();
};

const statusTone = status => {
  if (status === "Live now" || status === "Today") return "current";
  if (status === "Completed") return "completed";
  if (status === "Awaiting completion") return "pending";
  return "upcoming";
};

const FullClassCalendarPage = () => {
  const { className: encodedClassName = "" } = useParams();
  const [searchParams] = useSearchParams();
  const className = useMemo(() => {
    try {
      return decodeURIComponent(encodedClassName);
    } catch (error) {
      return encodedClassName;
    }
  }, [encodedClassName]);
  const classId = String(searchParams.get("classId") || "").trim();
  const classIdentity = classId || className;

  const [now, setNow] = useState(() => new Date());
  const [resolution, setResolution] = useState(() => ({
    identity: classIdentity,
    summary: null,
    status: classIdentity ? "loading" : "idle",
  }));

  useEffect(() => {
    if (!classIdentity) {
      setResolution({ identity: "", summary: null, status: "idle" });
      return undefined;
    }

    setResolution({ identity: classIdentity, summary: null, status: "loading" });
    return subscribeCanonicalLiveClass({
      classId,
      className,
      onChange: (summary) => {
        setResolution({ identity: classIdentity, summary, status: "ready" });
      },
      onUnavailable: () => {
        setResolution({ identity: classIdentity, summary: null, status: "unavailable" });
      },
      onError: (error) => {
        console.warn("Full class timetable could not refresh canonical class data", error);
        setResolution((current) => ({
          identity: classIdentity,
          summary: current.identity === classIdentity ? current.summary : null,
          status: "error",
        }));
      },
    });
  }, [classId, classIdentity, className]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const currentResolution = resolution.identity === classIdentity
    ? resolution
    : { identity: classIdentity, summary: null, status: "loading" };
  const summary = currentResolution.summary;
  const canonicalSessions = useMemo(
    () => [...(summary?.sessions || [])]
      .filter(isActiveSessionRecord)
      .sort((left, right) => sessionTimestamp(left) - sessionTimestamp(right)),
    [summary],
  );
  const resolvedClassName = summary?.klass?.name || summary?.klass?.className || className;
  const level = liveClassLevel(summary, canonicalSessions[0] || {});
  const firstSession = canonicalSessions[0] || null;
  const lastSession = canonicalSessions[canonicalSessions.length - 1] || null;
  const featured = selectFeaturedTimetableSession(canonicalSessions, now);
  const featuredSession = featured?.session || null;
  const featuredStatus = featuredSession ? liveClassSessionStatus(featuredSession, now) : "";
  const featuredLabel = featured?.isLatest
    ? "LATEST CLASS"
    : featuredStatus === "Live now"
      ? "LIVE NOW"
      : featuredStatus === "Today"
        ? "TODAY"
        : "NEXT CLASS";
  const groupedSessions = useMemo(() => groupTimetableSessionsByMonth(canonicalSessions), [canonicalSessions]);
  const timeRanges = [...new Set(canonicalSessions.map(session =>
    formatTime(session.startsAt) + "–" + formatTime(session.endsAt)
  ))];
  const overviewTime = timeRanges.length === 1
    ? timeRanges[0] + " Ghana time"
    : "Session times vary · Ghana time";
  const useStaticFallback = !summary && ["unavailable", "error"].includes(currentResolution.status);
  const classMeta = useStaticFallback ? classCatalog[className] || null : null;
  const fallbackSchedule = useStaticFallback ? courseSchedulesByName[className] || null : null;

  return (
    <div className="fct-page">
      <header className="fct-heading">
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <div className="fct-heading__title-row">
          <h1>Full class timetable</h1>
          {summary ? (
            <span className="fct-live-badge"><span aria-hidden="true" />Live timetable</span>
          ) : currentResolution.status === "loading" ? (
            <span className="fct-state-badge">Checking latest timetable…</span>
          ) : useStaticFallback ? (
            <span className="fct-state-badge fct-state-badge--offline">Offline timetable fallback</span>
          ) : null}
        </div>
        <p>Your learning journey, one class at a time.</p>
      </header>

      {summary ? (
        <div className="fct-summary-grid">
          {featuredSession ? (
            <section className="fct-feature" aria-label="Featured class session">
              <div className="fct-feature__eyebrow">
                <span>{featuredLabel} · {formatSpotlightDate(featuredSession.startsAt)}</span>
                <span className="fct-feature__day">{liveClassLessonLabel(featuredSession, level)}</span>
              </div>
              <h2>{liveClassCleanTitle(featuredSession)}</h2>
              <p>{formatTime(featuredSession.startsAt)}–{formatTime(featuredSession.endsAt)} Ghana time
                {liveClassAssignmentLabel(featuredSession) ? " · " + liveClassAssignmentLabel(featuredSession) : ""}
              </p>
              <a className="fct-feature__action" href={liveClassLessonLink(summary, featuredSession)}>
                Open lesson <span aria-hidden="true">→</span>
              </a>
            </section>
          ) : (
            <section className="fct-feature fct-feature--empty">
              <span className="fct-feature__eyebrow">YOUR CLASS</span>
              <h2>No current lessons scheduled</h2>
              <p>New lesson dates will appear here when they are published.</p>
            </section>
          )}

          <section className="fct-overview" aria-label="Class overview">
            <div className="fct-overview__name">
              <h2>{resolvedClassName || "Your class"}</h2>
              {level ? <span className="fct-overview__level">{level}</span> : null}
            </div>
            <span className="fct-overview__eyebrow">CLASS OVERVIEW</span>
            <p className="fct-overview__dates">
              {firstSession ? formatDate(firstSession.startsAt) : formatDate(summary?.klass?.startDate)}
              {" → "}
              {lastSession ? formatDate(lastSession.endsAt || lastSession.startsAt) : formatDate(summary?.klass?.endDate)}
            </p>
            <div className="fct-overview__meta">
              <strong>{canonicalSessions.length} current session{canonicalSessions.length === 1 ? "" : "s"}</strong>
              <span>{canonicalSessions.length ? overviewTime : "No published session times"}</span>
            </div>
          </section>
        </div>
      ) : null}

      {summary && canonicalSessions.length ? (
        <section className="fct-plan" aria-label="Class session plan">
          <div className="fct-plan__heading">
            <div className="fct-plan__title">
              <h2>Session plan</h2>
              <span>{canonicalSessions.length} session{canonicalSessions.length === 1 ? "" : "s"}</span>
            </div>
            <p>All times in Ghana time (GMT)</p>
          </div>
          <p className="fct-plan__description">
            This timetable uses current class-session records, including rescheduled sessions.
          </p>
          <div className="fct-plan__table-wrap" role="region" aria-label="Scrollable session timetable" tabIndex={0}>
            <table className="fct-table">
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Date &amp; time</th>
                  <th scope="col">Lesson</th>
                  <th scope="col">Status</th>
                  <th scope="col"><span className="fct-visually-hidden">Lesson link</span></th>
                </tr>
              </thead>
              {groupedSessions.map(group => (
                <tbody key={group.month}>
                  <tr className="fct-table__month">
                    <th scope="rowgroup" colSpan={5}>{group.month}</th>
                  </tr>
                  {group.sessions.map((session, index) => {
                    const status = liveClassSessionStatus(session, now);
                    const assignment = liveClassAssignmentLabel(session);
                    const label = liveClassLessonLabel(session, level);
                    const highlighted = featuredSession === session && !featured?.isLatest;
                    return (
                      <tr className={"fct-table__session" + (highlighted ? " fct-table__session--featured" : "")}
                          key={session.id || String(sessionTimestamp(session)) + "-" + index}>
                        <td className="fct-table__day">{label}</td>
                        <td className="fct-table__date">
                          <strong>{formatDate(session.startsAt)}</strong>
                          <small>{formatTime(session.startsAt)}–{formatTime(session.endsAt)} Ghana time</small>
                        </td>
                        <td className="fct-table__lesson">
                          <strong>{liveClassCleanTitle(session)}</strong>
                          {assignment ? <small>{assignment}</small> : null}
                        </td>
                        <td><span className={"fct-table__status fct-table__status--" + statusTone(status)}>
                          {status === "Today" || status === "Live now" ? <span className="fct-table__status-dot" aria-hidden="true" /> : null}
                          {status}
                        </span></td>
                        <td className="fct-table__action-cell">
                          <a href={liveClassLessonLink(summary, session)}>Open lesson <span aria-hidden="true">→</span></a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              ))}
            </table>
          </div>
        </section>
      ) : summary ? (
        <section className="fct-empty" role="status">
          No current sessions were found for this class.
        </section>
      ) : currentResolution.status === "loading" ? (
        <section className="fct-empty" role="status">
          <strong>Loading current sessions…</strong>
          <p>The old generated timetable is not shown while the current class record is loading.</p>
        </section>
      ) : null}

      {useStaticFallback && classMeta ? (
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Class overview</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {formatDate(classMeta.startDate)} → {formatDate(classMeta.endDate)}
          </p>
          <div style={{ display: "grid", gap: 6 }}>
            {(classMeta.schedule || []).map((slot) => (
              <div key={`${slot.day}-${slot.startTime}`} style={{ display: "flex", gap: 8 }}>
                <strong>{slot.day}</strong>
                <span>{slot.startTime} - {slot.endTime}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {useStaticFallback && fallbackSchedule?.days?.length ? (
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Saved session plan</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {fallbackSchedule.days.map((day) => (
              <div key={`${day.dayNumber}-${day.date}`} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 10 }}>
                <div style={{ fontWeight: 700 }}>
                  Day {day.dayNumber} · {formatDate(day.date)}
                </div>
                <div style={{ marginTop: 4, color: "#334155", fontSize: 14 }}>
                  {(day.sessions || []).map((session) => session.title || session.chapter || session.type).filter(Boolean).join(" • ") || "Session details coming soon"}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : useStaticFallback && !classMeta ? (
        <section style={styles.card}>
          <p style={{ margin: 0 }}>No timetable data was found for this class.</p>
        </section>
      ) : null}
    </div>
  );
};

export default FullClassCalendarPage;
