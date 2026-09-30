import React, { useCallback, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import SharedTimedAssignment from "./SharedTimedAssignment";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import {
  A2_B1_WORKBOOK_TABS_WITH_GRAMMAR,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";
import { A2B1GrammarNotesTab } from "./A2B1WorkbookGrammarNotes";
import { styles } from "../styles";
import ReadingExamFrame, { ReadingExamDocument, ReadingQuestionGrid, ReadingSourceCard, ReadingSourceGrid, readingSourceLabel } from "./ReadingExamLayout";
import { getB1WritingTask } from "../data/b1WritingTasks";
import { getB1ReadingTask } from "../data/b1ReadingTasks";
import { getB1ListeningTask } from "../data/b1ListeningTasks";
import { getA2B1LessonProfile } from "../data/a2B1LessonProfile";
import A2B1ReadingQualityChallenge from "./A2B1ReadingQualityChallenge";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const listSpacing = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const contentCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 7,
  lineHeight: 1.7,
};

const imageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const videoStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const REMOVED_B1_TEACHER_VIDEO_IDS = new Set([
  "iyydRu3oY4I",
  "zzPpGxzvJCY",
  "0sZVT9XAEBc",
  "jzm-MnWC7I0",
  "IGIxBJA222o",
]);

const extractYouTubeId = (url = "") => {
  const value = String(url || "").trim();
  if (!value) return "";
  const shortMatch = value.match(/youtu\.be\/([^?&#/]+)/i);
  if (shortMatch?.[1]) return shortMatch[1];
  const watchMatch = value.match(/[?&]v=([^?&#/]+)/i);
  if (watchMatch?.[1]) return watchMatch[1];
  const embedMatch = value.match(/\/embed\/([^?&#/]+)/i);
  return embedMatch?.[1] || "";
};

const isRemovedB1TeacherVideo = (listening = {}) => {
  const ids = [
    listening.videoId,
    extractYouTubeId(listening.externalUrl),
    extractYouTubeId(listening.embedUrl),
  ].filter(Boolean);
  return ids.some((id) => REMOVED_B1_TEACHER_VIDEO_IDS.has(id));
};

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const WritingVideoCard = ({ resource }) => {
  if (!resource) return null;
  return (
    <div
      data-writing-video-support="true"
      aria-label="B1 writing explanation video"
      style={{
        display: "grid",
        gap: 12,
        border: "1px solid #bfdbfe",
        borderRadius: 16,
        padding: 14,
        background: "#eff6ff",
      }}
    >
      <span style={{ width: "fit-content", borderRadius: 999, padding: "5px 10px", background: "#dbeafe", color: "#1e3a8a", fontSize: ".82rem", fontWeight: 800 }}>
        Writing Video · Essay Ideas
      </span>
      <h3 style={{ margin: 0, color: "#1e3a8a" }}>{resource.title || "Writing explanation video"}</h3>
      {resource.description ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{resource.description}</p> : null}
      {resource.embedUrl ? (
        <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 14, overflow: "hidden", background: "#0f172a" }}>
          <iframe
            title={resource.title || "Writing explanation video"}
            src={resource.embedUrl}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      ) : resource.url ? (
        <a href={resource.url} target="_blank" rel="noreferrer" style={{ width: "fit-content", fontWeight: 800, color: "#1d4ed8" }}>
          Open writing video
        </a>
      ) : null}
    </div>
  );
};

const SectionImage = ({ image, alt }) => {
  if (!image) return null;
  return <img src={image} alt={alt || "Workbook section"} loading="lazy" style={imageStyle} />;
};

const BulletList = ({ items, ordered = false }) => {
  if (!items?.length) return null;
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag style={listSpacing}>
      {items.map((item, index) => {
        if (typeof item === "string") return <li key={`${item}-${index}`}>{item}</li>;
        return (
          <li key={`${item.label || item.title || index}-${index}`}>
            {item.label || item.title ? <strong>{item.label || item.title}</strong> : null}
            {item.text ? <> {item.text}</> : null}
            {item.items?.length ? <BulletList items={item.items} /> : null}
          </li>
        );
      })}
    </Tag>
  );
};

const IdeaGrid = ({ groups }) => {
  if (!groups?.length) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
      {groups.map((group) => (
        <div key={group.title} style={contentCard}>
          <strong>{group.title}</strong>
          <BulletList items={group.items} />
        </div>
      ))}
    </div>
  );
};

const QuestionList = ({ questions, startAt = 1, examGrid = false }) => {
  if (!questions?.length) return null;
  const Wrapper = examGrid ? ReadingQuestionGrid : React.Fragment;
  return (
    <Wrapper>
      {questions.map((question, index) => (
        <div key={`${question.stem}-${index}`} style={contentCard}>
          <strong>{startAt + index}. {question.stem}</strong>
          {question.options?.map((option) => <span key={option}>{option}</span>)}
        </div>
      ))}
    </Wrapper>
  );
};

const TextBlock = ({ block, examReading = false, sourceLabel = "" }) => {
  if (!block) return null;

  const body = (
    <>
      {block.paragraphs?.map((paragraph, index) => (
        <p key={`${block.title || "text"}-${index}`} style={{ margin: 0, lineHeight: 1.75 }}>
          {paragraph}
        </p>
      ))}
    </>
  );

  const source = examReading
    ? sourceLabel
      ? <ReadingSourceCard label={sourceLabel} title={block.title || ""}>{body}</ReadingSourceCard>
      : <ReadingExamDocument title={block.title || ""} subtitle={block.subtitle || ""}>{body}</ReadingExamDocument>
    : (
      <div style={{ display: "grid", gap: 10 }}>
        {block.title ? <h3 style={sectionTitle}>{block.title}</h3> : null}
        {block.subtitle ? <p style={{ margin: 0, color: "#475569" }}>{block.subtitle}</p> : null}
        {body}
      </div>
    );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {source}
      {block.questions?.length ? (
        <>
          <h3 style={sectionTitle}>{block.questionTitle || "Questions"}</h3>
          <QuestionList questions={block.questions} startAt={block.startAt || 1} examGrid={examReading} />
        </>
      ) : null}
    </div>
  );
};

const PlaceholderCard = ({ title, text }) => (
  <div style={{ ...contentCard, background: "#f8fafc", borderStyle: "dashed" }}>
    <strong>{title}</strong>
    <p style={{ margin: 0 }}>{text}</p>
  </div>
);

const getYouTubeEmbedUrl = (listening = {}) => {
  if (isRemovedB1TeacherVideo(listening)) return null;
  if (listening.embedUrl) return listening.embedUrl;
  if (!listening.videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${listening.videoId}?rel=0&playsinline=1`;
};

export const resolveB1CanonicalAssignmentSections = (config = {}) => {
  const canonicalWriting = getB1WritingTask(config.day);
  const canonicalReading = getB1ReadingTask(config.day);

  return {
    writing: canonicalWriting
      ? { ...(config.writing || {}), ...canonicalWriting }
      : (config.writing || {}),
    reading: canonicalReading
      ? { ...(config.reading || {}), ...canonicalReading }
      : (config.reading || {}),
  };
};

export const resolveB1WorkbookTabs = (listening = {}) =>
  listening.status === "unavailable"
    ? A2_B1_WORKBOOK_TABS_WITH_GRAMMAR.filter((tab) => tab.key !== "hoeren")
    : A2_B1_WORKBOOK_TABS_WITH_GRAMMAR;

export default function B1StandardWorkbookPage({ config, renderSections = null }) {
  const [displayedActiveTab, setActiveTab] = useState("grammar");
  const handleTimedExpiry = useCallback(() => setActiveTab("submit"), []);
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((previous) => ({ ...previous, [tabKey]: event.target.checked }));

  const speaking = config.speaking || {};
  const { writing, reading } = resolveB1CanonicalAssignmentSections(config);
  const lessonProfile = getA2B1LessonProfile("B1", config.day);
  const part4Profile = lessonProfile?.sections?.part4;
  const canonicalListening = getB1ListeningTask(config.day);
  const listening = canonicalListening
    ? { ...(config.listening || {}), ...canonicalListening }
    : (config.listening || { status: "planned" });
  const embedUrl = getYouTubeEmbedUrl(listening);
  const listeningRequiresSubmission = Boolean(part4Profile?.submitRequired);
  const writingRequired = Boolean(lessonProfile?.sections?.writing?.visible);
  const workbookTabs = A2_B1_WORKBOOK_TABS_WITH_GRAMMAR
    .filter((tab) => lessonProfile?.tabs?.[tab.key] !== false)
    .map((tab) =>
      tab.key === "hoeren" && part4Profile?.contentType === "reading"
        ? { ...tab, description: "Lesen" }
        : tab
    );
  const hasListeningTab = Boolean(part4Profile?.visible);

  return (
    <SharedTimedAssignment
      assignmentKey={config.assignmentKey}
      level="B1"
      onTimeExpired={handleTimedExpiry}
    >
      {({ isTabLocked }) => {
        const displayedActiveTab = isTabLocked(displayedActiveTab) ? "grammar" : displayedActiveTab;
        return (
              <div style={{ ...styles.container, display: "grid", gap: 16 }}>
                <div style={card}>
                  <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
                  <span style={{ ...styles.badge, width: "fit-content" }}>
                    B1 · Day {config.day} · Kapitel {config.chapter}
                  </span>
                  <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 Workbook · {config.title}</h1>
                  <p style={{ ...styles.subtitle, margin: 0 }}>
                    {config.subtitle || (writingRequired
                      ? (hasListeningTab
                        ? "Select Grammar, Teil 1–4, Ref or Submit below. The highlighted card at the top of each section tells you exactly what to answer."
                        : "Select Grammar, Teil 1–3, Ref or Submit below. This lesson intentionally has no Teil 4.")
                      : (hasListeningTab
                        ? `Today: Sprechen in class, then Teil 3 · Lesen and Teil 4 · ${part4Profile?.label || "Hören"}. Schreiben is not required for submission.`
                        : "Today: Sprechen in class, then Teil 3 · Lesen. Schreiben is not required for submission."))}
                  </p>
                  <SectionImage image={config.heroImage} alt={config.heroAlt} />
                  <WorkbookTabNav
                    activeTab={displayedActiveTab}
                    onChange={setActiveTab}
                    tabs={workbookTabs}
                    isTabLocked={isTabLocked}
                    ariaLabel={`B1 Day ${config.day} workbook sections`}
                  />
                </div>
          
                <A2B1WorkbookGuidance level="B1" />
          
                {displayedActiveTab === "grammar" && (
                  <section style={card}>
                    <A2B1GrammarNotesTab level="B1" day={config.day} />
                  </section>
                )}
          
                {renderSections && (displayedActiveTab !== "hoeren" || listening.mode === "reading-fallback") ? (
                  React.createElement(renderSections, { displayedActiveTab, prepared, setPreparedFor, listening, lessonProfile })
                ) : (
                  <>
                {displayedActiveTab === "sprechen" && (
                  <section style={card}>
                    <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
                    <WorkbookTaskCard
                      eyebrow="Question of the Day · Speaking"
                      title={speaking.question || "Speaking task will be added here."}
                      practiceOnly
                      submissionNote={speaking.submissionNote || "Prepare a 90–120 second answer for class. Teil 1 is not submitted."}
                    >
                      <p style={{ margin: 0 }}>
                        {speaking.instructions || "Use the idea bank and answer structure below to prepare a clear B1 response."}
                      </p>
                    </WorkbookTaskCard>
          
                    <SectionImage image={speaking.image} alt={speaking.imageAlt} />
          
                    {speaking.status === "planned" ? (
                      <PlaceholderCard
                        title="Speaking content skeleton"
                        text="Add the Question of the Day, idea groups, discussion prompts, answer structure and useful phrases here when the lesson content is ready."
                      />
                    ) : (
                      <>
                        <h3 style={sectionTitle}>{speaking.ideaTitle || "Brain Map and Idea Bank"}</h3>
                        {speaking.ideaIntro ? <p style={{ margin: 0, color: "#475569" }}>{speaking.ideaIntro}</p> : null}
                        <IdeaGrid groups={speaking.ideaGroups} />
          
                        {speaking.exampleTitle ? (
                          <div style={contentCard}>
                            <strong>{speaking.exampleTitle}</strong>
                            <BulletList items={speaking.exampleSteps} ordered />
                          </div>
                        ) : null}
          
                        {speaking.activityTitle ? <h3 style={sectionTitle}>{speaking.activityTitle}</h3> : null}
                        {speaking.activityIntro ? <p style={{ margin: 0 }}>{speaking.activityIntro}</p> : null}
                        <BulletList items={speaking.activityPoints} ordered={speaking.activityOrdered} />
          
                        {speaking.discussionQuestions?.length ? (
                          <>
                            <h3 style={sectionTitle}>Fragen zum Nachdenken</h3>
                            <BulletList items={speaking.discussionQuestions} />
                          </>
                        ) : null}
          
                        <h3 style={sectionTitle}>Suggested answer structure</h3>
                        <BulletList
                          items={speaking.answerStructure || [
                            "Begrüßung und Thema vorstellen.",
                            "Die wichtigsten Möglichkeiten oder Aspekte beschreiben.",
                            "Vor- und Nachteile nennen.",
                            "Ein persönliches Beispiel oder die Situation im Heimatland erklären.",
                            "Die eigene Meinung begründen und kurz zusammenfassen.",
                          ]}
                          ordered
                        />
          
                        <h3 style={sectionTitle}>Useful phrases</h3>
                        <BulletList items={speaking.usefulPhrases || ["Meiner Meinung nach …", "Einerseits …, andererseits …", "Ein Vorteil/Nachteil ist, dass …", "Ich finde … wichtig, weil …"]} />
                      </>
                    )}
          
                    <CourseInlinePracticePanel type="speaking" />
                    <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
                  </section>
                )}
          
                {writingRequired && displayedActiveTab === "schreiben" && (
                  <section style={card}>
                    <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
                    <WorkbookTaskCard
                      eyebrow="Your assignment · Writing"
                      title={writing.title || "Writing task will be added here."}
                      submissionNote={writing.submissionNote || "Write approximately 80–100 words and submit the finished text through the Submit tab."}
                    >
                      <p style={{ margin: 0 }}>
                        {writing.instructions || "State your opinion clearly, give reasons and include a relevant example."}
                      </p>
                    </WorkbookTaskCard>
          
                    <SectionImage image={writing.image} alt={writing.imageAlt} />
          
                    {writing.status === "planned" ? (
                      <PlaceholderCard
                        title="Writing content skeleton"
                        text="Add the writing situation, source opinion, required content points, support structure and model template here."
                      />
                    ) : (
                      <>
                        {writing.sourceText ? (
                          <div style={contentCard}>
                            <strong>{writing.sourceTitle || "Source text"}</strong>
                            <p style={{ margin: 0 }}>{writing.sourceText}</p>
                          </div>
                        ) : null}
                      </>
                    )}
          
                    <WritingVideoCard resource={config.writingVideo} />
          
                    <CourseInlinePracticePanel
                      type="writing"
                      title={writing.title || "Teil 2 writing task"}
                      writingContext={{
                        level: "B1",
                        courseLevel: "B1",
                        day: config.day,
                        lessonId: `B1-day-${config.day}`,
                        workbookId: writing.workbookId || config.workbookId || `B1-day-${config.day}`,
                        writingTaskId: writing.writingTaskId || `${writing.workbookId || config.workbookId || `B1-day-${config.day}`}-teil-2-writing`,
                        taskTitle: writing.title,
                        taskPoints: writing.taskPoints,
                        supportStructure: writing.supportStructure,
                        template: writing.template,
                        vocabulary: writing.vocabulary,
                      }}
                    />
                    <WorkbookSubmissionReminder />
                    <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
                  </section>
                )}
          
                {displayedActiveTab === "lesen" && (
                  <section style={card}>
                    <h2 style={sectionTitle}>Teil 3 · Lesen (Assignment)</h2>
                    <WorkbookTaskCard
                      eyebrow="Your assignment · Reading"
                      title={reading.title || "Reading task will be added here."}
                      submissionNote={reading.submissionNote || "Submit only the answer letters through the Submit tab."}
                    >
                      <p style={{ margin: 0 }}>
                        {reading.instructions || "Read the complete text first. Then answer every question."}
                      </p>
                    </WorkbookTaskCard>
          
                    <SectionImage image={reading.image} alt={reading.imageAlt} />
          
                    {reading.status === "planned" ? (
                      <PlaceholderCard
                        title="Reading content skeleton"
                        text="Add the reading text, question set, answer options and answer format here when the material is ready."
                      />
                    ) : (
                      <ReadingExamFrame
                        level="B1"
                        title={reading.text?.title || reading.title || "Lesen"}
                        format={reading.additionalTexts?.length ? "Mehrere Texte" : "Lesetext"}
                        variant={reading.additionalTexts?.length ? "sources" : "document"}
                      >
                        {reading.additionalTexts?.length ? (
                          <ReadingSourceGrid>
                            <TextBlock block={reading.text} examReading sourceLabel={readingSourceLabel(0)} />
                            {reading.additionalTexts.map((block, index) => (
                              <TextBlock
                                key={`${block.title || "additional"}-${index}`}
                                block={block}
                                examReading
                                sourceLabel={readingSourceLabel(index + 1)}
                              />
                            ))}
                          </ReadingSourceGrid>
                        ) : (
                          <TextBlock block={reading.text} examReading />
                        )}
                      </ReadingExamFrame>
                    )}
          
                    <A2B1ReadingQualityChallenge level="B1" day={config.day} />
                    <WorkbookSubmissionReminder />
                    <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
                  </section>
                )}
          
                {displayedActiveTab === "hoeren" && hasListeningTab && (
                  <section style={card}>
                    <h2 style={sectionTitle}>Teil 4 · Hören ({listeningRequiresSubmission ? "Assignment" : "Self-check"})</h2>
                    <WorkbookTaskCard
                      eyebrow={listeningRequiresSubmission ? "Your assignment · Listening" : "Listening · Self-check"}
                      title={listening.title || "Listening task will be added here."}
                      submissionNote={
                        listening.submissionNote ||
                        (listeningRequiresSubmission
                          ? "Submit your listening answers through the Submit tab."
                          : "Self-check this part. Submit only if your teacher asks for it.")
                      }
                    >
                      <p style={{ margin: 0 }}>
                        {listening.instructions || "Listen carefully and complete the questions."}
                      </p>
                    </WorkbookTaskCard>
          
                    <SectionImage image={listening.image} alt={listening.imageAlt} />
          
                    {listening.status === "unavailable" ? (
                      <PlaceholderCard
                        title={listening.title || "No listening task for this lesson"}
                        text={listening.instructions || "This lesson intentionally has no Teil 4 · Hören."}
                      />
                    ) : listening.status === "planned" ? (
                      <PlaceholderCard
                        title="Listening content skeleton"
                        text={
                          listeningRequiresSubmission
                            ? "Add the listening media, questions and submission instructions here when the material is ready."
                            : "Add the listening media, questions and self-check instructions here when the material is ready."
                        }
                      />
                    ) : embedUrl ? (
                      <>
                        <iframe title={listening.videoTitle || `B1 Day ${config.day} listening`} src={embedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={videoStyle} />
                        {listening.externalUrl ? <a href={listening.externalUrl} target="_blank" rel="noreferrer">Open listening resource</a> : null}
                        {listening.selfCheckText ? <p style={{ margin: 0 }}>{listening.selfCheckText}</p> : null}
                        <QuestionList questions={listening.questions || []} />
                      </>
                    ) : (
                      <PlaceholderCard
                        title="Listening media missing"
                        text="The old B1 teacher/listening video link has been removed. Add a new video link when the replacement is ready."
                      />
                    )}
          
                    <WorkbookSubmissionReminder />
                    <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
                  </section>
                )}
          
                  </>
                )}

                {renderSections && displayedActiveTab === "lesen" ? (
                  <A2B1ReadingQualityChallenge level="B1" day={config.day} />
                ) : null}
          
                {displayedActiveTab === "references" && (
                  <WorkbookReferenceAnswers
                    level="B1"
                    lesson={{ title: config.workbookId || `B1Day${config.day}`, level: "B1", day: config.day, workbookId: config.workbookId }}
                    workbookId={config.workbookId}
                  />
                )}
          
                {displayedActiveTab === "submit" && (
                  <section style={card}>
                    <h2 style={sectionTitle}>Submit workbook answers</h2>
                    <WorkbookTaskCard
                      eyebrow="Final step"
                      title={config.submitTitle || lessonProfile?.submission?.title || "Submit final answers."}
                      submissionNote={config.submitNote || lessonProfile?.submission?.note || ""}
                    >
                      <p style={{ margin: 0 }}>
                        {config.submitInstructions || lessonProfile?.submission?.instructions || "Enter your final answers in the form below."}
                      </p>
                    </WorkbookTaskCard>
                    <div className="b1-standard-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
                      <style>{`.b1-standard-submission-page > div > section:first-child { display: none !important; }
                      .b1-standard-submission-page select { display: none !important; }`}</style>
                      <AssignmentSubmissionPage
                        submissionContext={{
                          level: "B1",
                          day: config.day,
                          assignmentKey: config.assignmentKey,
                          canonicalAssignmentKey: config.assignmentKey,
                          lessonProfileVersion: lessonProfile?.version || null,
                          requiredSubmissionParts: lessonProfile?.requiredSubmissionParts?.map((part) => part.partId) || [],
                        }}
                      />
                    </div>
                  </section>
                )}
              </div>
        );
      }}
    </SharedTimedAssignment>
  );
}
