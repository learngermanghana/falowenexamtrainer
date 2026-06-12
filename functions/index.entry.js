const exportedFunctions = require("./index.notifications");
const lessonProgressFunctions = require("./lessonProgress");

Object.entries(lessonProgressFunctions).forEach(([name, fn]) => {
  if (name.startsWith("_")) return;
  exportedFunctions[name] = fn;
});

module.exports = exportedFunctions;
