import React from "react";
import { getA2ReadingTask } from "../data/a2ReadingTasks";
import ReadingExamFrame, { ReadingExamDocument, ReadingQuestionGrid, ReadingSourceCard, ReadingSourceGrid, getReadingExamVariant, readingSourceLabel, splitReadingSourceText } from "./ReadingExamLayout";
import A2B1NoWritingReadingChallenge from "./A2B1NoWritingReadingChallenge";

const taskCard = {
  border: "1px solid #dbeafe",
  borderRadius: 14,
  padding: 14,
  background: "#f8fbff",
  display: "grid",
  gap: 9,
};

const questionCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};

const A2ReadingTaskPanel = ({ day }) => {
  const task = getA2ReadingTask(day);
  const text = task?.text || "";
  const questions = task?.questions || [];
  const sourceBlocks = splitReadingSourceText(text, task?.format || "");
  const variant = getReadingExamVariant({
    format: task?.format || "",
    sourceCount: sourceBlocks.length,
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <p style={{ margin: 0 }}>
        Lies den Text und die Fragen. <strong>Antworte nicht direkt auf dieser Seite.</strong> Trage deine endgültigen
        Antwortbuchstaben im Submit-Bereich ein.
      </p>

      <ReadingExamFrame
        level="A2"
        title={task?.title || "Lesen"}
        format={task?.format || "Lesetext"}
        strategy={task?.strategy || ""}
        variant={variant}
      >
        {variant === "sources" ? (
          <ReadingSourceGrid>
            {sourceBlocks.map((source, index) => (
              <ReadingSourceCard key={`${day}-source-${index}`} label={readingSourceLabel(index)}>
                <div style={{ whiteSpace: "pre-line" }}>{source}</div>
              </ReadingSourceCard>
            ))}
          </ReadingSourceGrid>
        ) : (
          <ReadingExamDocument title={task?.title || ""}>
            <div style={{ whiteSpace: "pre-line" }}>
              {text || "Lies einen kurzen A2-Text zum Thema des Tages und finde Hauptinformation und wichtige Details."}
            </div>
          </ReadingExamDocument>
        )}
      </ReadingExamFrame>

      <ReadingQuestionGrid>
        {questions.map((question, index) => (
          <div key={`${day}-reading-${index}-${question.stem}`} style={questionCard}>
            <strong>{index + 1}. {question.stem}</strong>
            {(question.options || []).map((option) => <span key={option}>{option}</span>)}
          </div>
        ))}
      </ReadingQuestionGrid>

      <A2B1NoWritingReadingChallenge level="A2" day={day} />
    </div>
  );
};
export default A2ReadingTaskPanel;
