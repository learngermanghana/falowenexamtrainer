import {
  isFullName,
  isLikelyPhoneNumber,
  normalizeEmail,
  normalizePersonName,
  normalizePhone,
  normalizeWhitespace,
} from "./signupDataQuality";

describe("signupDataQuality", () => {
  it("normalizes whitespace and email", () => {
    expect(normalizeWhitespace("  12  Main   St ")).toBe("12 Main St");
    expect(normalizeEmail("  USER@Example.COM  ")).toBe("user@example.com");
  });

  it("normalizes person names and validates full names", () => {
    expect(normalizePersonName("  Ama   Ofori ")).toBe("Ama Ofori");
    expect(normalizePersonName("  --Ama   Ofori!! ")).toBe("Ama Ofori");
    expect(isFullName("Ama Ofori")).toBe(true);
    expect(isFullName("Ama")).toBe(false);
  });

  it("normalizes phone numbers and validates likely length", () => {
    expect(normalizePhone(" +233 55 123 4567 ")).toBe("+233551234567");
    expect(isLikelyPhoneNumber(" +233 55 123 4567 ")).toBe(true);
    expect(isLikelyPhoneNumber("1234")).toBe(false);
  });
});
