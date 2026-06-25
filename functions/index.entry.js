const exportedFunctions = require("./index.notifications");
const lessonProgressFunctions = require("./lessonProgress");
const { submitAssignmentResubmission } = require("./resubmission");
const { publicClassesCatalog } = require("./publicClassesCatalog");

Object.entries(lessonProgressFunctions).forEach(([name, fn]) => {
  if (name.startsWith("_")) return;
  exportedFunctions[name] = fn;
});

// Keep the resubmission callable isolated from the legacy monolithic index so
// its validation, score lookup, cooldown and transaction logic can be deployed
// safely without depending on compound submission queries.
exportedFunctions.submitAssignmentResubmission = submitAssignmentResubmission;
exportedFunctions.publicClassesCatalog = publicClassesCatalog;

module.exports = exportedFunctions;
