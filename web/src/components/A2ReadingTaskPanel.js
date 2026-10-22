import React from "react";
import { getA2ReadingTask } from "../data/a2ReadingTasks";
import ReadingExamFrame, { ReadingExamDocument, ReadingQuestionGrid, ReadingSourceCard, ReadingSourceGrid, getReadingExamVariant, parseLetteredOfferSources, readingSourceLabel, splitReadingSourceText } from "./ReadingExamLayout";
import A2B1ReadingQualityChallenge from "./A2B1ReadingQualityChallenge";

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
  // Day 15 has a separate course heading and five pre-labelled offers A–E.
  // Keep the offer letters aligned with the published question choices.
  const day15Offers = Number(day) === 15
    ? parseLetteredOfferSources(text, task?.format || "")
    : null;
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
          <>
            {day15Offers ? (
              <div
                data-a2-day15-offer-introduction="true"
                style={{
                  border: "1px solid #bfdbfe",
                  borderRadius: 12,
                  background: "#f0f7ff",
                  padding: "14px 16px",
                  marginBottom: 12,
                  display: "grid",
                  gap: 6,
                }}
              >
                <h3 style={{ margin: 0, color: "#0f172a", fontSize: 16 }}>
                  {day15Offers.heading}
                </h3>
                <p style={{ margin: 0, color: "#334155", fontSize: 13, lineHeight: 1.6 }}>
                  Vergleiche Angebot A bis E. In den Fragen wählst du eine Antwortoption
                  (A–D); ihr Buchstabe ist nicht immer derselbe wie der des Angebots.
                </p>
              </div>
            ) : null}
            <ReadingSourceGrid>
              {(day15Offers ? day15Offers.offers : sourceBlocks).map((source, index) => (
                <ReadingSourceCard
                  key={`${day}-source-${index}`}
                  label={day15Offers ? source.label : readingSourceLabel(index)}
                  title={day15Offers ? source.title : ""}
                >
                  <div style={{ whiteSpace: "pre-line" }}>
                    {day15Offers ? source.description : source}
                  </div>
                </ReadingSourceCard>
              ))}
            </ReadingSourceGrid>
          </>
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

      <A2B1ReadingQualityChallenge level="A2" day={day} />
    </div>
  );
};
export default A2ReadingTaskPanel;
