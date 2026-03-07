import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { toDateMs } from "../lib/dateUtils";
import { ZOOM_DETAILS } from "../data/classCatalog";
import ClassCalendarCard from "./ClassCalendarCard";
import HomeMetrics from "./HomeMetrics";
import OnboardingChecklist from "./OnboardingChecklist";
import NavigationGuide from "./NavigationGuide";
import ExamReadinessBadge from "./ExamReadinessBadge";
import { fetchAnnouncements } from "../services/announcementService";
import { PillBadge, PrimaryActionBar, SectionHeader } from "./ui";
import { formatCurrency } from "../lib/formatters";

const WelcomeHero = ({ studentProfile, onOpenExamFile }) => {
  const { t } = useTranslation();
  const studentName =
    studentProfile?.name || studentProfile?.displayName || t("generalHome.welcome.studentFallback");
  const className = studentProfile?.className || t("generalHome.welcome.classFallback");

  return (
    <section
      style={{
        ...styles.card,
        background: "linear-gradient(135deg, #312e81, #2563eb)",
        color: "#eef2ff",
        border: "none",
        boxShadow: "0 20px 45px rgba(37, 99, 235, 0.25)",
      }}
    >
      <p style={{ ...styles.helperText, color: "#c7d2fe", margin: 0 }}>{t("generalHome.welcome.eyebrow")}</p>
      <h2 style={{ margin: "4px 0 8px", fontSize: 26, letterSpacing: -0.3 }}>
        {t("generalHome.welcome.title", { studentName })}
      </h2>
      <p style={{ ...styles.helperText, color: "#e0e7ff", marginBottom: 12 }}>
        {t("generalHome.welcome.subtitle", { className })}
      </p>

      <PrimaryActionBar align="start">
        <PillBadge tone="success">{t("generalHome.welcome.streakBadge")}</PillBadge>

        <button
          type="button"
          style={{ ...styles.primaryButton, background: "#f8fafc", color: "#111827", borderColor: "#e5e7eb" }}
          onClick={() => window.open(ZOOM_DETAILS.url, "_blank", "noreferrer")}
        >
          {t("generalHome.welcome.joinZoom")}
        </button>

        {/* ✅ Compact: sits beside Zoom */}
        <ExamReadinessBadge
          variant="button"
          studentProfile={studentProfile}
          onOpenExamFile={onOpenExamFile}
        />
      </PrimaryActionBar>
    </section>
  );
};

const GeneralHome = ({
  onSelectArea,
  studentProfile,
  notificationStatus,
  onEnableNotifications,
  onSaveOnboarding,
}) => {
  const { i18n, t } = useTranslation();
  const locale = i18n.language;
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const formatTimeUnit = useCallback(
    (unit, count) => t(`common.${unit}`, { count, formattedCount: numberFormatter.format(count) }),
    [numberFormatter, t]
  );
  const translate = useCallback((key, values) => t(key, values), [t]);
  const preferredClass = studentProfile?.className;
  const navigate = useNavigate();
  const classCalendarId = "class-calendar-card";
  const [announcements, setAnnouncements] = useState([]);
  const [announcementStatus, setAnnouncementStatus] = useState("idle");
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const paymentAlert = useMemo(() => {
    const balanceDue = Math.max(Number(studentProfile?.balanceDue) || 0, 0);
    if (balanceDue <= 0) return null;
    if (!studentProfile?.contractEnd) return null;
    const contractEndMs = toDateMs(studentProfile.contractEnd);
    if (!Number.isFinite(contractEndMs)) return null;
    const dayMs = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((contractEndMs - Date.now()) / dayMs);
    if (daysLeft < 0 || daysLeft > 15) return null;

    const amount = formatCurrency(balanceDue, { locale, maximumFractionDigits: 2 });
    const daysLabel = formatTimeUnit("day", daysLeft);

    return {
      daysLeft,
      message:
        daysLeft === 0
          ? translate("generalHome.paymentAlert.endsToday", { amount })
          : translate("generalHome.paymentAlert.endsSoon", { amount, time: daysLabel }),
    };
  }, [formatTimeUnit, locale, studentProfile?.balanceDue, studentProfile?.contractEnd, translate]);

  const handleSelectLevel = () => navigate("/campus/account");
  const handleConfirmClass = () => {
    const calendarSection = document.getElementById(classCalendarId);
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    navigate("/");
  };

  useEffect(() => {
    let mounted = true;
    const loadAnnouncements = async () => {
      setAnnouncementStatus("loading");
      try {
        const items = await fetchAnnouncements({
          className: studentProfile?.className,
          program: studentProfile?.program,
          locale,
        });
        if (!mounted) return;
        setAnnouncements(items);
        setAnnouncementStatus("success");
      } catch (error) {
        console.error("Failed to load announcements", error);
        if (!mounted) return;
        setAnnouncements([]);
        setAnnouncementStatus("error");
      }
    };

    loadAnnouncements();
    return () => {
      mounted = false;
    };
  }, [locale, studentProfile?.className, studentProfile?.program]);

  useEffect(() => {
    if (announcements.length <= 1) {
      setAnnouncementIndex(0);
      return undefined;
    }

    const interval = setInterval(() => {
      setAnnouncementIndex((current) => (current + 1) % announcements.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [announcements]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <WelcomeHero
        studentProfile={studentProfile}
        onOpenExamFile={() => navigate("/campus/examFile")}
      />

      {paymentAlert ? (
        <section
          style={{
            ...styles.card,
            background: "#fffbeb",
            border: "1px solid #f59e0b",
            display: "grid",
            gap: 8,
          }}
        >
          <span style={{ ...styles.badge, background: "#f59e0b", color: "#fff" }}>
            {t("generalHome.paymentAlert.badge")}
          </span>
          <strong style={{ fontSize: 16 }}>{paymentAlert.message}</strong>
          <PrimaryActionBar align="start">
            <button style={styles.primaryButton} onClick={() => navigate("/campus/account")}>
              {t("generalHome.paymentAlert.cta")}
            </button>
          </PrimaryActionBar>
        </section>
      ) : null}

      {/* ❌ Remove the big readiness card from the home page */}
      {/* 
      <ExamReadinessBadge
        studentProfile={studentProfile}
        onOpenExamFile={() => navigate("/campus/examFile")}
      />
      */}

      <OnboardingChecklist
        notificationStatus={notificationStatus}
        onEnableNotifications={onEnableNotifications}
        onSelectLevel={handleSelectLevel}
        onConfirmClass={handleConfirmClass}
        studentProfile={studentProfile}
        onSaveOnboarding={onSaveOnboarding}
      />

      <NavigationGuide />

      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <SectionHeader
          eyebrow={t("generalHome.announcements.eyebrow")}
          title={t("generalHome.announcements.title")}
          subtitle={t("generalHome.announcements.subtitle")}
        />
        {announcementStatus === "loading" ? (
          <p style={{ ...styles.helperText, margin: 0 }}>{t("generalHome.announcements.loading")}</p>
        ) : null}
        {announcementStatus === "error" ? (
          <p style={{ ...styles.helperText, margin: 0 }}>
            {t("generalHome.announcements.error")}
          </p>
        ) : null}
        {announcementStatus === "success" && announcements.length === 0 ? (
          <p style={{ ...styles.helperText, margin: 0 }}>
            {t("generalHome.announcements.empty")}
          </p>
        ) : null}
        {announcementStatus === "success" && announcements.length > 0 ? (
          <div
            className="announcement-slider"
            aria-label={t("generalHome.announcements.ariaLabel")}
            aria-live="polite"
          >
            <div className="announcement-slide" key={announcements[announcementIndex]?.id}>
              {(() => {
                const announcement = announcements[announcementIndex] || {};

                return (
                  <>
                    <div className="announcement-message">
                      <span className="announcement-ticker-title">{announcement.title}</span>
                    </div>
                    {announcement.linkUrl ? (
                      <a
                        href={announcement.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="announcement-ticker-link"
                      >
                        {announcement.linkLabel || t("generalHome.announcements.openUpdate")}
                      </a>
                    ) : null}
                  </>
                );
              })()}
            </div>
            {announcements.length > 1 ? (
              <div className="announcement-slide-count" aria-hidden="true">
                {announcementIndex + 1} / {announcements.length}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section
        style={{
          ...styles.card,
          backgroundImage:
            "linear-gradient(110deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9)), url('/learning-space-hero.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <SectionHeader
          eyebrow={t("generalHome.learningSpace.eyebrow")}
          title={t("generalHome.learningSpace.title")}
          subtitle={t("generalHome.learningSpace.subtitle")}
        />
      </section>

      <div style={styles.gridTwo}>
        <section
          style={{
            ...styles.card,
            display: "grid",
            gap: 10,
            background:
              "linear-gradient(130deg, rgba(238, 242, 255, 0.9), rgba(255, 255, 255, 0.96))",
            borderColor: "#c7d2fe",
          }}
        >
          <SectionHeader
            eyebrow={t("generalHome.campus.eyebrow")}
            title={t("generalHome.campus.title")}
            actions={
              <PrimaryActionBar align="flex-end">
                <PillBadge tone="success">{t("generalHome.campus.badgePrimary")}</PillBadge>
                <PillBadge>{t("generalHome.campus.badgeSecondary")}</PillBadge>
              </PrimaryActionBar>
            }
          />
          <ul style={{ ...styles.checklist, margin: 0 }}>
            <li>{t("generalHome.campus.points.0")}</li>
            <li>{t("generalHome.campus.points.1")}</li>
            <li>{t("generalHome.campus.points.2")}</li>
          </ul>
          <p style={{ ...styles.helperText, marginBottom: 6 }}>
            {t("generalHome.campus.helper")}
          </p>
          <PrimaryActionBar align="start">
            <button style={styles.primaryButton} onClick={() => onSelectArea("campus")}>
              {t("generalHome.campus.cta")}
            </button>
          </PrimaryActionBar>
        </section>

        <section
          style={{
            ...styles.card,
            display: "grid",
            gap: 10,
            background:
              "linear-gradient(130deg, rgba(239, 246, 255, 0.95), rgba(255, 255, 255, 0.97))",
            borderColor: "#bfdbfe",
          }}
        >
          <SectionHeader
            eyebrow={t("generalHome.exams.eyebrow")}
            title={t("generalHome.exams.title")}
            actions={
              <PrimaryActionBar align="flex-end">
                <PillBadge tone="info">{t("generalHome.exams.badge")}</PillBadge>
              </PrimaryActionBar>
            }
          />
          <ul style={{ ...styles.checklist, margin: 0 }}>
            <li>{t("generalHome.exams.points.0")}</li>
            <li>{t("generalHome.exams.points.1")}</li>
            <li>{t("generalHome.exams.points.2")}</li>
          </ul>
          <p style={{ ...styles.helperText, marginBottom: 6 }}>
            {t("generalHome.exams.helper")}
          </p>
          <PrimaryActionBar align="start">
            <button style={styles.secondaryButton} onClick={() => onSelectArea("exams")}>
              {t("generalHome.exams.cta")}
            </button>
          </PrimaryActionBar>
        </section>
      </div>

      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <details style={{ ...styles.card, background: "#f8fafc" }}>
          <summary style={{ ...styles.sectionTitle, cursor: "pointer", margin: 0 }}>
            {t("generalHome.more.summary")}
          </summary>
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <p style={{ ...styles.helperText, margin: 0 }}>
              {t("generalHome.more.helper")}
            </p>
            <HomeMetrics studentProfile={studentProfile} />
            <ClassCalendarCard
              id={classCalendarId}
              initialClassName={preferredClass}
              program={studentProfile?.program}
            />
          </div>
        </details>
      </section>
    </div>
  );
};

export default GeneralHome;
