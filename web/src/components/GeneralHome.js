import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { ZOOM_DETAILS } from "../data/classCatalog";
import ClassCalendarCard from "./ClassCalendarCard";
import HomeMetrics from "./HomeMetrics";
import OnboardingChecklist from "./OnboardingChecklist";
import NavigationGuide from "./NavigationGuide";
import ExamReadinessBadge from "./ExamReadinessBadge";
import { PillBadge, PrimaryActionBar, SectionHeader } from "./ui";

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
  const preferredClass = studentProfile?.className;
  const navigate = useNavigate();
  const classCalendarId = "class-calendar-card";
  const paymentAlert = useMemo(() => {
    const balanceDue = Math.max(Number(studentProfile?.balanceDue) || 0, 0);
    if (balanceDue <= 0) return null;
    if (!studentProfile?.contractEnd) return null;
    const contractEndMs = Date.parse(studentProfile.contractEnd);
    if (!Number.isFinite(contractEndMs)) return null;
    const dayMs = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((contractEndMs - Date.now()) / dayMs);
    if (daysLeft < 0 || daysLeft > 15) return null;

    const amount = `GH₵${balanceDue.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

    return {
      daysLeft,
      message:
        daysLeft === 0
          ? `Your access ends today and you still owe ${amount}. Please make a payment to keep access.`
          : `You still owe ${amount} and have ${daysLeft} day${daysLeft === 1 ? "" : "s"} left. Please make a payment to keep access.`,
    };
  }, [studentProfile?.balanceDue, studentProfile?.contractEnd]);

  const handleSelectLevel = () => navigate("/campus/account");
  const handleConfirmClass = () => {
    const calendarSection = document.getElementById(classCalendarId);
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    navigate("/");
  };

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

      <NavigationGuide
        onOpenCourse={() => navigate("/campus/course")}
        onSubmitAssignment={() => navigate("/campus/submit")}
        onAskAI={() => navigate("/campus/grammar")}
        onOpenExams={() => navigate("/exams/speaking")}
      />

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
              </PrimaryActionBar>
            }
          />
          <p style={{ ...styles.helperText, margin: 0 }}>
            Course work, assignments, AI helpers, discussion, and your account settings in one hub.
          </p>
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
          <p style={{ ...styles.helperText, margin: 0 }}>
            Speaking prompts, Schreiben trainer, and Goethe exam resources in one place.
          </p>
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
        <details style={{ ...styles.card, background: "#f8fafc" }}>
          <summary style={{ ...styles.sectionTitle, cursor: "pointer", margin: 0 }}>More for you</summary>
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <HomeMetrics studentProfile={studentProfile} />
            <ClassCalendarCard id={classCalendarId} initialClassName={preferredClass} />
          </div>
        </details>
      </section>
    </div>
  );
};

export default GeneralHome;
