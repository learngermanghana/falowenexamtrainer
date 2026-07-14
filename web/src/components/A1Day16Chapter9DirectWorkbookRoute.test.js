import fs from "fs";
import path from "path";
import { A1_DAY16_CHAPTER9_DIRECT_WORKBOOK_PATH } from "./A1Day16Chapter9DirectWorkbookRoute";
import inAppWorkbookRoutes from "../data/inAppWorkbookRoutes.json";

const readIndexSource = () =>
  fs.readFileSync(path.resolve(__dirname, "../index.jsx"), "utf8");

describe("A1 Day 16 Chapter 9 direct workbook route", () => {
  it("keeps the configured workbook route and direct app route identical", () => {
    expect(A1_DAY16_CHAPTER9_DIRECT_WORKBOOK_PATH).toBe(
      "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook",
    );
    expect(inAppWorkbookRoutes.A1["16"]["9"]).toBe(
      A1_DAY16_CHAPTER9_DIRECT_WORKBOOK_PATH,
    );

    const indexSource = readIndexSource();
    expect(indexSource).toContain(
      "path={A1_DAY16_CHAPTER9_DIRECT_WORKBOOK_PATH}",
    );
    expect(indexSource).toContain(
      "element={<A1Day16Chapter9DirectWorkbookRoute />}",
    );
  });

  it("renders the standard tutor-marked Chapter 9 workbook", () => {
    const pageSource = fs.readFileSync(
      path.resolve(__dirname, "A1Day16FoodAndDailyLifeWorkbookPage.js"),
      "utf8",
    );

    expect(pageSource).toContain("<A1TutorMarkedWorkbookShell");
    expect(pageSource).toContain('chapter="9"');
    expect(pageSource).toContain('fallbackAssignmentKey="A1-9"');
    expect(pageSource).toContain('data-a1-day16-chapter9-workbook-content="true"');
  });
});
