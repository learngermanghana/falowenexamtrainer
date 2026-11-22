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
  it("preserves national numbers that begin with the country calling code", () => {
    // Indian national numbers beginning 91 must not lose their first two digits.
    expect(phoneToE164("9123456789", "IN")).toBe("+919123456789");
    expect(phoneToE164("919123456789", "IN")).toBe("+919123456789");
    expect(phoneToE164("+919123456789", "IN")).toBe("+919123456789");
    // Ghanaian and Nigerian bare international forms still work.
    expect(phoneToE164("233241234567", "GH")).toBe("+233241234567");
    expect(phoneToE164("2348031234567", "NG")).toBe("+2348031234567");
  });

  it("handles NANP territories as +1 country code plus area code, without duplication", () => {
    const antigua = "+12685550123";
    expect(phoneToE164("5550123", "AG")).toBe(antigua);        // Seven-digit local
    expect(phoneToE164("2685550123", "AG")).toBe(antigua);     // Area + local
    expect(phoneToE164("12685550123", "AG")).toBe(antigua);    // Country + area + local
    expect(phoneToE164("+12685550123", "AG")).toBe(antigua);   // Explicit E.164
    expect(phoneToE164("0012685550123", "AG")).toBe(antigua); // International prefix
    expect(phoneToE164("2685550123", "US")).toBe(antigua);     // NANP national

    // Other island territories share +1, but must keep their own area codes.
    expect(phoneToE164("2425550123", "BS")).toBe("+12425550123");
    expect(phoneToE164("12425550123", "BS")).toBe("+12425550123");
    expect(phoneToE164("5550123", "AI")).toBe("+12645550123");
    expect(phoneToE164("7875550123", "PR")).toBe("+17875550123");
    expect(phoneToE164("9395550123", "PR")).toBe("+19395550123");
    expect(phoneToE164("8765550123", "JM")).toBe("+18765550123");
    expect(phoneToE164("5550123", "JM")).toBe("+18765550123");
    expect(phoneToE164("5550123", "KY")).toBe("+13455550123");
    expect(phoneToE164("268555", "AG")).toBe("");
    expect(phoneToE164("126855501234", "AG")).toBe("");
  });

  it("never duplicates NANP territory area codes for any configured territory", () => {
    for (const { code } of getCountryOptions("en")) {
      const dial = getCountryDialCode(code);
      if (!dial.startsWith("1") || dial.length !== 4) continue;
      const area = dial.slice(1);
      const expected = `+1${area}5550123`;
      expect(phoneToE164("5550123", code)).toBe(expected);
      expect(phoneToE164(`${area}5550123`, code)).toBe(expected);
      expect(phoneToE164(`1${area}5550123`, code)).toBe(expected);
    }
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
