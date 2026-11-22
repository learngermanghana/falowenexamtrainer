"use strict";

// Public registration review: compare private student records on the server.
// Never return matched names, emails, phone numbers, codes, or record counts.
const REVIEW_MESSAGE = "We need to verify these registration details before creating a new account. If you already study with Falowen, log in or recover your password. Otherwise, contact admissions at info@falowen.app. If your family shares a number, admissions can review it.";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 30;
const attemptsByIp = new Map();

function digits(value) {
  return String(value || "").replace(/\D/g, "");
}

function canonicalPhone(value) {
  const raw = String(value || "").trim();
  if (!raw || !/^[+\d\s().-]+$/.test(raw)) return "";
  let number = digits(raw);
  if (number.startsWith("00") && number.length > 10) number = number.slice(2);
  // Ghanaian local/mobile and international representations should match.
  if (number.length === 10 && number.startsWith("0")) number = "233" + number.slice(1);
  else if (number.length === 9 && /^[235]/.test(number)) number = "233" + number;
  if (number.length < 7 || number.length > 15) return "";
  return number;
}

function canonicalEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  const match = email.match(/^([^\s@]+)@([^\s@]+\.[^\s@]+)$/);
  if (!match) return "";
  const [, originalLocal, originalDomain] = match;
  if (!["gmail.com", "googlemail.com"].includes(originalDomain)) return email;
  // Gmail dots and plus labels are not distinct inboxes. Other domains differ.
  return originalLocal.split("+")[0].replace(/\./g, "") + "@gmail.com";
}

function canonicalName(value) {
  const words = String(value || "").toLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(/\s+/).filter(Boolean);
  // The order of given and family names often varies between registrations.
  return words.length >= 2 ? words.sort().join(" ") : "";
}

function legacyPhoneVariants(value) {
  const id = canonicalPhone(value);
  if (!id) return [];
  const variants = [String(value || "").trim(), id, "+" + id];
  if (id.startsWith("233") && id.length === 12) {
    variants.push("0" + id.slice(3), id.slice(3));
  }
  return [...new Set(variants.filter(Boolean))].slice(0, 10);
}

function validatedApplication(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const name = String(raw.name || "").trim().slice(0, 180);
  const email = String(raw.email || "").trim().slice(0, 254);
  const phone = String(raw.phone || "").trim().slice(0, 50);
  const emergency = String(raw.emergencyContactPhone || "").trim().slice(0, 50);
  if (name.split(/\s+/).length < 2 || !canonicalEmail(email) || !canonicalPhone(phone)
      || !canonicalPhone(emergency) || canonicalPhone(phone) === canonicalPhone(emergency)) return null;
  return { name, email, phone, emergency };
}

function matchesExisting(application, student) {
  const existing = student || {};
  const email = canonicalEmail(application.email);
  const primary = canonicalPhone(application.phone);
  const emergency = canonicalPhone(application.emergency || application.emergencyContactPhone);
  const name = canonicalName(application.name);
  const studentEmail = canonicalEmail(existing.email || existing.authEmail || existing.emailIdentity);
  const studentPhone = canonicalPhone(existing.phone || existing.phoneNumber || existing.mobile || existing.phoneIdentity);
  const studentEmergency = canonicalPhone(
    existing.emergencyContactPhone || existing.emergencyContactPhoneNumber ||
    existing.emergencyPhone || existing.guardianPhone || existing.emergencyContactPhoneIdentity
  );
  const studentName = canonicalName(existing.name || existing.fullName || existing.nameIdentity);
  // An emergency number is routinely shared by siblings. It cannot block alone.
  return Boolean((email && studentEmail === email) ||
    (primary && studentPhone === primary) ||
    (emergency && name && studentEmergency === emergency && studentName === name));
}

async function findProbableDuplicate(db, rawApplication) {
  const application = validatedApplication(rawApplication);
  if (!application) throw new Error("invalid_signup_identity");
  const students = db.collection("students");
  const phone = canonicalPhone(application.phone);
  const emergency = canonicalPhone(application.emergency);
  const email = canonicalEmail(application.email);
  const variants = legacyPhoneVariants(application.phone);
  const emergencyVariants = legacyPhoneVariants(application.emergency);
  // Bounded indexed queries; never scan all student records on every signup.
  const queries = [
    students.where("phoneIdentity", "==", phone).limit(8),
    students.where("phone", "in", variants).limit(8),
    students.where("emailIdentity", "==", email).limit(8),
    students.where("email", "==", String(application.email).toLowerCase()).limit(8),
    students.where("emergencyContactPhoneIdentity", "==", emergency).limit(8),
    students.where("emergencyContactPhone", "in", emergencyVariants).limit(8),
  ];
  const results = await Promise.all(queries.map(query => query.get()));
  const encountered = new Set();
  for (const snapshot of results) {
    for (const record of snapshot.docs || []) {
      if (encountered.has(record.id)) continue;
      encountered.add(record.id);
      if (matchesExisting(application, record.data())) return true;
    }
  }
  return false;
}

function allowedRequest(req) {
  const ip = String(req.headers["x-real-ip"] || req.ip || "unknown").slice(0, 100);
  const now = Date.now();
  if (attemptsByIp.size > 4096) attemptsByIp.clear();
  const previous = attemptsByIp.get(ip);
  const state = !previous || now - previous.startedAt > WINDOW_MS
    ? { startedAt: now, count: 0 } : previous;
  state.count += 1;
  attemptsByIp.set(ip, state);
  return state.count <= MAX_REQUESTS;
}

function registerSignupDuplicateReviewRoutes(app, { admin }) {
  app.post("/auth/signup-duplicate-check", async (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!allowedRequest(req)) {
      return res.status(429).json({ code: "CHECK_UNAVAILABLE", message: "Too many checks. Contact admissions if you need help registering." });
    }
    if (!validatedApplication(req.body)) {
      return res.status(422).json({ code: "INVALID_DETAILS", message: "Check your name, email and two different valid contact numbers." });
    }
    try {
      const duplicate = await findProbableDuplicate(admin.firestore(), req.body);
      return duplicate
        ? res.status(409).json({ code: "REVIEW_REQUIRED", message: REVIEW_MESSAGE })
        : res.status(200).json({ code: "CLEAR" });
    } catch (error) {
      // Do not log applicant PII, database record details, or match reasons.
      console.error("signup duplicate review unavailable", error?.code || "lookup_failed");
      return res.status(503).json({ code: "CHECK_UNAVAILABLE", message: "We could not verify your registration right now. Please try again or contact admissions." });
    }
  });
}

module.exports = {
  canonicalPhone, canonicalEmail, canonicalName, legacyPhoneVariants,
  validatedApplication, matchesExisting, findProbableDuplicate,
  registerSignupDuplicateReviewRoutes,
};
