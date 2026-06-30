// Preserve the existing Firebase API export and secret configuration while
// replacing only the Express app it loads for payment-aware reconciliation.
require("./functionz/app");
const paymentAwareApp = require("./functionz/paymentAwareApp");

paymentAwareApp.get("/paystack/fee-policy", (_req, res) =>
  res.json({
    ok: true,
    policy: "shared_50_50",
    paystackFeeRate: 0.0195,
    studentFeeShareRate: 0.5,
    tuitionAccounting: "tuition_only",
    version: "2026-06-30",
  })
);

require.cache[require.resolve("./functionz/app")].exports = paymentAwareApp;

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
