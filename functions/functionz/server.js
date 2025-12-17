const app = require("./app");

const port = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Falowen functions API listening on http://localhost:${port}`);
  });
}

module.exports = app;
