const crypto = require("crypto");

const baseFields = {
  service: process.env.SERVICE_NAME || "falowen-exam-coach",
  environment: process.env.NODE_ENV || "development",
};

function log(level, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...baseFields,
    ...meta,
  };

  const payload = JSON.stringify(entry);
  // eslint-disable-next-line no-console
  if (level === "error") console.error(payload);
  else if (level === "warn") console.warn(payload);
  else console.log(payload);
}

function createLogger(context = {}) {
  const withContext = (level, message, meta) => log(level, message, { ...context, ...meta });

  return {
    info: (message, meta) => withContext("info", message, meta),
    warn: (message, meta) => withContext("warn", message, meta),
    error: (message, meta) => withContext("error", message, meta),
  };
}

function logRequest(req, res, next) {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  req.log = createLogger({ requestId, path: req.path, method: req.method });

  const startedAt = Date.now();
  req.log.info("request.start", { query: req.query });

  res.on("finish", () => {
    req.log.info("request.finish", {
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
}

module.exports = {
  createLogger,
  logRequest,
};
