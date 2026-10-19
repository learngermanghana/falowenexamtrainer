"use strict";
const { calculateSharedPaystackFee } = require("./paystackFeePolicy");

// Until catalogue publishing is connected to Admin, ONLY sell verified ready full mocks.
// Do not silently expand to preview, unfinished or planned exams.
const READY_MOCKS = Object.freeze({
  A1: ["a1-final-01", "a1-final-02", "a1-final-03"],
  A2: ["a2-final-01"],
  B1: ["b1-final-01"],
  B2: ["b2-final-01"],
  C1: [],
  C2: [],
});
const PACKAGES = Object.freeze({
  single: { id: "single", priceGhs: 49, fullMocks: 1, days: 14 },
  ready: { id: "ready", priceGhs: 119, fullMocks: 3, days: 30 },
});
const LEVELS = Object.keys(READY_MOCKS);
const euros = (n) => Math.round(Number(n) * 100);
const isReady = (level, pkg) => LEVELS.includes(level) && Boolean(pkg) && READY_MOCKS[level].length >= pkg.fullMocks;
const safeRedirect = (value) => {
  // Redirect is deliberately fixed; the client may not send an arbitrary callback.
  return "https://exams.falowen.app/mock/complete";
};
function registerMockCommerceRoutes(app, { admin, getAuthedUser }) {
  const db = () => admin.firestore();
  const verified = async (req, res) => {
    const user = await getAuthedUser(req);
    if (!user) { res.status(401).json({ error: "Sign in to Falowen first." }); return null; }
    return user;
  };

  app.get("/mock/catalog", (_req, res) => res.json({
    levels: LEVELS.map((level) => ({ level, readyMockCount: READY_MOCKS[level].length,
      packages: Object.values(PACKAGES).filter((p) => isReady(level, p)).map((p) => ({
        id: p.id, priceGhs: p.priceGhs, fullMocks: p.fullMocks, days: p.days
      }))
    }))
  }));

  // Firebase authentication is created by the browser. All account privileges
  // and course trial fields are written by Admin SDK, never accepted from client.
  app.post("/mock/register", async (req, res) => {
    try {
      const user = await verified(req, res);
      if (!user) return;
      const uid = user.uid;
      const name = String(req.body?.name || "").trim();
      const level = String(req.body?.level || "").trim().toUpperCase();
      if (name.length < 3 || name.length > 150 || !LEVELS.includes(level)) {
        return res.status(400).json({ error: "Provide a full name and valid A1–C2 exam level." });
      }
      if (!user.email) return res.status(400).json({ error: "Email required." });
      const studentRef = db().collection("students").doc(uid);
      const existing = await studentRef.get();
      if (existing.exists) return res.status(409).json({ error: "This Falowen account already exists. Please sign in instead." });
      const byUid = await db().collection("students").where("uid", "==", uid).limit(1).get();
      if (!byUid.empty) return res.status(409).json({ error: "Existing account found. Sign in instead." });
      const authRecord = await admin.auth().getUser(uid);
      const existingClaims = authRecord.customClaims || {};
      if (existingClaims.admin || existingClaims.staff || ["admin", "tutor"].includes(existingClaims.role)) {
        return res.status(403).json({ error: "Staff accounts must use the standard Falowen login." });
      }
      await admin.auth().setCustomUserClaims(uid, { ...existingClaims, examOnly: true });
      await studentRef.create({
        uid, name, fullName: name, email: user.email.toLowerCase(), authEmail: user.email.toLowerCase(),
        studentCode: uid, role: "student", accountType: "exam_only",
        level, program: "german", className: "", status: "registered",
        paymentStatus: "pending", trialStatus: "not_applicable",
        onboardingCompleted: true, createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
      return res.status(201).json({ ok: true, accountType: "exam_only" });
    } catch (error) {
      console.error("Mock register failed", error);
      return res.status(500).json({ error: "Could not finish exam-only registration." });
    }
  });

  app.post("/mock/checkout", async (req, res) => {
    try {
      const user = await verified(req, res);
      if (!user) return;
      const level = String(req.body?.level || "").trim().toUpperCase();
      const pkg = PACKAGES[String(req.body?.packageId || "").trim()];
      if (!isReady(level, pkg)) return res.status(409).json({ error: "This package is not yet available at the selected level." });
      const studentByUid = await db().collection("students").where("uid", "==", user.uid).limit(1).get();
      const direct = await db().collection("students").doc(user.uid).get();
      const studentByEmail = !direct.exists && studentByUid.empty
        ? await db().collection("students").where("email", "==", String(user.email || "").toLowerCase()).limit(1).get()
        : null;
      const student = direct.exists ? direct : (studentByUid.docs[0] || studentByEmail?.docs[0]);
      const profile = student?.data() || {};
      if (!student || !student.exists || !(
        profile.uid === user.uid || (!profile.uid && String(profile.email || "").toLowerCase() === String(user.email || "").toLowerCase())
      )) {
        return res.status(403).json({ error: "Finish Falowen registration before purchasing." });
      }
      const secret = process.env.PAYSTACK_SECRET;
      if (!secret) return res.status(503).json({ error: "Payments are temporarily unavailable." });
      const amount = pkg.priceGhs; // fixed server-side; never use request.body.amount
      const fee = calculateSharedPaystackFee(amount);
      const selectedMocks = READY_MOCKS[level].slice(0, pkg.fullMocks);
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email, currency: "GHS",
          amount: euros(fee.checkoutAmount),
          callback_url: safeRedirect(),
          metadata: {
            productType: "mock_package", packageId: pkg.id, level, uid: user.uid,
            baseAmountGhs: amount, checkoutAmountGhs: fee.checkoutAmount,
            studentFeeContributionGhs: fee.studentFeeContribution
          }
        })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.status || !body.data?.reference || !body.data?.authorization_url) {
        return res.status(502).json({ error: "Payment gateway could not start checkout." });
      }
      const reference = body.data.reference;
      await db().collection("mockOrders").doc(reference).create({
        uid: user.uid, email: user.email.toLowerCase(), studentId: student.id, level,
        packageId: pkg.id, amountGhs: amount, checkoutPesewas: euros(fee.checkoutAmount),
        mockIds: selectedMocks, days: pkg.days, status: "pending", reference,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return res.json({ ok: true, authorization_url: body.data.authorization_url, reference });
    } catch (error) {
      console.error("Mock checkout error", error);
      return res.status(500).json({ error: "Could not initialize mock checkout." });
    }
  });

  app.get("/mock/access", async (req, res) => {
    try {
      const user = await verified(req, res);
      if (!user) return;
      const snap = await db().collection("mockPurchases").where("uid", "==", user.uid).get();
      const now = Date.now();
      const active = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((purchase) => purchase.status === "active" && purchase.expiresAtMs > now);
      return res.json({ ok: true, active: active.map(({ id, level, packageId, mockIds, expiresAtMs }) =>
        ({ id, level, packageId, mockIds, expiresAtMs })) });
    } catch (error) {
      console.error("Mock access lookup error", error);
      return res.status(500).json({ error: "Could not confirm mock access." });
    }
  });
}

// Call ONLY after shared Paystack webhook signature and event validation.
async function processMockWebhook({ admin, data }) {
  const reference = String(data?.reference || "");
  if (!reference) return { status: 400, body: { error: "Missing reference" } };
  const orderRef = admin.firestore().collection("mockOrders").doc(reference);
  const purchaseRef = admin.firestore().collection("mockPurchases").doc(reference);
  const result = await admin.firestore().runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);
    const purchaseSnap = await tx.get(purchaseRef);
    if (!orderSnap.exists) return { status: 202, body: { status: "rejected", reason: "order_not_found" } };
    const order = orderSnap.data();
    if (purchaseSnap.exists) return { status: 200, body: { status: "duplicate", reference } };
    const packageConfig = PACKAGES[order.packageId];
    const metadata = data.metadata || {};
    const isCorrect =
      metadata.productType === "mock_package" &&
      metadata.uid === order.uid &&
      metadata.level === order.level &&
      metadata.packageId === order.packageId &&
      packageConfig?.priceGhs === order.amountGhs &&
      Number(data.amount) === order.checkoutPesewas &&
      String(data.currency || "").toUpperCase() === "GHS" &&
      String(data.status || "").toLowerCase() === "success" &&
      String(data.customer?.email || "").toLowerCase() === order.email &&
      Array.isArray(order.mockIds) && order.mockIds.length === packageConfig.fullMocks;
    if (!isCorrect) {
      tx.update(orderRef, { status: "rejected", updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      return { status: 202, body: { status: "rejected", reason: "purchase_mismatch" } };
    }
    const now = Date.now();
    const expiresAtMs = now + packageConfig.days * 86400000;
    tx.create(purchaseRef, {
      uid: order.uid, studentId: order.studentId, level: order.level,
      packageId: order.packageId, mockIds: order.mockIds,
      status: "active", reference, priceGhs: order.amountGhs,
      startedMockIds: [], purchasedAtMs: now, expiresAtMs,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    tx.update(orderRef, { status: "paid", paidAtMs: now });
    return { status: 200, body: { status: "synced", reference } };
  });
  return result;
}
module.exports = { registerMockCommerceRoutes, processMockWebhook, READY_MOCKS, PACKAGES, isReady };
