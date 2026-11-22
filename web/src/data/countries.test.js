import { getCountryOptions, getCountryName, isValidCountryCode } from "./countries";

describe("offline signup country dictionary", () => {
  it("includes a complete, unique international country/territory list", () => {
    const countries = getCountryOptions("en");
    expect(countries.length).toBeGreaterThan(240);
    expect(new Set(countries.map(country => country.code)).size).toBe(countries.length);
    expect(countries[0]).toEqual({ code: "GH", label: "Ghana" });
    expect(countries).toEqual(expect.arrayContaining([
      { code: "DE", label: "Germany" },
      { code: "KE", label: "Kenya" },
      { code: "TZ", label: "Tanzania" },
      { code: "GB", label: "United Kingdom" },
    ]));
  });

  it("stores stable ISO codes independently of translated labels", () => {
    expect(isValidCountryCode("gh")).toBe(true);
    expect(isValidCountryCode("ZZ")).toBe(false);
    expect(getCountryName("GH", "en")).toBe("Ghana");
    expect(getCountryName("DE", "de")).toBe("Deutschland");
    expect(getCountryName("invalid", "en")).toBe("");
  });
});
