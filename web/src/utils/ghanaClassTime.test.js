import { formatZonedClock, getGhanaDeviceTimeNotice } from "./ghanaClassTime";

describe("Ghana class time helpers", () => {
  test("formats the same moment in Ghana and Lagos with an English 12-hour clock", () => {
    const moment = new Date("2026-07-01T10:15:00.000Z");

    expect(formatZonedClock(moment, "Africa/Accra")).toBe("10:15 AM");
    expect(formatZonedClock(moment, "Africa/Lagos")).toBe("11:15 AM");
  });

  test("warns when the browser time-zone setting differs from Ghana", () => {
    const notice = getGhanaDeviceTimeNotice(
      new Date("2026-07-01T10:15:00.000Z"),
      "en-GB",
      "Africa/Lagos",
    );

    expect(notice).toEqual({
      ghanaTime: "10:15 AM",
      deviceTime: "11:15 AM",
      deviceTimeZone: "Africa/Lagos",
      message: "Ghana time now: 10:15 AM. Your browser time-zone setting differs from Ghana. Class countdowns use Ghana time.",
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
