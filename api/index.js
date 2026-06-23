const app = require("../functions/functionz/app");
const { publicClassesHandler } = require("../functions/functionz/routes/publicClasses");

module.exports = (req, res) => {
  // If Vercel sends the original path like /api/grammar/ask,
  // strip the /api prefix so Express routes like /grammar/ask match.
  if (typeof req.url === "string") {
    if (req.url === "/api") req.url = "/";
    else if (req.url.startsWith("/api/")) req.url = req.url.replace(/^\/api/, "");
  }

  if (req.url === "/public/classes" || req.url?.startsWith("/public/classes?")) {
    return publicClassesHandler(req, res);
  }

  return app(req, res);
};
