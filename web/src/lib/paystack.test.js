import { buildPaystackCheckoutLink } from "./paystack";

describe("buildPaystackCheckoutLink", () => {
  it("builds a checkout link when the base host is allowed", () => {
    const result = buildPaystackCheckoutLink({
      baseLink: "https://paystack.shop/pay/checkout-code",
      amount: 50,
      redirectUrl: "http://localhost/payment-complete",
    });

    const url = new URL(result);
    expect(url.hostname).toBe("paystack.shop");
    expect(url.searchParams.get("amount")).toBe("5000");
    expect(url.searchParams.get("redirect_url")).toBe("http://localhost/payment-complete");
  });

  it("returns an empty string when the base link is not whitelisted", () => {
    expect(buildPaystackCheckoutLink({ baseLink: "https://example.com/pay/checkout-code" })).toBe("");
    expect(buildPaystackCheckoutLink({ baseLink: "not a url" })).toBe("");
  });

  it("omits the redirect when it is not on the allowlist", () => {
    const result = buildPaystackCheckoutLink({
      baseLink: "https://paystack.com/pay/checkout-code",
      redirectUrl: "https://malicious.example.com/phish",
      allowedRedirectOrigins: ["https://app.falowen.com"],
    });

    expect(result).toContain("https://paystack.com/pay/checkout-code");
    expect(new URL(result).searchParams.get("redirect_url")).toBeNull();
  });

  it("uses a provided allowlist for alternate Paystack hosts", () => {
    const result = buildPaystackCheckoutLink({
      baseLink: "https://payments.example.com/pay/checkout-code",
      amount: 10,
      redirectUrl: "http://localhost/payment-complete",
      allowedBaseHosts: ["payments.example.com"],
      allowedRedirectOrigins: ["http://localhost"],
    });

    const url = new URL(result);
    expect(url.hostname).toBe("payments.example.com");
    expect(url.searchParams.get("redirect_url")).toBe("http://localhost/payment-complete");
  });
});
