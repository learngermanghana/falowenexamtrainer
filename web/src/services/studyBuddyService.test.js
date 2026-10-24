import { registerAssessmentRestriction } from "../utils/assessmentRestrictions";
import { callAI } from "./aiClient";
import {
  clearStudyBuddyConversationHistory,
  readStudyBuddyConversationHistory,
  requestStudyBuddyReply,
} from "./studyBuddyService";

jest.mock("./aiClient", () => ({
  callAI: jest.fn(),
}));

jest.mock("../firebase", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  db: null,
  isFirebaseConfigured: false,
  serverTimestamp: jest.fn(),
}));

describe("Study Buddy conversation memory", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, "", "/");
    callAI.mockReset();
  });

  it("includes the previous Study Buddy exchange when the student asks a follow-up", async () => {
    callAI
      .mockResolvedValueOnce({ reply: "Obwohl introduces a contrast." })
      .mockResolvedValueOnce({ reply: "Because the two ideas are different." });

    await requestStudyBuddyReply({
      message: "Was bedeutet obwohl?",
      level: "B1",
      idToken: "",
    });

    await requestStudyBuddyReply({
      message: "Warum?",
      level: "B1",
      idToken: "",
    });

    const secondPrompt = callAI.mock.calls[1][0].payload.message;
    expect(secondPrompt).toContain("RECENT CONVERSATION:");
    expect(secondPrompt).toContain("STUDENT: Was bedeutet obwohl?");
    expect(secondPrompt).toContain("STUDY BUDDY: Obwohl introduces a contrast.");
    expect(secondPrompt).toContain("STUDENT MESSAGE:\nWarum?");
  });

  it("automatically injects the exact current lesson into Study Buddy", async () => {
    window.history.replaceState(
      {},
      "",
      "/campus/course/lesson/B2/6?chapter=2.1&view=hoeren",
    );
    window.localStorage.setItem(
      "falowen:b2:day6:standard-journey:progress-v2",
      JSON.stringify({ learnDone: true, hoerenDone: false }),
    );
    callAI.mockResolvedValue({ reply: "Ein Hinweis zur dritten Frage." });

    await requestStudyBuddyReply({
      message: "Ich verstehe Frage 3 nicht.",
      level: "B2",
      idToken: "",
    });

    const request = callAI.mock.calls[0][0];
    expect(request.payload.lessonContext).toEqual(expect.objectContaining({
      source: "structured-course-context",
      level: "B2",
      day: 6,
      activeView: "hoeren",
      mainSkill: "Hören",
      grammarFocus: expect.stringContaining("Passiv"),
    }));
    expect(request.payload.message).toContain("Day: 6");
    expect(request.payload.message).toContain("Main skill: Hören");
    expect(request.payload.message).toContain("Grammar focus:");
    expect(request.payload.message).toContain("Current task items:");
    expect(request.payload.message).toContain("3. Was bedeutet Speicherkapazität im Gespräch?");
    expect(request.payload.message).toContain("learnDone=true");
    expect(request.payload.message).toContain("do not reveal the correct option before the student has tried");
  });

  it("answers the canonical Course Book route without relying on an AI-generated link", async () => {
    const response = await requestStudyBuddyReply({
      message: "Where can I access my course book?",
      level: "A2",
      idToken: "",
    });

    expect(response.reply).toContain("Course Book");
    expect(response.reply).toContain("https://www.falowen.app/campus/course");
    expect(response.navigation).toBe("courseBook");
    expect(callAI).not.toHaveBeenCalled();
  });

  it("takes the student's exact Results question to Results, never Exams Room", async () => {
    const response = await requestStudyBuddyReply({
      message: "How can I access my result?",
      level: "B1",
      idToken: "",
    });
    expect(response.navigation).toBe("results");
    expect(response.reply).toContain("https://www.falowen.app/campus/results");
    expect(response.reply).not.toContain("https://www.falowen.app/exams/overview");
    expect(callAI).not.toHaveBeenCalled();
    expect(readStudyBuddyConversationHistory({ idToken: "", level: "B1" })).toEqual([
      { role: "user", content: "How can I access my result?" },
      { role: "assistant", content: response.reply },
    ]);
  });

  it("keeps mock results distinct from starting or resuming a mock", async () => {
    const result = await requestStudyBuddyReply({
      message: "Where can I check my B1 exam results?",
      level: "B1",
      idToken: "",
    });
    const exam = await requestStudyBuddyReply({
      message: "Where can I start a B1 mock exam?",
      level: "B1",
      idToken: "",
    });
    expect(result.navigation).toBe("results");
    expect(result.reply).toContain("/campus/results");
    expect(exam.navigation).toBe("exams");
    expect(exam.reply).toContain("/exams/overview");
    expect(callAI).not.toHaveBeenCalled();
  });

  it("does not hijack grammar learning questions", async () => {
    callAI.mockResolvedValue({ reply: "Mit is followed by Dativ." });
    const response = await requestStudyBuddyReply({
      message: "Why is mit followed by Dativ?",
      level: "A2",
      idToken: "",
    });
    expect(response.reply).toBe("Mit is followed by Dativ.");
    expect(callAI).toHaveBeenCalledTimes(1);
    const prompt = callAI.mock.calls[0][0].payload.message;
    expect(prompt).toContain("FALOWEN NAVIGATION SUPPORT (authoritative)");
    expect(prompt).toContain("CRITICAL RESULTS VS EXAMS DISTINCTION");
    expect(prompt).toContain("Falowen navigation/support questions are not unrelated");
    expect(prompt).toContain("My Library");
    expect(prompt).toContain("Learning Hub");
    expect(prompt).toContain("My Hub");
  });

  it("stores successful exchanges and keeps levels separated", async () => {
    callAI.mockResolvedValue({ reply: "Ein kurzes Beispiel." });

    await requestStudyBuddyReply({
      message: "Gib mir ein Beispiel.",
      level: "A2",
      idToken: "",
    });

    expect(readStudyBuddyConversationHistory({ idToken: "", level: "A2" })).toEqual([
      { role: "user", content: "Gib mir ein Beispiel." },
      { role: "assistant", content: "Ein kurzes Beispiel." },
    ]);
    expect(readStudyBuddyConversationHistory({ idToken: "", level: "B1" })).toEqual([]);
  });

  it("can clear one student's level-specific conversation history", async () => {
    callAI.mockResolvedValue({ reply: "Antwort" });

    await requestStudyBuddyReply({
      message: "Frage",
      level: "C1",
      idToken: "",
    });

    clearStudyBuddyConversationHistory({ idToken: "", level: "C1" });

    expect(readStudyBuddyConversationHistory({ idToken: "", level: "C1" })).toEqual([]);
  });
});

it("does not request AI help while an assessment is mounted", async () => {
  callAI.mockClear();
  const release = registerAssessmentRestriction();
  try {
    await expect(requestStudyBuddyReply({ message: "Give me the answer", level: "A1" })).rejects.toThrow("StudyBuddy is unavailable");
    expect(callAI).not.toHaveBeenCalled();
  } finally { release(); }
});

it("blocks a direct StudyBuddy request on a mock route", async () => {
  callAI.mockClear();
  window.history.replaceState({}, "", "/campus/course/a1-final-mock-exam");
  try {
    await expect(requestStudyBuddyReply({ message: "Translate this", level: "A1" })).rejects.toThrow("StudyBuddy is unavailable");
    expect(callAI).not.toHaveBeenCalled();
  } finally { window.history.replaceState({}, "", "/"); }
});
