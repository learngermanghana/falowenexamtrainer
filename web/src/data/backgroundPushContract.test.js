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
  "sendPaymentReminders",
  "onMarkedAssignmentNotificationCreated",
  "onClassLessonNoteCreated"
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
  test("notification jobs are detached and attendance progress remains", () => {
    expect(read("functions/index.entry.js")).not.toContain('require("./index.notifications")');
    expect(read("functions/index.js")).toContain("exports.onAttendanceCheckinWritten");
  });
  test("web clients do not register or test device push", () => {
    expect(read("web/src/firebase.js")).toContain("const requestMessagingToken = async () => null;");
    expect(read("web/src/firebase.js")).toContain("const listenForForegroundMessages = async () => () => {};");
    expect(read("web/src/context/AuthContext.js")).toContain("const hasVapidKey = false;");
    const settings = read("web/src/components/NotificationSettingsCard.js");
    expect(settings).not.toContain("sendPushTestNotification");
    expect(settings).toContain("() => null");
    expect(read("web/src/App.js")).not.toContain("<NotificationBell");
    expect(read("web/src/components/AccountSettings.js")).not.toContain('key: "notifications"');
    const worker = read("web/public/firebase-messaging-sw.js");
    expect(worker).not.toContain("onBackgroundMessage");
    expect(worker).not.toContain("showNotification");
    expect(worker).toContain('addEventListener("fetch"');
  });
});
