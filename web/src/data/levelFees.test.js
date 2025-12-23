import { computeTuitionStatus, paystackLinkForLevel } from "./levelFees";

const DEFAULT_LINK = "https://paystack.com/pay/falowen";

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

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

describe("paystackLinkForLevel", () => {
  it("returns the default Paystack link when no env overrides are set", () => {
    const link = paystackLinkForLevel("B2");

    expect(link).toBe(DEFAULT_LINK);
  });

  it("uses a global override when provided", () => {
    process.env.REACT_APP_PAYSTACK_LINK = "https://paystack.com/pay/global";

    const link = paystackLinkForLevel("A1");

    expect(link).toBe("https://paystack.com/pay/global");
  });

  it("prefers level-specific overrides when available", () => {
    process.env.REACT_APP_PAYSTACK_LINK = "https://paystack.com/pay/global";
    process.env.REACT_APP_PAYSTACK_LINK_A2 = "https://paystack.com/pay/a2";

    const link = paystackLinkForLevel("a2");

    expect(link).toBe("https://paystack.com/pay/a2");
  });
});
