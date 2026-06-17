import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { toDateMs } from "../lib/dateUtils";
import { ZOOM_DETAILS } from "../data/classCatalog";
import ClassCalendarCard from "./ClassCalendarCard";
import OnboardingChecklist from "./OnboardingChecklist";
import NavigationGuide from "./NavigationGuide";
import ExamReadinessBadge from "./ExamReadinessBadge";
import HomeMetrics from "./HomeMetrics";
import HomeClassPreviewCard from "./HomeClassPreviewCard";
import { fetchAnnouncements } from "../services/announcementService";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import { PillBadge, PrimaryActionBar, SectionHeader } from "./ui";
import { formatCurrency } from "../lib/formatters";
import YouTubeSubscribeButton from "./YouTubeSubscribeButton";
import { detectLevelKey } from "../lib/day0Workbook";

const day0WorkbookByLevel = {
  A1: "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook",
  A2: "/campus/course/a2-day-0-orientation-and-knowledge-test-workbook",
  B1: "/campus/course/b1-day-0-orientation-and-knowledge-test-workbook",
  B2: "/campus/course/lesson/B2/0",
  C1: "/campus/course/lesson/C1/0",
};

const selfLearningLevels = new Set(["B2", "C1"]);

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatContractStatus = (studentProfile = {}) => {
  const contractEndMs = toDateMs(studentProfile.contractEnd);
  if (!Number.isFinite(contractEndMs)) return "Access active";
  const dayMs = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((contractEndMs - Date.now()) / dayMs);
  const contractDate = formatDate(contractEndMs);
  if (daysLeft < 0) return `Access expired · ended ${contractDate}`;
  if (daysLeft === 0) return "Access active · ends today";
  if (daysLeft <= 45) return `Access active · ${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
  return `Access active until ${contractDate}`;
};

const WelcomeHero = ({ studentProfile, onOpenExamFile, onJoinZoom, onContinueLearning, onOpenAccount }) => {
  const { t } = useTranslation();
  const studentName = studentProfile?.name || studentProfile?.displayName || t("generalHome.welcome.studentFallback");
  const levelKey = detectLevelKey(studentProfile);
  const courseLabel = levelKey ? `${levelKey} course` : "your course";

  return (
    <section
      style={{
        ...styles.card,
        background: "linear-gradient(135deg, #312e81, #2563eb)",
        color: "#eef2ff",
        border: "none",
        boxShadow: "0 20px 45px rgba(37, 99, 235, 0.25)",
        display: "grid",
        gap: 10,
      }}
    >
      <p style={{ ...styles.helperText, color: "#c7d2fe", margin: 0 }}>{t("generalHome.welcome.eyebrow")}</p>
      <h2 style={{ margin: 0, fontSize: 24, letterSpacing: -0.3 }}>
        {t("generalHome.welcome.title", { studentName })}
      </h2>
      <p style={{ ...styles.helperText, color: "#e0e7ff", margin: 0 }}>
        Your {courseLabel} is ready. Use Campus for daily learning, and use Exams Room for exam practice.
      </p>
      <PrimaryActionBar align="start" wrap>
        <button type="button" style={{ ...styles.primaryButton, background: "#dcfce7", color: "#14532d", borderColor: "#bbf7d0" }} onClick={onContinueLearning}>
          Open Campus
        </button>
        <button type="button" style={{ ...styles.primaryButton, background: "#f8fafc", color: "#111827", borderColor: "#e5e7eb" }} onClick={onOpenAccount}>
          Account
        </button>
        <button type="button" style={{ ...styles.primaryButton, background: "#f8fafc", color: "#111827", borderColor: "#e5e7eb" }} onClick={onJoinZoom}>
          {t("generalHome.welcome.joinZoom")}
        </button>
        <ExamReadinessBadge variant="button" studentProfile={studentProfile} onOpenExamFile={onOpenExamFile} />
      </PrimaryActionBar>
    </section>
  );
};

const QuickMainAccess = ({ t, openCampus, openExamsRoom }) => (
  <div style={styles.gridTwo}>
    <section style={{ ...styles.card, display: "grid", gap: 10, background: "linear-gradient(130deg, rgba(238, 242, 255, 0.9), rgba(255, 255, 255, 0.96))", borderColor: "#c7d2fe" }}>
      <SectionHeader
        eyebrow={t("generalHome.campus.eyebrow")}
        title={t("generalHome.campus.title")}
        subtitle="Course book, submit work, results and grammar help."
        actions={<PrimaryActionBar align="flex-end"><PillBadge tone="success">Daily work</PillBadge></PrimaryActionBar>}
      />
      <PrimaryActionBar align="start"><button style={styles.primaryButton} onClick={openCampus}>Enter Campus</button></PrimaryActionBar>
    </section>

    <section style={{ ...styles.card, display: "grid", gap: 10, background: "linear-gradient(130deg, rgba(239, 246, 255, 0.95), rgba(255, 255, 255, 0.97))", borderColor: "#bfdbfe" }}>
      <SectionHeader
        eyebrow={t("generalHome.exams.eyebrow")}
        title={t("generalHome.exams.title")}
        subtitle="Speaking, writing, listening, reading and exam readiness."
        actions={<PrimaryActionBar align="flex-end"><PillBadge tone="info">Exam mode</PillBadge></PrimaryActionBar>}
      />
      <PrimaryActionBar align="start"><button style={styles.secondaryButton} onClick={openExamsRoom}>Open Exams Room</button></PrimaryActionBar>
    </section>
  </div>
);

const CompactCourseGuide = ({ studentProfile, levelKey, onOpenDay0, onOpenCourseBook, onOpenExamsRoom }) => {
  const className = studentProfile?.className || "Not assigned yet";
  const courseName = levelKey ? `${levelKey} ${selfLearningLevels.has(levelKey) ? "Self-learning" : "Course"}` : "Course not selected";

  return (
    <section style={{ ...styles.card, display: "grid", gap: 10, border: "1px solid #bfdbfe", background: "#f8fafc" }}>
      <details>
        <summary style={{ cursor: "pointer", fontWeight: 800, color: "#1d4ed8" }}>Expand course guide, Day 0 and access details</summary>
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#ffffff" }}>
              <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>Course</p><strong>{courseName}</strong>
            </div>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#ffffff" }}>
              <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>Assigned class</p><strong>{className}</strong>
            </div>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#ffffff" }}>
              <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>Access</p><strong>{formatContractStatus(studentProfile)}</strong>
            </div>
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>Best flow: Course Book → Learn → Speak → Write → Finish. For B2/C1, start with Day 0 Orientation first.</p>
          <PrimaryActionBar align="start" wrap>
            <button type="button" style={styles.secondaryButton} onClick={onOpenDay0}>Open Day 0 Orientation</button>
            <button type="button" style={styles.primaryButton} onClick={onOpenCourseBook}>Continue Course Book</button>
            <button type="button" style={styles.secondaryButton} onClick={onOpenExamsRoom}>Open Exams Room</button>
          </PrimaryActionBar>
        </div>
      </details>
    </section>
  );
};

const AnnouncementSection = ({ announcements, announcementStatus, announcementIndex, t }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <SectionHeader eyebrow={t("generalHome.announcements.eyebrow")} title={t("generalHome.announcements.title")} subtitle={t("generalHome.announcements.subtitle")} />
    {announcementStatus === "loading" ? <p style={{ ...styles.helperText, margin: 0 }}>{t("generalHome.announcements.loading")}</p> : null}
    {announcementStatus === "error" ? <p style={{ ...styles.helperText, margin: 0 }}>{t("generalHome.announcements.error")}</p> : null}
    {announcementStatus === "success" && announcements.length === 0 ? <p style={{ ...styles.helperText, margin: 0 }}>{t("generalHome.announcements.empty")}</p> : null}
    {announcementStatus === "success" && announcements.length > 0 ? (
      <div className="announcement-slider" aria-label={t("generalHome.announcements.ariaLabel")} aria-live="polite">
        <div className="announcement-slide" key={announcements[announcementIndex]?.id}>
          <div className="announcement-message"><span className="announcement-ticker-title">{announcements[announcementIndex]?.title}</span></div>
          {announcements[announcementIndex]?.linkUrl ? (
            <a href={announcements[announcementIndex].linkUrl} target="_blank" rel="noreferrer" className="announcement-ticker-link">
              {announcements[announcementIndex].linkLabel || t("generalHome.announcements.openUpdate")}
            </a>
          ) : null}
        </div>
        {announcements.length > 1 ? <div className="announcement-slide-count" aria-hidden="true">{announcementIndex + 1} / {announcements.length}</div> : null}
      </div>
    ) : null}
  </section>
);

const GeneralHome = ({ onSelectArea, studentProfile, notificationStatus, onEnableNotifications, onSaveOnboarding }) => {
  const { i18n, t } = useTranslation();
  const locale = i18n.language;
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const formatTimeUnit = useCallback((unit, count) => t(`common.${unit}`, { count, formattedCount: numberFormatter.format(count) }), [numberFormatter, t]);
  const translate = useCallback((key, values) => t(key, values), [t]);
  const navigate = useNavigate();
  const playOpenFeedback = useCallback(() => triggerInteractionFeedback({ sound: "open" }), []);
  const preferredClass = studentProfile?.className;
  const classCalendarId = "class-calendar-card";
  const [announcements, setAnnouncements] = useState([]);
  const [announcementStatus, setAnnouncementStatus] = useState("idle");
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const levelKey = detectLevelKey(studentProfile);
  const day0WorkbookLink = day0WorkbookByLevel[levelKey] || "/campus/account";
  const onboardingCompleted = Boolean(studentProfile?.onboardingCompleted);
  const useSelfLearningGuide = selfLearningLevels.has(levelKey);

  const openCampus = useCallback(() => { playOpenFeedback(); onSelectArea("campus"); }, [onSelectArea, playOpenFeedback]);
  const openExamFile = useCallback(() => { playOpenFeedback(); navigate("/campus/examFile"); }, [navigate, playOpenFeedback]);
  const openAccount = useCallback(() => { playOpenFeedback(); navigate("/campus/account"); }, [navigate, playOpenFeedback]);
  const openExamsRoom = useCallback(() => { playOpenFeedback(); onSelectArea("exams"); }, [onSelectArea, playOpenFeedback]);
  const openDay0 = useCallback(() => { playOpenFeedback(); navigate(day0WorkbookLink); }, [day0WorkbookLink, navigate, playOpenFeedback]);
  const joinZoom = useCallback(() => { playOpenFeedback(); window.open(ZOOM_DETAILS.url, "_blank", "noreferrer"); }, [playOpenFeedback]);

  const paymentAlert = useMemo(() => {
    const balanceDue = Math.max(Number(studentProfile?.balanceDue) || 0, 0);
    if (balanceDue <= 0 || !studentProfile?.contractEnd) return null;
    const contractEndMs = toDateMs(studentProfile.contractEnd);
    if (!Number.isFinite(contractEndMs)) return null;
    const daysLeft = Math.ceil((contractEndMs - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0 || daysLeft > 15) return null;
    const amount = formatCurrency(balanceDue, { locale, maximumFractionDigits: 2 });
    const daysLabel = formatTimeUnit("day", daysLeft);
    return {
      daysLeft,
      message: daysLeft === 0 ? translate("generalHome.paymentAlert.endsToday", { amount }) : translate("generalHome.paymentAlert.endsSoon", { amount, time: daysLabel }),
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
    setAnnouncementStatus("loading");
    fetchAnnouncements({ className: studentProfile?.className, program: studentProfile?.program, locale })
      .then((items) => {
        if (!mounted) return;
        setAnnouncements(items);
        setAnnouncementStatus("success");
      })
      .catch((error) => {
        console.error("Failed to load announcements", error);
        if (!mounted) return;
        setAnnouncements([]);
        setAnnouncementStatus("error");
      });
    return () => { mounted = false; };
  }, [locale, studentProfile?.className, studentProfile?.program]);

  useEffect(() => {
    if (announcements.length <= 1) {
      setAnnouncementIndex(0);
      return undefined;
    }
    const interval = setInterval(() => setAnnouncementIndex((current) => (current + 1) % announcements.length), 6000);
    return () => clearInterval(interval);
  }, [announcements]);

  if (!onboardingCompleted) {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <section style={{ ...styles.card, display: "grid", gap: 10, background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)", color: "#ffffff", border: "none", boxShadow: "0 18px 36px rgba(37,99,235,0.22)" }}>
          <p style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af", margin: 0 }}>First-time setup</p>
          <h2 style={{ margin: 0, fontSize: 28 }}>Complete onboarding before opening your dashboard</h2>
          <p style={{ margin: 0, color: "#dbeafe", lineHeight: 1.6 }}>This page shows only the important setup steps. When you finish and save, Falowen will unlock the normal home dashboard with your next step, metrics, Campus, Exams Room, and class links.</p>
        </section>
        <OnboardingChecklist notificationStatus={notificationStatus} onEnableNotifications={onEnableNotifications} onSelectLevel={handleSelectLevel} onConfirmClass={handleConfirmClass} studentProfile={studentProfile} onSaveOnboarding={onSaveOnboarding} />
        <section style={{ ...styles.card, display: "grid", gap: 12 }}>
          <SectionHeader eyebrow="Class access" title="Check your Zoom and calendar here" subtitle="Use this during onboarding only. After setup, it will move into the dashboard under Live class access & calendar." />
          <ClassCalendarCard id={classCalendarId} initialClassName={preferredClass} program={studentProfile?.program} />
        </section>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <WelcomeHero studentProfile={studentProfile} onOpenExamFile={openExamFile} onJoinZoom={joinZoom} onContinueLearning={openCampus} onOpenAccount={openAccount} />

      {paymentAlert ? (
        <section style={{ ...styles.card, background: "#fffbeb", border: "1px solid #f59e0b", display: "grid", gap: 8 }}>
          <span style={{ ...styles.badge, background: "#f59e0b", color: "#fff" }}>{t("generalHome.paymentAlert.badge")}</span>
          <strong style={{ fontSize: 16 }}>{paymentAlert.message}</strong>
          <PrimaryActionBar align="start"><button style={styles.primaryButton} onClick={openAccount}>{t("generalHome.paymentAlert.cta")}</button></PrimaryActionBar>
        </section>
      ) : null}

      <HomeClassPreviewCard studentProfile={studentProfile} />

      <QuickMainAccess t={t} openCampus={openCampus} openExamsRoom={openExamsRoom} />

      <CompactCourseGuide studentProfile={studentProfile} levelKey={levelKey} onOpenDay0={openDay0} onOpenCourseBook={openCampus} onOpenExamsRoom={openExamsRoom} />

      {useSelfLearningGuide ? null : <HomeMetrics studentProfile={studentProfile} />}

      <details style={{ ...styles.card, background: "#f8fafc" }}>
        <summary style={{ ...styles.sectionTitle, cursor: "pointer", margin: 0 }}>Expand learning guide and navigation help</summary>
        <div style={{ marginTop: 12 }}><NavigationGuide /></div>
      </details>

      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <details style={{ ...styles.card, background: "#f8fafc" }}>
          <summary style={{ ...styles.sectionTitle, cursor: "pointer", margin: 0 }}>▶ Live class access & calendar</summary>
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <p style={{ ...styles.helperText, margin: 0 }}>Zoom meeting, class dates, calendar download, and next live class details.</p>
            <ClassCalendarCard id={classCalendarId} initialClassName={preferredClass} program={studentProfile?.program} />
          </div>
        </details>
      </section>

      <AnnouncementSection announcements={announcements} announcementStatus={announcementStatus} announcementIndex={announcementIndex} t={t} />

      <section style={{ ...styles.card, marginBottom: 0 }}><PrimaryActionBar align="start"><YouTubeSubscribeButton /></PrimaryActionBar></section>
    </div>
  );
};

export default GeneralHome;
