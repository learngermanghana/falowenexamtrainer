import fs from "fs";
import path from "path";

const project = path.resolve(__dirname, "..", "..", "..");
const read = (relative) => fs.readFileSync(path.join(project, relative), "utf8");

describe("Falowen displays dollars without changing cedi payment amounts", () => {
  it("serves one cached public rate, never a rate per visitor", () => {
    const source = read("functions/functionz/publicFxRates.js");
    expect(source).toContain('const DAY_MS = 24 * 60 * 60 * 1000');
    expect(source).toContain('const FX_DOC = "systemConfig/falowenPublicUsdGhs"');
    expect(source).toContain("runTransaction");
    expect(source).toContain('"/fx/usd-ghs"');
  });

  it("shows display-only USD on both public marketing and registration", () => {
    const brochure = read("web/public/classes/brochure.js");
    const signup = read("web/src/components/SignUpPageLegacy.js");
    const landing = read("web/public/exams-landing.html");
    const billing = read("web/src/components/AccountSettings.js");
    const tuition = read("web/src/components/TuitionStatusCardLegacy.js");
    expect(brochure).toContain("dualPriceMarkup(course.tuitionGhs)");
    expect(brochure).toContain('fetch("/api/fx/usd-ghs")');
    expect(brochure).toContain("All contractual fees and Paystack payments are in Ghana cedis (GHS)");
    expect(signup).toContain("approximateUsd(tuitionFeeForLevel, fxQuote)");
    expect(signup).toContain("approximateUsd(MIN_INITIAL_PAYMENT, fxQuote)");
    expect(landing).toContain("exam-usd-estimate");
    expect(landing).toContain("/api/fx/usd-ghs");
    expect(billing).toContain("usdBelow(billingSummary.tuitionFee)");
    expect(billing).toContain("usdBelow(balanceDue)");
    expect(tuition).toContain("usdUnderPrice(feeBreakdown.checkoutAmount)");
  });

  it("does not change GHS as the authoritative currency in either Paystack flow", () => {
    const tuition = read("functions/functionz/paymentAwareApp.js");
    const mock = read("functions/functionz/mockCommerce.js");
    const fees = read("web/src/data/levelFees.js");
    expect(tuition).toContain('const DEFAULT_TUITION_CURRENCY = "GHS"');
    expect(mock).toContain('priceGhs: 99');
    expect(mock).toContain('currency: "GHS"');
    expect(fees).toContain("A1: 3000");
    expect(fees).toContain("MIN_INSTALLMENT_GHS = 2000");
    expect(mock).not.toContain('currency: "USD"');
  });
});
