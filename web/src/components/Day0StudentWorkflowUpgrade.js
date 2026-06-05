import React from "react";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";

const day0PathConfig = [
  { match: "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook", level: "A1", hasClassNotes: false },
  { match: "/campus/course/a2-day-0-orientation-and-knowledge-test-workbook", level: "A2", hasClassNotes: true },
  { match: "/campus/course/b1-day-0-orientation-and-knowledge-test-workbook", level: "B1", hasClassNotes: true },
];

const List = ({ children }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6, lineHeight: 1.65 }}>{children}</ul>
);

const Box = ({ title, children, tone = "blue" }) => {
  const toneStyles = {
    blue: { border: "#bfdbfe", bg: "#eff6ff", title: "#1e40af" },
    green: { border: "#bbf7d0", bg: "#f0fdf4", title: "#166534" },
    amber: { border: "#fde68a", bg: "#fffbeb", title: "#92400e" },
  };
  const selected = toneStyles[tone] || toneStyles.blue;
  return (
    <section style={{ ...styles.card, margin: 0, border: `1px solid ${selected.border}`, background: selected.bg, display: "grid", gap: 10 }}>
      <h3 style={{ margin: 0, color: selected.title }}>{title}</h3>
      {children}
    </section>
  );
};

const Day0StudentWorkflowUpgrade = () => {
  const location = useLocation();
  const config = day0PathConfig.find((item) => location.pathname === item.match);
  if (!config) return null;

  return (
    <section style={{ ...styles.card, display: "grid", gap: 12, border: "2px solid #2563eb", background: "linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
        <div>
          <p style={{ ...styles.helperText, margin: 0, color: "#2563eb", fontWeight: 800 }}>Updated Day 0 guide</p>
          <h2 style={{ margin: "4px 0 0" }}>{config.level} Student Workflow</h2>
        </div>
        <span style={{ ...styles.badge, background: "#dbeafe", color: "#1d4ed8" }}>Read before Day 1</span>
      </div>

      <Box title="1. How the course works">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Start every day from the Course Book. Read the instruction, study the lesson material, practise with the available tools, and then complete the required assignment parts.
        </p>
        <List>
          <li><strong>Teil 1 · Sprechen</strong> is preparation and class practice.</li>
          <li><strong>Teil 2 · Schreiben</strong> is writing practice and assignment work.</li>
          <li><strong>Teil 3 · Lesen</strong> is reading practice and assignment work.</li>
          <li><strong>Teil 4 · Hören</strong> is listening practice and assignment work.</li>
          {config.hasClassNotes ? <li><strong>Teil 5 · Class Notes</strong> is where class vocabulary, Zoom notes, corrections, reminders and questions are saved.</li> : null}
        </List>
      </Box>

      <Box title="2. How to submit" tone="green">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Use the course lesson pages for practice, but submit final assignment answers in the <strong>Submission</strong> tab.
        </p>
        {config.level === "A1" ? (
          <p style={{ margin: 0, lineHeight: 1.65 }}>
            In A1, the main submitted assignment parts are usually <strong>Lesen</strong> and <strong>Hören</strong>. Schreiben and Sprechen are practical training tasks, but students should still complete them seriously.
          </p>
        ) : (
          <p style={{ margin: 0, lineHeight: 1.65 }}>
            In {config.level}, submit <strong>Teil 2 · Schreiben</strong>, <strong>Teil 3 · Lesen</strong> and <strong>Teil 4 · Hören</strong>. Teil 1 is for class speaking preparation, and Teil 5 is not an assignment.
          </p>
        )}
      </Box>

      <Box title="3. How to use Falowen AI">
        <List>
          <li>Use AI tools to practise before submitting final work.</li>
          <li>Use <strong>Mark My Letter</strong> to check writing and improve structure.</li>
          <li>Use the speaking coach to practise your answer before class.</li>
          <li>Use grammar help when you do not understand a rule.</li>
          <li>Do not copy AI blindly. Improve your own work and submit your clean final version.</li>
        </List>
      </Box>

      <Box title="4. Scores, pass mark and certificate" tone="amber">
        <List>
          <li>Check your marked work in the <strong>Results</strong> page.</li>
          <li>The pass mark for assignments is <strong>60%</strong>.</li>
          <li>To complete the course properly, students must complete all required assignments and pass them.</li>
          <li>Certificates are emailed to students after course completion, when required assignments are completed and passed.</li>
          <li>The certificate is not automatic just for attending class; assignment completion and pass marks matter.</li>
        </List>
      </Box>

      {config.hasClassNotes ? (
        <Box title="5. How to use Class Notes">
          <List>
            <li>Open <strong>Teil 5 · Class Notes</strong> inside the lesson.</li>
            <li>Your tutor can save vocabulary from Zoom, corrections, reminders and short explanations there.</li>
            <li>Students can also ask short questions inside Class Notes.</li>
            <li>When someone posts in Class Notes, students with notifications enabled can receive a notification.</li>
          </List>
        </Box>
      ) : null}

      <Box title={config.hasClassNotes ? "6. Enable notifications" : "5. Enable notifications"}>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Open <strong>Account → Notifications</strong> and enable notifications on your device. This helps you receive score updates, class notes, payment reminders and important announcements.
        </p>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          On iPhone, add Falowen to your Home Screen first, open it from the Home Screen icon, then enable notifications.
        </p>
      </Box>
    </section>
  );
};

export default Day0StudentWorkflowUpgrade;
