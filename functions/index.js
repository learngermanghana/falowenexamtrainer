const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

if (!admin.apps.length) {
  admin.initializeApp();
}

setGlobalOptions({ maxInstances: 10 });

const app = require("./functionz/app");
const { appendStudentToStudentsSheetSafely } = require("./functionz/studentsSheet");

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

exports.api = onRequest(
  {
    region: "europe-west1",
    cors: true,
    secrets: [
      "OPENAI_API_KEY",
      "GOOGLE_SERVICE_ACCOUNT_JSON_B64",
      "PAYSTACK_SECRET",
      "STUDENTS_SHEET_ID",
      "STUDENTS_SHEET_TAB",
    ],
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
    const snap = event.data;
    if (!snap) return;

    const student = snap.data();
    if (!student) return;

    await appendStudentToStudentsSheetSafely(student);
  }
);

exports.archiveOldThreads = onSchedule(
  {
    region: "europe-west1",
    schedule: "every 24 hours",
    timeZone: "Etc/UTC",
  },
  async () => {
    const db = admin.firestore();
    const cutoff = admin.firestore.Timestamp.fromMillis(Date.now() - THIRTY_DAYS_IN_MS);
    const snapshot = await db.collectionGroup("posts").where("createdAt", "<", cutoff).get();

    if (snapshot.empty) {
      console.log("archiveOldThreads: no threads older than cutoff");
      return null;
    }

    const batches = [];
    let batch = db.batch();
    let batchWriteCount = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const level = data.level;
      const className = data.className;

      if (!level || !className) {
        console.warn(`archiveOldThreads: missing class metadata for post ${docSnap.id}`);
        return;
      }

      const archiveRef = db
        .collection("class_board")
        .doc(level)
        .collection("classes")
        .doc(className)
        .collection("archived")
        .doc(docSnap.id);

      batch.set(archiveRef, {
        ...data,
        status: "archived",
        archivedAt: FieldValue.serverTimestamp(),
      });
      batch.delete(docSnap.ref);
      batchWriteCount += 2;

      if (batchWriteCount >= 400) {
        batches.push(batch.commit());
        batch = db.batch();
        batchWriteCount = 0;
      }
    });

    if (batchWriteCount > 0) {
      batches.push(batch.commit());
    }

    await Promise.all(batches);
    console.log(`archiveOldThreads: archived ${snapshot.size} threads`);

    return null;
  }
);
