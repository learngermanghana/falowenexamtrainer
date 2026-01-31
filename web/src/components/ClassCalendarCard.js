import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { classCatalog, ZOOM_DETAILS } from "../data/classCatalog";
import {
  downloadClassCalendar,
  buildGhanaDateTime,
  GHANA_TIMEZONE,
  findTodayClassSession,
  findNextClassSession,
  formatScheduleSummary,
} from "../services/classCalendar";
import { loadPreferredClass, savePreferredClass } from "../services/classSelectionStorage";
import { formatPercent } from "../lib/formatters";

const ClassCalendarCard = ({ id, initialClassName }) => {
  const { i18n, t } = useTranslation();
  const locale = i18n.language;
  const catalogEntries = useMemo(() => Object.keys(classCatalog), []);
  const selectId = useMemo(() => (id ? `${id}-class-select` : "class-calendar-select"), [id]);
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [locale]
  );
  const formatTimeUnit = useCallback(
    (unit, count) => t(`common.${unit}`, { count, formattedCount: numberFormatter.format(count) }),
    [numberFormatter, t]
  );
  const defaultClass = useMemo(() => {
    if (initialClassName && catalogEntries.includes(initialClassName)) {
      return initialClassName;
    }
    const stored = loadPreferredClass();
    if (stored && catalogEntries.includes(stored)) return stored;
    return catalogEntries[0];
  }, [catalogEntries, initialClassName]);

  const [selectedClass, setSelectedClass] = useState(defaultClass);
  const [now, setNow] = useState(new Date());

  const classDetails = classCatalog[selectedClass];
  const nextClass = useMemo(
    () => findNextClassSession(selectedClass, now),
    [now, selectedClass]
  );
  const todayClass = useMemo(
    () => findTodayClassSession(selectedClass, now),
    [now, selectedClass]
  );
  const timeline = useMemo(() => {
    if (!classDetails?.startDate || !classDetails?.endDate) return null;

    const start = new Date(`${classDetails.startDate}T00:00:00`);
    const end = new Date(`${classDetails.endDate}T23:59:59`);
    const nowTime = now.getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    const totalDuration = Math.max(end - start, dayMs);
    const elapsed = Math.min(Math.max(nowTime - start, 0), totalDuration);

    const percentComplete = Math.round((elapsed / totalDuration) * 100);
    const daysUntilStart = Math.max(0, Math.ceil((start - nowTime) / dayMs));
    const daysUntilEnd = Math.max(0, Math.ceil((end - nowTime) / dayMs));

    let status;
    if (nowTime < start) {
      status = t("classCalendar.status.startsIn", { time: formatTimeUnit("day", daysUntilStart) });
    } else if (nowTime > end) {
      status = t("classCalendar.status.courseFinished");
    } else {
      status = t("classCalendar.status.timeLeft", { time: formatTimeUnit("day", daysUntilEnd) });
    }

    return { percentComplete, daysUntilStart, daysUntilEnd, status };
  }, [classDetails?.endDate, classDetails?.startDate, formatTimeUnit, now, t]);
  const minutesUntil = useMemo(() => {
    if (!nextClass?.startDateTime) return null;
    return Math.max(0, Math.round((nextClass.startDateTime - now) / 60000));
  }, [nextClass?.startDateTime, now]);
  const joinWindowMinutes = 15;
  const canJoinNextClass = minutesUntil !== null && minutesUntil <= joinWindowMinutes;
  const showCalendarCta = minutesUntil !== null && minutesUntil > joinWindowMinutes;

  const timeUntilDisplay = useMemo(() => {
    if (minutesUntil === null) return null;

    const minutesInDay = 24 * 60;
    if (minutesUntil === 0) {
      return { badge: t("classCalendar.badge.startingNow"), detail: t("classCalendar.detail.startingNow") };
    }

    if (minutesUntil >= minutesInDay) {
      const daysUntil = Math.ceil(minutesUntil / minutesInDay);
      const timeLabel = formatTimeUnit("day", daysUntil);
      return {
        badge: t("classCalendar.badge.timeLeft", { time: timeLabel }),
        detail: t("classCalendar.detail.startsIn", { time: timeLabel }),
      };
    }

    const timeLabel = formatTimeUnit("minute", minutesUntil);
    return {
      badge: t("classCalendar.badge.timeLeft", { time: timeLabel }),
      detail: t("classCalendar.detail.startsIn", { time: timeLabel }),
    };
  }, [formatTimeUnit, minutesUntil, t]);

  const nextClassTimes = useMemo(() => {
    if (!nextClass?.date || !nextClass?.startTime) return null;
    const start = buildGhanaDateTime(nextClass.date, nextClass.startTime);
    const end = nextClass.endTime ? buildGhanaDateTime(nextClass.date, nextClass.endTime) : null;
    if (!start) return null;

    const ghanaFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: GHANA_TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
    });
    const localFormatter = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });

    const ghanaRange = `${ghanaFormatter.format(start)}${end ? `–${ghanaFormatter.format(end)}` : ""}`;
    const localRange = `${localFormatter.format(start)}${end ? `–${localFormatter.format(end)}` : ""}`;

    return { ghanaRange, localRange };
  }, [locale, nextClass?.date, nextClass?.endTime, nextClass?.startTime]);
  const isNextClassToday = Boolean(todayClass && nextClass && todayClass.date === nextClass.date);
  const shouldShowNextClass = Boolean(nextClass && !isNextClassToday);

  useEffect(() => {
    setSelectedClass(defaultClass);
  }, [defaultClass]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedClass(value);
    savePreferredClass(value);
  };

  if (!classDetails) return null;

  const formatDateLabel = (value) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : dateFormatter.format(parsed);
  };

  return (
    <div id={id} style={{ ...styles.card, display: "grid", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Live class access</h2>
        <span style={styles.badge}>Zoom ready</span>
      </div>
      <p style={{ ...styles.helperText, marginBottom: 0 }}>
        Choose your cohort to get the official Zoom link, docs, and a downloadable calendar. The ICS file works on
        iPhone, Android (import into Google Calendar), and desktop calendars.
      </p>

      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div style={{ ...styles.field, margin: 0 }}>
          <label style={styles.label} htmlFor={selectId}>
            Your class
          </label>
          <select id={selectId} style={styles.select} value={selectedClass} onChange={handleChange}>
            {catalogEntries.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
            {formatScheduleSummary(classDetails.schedule)}
          </p>
        </div>

        <div style={{ ...styles.field, margin: 0 }}>
          <span style={styles.label}>Zoom meeting</span>
          <a href={ZOOM_DETAILS.url} style={{ color: "#2563eb", fontWeight: 700 }} target="_blank" rel="noreferrer">
            Join Zoom Meeting
          </a>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
            Meeting ID: {ZOOM_DETAILS.meetingId} · Passcode: {ZOOM_DETAILS.passcode}
          </p>
        </div>

        <div style={{ ...styles.field, margin: 0 }}>
          <span style={styles.label}>Course docs</span>
          <a href={classDetails.docUrl} style={{ color: "#2563eb", fontWeight: 700 }} target="_blank" rel="noreferrer">
            Open class materials
          </a>
          <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#111827", textTransform: "uppercase" }}>
              Class dates
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#e0f2fe",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: 14,
                boxShadow: "inset 0 0 0 1px #bae6fd",
                width: "fit-content",
              }}
            >
              {formatDateLabel(classDetails.startDate)} → {formatDateLabel(classDetails.endDate)}
            </span>
          </div>
        </div>

        {timeline ? (
          <div style={{ ...styles.field, margin: 0 }}>
            <span style={styles.label}>Timeline</span>
            <div style={{ ...styles.card, background: "#f3f4f6", margin: 0, gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>{timeline.status}</span>
                <span style={styles.badge}>
                  {t("classCalendar.percentDone", {
                    percent: formatPercent(timeline.percentComplete / 100, { locale }),
                  })}
                </span>
              </div>
              <div style={{ position: "relative", height: 10, background: "#e5e7eb", borderRadius: 999 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${timeline.percentComplete}%`,
                    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                    borderRadius: 999,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p style={{ ...styles.helperText, margin: 0 }}>
                {timeline.daysUntilStart > 0
                  ? t("classCalendar.timeline.untilKickoff", {
                      time: formatTimeUnit("day", timeline.daysUntilStart),
                    })
                  : timeline.daysUntilEnd > 0
                  ? t("classCalendar.timeline.untilGraduation", {
                      time: formatTimeUnit("day", timeline.daysUntilEnd),
                    })
                  : t("classCalendar.timeline.finished")}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {todayClass ? (
        <div style={{ ...styles.card, background: "#f8fafc", margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Today&apos;s lesson</h3>
            <span style={styles.badge}>Today</span>
          </div>
          <p style={{ ...styles.helperText, margin: "6px 0" }}>
            {todayClass.weekday}, {formatDateLabel(todayClass.date)} · {todayClass.startTime}–{todayClass.endTime}
          </p>
          <p style={{ ...styles.helperText, margin: "0 0 6px 0" }}>
            Chapters: {todayClass.titles?.join("; ")}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href={ZOOM_DETAILS.url}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.primaryButton, textDecoration: "none", textAlign: "center" }}
            >
              Join now
            </a>
            <span style={{ ...styles.helperText, margin: 0 }}>Session in progress today.</span>
          </div>
        </div>
      ) : null}

      {shouldShowNextClass ? (
        <div style={{ ...styles.card, background: "#f9fafb", margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Next live class</h3>
            {timeUntilDisplay?.badge ? <span style={styles.badge}>{timeUntilDisplay.badge}</span> : null}
          </div>
          <p style={{ ...styles.helperText, margin: "6px 0" }}>
            {nextClass.weekday}, {formatDateLabel(nextClass.date)} ·{" "}
            {nextClassTimes?.ghanaRange || `${nextClass.startTime}–${nextClass.endTime}`}{" "}
            (GMT, Ghana)
          </p>
          {nextClassTimes?.localRange ? (
            <p style={{ ...styles.helperText, margin: "0 0 6px 0" }}>Your local time: {nextClassTimes.localRange}</p>
          ) : null}
          <p style={{ ...styles.helperText, margin: "0 0 6px 0" }}>
            Chapters: {nextClass.titles?.join("; ")}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {canJoinNextClass ? (
              <a
                href={ZOOM_DETAILS.url}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.primaryButton, textDecoration: "none", textAlign: "center" }}
              >
                Join now
              </a>
            ) : null}
            {showCalendarCta ? (
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => downloadClassCalendar(selectedClass)}
              >
                Add to calendar
              </button>
            ) : null}
            {timeUntilDisplay?.detail ? (
              <span style={{ ...styles.helperText, margin: 0 }}>{timeUntilDisplay.detail}</span>
            ) : null}
          </div>
        </div>
      ) : null}

      {!nextClass ? (
        <div style={{ ...styles.helperText, margin: 0 }}>
          No upcoming sessions found for this class. Choose a different class to refresh the schedule.
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button style={styles.primaryButton} type="button" onClick={() => downloadClassCalendar(selectedClass)}>
          Download calendar (.ics)
        </button>
        <span style={{ ...styles.helperText, margin: 0 }}>
          Adds sessions from the published class schedule to your calendar with the Zoom link prefilled. Holiday breaks
          or cancellations may not be reflected. Android/desktop users can import the ICS file into Google Calendar.
        </span>
      </div>
    </div>
  );
};

export default ClassCalendarCard;
