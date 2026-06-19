import React from "react";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";

const levelConfigs = {
  A1: {
    mode: "Tutor-guided",
    video: {
      id: "qPwxBYlu3CE",
      url: "https://youtu.be/qPwxBYlu3CE",
      title: "A1 orientation video",
    },
  },
  A2: {
    mode: "Tutor-guided",
    video: {
      id: "mY0ArOMOV9Y",
      url: "https://youtu.be/mY0ArOMOV9Y",
      title: "A2 orientation video",
    },
  },
  B1: { mode: "Tutor-guided" },
  B2: { mode: "Self-learning" },
  C1: { mode: "Self-learning" },
};

const pathToLevel = new Map([
  ["/campus/course/a1-day-0-orientation-and-knowledge-test-workbook", "A1"],
  ["/campus/course/a2-day-0-orientation-and-knowledge-test-workbook", "A2"],
  ["/campus/course/b1-day-0-orientation-and-knowledge-test-workbook", "B1"],
  ["/campus/course/b2-day-0-orientation-and-knowledge-test-workbook", "B2"],
  ["/campus/course/b2-day-0-progression-workbook", "B2"],
  ["/campus/course/b2-self-learning/day-0", "B2"],
  ["/campus/course/c1-day-0-progression-workbook", "C1"],
  ["/campus/course/c1-self-learning/day-0", "C1"],
  ["/campus/course/lesson/A1/0", "A1"],
  ["/campus/course/lesson/A2/0", "A2"],
  ["/campus/course/lesson/B1/0", "B1"],
  ["/campus/course/lesson/B2/0", "B2"],
  ["/campus/course/lesson/C1/0", "C1"],
]);

const palette = {
  page: "#f6f1e9",
  card: "#fffaf3",
  ink: "#1f1d2b",
  muted: "#6f6a80",
  amber: "#d97706",
  amberSoft: "#fed7aa",
  border: "#eadfd0",
};

const List = ({ children }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6, lineHeight: 1.65 }}>
    {children}
  </ul>
);

const Pill = ({ children }) => (
  <span
    style={{
      display: "inline-flex",
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

const ResourceCard = ({ number, title, children }) => (
  <article
    style={{
      border: `1px solid ${palette.border}`,
      borderRadius: 14,
      background: "#fffaf3",
      padding: 12,
      display: "grid",
      gridTemplateColumns: "34px minmax(0, 1fr)",
      gap: 10,
    }}
  >
    <span
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: "#fff7ed",
        border: `1px solid ${palette.amberSoft}`,
        fontWeight: 900,
        color: palette.amber,
      }}
    >
      {number}
    </span>
    <div style={{ display: "grid", gap: 4 }}>
      <strong>{title}</strong>
      <p style={{ margin: 0, color: palette.muted, fontSize: 13, lineHeight: 1.5 }}>{children}</p>
    </div>
  </article>
);

const OrientationVideo = ({ video }) => {
  if (!video?.id) return null;
  return (
    <Box title="Watch the Day 0 orientation video" tone="green" icon="▶️">
      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 14, overflow: "hidden", background: "#000" }}>
        <iframe
          title={video.title}
          src={`https://www.youtube-nocookie.com/embed/${video.id}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <p style={{ margin: 0 }}>
        Video not loading? <a href={video.url} target="_blank" rel="noreferrer">Watch it on YouTube</a>.
      </p>
    </Box>
  );
};

const TutorGuidedWorkflow = ({ level }) => (
  <>
    <Box title="2. Open the workbook and use its tabs" tone="blue" icon="📝">
      {level === "A1" ? (
        <List>
          <li><strong>Assignment</strong> contains the work connected to the lesson.</li>
          <li><strong>Submit</strong> is where you send only the final tutor-marked answers.</li>
          <li>Self-practice workbooks do not need submission.</li>
        </List>
      ) : (
        <List>
          <li><strong>Teil 1 · Sprechen</strong> is speaking preparation and class practice.</li>
          <li><strong>Teil 2 · Schreiben</strong>, <strong>Teil 3 · Lesen</strong> and <strong>Teil 4 · Hören</strong> contain the main workbook tasks.</li>
          <li><strong>Ref</strong> contains reference answers or useful support.</li>
          <li><strong>Submit</strong> is inside the same workbook and automatically uses the correct assignment number.</li>
        </List>
      )}
    </Box>

    <Box title="3. Submit inside the workbook" tone="green" icon="📤">
      <p style={{ margin: 0, lineHeight: 1.65 }}>
        The old Submit Assignment page is no longer the student workflow. Open the correct lesson workbook and use its
        <strong> Submit</strong> tab. Save drafts there and submit only clean final answers.
      </p>
    </Box>
  </>
);

const SelfLearningWorkflow = ({ level }) => (
  <>
    <Box title={`2. Use the ${level} self-learning tabs`} tone="blue" icon="🧭">
      <List>
        <li><strong>Learn</strong>: understand the topic, grammar focus and useful expressions.</li>
        <li><strong>Speak</strong>: practise a structured answer aloud and improve it with Falowen AI.</li>
        <li><strong>Write</strong>: build and improve your text. Use Analyse My Text before Day 20 and Mark My Letter from Day 20.</li>
        <li><strong>Finish</strong>: complete reading, listening, vocabulary and the lesson check.</li>
        <li><strong>Ref</strong>: save useful phrases, structures and examples for later lessons.</li>
      </List>
    </Box>

    <Box title="3. Complete honestly—no tutor upload" tone="green" icon="✅">
      <p style={{ margin: 0, lineHeight: 1.65 }}>
        B2 and C1 are self-learning tracks. There is no tutor Submit tab for normal lessons. Improve your own work after AI feedback,
        choose your confidence level honestly and mark the lesson complete only after finishing the main activities.
      </p>
    </Box>
  </>
);

const Day0StudentWorkflowUpgrade = () => {
  const location = useLocation();
  const level = pathToLevel.get(location.pathname);
  const config = levelConfigs[level];
  if (!config) return null;

  const isSelfLearning = config.mode === "Self-learning";

  return (
    <section
      style={{
        ...styles.card,
        display: "grid",
        gap: 12,
        border: `1px solid ${palette.amberSoft}`,
        background: `linear-gradient(180deg, ${palette.card} 0%, ${palette.page} 100%)`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 5 }}>
          <Pill>New Falowen app structure</Pill>
          <h2 style={{ margin: 0, color: palette.ink }}>{level} Day 0 Student Workflow</h2>
          <p style={{ margin: 0, color: palette.muted, lineHeight: 1.5 }}>
            Read this before Day 1. Your Course Book is the starting point, and your workbook now contains the correct practice and completion tools.
          </p>
        </div>
        <span style={{ ...styles.badge, background: "#ffedd5", color: "#9a3412" }}>{config.mode}</span>
      </div>

      <OrientationVideo video={config.video} />

      <Box title="1. Follow one clear learning path" icon="📚">
        <div style={{ display: "grid", gap: 8 }}>
          <ResourceCard number="1" title="Course Book">Open the correct day and read its goal and instruction.</ResourceCard>
          <ResourceCard number="2" title="Falowen Radio">When a radio episode is available, it appears before the workbook. Listen, then continue.</ResourceCard>
          <ResourceCard number="3" title="Videos and grammar">Use the tutor or AI video and grammar notes when they are available.</ResourceCard>
          <ResourceCard number="4" title="Workbook">Complete the lesson tasks in the workbook instead of using a separate assignment page.</ResourceCard>
          <ResourceCard number="5" title={isSelfLearning ? "Finish and record progress" : "Submit or save a draft"}>
            {isSelfLearning
              ? "Use the self-learning completion tools and confidence level."
              : "Use the Submit tab inside the same workbook for tutor-marked work."}
          </ResourceCard>
        </div>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          <strong>Course Book → Radio when available → lesson resources → workbook → {isSelfLearning ? "Finish" : "Submit"}</strong>
        </p>
      </Box>

      {isSelfLearning ? <SelfLearningWorkflow level={level} /> : <TutorGuidedWorkflow level={level} />}

      <Box title="4. Use the rest of Falowen" tone="amber" icon="🤖">
        <List>
          <li><strong>Study Buddy</strong> helps you find the next lesson and important shortcuts.</li>
          <li><strong>Results</strong> shows tutor scores and feedback for A1–B1 work.</li>
          <li><strong>Study calendar</strong> helps you stay consistent.</li>
          <li><strong>Exams room</strong> is for exam-style reading, listening, speaking and writing practice.</li>
          <li>Enable notifications so you receive score updates and important announcements.</li>
        </List>
      </Box>

      <Box title="5. Day 0 completion check" icon="🎯">
        <List>
          <li>I know that the Course Book is my starting point.</li>
          <li>I know that Falowen Radio appears before selected workbooks.</li>
          <li>I know where the workbook tabs are and which work requires submission.</li>
          <li>I know that the old student Submit Assignment page is no longer the main workflow.</li>
          <li>I am ready to open Day 1.</li>
        </List>
      </Box>
    </section>
  );
};

export default Day0StudentWorkflowUpgrade;
