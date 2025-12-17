"use strict";

const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const { computeStudentMetrics } = require("./functionz/lib/metrics");

// Optional CORS (allow your Vercel domain(s))
const corsHandler = cors({ origin: true });

setGlobalOptions({ maxInstances: 10 });

exports.studentMetrics = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      // Accept GET or POST
      const studentcode = (req.query.studentcode || req.body?.studentcode || "").trim();
      const level = (req.query.level || req.body?.level || "").trim();
      const passMark = Number(req.query.passMark || req.body?.passMark || 60);

      // Optional: scheduleOrder array sent by frontend to compute missed/jumped
      const scheduleOrder = Array.isArray(req.body?.scheduleOrder) ? req.body.scheduleOrder : null;

      if (!studentcode || !level) {
        return res.status(400).json({ error: "Missing studentcode or level" });
      }

      // Fetch attempts for this student+level.
      // (No orderBy to avoid composite index issues; we sort in-memory if needed)
      const snap = await db
        .collection("scores")
        .where("studentcode", "==", studentcode)
        .where("level", "==", level)
        .get();

      const attempts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const metrics = computeStudentMetrics({
        attempts,
        passMark,
        scheduleOrder,
      });

      return res.json({
        studentcode,
        level,
        ...metrics,
      });
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: String(err?.message || err) });
    }
  });
});
