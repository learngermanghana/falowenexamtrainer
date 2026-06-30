const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const crypto = require("crypto");
const legacyApp = require("./app");
const { appendStudentToStudentsSheetSafely } = require("./studentsSheet");
const { calculateSharedPaystackFee } = require("./paystackFeePolicy");

const DEFAULT_TUITION_CURRENCY = "GHS";
const PAYSTACK_MAX_EVENT_AGE_MINUTES = 60 * 24 * 3;
const PAYSTACK_MIN_PAYMENT_FLOOR = 10;
const PAYSTACK_OVERPAY_TOLERANCE_RATE = 0.02;
const PAYSTACK_MIN_INSTALLMENT_GHS = 2000;

const app = express();
app.use(cors({ origin: true }));
app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buffer) => {
      req.rawBody = buffer;
    },
  })
);

const roundMoney = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const safeEqualHex = (first, second) => {
  if (!first || !second) return false;
  const a = String(first);
  const b = String(second);
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch (_error) {
    return false;
  }
};

const addMonths = (date, months) => {
  const result = new Date(date);
  if (Number.isNaN(result.getTime())) return null;
  result.setMonth(result.getMonth() + Number(months || 0));
  return result;
};

const getAuthedUser = async (req) => {
  const header = String(req.headers?.authorization || "");
  const match = header.match(/^Bearer (.+)$/i);
  if (!match) return null;
  try {
    return await admin.auth().verifyIdToken(match[1]);
  } catch (_error) {
    return null;
  }
};

const findStudentByCodeOrEmail = async ({ studentCode = "", email = "", uid = "" } = {}) => {
  const db = admin.firestore();
  const students = db.collection("students");
  const code = String(studentCode || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const ids = Array.from(new Set([code, code.toUpperCase(), code.toLowerCase(), uid].filter(Boolean)));
  for (const id of ids) {
    const snapshot = await students.doc(id).get();
    if (snapshot.exists) return { ref: snapshot.ref, snap: snapshot };
  }

  const queries = [];
  if (code) {
    for (const candidate of Array.from(new Set([code, code.toUpperCase(), code.toLowerCase()]))) {
      queries.push(students.where("studentCode", "==", candidate).limit(1));
      queries.push(students.where("studentcode", "==", candidate).limit(1));
    }
  }
  if (normalizedEmail) queries.push(students.where("email", "==", normalizedEmail).limit(1));
  if (uid) queries.push(students.where("uid", "==", uid).limit(1));

  for (const query of queries) {
    const snapshot = await query.get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { ref: doc.ref, snap: doc };
    }
  }

  return null;
};

app.post("/paystack/initialize", async (req, res) => {
  try {
    const authedUser = await getAuthedUser(req);
    if (!authedUser) return res.status(401).json({ error: "Please sign in again before paying." });

    const secret = process.env.PAYSTACK_SECRET;
    if (!secret) return res.status(500).json({ error: "PAYSTACK_SECRET is missing" });

    const body = req.body || {};
    const requestedStudentCode = String(
      body.studentCode || body.student_code || body.studentcode || ""
    ).trim();
    const redirectUrl = typeof body.redirectUrl === "string" ? body.redirectUrl : "";
    const tuitionAmount = roundMoney(Number(body.amount));

    if (!requestedStudentCode) return res.status(400).json({ error: "Missing studentCode" });
    if (!Number.isFinite(tuitionAmount) || tuitionAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const match = await findStudentByCodeOrEmail({
      studentCode: requestedStudentCode,
      email: authedUser.email,
      uid: authedUser.uid,
    });
    if (!match) return res.status(404).json({ error: "Student not found" });

    const student = match.snap.data() || {};
    const studentCode = String(
      student.studentCode || student.studentcode || match.snap.id
    ).trim();
    const studentEmail = String(student.email || "").trim().toLowerCase();
    const authedEmail = String(authedUser.email || "").trim().toLowerCase();

    if (student.uid && student.uid !== authedUser.uid && studentEmail !== authedEmail) {
      return res.status(403).json({ error: "Not authorized for this student" });
    }

    const tuitionFee = Math.max(Number(student.tuitionFee || 0), 0);
    const paidSoFar = Math.max(Number(student.initialPaymentAmount || 0), 0);
    const balanceDue = Number.isFinite(Number(student.balanceDue))
      ? Math.max(Number(student.balanceDue), 0)
      : Math.max(tuitionFee - paidSoFar, 0);

    if (balanceDue <= 0) return res.status(400).json({ error: "No balance due" });
    if (tuitionAmount > balanceDue * (1 + PAYSTACK_OVERPAY_TOLERANCE_RATE)) {
      return res.status(400).json({ error: "Amount exceeds balance" });
    }

    const isFinalPayment = Math.abs(tuitionAmount - balanceDue) < 0.5;
    if (tuitionAmount < PAYSTACK_MIN_INSTALLMENT_GHS && !isFinalPayment) {
      return res.status(400).json({
        error: `Minimum payment is GH₵${PAYSTACK_MIN_INSTALLMENT_GHS} (or pay the remaining balance).`,
      });
    }

    const payEmail = studentEmail || authedEmail;
    if (!payEmail) return res.status(400).json({ error: "Missing student email" });

    const fee = calculateSharedPaystackFee(tuitionAmount);
    const planAfterPayment =
      tuitionFee > 0 && paidSoFar + tuitionAmount >= tuitionFee ? "6-month" : "1-month";
    const metadata = {
      studentCode,
      student_code: studentCode,
      level: student.level || "",
      name: student.name || "",
      phone: student.phone || "",
      tuitionFee,
      paidSoFar,
      balanceBefore: balanceDue,
      amountRequested: tuitionAmount,
      tuitionAmount,
      checkoutAmount: fee.checkoutAmount,
      estimatedPaystackFee: fee.estimatedPaystackFee,
      studentFeeContribution: fee.studentFeeContribution,
      falowenFeeContribution: fee.falowenFeeContribution,
      paystackFeeRate: fee.feeRate,
      studentFeeShareRate: fee.studentShareRate,
      feePolicy: "shared_50_50",
      planAfterPayment,
    };

    const customFields = [
      { display_name: "Student code", variable_name: "student_code", value: studentCode },
      {
        display_name: "Tuition payment",
        variable_name: "tuition_payment",
        value: `GH₵${tuitionAmount.toFixed(2)}`,
      },
      {
        display_name: "Your 50% fee share",
        variable_name: "student_fee_share",
        value: `GH₵${fee.studentFeeContribution.toFixed(2)}`,
      },
      {
        display_name: "Total charged",
        variable_name: "checkout_total",
        value: `GH₵${fee.checkoutAmount.toFixed(2)}`,
      },
      { display_name: "Plan after payment", variable_name: "plan_after", value: planAfterPayment },
    ];

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: payEmail,
        amount: Math.round(fee.checkoutAmount * 100),
        currency: String(student.tuitionCurrency || DEFAULT_TUITION_CURRENCY).toUpperCase(),
        callback_url: redirectUrl || undefined,
        metadata: { ...metadata, custom_fields: customFields },
      }),
    });

    const paystackJson = await paystackResponse.json().catch(() => ({}));
    if (!paystackResponse.ok || !paystackJson?.status) {
      return res.status(502).json({
        error: "Failed to initialize Paystack",
        details: paystackJson?.message,
      });
    }

    const authorizationUrl = paystackJson?.data?.authorization_url || "";
    const reference = paystackJson?.data?.reference || "";

    await match.ref.set(
      {
        paymentIntentAmount: tuitionAmount,
        paymentIntentCheckoutAmount: fee.checkoutAmount,
        paymentIntentStudentFeeContribution: fee.studentFeeContribution,
        paymentIntentFeePolicy: "shared_50_50",
        paystackReference: reference,
        lastPaymentInitAt: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await admin
      .firestore()
      .collection("paystackInitRequests")
      .doc(reference || crypto.randomUUID())
      .set({
        studentCode,
        email: payEmail,
        tuitionAmount,
        checkoutAmount: fee.checkoutAmount,
        estimatedPaystackFee: fee.estimatedPaystackFee,
        studentFeeContribution: fee.studentFeeContribution,
        falowenFeeContribution: fee.falowenFeeContribution,
        feePolicy: "shared_50_50",
        balanceBefore: balanceDue,
        tuitionFee,
        reference,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return res.json({
      ok: true,
      authorization_url: authorizationUrl,
      reference,
      tuitionAmount,
      checkoutAmount: fee.checkoutAmount,
      studentFeeContribution: fee.studentFeeContribution,
      falowenFeeContribution: fee.falowenFeeContribution,
    });
  } catch (error) {
    console.error("Shared Paystack initialize error", error);
    return res.status(500).json({ error: "Could not initialize payment" });
  }
});

app.post("/paystack/webhook", async (req, res) => {
  let eventRef = null;
  try {
    const secret = process.env.PAYSTACK_SECRET;
    if (!secret) return res.status(500).json({ error: "PAYSTACK_SECRET is missing" });

    const signature = req.headers["x-paystack-signature"];
    if (!signature) return res.status(400).json({ error: "Missing Paystack signature" });

    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body || {}));
    const expectedSignature = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");
    if (!safeEqualHex(expectedSignature, signature)) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    const payload = req.body || {};
    const { event, data = {} } = payload;
    if (event !== "charge.success") return res.json({ status: "ignored", event });

    const reference = String(data.reference || "");
    if (!reference) return res.status(400).json({ error: "Missing Paystack reference" });

    const db = admin.firestore();
    const payloadHash = crypto.createHash("sha256").update(rawBody).digest("hex");
    eventRef = db.collection("paystackWebhookEvents").doc(reference);
    let duplicate = false;

    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(eventRef);
      if (existing.exists) {
        duplicate = true;
        return;
      }
      transaction.set(eventRef, {
        reference,
        event,
        signature,
        payloadHash,
        status: "received",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    if (duplicate) return res.json({ status: "duplicate", reference });

    const reject = async (reason, extra = {}) => {
      await eventRef.set(
        {
          status: "rejected",
          reason,
          handledAt: admin.firestore.FieldValue.serverTimestamp(),
          ...extra,
        },
        { merge: true }
      );
      return res.status(202).json({ status: "rejected", reason });
    };

    const studentCode =
      data?.metadata?.studentCode ||
      data?.metadata?.student_code ||
      data?.metadata?.studentcode ||
      "";
    const email = String(data?.customer?.email || "").toLowerCase();
    const match = await findStudentByCodeOrEmail({ studentCode, email });
    if (!match) return reject("student_not_found", { studentCode, email });

    const student = match.snap.data() || {};
    const tuitionFee = Math.max(Number(student.tuitionFee || 0), 0);
    const priorPaid = Math.max(Number(student.initialPaymentAmount || 0), 0);
    const priorBalanceDue = Number.isFinite(Number(student.balanceDue))
      ? Math.max(Number(student.balanceDue), 0)
      : Math.max(tuitionFee - priorPaid, 0);

    const checkoutAmountPaid = roundMoney(Number(data.amount || 0) / 100);
    const metadataTuitionAmount = Number(
      data?.metadata?.tuitionAmount ?? data?.metadata?.amountRequested
    );
    const tuitionAmountPaid =
      Number.isFinite(metadataTuitionAmount) && metadataTuitionAmount > 0
        ? roundMoney(metadataTuitionAmount)
        : checkoutAmountPaid;
    const expectedCheckoutAmount = Number(data?.metadata?.checkoutAmount || 0);
    const studentFeeContribution = roundMoney(
      Number(data?.metadata?.studentFeeContribution || 0)
    );
    const paystackFee = roundMoney(
      Number(data?.fees || 0) / 100 || Number(data?.metadata?.estimatedPaystackFee || 0)
    );

    const expectedCurrency = String(
      student.tuitionCurrency || DEFAULT_TUITION_CURRENCY
    ).toUpperCase();
    const payloadCurrency = String(data.currency || "").toUpperCase();
    if (!payloadCurrency || payloadCurrency !== expectedCurrency) {
      return reject("currency_mismatch", { payloadCurrency, expectedCurrency });
    }

    if (
      !Number.isFinite(checkoutAmountPaid) ||
      checkoutAmountPaid < PAYSTACK_MIN_PAYMENT_FLOOR ||
      !Number.isFinite(tuitionAmountPaid) ||
      tuitionAmountPaid <= 0
    ) {
      return reject("invalid_amount", { checkoutAmountPaid, tuitionAmountPaid });
    }

    if (checkoutAmountPaid + 0.01 < tuitionAmountPaid) {
      return reject("checkout_below_tuition", { checkoutAmountPaid, tuitionAmountPaid });
    }

    if (
      Number.isFinite(expectedCheckoutAmount) &&
      expectedCheckoutAmount > 0 &&
      Math.abs(checkoutAmountPaid - expectedCheckoutAmount) > 0.05
    ) {
      return reject("checkout_amount_mismatch", {
        checkoutAmountPaid,
        expectedCheckoutAmount,
      });
    }

    const isFinalPayment =
      priorBalanceDue > 0 && Math.abs(tuitionAmountPaid - priorBalanceDue) < 0.5;
    if (tuitionAmountPaid < PAYSTACK_MIN_INSTALLMENT_GHS && !isFinalPayment) {
      return reject("below_min_installment", { tuitionAmountPaid, priorBalanceDue });
    }

    const paidAtRaw =
      data.paid_at || data.paidAt || data.transaction_date || data.created_at || data.createdAt;
    const paidAtMs = paidAtRaw ? Date.parse(paidAtRaw) : Number.NaN;
    if (!Number.isFinite(paidAtMs)) return reject("missing_timestamp", { paidAtRaw });

    const ageMinutes = (Date.now() - paidAtMs) / (1000 * 60);
    if (ageMinutes > PAYSTACK_MAX_EVENT_AGE_MINUTES) {
      return reject("stale_event", { ageMinutes, paidAtRaw });
    }

    const projectedPaid = roundMoney(priorPaid + tuitionAmountPaid);
    if (tuitionFee > 0) {
      const allowedCeiling = tuitionFee * (1 + PAYSTACK_OVERPAY_TOLERANCE_RATE);
      if (projectedPaid > allowedCeiling) {
        return reject("overpay_exceeds_tolerance", {
          projectedPaid,
          tuitionFee,
          allowedCeiling,
        });
      }
    }

    const totalPaid = projectedPaid;
    const balanceDue = tuitionFee ? Math.max(roundMoney(tuitionFee - totalPaid), 0) : null;
    const paymentStatus = tuitionFee && totalPaid < tuitionFee ? "partial" : "paid";

    const now = new Date();
    const existingStart = student.contractStart ? new Date(student.contractStart) : null;
    const existingEnd = student.contractEnd ? new Date(student.contractEnd) : null;
    const carryoverUntil = student.upgradeCarryoverUntil
      ? new Date(student.upgradeCarryoverUntil)
      : null;
    const startValid = existingStart && !Number.isNaN(existingStart.getTime());
    const endValid = existingEnd && !Number.isNaN(existingEnd.getTime());
    const carryoverValid = carryoverUntil && !Number.isNaN(carryoverUntil.getTime());
    const contractActive = endValid && existingEnd > now;
    const appendAfterActive =
      String(student.contractMergeMode || "").toLowerCase() ===
        "append_after_active_contract" &&
      (contractActive || carryoverValid);
    const targetMonths = paymentStatus === "paid" ? 6 : 1;
    const currentMonths = Number(student.contractTermMonths || 0);

    let contractStartDate;
    let finalMonths;
    let contractEndDate;
    if (appendAfterActive) {
      const candidate = [carryoverValid ? carryoverUntil : null, endValid ? existingEnd : null]
        .filter(Boolean)
        .sort((a, b) => b.getTime() - a.getTime())[0];
      contractStartDate = candidate && candidate > now ? candidate : now;
      finalMonths = targetMonths;
      contractEndDate = addMonths(contractStartDate, finalMonths);
    } else {
      contractStartDate = contractActive && startValid ? existingStart : now;
      finalMonths = Math.max(currentMonths, targetMonths);
      const proposedEnd = addMonths(contractStartDate, finalMonths);
      contractEndDate = endValid && existingEnd > proposedEnd ? existingEnd : proposedEnd;
    }

    const queuedUpgradeLevel = String(student.upgradeToLevel || "").toUpperCase();
    const applyUpgrade = Boolean(queuedUpgradeLevel) && paymentStatus === "paid";
    const updates = {
      initialPaymentAmount: totalPaid,
      balanceDue,
      paymentStatus,
      contractStart: contractStartDate.toISOString(),
      contractEnd: contractEndDate ? contractEndDate.toISOString() : "",
      contractTermMonths: finalMonths,
      status: "Active",
      paystackReference: reference,
      lastPaymentTuitionAmount: tuitionAmountPaid,
      lastPaymentCheckoutAmount: checkoutAmountPaid,
      lastPaymentStudentFeeContribution: studentFeeContribution,
      lastPaymentFalowenFeeContribution: roundMoney(
        Math.max(paystackFee - studentFeeContribution, 0)
      ),
      lastPaymentPaystackFee: paystackFee,
      lastPaymentFeePolicy: data?.metadata?.feePolicy || "legacy_merchant_paid",
      level: applyUpgrade ? queuedUpgradeLevel : student.level,
      className: applyUpgrade ? "" : student.className,
      contractMergeMode: applyUpgrade ? "" : student.contractMergeMode || "",
      upgradeCarryoverUntil: applyUpgrade ? "" : student.upgradeCarryoverUntil || "",
      upgradeFromLevel: applyUpgrade ? "" : student.upgradeFromLevel || "",
      upgradeToLevel: applyUpgrade ? "" : student.upgradeToLevel || "",
      upgradeQueuedAt: applyUpgrade ? "" : student.upgradeQueuedAt || "",
      upgradeSnapshot: applyUpgrade
        ? admin.firestore.FieldValue.delete()
        : student.upgradeSnapshot || null,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    await match.ref.set(updates, { merge: true });
    await appendStudentToStudentsSheetSafely({ ...student, ...updates }).catch((error) => {
      console.warn("Payment succeeded but sheet sync failed", error?.message || error);
    });

    await eventRef.set(
      {
        status: "handled",
        studentId: match.ref.id,
        studentCode,
        email,
        checkoutAmount: checkoutAmountPaid,
        tuitionAmount: tuitionAmountPaid,
        studentFeeContribution,
        falowenFeeContribution: roundMoney(
          Math.max(paystackFee - studentFeeContribution, 0)
        ),
        paystackFee,
        feePolicy: data?.metadata?.feePolicy || "legacy_merchant_paid",
        paymentStatus,
        balanceDue,
        contractTermMonths: finalMonths,
        handledAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return res.json({
      status: "synced",
      paymentStatus,
      balanceDue,
      tuitionAmount: tuitionAmountPaid,
      checkoutAmount: checkoutAmountPaid,
      contractTermMonths: finalMonths,
    });
  } catch (error) {
    console.error("Shared Paystack webhook error", error);
    if (eventRef) {
      await eventRef
        .set(
          {
            status: "error",
            errorMessage: String(error?.message || "unknown"),
            handledAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        )
        .catch(() => undefined);
    }
    return res.status(500).json({ error: "Failed to process webhook" });
  }
});

app.use(legacyApp);

module.exports = app;
