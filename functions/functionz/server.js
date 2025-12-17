const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => res.json({ ok: true, service: "falowen-functions-api" }));
app.get("/health", (req, res) => res.json({ ok: true }));

module.exports = app;
