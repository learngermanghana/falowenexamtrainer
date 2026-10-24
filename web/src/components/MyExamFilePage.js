import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { useExam } from "../context/ExamContext";
import { useGoetheExamConfig } from "../hooks/useGoetheExamConfig";
import { toDate } from "../lib/dateUtils";
import { formatCurrency } from "../lib/formatters";
import { goetheExamLevels as fallbackGoetheExamLevels } from "../data/goetheExamSchedule";
import { getGoetheExamFileGuide, GOETHE_EXAM_FILE_LEVELS } from "../data/goetheExamFileGuide";
import { getReadingPracticeHistory, getReadingPracticeStudentKey, getReadingReadinessLabel } from "../services/readingPracticeHistory";

const GOETHE_ACCOUNT_URL =
  "https://login.goethe.de/cas/login?service=https%3A%2F%2Fwww.goethe.de%2Fservices%2Fcas%2Fservice%2Fgoethe%2F&locale=de&renew=false";

const formatDate = (value) => {
  if (!value) return "Date pending";
  const parsed = toDate(value);
  return parsed
    ? parsed.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date pending";
};

const startOfScheduleDay = (value) => {
  const parsed = toDate(value);
  if (!parsed) return null;
  const date = new Date(parsed);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfScheduleDay = (value) => {
  const parsed = toDate(value);
  if (!parsed) return null;
  const date = new Date(parsed);
  date.setHours(23, 59, 59, 999);
  return date;
};

const formatElapsed = (seconds) => {
  if (!Number.isFinite(Number(seconds))) return "Time not recorded";
  const total = Math.max(0, Number(seconds));
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}m ${String(remainder).padStart(2, "0")}s`;
};

const isScheduleEntryCurrent = (exam, now) => {
  const registrationEnd = endOfScheduleDay(exam?.registrationEnd);
  if (registrationEnd) return now <= registrationEnd;

  const examEnd = endOfScheduleDay(exam?.date);
  return Boolean(examEnd && now <= examEnd);
};

const getRegistrationStatus = (registrationStart, registrationEnd, now) => {
  if (!registrationStart || !registrationEnd) return "Date pending";
  if (now < registrationStart) return "Upcoming";
  if (now > registrationEnd) return "Closed";
  return "Open";
};

const primaryLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "10px 14px",
  borderRadius: 10,
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 900,
  textDecoration: "none",
  textAlign: "center",
  boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
};

const compactLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 36,
  padding: "7px 11px",
  borderRadius: 9,
  border: "1px solid #bfdbfe",
  background: "#ffffff",
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 900,
  textDecoration: "none",
  textAlign: "center",
};

const statusStyles = {
  Open: { background: "#dcfce7", color: "#166534", borderColor: "#86efac" },
  Upcoming: { background: "#dbeafe", color: "#1d4ed8", borderColor: "#93c5fd" },
  Closed: { background: "#f3f4f6", color: "#6b7280", borderColor: "#e5e7eb" },
  "Date pending": { background: "#fef3c7", color: "#92400e", borderColor: "#fde68a" },
};

const StatusBadge = ({ status, registrationStart }) => {
  const label =
    status === "Open"
      ? "Open now"
      : status === "Upcoming"
        ? `Opens ${formatDate(registrationStart)}`
        : status;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 9px",
        borderRadius: 999,
        border: "1px solid",
        fontSize: 11,
        fontWeight: 900,
        whiteSpace: "nowrap",
        ...statusStyles[status],
      }}
    >
      {label}
    </span>
  );
};

const MyExamFilePage = () => {
  const { studentProfile, user } = useAuth();
  const { level, levelConfirmed } = useExam();
  const { i18n, t } = useTranslation();
  const locale = i18n.language;
  const formatMoney = useCallback((value) => formatCurrency(value, { locale }), [locale]);
  const {
    config: goetheExamConfig,
    loading: examScheduleLoading,
  } = useGoetheExamConfig();
  const goetheExamLevels = useMemo(() => {
    const merged = new Map(
      fallbackGoetheExamLevels.map((levelInfo) => [levelInfo.level, levelInfo])
    );
    (goetheExamConfig.levels || []).forEach((levelInfo) => {
      if (!levelInfo?.level) return;
      merged.set(levelInfo.level, { ...merged.get(levelInfo.level), ...levelInfo });
    });
    return GOETHE_EXAM_FILE_LEVELS.map((levelName) => merged.get(levelName)).filter(Boolean);
  }, [goetheExamConfig.levels]);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const className = useMemo(() => studentProfile?.className || "", [studentProfile]);
  const detectedLevel = useMemo(() => {
    const raw = levelConfirmed ? level : studentProfile?.level || level || "";
    return String(raw || "").toUpperCase();
  }, [level, levelConfirmed, studentProfile]);
  const [showAllLevels, setShowAllLevels] = useState(!detectedLevel);
  const readingStudentKey = useMemo(
    () => getReadingPracticeStudentKey({ studentProfile, user }),
    [studentProfile, user],
  );
  const readingHistory = useMemo(
    () => getReadingPracticeHistory(detectedLevel, readingStudentKey).slice(0, 8),
    [detectedLevel, readingStudentKey],
  );

  useEffect(() => {
    if (!detectedLevel) setShowAllLevels(true);
  }, [detectedLevel]);

  const visibleExamLevels = useMemo(() => {
    if (!detectedLevel || showAllLevels) {
      return goetheExamLevels;
    }

    const matchedLevels = goetheExamLevels.filter((levelInfo) => levelInfo.level === detectedLevel);
    return matchedLevels.length > 0 ? matchedLevels : goetheExamLevels;
  }, [detectedLevel, goetheExamLevels, showAllLevels]);

  const summaryLevel = useMemo(
    () => goetheExamLevels.find((levelInfo) => levelInfo.level === detectedLevel) || visibleExamLevels[0] || null,
    [detectedLevel, goetheExamLevels, visibleExamLevels]
  );
  const examGuide = useMemo(
    () => getGoetheExamFileGuide(summaryLevel?.level || detectedLevel),
    [detectedLevel, summaryLevel?.level]
  );

  const nextRegistration = useMemo(() => {
    const exams = (summaryLevel?.exams || [])
      .map((exam) => ({
        exam,
        registrationStart: startOfScheduleDay(exam.registrationStart),
        registrationEnd: endOfScheduleDay(exam.registrationEnd),
      }))
      .filter(({ exam }) => isScheduleEntryCurrent(exam, now))
      .sort((a, b) => {
        const aTime = a.registrationStart?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const bTime = b.registrationStart?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      });

    return exams[0] || null;
  }, [now, summaryLevel]);

  const nextRegistrationStatus = nextRegistration
    ? getRegistrationStatus(nextRegistration.registrationStart, nextRegistration.registrationEnd, now)
    : "Date pending";

  const scheduleStatus = examScheduleLoading
    ? "Checking the latest exam dates…"
    : "Check the details below before you register.";

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...styles.card, display: "grid", gap: 12 }} data-reading-practice-history="true">
        <div>
          <p style={{ ...styles.helperText, margin: 0 }}>Exams Room practice history</p>
          <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Lesen attempts</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Completed A1/A2 reading practice is saved here separately from course assignments and certificate results.
          </p>
        </div>

        {readingHistory.length ? (
          <div style={{ display: "grid", gap: 8 }}>
            {readingHistory.map((attempt) => (
              <article
                key={attempt.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 11,
                  padding: 12,
                  background: "#f9fafb",
                  display: "grid",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <div>
                    <strong>{attempt.level} Lesen · Practice Set {String(attempt.setId || "").endsWith("-01") ? "1" : attempt.setId}</strong>
                    <div style={{ ...styles.helperText, marginTop: 3 }}>
                      Attempt {attempt.attemptNumber} · {new Date(attempt.completedAt).toLocaleString()}
                    </div>
                  </div>
                  <span style={styles.badge}>
                    {attempt.score}/{attempt.total} · {attempt.percent}% · {getReadingReadinessLabel(attempt.percent)}
                  </span>
                </div>
                <div style={{ ...styles.helperText }}>
                  Time used: {formatElapsed(attempt.elapsedSeconds)}
                </div>
                {Array.isArray(attempt.sectionScores) && attempt.sectionScores.length ? (
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {attempt.sectionScores.map((section) => (
                      <span key={section.label} style={styles.badge}>
                        {section.label}: {section.score}/{section.total}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div style={{ ...styles.focusNotice, marginTop: 0 }}>
            No Lesen practice result saved yet for {detectedLevel || "your current level"}.
          </div>
        )}
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ ...styles.helperText, margin: 0 }}>Goethe exam hub</p>
            <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Registration and exam structure</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Keep your Goethe account, official registration page and a clear overview of the exam structure in one place.
            </p>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={styles.badge}>Level: {detectedLevel || summaryLevel?.level || "not set"}</span>
            {className ? <span style={styles.badge}>Class: {className}</span> : null}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
          <div style={{ border: "1px solid #dbeafe", borderRadius: 12, padding: 12, background: "#f8fbff", display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#1d4ed8" }}>STEP 1</div>
            <div style={{ fontWeight: 900, color: "#111827" }}>Create or open your Goethe account</div>
            <div style={{ fontSize: 13, lineHeight: 1.45, color: "#6b7280" }}>
              Set up the account before booking opens. If you are new, choose Create account on Goethe and keep your login details ready.
            </div>
            <a href={GOETHE_ACCOUNT_URL} target="_blank" rel="noreferrer" style={primaryLinkStyle}>
              Create / sign in to Goethe account →
            </a>
          </div>

          <div style={{ border: "1px solid #dbeafe", borderRadius: 12, padding: 12, background: "#f8fbff", display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#1d4ed8" }}>STEP 2</div>
            <div style={{ fontWeight: 900, color: "#111827" }}>Open the official registration page</div>
            <div style={{ fontSize: 13, lineHeight: 1.45, color: "#6b7280" }}>
              {nextRegistration
                ? nextRegistrationStatus === "Open"
                  ? `Registration is open now for the ${formatDate(nextRegistration.exam.date)} exam.`
                  : `Registration opens ${formatDate(nextRegistration.exam.registrationStart)} for the ${formatDate(nextRegistration.exam.date)} exam.`
                : "Open Goethe's page to check the latest registration availability."}
            </div>
            {summaryLevel?.registrationUrl ? (
              <a href={summaryLevel.registrationUrl} target="_blank" rel="noreferrer" style={primaryLinkStyle}>
                {nextRegistrationStatus === "Open"
                  ? `Register for ${summaryLevel.level} now →`
                  : `Open ${summaryLevel.level} registration page →`}
              </a>
            ) : (
              <div style={styles.errorBox}>The official registration link has not been added for this level yet.</div>
            )}
          </div>

          <div style={{ border: "1px solid #bbf7d0", borderRadius: 12, padding: 12, background: "#f0fdf4", display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#166534" }}>EXAM SAMPLE</div>
            <div style={{ fontWeight: 900, color: "#111827" }}>
              Goethe {examGuide?.level || summaryLevel?.level || detectedLevel || ""} exam sample
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.45, color: "#4b5563" }}>
              Open the Goethe sample for your level to see the task types and practise the exam format.
            </div>
            {examGuide?.sampleUrl ? (
              <a href={examGuide.sampleUrl} target="_blank" rel="noreferrer" style={{ ...primaryLinkStyle, background: "#15803d" }}>
                Open exam sample →
              </a>
            ) : (
              <div style={styles.errorBox}>The Goethe exam sample link has not been added for this level yet.</div>
            )}
          </div>
        </div>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 10 }} data-exam-file-registration-guide="true">
        <div>
          <h3 style={{ margin: 0, color: "#111827" }}>How to register</h3>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
            Do these steps before and on the advertised Goethe registration date.
          </p>
        </div>
        <ol style={{ margin: 0, paddingLeft: 22, color: "#374151", lineHeight: 1.7, fontSize: 13 }}>
          <li>Open the Goethe account link above. If you are new, use <strong>Create account</strong> and complete your profile before registration day.</li>
          <li>Keep your Goethe login details ready, then open the official registration page for your level.</li>
          <li>Goethe Ghana states that registration opens at <strong>7:00 AM German time</strong> on the advertised date. Open the page early and secure an available place before paying.</li>
          <li>Complete the booking and payment only after you have secured a place on Goethe's website.</li>
        </ol>
      </section>

      {examGuide ? (
        <section style={{ ...styles.card, display: "grid", gap: 10 }} data-exam-file-structure={examGuide.level}>
          <div>
            <h3 style={{ margin: 0, color: "#111827" }}>How the {examGuide.level} exam is structured</h3>
            <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{examGuide.structureNote}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 8 }}>
            {examGuide.sections.map((section) => (
              <div key={section.key} style={{ border: "1px solid #e5e7eb", borderRadius: 11, padding: 10, background: "#ffffff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                  <strong style={{ color: "#111827" }}>{section.name}</strong>
                  <span style={{ color: "#1d4ed8", fontWeight: 900, fontSize: 12 }}>{section.duration}</span>
                </div>
                <p style={{ ...styles.helperText, margin: "6px 0 0", fontSize: 12, lineHeight: 1.5 }}>
                  {section.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0, color: "#111827" }}>
              {showAllLevels || !detectedLevel ? "Goethe exam dates" : `${detectedLevel} exam dates`}
            </h3>
            <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
              The registration link is the same for every date. Use the button above when registration opens.
            </p>
          </div>
          {detectedLevel ? (
            <button
              type="button"
              style={{ ...styles.secondaryButton, padding: "7px 10px", fontSize: 12 }}
              onClick={() => setShowAllLevels((previous) => !previous)}
            >
              {showAllLevels ? "Show my level only" : "Show all levels"}
            </button>
          ) : null}
        </div>

        {visibleExamLevels.map((levelInfo) => {
          const isDetectedLevel = levelInfo.level === detectedLevel;
          const formattedPrice =
            typeof levelInfo.priceValue === "number" ? formatMoney(levelInfo.priceValue) : levelInfo.price;
          const formattedModulePrice =
            typeof levelInfo.modulePriceValue === "number"
              ? t("examFile.modulePrice", { price: formatMoney(levelInfo.modulePriceValue) })
              : levelInfo.modulePrice;
          const upcomingExams = (levelInfo.exams || [])
            .slice()
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .filter((exam) => isScheduleEntryCurrent(exam, now));
          const showLevelLink = !summaryLevel || levelInfo.level !== summaryLevel.level;

          return (
            <div
              key={levelInfo.level}
              style={{
                border: isDetectedLevel ? "2px solid #2563eb" : "1px solid #e5e7eb",
                borderRadius: 13,
                padding: 12,
                background: isDetectedLevel ? "#f8fbff" : "#ffffff",
                display: "grid",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 900, color: "#111827" }}>{levelInfo.level} · {levelInfo.title}</div>
                  <div style={{ marginTop: 3, fontSize: 12, color: "#6b7280" }}>
                    {levelInfo.location} · {formattedPrice}{formattedModulePrice ? ` · ${formattedModulePrice}` : ""}
                  </div>
                </div>
                {showLevelLink && levelInfo.registrationUrl ? (
                  <a href={levelInfo.registrationUrl} target="_blank" rel="noreferrer" style={compactLinkStyle}>
                    Open {levelInfo.level} registration page →
                  </a>
                ) : null}
              </div>

              {upcomingExams.length === 0 ? (
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  No future registration date is listed. Open the official registration page to check availability.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 7 }}>
                  {upcomingExams.map((exam, index) => {
                    const registrationStart = startOfScheduleDay(exam.registrationStart);
                    const registrationEnd = endOfScheduleDay(exam.registrationEnd);
                    const registrationStatus = getRegistrationStatus(registrationStart, registrationEnd, now);

                    return (
                      <div
                        key={`${levelInfo.level}-${exam.date}-${index}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "minmax(0, 1fr) auto",
                          alignItems: "center",
                          gap: 10,
                          borderTop: index === 0 ? "none" : "1px solid #e5e7eb",
                          paddingTop: index === 0 ? 0 : 8,
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 900, color: "#111827" }}>
                            Exam: {formatDate(exam.date)}
                          </div>
                          <div style={{ marginTop: 2, fontSize: 12, color: "#6b7280" }}>
                            Registration: {formatDate(exam.registrationStart)} · {levelInfo.location}
                          </div>
                        </div>
                        <StatusBadge status={registrationStatus} registrationStart={exam.registrationStart} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ fontSize: 12, lineHeight: 1.45, color: examScheduleLoading ? "#92400e" : "#6b7280" }}>
          {scheduleStatus} Confirm the final date, location, fee, and availability on Goethe's official page before payment.
        </div>
      </section>
    </div>
  );
};

export default MyExamFilePage;
