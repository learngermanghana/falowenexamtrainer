import { sendBrowserNotification } from "./interactionFeedback";

describe("interactionFeedback", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete global.Notification;
  });

  it("returns false when Notification API is unavailable", async () => {
    await expect(sendBrowserNotification({ title: "Hi" })).resolves.toBe(false);
  });

  it("creates a notification when permission is granted", async () => {
    const notificationMock = jest.fn();
    notificationMock.permission = "granted";
    global.Notification = notificationMock;

    await expect(sendBrowserNotification({ title: "Submitted", body: "Saved" })).resolves.toBe(true);
    expect(notificationMock).toHaveBeenCalledWith("Submitted", expect.objectContaining({ body: "Saved" }));
  });
});
