import { FRENCH_A1_SCHEDULE as ARCHIVED_SCHEDULE } from "./archive/french/courseSchedule";
import { frenchClassCatalog as archivedCatalog } from "./archive/french/classCatalog";
import { FRENCH_A1_SCHEDULE as LEGACY_SCHEDULE } from "./frenchCourseSchedule";
import { frenchClassCatalog as legacyCatalog } from "./french/classCatalog";

describe("Archive compatibility", () => {
  it("keeps historical French data archived without breaking existing module imports", () => {
    expect(LEGACY_SCHEDULE).toBe(ARCHIVED_SCHEDULE);
    expect(legacyCatalog).toBe(archivedCatalog);
  });
});
