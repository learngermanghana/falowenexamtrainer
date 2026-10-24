import fs from "fs";
import path from "path";

describe("public class lead sharing format", () => {
  const formatterSource = fs.readFileSync(
    path.resolve(__dirname, "../public/classes/class-lead-share-format.js"),
    "utf8"
  );
  const landingPageSource = fs.readFileSync(
    path.resolve(__dirname, "../public/classes/index.html"),
    "utf8"
  );

  test("loads the formatter on the public classes landing page", () => {
    expect(landingPageSource).toContain("/classes/class-lead-share-format.js");
    expect(landingPageSource.indexOf("class-leads.js")).toBeLessThan(
      landingPageSource.indexOf("class-lead-share-format.js")
    );
  });

  test("uses WhatsApp-friendly line breaks and clear class labels", () => {
    expect(formatterSource).toContain('`*Class:* ${getCourseTitle(course)}`');
    expect(formatterSource).toContain('`*Cohort:* ${getCourseCohort(course)}`');
    expect(formatterSource).toContain('`*Venue:* ${getCourseLocation(course)}`');
    expect(formatterSource).toContain('lines.push("*Schedule:*")');
    expect(formatterSource).toContain('lines.join("\\n")');
    expect(formatterSource).toContain('lines.push(`• ${row}`)');
  });

  test("keeps class information available before login or form completion", () => {
    expect(formatterSource).toContain("No login is required to view these details.");
    expect(formatterSource).toContain("Copy selected class details");
    expect(formatterSource).toContain("Send selected class on WhatsApp");
    expect(formatterSource).toContain("buildWhatsAppUrl(data, course)");
  });

  test("uses the actual cohort name instead of the old placeholder wording", () => {
    expect(formatterSource).toContain("course.cohortName || course.cohort || course.city");
    expect(formatterSource).not.toContain("class name");
  });
});
