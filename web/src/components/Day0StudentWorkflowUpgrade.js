import React from "react";
import { styles } from "../styles";

export const DAY0_PATH_CONFIG = [
  {
    match: "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook",
    level: "A1",
    mode: "tutor",
    workbookFlow: "Assignment → Submit",
    submissionText:
      "Open the lesson workbook, complete the Assignment section, then send only your clean final answers through the Submit tab inside that same workbook.",
    video: {
      id: "qPwxBYlu3CE",
      url: "https://youtu.be/qPwxBYlu3CE",
      title: "A1 Day 0 orientation video",
    },
  },
  {
    match: "/campus/course/a2-day-0-orientation-and-knowledge-test-workbook",
    level: "A2",
    mode: "tutor",
    workbookFlow: "Teil 1 → Teil 2 → Teil 3 → Teil 4 → Ref → Submit",
    submissionText:
      "Teil 1 is speaking preparation. Complete Teil 2, Teil 3 and Teil 4, check Ref when it is available, then submit the required final answers in the workbook Submit tab.",
    video: {
      id: "mY0ArOMOV9Y",
      url: "https://youtu.be/mY0ArOMOV9Y",
      title: "A2 Day 0 orientation video",
    },
  },
  {
    match: "/campus/course/b1-day-0-orientation-and-knowledge-test-workbook",
    level: "B1",
    mode: "tutor",
    workbookFlow: "Teil 1 → Teil 2 → Teil 3 → Teil 4 → Ref → Submit",
    submissionText:
      "Teil 1 is speaking preparation. Complete Teil 2, Teil 3 and Teil 4, use Ref for guidance, then submit the required final answers in the workbook Submit tab.",
  },
  {
    match: "/campus/course/b2-day-0-self-learning-orientation-workbook",
    level: "B2",
    mode: "selfLearning",
    workbookFlow: "Lesson → Falowen Radio → Write/Analyse → Ref → Self-mark progress",
    submissionText:
      "B2 is a self-learning path. Use the Write/Analyse area through Day 20, study the Ref tab, improve your work with Falowen AI and record your own progress. Do not look for the retired Submit Assignment page.",
  },
  {
    match: "/campus/course/c1-day-0-progression-workbook",
    level: "C1",
    mode: "selfLearning",
    workbookFlow: "Lesson → Falowen Radio → Write/Analyse → Ref → Self-mark progress",
    submissionText:
      "C1 is a self-learning path. Use the Write/Analyse area through Day 20, compare your work with Ref, improve it with Falowen AI and record your own progress. A tutor Submit tab appears only where a lesson explicitly provides one.",
  },
];

const palette = {
  page: "#f6f1e9",
  card: "#fffaf3",
  ink: "#1f1d2b",
  muted: "#6f6a80",
  amber: "#d97706",
  amberSoft: "#fed7aa",
  blue: "#2563eb",
  border: "#eadfd0",
};

const getYouTubeEmbedUrl = (videoId = "") =>
  `https://www.youtube-nocookie.com/embed/${videoId}`;

const List = ({ children }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6, lineHeight: 1.65 }}>
    {children}
  </ul>
);

const Pill = ({ children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      width: "fit-content",
      border: `1px solid ${palette.border}`,
      borderRadius: 999,
      padding: "5px 9px",
      color: palette.muted,
      background: "rgba(255,255,255,0.72)",
      fontWeight: 800,
      fontSize: 12,
    }}
  >
    {children}
  </span>
);

const Box = ({ title, children, tone = "cream", icon = "" }) => {
  const toneStyles = {
    cream: { border: palette.border, bg: palette.card, title: palette.ink },
    blue: { border: "#bfdbfe", bg: "#eff6ff", title: "#1e40af" },
    green: { border: "#bbf7d0", bg: "#f0fdf4", title: "#166534" },
    amber: { border: "#fde68a", bg: "#fffbeb", title: "#92400e" },
  };
  const selected = toneStyles[tone] || toneStyles.cream;

  return (
    <section
      style={{
        ...styles.card,
        margin: 0,
        border: `1px solid ${selected.border}`,
        background: selected.bg,
        display: "grid",
        gap: 10,
        boxShadow: "0 8px 20px rgba(120, 53, 15, 0.05)",
      }}
    >
      <h3 style={{ margin: 0, color: selected.title }}>
        {icon ? `${icon} ` : ""}
        {title}
      </h3>
      {children}
    </section>
  );
};

const OrientationVideoBox = ({ video }) => {
  if (!video?.id) return null;

  return (
    <Box title="Start here: Watch the Day 0 orientation video" tone="green" icon="▶️">
      <p style={{ margin: 0, lineHeight: 1.65 }}>
        Watch the orientation first, then continue with this guide. Day 0 is orientation only, not a normal teaching lesson.
      </p>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%",
          borderRadius: 14,
          overflow: "hidden",
          background: "#000",
        }}
      >
        <iframe
          title={video.title}
          src={getYouTubeEmbedUrl(video.id)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <p style={{ margin: 0, lineHeight: 1.65 }}>
        Video not loading? <a href={video.url} target="_blank" rel="noreferrer">Watch it on YouTube</a>.
      </p>
    </Box>
  );
};

const TutorTrackGuidance = ({ config }) => (
  <>
    <Box title="4. Workbook and submission" tone="green" icon="📤">
      <p style={{ margin: 0, lineHeight: 1.65 }}>
        <strong>{config.workbookFlow}</strong>
      </p>
      <p style={{ margin: 0, lineHeight: 1.65 }}>{config.submissionText}</p>
      <List>
        <li>The old standalone <strong>Submit Assignment</strong> page has been retired.</li>
        <li>Falowen automatically carries the correct level, day and assignment number into the workbook Submit tab.</li>
        <li>Self-practice workbooks do not show Submit and should not be sent for tutor marking.</li>
        <li>Check marked work and corrections from <strong>Results</strong>.</li>
      </List>
    </Box>

    <Box title="5. Class preparation and attendance" icon="🕒">
      <List>
        <li>In-person students should arrive 30 minutes before class.</li>
        <li>Online students should join 10 minutes before class, keep the camera on and respond during class.</li>
        <li>Continue with prepared students even when another student is not ready.</li>
        <li>The assignment pass mark is 60%; course completion also depends on the required unique assignments.</li>
      </List>
    </Box>
  </>
);

const SelfLearningGuidance = ({ config }) => (
  <>
    <Box title="4. Write, analyse and self-mark" tone="green" icon="🧠">
      <p style={{ margin: 0, lineHeight: 1.65 }}>
        <strong>{config.workbookFlow}</strong>
      </p>
      <p style={{ margin: 0, lineHeight: 1.65 }}>{config.submissionText}</p>
      <List>
        <li>Write your own answer before opening analysis or reference support.</li>
        <li>Use Falowen AI to identify grammar, vocabulary, structure and task-completion problems.</li>
        <li>Revise the text yourself instead of copying an AI answer blindly.</li>
        <li>Mark the lesson complete only after reviewing and improving your work.</li>
      </List>
    </Box>

    <Box title="5. Build exam readiness" icon="🎯">
      <List>
        <li>Use the Study Calendar to keep a regular weekly routine.</li>
        <li>Use Exams Room for timed practice and exam-format tasks.</li>
        <li>Use Results and saved analyses to identify repeated weaknesses.</li>
        <li>Return to Ref after completing your own attempt, not before.</li>
      </List>
    </Box>
  </>
);

const Day0StudentWorkflowUpgrade = ({ pathname = "" }) => {
  const config = DAY0_PATH_CONFIG.find((item) => pathname === item.match);
  if (!config) return null;

  const isSelfLearning = config.mode === "selfLearning";

  return (
    <section
      style={{
        ...styles.card,
        display: "grid",
        gap: 12,
        border: `1px solid ${palette.amberSoft}`,
        background: `linear-gradient(180deg, ${palette.card} 0%, ${palette.page} 100%)`,
        boxShadow: "0 16px 36px rgba(120, 53, 15, 0.08)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 5 }}>
          <Pill>Updated for the new Falowen app</Pill>
          <h2 style={{ margin: 0, color: palette.ink }}>{config.level} Day 0 Orientation</h2>
          <p style={{ margin: 0, color: palette.muted, lineHeight: 1.5 }}>
            Read this before Day 1. Day 0 explains the current Course Book, Falowen Radio, workbook, AI and progress workflow.
          </p>
        </div>
        <span style={{ ...styles.badge, background: "#ffedd5", color: "#9a3412" }}>Orientation only</span>
      </div>

      <OrientationVideoBox video={config.video} />

      <Box title="1. Begin in the Course Book" icon="📚">
        <List>
          <li>The Course Book is the main learning path; use <strong>Continue learning</strong> to find the next lesson.</li>
          <li>Open the lesson and follow its instruction before opening individual resources.</li>
          <li>Do not start from old Drive links or the retired standalone submission page.</li>
          <li>Study Buddy can take you to Course Book, Falowen AI, Study Calendar and Exams Room.</li>
        </List>
      </Box>

      <Box title="2. Follow the resource order" tone="amber" icon="🧭">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Use this order whenever the resources are available:
        </p>
        <p style={{ margin: 0, color: palette.blue, fontWeight: 900, lineHeight: 1.65 }}>
          Lesson instruction → tutor/AI video → grammar notes → Falowen Radio → workbook → Submit or self-mark
        </p>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          A missing resource does not block the lesson; continue with the next available step.
        </p>
      </Box>

      <Box title="3. Falowen Radio comes before the workbook" tone="blue" icon="🎧">
        <List>
          <li>When a lesson has a Radio episode, Falowen shows it when you open the workbook.</li>
          <li>Listen first, then press <strong>Continue to workbook</strong>.</li>
          <li>Radio is preparation, not a separate assignment.</li>
          <li>On later visits, use the lesson’s Radio option to listen again when needed.</li>
        </List>
      </Box>

      {isSelfLearning ? <SelfLearningGuidance config={config} /> : <TutorTrackGuidance config={config} />}

      <Box title="6. Use Falowen AI responsibly" icon="🤖">
        <List>
          <li>Use Mark My Letter or Analyse My Text to improve writing structure and accuracy.</li>
          <li>Use the speaking coach before class or exam practice.</li>
          <li>Use grammar help when a rule is unclear.</li>
          <li>Submit or save your improved work, not an unedited AI response.</li>
        </List>
      </Box>

      <Box title="7. Results, notifications and next steps" tone="amber" icon="🔔">
        <List>
          <li>Open <strong>Results</strong> for scores, tutor feedback and corrections.</li>
          <li>Open <strong>Account → Notifications</strong> and enable important updates.</li>
          <li>Use the Study Calendar and Exams Room after completing course lessons.</li>
          <li>Return to the Course Book after Day 0 and begin Day 1 from there.</li>
        </List>
      </Box>
    </section>
  );
};

export default Day0StudentWorkflowUpgrade;
