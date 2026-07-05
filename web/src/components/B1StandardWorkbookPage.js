import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";
import { styles } from "../styles";

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

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

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

const QuestionList = ({ questions, startAt = 1 }) => {
  if (!questions?.length) return null;
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {questions.map((question, index) => (
        <div key={`${question.stem}-${index}`} style={contentCard}>
          <strong>{startAt + index}. {question.stem}</strong>
          {question.options?.map((option) => <span key={option}>{option}</span>)}
        </div>
      ))}
    </div>
  );
};

const TextBlock = ({ block }) => {
  if (!block) return null;
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {block.title ? <h3 style={sectionTitle}>{block.title}</h3> : null}
      {block.subtitle ? <p style={{ margin: 0, color: "#475569" }}>{block.subtitle}</p> : null}
      {block.paragraphs?.map((paragraph, index) => (
        <p key={`${block.title || "text"}-${index}`} style={{ margin: 0, lineHeight: 1.75 }}>
          {paragraph}
        </p>
      ))}
      {block.questions?.length ? (
        <>
          <h3 style={sectionTitle}>{block.questionTitle || "Questions"}</h3>
          <QuestionList questions={block.questions} startAt={block.startAt || 1} />
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
  if (listening.embedUrl) return listening.embedUrl;
  if (!listening.videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${listening.videoId}?rel=0&playsinline=1`;
};

export default function B1StandardWorkbookPage({ config }) {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((previous) => ({ ...previous, [tabKey]: event.target.checked }));

  const speaking = config.speaking || {};
  const writing = config.writing || {};
  const reading = config.reading || {};
  const listening = config.listening || { status: "planned" };
  const embedUrl = getYouTubeEmbedUrl(listening);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>
          B1 · Day {config.day} · Kapitel {config.chapter}
        </span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 Workbook · {config.title}</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          {config.subtitle || "Select Teil 1–4 below. The highlighted card at the top of each section tells you exactly what to answer."}
        </p>
        <SectionImage image={config.heroImage} alt={config.heroAlt} />
        <WorkbookTabNav
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={STANDARD_WORKBOOK_TABS}
          ariaLabel={`B1 Day ${config.day} workbook sections`}
        />
      </div>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
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

      {activeTab === "schreiben" && (
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

      {activeTab === "lesen" && (
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
            <>
              <TextBlock block={reading.text} />
              {reading.additionalTexts?.map((block, index) => (
                <div key={`${block.title || "additional"}-${index}`} style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
                  <TextBlock block={block} />
                </div>
              ))}
            </>
          )}

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Self-check)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Listening"
            title={listening.title || "Listening task will be added here."}
            submissionNote={listening.submissionNote || "Self-check this part. Submit only if your teacher asks for it."}
          >
            <p style={{ margin: 0 }}>
              {listening.instructions || "Listen carefully and complete the questions."}
            </p>
          </WorkbookTaskCard>

          <SectionImage image={listening.image} alt={listening.imageAlt} />

          {listening.status === "planned" ? (
            <PlaceholderCard
              title="Listening content skeleton"
              text="Add the listening media, questions and self-check instructions here when the material is ready."
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
              text="The questions are ready, but the listening resource link has not been added yet."
            />
          )}

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="B1"
          lesson={{ title: config.workbookId || `B1Day${config.day}`, level: "B1", day: config.day, workbookId: config.workbookId }}
          workbookId={config.workbookId}
        />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={sectionTitle}>Submit workbook answers</h2>
          <WorkbookTaskCard
            eyebrow="Final step"
            title={config.submitTitle || "Submit Teil 2 and Teil 3."}
            submissionNote={config.submitNote || "Teil 1 is group practice. Teil 4 may be self-check depending on the lesson."}
          >
            <p style={{ margin: 0 }}>
              {config.submitInstructions || "Paste your final writing text and reading answers into the form below."}
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
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
