import fs from "fs";
import path from "path";
import { getProgramCourseRedirect } from "../utils/campusProgram";

test.each(["A1", "A2", "B1"])("Kiswahili %s can visit Falowen Home without a programme redirect", level => {
  expect(getProgramCourseRedirect({ pathname: "/", studentProfile: { program: "swahili", level } })).toBeNull();
});
test("AppShell keeps the home dashboard reachable and preserves course entry", () => {
  const app = fs.readFileSync(path.join(__dirname, "../App.js"), "utf8");
  expect(app).not.toMatch(/studentProfile\?\.program === "swahili" && allowedSections\.course && location\.pathname === "\/"/);
  expect(app).toContain('const goHome = () => navigate("/")');
  expect(app).toMatch(/path="\/"\s+element=\{\s*<GeneralHome/);
  expect(app).toContain('studentProfile?.program === "swahili" ? "course"');
});
