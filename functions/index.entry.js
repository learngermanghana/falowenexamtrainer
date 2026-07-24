// Preserve the existing Firebase API export and secret configuration while
// replacing only the Express app it loads for payment-aware reconciliation.
const { onRequest } = require("firebase-functions/v2/https");
require("./functionz/app");
const paymentAwareApp = require("./functionz/paymentAwareApp");

const sendPaymentPolicyHealth = (_req, res) =>
  res.json({
    ok: true,
    policy: "shared_50_50",
    paystackFeeRate: 0.0195,
    studentFeeShareRate: 0.5,
    tuitionAccounting: "tuition_only",
    webhookMethod: "POST",
    version: "2026-06-30",
  });

paymentAwareApp.get("/paystack/fee-policy", sendPaymentPolicyHealth);
paymentAwareApp.get("/paystack/webhook", sendPaymentPolicyHealth);

require.cache[require.resolve("./functionz/app")].exports = paymentAwareApp;

const exportedFunctions = require("./index.notifications");
const lessonProgressFunctions = require("./lessonProgress");
const { submitAssignmentResubmission } = require("./resubmission");
const { submitHistoricalAssignmentResubmission } = require("./historicalResubmission");
const { publicClassesCatalog } = require("./publicClassesCatalog");

// The global Firebase defaults intentionally keep lightweight background
// functions on fractional CPU. Override only the main HTTP API so Cloud Run can
// serve concurrent chat/AI requests without raising the two-instance ceiling.
exportedFunctions.api = onRequest(
  {
    region: "europe-west1",
    cors: true,
    cpu: 1,
    concurrency: 20,
    maxInstances: 2,
    secrets: [
      "OPENAI_API_KEY",
      "GOOGLE_SERVICE_ACCOUNT_JSON_B64",
      "PAYSTACK_SECRET",
      "STUDENTS_SHEET_ID",
      "STUDENTS_SHEET_TAB",
      "RESULTS_SHEET_PUBLISHED_CSV_URL",
      "ZOOM_WEBHOOK_SECRET",
    ],
  },
  (req, res) => {
    if (process.env.RESULTS_SHEET_PUBLISHED_CSV_URL) {
      process.env.SCORES_SHEET_PUBLISHED_CSV_URL = process.env.RESULTS_SHEET_PUBLISHED_CSV_URL;
    }
    return paymentAwareApp(req, res);
  }
);

Object.entries(lessonProgressFunctions).forEach(([name, fn]) => {
  if (name.startsWith("_")) return;
  exportedFunctions[name] = fn;
});

// Keep the resubmission callables isolated from the legacy monolithic index so
// their validation, score lookup, cooldown and transaction logic can be deployed
// safely without depending on compound submission queries.
exportedFunctions.submitAssignmentResubmission = submitAssignmentResubmission;
exportedFunctions.submitHistoricalAssignmentResubmission = submitHistoricalAssignmentResubmission;
exportedFunctions.publicClassesCatalog = publicClassesCatalog;

module.exports = exportedFunctions;
