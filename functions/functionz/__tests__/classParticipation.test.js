jest.mock("firebase-admin", () => ({
  firestore: {
    FieldPath: { documentId: () => "__name__" },
  },
}));

const {
  safeQuestionResponses,
  studentSafeRecord,
} = require("../routes/classParticipation");

describe("Class Participation student-safe recap", () => {
  test("keeps concept labels on student-safe question responses", () => {
    expect(safeQuestionResponses([
      {
        questionId: "q1",
        question: "Wie heißt du?",
        conceptLabel: "Sich vorstellen",
        result: "correct",
        questionContext: "class-check",
        recordedAt: "2026-09-12T08:00:00.000Z",
      },
      {
        questionId: "q2",
        question: "Internal presenter absence marker",
        conceptLabel: "Private",
        result: "presenter_absent",
      },
    ])).toEqual([
      {
        questionId: "q1",
        question: "Wie heißt du?",
        conceptLabel: "Sich vorstellen",
        result: "correct",
        questionContext: "class-check",
        recordedAt: "2026-09-12T08:00:00.000Z",
      },
    ]);
  });

  test("exposes recap guidance and derives review topics for older records", () => {
    const snapshot = {
      id: "record-1",
      data: () => ({
        sessionId: "session-1",
        classId: "A1-Berlin",
        className: "A1 Berlin",
        course: "A1",
        assignmentId: "A1-1.1",
        lessonDay: "Day 1",
        lessonTitle: "Begrüßung",
        sessionDate: "2026-09-12",
        turns: 2,
        correct: 1,
        needsReview: 1,
        skipped: 0,
        questionResponses: [
          {
            questionId: "q1",
            question: "Wie heißt du?",
            conceptLabel: "Sich vorstellen",
            result: "correct",
          },
          {
            questionId: "q2",
            question: "Wie geht es dir?",
            conceptLabel: "W-Fragen",
            result: "needs_review",
          },
        ],
        focusConcept: "W-Fragen",
      }),
    };

    const record = studentSafeRecord(snapshot);

    expect(record.className).toBe("A1 Berlin");
    expect(record.questionResponses[1].conceptLabel).toBe("W-Fragen");
    expect(record.reviewConcepts).toEqual(["W-Fragen"]);
    expect(record.focusConcept).toBe("W-Fragen");
    expect(record.reviewRecommendation).toBe("Review next: W-Fragen");
  });

  test("exposes canonical recap identity and keeps lesson date separate from marking date", () => {
    const snapshot = {
      id: "record-rescheduled",
      data: () => ({
        classSessionId: "live-session-22",
        sessionId: "legacy-session-2026-09-11",
        revision: 4,
        sessionDate: "2026-09-11",
        markedDate: "2026-09-12",
        updatedAt: "2026-09-12T09:30:00.000Z",
      }),
    };

    const record = studentSafeRecord(snapshot);

    expect(record.classSessionId).toBe("live-session-22");
    expect(record.sessionId).toBe("legacy-session-2026-09-11");
    expect(record.revision).toBe(4);
    expect(record.sessionDate).toBe("2026-09-11");
    expect(record.markedDate).toBe("2026-09-12");
    expect(record.updatedAt).toBe("2026-09-12T09:30:00.000Z");
  });

  test("keeps explicit review guidance while limiting student-safe concept fields", () => {
    const snapshot = {
      id: "record-2",
      data: () => ({
        reviewConcepts: ["Perfekt", "Perfekt", "Wortstellung"],
        focusConcept: "Perfekt",
        reviewRecommendation: "Review the Perfekt examples before the next class.",
        questionResponses: [],
      }),
    };

    const record = studentSafeRecord(snapshot);

    expect(record.reviewConcepts).toEqual(["Perfekt", "Wortstellung"]);
    expect(record.focusConcept).toBe("Perfekt");
    expect(record.reviewRecommendation).toBe(
      "Review the Perfekt examples before the next class."
    );
  });
});
