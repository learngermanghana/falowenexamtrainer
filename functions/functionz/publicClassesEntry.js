const admin = require("firebase-admin");
const { publicClassesHandler } = require("./routes/publicClasses");

function readServiceAccount() {
  const raw =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const encoded =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;

  if (raw) return JSON.parse(raw);
  if (encoded) return JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
  return null;
}

function ensureFirebaseAdmin() {
  if (admin.apps.length) return admin.app();

  const serviceAccount = readServiceAccount();
  if (serviceAccount?.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    serviceAccount?.project_id;

  if (serviceAccount?.client_email && serviceAccount?.private_key) {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
  }

  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
  });
}

module.exports = async (req, res) => {
  try {
    ensureFirebaseAdmin();
    return await publicClassesHandler(req, res);
  } catch (error) {
    console.error("public classes initialization error", error);
    res.setHeader("Cache-Control", "no-store");
    return res.status(500).json({
      error: "Could not load public classes",
      code: error?.code || "PUBLIC_CLASSES_INIT_FAILED",
      message: error?.message || "Firebase Admin could not be initialized",
    });
  }
};
