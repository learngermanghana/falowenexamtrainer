import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { toDateMs } from "../lib/dateUtils";
import { getTrialLifecycleState } from "../lib/trialAccess";
import { ZOOM_DETAILS } from "../data/classCatalog";
import ClassCalendarCard from "./ClassCalendarCard";
import OnboardingChecklist from "./OnboardingChecklist";
import OnboardingStudyBuddyStart from "./OnboardingStudyBuddyStart";
import { buildFullClassScheduleUrl, getHomeClassIdentity } from "../utils/homeClassSchedule";
import HomeMetrics from "./HomeMetrics";
import SwahiliClassDashboard from "./SwahiliClassDashboard";
import TrialCountdownBanner from "./TrialCountdownBanner";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import { PrimaryActionBar, SectionHeader } from "./ui";
import "./GeneralHome.css";
import { formatCurrency } from "../lib/formatters";
import LegalFooter from "./LegalFooter";
import { detectLevelKey } from "../lib/day0Workbook";
import { getCampusProgram } from "../utils/campusProgram";

const classLevelFromName = (className = "") => {
  const match = String(className || "").toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match?.[1] || "";
};

const WelcomeHero = ({ studentProfile, className = "", classId = "", onViewClassSchedule, onJoinZoom, onOpenAccount, isSwahili = false, examOnly = false }) => {
  const { t } = useTranslation();
  const studentName =
    studentProfile?.name || studentProfile?.displayName || t("generalHome.welcome.studentFallback");
  const levelKey = detectLevelKey(studentProfile);
  const hasAssignedClass = Boolean(className || classId);

  return (
    <div className={"falowen-learner-hero" + (isSwahili ? " falowen-learner-hero--single" : "")}>
      <section className="falowen-learner-hero__welcome" aria-label={t("homeAccess.welcomeAria")}>
        <h1>{t("homeAccess.welcomeBack", { name: studentName })}</h1>
        <p className="falowen-learner-hero__lead">{t("homeAccess.welcomeLead")}</p>
        <div className="falowen-learner-hero__actions">
          <button type="button" className="falowen-learner-hero__secondary" onClick={onOpenAccount}>{t("homeAccess.account")}</button>
          {!isSwahili && !examOnly && (
            <button type="button" className="falowen-learner-hero__zoom" onClick={onJoinZoom}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="6" width="13" height="12" rx="2" />
                <path d="m16 10 5-3v10l-5-3" />
              </svg>
              {t("generalHome.welcome.joinZoom")}
            </button>
          )}
        </div>
      </section>
      {!isSwahili && !examOnly && (
        <section className="falowen-home-class-schedule" aria-label={t("homeAccess.scheduleAria")}>
          <span className="falowen-home-class-schedule__eyebrow">{t("homeAccess.liveClass")}</span>
          <div className="falowen-home-class-schedule__identity">
            <span className="falowen-home-class-schedule__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M7 3v4M17 3v4M3 10h18" />
              </svg>
            </span>
            <h2>{hasAssignedClass ? (className || t("homeAccess.assignedClass")) : t("homeAccess.noLiveClass")}</h2>
          </div>
          <p>{hasAssignedClass
            ? t("homeAccess.assignedScheduleDesc")
            : t("homeAccess.pendingScheduleDesc")}</p>
          {levelKey && <span className="falowen-home-class-schedule__level">{t("homeAccess.germanLevel", { level: levelKey })}</span>}
          <button type="button" className="falowen-home-class-schedule__action"
                  onClick={hasAssignedClass ? onViewClassSchedule : onOpenAccount}>
            <span>{hasAssignedClass ? t("homeAccess.viewSchedule") : t("homeAccess.manageClass")}</span>
            <span aria-hidden="true">→</span>
          </button>
        </section>
      )}
    </div>
  );
};

const QuickMainAccess = ({ t, openCampus, openExamsRoom, isSwahili = false, swahiliLevel }) => (
  <section className="falowen-home-spaces" aria-label={t("homeAccess.spaces")}>
    <div className="falowen-home-spaces__heading">
      <h2>{t("homeAccess.spaces")}</h2>
      <p>{isSwahili ? t("homeAccess.spacesSw") : t("homeAccess.spacesBoth")}</p>
    </div>
    <div className={"falowen-home-spaces__grid" + (isSwahili ? " falowen-home-spaces__grid--single" : "")}>
      <section className="falowen-home-space-card">
        <div className="falowen-home-space-card__top">
          <span className="falowen-home-space-card__icon falowen-home-space-card__icon--campus">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 6.7C9.7 5 6.4 4.7 3 5.5V19c3.7-1 6.7-.5 9 1.2 2.3-1.7 5.3-2.2 9-1.2V5.5c-3.4-.8-6.7-.5-9 1.2Z" />
              <path d="M12 6.7v13.5" />
            </svg>
          </span>
          <div className="falowen-home-space-card__heading">
            <span className="falowen-home-space-card__eyebrow">{t("homeAccess.dailyWork")}</span>
            <h3>Campus</h3>
          </div>
          <span className="falowen-home-space-card__level">{isSwahili ? ["Kiswahili", swahiliLevel].filter(Boolean).join(" ") : t("homeAccess.courseBook")}</span>
        </div>
        <div className="falowen-home-space-card__body">
          <h4>{t("homeAccess.continueLearning")}</h4>
          <p>{isSwahili
            ? t("homeAccess.swBookDesc")
            : t("homeAccess.gerBookDesc")}</p>
        </div>
        <div className="falowen-home-space-card__bottom">
          <button style={styles.primaryButton} onClick={openCampus}>{t("homeAccess.openCourseBook")} <span aria-hidden="true">→</span></button>
        </div>
      </section>

      {!isSwahili && (
        <section className="falowen-home-space-card">
          <div className="falowen-home-space-card__top">
            <span className="falowen-home-space-card__icon falowen-home-space-card__icon--exams">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M9 8h6M9 12h6M9 16h4" />
              </svg>
            </span>
            <div className="falowen-home-space-card__heading">
              <span className="falowen-home-space-card__eyebrow falowen-home-space-card__eyebrow--exams">{t("homeAccess.examMode")}</span>
              <h3>{t("homeAccess.examsRoom")}</h3>
            </div>
          </div>
          <div className="falowen-home-space-card__body">
            <h4>{t("homeAccess.examsSkills")}</h4>
            <p>{t("homeAccess.examsDesc")}</p>
          </div>
          <div className="falowen-home-space-card__bottom falowen-home-space-card__bottom--exams">
            <button type="button" style={styles.primaryButton} onClick={openExamsRoom}>{t("homeAccess.openExams")} <span aria-hidden="true">→</span></button>
          </div>
        </section>
      )}
    </div>
    {!isSwahili && (
      <section className="falowen-home-companion">
        <div>
          <span className="falowen-home-companion__eyebrow">{t("homeAccess.studyWithAi")}</span>
          <h3>Falowen Learning Companion</h3>
          <p>{t("homeAccess.companionDescription")}</p>
        </div>
        <a href="https://chatgpt.com/plugins/plugin_asdk_app_6ae7660094648191b3f39f11008ade2a"
           target="_blank" rel="noopener noreferrer">
          {t("homeAccess.connectChatgpt")} <span aria-hidden="true">→</span>
        </a>
      </section>
    )}
  </section>
);

const GeneralHome = ({
  onSelectArea,
  studentProfile,
  notificationStatus,
  onEnableNotifications,
  onSaveOnboarding,
  browseOnly = false,
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
  const { className: preferredClass, classId: preferredClassId } = getHomeClassIdentity(studentProfile);
  const classCalendarId = "class-calendar-card";
  const levelKey = detectLevelKey(studentProfile);
  const isSwahiliCampus = getCampusProgram(studentProfile) === "swahili";
  const firstLessonPath = isSwahiliCampus ? "/campus/course/swahili/day-1" : levelKey ? `/campus/course/lesson/${levelKey}/1` : "/campus/course";
  const examOnly = studentProfile?.accountType === "exam_only";
  const onboardingCompleted = browseOnly || examOnly || Boolean(studentProfile?.onboardingCompleted);
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

  const openFullClassSchedule = useCallback(() => {
    const scheduleUrl = buildFullClassScheduleUrl({ className: preferredClass, classId: preferredClassId });
    if (!scheduleUrl) {
      navigate("/campus/account");
      return;
    }
    playOpenFeedback();
    navigate(scheduleUrl);
  }, [navigate, playOpenFeedback, preferredClass, preferredClassId]);

  const openAccount = useCallback(() => {
    playOpenFeedback();
    navigate(examOnly ? "/mock/account" : "/campus/account");
  }, [navigate, playOpenFeedback, examOnly]);

  const openBilling = useCallback(() => {
    playOpenFeedback();
    navigate("/campus/account?tab=billing");
  }, [navigate, playOpenFeedback]);

  const openExamsRoom = useCallback(() => {
    playOpenFeedback();
    onSelectArea("exams");
  }, [onSelectArea, playOpenFeedback]);

  const joinZoom = useCallback(() => {
    const lifecycle = getTrialLifecycleState(studentProfile);
    if (examOnly || browseOnly || ["expired_retained", "retention_ending_soon", "purge_due"].includes(lifecycle.key) || (lifecycle.active && !preferredClass && !preferredClassId)) return;
    playOpenFeedback();
    window.open(ZOOM_DETAILS.url, "_blank", "noreferrer");
  }, [playOpenFeedback, examOnly, browseOnly, studentProfile, preferredClass, preferredClassId]);

  const paymentAlert = useMemo(() => {
    const balanceDue = Math.max(Number(studentProfile?.balanceDue) || 0, 0);
    if (examOnly || balanceDue <= 0) return null;
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
  }, [examOnly, formatTimeUnit, locale, studentProfile?.balanceDue, studentProfile?.contractEnd, translate]);

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
            subtitle="Use this during onboarding only. After setup, open View schedule on your homepage to see your class timetable."
          />
          <ClassCalendarCard id={classCalendarId} initialClassName={preferredClass} initialClassId={preferredClassId} program={studentProfile?.program} />
        </section>
        <LegalFooter />
      </div>
    );
  }

  // The same Falowen cards and actions serve both programmes. Do not mount
  // German exam preparation, German score metrics, German music, or the German
  // ChatGPT companion for a Kiswahili student.
  if (isSwahiliCampus) {
    return (
      <div className="falowen-home-dashboard falowen-home-dashboard--swahili">
        <WelcomeHero
          studentProfile={studentProfile}
          isSwahili
          onOpenAccount={openAccount}
        />
        <TrialCountdownBanner studentProfile={studentProfile} onCompletePayment={isSwahiliCampus ? openBilling : () => navigate("/mock/payment")} />
        {paymentAlert ? (
          <section style={{ ...styles.card, background: "#fffbeb", border: "1px solid #f59e0b", display: "grid", gap: 8 }}>
            <strong>{paymentAlert.message}</strong>
            <PrimaryActionBar align="start">
              <button style={styles.primaryButton} onClick={openAccount}>{t("generalHome.paymentAlert.cta")}</button>
            </PrimaryActionBar>
          </section>
        ) : null}
        {!browseOnly && !examOnly && <SwahiliClassDashboard studentProfile={studentProfile} level={levelKey?.toUpperCase()} />}
        <QuickMainAccess t={t} openCampus={openCampus} isSwahili swahiliLevel={levelKey?.toUpperCase()} />
        {(!levelKey || levelKey.toUpperCase() === "A1") && <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <SectionHeader
            eyebrow="Kiswahili A1"
            title={t("uiLanguageFlow.publishedLessons")}
            subtitle={t("homeAccess.publishedDesc")}
          />
          <PrimaryActionBar align="start" wrap>
            <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/course/swahili/day-1")}>
              Somo la 1 · Alfabeti na matamshi
            </button>
            <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/course/swahili/day-6")}>
              Somo la 6 · Mgahawani
            </button>
          </PrimaryActionBar>
        </section>}
        <LegalFooter />
      </div>
    );
  }

  return (
    <div className="falowen-home-dashboard">
      {!examOnly && !browseOnly && new URLSearchParams(location.search).get("welcome") === "1" ? (
        <OnboardingStudyBuddyStart firstLessonPath={firstLessonPath} />
      ) : null}
      <WelcomeHero
        studentProfile={studentProfile}
        examOnly={examOnly || browseOnly}
        className={preferredClass}
        classId={preferredClassId}
        onViewClassSchedule={openFullClassSchedule}
        onJoinZoom={joinZoom}
        onOpenAccount={openAccount}
      />

      <TrialCountdownBanner studentProfile={studentProfile} onCompletePayment={isSwahiliCampus ? openBilling : () => navigate("/mock/payment")} />

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
      {examOnly && <section style={styles.card}><h3>Exam preparation access</h3><p>Explore Campus Day 1 and browse your exam room. Subscribe when you are ready to unlock more practice.</p><button style={styles.secondaryButton} onClick={() => navigate("/mock/payment")}>Payment options</button></section>}

      {!examOnly && <div className="falowen-home-section-break falowen-home-section-break--metrics">
        <HomeMetrics studentProfile={metricsStudentProfile} />
      </div>}

      <LegalFooter />
    </div>
  );
};

export default GeneralHome;
