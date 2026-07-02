const admin = require("firebase-admin");

const parseMoney = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : Number.NaN;
  if (value === null || value === undefined || value === "") return Number.NaN;
  const normalized = String(value)
    .replace(/,/g, "")
    .replace(/[^0-9.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const roundMoney = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const parseBody = (body) => {
  if (!body) return {};
  if (typeof body === "object" && !Buffer.isBuffer(body)) return body;
  try {
    return JSON.parse(Buffer.isBuffer(body) ? body.toString("utf8") : String(body));
  } catch (_error) {
    return {};
  }
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

const findStudent = async ({ studentCode = "", email = "", uid = "" }) => {
  const students = admin.firestore().collection("students");
  const code = String(studentCode || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const ids = Array.from(
    new Set([code, code.toUpperCase(), code.toLowerCase(), uid].filter(Boolean)),
  );

  for (const id of ids) {
    const snapshot = await students.doc(id).get();
    if (snapshot.exists) return snapshot;
  }

  const queries = [];
  if (code) {
    for (const candidate of Array.from(
      new Set([code, code.toUpperCase(), code.toLowerCase()]),
    )) {
      queries.push(students.where("studentCode", "==", candidate).limit(1));
      queries.push(students.where("studentcode", "==", candidate).limit(1));
    }
  }
  if (normalizedEmail) {
    queries.push(students.where("email", "==", normalizedEmail).limit(1));
  }
  if (uid) queries.push(students.where("uid", "==", uid).limit(1));

  for (const query of queries) {
    const result = await query.get();
    if (!result.empty) return result.docs[0];
  }

  return null;
};

const sameMoney = (left, right) =>
  Number.isFinite(parseMoney(left)) &&
  Math.abs(roundMoney(parseMoney(left)) - roundMoney(right)) < 0.01;

/**
 * Keeps older and newer student billing fields aligned before the Paystack
 * initializer applies its minimum-installment rule.
 */
const syncPaystackStudentBilling = async (req) => {
  const path = String(req.url || "").split("?")[0];
  if (path !== "/paystack/initialize") return;

  const authedUser = await getAuthedUser(req);
  if (!authedUser) return;

  const body = parseBody(req.body);
  const requestedStudentCode = String(
    body.studentCode || body.student_code || body.studentcode || "",
  ).trim();

  const snapshot = await findStudent({
    studentCode: requestedStudentCode,
    email: authedUser.email,
    uid: authedUser.uid,
  });
  if (!snapshot) return;

  const student = snapshot.data() || {};
  const tuitionFeeParsed = parseMoney(student.tuitionFee);
  const tuitionFee = Number.isFinite(tuitionFeeParsed)
    ? Math.max(tuitionFeeParsed, 0)
    : 0;

  // Match AccountSettings.js: paid is canonical when present.
  const paidParsed = parseMoney(
    student.paid ?? student.initialPaymentAmount ?? student.paidAmount,
  );
  const paidSoFar = Number.isFinite(paidParsed) ? Math.max(paidParsed, 0) : 0;

  const explicitBalanceParsed = parseMoney(student.balanceDue ?? student.balance);
  const explicitBalance = Number.isFinite(explicitBalanceParsed)
    ? Math.max(explicitBalanceParsed, 0)
    : null;
  const derivedBalance = Math.max(roundMoney(tuitionFee - paidSoFar), 0);
  const balanceDue = explicitBalance === null
    ? derivedBalance
    : Math.min(explicitBalance, derivedBalance);

  const updates = {};
  if (!sameMoney(student.initialPaymentAmount, paidSoFar)) {
    updates.initialPaymentAmount = paidSoFar;
  }
  if (student.paid === null || student.paid === undefined || student.paid === "") {
    updates.paid = paidSoFar;
  }
  if (!sameMoney(student.balanceDue, balanceDue)) {
    updates.balanceDue = balanceDue;
  }

  if (Object.keys(updates).length) {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await snapshot.ref.set(updates, { merge: true });
  }
};

module.exports = { syncPaystackStudentBilling };
