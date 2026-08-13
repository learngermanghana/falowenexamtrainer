import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/A2B1WorkbookGuidance.js");
let source = fs.readFileSync(targetPath, "utf8");

const unsafeBlock = `          {routeLockedSubmissionContext ? (\n            <ContextualAssignmentSubmissionPage submissionContext={routeLockedSubmissionContext} />\n          ) : (\n            <AssignmentSubmissionPage />\n          )}`;
const safeBlock = `          {resolveA2FallbackSubmissionContext(workbookDay) ? (\n            <ContextualAssignmentSubmissionPage submissionContext={resolveA2FallbackSubmissionContext(workbookDay)} />\n          ) : (\n            <AssignmentSubmissionPage />\n          )}`;

if (source.includes(unsafeBlock)) {
  source = source.replaceAll(unsafeBlock, safeBlock);
}

if (source.includes("submissionContext={routeLockedSubmissionContext}")) {
  throw new Error("Unsafe routeLockedSubmissionContext usage remains in A2 workbook guidance.");
}
if (!source.includes("submissionContext={resolveA2FallbackSubmissionContext(workbookDay)}")) {
  throw new Error("Safe A2 route-locked submission context was not installed.");
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("Removed undefined routeLockedSubmissionContext runtime dependency from A2 fallback workbook submission.");
