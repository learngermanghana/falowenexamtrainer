import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("Course Book next-priority summary", () => {
  it("does not mount the next live class card on the Course Book page", () => {
    const services = read("RouteScopedAppServices.js");

    expect(services).not.toContain('import CourseBookNextClassIndicator from "./CourseBookNextClassIndicator"');
    expect(services).not.toContain("<CourseBookNextClassIndicator />");
  });

  it("keeps the native next-assignment card in CourseTab", () => {
    const courseTab = read("CourseTab.js");

    expect(courseTab).toContain('"Next assignment"');
    expect(courseTab).toContain('"Next self-study lesson"');
    expect(courseTab).toContain('data-a1-coursebook-next-card="true"');
  });
});
