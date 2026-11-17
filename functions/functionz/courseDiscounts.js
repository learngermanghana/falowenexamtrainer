const { createHash, randomBytes } = require("node:crypto");

const CODE_PATTERN = /^[a-f0-9]{24}$/;
const LEVELS = new Set(["A1", "A2", "B1", "B2", "C1"]);
const COURSES = "courseDiscountLinks";
const MIN_TOTAL = 1000;
const offerId = code => createHash("sha256").update(code).digest("hex");
const money = value => Math.round(Number(value) * 100);
const error = (status, message) => Object.assign(new Error(message), { status });

function buildOffer(input, now) {
  const { program, level, kind } = input;
  if (!["german", "swahili"].includes(program) || !LEVELS.has(level) ||
      (program === "swahili" && level !== "A1")) throw error(400, "Choose an available course.");
  if (!["percent", "fixed"].includes(kind)) throw error(400, "Choose a percentage or fixed discount.");
  const original = money(input.tuition);
  const value = money(input.value);
  const limit = Number(input.limit);
  const expiresAt = Date.parse(input.expiresAt);
  if (!Number.isSafeInteger(original) || original < MIN_TOTAL || original > 10000000 ||
      !Number.isSafeInteger(value) || value <= 0 || (kind === "percent" && value >= 10000) ||
      !Number.isInteger(limit) || limit < 1 || limit > 1000 ||
      !Number.isFinite(expiresAt) || expiresAt <= now) throw error(400, "Check tuition, discount, use limit and expiry.");
  const discount = kind === "percent" ? Math.round(original * value / 10000) : value;
  if (discount <= 0 || original - discount < MIN_TOTAL) throw error(400, "Discounted tuition must be at least GH₵10.");
  return { program, level, kind, value: value / 100, original, discount, total: original - discount,
    limit, expiresAt, allocated: 0, redeemed: 0, revoked: false, createdAt: now };
}

function publicOffer(offer) {
  return { program: offer.program, level: offer.level, original: offer.original / 100,
    id: offer.id, discount: offer.discount / 100, total: offer.total / 100, expiresAt: offer.expiresAt, currency: "GHS" };
}

function assertAvailable(offer, now) {
  if (!offer || offer.revoked || offer.expiresAt <= now) throw error(410, "This discount link is closed or expired.");
  if (offer.allocated >= offer.limit) throw error(409, "All uses of this discount link have been allocated.");
}

function assertEligible(student, offer, billing) {
  if (student.accountType === "exam_only" || student.registrationSource === "university-invite" ||
      student.upgradeToLevel || String(student.program || "german").toLowerCase() !== offer.program ||
      String(student.level || "").toUpperCase() !== offer.level ||
      String(student.tuitionCurrency || "GHS").toUpperCase() !== "GHS") {
    throw error(409, "This discount is for the matching course and level only.");
  }
  if (billing.paidSoFar > 0 || ["paid", "partial", "exempt"].includes(String(student.paymentStatus || "").toLowerCase()) ||
      student.courseCheckoutStartedAt || student.paystackReference || Number(student.paymentIntentAmount) > 0) {
    throw error(409, "This discount must be applied before the first payment checkout.");
  }
  if (billing.tuitionFee > 0 && (money(billing.tuitionFee) !== offer.original ||
      money(billing.effectiveBalance) !== offer.original)) {
    throw error(409, "The original fee on this offer differs from your account. Ask Falowen for an updated link.");
  }
}

function discountAdmin(user) {
  return user && (user.admin === true || user.role === "admin" ||
    (user.email_verified === true && user.email?.toLowerCase() === "moxflex@gmail.com"));
}

function registerCourseDiscountRoutes(app, { admin, getAuthedUser, findStudentByCodeOrEmail, normalizeStudentBilling }) {
  const collection = () => admin.firestore().collection(COURSES);
  const route = (handler, needsAdmin = false) => async (req, res) => {
    try {
      res.set("Cache-Control", "no-store");
      const user = needsAdmin ? await getAuthedUser(req) : null;
      if (needsAdmin && !discountAdmin(user)) throw error(403, "Admin access is required.");
      await handler(req, res);
    } catch (reason) {
      const status = reason.status || 500;
      if (status >= 500) console.error("Course discount request failed", reason?.code || "unknown");
      res.status(status).json({ error: status >= 500 ? "Could not process the discount." : reason.message });
    }
  };
  const getCode = req => {
    if (!CODE_PATTERN.test(req.params.code)) throw error(404, "Discount link not found.");
    return req.params.code;
  };

  app.get("/course-discounts/admin", route(async (_req, res) => {
    const snapshot = await collection().orderBy("createdAt", "desc").limit(100).get();
    res.json({ links: snapshot.docs.map(doc => doc.data()) });
  }, true));
  app.post("/course-discounts/admin", route(async (req, res) => {
    const code = randomBytes(12).toString("hex");
    const offer = { ...buildOffer(req.body || {}, Date.now()), code, id: offerId(code) };
    await collection().doc(offer.id).create(offer);
    res.status(201).json({ link: offer });
  }, true));
  app.post("/course-discounts/admin/:code/revoke", route(async (req, res) => {
    const ref = collection().doc(offerId(getCode(req)));
    if (!(await ref.get()).exists) throw error(404, "Discount link not found.");
    await ref.update({ revoked: true });
    res.json({ ok: true });
  }, true));

  app.get("/course-discounts/:code", route(async (req, res) => {
    const code = getCode(req);
    const user = await getAuthedUser(req);
    const ref = collection().doc(offerId(code));
    if (user) {
      const claim = (await ref.collection("claims").doc(user.uid).get()).data();
      if (claim) return res.json({ offer: claim.quote, applied: true });
    }
    const offer = (await ref.get()).data();
    assertAvailable(offer, Date.now());
    return res.json({ offer: publicOffer(offer) });
  }));

  app.post("/course-discounts/:code/claim", route(async (req, res) => {
    const code = getCode(req);
    const user = await getAuthedUser(req);
    if (!user) throw error(401, "Sign in to use this discount.");
    const match = await findStudentByCodeOrEmail({
      studentCode: req.body?.studentCode, uid: user.uid, email: user.email,
    });
    if (!match) throw error(404, "Create your student profile before applying this discount.");
    const offerRef = collection().doc(offerId(code));
    const claimRef = offerRef.collection("claims").doc(user.uid);
    const result = await admin.firestore().runTransaction(async tx => {
      const [studentDoc, offerDoc, claimDoc] = await tx.getAll(match.ref, offerRef, claimRef);
      const student = studentDoc.data();
      const offer = offerDoc.data();
      const claim = claimDoc.data();
      if (!student || student.uid !== user.uid) throw error(403, "This student account does not belong to you.");
      if (student.courseDiscount?.id === offerRef.id && claim?.studentId === match.ref.id) {
        return { offer: claim.quote, balanceDue: normalizeStudentBilling(student).effectiveBalance };
      }
      if (student.courseDiscount || claim) throw error(409, "A discount is already attached to this account.");
      assertAvailable(offer, Date.now());
      assertEligible(student, offer, normalizeStudentBilling(student));
      const quote = publicOffer(offer);
      tx.update(offerRef, { allocated: offer.allocated + 1 });
      tx.create(claimRef, { studentId: match.ref.id, quote, appliedAt: Date.now() });
      tx.update(match.ref, {
        courseDiscount: { ...quote, uid: user.uid },
        tuitionFee: quote.total, balanceDue: quote.total, tuitionCurrency: quote.currency,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { offer: quote, balanceDue: quote.total };
    });
    res.json(result);
  }));
}

async function recordDiscountPayment({ db, studentRef, student, eventRef, eventUpdates, updates, normalizeStudentBilling, timestamp }) {
  await db.runTransaction(async tx => {
    const current = (await tx.get(studentRef)).data();
    if (!current || normalizeStudentBilling(current).paidSoFar !== normalizeStudentBilling(student).paidSoFar) {
      throw error(409, "The student payment balance changed during reconciliation.");
    }
    const discount = current.courseDiscount;
    if (!discount || discount.id !== student.courseDiscount.id) throw error(409, "The payment discount changed.");
    if (!discount.redeemedAt) {
      const offerRef = db.collection(COURSES).doc(discount.id);
      const claimRef = offerRef.collection("claims").doc(discount.uid);
      const [offer, claim] = await tx.getAll(offerRef, claimRef);
      if (!offer.exists || claim.data()?.studentId !== studentRef.id) throw error(409, "Discount allocation record missing.");
      tx.update(offerRef, { redeemed: offer.data().redeemed + 1 });
      tx.update(claimRef, { redeemedAt: timestamp });
      updates.courseDiscount = { ...discount, redeemedAt: timestamp };
    }
    tx.set(studentRef, updates, { merge: true });
    tx.set(eventRef, eventUpdates, { merge: true });
  });
}

module.exports = { offerId, buildOffer, publicOffer, assertAvailable, assertEligible, registerCourseDiscountRoutes, recordDiscountPayment };
