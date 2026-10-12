import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { toDateMs } from "../lib/dateUtils";
import { ZOOM_DETAILS } from "../data/classCatalog";
import ClassCalendarCard from "./ClassCalendarCard";
import OnboardingChecklist from "./OnboardingChecklist";
import FirstLessonGuide from "./FirstLessonGuide";
import OnboardingStudyBuddyStart from "./OnboardingStudyBuddyStart";
import ExamReadinessBadge from "./ExamReadinessBadge";
import HomeMetrics from "./HomeMetrics";
import TrialCountdownBanner from "./TrialCountdownBanner";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import { PillBadge, PrimaryActionBar, SectionHeader } from "./ui";
import { formatCurrency } from "../lib/formatters";
import LegalFooter from "./LegalFooter";
import { detectLevelKey } from "../lib/day0Workbook";

const day0WorkbookByLevel = {
  A1: "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook",
  A2: "/campus/course/a2-day-0-orientation-and-knowledge-test-workbook",
  B1: "/campus/course/b1-day-0-orientation-and-knowledge-test-workbook",
  B2: "/campus/course/lesson/B2/0",
  C1: "/campus/course/lesson/C1/0",
};

const classLevelFromName = (className = "") => {
  const match = String(className || "").toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match?.[1] || "";
};

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
        <button
          type="button"
          style={{ ...styles.primaryButton, background: "#dcfce7", color: "#14532d", borderColor: "#bbf7d0" }}
          onClick={onContinueLearning}
        >
          Open Campus
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
        <ExamReadinessBadge variant="button" studentProfile={studentProfile} onOpenExamFile={onOpenExamFile} />
      </PrimaryActionBar>
    </section>
  );
};

const QuickMainAccess = ({ t, openCampus, openExamsRoom }) => (
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
        title="Continue learning"
        subtitle="Open Course Book to see your current lesson and next step, practise, or submit finished workbook answers."
        actions={
          <PrimaryActionBar align="flex-end">
            <PillBadge tone="success">Daily work</PillBadge>
          </PrimaryActionBar>
        }
      />
      <PrimaryActionBar align="start">
        <button style={styles.primaryButton} onClick={openCampus}>
          Open Course Book
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
        subtitle="Choose an available mock or practise one exam skill; review your results in the Exam Room."
        actions={
          <PrimaryActionBar align="flex-end">
            <PillBadge tone="info">Exam mode</PillBadge>
          </PrimaryActionBar>
        }
      />
      <PrimaryActionBar align="start">
        <button type="button" style={styles.primaryButton} onClick={openExamsRoom}>
          Open Exams Room
        </button>
      </PrimaryActionBar>
    </section>
  </div>
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
  const location = useLocation();
  const playOpenFeedback = useCallback(() => {
    triggerInteractionFeedback({ sound: "open" });
  }, []);
  const preferredClass = studentProfile?.className;
  const preferredClassId = String(
    studentProfile?.classId || studentProfile?.classRecordId || studentProfile?.assignedClassId || ""
  ).trim();
  const classCalendarId = "class-calendar-card";
  const levelKey = detectLevelKey(studentProfile);
  const day0WorkbookLink = day0WorkbookByLevel[levelKey] || "/campus/account";
  const onboardingCompleted = Boolean(studentProfile?.onboardingCompleted);
  const assignedClassLevel = classLevelFromName(preferredClass);
  const metricsStudentProfile = useMemo(
    () => assignedClassLevel
      ? { ...studentProfile, level: assignedClassLevel, classLevel: assignedClassLevel }
      : studentProfile,
    [assignedClassLevel, studentProfile]
  );

  const openCampus = useCallback(() => {
    playOpenFeedback();
    navigate("/campus/course");
  }, [navigate, playOpenFeedback]);

  const openExamFile = useCallback(() => {
    playOpenFeedback();
    navigate("/campus/examFile");
  }, [navigate, playOpenFeedback]);

  const openAccount = useCallback(() => {
    playOpenFeedback();
    navigate("/campus/account");
  }, [navigate, playOpenFeedback]);

  const openBilling = useCallback(() => {
    playOpenFeedback();
    navigate("/campus/account?tab=billing");
  }, [navigate, playOpenFeedback]);

  const openExamsRoom = useCallback(() => {
    playOpenFeedback();
    onSelectArea("exams");
  }, [onSelectArea, playOpenFeedback]);

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
          <ClassCalendarCard id={classCalendarId} initialClassName={preferredClass} initialClassId={preferredClassId} program={studentProfile?.program} />
        </section>
        <LegalFooter />
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {new URLSearchParams(location.search).get("welcome") === "1" ? (
        <OnboardingStudyBuddyStart orientationPath={day0WorkbookLink} />
      ) : null}
      <WelcomeHero
        studentProfile={studentProfile}
        onOpenExamFile={openExamFile}
        onJoinZoom={joinZoom}
        onContinueLearning={openCampus}
        onOpenAccount={openAccount}
      />

      <TrialCountdownBanner studentProfile={studentProfile} onCompletePayment={openBilling} />

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

      <QuickMainAccess t={t} openCampus={openCampus} openExamsRoom={openExamsRoom} />
      <FirstLessonGuide />

      <HomeMetrics studentProfile={metricsStudentProfile} />

      <ClassCalendarCard id={classCalendarId} initialClassName={preferredClass} initialClassId={preferredClassId} program={studentProfile?.program} homepageCompact />

      <LegalFooter />
    </div>
  );
};

export default GeneralHome;
