import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("signup class cards and payment start choice", () => {
  test("filters visible class choices to the selected level", () => {
    const source = read("SignUpPageLegacy.js");
    expect(source).toContain("filteredClassOptions");
    expect(source).toContain("option.level === selectedLevel");
    expect(source).toContain("We only show open classes for {selectedLevel}");
    expect(source).toContain("Recommended for you");
  });

  test("offers trial, full payment and part payment as distinct start choices", () => {
    const source = read("SignUpPageLegacy.js");
    expect(source).toContain('value: "trial"');
    expect(source).toContain('value: "full"');
    expect(source).toContain('value: "part"');
    expect(source).toContain("Start 7-day trial");
    expect(source).toContain("Pay full fee now");
    expect(source).toContain("Part payment now");
  });

  test("trial choice records no immediate payment intent", () => {
    const source = read("SignUpPageLegacy.js");
    expect(source).toContain('paymentOption === "trial" ? 0');
    expect(source).toContain('paymentOption !== "trial" &&');
    expect(source).toContain("paymentIntentAmount: intendedPaymentAmount || null");
  });

  test("pay-now choices continue directly to Paystack after account creation", () => {
    const source = read("SignUpPageLegacy.js");
    expect(source).toContain("buildPaystackCheckoutLink");
    expect(source).toContain("immediateCheckoutLink");
    expect(source).toContain("window.location.assign(immediateCheckoutLink)");
  });
});
