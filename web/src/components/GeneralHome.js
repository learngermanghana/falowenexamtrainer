import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { toDateMs } from "../lib/dateUtils";
import { ZOOM_DETAILS } from "../data/classCatalog";
import ClassCalendarCard from "./ClassCalendarCard";
import OnboardingChecklist from "./OnboardingChecklist";
import OnboardingStudyBuddyStart from "./OnboardingStudyBuddyStart";
import { buildFullClassScheduleUrl, getHomeClassIdentity } from "../utils/homeClassSchedule";
import HomeMetrics from "./HomeMetrics";
import TrialCountdownBanner from "./TrialCountdownBanner";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import { PrimaryActionBar, SectionHeader } from "./ui";
import "./GeneralHome.css";
import { formatCurrency } from "../lib/formatters";
import LegalFooter from "./LegalFooter";
import HomepageHighlights from "./HomepageHighlights";
import { detectLevelKey } from "../lib/day0Workbook";
import { getCampusProgram } from "../utils/campusProgram";

const classLevelFromName = (className = "") => {
  const match = String(className || "").toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match?.[1] || "";
};

const WelcomeHero = ({ studentProfile, className = "", classId = "", onViewClassSchedule, onJoinZoom, onOpenAccount, isSwahili = false }) => {
  const { t } = useTranslation();
  const studentName =
    studentProfile?.name || studentProfile?.displayName || t("generalHome.welcome.studentFallback");
  const levelKey = detectLevelKey(studentProfile);
  const hasAssignedClass = Boolean(className || classId);

  return (
    <div className={"falowen-learner-hero" + (isSwahili ? " falowen-learner-hero--single" : "")}>
      <section className="falowen-learner-hero__welcome" aria-label="Welcome to Falowen">
        <h1>Welcome back, {studentName}.</h1>
        <p className="falowen-learner-hero__lead">Your campus is ready. Let’s make progress.</p>
        <div className="falowen-learner-hero__actions">
          <button type="button" className="falowen-learner-hero__secondary" onClick={onOpenAccount}>Account</button>
          {!isSwahili && (
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
      {!isSwahili && (
        <section className="falowen-home-class-schedule" aria-label="Your class schedule">
          <span className="falowen-home-class-schedule__eyebrow">YOUR LIVE CLASS</span>
          <div className="falowen-home-class-schedule__identity">
            <span className="falowen-home-class-schedule__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M7 3v4M17 3v4M3 10h18" />
              </svg>
            </span>
            <h2>{hasAssignedClass ? (className || "Your assigned class") : "No live class assigned"}</h2>
          </div>
          <p>{hasAssignedClass
            ? "Your full timetable includes upcoming lessons, dates and any schedule changes."
            : "You can continue studying in Campus. Your class schedule will appear after a class is assigned."}</p>
          {levelKey && <span className="falowen-home-class-schedule__level">{levelKey} German</span>}
          <button type="button" className="falowen-home-class-schedule__action"
                  onClick={hasAssignedClass ? onViewClassSchedule : onOpenAccount}>
            <span>{hasAssignedClass ? "View full class schedule" : "Manage class in Account"}</span>
            <span aria-hidden="true">→</span>
          </button>
        </section>
      )}
    </div>
  );
};

const QuickMainAccess = ({ t, openCampus, openExamsRoom, isSwahili = false }) => (
  <section className="falowen-home-spaces" aria-label="Your learning spaces">
    <div className="falowen-home-spaces__heading">
      <h2>Your learning spaces</h2>
      <p>{isSwahili ? "Your learning space, ready when you are." : "Two spaces. One step closer to fluent."}</p>
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
            <span className="falowen-home-space-card__eyebrow">DAILY WORK</span>
            <h3>Campus</h3>
          </div>
          <span className="falowen-home-space-card__level">{isSwahili ? "Kiswahili A1" : "Course Book"}</span>
        </div>
        <div className="falowen-home-space-card__body">
          <h4>Continue learning</h4>
          <p>{isSwahili
            ? "Open your Kiswahili Course Book for published lessons, writing and reading tasks, and tutor feedback."
            : "Open Course Book to see your current lesson and next step, practise, or submit finished workbook answers."}</p>
        </div>
        <div className="falowen-home-space-card__bottom">
          <button style={styles.primaryButton} onClick={openCampus}>Open Course Book <span aria-hidden="true">→</span></button>
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
              <span className="falowen-home-space-card__eyebrow falowen-home-space-card__eyebrow--exams">EXAM MODE</span>
              <h3>Exams Room</h3>
            </div>
          </div>
          <div className="falowen-home-space-card__body">
            <h4>Sprechen, Schreiben trainer & resources</h4>
            <p>Choose an available mock or practise one exam skill; review your results in the Exam Room.</p>
          </div>
          <div className="falowen-home-space-card__bottom falowen-home-space-card__bottom--exams">
            <button type="button" style={styles.primaryButton} onClick={openExamsRoom}>Open Exams Room <span aria-hidden="true">→</span></button>
          </div>
        </section>
      )}
    </div>
    {!isSwahili && (
      <section className="falowen-home-companion">
        <div>
          <span className="falowen-home-companion__eyebrow">STUDY WITH AI</span>
          <h3>Falowen Learning Companion</h3>
          <p>Connect Falowen in ChatGPT to ask questions about your German lessons and get guided practice.</p>
        </div>
        <a href="https://chatgpt.com/plugins/plugin_asdk_app_6ae7660094648191b3f39f11008ade2a"
           target="_blank" rel="noopener noreferrer">
          Connect ChatGPT as a study partner <span aria-hidden="true">→</span>
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
            subtitle="Use this during onboarding only. After setup, your next scheduled class will appear in the homepage Highlights section."
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
        <TrialCountdownBanner studentProfile={studentProfile} onCompletePayment={openBilling} />
        {paymentAlert ? (
          <section style={{ ...styles.card, background: "#fffbeb", border: "1px solid #f59e0b", display: "grid", gap: 8 }}>
            <strong>{paymentAlert.message}</strong>
            <PrimaryActionBar align="start">
              <button style={styles.primaryButton} onClick={openAccount}>{t("generalHome.paymentAlert.cta")}</button>
            </PrimaryActionBar>
          </section>
        ) : null}
        <QuickMainAccess t={t} openCampus={openCampus} isSwahili />
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <SectionHeader
            eyebrow="Kiswahili A1"
            title="Published lessons"
            subtitle="Start with the alphabet or practise ordering in a restaurant. Only these two workbooks are published."
          />
          <PrimaryActionBar align="start" wrap>
            <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/course/swahili/day-1")}>
              Somo la 1 · Alfabeti na matamshi
            </button>
            <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/course/swahili/day-6")}>
              Somo la 6 · Mgahawani
            </button>
          </PrimaryActionBar>
        </section>
        <LegalFooter />
      </div>
    );
  }

  return (
    <div className="falowen-home-dashboard">
      {new URLSearchParams(location.search).get("welcome") === "1" ? (
        <OnboardingStudyBuddyStart firstLessonPath={firstLessonPath} />
      ) : null}
      <WelcomeHero
        studentProfile={studentProfile}
        className={preferredClass}
        classId={preferredClassId}
        onViewClassSchedule={openFullClassSchedule}
        onJoinZoom={joinZoom}
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
      <div className="falowen-home-section-break falowen-home-section-break--highlights">
        <HomepageHighlights
          className={preferredClass}
          classId={preferredClassId}
          level={assignedClassLevel || levelKey}
          program={studentProfile?.program}
        />
      </div>

      <div className="falowen-home-section-break falowen-home-section-break--metrics">
        <HomeMetrics studentProfile={metricsStudentProfile} />
      </div>

      <LegalFooter />
    </div>
  );
};

export default GeneralHome;
