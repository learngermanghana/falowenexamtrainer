import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { useExam } from "../context/ExamContext";
import { downloadExamReminder } from "../services/examCalendar";
import { useGoetheExamConfig } from "../hooks/useGoetheExamConfig";
import { formatCurrency } from "../lib/formatters";
import {
  endOfScheduleDay,
  formatScheduleDate,
  scheduleDateKey,
  startOfScheduleDay,
} from "../lib/zonedScheduleDate";

const GOETHE_ACCOUNT_URL =
  "https://login.goethe.de/cas/login?service=https%3A%2F%2Fwww.goethe.de%2Fservices%2Fcas%2Fservice%2Fgoethe%2F&locale=de&renew=false";

const getCountdownLabel = (targetDate, now) => {
  if (!targetDate) return "Date not set";
  const diffMs = targetDate.getTime() - now.getTime();
  if (Number.isNaN(diffMs)) return "Date not set";
  if (diffMs <= 0) return "Exam day is here";

  const totalMinutes = Math.floor(diffMs / 1000 / 60);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return `${days}d ${hours}h ${minutes}m left`;
};

const getRegistrationStatus = (registrationStart, registrationEnd, now) => {
  if (!registrationStart || !registrationEnd) return "Date pending";
  if (now < registrationStart) return "Bookable";
  if (now > registrationEnd) return "Closed";
  return "Open";
};

const StatCard = ({ label, value, sub, icon }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 14,
      padding: 12,
      background: "#ffffff",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      display: "grid",
      gap: 6,
      minWidth: 0,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B7280", fontSize: 12, fontWeight: 800 }}>
      <span aria-hidden style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </div>
    <div style={{ fontSize: 16, fontWeight: 900, color: "#111827", overflow: "hidden", textOverflow: "ellipsis" }}>
      {value}
    </div>
    {sub ? <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.4 }}>{sub}</div> : null}
  </div>
);

const CollapsibleCard = ({ title, subtitle, right, defaultOpen, children }) => (
  <details open={defaultOpen} style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
    <summary
      style={{
        listStyle: "none",
        cursor: "pointer",
        padding: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        borderBottom: "1px solid #e5e7eb",
        userSelect: "none",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span aria-hidden style={{ color: "#6B7280" }}>▾</span>
          <div style={{ fontWeight: 900, color: "#111827" }}>{title}</div>
        </div>
        {subtitle ? <div style={{ marginLeft: 22, fontSize: 12, color: "#6B7280" }}>{subtitle}</div> : null}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>{right}</div>
    </summary>
    <div style={{ padding: 12 }}>{children}</div>
  </details>
);

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

const registrationBadgeStyles = {
  Open: { background: "#dcfce7", color: "#166534", borderColor: "#86efac" },
  Closed: { background: "#f3f4f6", color: "#6b7280", borderColor: "#e5e7eb" },
  Bookable: { background: "#dbeafe", color: "#1d4ed8", borderColor: "#93c5fd" },
  "Date pending": { background: "#fef3c7", color: "#92400e", borderColor: "#fde68a" },
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
  const scheduleTimeZone = goetheExamConfig.timezone || "Africa/Accra";
  const formatDate = useCallback(
    (value) => formatScheduleDate(value, { locale: "en-US", timeZone: scheduleTimeZone }),
    [scheduleTimeZone],
  );

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
    if (!detectedLevel || showAllLevels) return goetheExamLevels;
    const matchedLevels = goetheExamLevels.filter((levelInfo) => levelInfo.level === detectedLevel);
    return matchedLevels.length > 0 ? matchedLevels : goetheExamLevels;
  }, [detectedLevel, goetheExamLevels, showAllLevels]);

  const summaryLevel = useMemo(
    () => goetheExamLevels.find((levelInfo) => levelInfo.level === detectedLevel) || visibleExamLevels[0] || null,
    [detectedLevel, goetheExamLevels, visibleExamLevels],
  );

  const nextRegistration = useMemo(() => {
    const exams = (summaryLevel?.exams || [])
      .map((exam) => ({
        exam,
        registrationStart: startOfScheduleDay(exam.registrationStart, scheduleTimeZone),
        registrationEnd: endOfScheduleDay(exam.registrationEnd, scheduleTimeZone),
      }))
      .filter(({ registrationEnd }) => registrationEnd && now <= registrationEnd)
      .sort((a, b) => a.registrationStart.getTime() - b.registrationStart.getTime());
    return exams[0] || null;
  }, [now, scheduleTimeZone, summaryLevel]);

  const summaryRegistrationStatus = nextRegistration
    ? getRegistrationStatus(nextRegistration.registrationStart, nextRegistration.registrationEnd, now)
    : "Date pending";

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
          <div>
            <p style={{ ...styles.helperText, margin: 0 }}>Goethe exam registration</p>
            <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>How to register for your Goethe exam</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              See when booking opens, prepare your Goethe account early, and use the clearly displayed official registration link.
            </p>
          </div>
          <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
            <span style={styles.badge}>Level: {detectedLevel || "not set"}</span>
            {className ? <span style={styles.badge}>Class: {className}</span> : null}
          </div>
        </div>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
          <StatCard icon="🎓" label="Your level" value={detectedLevel || "Not set"} sub="Use Show all levels to check another exam." />
          <StatCard
            icon={summaryRegistrationStatus === "Open" ? "🟢" : "📅"}
            label="Registration status"
            value={summaryRegistrationStatus}
            sub={
              nextRegistration
                ? summaryRegistrationStatus === "Open"
                  ? "Registration is open now. Book immediately."
                  : `Bookable from ${formatDate(nextRegistration.exam.registrationStart)}`
                : "No registration date is currently listed."
            }
          />
          <StatCard
            icon="📍"
            label="Exam centre"
            value={summaryLevel?.location || "Goethe-Institut Accra"}
            sub={`Registration timing follows ${scheduleTimeZone}.`}
          />
        </div>
      </section>

      <CollapsibleCard
        title="How to register"
        subtitle="Complete these steps before and on the listed registration date."
        defaultOpen
        right={null}
      >
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ border: "2px solid #2563eb", borderRadius: 14, padding: 14, background: "#eff6ff", display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 900, color: "#111827" }}>1. Create your Goethe account before registration day</div>
            <div style={{ fontSize: 14, lineHeight: 1.55, color: "#374151" }}>
              Do not wait until booking opens. Create the account now, confirm your login details, and keep them ready.
            </div>
            <a href={GOETHE_ACCOUNT_URL} target="_blank" rel="noreferrer" style={primaryLinkStyle}>
              Create or open Goethe account →
            </a>
            <div style={{ fontSize: 12, color: "#4b5563", overflowWrap: "anywhere" }}>
              Account link: <a href={GOETHE_ACCOUNT_URL} target="_blank" rel="noreferrer">{GOETHE_ACCOUNT_URL}</a>
            </div>
          </div>

          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {[
              ["2", "Check the Bookable date", "Find your level below. The listed date tells you exactly when registration becomes available."],
              ["3", "Watch for Open", `On the registration date, the status automatically changes from Bookable to Open for the full day in ${scheduleTimeZone}.`],
              ["4", "Register immediately", "When the status says Open, select Register now and complete the booking on Goethe's official page."],
            ].map(([number, title, description]) => (
              <div key={number} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#ffffff" }}>
                <div style={{ fontWeight: 900, color: "#111827" }}>{number}. {title}</div>
                <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5, color: "#6B7280" }}>{description}</div>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleCard>

      <CollapsibleCard
        title="Goethe exam dates and registration links (Accra)"
        subtitle={`Bookable shows the future opening date. Open means registration is available now in ${scheduleTimeZone}.`}
        defaultOpen
        right={
          detectedLevel ? (
            <button
              type="button"
              style={{ ...styles.secondaryButton, padding: "6px 10px", fontSize: 12 }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setShowAllLevels((previous) => !previous);
              }}
            >
              {showAllLevels ? "Show my level only" : "Show all levels"}
            </button>
          ) : null
        }
      >
        <div style={{ display: "grid", gap: 14 }}>
          {!detectedLevel ? (
            <div style={{ ...styles.helperText, margin: "-2px 0 0" }}>No level is set yet, so all exam levels are shown.</div>
          ) : null}
          <div style={{ ...styles.helperText, margin: "-2px 0 0" }}>
            Date format: month day, year (e.g., August 3, 2026). Registration windows use {scheduleTimeZone}, not the browser timezone.
          </div>
          <div style={{ ...styles.helperText, margin: "-2px 0 0", color: examScheduleLoading ? "#92400e" : "#166534" }}>
            {examScheduleLoading
              ? "Updating Goethe schedule…"
              : examScheduleSource === "admin"
                ? "Schedule synced from Falowen Admin."
                : examScheduleSource === "cache"
                  ? "Showing the last saved Admin schedule while checking for updates."
                  : "Showing the built-in schedule until Admin publishes an update."}
          </div>

          {visibleExamLevels.map((levelInfo) => {
            const isDetectedLevel = levelInfo.level === detectedLevel;
            const formattedPrice = typeof levelInfo.priceValue === "number" ? formatMoney(levelInfo.priceValue) : levelInfo.price;
            const formattedModulePrice = typeof levelInfo.modulePriceValue === "number"
              ? t("examFile.modulePrice", { price: formatMoney(levelInfo.modulePriceValue) })
              : levelInfo.modulePrice;
            const upcomingExams = (levelInfo.exams || [])
              .slice()
              .sort((a, b) => {
                const aDate = startOfScheduleDay(a.date, scheduleTimeZone);
                const bDate = startOfScheduleDay(b.date, scheduleTimeZone);
                return (aDate?.getTime() || 0) - (bDate?.getTime() || 0);
              })
              .filter((exam) => {
                const registrationEnd = endOfScheduleDay(exam.registrationEnd, scheduleTimeZone);
                return registrationEnd && now <= registrationEnd;
              });

            return (
              <div
                key={levelInfo.level}
                style={{
                  border: isDetectedLevel ? "2px solid #2563eb" : "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 14,
                  background: isDetectedLevel ? "#eff6ff" : "#ffffff",
                  display: "grid",
                  gap: 12,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ minWidth: 0, flex: "1 1 260px" }}>
                    <div style={{ fontWeight: 900, fontSize: 16, color: "#111827" }}>{levelInfo.level} · {levelInfo.title}</div>
                    <p style={{ ...styles.helperText, margin: "6px 0 0" }}>{levelInfo.description}</p>
                  </div>
                  <div style={{ display: "grid", gap: 6, alignContent: "start" }}>
                    <div style={{ fontWeight: 900, fontSize: 15, color: "#111827", textAlign: "right" }}>{formattedPrice}</div>
                    {formattedModulePrice ? <div style={{ fontSize: 12, color: "#6B7280", textAlign: "right" }}>{formattedModulePrice}</div> : null}
                  </div>
                </div>

                {levelInfo.registrationUrl ? (
                  <div style={{ border: "1px solid #bfdbfe", borderRadius: 12, padding: 12, background: "#ffffff", display: "grid", gap: 8 }}>
                    <a href={levelInfo.registrationUrl} target="_blank" rel="noreferrer" style={primaryLinkStyle}>
                      Open {levelInfo.level} Goethe registration page →
                    </a>
                    <div style={{ fontSize: 12, color: "#4b5563", overflowWrap: "anywhere" }}>
                      Official registration link: <a href={levelInfo.registrationUrl} target="_blank" rel="noreferrer">{levelInfo.registrationUrl}</a>
                    </div>
                  </div>
                ) : (
                  <div style={styles.errorBox}>The official registration link has not been added for this level yet.</div>
                )}

                {upcomingExams.length === 0 ? (
                  <div style={{ ...styles.helperText, margin: 0 }}>
                    No future registration date is listed here yet. Open the official registration page above to check availability.
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 8 }}>
                    {upcomingExams.map((exam, index) => {
                      const examDate = startOfScheduleDay(exam.date, scheduleTimeZone);
                      const registrationStart = startOfScheduleDay(exam.registrationStart, scheduleTimeZone);
                      const registrationEnd = endOfScheduleDay(exam.registrationEnd, scheduleTimeZone);
                      const registrationStatus = getRegistrationStatus(registrationStart, registrationEnd, now);
                      const canRegister = registrationStatus === "Open" && Boolean(levelInfo.registrationUrl);
                      const isSingleDayRegistration =
                        scheduleDateKey(exam.registrationStart, scheduleTimeZone) ===
                        scheduleDateKey(exam.registrationEnd, scheduleTimeZone);
                      const registrationLabel = isSingleDayRegistration
                        ? `Bookable from: ${formatDate(exam.registrationStart)}`
                        : `Booking window: ${formatDate(exam.registrationStart)} - ${formatDate(exam.registrationEnd)}`;

                      return (
                        <div
                          key={`${levelInfo.level}-${exam.date}-${index}`}
                          style={{
                            border: canRegister ? "2px solid #22c55e" : "1px solid #e5e7eb",
                            borderRadius: 12,
                            padding: 12,
                            display: "grid",
                            gap: 9,
                            background: canRegister ? "#f0fdf4" : "#f9fafb",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                            <div style={{ fontWeight: 800, color: "#111827" }}>📅 Exam date: {formatDate(exam.date)} · {levelInfo.location}</div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#2563eb" }}>{getCountdownLabel(examDate, now)}</div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13, color: "#4b5563", fontWeight: 700 }}>{registrationLabel}</span>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "3px 9px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 900,
                                border: "1px solid",
                                letterSpacing: "0.02em",
                                textTransform: "uppercase",
                                ...registrationBadgeStyles[registrationStatus],
                              }}
                            >
                              {registrationStatus}
                            </span>
                          </div>

                          <div style={{ fontSize: 13, lineHeight: 1.5, color: canRegister ? "#166534" : "#6B7280" }}>
                            {canRegister
                              ? `Registration is open now in ${scheduleTimeZone}. Select Register now and complete your booking immediately.`
                              : `The status will change from Bookable to Open at midnight in ${scheduleTimeZone} on ${formatDate(exam.registrationStart)}.`}
                          </div>

                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {levelInfo.registrationUrl ? (
                              <a
                                href={levelInfo.registrationUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ ...primaryLinkStyle, minHeight: 38, padding: "7px 12px", background: canRegister ? "#16a34a" : "#2563eb", fontSize: 13 }}
                              >
                                {canRegister ? "Register now →" : "Open registration page →"}
                              </a>
                            ) : null}
                            <button
                              type="button"
                              style={{ ...styles.secondaryButton, padding: "7px 10px", fontSize: 12 }}
                              onClick={() => downloadExamReminder({ levelInfo, exam })}
                            >
                              Add exam reminder (.ics)
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CollapsibleCard>
    </div>
  );
};

export default MyExamFilePage;
