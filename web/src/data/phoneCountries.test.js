import { getCountryDialCode, getNationalPhonePlaceholder, formatNationalPhone, phoneToE164 } from "./phoneCountries";
import { getCountryOptions } from "./countries";

describe("offline international signup phone formatting", () => {
  it("covers all country options, including Ghana and non-Ghana", () => {
    for (const country of getCountryOptions("en")) {
      expect(getCountryDialCode(country.code)).toMatch(/^\d{1,4}$/);
    }
    expect(getCountryDialCode("GH")).toBe("233");
    expect(getCountryDialCode("NG")).toBe("234");
    expect(getCountryDialCode("DE")).toBe("49");
    expect(getCountryDialCode("KE")).toBe("254");
  });
  it("normalizes local mobile formats without assuming Ghana for international students", () => {
    expect(phoneToE164("024 123 4567", "GH")).toBe("+233241234567");
    expect(phoneToE164("0803 123 4567", "NG")).toBe("+2348031234567");
    expect(phoneToE164("0712 345 678", "KE")).toBe("+254712345678");
    expect(phoneToE164("0151 23456789", "DE")).toBe("+4915123456789");
    expect(phoneToE164("(202) 555-0123", "US")).toBe("+12025550123");
    expect(phoneToE164("+233 24 123 4567", "DE")).toBe("+233241234567");
    expect(phoneToE164("00233 24 123 4567", "DE")).toBe("+233241234567");
  });
  it("rejects malformed and impossible-length national inputs", () => {
    expect(phoneToE164("0123", "GH")).toBe("");
    expect(phoneToE164("abc 0241234567", "GH")).toBe("");
    expect(phoneToE164("0241234567", "")).toBe("");
    expect(phoneToE164("02412345678901234", "GH")).toBe("");
    expect(phoneToE164("08031234567", "GH")).toBe("");
  });
  it("formats national examples only on blur, preserving international entries", () => {
    expect(formatNationalPhone("0241234567", "GH")).toBe("024 123 4567");
    expect(formatNationalPhone("08031234567", "NG")).toBe("0803 123 4567");
    expect(formatNationalPhone("+4915123456789", "DE")).toBe("+4915123456789");
    expect(getNationalPhonePlaceholder("NG")).toMatch(/0803/);
  });
});
