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
  const studentName = studentProfile?.name || studentProfile?.displayName || "Student";
  const className = studentProfile?.className || "your class";

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
      <p style={{ ...styles.helperText, color: "#c7d2fe", margin: 0 }}>Welcome back</p>
      <h2 style={{ margin: "4px 0 8px", fontSize: 26, letterSpacing: -0.3 }}>
        {studentName}, your campus is ready.
      </h2>
      <p style={{ ...styles.helperText, color: "#e0e7ff", marginBottom: 12 }}>
        Personalised tips, attendance, and assignments for {className}—jump straight into the space you need today.
      </p>

      <PrimaryActionBar align="start">
        <PillBadge tone="success">Keep your streak alive</PillBadge>

        <button
          type="button"
          style={{ ...styles.primaryButton, background: "#f8fafc", color: "#111827", borderColor: "#e5e7eb" }}
          onClick={() => window.open(ZOOM_DETAILS.url, "_blank", "noreferrer")}
        >
          Join on Zoom
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
  const preferredClass = studentProfile?.className;
  const navigate = useNavigate();
  const classCalendarId = "class-calendar-card";
  const [announcements, setAnnouncements] = useState([]);
  const [announcementStatus, setAnnouncementStatus] = useState("idle");
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState(() => new Set());
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
          ? `Your access ends today and you still owe ${amount}. Please make a payment to keep access.`
          : `You still owe ${amount} and have ${daysLabel} left. Please make a payment to keep access.`,
    };
  }, [formatTimeUnit, locale, studentProfile?.balanceDue, studentProfile?.contractEnd]);

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

  const toggleAnnouncementExpansion = useCallback((announcementId) => {
    setExpandedAnnouncements((prev) => {
      const next = new Set(prev);
      if (next.has(announcementId)) {
        next.delete(announcementId);
      } else {
        next.add(announcementId);
      }
      return next;
    });
  }, []);

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
          <span style={{ ...styles.badge, background: "#f59e0b", color: "#fff" }}>Payment reminder</span>
          <strong style={{ fontSize: 16 }}>{paymentAlert.message}</strong>
          <PrimaryActionBar align="start">
            <button style={styles.primaryButton} onClick={() => navigate("/campus/account")}>
              Review payments
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
          eyebrow="Updates"
          title="Announcements"
          subtitle="Latest school and class notices, including language-specific updates."
        />
        {announcementStatus === "loading" ? (
          <p style={{ ...styles.helperText, margin: 0 }}>Loading announcements…</p>
        ) : null}
        {announcementStatus === "error" ? (
          <p style={{ ...styles.helperText, margin: 0 }}>
            We could not load announcements right now. Please refresh soon.
          </p>
        ) : null}
        {announcementStatus === "success" && announcements.length === 0 ? (
          <p style={{ ...styles.helperText, margin: 0 }}>
            No announcements yet. Check back later for new updates.
          </p>
        ) : null}
        {announcementStatus === "success" && announcements.length > 0 ? (
          <div className="announcement-slider" aria-label="Latest announcements" aria-live="polite">
            <div className="announcement-slide" key={announcements[announcementIndex]?.id}>
              {(() => {
                const announcement = announcements[announcementIndex] || {};
                const announcementId = announcement.id || `announcement-${announcementIndex}`;
                const body = (announcement.body || "").trim();
                const maxPreviewLength = 140;
                const isLong = body.length > maxPreviewLength;
                const isExpanded = expandedAnnouncements.has(announcementId);
                const visibleBody =
                  isExpanded || !isLong ? body : `${body.slice(0, maxPreviewLength).trim()}…`;

                return (
                  <>
                    <div className="announcement-message">
                      <span className="announcement-ticker-title">{announcement.title}</span>
                      {body ? <span className="announcement-ticker-body">— {visibleBody}</span> : null}
                      {isLong ? (
                        <button
                          type="button"
                          className="announcement-read-more"
                          onClick={() => toggleAnnouncementExpansion(announcementId)}
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      ) : null}
                    </div>
                    {announcement.linkUrl ? (
                      <a
                        href={announcement.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="announcement-ticker-link"
                      >
                        {announcement.linkLabel || "Open update"}
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

      <section style={styles.card}>
        <SectionHeader
          eyebrow="Welcome back"
          title="Choose your learning space"
          subtitle="Pick the area that matches your focus today. All instructions stay in English so you can navigate quickly and spend more time practising."
        />
      </section>

      <div style={styles.gridTwo}>
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <SectionHeader
            eyebrow="Campus"
            title="Classes, course book, and AI helpers"
            actions={
              <PrimaryActionBar align="flex-end">
                <PillBadge tone="success">Start here</PillBadge>
                <PillBadge>Daily work</PillBadge>
              </PrimaryActionBar>
            }
          />
          <ul style={{ ...styles.checklist, margin: 0 }}>
            <li>Course book access, assignment submission, and results.</li>
            <li>Grammar Q&amp;A, Speech Trainer, and the original writing coach.</li>
            <li>Group discussion and your account settings.</li>
          </ul>
          <p style={{ ...styles.helperText, marginBottom: 6 }}>
            Start in Campus for daily work; use Exams Room for mock exam practice.
          </p>
          <PrimaryActionBar align="start">
            <button style={styles.primaryButton} onClick={() => onSelectArea("campus")}>
              Enter Campus
            </button>
          </PrimaryActionBar>
        </section>

        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <SectionHeader
            eyebrow="Exams Room"
            title="Speaking, Schreiben trainer, resources"
            actions={
              <PrimaryActionBar align="flex-end">
                <PillBadge tone="info">Exam mode</PillBadge>
              </PrimaryActionBar>
            }
          />
          <ul style={{ ...styles.checklist, margin: 0 }}>
            <li>Speaking practice prompts organised by level.</li>
            <li>Schreiben trainer with timed letters and idea generation.</li>
            <li>Goethe Lesen/Hören links and quick exam-day reminders.</li>
          </ul>
          <p style={{ ...styles.helperText, marginBottom: 6 }}>
            Start in Campus for daily work; use Exams Room for mock exam practice.
          </p>
          <PrimaryActionBar align="start">
            <button style={styles.secondaryButton} onClick={() => onSelectArea("exams")}>
              Go to Exams Room
            </button>
          </PrimaryActionBar>
        </section>
      </div>

      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ ...styles.card, background: "#f8fafc", display: "grid", gap: 12 }}>
          <h3 style={{ ...styles.sectionTitle, margin: 0 }}>More for you</h3>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Track your attendance streaks, keep an eye on upcoming class dates, and review the calendar so you
            never miss a lesson.
          </p>
          <HomeMetrics studentProfile={studentProfile} />
          <ClassCalendarCard
            id={classCalendarId}
            initialClassName={preferredClass}
            program={studentProfile?.program}
          />
        </div>
      </section>
    </div>
  );
};

export default GeneralHome;
