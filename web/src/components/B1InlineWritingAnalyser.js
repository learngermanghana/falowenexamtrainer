import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { markLetterWithAI } from "../services/coachService";
import WritingFeedbackCard from "./WritingFeedbackCard";
import { styles } from "../styles";

const resolveStudentName = ({ studentProfile, user }) =>
  String(
    studentProfile?.name ||
      studentProfile?.fullName ||
      user?.displayName ||
      user?.email ||
      "Student",
  ).trim();

export default function B1InlineWritingAnalyser({
  text = "",
  taskTitle = "Writing task",
  level = "B1",
}) {
  const { user, idToken, studentProfile } = useAuth();
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resolvedLevel = String(level || "B1").toUpperCase() === "A2" ? "A2" : "B1";

  const analyseText = async () => {
    const draft = String(text || "").trim();
    if (!draft) {
      setError("Write your German text first, then click Analyse my text.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await markLetterWithAI({
        text: draft,
        level: resolvedLevel,
        studentName: resolveStudentName({ studentProfile, user }),
        program: studentProfile?.program,
        submissionContext: `course-task:${taskTitle}`,
        promptType: "opinion",
        idToken,
      });
      setFeedbackData(result);
    } catch (analyseError) {
      setError(
        analyseError?.response?.data?.error ||
          analyseError?.message ||
          "Falowen could not analyse your text right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <button
        type="button"
        style={{ ...styles.primaryButton, width: "fit-content" }}
        onClick={analyseText}
        disabled={loading}
      >
        {loading ? "Analysing your text…" : "Analyse my text"}
      </button>

      {error ? <div role="alert" style={styles.errorBox}>{error}</div> : null}

      {feedbackData ? (
        <WritingFeedbackCard
          feedback={feedbackData.feedback || "Analysis completed."}
          level={resolvedLevel}
          draft={text}
          rubric={feedbackData.rubric || null}
          corrections={feedbackData.corrections || []}
          simplifiedFeedback={feedbackData.simplifiedFeedback || null}
          structuredFeedback={feedbackData.structuredFeedback || feedbackData}
          trend={feedbackData.trend || null}
        />
      ) : null}
    </div>
  );
}
