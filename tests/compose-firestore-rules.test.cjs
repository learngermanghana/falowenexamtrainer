const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { composeFirestoreRules } = require("../scripts/composeFirestoreRules.cjs");

const courseRules = fs.readFileSync(path.join(__dirname, "../firestore.rules"), "utf8");
const extension = [
  "    /* BEGIN_ADMIN_RULES_EXTENSION */",
  "    match /falowenManualLeads/{leadId} { allow read: if false; }",
  "    /* END_ADMIN_RULES_EXTENSION */",
  "",
  "",
].join("\n");

test("publishes the exact course baseline plus the Admin extension before the deny fallback", () => {
  const composed = composeFirestoreRules(courseRules, "older Admin baseline\n" + extension);
  assert.equal(composed.replace(extension, ""), courseRules);
  assert.ok(composed.indexOf(extension) < composed.lastIndexOf("match /{document=**}"));
});

test("refuses to deploy without a unique, complete Admin contacts extension", () => {
  assert.throws(() => composeFirestoreRules(courseRules, ""), /exactly one marked/);
  assert.throws(() => composeFirestoreRules(courseRules, extension + extension), /exactly one marked/);
  assert.throws(() => composeFirestoreRules(courseRules, extension.replace("falowenManualLeads", "other")), /personal contacts/);
  assert.throws(() => composeFirestoreRules(courseRules + extension, extension), /already include/);
});
