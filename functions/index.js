const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

setGlobalOptions({ maxInstances: 10 });

const app = require("./functionz/app");
const { appendStudentToStudentsSheetSafely } = require("./functionz/studentsSheet.js");

exports.api = onRequest(
  {
    region: "europe-west1",
    cors: true,
    secrets: ["OPENAI_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON_B64"],
  },
  app
);

// When a student doc is created in Firestore, append to Students sheet (safe header-mapped append)
exports.onStudentCreated = onDocumentCreated(
  {
    region: "europe-west1",
    document: "students/{studentCode}",
    secrets: [
      "GOOGLE_SERVICE_ACCOUNT_JSON_B64",
      "STUDENTS_SHEET_ID",
      "STUDENTS_SHEET_TAB",
    ],
  },
  async (event) => {
    console.log("✅ onStudentCreated fired", event.params);

    const snap = event.data;
    if (!snap) return;

    const student = snap.data();
    if (!student) return;

    await appendStudentToStudentsSheetSafely(student);
  }
);
