import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { useToast } from "../context/ToastContext";
import { EmbeddedSpeechPracticePanel, EmbeddedWritingPracticePanel } from "./selfLearning/EmbeddedPracticePanels";

const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e5e7eb",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
};

const tabs = [
  { id: "learn", label: "1. Learn" },
  { id: "speak", label: "2. Speak" },
  { id: "write", label: "3. Write" },
  { id: "finish", label: "4. Finish" },
];

const heroShellStyle = {
  borderRadius: 22,
  overflow: "hidden",
  border: "1px solid rgba(148, 163, 184, 0.28)",
  boxShadow: "0 20px 52px rgba(15, 23, 42, 0.18)",
  background: "#0f172a",
};

const heroContentStyle = (imageUrl) => ({
  minHeight: 340,
  backgroundImage: `linear-gradient(135deg, rgba(2, 6, 23, 0.94) 0%, rgba(15, 23, 42, 0.82) 44%, rgba(30, 64, 175, 0.32) 100%), url(${imageUrl})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
  padding: "clamp(20px, 3.5vw, 40px)",
  display: "grid",
  alignContent: "space-between",
  gap: 24,
  position: "relative",
});

const heroBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 12px",
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.28)",
  background: "rgba(255, 255, 255, 0.14)",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.01em",
  backdropFilter: "blur(12px)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
};

const tabBarStyle = {
  position: "sticky",
  top: 0,
  zIndex: 5,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: 8,
  padding: "10px",
  border: "1px solid rgba(226, 232, 240, 0.9)",
  borderRadius: 18,
  background: "rgba(248, 250, 252, 0.92)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
};

const completionBannerStyle = {
  border: "1px solid #86efac",
  borderRadius: 16,
  padding: 14,
  background: "linear-gradient(135deg, #f0fdf4, #ffffff)",
  color: "#14532d",
  display: "grid",
  gap: 6,
};

const textAreaStyle = {
  minHeight: 96,
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: 12,
  padding: 12,
  resize: "vertical",
  font: "inherit",
  lineHeight: 1.55,
  boxSizing: "border-box",
};

const writingSteps = [
  { id: "understand", label: "1. Understand" },
  { id: "ideas", label: "2. Ideas" },
  { id: "plan", label: "3. Plan" },
  { id: "paragraphs", label: "4. Paragraphs" },
  { id: "final", label: "5. Final essay" },
];

const defaultParagraphTasks = [
  {
    id: "introduction",
    title: "Introduction",
    instruction: "Write only the introduction. Introduce the topic and explain why it is relevant.",
  },
  {
    id: "explanation",
    title: "Explanation / first argument",
    instruction: "Explain the main idea clearly. Do not try to finish the whole essay yet.",
  },
  {
    id: "example",
    title: "Concrete example",
    instruction: "Give one concrete example from society, school, work, family or everyday life.",
  },
  {
    id: "counterargument",
    title: "Counterargument",
    instruction: "Show another side of the topic and explain why it matters.",
  },
  {
    id: "alternative",
    title: "Alternative / solution",
    instruction: "Present a balanced alternative, solution or more flexible way of thinking.",
  },
  {
    id: "conclusion",
    title: "Conclusion",
    instruction: "Write a short differentiated conclusion with your final position.",
  },
];

const defaultChecklist = [
  "I answered all bullet points in the task.",
  "My introduction does not simply copy the task.",
  "I gave at least one concrete example.",
  "I included a counterargument or limitation.",
  "I used linking words and C1/B2 useful phrases.",
  "My conclusion gives a clear final position.",
];

const Section = ({ title, children }) => (
  <section style={cardStyle}>
    <h2 style={{ margin: 0, fontSize: "1.15rem" }}>{title}</h2>
    {children}
  </section>
);

const PracticeBox = ({ title, children }) => (
  <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, background: "#fff", display: "grid", gap: 8 }}>
    <strong>{title}</strong>
    {children}
  </div>
);

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", bg: "#eff6ff" },
    green: { border: "#bbf7d0", bg: "#f0fdf4" },
    amber: { border: "#fde68a", bg: "#fffbeb" },
  };
  const selected = tones[tone] || tones.blue;
  return <div style={{ padding: 12, borderRadius: 12, border: `1px solid ${selected.border}`, background: selected.bg, lineHeight: 1.7 }}>{children}</div>;
};

const StatCard = ({ label, value }) => (
  <div
    style={{
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.94)",
      borderRadius: 16,
      padding: "14px 16px",
      display: "grid",
      gap: 7,
      minHeight: 78,
      color: "#0f172a",
      boxShadow: "0 14px 28px rgba(2, 6, 23, 0.16)",
      backdropFilter: "blur(16px)",
    }}
  >
    <span style={{ fontSize: 11, color: "#475569", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
    <strong style={{ fontSize: 16, color: "#0f172a", lineHeight: 1.35 }}>{value}</strong>
  </div>
);

const renderList = (items = []) => {
  if (!items.length) return null;
  return <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
};

const renderParagraphs = (items = []) => {
  if (!items.length) return null;
  return items.map((item) => <p key={item} style={{ margin: 0, lineHeight: 1.7 }}>{item}</p>);
};

const getYouTubeEmbedUrl = (url = "") => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = parsed.pathname.replace(/^\//, "");
    } else if (host.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch (error) {
    return "";
  }
};

const VideoResourceCard = ({ resource }) => {
  if (!resource?.url) return null;
  const embedUrl = getYouTubeEmbedUrl(resource.url);

  return (
    <PracticeBox title="Video explanation">
      <div style={{ display: "grid", gap: 10 }}>
        <strong>{resource.title || "Watch the lesson video"}</strong>
        {resource.description ? <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>{resource.description}</p> : null}
        {embedUrl ? (
          <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", border: "1px solid #e5e7eb", background: "#0f172a" }}>
            <iframe
              title={resource.title || "Lesson video"}
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </div>
        ) : null}
        <a href={resource.url} target="_blank" rel="noreferrer" style={{ ...styles.linkButton, justifySelf: "start" }}>Open video on YouTube</a>
      </div>
    </PracticeBox>
  );
};

const KnowledgeTest = ({ items = [], answers = {}, onAnswer }) => {
  if (!items.length) return null;
  const answered = items.filter((_, index) => answers[index]).length;
  const correct = items.filter((item, index) => answers[index] && answers[index] === item.answer).length;

  return (
    <div style={{ border: "1px solid #c7d2fe", borderRadius: 16, padding: 14, background: "#f8fafc", display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <strong>Knowledge test</strong>
        <span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{correct}/{items.length} correct</span>
      </div>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>Click the best answer. You will see immediately whether it is correct.</p>
      {items.map((item, index) => {
        const selected = answers[index] || "";
        const isAnswered = Boolean(selected);
        const isCorrect = selected === item.answer;
        return (
          <div key={item.question} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#ffffff", display: "grid", gap: 10 }}>
            <strong>{index + 1}. {item.question}</strong>
            <div style={{ display: "grid", gap: 8 }}>
              {(item.options || []).map((option) => {
                const isSelected = selected === option;
                const isRightOption = item.answer === option;
                const background = isSelected ? (isCorrect ? "#dcfce7" : "#fee2e2") : isAnswered && isRightOption ? "#f0fdf4" : "#ffffff";
                const borderColor = isSelected ? (isCorrect ? "#22c55e" : "#ef4444") : isAnswered && isRightOption ? "#86efac" : "#e5e7eb";
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onAnswer(index, option)}
                    style={{ textAlign: "left", padding: "10px 12px", borderRadius: 12, border: `1px solid ${borderColor}`, background, cursor: "pointer", fontWeight: isSelected ? 800 : 600 }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {isAnswered ? (
              <div style={{ border: `1px solid ${isCorrect ? "#86efac" : "#fecaca"}`, borderRadius: 12, padding: 10, background: isCorrect ? "#f0fdf4" : "#fef2f2", lineHeight: 1.6 }}>
                <strong>{isCorrect ? "Correct." : "Not correct yet."}</strong> {item.explanation}
              </div>
            ) : null}
          </div>
        );
      })}
      {answered === items.length ? <div style={{ border: "1px solid #bbf7d0", borderRadius: 12, padding: 10, background: "#f0fdf4" }}>Finished: {correct}/{items.length}. Review any red answers before you continue.</div> : null}
    </div>
  );
};

const splitIntoSentences = (text = "") => {
  const matches = String(text || "").match(/[^.!?]+[.!?]?/g) || [];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
};

const parseWritingTask = (taskText = "", builderStructure = []) => {
  const cleaned = String(taskText || "").replace(/^Schreiben:\s*/i, "").trim();
  const marker = cleaned.match(/bearbeiten Sie alle Punkte:\s*/i);

  if (marker) {
    const before = cleaned.slice(0, marker.index).trim();
    const after = cleaned.slice(marker.index + marker[0].length).trim();
    const beforeSentences = splitIntoSentences(before);
    const points = splitIntoSentences(after);
    return {
      context: beforeSentences.slice(0, -1).join(" ") || "Schreibaufgabe",
      prompt: beforeSentences.slice(-1)[0] || before || "Schreibaufgabe",
      points,
    };
  }

  const sentences = splitIntoSentences(cleaned);
  const directiveIndex = sentences.findIndex((sentence, index) => index > 0 && /^(Äußern|Nennen|Beschreiben|Machen|Zeigen|Bitten|Erklären|Argumentieren|Erläutern|Fragen|Schildern) Sie\b/i.test(sentence));
  if (directiveIndex > 0) {
    const beforeSentences = sentences.slice(0, directiveIndex);
    return {
      context: beforeSentences.slice(0, -1).join(" ") || "Schreibaufgabe",
      prompt: beforeSentences.slice(-1)[0] || beforeSentences.join(" "),
      points: sentences.slice(directiveIndex),
    };
  }

  const structurePoints = (builderStructure || [])
    .filter((item) => /^(Erklären|Argumentieren|Nennen|Erläutern|Äußern|Beschreiben|Machen|Zeigen|Bitten) Sie/i.test(item))
    .map((item) => item.replace(/^[^:]+:\s*/, ""));

  return { context: "Schreibaufgabe", prompt: cleaned, points: structurePoints };
};

const WritingTaskCard = ({ writingType, writingTask, structure }) => {
  const formattedTask = parseWritingTask(writingTask, structure);
  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: 16, background: "#fff", overflow: "hidden", display: "grid" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", background: "#f8fafc", display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
        <strong>Schreiben Aufgabe</strong>
        <span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{writingType}</span>
      </div>
      <div style={{ padding: "18px 18px 12px", display: "grid", gap: 14 }}>
        {formattedTask.context ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{formattedTask.context}</p> : null}
        <div style={{ border: "1px solid #111827", padding: "18px 20px", borderRadius: 4, background: "#ffffff", fontSize: "1.05rem", lineHeight: 1.65 }}>{formattedTask.prompt}</div>
        {formattedTask.points?.length ? (
          <div style={{ display: "grid", gap: 10 }}>
            <strong>Bearbeiten Sie diese Punkte:</strong>
            <ul style={{ margin: 0, paddingLeft: 24, lineHeight: 1.8 }}>{formattedTask.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const Field = ({ label, hint, value, onChange, minHeight = 96 }) => (
  <label style={{ display: "grid", gap: 6 }}>
    <span style={{ fontWeight: 800 }}>{label}</span>
    {hint ? <span style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>{hint}</span> : null}
    <textarea
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Write short notes first. You can improve them later."
      style={{ ...textAreaStyle, minHeight }}
    />
  </label>
);

const getWordCount = (text = "") => String(text || "").trim().split(/\s+/).filter(Boolean).length;

const WritingBuilder = ({ lesson, writingTask, builder = {}, progress = {}, onProgressUpdate }) => {
  const formattedTask = parseWritingTask(writingTask, builder?.structure);
  const draft = progress.writingBuilderDraft || {};
  const activeStep = progress.writingBuilderStep || "understand";
  const activeStepIndex = writingSteps.findIndex((step) => step.id === activeStep);
  const safeStepIndex = activeStepIndex >= 0 ? activeStepIndex : 0;
  const currentStep = writingSteps[safeStepIndex];
  const paragraphTasks = builder?.paragraphTasks?.length ? builder.paragraphTasks : defaultParagraphTasks;
  const checklist = builder?.checklist?.length ? builder.checklist : defaultChecklist;
  const thinkingQuestions = builder?.thinkingQuestions?.length
    ? builder.thinkingQuestions
    : formattedTask.points?.length
      ? formattedTask.points
      : ["What is the topic about?", "What is your position?", "What example can you use?"];
  const ideaPrompts = builder?.ideaPrompts?.length
    ? builder.ideaPrompts
    : ["Two strong arguments", "One concrete example", "One counterargument", "One alternative or solution"];
  const usefulLines = builder?.usefulLines || [];
  const wordTarget = builder?.wordTarget || (lesson.level === "C1" ? "180–220 words" : "150–200 words");
  const finalWordCount = getWordCount(draft.finalEssay);
  const getParagraphDraftKey = (task, index) => `paragraph_${task.id || index}`;
  const paragraphDrafts = paragraphTasks
    .map((task, index) => String(draft[getParagraphDraftKey(task, index)] || "").trim())
    .filter(Boolean);
  const hasParagraphDraft = paragraphDrafts.length > 0;

  const updateDraft = (key, value) => {
    onProgressUpdate({
      writingBuilderDraft: {
        ...(progress.writingBuilderDraft || {}),
        [key]: value,
      },
    });
  };

  const setStep = (stepId) => onProgressUpdate({ writingBuilderStep: stepId });
  const combineParagraphs = () => {
    if (!hasParagraphDraft) return;
    onProgressUpdate({
      writingBuilderDraft: {
        ...(progress.writingBuilderDraft || {}),
        finalEssay: paragraphDrafts.join("\n\n"),
      },
      writingBuilderStep: "final",
    });
  };
  const goNext = () => setStep(writingSteps[Math.min(safeStepIndex + 1, writingSteps.length - 1)].id);
  const goBack = () => setStep(writingSteps[Math.max(safeStepIndex - 1, 0)].id);

  return (
    <div style={{ border: "1px solid #c7d2fe", borderRadius: 18, background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)", overflow: "hidden", display: "grid" }}>
      <div style={{ padding: 16, display: "grid", gap: 10, borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "grid", gap: 4 }}>
            <span style={{ ...styles.badge, width: "fit-content", background: "#eef2ff", color: "#3730a3" }}>Writing Builder</span>
            <h3 style={{ margin: 0 }}>Build the essay step by step</h3>
          </div>
          <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>Target: {wordTarget}</span>
        </div>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
          Do not write the long essay immediately. First understand the topic, collect ideas, plan, write small paragraphs, then combine everything into the final answer.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
          {writingSteps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setStep(step.id)}
              style={{
                ...(currentStep.id === step.id ? styles.primaryButton : styles.secondaryButton),
                borderRadius: 999,
                minHeight: 40,
                padding: "8px 10px",
                fontSize: 13,
              }}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(240px, 0.9fr)", gap: 14, padding: 16 }}>
        <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
          {currentStep.id === "understand" ? (
            <PracticeBox title="Step 1: Understand the task">
              <NoteBox tone="amber"><strong>Write notes only.</strong> The aim is to remove the blank-page fear.</NoteBox>
              {thinkingQuestions.length ? renderList(thinkingQuestions) : null}
              <Field label="Topic in my own words" value={draft.topicInMyWords} onChange={(value) => updateDraft("topicInMyWords", value)} />
              <Field label="Main problem or discussion" value={draft.mainProblem} onChange={(value) => updateDraft("mainProblem", value)} />
              <Field label="My first position" hint="Agree, disagree, or partly agree?" value={draft.position} onChange={(value) => updateDraft("position", value)} />
            </PracticeBox>
          ) : null}

          {currentStep.id === "ideas" ? (
            <PracticeBox title="Step 2: Idea bank">
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>Collect short points. Do not worry about perfect grammar yet.</p>
              {renderList(ideaPrompts)}
              <Field label="Arguments / reasons" value={draft.arguments} onChange={(value) => updateDraft("arguments", value)} />
              <Field label="Concrete example" value={draft.example} onChange={(value) => updateDraft("example", value)} />
              <Field label="Counterargument or limitation" value={draft.counterargument} onChange={(value) => updateDraft("counterargument", value)} />
              <Field label="Alternative / balanced view" value={draft.alternative} onChange={(value) => updateDraft("alternative", value)} />
            </PracticeBox>
          ) : null}

          {currentStep.id === "plan" ? (
            <PracticeBox title="Step 3: Essay plan">
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>Use the structure below, then adjust it with your own notes.</p>
              {builder?.structure?.length ? renderList(builder.structure) : renderList(defaultParagraphTasks.map((item) => `${item.title}: ${item.instruction}`))}
              <Field label="My essay plan" hint="Write the order of your paragraphs in simple bullet points." value={draft.myPlan} onChange={(value) => updateDraft("myPlan", value)} minHeight={140} />
            </PracticeBox>
          ) : null}

          {currentStep.id === "paragraphs" ? (
            <PracticeBox title="Step 4: Paragraph builder">
              <NoteBox><strong>Write one paragraph at a time.</strong> This is easier than writing the full essay at once.</NoteBox>
              {paragraphTasks.map((task, index) => (
                <Field
                  key={task.id || task.title}
                  label={`${index + 1}. ${task.title}`}
                  hint={task.instruction}
                  value={draft[getParagraphDraftKey(task, index)]}
                  onChange={(value) => updateDraft(getParagraphDraftKey(task, index), value)}
                  minHeight={110}
                />
              ))}
              <button type="button" style={styles.primaryButton} onClick={combineParagraphs} disabled={!hasParagraphDraft}>
                Combine my paragraphs
              </button>
            </PracticeBox>
          ) : null}

          {currentStep.id === "final" ? (
            <PracticeBox title="Step 5: Final essay">
              <NoteBox tone="green"><strong>Now combine your work.</strong> Use your notes and paragraphs to write the final version.</NoteBox>
              <button type="button" style={styles.secondaryButton} onClick={combineParagraphs} disabled={!hasParagraphDraft}>
                Refresh final essay from paragraphs
              </button>
              <Field label="Final essay" value={draft.finalEssay} onChange={(value) => updateDraft("finalEssay", value)} minHeight={260} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>Words: {finalWordCount}</span>
                <span style={{ ...styles.badge, background: "#fef3c7", color: "#92400e" }}>Goal: {wordTarget}</span>
              </div>
              <PracticeBox title="Final checklist">{renderList(checklist)}</PracticeBox>
            </PracticeBox>
          ) : null}

          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <button type="button" style={styles.secondaryButton} onClick={goBack} disabled={safeStepIndex === 0}>Back step</button>
            <button type="button" style={styles.primaryButton} onClick={goNext} disabled={safeStepIndex === writingSteps.length - 1}>Continue</button>
          </div>
        </div>

        <aside style={{ display: "grid", gap: 12, alignContent: "start" }}>
          <PracticeBox title="Useful phrases">
            {usefulLines.length ? renderList(usefulLines) : renderList([
              "Heutzutage wird ... häufig diskutiert.",
              "Ein wichtiger Aspekt ist ...",
              "Kritisch zu betrachten ist jedoch, dass ...",
              "Zusammenfassend lässt sich sagen, dass ...",
            ])}
          </PracticeBox>
          <PracticeBox title="AI coach prompts">
            {renderList([
              "Help me understand this topic in simple German.",
              "Give me 3 possible arguments for this topic.",
              "Improve this paragraph to C1 level without changing my idea.",
              "Check whether I answered all bullet points.",
            ])}
          </PracticeBox>
          <PracticeBox title="Exam mode reminder">
            <p style={{ margin: 0, lineHeight: 1.6 }}>After guided practice, try the same task again with only the task card and a timer. That is exam mode.</p>
          </PracticeBox>
        </aside>
      </div>
    </div>
  );
};

const ExternalResourceCard = ({ title, resource }) => {
  if (!resource) return null;
  return (
    <PracticeBox title={title}>
      <p style={{ margin: 0, fontWeight: 600 }}>{resource.title}</p>
      {resource.description ? <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>{resource.description}</p> : null}
      {resource.url ? <a href={resource.url} target="_blank" rel="noreferrer" style={{ ...styles.linkButton, justifySelf: "start" }}>Open resource</a> : null}
      {renderList(resource.tasks || [])}
    </PracticeBox>
  );
};

const CompletionBanner = ({ message, onBackToCourse }) => {
  if (!message) return null;
  return (
    <div style={completionBannerStyle} role="status" aria-live="polite">
      <strong>✅ {message.title}</strong>
      <p style={{ margin: 0, lineHeight: 1.6 }}>{message.body}</p>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" onBack={onBackToCourse} />
    </div>
  );
};

const inferWritingType = (lesson) => {
  if (lesson.writingTaskType) return lesson.writingTaskType;
  const text = `${lesson.title || ""} ${lesson.topic || ""} ${lesson.tasks?.writing || ""}`.toLowerCase();
  if (/beschwerde|anfrage|bewerbung|einladung|absage|termin|formell|brief|e-mail|email/.test(text)) return "Formal letter / E-Mail";
  if (/rezension|bewertung|empfehlung/.test(text)) return "Review / Recommendation";
  if (/bericht|zusammenfassung/.test(text)) return "Report / Summary";
  return "Opinion essay / Erörterung";
};

const buildInitialProgress = () => ({
  understood: false,
  completed: false,
  grammarQuizAnswers: {},
  writingBuilderStep: "understand",
  writingBuilderDraft: {},
});

export default function SelfLearningEditableLessonPageV2({ lesson }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("learn");
  const [completionMessage, setCompletionMessage] = useState(null);
  const storageKey = `falowen:self-learning:lesson:${lesson.level}:${lesson.day}`;
  const [progress, setProgress] = useState(() => {
    try {
      return { ...buildInitialProgress(), ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
    } catch (error) {
      return buildInitialProgress();
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);

  const updateProgress = (updates) => setProgress((previous) => ({ ...previous, ...updates }));
  const updateGrammarQuizAnswer = (questionIndex, option) => {
    updateProgress({ grammarQuizAnswers: { ...(progress.grammarQuizAnswers || {}), [questionIndex]: option } });
  };

  const isOrientationDay = Number(lesson.day) === 0;
  const writingType = inferWritingType(lesson);
  const speakingTopic = lesson.speakingTopic || lesson.tasks?.speaking || `Sprich über: ${lesson.topic}`;
  const writingTask = lesson.writingTopic || lesson.tasks?.writing || `Schreibe einen ${lesson.level}-Text zum Thema: ${lesson.topic}. Begründe deine Meinung und nutze passende Redemittel.`;
  const heroImage = lesson.heroImage || DEFAULT_HERO_IMAGE;

  const markComplete = (type = "lesson") => {
    updateProgress({ completed: true, completedAt: new Date().toISOString() });
    const title = type === "orientation" ? "Day 0 orientation completed" : `Day ${lesson.day} marked complete`;
    const body = type === "orientation"
      ? "Great. You can now return to the Course Book and start Day 1."
      : "Great work. Your progress has been saved on this device. Return to the Course Book and continue with the next day.";
    setCompletionMessage({ title, body });
    showToast(`${title}. Progress saved.`, "success");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 120);
  };

  const orientationCards = isOrientationDay
    ? [
        { label: "Page type", value: "Orientation only" },
        { label: "Course design", value: "Learn · Speak · Write · Finish" },
        { label: "Progress", value: progress.completed ? "Completed" : "Read first" },
      ]
    : [
        { label: "Speaking task", value: lesson.speakingTaskType || "Guided talk" },
        { label: "Writing support", value: "Builder · AI coach · Exam mode" },
        { label: "Progress", value: progress.completed ? "Completed" : "In progress" },
      ];

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <CompletionBanner message={completionMessage} onBackToCourse={() => navigate("/campus/course")} />

      <header style={heroShellStyle}>
        <div style={heroContentStyle(heroImage)}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <span style={heroBadgeStyle}>{lesson.level}</span>
            <span style={heroBadgeStyle}>Day {lesson.day}</span>
            {lesson.chapter ? <span style={heroBadgeStyle}>Chapter {lesson.chapter}</span> : null}
            <span style={{ ...heroBadgeStyle, background: "rgba(37, 99, 235, 0.88)", borderColor: "rgba(147, 197, 253, 0.5)" }}>AI self-learning</span>
            {progress.completed ? <span style={{ ...heroBadgeStyle, background: "rgba(22, 163, 74, 0.88)", borderColor: "rgba(187, 247, 208, 0.55)" }}>Complete</span> : null}
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "grid", gap: 10, maxWidth: 980 }}>
              <h1 style={{ margin: 0, fontSize: "clamp(1.95rem, 4.8vw, 3.9rem)", lineHeight: 1.02, letterSpacing: "-0.05em", textWrap: "balance", textShadow: "0 10px 28px rgba(0,0,0,0.32)" }}>{lesson.title}</h1>
              <p style={{ margin: 0, maxWidth: 980, fontSize: "clamp(0.98rem, 1.45vw, 1.16rem)", lineHeight: 1.6, color: "#e2e8f0", textShadow: "0 6px 18px rgba(0,0,0,0.26)" }}>{lesson.topic}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
              {orientationCards.map((item) => <StatCard key={item.label} label={item.label} value={item.value} />)}
            </div>
          </div>
        </div>
      </header>

      {isOrientationDay ? (
        <>
          <Section title="Day 0 Orientation">
            <NoteBox><strong>Start here.</strong> Day 0 is only for orientation. There is no writing task on this page.</NoteBox>
            {renderList(lesson.objectives || [])}
            {renderParagraphs(lesson.explanation || [])}
          </Section>
          <Section title="What you must understand today">
            {lesson.grammarFocus ? <NoteBox><strong>Focus:</strong> {lesson.grammarFocus}</NoteBox> : null}
            {lesson.topicQuestions?.length ? <PracticeBox title="Questions before Day 1">{renderList(lesson.topicQuestions)}</PracticeBox> : null}
            {lesson.videoResource ? <VideoResourceCard resource={lesson.videoResource} /> : null}
            {lesson.grammarLesson?.explanation?.length ? <PracticeBox title="How Falowen works">{renderParagraphs(lesson.grammarLesson.explanation)}</PracticeBox> : null}
            {lesson.grammarLesson?.rules?.length ? <PracticeBox title="Course rules">{renderList(lesson.grammarLesson.rules)}</PracticeBox> : null}
            {lesson.grammarLesson?.examples?.length ? <PracticeBox title="Daily flow examples">{renderList(lesson.grammarLesson.examples)}</PracticeBox> : null}
            {lesson.grammarLesson?.miniExercise ? <PracticeBox title="Quick orientation check"><p style={{ margin: 0, lineHeight: 1.7 }}>{lesson.grammarLesson.miniExercise}</p></PracticeBox> : null}
          </Section>
          <Section title="Day 0 Knowledge Test">
            <KnowledgeTest items={lesson.grammarLesson?.knowledgeTest || []} answers={progress.grammarQuizAnswers || {}} onAnswer={updateGrammarQuizAnswer} />
          </Section>
          {lesson.phrases?.length ? <Section title="Key things to remember">{renderList(lesson.phrases)}</Section> : null}
          <Section title="Next step">
            <p style={{ margin: 0, lineHeight: 1.7 }}>After reading this orientation, go back to the Course Book and start Day 1. The normal Learn, Speak, Write and Finish tabs begin from Day 1.</p>
            {progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This orientation is already marked complete.</NoteBox> : null}
            <button type="button" style={styles.primaryButton} onClick={() => markComplete("orientation")}>
              {progress.completed ? "Mark orientation complete again" : "Mark orientation complete"}
            </button>
          </Section>
        </>
      ) : (
        <>
          <div style={tabBarStyle}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                style={{ ...(activeTab === tab.id ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, minHeight: 44, boxShadow: activeTab === tab.id ? "0 10px 24px rgba(37, 99, 235, 0.22)" : "none" }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "learn" ? (
            <>
              <Section title="Lesson overview">
                <NoteBox><strong>Learn first.</strong> This tab is only for the topic overview, lesson goals and thinking questions. Use the Speak tab for Sprechen practice and the Write tab for the writing task.</NoteBox>
                {renderList(lesson.objectives || [])}
                {renderParagraphs(lesson.explanation || [])}
                {lesson.topicQuestions?.length ? <PracticeBox title="Think before you practise">{renderList(lesson.topicQuestions)}</PracticeBox> : null}
              </Section>
              <Section title="Grammar and useful language">
                {lesson.grammarFocus ? <NoteBox><strong>Focus:</strong> {lesson.grammarFocus}</NoteBox> : null}
                {lesson.grammarLesson?.title ? <PracticeBox title="Grammar topic"><strong>{lesson.grammarLesson.title}</strong></PracticeBox> : null}
                {lesson.videoResource ? <VideoResourceCard resource={lesson.videoResource} /> : null}
                {lesson.grammarLesson?.explanation?.length ? <PracticeBox title="How to use it">{renderParagraphs(lesson.grammarLesson.explanation)}</PracticeBox> : null}
                {lesson.grammarLesson?.rules?.length ? <PracticeBox title="Rules">{renderList(lesson.grammarLesson.rules)}</PracticeBox> : null}
                {lesson.grammarLesson?.examples?.length ? <PracticeBox title="Examples">{renderList(lesson.grammarLesson.examples)}</PracticeBox> : null}
                {lesson.grammarLesson?.miniExercise ? <PracticeBox title="Mini exercise"><p style={{ margin: 0, lineHeight: 1.7 }}>{lesson.grammarLesson.miniExercise}</p></PracticeBox> : null}
                <KnowledgeTest items={lesson.grammarLesson?.knowledgeTest || []} answers={progress.grammarQuizAnswers || {}} onAnswer={updateGrammarQuizAnswer} />
                {lesson.phrases?.length ? <PracticeBox title="Useful phrases">{renderList(lesson.phrases)}</PracticeBox> : null}
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={Boolean(progress.understood)} onChange={(event) => updateProgress({ understood: event.target.checked })} />
                  <span style={styles.label}>I understand the overview and grammar focus.</span>
                </label>
              </Section>
            </>
          ) : null}

          {activeTab === "speak" ? (
            <Section title="Speaking builder">
              <PracticeBox title="Sprechen topic"><p style={{ margin: 0, lineHeight: 1.6 }}>{speakingTopic}</p></PracticeBox>
              {lesson.speakingBuilder?.plan?.length ? <PracticeBox title="Speaking plan">{renderList(lesson.speakingBuilder.plan)}</PracticeBox> : null}
              {lesson.speakingBuilder?.starters?.length ? <PracticeBox title="Sentence starters">{renderList(lesson.speakingBuilder.starters)}</PracticeBox> : null}
              <EmbeddedSpeechPracticePanel />
            </Section>
          ) : null}

          {activeTab === "write" ? (
            <Section title="Writing support">
              <WritingTaskCard writingType={writingType} writingTask={writingTask} structure={lesson.writingBuilder?.structure} />
              <WritingBuilder
                lesson={lesson}
                writingTask={writingTask}
                builder={lesson.writingBuilder}
                progress={progress}
                onProgressUpdate={updateProgress}
              />
              <PracticeBox title="AI writing coach and marking">
                <p style={{ margin: 0, lineHeight: 1.7 }}>After building your essay, paste one paragraph or the final essay below. Ask Falowen AI to improve structure, grammar, vocabulary and argument strength.</p>
                <EmbeddedWritingPracticePanel />
              </PracticeBox>
            </Section>
          ) : null}

          {activeTab === "finish" ? (
            <>
              <Section title="Lesen, Hören und Wortschatz">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
                  <ExternalResourceCard title="Recommended reading" resource={lesson.readingResource} />
                  <ExternalResourceCard title="Recommended listening" resource={lesson.listeningResource} />
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  <strong>Vocabulary builder</strong>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(lesson.vocabulary || []).map((word) => <span key={word} style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{word}</span>)}
                  </div>
                  <p style={{ margin: 0, color: "#4b5563" }}>Make one strong sentence with each word, then ask Falowen AI to improve the sentences to {lesson.level} level.</p>
                </div>
              </Section>
              <Section title="Complete lesson">
                <p style={{ margin: 0, lineHeight: 1.7 }}>When you finish the practice, mark the lesson complete and continue with the next day from the Course Book.</p>
                {progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This lesson is already marked complete.</NoteBox> : null}
                <button type="button" style={styles.primaryButton} onClick={() => markComplete("lesson")}>
                  {progress.completed ? "Mark lesson complete again" : "Mark lesson complete"}
                </button>
              </Section>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
