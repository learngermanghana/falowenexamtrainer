import { buildAttendanceNotification } from "./notificationService";

describe("buildAttendanceNotification", () => {
  it("prefers the pushed session when sessionId is provided", () => {
    const payload = {
      records: [
        {
          id: "old-absent",
          title: "Week Five: Chapter 3.5",
          marked: true,
          present: false,
          markedAt: "2026-03-10T10:00:00.000Z",
        },
        {
          id: "new-present",
          title: "Week Six: Chapter 3.6",
          marked: true,
          present: true,
          date: "2026-03-01T10:00:00.000Z",
        },
      ],
    };

    const notification = buildAttendanceNotification(payload, { sessionId: "new-present" });

    expect(notification).toBeTruthy();
    expect(notification.title).toBe("Marked present ✅");
    expect(notification.body).toBe("Week Six: Chapter 3.6 • Present");
  });

  it("falls back to latest marked record when sessionId is missing", () => {
    const payload = {
      records: [
        {
          id: "old-absent",
          title: "Week Five: Chapter 3.5",
          marked: true,
          present: false,
          markedAt: "2026-03-10T10:00:00.000Z",
        },
        {
          id: "new-present",
          title: "Week Six: Chapter 3.6",
          marked: true,
          present: true,
          date: "2026-03-01T10:00:00.000Z",
        },
      ],
    };

    const notification = buildAttendanceNotification(payload);

    expect(notification).toBeTruthy();
    expect(notification.title).toBe("Marked absent ❌");
    expect(notification.body).toBe("Week Five: Chapter 3.5 • Absent");
  });
});
