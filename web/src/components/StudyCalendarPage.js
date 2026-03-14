import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { goetheExamLevels } from "../data/goetheExamSchedule";
import { downloadStudyCalendar } from "../services/examCalendar";
import { updatePageMeta } from "../lib/pageMeta";
import { useExam } from "../context/ExamContext";

const DAYS_OF_WEEK = [
  { key: "mon", value: 1 },
  { key: "tue", value: 2 },
  { key: "wed", value: 3 },
  { key: "thu", value: 4 },
  { key: "fri", value: 5 },
  { key: "sat", value: 6 },
  { key: "sun", value: 0 },
];

const formatInputDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const shiftDate = (value, days) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + days);
  return formatInputDate(date);
};

const DOWNLOAD_STORAGE_KEY = "falowen_study_calendar_downloaded";
const DOWNLOAD_COUNT_STORAGE_KEY = "falowen_study_calendar_download_count";

const StudyCalendarPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { level: selectedLevel, setLevel: setSelectedLevel } = useExam();
  const [examDate, setExamDate] = useState("");
  const [startDate, setStartDate] = useState(formatInputDate(new Date()));
  const [endDate, setEndDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("18:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [reminderMinutes, setReminderMinutes] = useState(1440);
  const [activeDays, setActiveDays] = useState([1, 2, 3, 4, 5]);
  const [hasDownloaded, setHasDownloaded] = useState(() => {
    try {
      return localStorage.getItem(DOWNLOAD_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const autoDownloadTriggered = useRef(false);
  const numberFormatter = useMemo(() => new Intl.NumberFormat(i18n.language), [i18n.language]);
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [i18n.language]
  );

  const levelInfo = useMemo(
    () => goetheExamLevels.find((level) => level.level === selectedLevel) || goetheExamLevels[0],
    [selectedLevel]
  );

  const forceDownload = useMemo(() => {
    if (location.state?.forceDownload) return true;
    const params = new URLSearchParams(location.search);
    return params.get("force") === "1";
  }, [location.search, location.state]);

  const examDates = useMemo(() => levelInfo?.exams || [], [levelInfo]);

  useEffect(() => {
    updatePageMeta({
      title: t("studyCalendar.meta.title"),
      description: t("studyCalendar.meta.description"),
      lang: i18n.language,
    });
  }, [i18n.language, t]);

  useEffect(() => {
    if (examDates.length > 0) {
      setExamDate(examDates[0].date);
    } else {
      setExamDate("");
    }
  }, [examDates]);

  useEffect(() => {
    if (!examDate) {
      setEndDate("");
      return;
    }
    setEndDate(shiftDate(examDate, -1));
  }, [examDate]);

  const toggleDay = (value) => {
    setActiveDays((prev) =>
      prev.includes(value) ? prev.filter((day) => day !== value) : [...prev, value]
    );
  };

  const formatDisplayDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return dateFormatter.format(date);
  };

  const formatTimeUnit = (unit, count) =>
    t(`common.${unit}`, { count, formattedCount: numberFormatter.format(count) });

  const isFormReady = Boolean(selectedLevel && startDate && endDate && activeDays.length > 0);
  const sessionsPerWeek = activeDays.length;
  const recommendedTab = useMemo(() => {
    if (sessionsPerWeek >= 4 || durationMinutes >= 60) {
      return { key: "writing", label: "Writing practice" };
    }
    return { key: "speaking", label: "Speaking warm-up" };
  }, [durationMinutes, sessionsPerWeek]);

  const handleDownload = useCallback(() => {
    if (!isFormReady) return false;
    downloadStudyCalendar({
      level: selectedLevel,
      startDate,
      endDate,
      daysOfWeek: activeDays,
      timeOfDay,
      durationMinutes: Number(durationMinutes),
      reminderMinutes: Number(reminderMinutes),
    });
    try {
      localStorage.setItem(DOWNLOAD_STORAGE_KEY, "true");
      const count = Number(localStorage.getItem(DOWNLOAD_COUNT_STORAGE_KEY) || 0);
      const nextCount = Number.isNaN(count) ? 1 : count + 1;
      localStorage.setItem(DOWNLOAD_COUNT_STORAGE_KEY, String(nextCount));
    } catch {
      // ignore storage failures
    }
    setHasDownloaded(true);
    return true;
  }, [
    activeDays,
    durationMinutes,
    endDate,
    isFormReady,
    reminderMinutes,
    selectedLevel,
    startDate,
    timeOfDay,
  ]);

  useEffect(() => {
    if (!forceDownload || !isFormReady || autoDownloadTriggered.current) return;
    autoDownloadTriggered.current = true;
    handleDownload();
  }, [forceDownload, handleDownload, isFormReady]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <p style={{ ...styles.helperText, margin: 0 }}>{t("studyCalendar.hero.kicker")}</p>
        <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>{t("studyCalendar.hero.title")}</h2>
        <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>{t("studyCalendar.hero.subtitle")}</p>
      </section>

      {forceDownload ? (
        <section style={{ ...styles.card, border: "1px solid #fdba74", background: "#fff7ed" }}>
          <h3 style={{ ...styles.sectionTitle, margin: "0 0 6px 0" }}>{t("studyCalendar.required.title")}</h3>
          <p style={{ ...styles.helperText, margin: 0 }}>{t("studyCalendar.required.subtitle")}</p>
        </section>
      ) : null}

      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label style={styles.helperText} htmlFor="study-calendar-exam-level">
            {t("studyCalendar.form.examLevel")}
          </label>
          <select
            id="study-calendar-exam-level"
            value={selectedLevel}
            onChange={(event) => setSelectedLevel(event.target.value)}
            style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
          >
            {goetheExamLevels.map((level) => (
              <option key={level.level} value={level.level}>
                {level.level} · {level.title}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={styles.helperText} htmlFor="study-calendar-exam-date">
            {t("studyCalendar.form.examDate")}
          </label>
          {examDates.length > 0 ? (
            <select
              id="study-calendar-exam-date"
              value={examDate}
              onChange={(event) => setExamDate(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            >
              {examDates.map((exam) => (
                <option key={`${selectedLevel}-${exam.date}`} value={exam.date}>
                  {formatDisplayDate(exam.date)} · {levelInfo.location}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="study-calendar-exam-date"
              type="date"
              value={examDate}
              onChange={(event) => setExamDate(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            />
          )}
          <p style={{ ...styles.helperText, margin: 0 }}>
            {t("studyCalendar.form.examDateHelp")}
          </p>
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.helperText} htmlFor="study-calendar-start-date">
              {t("studyCalendar.form.startDate")}
            </label>
            <input
              id="study-calendar-start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            />
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.helperText} htmlFor="study-calendar-end-date">
              {t("studyCalendar.form.endDate")}
            </label>
            <input
              id="study-calendar-end-date"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={styles.helperText}>{t("studyCalendar.form.studyDays")}</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.key}
                type="button"
                onClick={() => toggleDay(day.value)}
                aria-pressed={activeDays.includes(day.value)}
                aria-label={t("studyCalendar.form.studyDayLabel", { day: t(`studyCalendar.days.${day.key}`) })}
                style={activeDays.includes(day.value) ? styles.navButtonActive : styles.navButton}
              >
                {t(`studyCalendar.days.${day.key}`)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.helperText} htmlFor="study-calendar-time">
              {t("studyCalendar.form.studyTime")}
            </label>
            <input
              id="study-calendar-time"
              type="time"
              value={timeOfDay}
              onChange={(event) => setTimeOfDay(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            />
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.helperText} htmlFor="study-calendar-duration">
              {t("studyCalendar.form.sessionLength")}
            </label>
            <select
              id="study-calendar-duration"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            >
              {[30, 45, 60, 90].map((value) => (
                <option key={value} value={value}>
                  {formatTimeUnit("minute", value)}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.helperText} htmlFor="study-calendar-reminder">
              {t("studyCalendar.form.reminder")}
            </label>
            <select
              id="study-calendar-reminder"
              value={reminderMinutes}
              onChange={(event) => setReminderMinutes(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            >
              <option value={0}>{t("studyCalendar.reminder.none")}</option>
              <option value={60}>
                {t("studyCalendar.reminder.before", { time: formatTimeUnit("hour", 1) })}
              </option>
              <option value={180}>
                {t("studyCalendar.reminder.before", { time: formatTimeUnit("hour", 3) })}
              </option>
              <option value={720}>
                {t("studyCalendar.reminder.before", { time: formatTimeUnit("hour", 12) })}
              </option>
              <option value={1440}>
                {t("studyCalendar.reminder.before", { time: formatTimeUnit("day", 1) })}
              </option>
            </select>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 12,
            background: "#f9fafb",
            display: "grid",
            gap: 6,
          }}
        >
          <h4 style={{ margin: 0 }}>Preview schedule</h4>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {sessionsPerWeek} sessions per week · {formatTimeUnit("minute", Number(durationMinutes))} each ·{" "}
            {timeOfDay}
          </p>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Dates: {formatDisplayDate(startDate)} → {formatDisplayDate(endDate || examDate)}
          </p>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Exam level: {selectedLevel} · Reminder:{" "}
            {reminderMinutes === 0
              ? t("studyCalendar.reminder.none")
              : t("studyCalendar.reminder.before", {
                  time:
                    reminderMinutes >= 1440
                      ? formatTimeUnit("day", reminderMinutes / 1440)
                      : formatTimeUnit("hour", reminderMinutes / 60),
                })}
          </p>
        </div>

        <button type="button" style={styles.primaryButton} onClick={handleDownload} disabled={!isFormReady}>
          {forceDownload
            ? t("studyCalendar.cta.required")
            : t("studyCalendar.cta.standard")}
        </button>
        {!isFormReady ? (
          <p style={{ ...styles.helperText, margin: 0 }}>
            {t("studyCalendar.form.incomplete")}
          </p>
        ) : null}
      </section>

      {hasDownloaded ? (
        <section style={styles.card}>
          <h3 style={{ ...styles.sectionTitle, margin: "0 0 6px 0" }}>Next steps</h3>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Your calendar is ready. Jump into a recommended practice tab based on your schedule.
          </p>
          <button
            type="button"
            style={{ ...styles.primaryButton, marginTop: 10 }}
            onClick={() => navigate(`/exams/${recommendedTab.key}`)}
          >
            Go to {recommendedTab.label}
          </button>
        </section>
      ) : null}

      <section style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, margin: "0 0 6px 0" }}>{t("studyCalendar.reminder.title")}</h3>
        <ul style={{ ...styles.checklist, margin: 0 }}>
          {t("studyCalendar.reminder.items", { returnObjects: true }).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default StudyCalendarPage;
