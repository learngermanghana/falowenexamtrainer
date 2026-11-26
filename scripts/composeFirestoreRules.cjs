"use strict";

const ADMIN_EXTENSION = /^    \/\* BEGIN_ADMIN_RULES_EXTENSION \*\/\n[\s\S]*?^    \/\* END_ADMIN_RULES_EXTENSION \*\/\n\n/gm;
const ADMIN_MARKER = /(?:BEGIN|END)_ADMIN_RULES_EXTENSION/g;
const DENY_FALLBACK = "    match /{document=**} {\n      allow read, write: if false;\n    }";

function composeFirestoreRules(courseRules, adminRules) {
  if (courseRules.match(ADMIN_MARKER)?.length) {
    throw new Error("Course rules already include an Admin extension");
  }
  const sections = [...adminRules.matchAll(ADMIN_EXTENSION)];
  if (sections.length !== 1 || adminRules.match(ADMIN_MARKER)?.length !== 2) {
    throw new Error("Expected exactly one marked Admin rules extension");
  }
  const extension = sections[0][0];
  if (!extension.includes("match /falowenManualLeads/{leadId}")) {
    throw new Error("Admin extension is missing the personal contacts rules");
  }
  const offset = courseRules.indexOf(DENY_FALLBACK);
  if (offset < 0 || offset !== courseRules.lastIndexOf(DENY_FALLBACK)) {
    throw new Error("Expected exactly one top-level deny fallback in the course rules");
  }
  return courseRules.slice(0, offset) + extension + courseRules.slice(offset);
}

if (require.main === module) {
  const { readFileSync } = require("node:fs");
  const [coursePath, adminPath] = process.argv.slice(2);
  if (!coursePath || !adminPath) throw new Error("Expected course and Admin rules paths");
  process.stdout.write(composeFirestoreRules(readFileSync(coursePath, "utf8"), readFileSync(adminPath, "utf8")));
}

module.exports = { composeFirestoreRules };
