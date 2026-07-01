import { formatZonedClock, getGhanaDeviceTimeNotice } from "./ghanaClassTime";

describe("Ghana class time helpers", () => {
  test("formats the same moment in Ghana and Lagos", () => {
    const moment = new Date("2026-07-01T10:15:00.000Z");

    expect(formatZonedClock(moment, "Africa/Accra")).toBe("10:15");
    expect(formatZonedClock(moment, "Africa/Lagos")).toBe("11:15");
  });

  test("warns when a device is one hour ahead of Ghana", () => {
    const notice = getGhanaDeviceTimeNotice(
      new Date("2026-07-01T10:15:00.000Z"),
      "en-GB",
      "Africa/Lagos",
    );

    expect(notice).toEqual({
      ghanaTime: "10:15",
      deviceTime: "11:15",
      deviceTimeZone: "Africa/Lagos",
      message: "Ghana time now: 10:15. Your device shows 11:15 (Africa/Lagos). Class countdowns follow Ghana time.",
    });
  });

  test("does not warn when the device uses Ghana time", () => {
    expect(getGhanaDeviceTimeNotice(
      new Date("2026-07-01T10:15:00.000Z"),
      "en-GB",
      "Africa/Accra",
    )).toBeNull();
  });
});
