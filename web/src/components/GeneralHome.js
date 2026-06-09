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

const WelcomeHero = ({ studentProfile, onOpenExamFile, onJoinZoom, onContinueLearning, onOpenAccount }) => {
  const { t } = useTranslation();
  const studentName =
    studentProfile?.name || studentProfile?.displayName || t("generalHome.welcome.studentFallback");
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
      }}
    >
      <p style={{ ...styles.helperText, color: "#c7d2fe", margin: 0 }}>{t("generalHome.welcome.eyebrow")}</p>
      <h2 style={{ margin: "4px 0 8px", fontSize: 26, letterSpacing: -0.3 }}>
        {t("generalHome.welcome.title", { studentName })}
      </h2>
      <p style={{ ...styles.helperText, color: "#e0e7ff", marginBottom: 12 }}>
        Your {courseLabel} is ready. Start from the Course Book, follow the daily lesson, and use Study Buddy when you need help.
      </p>

      <PrimaryActionBar align="start">
        <button
          type="button"
          style={{ ...styles.primaryButton, background: "#dcfce7", color: "#14532d", borderColor: "#bbf7d0" }}
          onClick={onContinueLearning}
        >
          Open Course Book
        </button>

        <button
          type="button"
          style={{ ...styles.primaryButton, background: "#f8fafc", color: "#111827", borderColor: "#e5e7eb" }}
          onClick={onOpenAccount}
        >
          Account
        </button>

        <button
          type="button"
          style={{ ...styles.primaryButton, background: "#f8fafc", color: "#111827", borderColor: "#e5e7eb" }}
          onClick={onJoinZoom}
        >
          {t("generalHome.welcome.joinZoom")}
        </button>

        <ExamReadinessBadge
          variant="button"
          studentProfile={studentProfile}
          onOpenExamFile={onOpenExamFile}
        />
      </PrimaryActionBar>
    </section>
  );
};

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

const shouldShowDay0Prompt = (studentProfile = {}, levelKey = "") => {
  if (!levelKey || !day0WorkbookByLevel[levelKey]) return false;

  const explicitCompleted = [
    studentProfile.day0Completed,
    studentProfile.day0OrientationCompleted,
    studentProfile.orientationCompleted,
    studentProfile.knowledgeTestCompleted,
  ];

  if (explicitCompleted.some((value) => value === true || String(value).toLowerCase() === "true")) {
    return selfLearningLevels.has(levelKey);
  }
  if (explicitCompleted.some((value) => value === false || String(value).toLowerCase() === "false")) return true;

  if (selfLearningLevels.has(levelKey)) return true;

  const joinedAtMs = toDateMs(studentProfile.joined_at || studentProfile.createdAt || studentProfile.enrollDate || studentProfile.enrolledAt);
  if (!Number.isFinite(joinedAtMs)) return false;

  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - joinedAtMs <= sevenDaysMs;
};

const StatusTile = ({ label, value, helper }) => (
  <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#ffffff", display: "grid", gap: 4 }}>
    <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>{label}</p>
    <strong style={{ color: "#0f172a" }}>{value}</strong>
    {helper ? <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>{helper}</p> : null}
  </div>
);

const StartHereStep = ({ number, title, body, action }) => (
  <div style={{ border: "1px solid #dbeafe", borderRadius: 16, padding: 14, background: "#ffffff", display: "grid", gap: 8 }}>
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <span style={{ ...styles.badge, background: "#dbeafe", color: "#1d4ed8", minWidth: 30, justifyContent: "center" }}>{number}</span>
      <div style={{ display: "grid", gap: 4 }}>
        <strong style={{ color: "#0f172a" }}>{title}</strong>
        <p style={{ ...styles.helperText, margin: 0 }}>{body}</p>
      </div>
    </div>
    {action ? <div>{action}</div> : null}
  </div>
);

const NextActionCard = ({ studentProfile, onOpenDay0, onOpenCourseBook, onOpenExamsRoom }) => {
  const levelKey = detectLevelKey(studentProfile);
  const className = studentProfile?.className || "Not assigned yet";
  const showDay0Prompt = shouldShowDay0Prompt(studentProfile, levelKey);
  const courseName = levelKey ? `${levelKey} ${selfLearningLevels.has(levelKey) ? "Self-learning" : "Course"}` : "Course not selected";

  return (
    <section
      style={{
        ...styles.card,
        display: "grid",
        gap: 14,
        border: "1px solid #bfdbfe",
        background: "linear-gradient(135deg, #eff6ff, #ffffff 62%, #f8fafc)",
      }}
    >
      <SectionHeader
        eyebrow="Start here"
        title={levelKey ? `Your current course: ${courseName}` : "Set up your learning path"}
        subtitle={
          levelKey
            ? "Follow the steps below. Falowen works best when you start from the Course Book and complete one small task at a time."
            : "Set your level and class so Falowen can guide your lessons, scores, class links and exam preparation."
        }
        actions={
          <PrimaryActionBar align="flex-end" wrap>
            {levelKey ? <PillBadge tone="info">Course: {levelKey}</PillBadge> : null}
            {studentProfile?.className ? <PillBadge>Assigned class: {studentProfile.className}</PillBadge> : null}
          </PrimaryActionBar>
        }
      />

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        <StatusTile label="Course" value={courseName} helper="This is the level Falowen will guide you through." />
        <StatusTile label="Assigned class" value={className} helper="Used for Zoom, calendar, announcements and school records." />
        <StatusTile label="Access" value={formatContractStatus(studentProfile)} helper="Open Account for payment and profile details." />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        <StartHereStep
          number="1"
          title={showDay0Prompt ? "Open Day 0 Orientation" : "Review the course guide"}
          body="Day 0 explains how to use the course, Study Buddy, Falowen AI, writing practice and exam tools."
          action={<button type="button" style={styles.secondaryButton} onClick={onOpenDay0}>Open Day 0 Orientation</button>}
        />
        <StartHereStep
          number="2"
          title="Continue today’s lesson"
          body="Use Learn, Speak, Write and Finish in order. Do not jump randomly between pages."
          action={<button type="button" style={styles.primaryButton} onClick={onOpenCourseBook}>Open Course Book</button>}
        />
        <StartHereStep
          number="3"
          title="Practise with Study Buddy"
          body="Use the floating Study Buddy at the bottom when you need quick help, AI support, calendar or exam shortcuts."
        />
        <StartHereStep
          number="4"
          title="Check Exam Room"
          body="Use Exam Room for speaking, writing and exam-style readiness practice."
          action={<button type="button" style={styles.secondaryButton} onClick={onOpenExamsRoom}>Open Exams Room</button>}
        />
      </div>
    </section>
  );
};

const B2C1GuidanceCard = ({ levelKey, onOpenDay0, onOpenCourseBook, onOpenExamsRoom }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #c7d2fe", background: "#f8fafc" }}>
    <SectionHeader
      eyebrow="B2/C1 self-learning guide"
      title="Start with Day 0, then continue one lesson at a time"
      subtitle="For B2 and C1, the dashboard focuses on guidance instead of A1-B1 class metrics. Use the buttons below to stay on the correct path."
      actions={
        <PrimaryActionBar align="flex-end" wrap>
          <PillBadge tone="info">{levelKey}</PillBadge>
          <PillBadge>Self-learning</PillBadge>
        </PrimaryActionBar>
      }
    />
    <p style={{ ...styles.helperText, margin: 0 }}>
      Daily routine: Course Book → Learn → Speak → Write → Finish. Use Study Buddy when you feel lost. Use Falowen AI for feedback and improvement, not blind copying.
    </p>
    <PrimaryActionBar align="start" wrap>
      <button type="button" style={styles.secondaryButton} onClick={onOpenDay0}>Open Day 0 Orientation</button>
      <button type="button" style={styles.primaryButton} onClick={onOpenCourseBook}>Continue Course Book</button>
      <button type="button" style={styles.secondaryButton} onClick={onOpenExamsRoom}>Open Exams Room</button>
    </PrimaryActionBar>
  </section>
);

const AnnouncementSection = ({ announcements, announcementStatus, announcementIndex, t }) => (
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
      <p style={{ ...styles.helperText, margin: 0 }}>{t("generalHome.announcements.error")}</p>
    ) : null}
    {announcementStatus === "success" && announcements.length === 0 ? (
      <p style={{ ...styles.helperText, margin: 0 }}>{t("generalHome.announcements.empty")}</p>
    ) : null}
    {announcementStatus === "success" && announcements.length > 0 ? (
      <div className="announcement-slider" aria-label={t("generalHome.announcements.ariaLabel")} aria-live="polite">
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
);

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
  const navigate = useNavigate();
  const playOpenFeedback = useCallback(() => {
    triggerInteractionFeedback({ sound: "open" });
  }, []);
  const preferredClass = studentProfile?.className;
  const classCalendarId = "class-calendar-card";
  const [announcements, setAnnouncements] = useState([]);
  const [announcementStatus, setAnnouncementStatus] = useState("idle");
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const levelKey = detectLevelKey(studentProfile);
  const day0WorkbookLink = day0WorkbookByLevel[levelKey] || "/campus/account";
  const onboardingCompleted = Boolean(studentProfile?.onboardingCompleted);
  const useSelfLearningGuide = selfLearningLevels.has(levelKey);

  const openCampus = useCallback(() => {
    playOpenFeedback();
    onSelectArea("campus");
  }, [onSelectArea, playOpenFeedback]);

  const openExamFile = useCallback(() => {
    playOpenFeedback();
    navigate("/campus/examFile");
  }, [navigate, playOpenFeedback]);

  const openAccount = useCallback(() => {
    playOpenFeedback();
    navigate("/campus/account");
  }, [navigate, playOpenFeedback]);

  const openExamsRoom = useCallback(() => {
    playOpenFeedback();
    onSelectArea("exams");
  }, [onSelectArea, playOpenFeedback]);

  const openDay0 = useCallback(() => {
    playOpenFeedback();
    navigate(day0WorkbookLink);
  }, [day0WorkbookLink, navigate, playOpenFeedback]);

  const joinZoom = useCallback(() => {
    playOpenFeedback();
    window.open(ZOOM_DETAILS.url, "_blank", "noreferrer");
  }, [playOpenFeedback]);

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

  if (!onboardingCompleted) {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <section
          style={{
            ...styles.card,
            display: "grid",
            gap: 10,
            background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
            color: "#ffffff",
            border: "none",
            boxShadow: "0 18px 36px rgba(37,99,235,0.22)",
          }}
        >
          <p style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af", margin: 0 }}>
            First-time setup
          </p>
          <h2 style={{ margin: 0, fontSize: 28 }}>Complete onboarding before opening your dashboard</h2>
          <p style={{ margin: 0, color: "#dbeafe", lineHeight: 1.6 }}>
            This page shows only the important setup steps. When you finish and save, Falowen will unlock the normal home dashboard with your next step, metrics, Campus, Exams Room, and class links.
          </p>
        </section>

        <OnboardingChecklist
          notificationStatus={notificationStatus}
          onEnableNotifications={onEnableNotifications}
          onSelectLevel={handleSelectLevel}
          onConfirmClass={handleConfirmClass}
          studentProfile={studentProfile}
          onSaveOnboarding={onSaveOnboarding}
        />

        <section style={{ ...styles.card, display: "grid", gap: 12 }}>
          <SectionHeader
            eyebrow="Class access"
            title="Check your Zoom and calendar here"
            subtitle="Use this during onboarding only. After setup, it will move into the dashboard under Live class access & calendar."
          />
          <ClassCalendarCard
            id={classCalendarId}
            initialClassName={preferredClass}
            program={studentProfile?.program}
          />
        </section>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <WelcomeHero
        studentProfile={studentProfile}
        onOpenExamFile={openExamFile}
        onJoinZoom={joinZoom}
        onContinueLearning={openCampus}
        onOpenAccount={openAccount}
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
            <button style={styles.primaryButton} onClick={openAccount}>
              {t("generalHome.paymentAlert.cta")}
            </button>
          </PrimaryActionBar>
        </section>
      ) : null}

      <NextActionCard
        studentProfile={studentProfile}
        onOpenDay0={openDay0}
        onOpenCourseBook={openCampus}
        onOpenExamsRoom={openExamsRoom}
      />

      {useSelfLearningGuide ? (
        <B2C1GuidanceCard
          levelKey={levelKey}
          onOpenDay0={openDay0}
          onOpenCourseBook={openCampus}
          onOpenExamsRoom={openExamsRoom}
        />
      ) : (
        <HomeMetrics studentProfile={studentProfile} />
      )}

      <NavigationGuide />

      <div style={styles.gridTwo}>
        <section
          style={{
            ...styles.card,
            display: "grid",
            gap: 10,
            background: "linear-gradient(130deg, rgba(238, 242, 255, 0.9), rgba(255, 255, 255, 0.96))",
            borderColor: "#c7d2fe",
          }}
        >
          <SectionHeader
            eyebrow={t("generalHome.campus.eyebrow")}
            title={t("generalHome.campus.title")}
            subtitle="Course book, assignments, scores, grammar help, and class work."
            actions={
              <PrimaryActionBar align="flex-end">
                <PillBadge tone="success">Course work</PillBadge>
                <PillBadge>Daily work</PillBadge>
              </PrimaryActionBar>
            }
          />
          <ul style={{ ...styles.checklist, margin: 0 }}>
            <li>{t("generalHome.campus.points.0")}</li>
            <li>{t("generalHome.campus.points.1")}</li>
            <li>{t("generalHome.campus.points.2")}</li>
          </ul>
          <PrimaryActionBar align="start">
            <button style={styles.primaryButton} onClick={openCampus}>
              Enter Campus
            </button>
          </PrimaryActionBar>
        </section>

        <section
          style={{
            ...styles.card,
            display: "grid",
            gap: 10,
            background: "linear-gradient(130deg, rgba(239, 246, 255, 0.95), rgba(255, 255, 255, 0.97))",
            borderColor: "#bfdbfe",
          }}
        >
          <SectionHeader
            eyebrow={t("generalHome.exams.eyebrow")}
            title={t("generalHome.exams.title")}
            subtitle="Speaking, Schreiben, exam readiness, and preparation resources."
            actions={
              <PrimaryActionBar align="flex-end">
                <PillBadge tone="info">Exam mode</PillBadge>
              </PrimaryActionBar>
            }
          />
          <ul style={{ ...styles.checklist, margin: 0 }}>
            <li>{t("generalHome.exams.points.0")}</li>
            <li>{t("generalHome.exams.points.1")}</li>
            <li>{t("generalHome.exams.points.2")}</li>
          </ul>
          <PrimaryActionBar align="start">
            <button style={styles.secondaryButton} onClick={openExamsRoom}>
              Open Exams Room
            </button>
          </PrimaryActionBar>
        </section>
      </div>

      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <details style={{ ...styles.card, background: "#f8fafc" }}>
          <summary style={{ ...styles.sectionTitle, cursor: "pointer", margin: 0 }}>
            ▶ Live class access & calendar
          </summary>
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Zoom meeting, class dates, calendar download, and next live class details.
            </p>
            <ClassCalendarCard
              id={classCalendarId}
              initialClassName={preferredClass}
              program={studentProfile?.program}
            />
          </div>
        </details>
      </section>

      <AnnouncementSection
        announcements={announcements}
        announcementStatus={announcementStatus}
        announcementIndex={announcementIndex}
        t={t}
      />

      <section style={{ ...styles.card, marginBottom: 0 }}>
        <PrimaryActionBar align="start">
          <YouTubeSubscribeButton />
        </PrimaryActionBar>
      </section>
    </div>
  );
};

export default GeneralHome;
