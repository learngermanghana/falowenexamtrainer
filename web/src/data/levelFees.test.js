import {
  computeTuitionStatus,
  defaultPaymentIntentForTuition,
  getNextLevel,
  MIN_INSTALLMENT_GHS,
  paystackLinkForLevel,
} from "./levelFees";

describe("computeTuitionStatus", () => {
  it("marks tuition as paid when the amount covers the fee", () => {
    const summary = computeTuitionStatus({ level: "A1", paidAmount: 2800 });

    expect(summary.balanceDue).toBe(0);
    expect(summary.statusLabel).toBe("Paid");
    const checkoutUrl = new URL(summary.paystackLink);

    expect(checkoutUrl.origin + checkoutUrl.pathname).toBe(paystackLinkForLevel("A1"));
    expect(checkoutUrl.searchParams.get("amount")).toBeNull();
    expect(checkoutUrl.searchParams.get("redirect_url")).toBe("https://www.falowen.app/payment-complete");
  });

  it("returns partial when some amount is paid but balance remains", () => {
    const summary = computeTuitionStatus({ level: "B1", paidAmount: 1000, tuitionFee: 3000 });

    expect(summary.balanceDue).toBe(2000);
    expect(summary.statusLabel).toBe("Partial");
    expect(summary.statusCopy).toContain("Partial tuition received");

    const checkoutUrl = new URL(summary.paystackLink);
    expect(checkoutUrl.searchParams.get("amount")).toBe("200000");
  });

  it("defaults to pending with full balance when nothing is paid", () => {
    const summary = computeTuitionStatus({ level: "B2", paidAmount: 0 });

    expect(summary.balanceDue).toBe(3000);
    expect(summary.statusLabel).toBe("Pending");
    expect(summary.statusCopy).toBe("Awaiting payment");

    const checkoutUrl = new URL(summary.paystackLink);
    expect(checkoutUrl.searchParams.get("amount")).toBe("300000");
  });
});


describe("getNextLevel", () => {
  it("returns the next level when available", () => {
    expect(getNextLevel("A1")).toBe("A2");
    expect(getNextLevel("a2")).toBe("B1");
  });

  it("returns null for the final level", () => {
    expect(getNextLevel("C1")).toBeNull();
  });

  it("defaults unknown levels to A1", () => {
    expect(getNextLevel("UNKNOWN")).toBe("A1");
  });
});


describe("defaultPaymentIntentForTuition", () => {
  it("uses the minimum installment for normal tuition totals", () => {
    expect(defaultPaymentIntentForTuition(3000)).toBe(MIN_INSTALLMENT_GHS);
  });

  it("caps to the tuition fee when fee is below the minimum", () => {
    expect(defaultPaymentIntentForTuition(1500)).toBe(1500);
  });

  it("returns zero for invalid values", () => {
    expect(defaultPaymentIntentForTuition(null)).toBe(0);
    expect(defaultPaymentIntentForTuition(-100)).toBe(0);
  });
});
