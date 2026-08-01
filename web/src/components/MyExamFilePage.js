import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { useExam } from "../context/ExamContext";
import { useGoetheExamConfig } from "../hooks/useGoetheExamConfig";
import { toDate } from "../lib/dateUtils";
import { formatCurrency } from "../lib/formatters";

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
  const { studentProfile } = useAuth();
  const { level, levelConfirmed } = useExam();
  const { i18n, t } = useTranslation();
  const locale = i18n.language;
  const formatMoney = useCallback((value) => formatCurrency(value, { locale }), [locale]);
  const {
    config: goetheExamConfig,
    loading: examScheduleLoading,
    source: examScheduleSource,
  } = useGoetheExamConfig();
  const goetheExamLevels = goetheExamConfig.levels;

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
    ? "Updating Goethe schedule…"
    : examScheduleSource === "admin"
      ? "Schedule synced from Falowen Admin."
      : examScheduleSource === "cache"
        ? "Showing the last saved schedule while checking for updates."
        : "Showing the current built-in schedule.";

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...styles.card, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ ...styles.helperText, margin: 0 }}>Goethe exam registration</p>
            <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Register in two steps</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Create your Goethe account first. On the registration date, open the official registration page and book immediately.
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
              Set up the account before booking opens and keep your login details ready.
            </div>
            <a href={GOETHE_ACCOUNT_URL} target="_blank" rel="noreferrer" style={primaryLinkStyle}>
              Create or open Goethe account →
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
        </div>
      </section>

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
