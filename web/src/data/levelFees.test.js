import { computeTuitionStatus, paystackLinkForLevel } from "./levelFees";

describe("computeTuitionStatus", () => {
  it("marks tuition as paid when the amount covers the fee", () => {
    const summary = computeTuitionStatus({ level: "A1", paidAmount: 2800 });

    expect(summary.balanceDue).toBe(0);
    expect(summary.statusLabel).toBe("Paid");
    expect(summary.paystackLink).toBe(paystackLinkForLevel("A1"));
  });

  it("returns partial when some amount is paid but balance remains", () => {
    const summary = computeTuitionStatus({ level: "B1", paidAmount: 1000, tuitionFee: 3000 });

    expect(summary.balanceDue).toBe(2000);
    expect(summary.statusLabel).toBe("Partial");
    expect(summary.statusCopy).toContain("Partial tuition received");
  });

  it("defaults to pending with full balance when nothing is paid", () => {
    const summary = computeTuitionStatus({ level: "B2", paidAmount: 0 });

    expect(summary.balanceDue).toBe(3000);
    expect(summary.statusLabel).toBe("Pending");
    expect(summary.statusCopy).toBe("Awaiting payment");
  });
});
