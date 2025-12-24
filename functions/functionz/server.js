const express = require("express");
const app = require("./app");

const wrapper = express();
wrapper.use("/api", app);

const port = process.env.PORT || 5000;

if (require.main === module) {
  wrapper.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Falowen functions API listening on http://localhost:${port}`);
  });
}

module.exports = wrapper;
