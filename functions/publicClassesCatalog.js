const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { publicClassesHandler } = require("./functionz/routes/publicClasses");

if (!admin.apps.length) admin.initializeApp();

const publicClassesCatalog = onRequest(
  {
    region: "europe-west1",
    cors: true,
    maxInstances: 2,
    timeoutSeconds: 60,
  },
  async (req, res) => publicClassesHandler(req, res),
);

module.exports = { publicClassesCatalog };
