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
