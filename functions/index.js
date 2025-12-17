const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const app = require("./functionz/server");

// optional: pick a region close to you; change if you want
setGlobalOptions({ maxInstances: 10, region: "europe-west1" });

// Deploy as: https://...cloudfunctions.net/api
exports.api = onRequest({ cors: true }, (req, res) => {
  logger.info("API request", { path: req.path, method: req.method });
  return app(req, res);
});
