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

  it("treats Falowen navigation questions as in-scope and supplies the canonical Course Book path", async () => {
    callAI.mockResolvedValue({ reply: "Tap Learn to open your Course Book." });

    await requestStudyBuddyReply({
      message: "Where can I access my course book?",
      level: "A2",
      idToken: "",
    });

    const prompt = callAI.mock.calls[0][0].payload.message;
    expect(prompt).toContain("FALOWEN NAVIGATION SUPPORT (authoritative)");
    expect(prompt).toContain("tap/click the visible Learn navigation item");
    expect(prompt).toContain("https://www.falowen.app/campus/course");
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
