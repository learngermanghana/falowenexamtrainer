import React from "react";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";

const day0PathConfig = [
  {
    match: "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook",
    level: "A1",
    video: {
      id: "qPwxBYlu3CE",
      url: "https://youtu.be/qPwxBYlu3CE",
      title: "A1 Orientation AI video",
      description:
        "Watch this A1 orientation video first, then continue with the Day 0 guide and workbook.",
    },
  },
  {
    match: "/campus/course/a2-day-0-orientation-and-knowledge-test-workbook",
    level: "A2",
    video: {
      id: "mY0ArOMOV9Y",
      url: "https://youtu.be/mY0ArOMOV9Y",
      title: "A2 Day 0 orientation video",
      description:
        "Watch this A2 orientation video first so you understand how to use the workbook, submit assignments, check attendance, and prepare before Day 1.",
    },
  },
  { match: "/campus/course/b1-day-0-orientation-and-knowledge-test-workbook", level: "B1" },
];

const palette = {
  page: "#f6f1e9",
  card: "#fffaf3",
  ink: "#1f1d2b",
  muted: "#6f6a80",
  amber: "#d97706",
  amberSoft: "#fed7aa",
  navy: "#262b5f",
  blue: "#2563eb",
  border: "#eadfd0",
};

const getYouTubeEmbedUrl = (videoId = "") =>
  `https://www.youtube-nocookie.com/embed/${videoId}`;

const List = ({ children }) => (
  <ul
    style={{
      margin: 0,
      paddingLeft: 20,
      display: "grid",
      gap: 6,
      lineHeight: 1.65,
    }}
  >
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

const ResourceCard = ({ number, icon, title, children }) => (
  <article
    style={{
      border: `1px solid ${palette.border}`,
      borderRadius: 14,
      background: "#fffaf3",
      padding: 12,
      display: "grid",
      gridTemplateColumns: "34px minmax(0, 1fr)",
      gap: 10,
      alignItems: "start",
    }}
  >
    <span
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff7ed",
        border: `1px solid ${palette.amberSoft}`,
        fontWeight: 900,
        color: palette.amber,
        fontSize: 13,
      }}
    >
      {number}
    </span>
    <div style={{ display: "grid", gap: 5, minWidth: 0 }}>
      <strong style={{ color: palette.ink, fontSize: 15, lineHeight: 1.25 }}>
        {icon} {title}
      </strong>
      <p style={{ margin: 0, color: palette.muted, fontSize: 13, lineHeight: 1.45 }}>
        {children}
      </p>
    </div>
  </article>
);

const OrientationVideoBox = ({ video }) => {
  if (!video?.id) return null;

  return (
    <Box title="Start here: Watch the Day 0 orientation video" tone="green" icon="▶️">
      <p style={{ margin: 0, lineHeight: 1.65 }}>{video.description}</p>

      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%",
          borderRadius: 14,
          overflow: "hidden",
          background: "#000",
          boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
        }}
      >
        <iframe
          title={video.title}
          src={getYouTubeEmbedUrl(video.id)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <p style={{ margin: 0, lineHeight: 1.65 }}>
        If the video does not load, open it here:{" "}
        <a href={video.url} target="_blank" rel="noreferrer">
          watch on YouTube
        </a>
        .
      </p>
    </Box>
  );
};

const Day0StudentWorkflowUpgrade = () => {
  const location = useLocation();
  const config = day0PathConfig.find((item) => location.pathname === item.match);
  if (!config) return null;

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: 5 }}>
          <Pill>Updated Day 0 guide</Pill>
          <h2 style={{ margin: 0, color: palette.ink }}>
            {config.level} Student Workflow
          </h2>
          <p style={{ margin: 0, color: palette.muted, lineHeight: 1.5 }}>
            Read this before Day 1 so you understand the new Course Book style, tutor videos,
            AI videos, workbook practice, and assignment submission.
          </p>
        </div>
        <span style={{ ...styles.badge, background: "#ffedd5", color: "#9a3412" }}>
          Read before Day 1
        </span>
      </div>

      <OrientationVideoBox video={config.video} />

      <Box title="1. Start from the Course Book" icon="📚">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          The Course Book is the main learning path. Open the day, read the instruction,
          use the resources in order, then complete the workbook and submit only the required final answers.
        </p>
        <List>
          <li><strong>Teil 1 · Sprechen</strong> is preparation and class practice.</li>
          <li><strong>Teil 2 · Schreiben</strong> is writing practice and assignment work.</li>
          <li><strong>Teil 3 · Lesen</strong> is reading practice and assignment work.</li>
          <li><strong>Teil 4 · Hören</strong> is listening practice and assignment work.</li>
        </List>
      </Box>

      <Box title="2. Tutor video and AI video" tone="amber" icon="🎬">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Some course days may show both a <strong>tutor video</strong> and an <strong>AI video</strong>.
          They are learning resources, not separate submissions. Use them before the grammar book and workbook.
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          <ResourceCard number="1" icon="🎬" title="Tutor video">
            Watch this first when it is available. It is the teacher or tutor explanation and normally gives the class-style explanation, pronunciation help, examples, and guidance for the task.
          </ResourceCard>
          <ResourceCard number="2" icon="🤖" title="AI video">
            Use this for revision, a second explanation, and self-study. It helps you understand the topic again, but it does not replace attendance, tutor guidance, or your own practice.
          </ResourceCard>
          <ResourceCard number="3" icon="📘" title="Grammar book">
            Read the rule, examples, and useful language after watching the video support. This helps you understand why the answers are correct.
          </ResourceCard>
          <ResourceCard number="4" icon="📝" title="Workbook">
            Complete the tasks carefully. Use the workbook to prepare clean final answers before submitting.
          </ResourceCard>
          <ResourceCard number="5" icon="✅" title="Submit tab">
            Submit only the required final assignment parts in the Submit tab. Do not submit rough notes or unfinished practice answers.
          </ResourceCard>
        </div>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Simple rule: <strong>Instruction → tutor video → AI video → grammar book → workbook → submit</strong>.
          If one video is not available, continue with the next resource.
        </p>
      </Box>

      <Box title="3. How to submit" tone="green" icon="📤">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Use the course lesson pages for practice, but submit final assignment answers in the <strong>Submit</strong> tab.
        </p>
        {config.level === "A1" ? (
          <p style={{ margin: 0, lineHeight: 1.65 }}>
            In A1, the main submitted assignment parts are usually <strong>Lesen</strong> and <strong>Hören</strong>.
            Schreiben and Sprechen are practical training tasks, but students should still complete them seriously.
          </p>
        ) : (
          <p style={{ margin: 0, lineHeight: 1.65 }}>
            In {config.level}, submit <strong>Teil 2 · Schreiben</strong>, <strong>Teil 3 · Lesen</strong> and <strong>Teil 4 · Hören</strong>.
            Teil 1 is for class speaking preparation.
          </p>
        )}
      </Box>

      <Box title="4. How to use Falowen AI" icon="🤖">
        <List>
          <li>Use AI tools to practise before submitting final work.</li>
          <li>Use <strong>Mark My Letter</strong> to check writing and improve structure.</li>
          <li>Use the speaking coach to practise your answer before class.</li>
          <li>Use grammar help when you do not understand a rule.</li>
          <li>Do not copy AI blindly. Improve your own work and submit your clean final version.</li>
        </List>
      </Box>

      <Box title="5. Scores, pass mark and certificate" tone="amber" icon="🏅">
        <List>
          <li>Check your marked work in the <strong>Results</strong> page.</li>
          <li>The pass mark for assignments is <strong>60%</strong>.</li>
          <li>To complete the course properly, students must complete all required assignments and pass them.</li>
          <li>Certificates are emailed to students after course completion, when required assignments are completed and passed.</li>
          <li>The certificate is not automatic just for attending class; assignment completion and pass marks matter.</li>
        </List>
      </Box>

      <Box title="6. Enable notifications" icon="🔔">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Open <strong>Account → Notifications</strong> and enable notifications on your device.
          This helps you receive score updates, payment reminders and important announcements.
        </p>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          On iPhone, add Falowen to your Home Screen first, open it from the Home Screen icon, then enable notifications.
        </p>
      </Box>
    </section>
  );
};

export default Day0StudentWorkflowUpgrade;
