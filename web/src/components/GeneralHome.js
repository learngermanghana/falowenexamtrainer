import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import ClassCalendarCard from "./ClassCalendarCard";
import HomeMetrics from "./HomeMetrics";
import OnboardingChecklist from "./OnboardingChecklist";

const WelcomeHero = ({ studentProfile }) => {
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
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <span style={{ ...styles.badge, background: "#d1fae5", color: "#065f46" }}>Keep your streak alive</span>
      </div>
    </section>
  );
};

const GeneralHome = ({ onSelectArea, studentProfile, notificationStatus, onEnableNotifications }) => {
  const preferredClass = studentProfile?.className;
  const navigate = useNavigate();
  const classCalendarId = "class-calendar-card";

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
      <WelcomeHero studentProfile={studentProfile} />
      <OnboardingChecklist
        notificationStatus={notificationStatus}
        onEnableNotifications={onEnableNotifications}
        onSelectLevel={handleSelectLevel}
        onConfirmClass={handleConfirmClass}
      />
      <section style={styles.card}>
        <p style={{ ...styles.helperText, margin: 0 }}>Welcome back</p>
        <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Choose your learning space</h2>
        <p style={styles.helperText}>
          Pick the area that matches your focus today. All instructions stay in English so you can navigate quickly and spend
          more time practising.
        </p>
      </section>

      <div style={styles.gridTwo}>
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ ...styles.helperText, margin: 0 }}>Campus</p>
              <h3 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Classes, course book, and AI helpers</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ ...styles.badge, background: "#d1fae5", color: "#065f46", borderColor: "#bbf7d0" }}>
                Start here
              </span>
              <span style={styles.badge}>Daily work</span>
            </div>
          </div>
          <ul style={{ ...styles.checklist, margin: 0 }}>
            <li>Course book access, assignment submission, and results.</li>
            <li>Grammar Q&amp;A, Chat Buddy, and the original writing coach.</li>
            <li>Group discussion and your account settings.</li>
          </ul>
          <p style={{ ...styles.helperText, marginBottom: 6 }}>
            Start in Campus for daily work; use Exams Room for mock exam practice.
          </p>
          <div>
            <button style={styles.primaryButton} onClick={() => onSelectArea("campus")}>
              Enter Campus
            </button>
          </div>
        </section>

        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ ...styles.helperText, margin: 0 }}>Exams Room</p>
              <h3 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Speaking, Schreiben trainer, resources</h3>
            </div>
            <span style={styles.badge}>Exam mode</span>
          </div>
          <ul style={{ ...styles.checklist, margin: 0 }}>
            <li>Speaking practice prompts organised by level.</li>
            <li>Schreiben trainer with timed letters and idea generation.</li>
            <li>Goethe Lesen/Hören links and quick exam-day reminders.</li>
          </ul>
          <p style={{ ...styles.helperText, marginBottom: 6 }}>
            Start in Campus for daily work; use Exams Room for mock exam practice.
          </p>
          <div>
            <button style={styles.secondaryButton} onClick={() => onSelectArea("exams")}>
              Go to Exams Room
            </button>
          </div>
        </section>
      </div>

      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <details open style={{ ...styles.card, background: "#f8fafc" }}>
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
