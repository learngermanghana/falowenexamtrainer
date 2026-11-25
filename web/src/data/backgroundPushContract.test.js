import fs from "fs";
import path from "path";
const root = path.resolve(process.cwd(), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const retired = [
  "onClassSessionPushLifecycleUpdated",
  "onAnnouncementCreated",
  "onAttendanceSessionUpdated",
  "sendPushTestNotification",
  "onClassBoardPostCreated",
  "onQaPostCreated",
  "onQaPostUpdated",
  "onScoreCreated",
  "onExamTutorReviewCreated",
  "onExamTutorReviewUpdated",
  "sendPaymentReminders"
];
describe("retired device push contract", () => {
  test("push-only functions are not exported or deployed", () => {
    const index = read("functions/index.js");
    const notifications = read("functions/index.notifications.js");
    const workflow = read(".github/workflows/deploy-functions.yml");
    for (const name of retired) {
      expect(index).not.toContain("exports." + name + " =");
      expect(notifications).not.toContain("exportedFunctions." + name + " =");
      expect(workflow).not.toContain("functions:falowenexamtrainer:" + name);
      expect(workflow).toContain('"' + name + '"');
    }
    expect(index).not.toContain("sendEachForMulticast");
    expect(notifications).not.toContain("sendEachForMulticast");
  });
  test("in-app notifications and attendance progress remain", () => {
    const notifications = read("functions/index.notifications.js");
    expect(notifications).toContain("exportedFunctions.onMarkedAssignmentNotificationCreated");
    expect(notifications).toContain("exportedFunctions.onClassLessonNoteCreated");
    expect(notifications).toContain("await persistInAppNotification");
    expect(read("functions/index.js")).toContain("exports.onAttendanceCheckinWritten");
  });
  test("web clients do not register or test device push", () => {
    expect(read("web/src/firebase.js")).toContain("const requestMessagingToken = async () => null;");
    expect(read("web/src/firebase.js")).toContain("const listenForForegroundMessages = async () => () => {};");
    expect(read("web/src/context/AuthContext.js")).toContain("const hasVapidKey = false;");
    const settings = read("web/src/components/NotificationSettingsCard.js");
    expect(settings).not.toContain("sendPushTestNotification");
    expect(settings).toContain("Important updates are sent by email");
  });
});
