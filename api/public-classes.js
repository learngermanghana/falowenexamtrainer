const publicClassesEntry = require("../functions/functionz/publicClassesEntry.js");

module.exports = async function publicClassesApi(req, res) {
  return publicClassesEntry(req, res);
};
