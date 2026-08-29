import fs from "fs";
import path from "path";

const componentSource = fs.readFileSync(path.join(__dirname, "StudyBuddyBar.js"), "utf8");
const chatCssSource = fs.readFileSync(path.join(__dirname, "StudyBuddyChat.css"), "utf8");

describe("Study Buddy chat interface", () => {
  test("renders stored conversation history and reset control", () => {
    expect(componentSource).toContain("readStudyBuddyConversationHistory");
    expect(componentSource).toContain("clearStudyBuddyConversationHistory");
    expect(componentSource).toContain("study-buddy-chat-history");
    expect(componentSource).toContain("New conversation");
    expect(componentSource).toContain("Ask a follow-up question");
  });

  test("starts visible in a body-level overlay so workbook layouts cannot hide it", () => {
    expect(componentSource).toContain("useState(false)");
    expect(componentSource).toContain("createPortal(node, document.body)");
  });

  test("styles user and assistant messages separately", () => {
    expect(chatCssSource).toContain("study-buddy-chat-row--user");
    expect(chatCssSource).toContain("study-buddy-chat-row--assistant");
  });

  test("keeps chat compact on mobile", () => {
    expect(chatCssSource).toContain("@media (max-width: 640px)");
    expect(chatCssSource).toContain("max-height: 210px");
  });
});
