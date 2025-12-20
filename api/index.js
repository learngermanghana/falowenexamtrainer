const app = require("../functions/functionz/app");

module.exports = (req, res) => {
  // If Vercel sends the original path like /api/grammar/ask,
  // strip the /api prefix so Express routes like /grammar/ask match.
  if (typeof req.url === "string") {
    if (req.url === "/api") req.url = "/";
    else if (req.url.startsWith("/api/")) req.url = req.url.replace(/^\/api/, "");
  }

  return app(req, res);
};
