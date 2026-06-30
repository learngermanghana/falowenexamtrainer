const app = require("../functions/functionz/paymentAwareApp");
const { publicClassesHandler } = require("../functions/functionz/routes/publicClasses");

module.exports = (req, res) => {
  if (typeof req.url === "string") {
    if (req.url === "/api") req.url = "/";
    else if (req.url.startsWith("/api/")) req.url = req.url.slice(4);
  }

  if (req.url === "/public/classes" || req.url?.startsWith("/public/classes?")) {
    return publicClassesHandler(req, res);
  }

  return app(req, res);
};
