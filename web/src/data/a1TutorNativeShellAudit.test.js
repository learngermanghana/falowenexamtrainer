import fs from "fs";
import path from "path";
import { A1_ASSIGNMENT_ORDER, A1_ASSIGNMENT_REGISTRY } from "./a1AssignmentRegistry";

describe("A1 tutor-marked native shell audit", () => {
  test.each(A1_ASSIGNMENT_ORDER)("%s is owned by the shared native navigation", (assignmentKey) => {
    const assignment = A1_ASSIGNMENT_REGISTRY[assignmentKey];
    expect(assignment.layoutMode).toBe("native");

    const componentPath = path.join(__dirname, "../components", `${assignment.component}.js`);
    const source = fs.readFileSync(componentPath, "utf8");
    if (source.includes("A1TutorMarkedWorkbookShell")) {
      expect(source).toContain("A1TutorMarkedWorkbookShell");
      return;
    }

    const reExport = source.match(/export\s+\{\s*default\s*\}\s+from\s+"([^"]+)"/);
    expect(reExport).toBeTruthy();
    const targetPath = path.join(path.dirname(componentPath), `${reExport[1].replace(/^\.\//, "")}.js`);
    const target = fs.readFileSync(targetPath, "utf8");
    expect(target).toContain("A1TutorMarkedWorkbookShell");
  });
});
