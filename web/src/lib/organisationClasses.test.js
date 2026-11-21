import { availableOrganisationClasses, matchingOrganisationClasses, loadOrganisationClasses } from "./organisationClasses.js";

const german = { id: "de-a1", title: "German A1", level: "A1", language: "German", startDate: "2027-01-04" };
const swahili = { id: "sw-a1", title: "Kiswahili A1", level: "A1", language: "Swahili", startDate: "2027-01-05" };

describe("organisation class languages", () => {
  it("includes both published lists and retains their distinct programmes", () => {
    const result = availableOrganisationClasses({ classes: [german], swahiliClasses: [swahili] });
    expect(result).toEqual([
      { id: "de-a1", name: "German A1", level: "A1", language: "German", startDate: "2027-01-04" },
      { id: "sw-a1", name: "Kiswahili A1", level: "A1", language: "Swahili", startDate: "2027-01-05" },
    ]);
    expect(matchingOrganisationClasses(result, "German", "A1").map(item => item.id)).toEqual(["de-a1"]);
    expect(matchingOrganisationClasses(result, "Swahili", "A1").map(item => item.id)).toEqual(["sw-a1"]);
    expect(matchingOrganisationClasses(result, "Swahili", "B1")).toEqual([]);
  });

  it("excludes closed or hidden classes and remains compatible with German-only responses", () => {
    expect(availableOrganisationClasses({ classes: [german, { ...swahili, publicVisible: false }], swahiliClasses: [] })).toHaveLength(1);
    expect(availableOrganisationClasses({ classes: [german] })).toHaveLength(1);
    expect(() => availableOrganisationClasses({})).toThrow("Could not load available classes");
  });

  it("loads Kiswahili and German from the same public endpoint without extra requests", async () => {
    const prior = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ classes: [german], swahiliClasses: [swahili] }) });
    try {
      expect(await loadOrganisationClasses()).toHaveLength(2);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith("/api/public/classes", expect.objectContaining({ cache: "no-store" }));
    } finally { global.fetch = prior; }
  });
});
