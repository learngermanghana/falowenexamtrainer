const express = require("express");
const app = require("../functions/functionz/app");

const wrapper = express();
wrapper.use("/api", app);

module.exports = wrapper;
