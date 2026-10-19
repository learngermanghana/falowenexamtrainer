const { getActiveLevel, CATALOG } = require("../functionz/examMarketplacePayments");

describe("exam-only Paystack packages", () => {
  const now = Date.parse("2026-10-19T12:00:00.000Z");
  test("only published full exams are purchasable", () => {
    expect(CATALOG.single.priceGhs).toBe(49);
    expect(CATALOG.single.levels).toEqual(["A1", "A2", "B1", "B2"]);
    expect(CATALOG.teil).toBeUndefined();
    expect(CATALOG.ready).toBeUndefined();
  });
  test("paid entitlement requires nonexpired balance", () => {
    expect(getActiveLevel({levels:{A1:{expiresAt:"2026-10-25T00:00:00.000Z",mockCredits:1}}}, "A1", now).active).toBe(true);
    expect(getActiveLevel({levels:{A1:{expiresAt:"2026-10-25T00:00:00.000Z",mockCredits:0}}}, "A1", now).active).toBe(false);
    expect(getActiveLevel({levels:{A1:{expiresAt:"2026-10-18T00:00:00.000Z",mockCredits:1}}}, "A1", now).expired).toBe(true);
    expect(getActiveLevel({}, "B2", now).active).toBe(false);
  });
});
