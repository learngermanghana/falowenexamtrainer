import fs from "fs";
import path from "path";
import { A1_DAY11_DIRECT_WORKBOOK_PATH } from "./A1Day11DirectWorkbookRoute";
import inAppWorkbookRoutes from "../data/inAppWorkbookRoutes.json";

const readIndexSource = () =>
  fs.readFileSync(path.resolve(__dirname, "../index.jsx"), "utf8");

describe("A1 Day 11 direct workbook route", () => {
  it("keeps the Course Book mapping and registered app route identical", () => {
    expect(A1_DAY11_DIRECT_WORKBOOK_PATH).toBe(
      "/campus/course/a1-day-11-understanding-time-workbook",
    );
    expect(inAppWorkbookRoutes.A1["11"]["*"]).toBe(
      A1_DAY11_DIRECT_WORKBOOK_PATH,
    );

    const indexSource = readIndexSource();
    expect(indexSource).toContain(
      "path={A1_DAY11_DIRECT_WORKBOOK_PATH}",
    );
    expect(indexSource).toContain(
      "element={<A1Day11DirectWorkbookRoute />}",
    );
  });

  it("renders the existing tutor-marked Day 11 workbook component", () => {
    const routeSource = fs.readFileSync(
      path.resolve(__dirname, "A1Day11DirectWorkbookRoute.js"),
      "utf8",
    );

    expect(routeSource).toContain(
      'import A1Day11UnderstandingTimeWorkbookPage from "./A1Day11UnderstandingTimeWorkbookPage"',
    );
    expect(routeSource).toContain(
      "<A1Day11UnderstandingTimeWorkbookPage />",
    );
  });
});
