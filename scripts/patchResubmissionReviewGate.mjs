import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const replaceOnce = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) {
    throw new Error(`${label} anchor changed; update patchResubmissionReviewGate.mjs`);
  }
  return source.replace(before, after);
};

const frontendPath = path.join(root, "web/src/components/AssignmentSubmissionPage.js");
let frontend = fs.readFileSync(frontendPath, "utf8");

frontend = replaceOnce(
  frontend,
  `const getSubmissionScore = (entry) =>\n  toNumericScore(entry?.score ?? entry?.finalScore ?? entry?.mark ?? entry?.grade ?? entry?.previousScore);`,
  `const getSubmissionScore = (entry) =>\n  // previousScore belongs to the earlier marked attempt. It must never be treated\n  // as the score of a newly submitted attempt that is still awaiting review.\n  toNumericScore(entry?.score ?? entry?.finalScore ?? entry?.mark ?? entry?.grade);`,
  "frontend previousScore isolation"
);

frontend = replaceOnce(
  frontend,
  `const getLatestSubmissionScore = (entries, matchesAssignment = () => true) => {\n  const scoredEntries = (entries || []).filter(\n    (entry) => matchesAssignment(entry) && typeof getSubmissionScore(entry) === "number"\n  );\n\n  scoredEntries.sort((left, right) => {\n    const leftDate = toDateValue(left?.markedAt || left?.scoredAt || left?.updatedAt || left?.createdAt);\n    const rightDate = toDateValue(right?.markedAt || right?.scoredAt || right?.updatedAt || right?.createdAt);\n    return (rightDate?.getTime() || 0) - (leftDate?.getTime() || 0);\n  });\n\n  return scoredEntries.length ? getSubmissionScore(scoredEntries[0]) : null;\n};`,
  `const getLatestSubmissionScore = (entries, matchesAssignment = () => true) => {\n  const matchingAttempts = (entries || [])\n    .filter((entry) => {\n      if (!matchesAssignment(entry)) return false;\n      return (\n        isSubmissionAttemptStatus(entry?.status) ||\n        Number(entry?.attempt || entry?.attemptNumber || 0) > 0\n      );\n    })\n    .sort((left, right) => {\n      const leftDate = toDateValue(\n        left?.resubmittedAt || left?.submittedAt || left?.createdAt || left?.updatedAt\n      );\n      const rightDate = toDateValue(\n        right?.resubmittedAt || right?.submittedAt || right?.createdAt || right?.updatedAt\n      );\n      return (rightDate?.getTime() || 0) - (leftDate?.getTime() || 0);\n    });\n\n  const latestAttempt = matchingAttempts[0] || null;\n  const latestAttemptDate = toDateValue(\n    latestAttempt?.resubmittedAt ||\n      latestAttempt?.submittedAt ||\n      latestAttempt?.createdAt ||\n      latestAttempt?.updatedAt\n  );\n  const latestAttemptMillis = latestAttemptDate?.getTime() || 0;\n\n  const scoredEntries = (entries || [])\n    .filter((entry) => matchesAssignment(entry) && typeof getSubmissionScore(entry) === "number")\n    .sort((left, right) => {\n      const leftDate = toDateValue(left?.markedAt || left?.scoredAt || left?.updatedAt || left?.createdAt);\n      const rightDate = toDateValue(right?.markedAt || right?.scoredAt || right?.updatedAt || right?.createdAt);\n      return (rightDate?.getTime() || 0) - (leftDate?.getTime() || 0);\n    });\n\n  if (!scoredEntries.length) return null;\n\n  const latestReviewedEntry = scoredEntries[0];\n  const latestReviewDate = toDateValue(\n    latestReviewedEntry?.markedAt ||\n      latestReviewedEntry?.scoredAt ||\n      latestReviewedEntry?.updatedAt ||\n      latestReviewedEntry?.createdAt\n  );\n  const latestReviewMillis = latestReviewDate?.getTime() || 0;\n\n  // A score from an older attempt cannot unlock another resubmission. The most\n  // recent attempt must itself have a review at or after its submission time.\n  if (latestAttemptMillis && (!latestReviewMillis || latestReviewMillis < latestAttemptMillis)) {\n    return null;\n  }\n\n  return getSubmissionScore(latestReviewedEntry);\n};`,
  "frontend latest-attempt review gate"
);

fs.writeFileSync(frontendPath, frontend, "utf8");

const backendPath = path.join(root, "functions/resubmission.js");
let backend = fs.readFileSync(backendPath, "utf8");

backend = replaceOnce(
  backend,
  `    const reviewedRows = [...matchingSubmissions, ...scoreRows]\n      .map((row) => ({ row, score: getReviewedScore(row), millis: resultMillis(row) }))\n      .filter((entry) => typeof entry.score === "number")\n      .sort((left, right) => right.millis - left.millis);\n\n    const bestReviewedScore = reviewedRows.length\n      ? Math.max(...reviewedRows.map((entry) => entry.score))\n      : null;\n    const matchingFailedScore = reviewedRows.some(\n      (entry) => entry.score < PASS_THRESHOLD_SCORE && Math.abs(entry.score - validated.previousScore) < 0.01\n    );`,
  `    const reviewedRows = [...matchingSubmissions, ...scoreRows]\n      .map((row) => ({ row, score: getReviewedScore(row), millis: resultMillis(row) }))\n      .filter((entry) => typeof entry.score === "number")\n      .sort((left, right) => right.millis - left.millis);\n\n    const bestReviewedScore = reviewedRows.length\n      ? Math.max(...reviewedRows.map((entry) => entry.score))\n      : null;\n\n    const latestAttemptForReview = attemptDocuments\n      .slice()\n      .sort((left, right) => submissionMillis(right) - submissionMillis(left))[0];\n    const latestAttemptMillisForReview = submissionMillis(latestAttemptForReview);\n    const latestReviewedEntry = reviewedRows[0] || null;\n    const latestReviewedMillis = Number(latestReviewedEntry?.millis || 0);\n    const latestReviewIsForLatestAttempt = Boolean(\n      latestReviewedEntry &&\n        (!latestAttemptMillisForReview || latestReviewedMillis >= latestAttemptMillisForReview)\n    );\n    const matchingFailedScore = Boolean(\n      latestReviewIsForLatestAttempt &&\n        latestReviewedEntry.score < PASS_THRESHOLD_SCORE &&\n        Math.abs(latestReviewedEntry.score - validated.previousScore) < 0.01\n    );`,
  "backend latest review binding"
);

backend = replaceOnce(
  backend,
  `    if (hasPassed) {\n      throw new HttpsError("failed-precondition", "This assignment is already passed, so resubmission is disabled.");\n    }\n    if (!matchingFailedScore) {`,
  `    if (hasPassed) {\n      throw new HttpsError("failed-precondition", "This assignment is already passed, so resubmission is disabled.");\n    }\n    if (!latestReviewIsForLatestAttempt) {\n      throw new HttpsError(\n        "failed-precondition",\n        "Your latest submission is still awaiting review. You can resubmit only after it has been marked and failed."\n      );\n    }\n    if (!matchingFailedScore) {`,
  "backend pending-review rejection"
);

fs.writeFileSync(backendPath, backend, "utf8");

if (frontend.includes("entry?.previousScore);")) {
  throw new Error("Frontend still treats previousScore as a current review score");
}
if (!backend.includes("Your latest submission is still awaiting review.")) {
  throw new Error("Backend pending-review gate was not installed");
}

await import("./patchPaymentDrivenAccountUpgrade.mjs");

console.log("Resubmission gate aligned: latest attempt must be marked failed before another resubmission.");