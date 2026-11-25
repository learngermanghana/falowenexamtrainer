"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  canonicalPhone, canonicalEmail, canonicalName, validatedApplication,
  matchesExisting, findProbableDuplicate, registerSignupDuplicateReviewRoutes,
} = require("../functionz/signupDuplicateReview");

const applicant = {
  name: "Ama Ofori",
  email: "ama.new@example.com",
  phone: "024 123 4567",
  emergencyContactPhone: "+233 55 987 6543",
};

function fakeDb(records, { onStartAfter = () => {} } = {}) {
  return {
    collection(name) {
      assert.equal(name, "students");
      return {
        where(field, operator, value) {
          let afterId = null;
          return {
            startAfter(lastDoc) {
              onStartAfter(lastDoc);
              afterId = lastDoc.id;
              return this;
            },
            limit(n) {
              assert.ok(n <= 8);
              return {
                async get() {
                  const rows = records.filter(row => operator === "in"
                    ? value.includes(row[field]) : row[field] === value);
                  const candidates = rows.map(row => ({
                    id: row.id || "student-" + records.indexOf(row),
                    data: () => row,
                  }));
                  const position = afterId === null ? 0
                    : candidates.findIndex(doc => doc.id === afterId) + 1;
                  assert.ok(position >= 0, "pagination cursor must be valid");
                  return { docs: candidates.slice(position, position + n) };
                },
              };
            },
          };
        },
      };
    },
  };
}

test("Ghana mobile variants, Gmail aliases and reordered names normalize", () => {
  assert.equal(canonicalPhone("024 123 4567"), "233241234567");
  assert.equal(canonicalPhone("+233 24 123 4567"), "233241234567");
  assert.equal(canonicalPhone("00233241234567"), "233241234567");
  assert.equal(canonicalEmail(" A.ma+trial@GoogleMail.com "), "ama@gmail.com");
  assert.equal(canonicalEmail("other+trial@school.edu"), "other+trial@school.edu");
  assert.equal(canonicalName("Ofori, Ama"), "ama ofori");
  assert.equal(canonicalPhone("1234"), "");
});

test("requires a full name and separate valid contact numbers", () => {
  assert.ok(validatedApplication(applicant));
  assert.equal(validatedApplication({ ...applicant, phone: applicant.emergencyContactPhone }), null);
  assert.equal(validatedApplication({ ...applicant, emergencyContactPhone: "+233 24 123 4567" }), null);
  assert.equal(validatedApplication({ ...applicant, emergencyContactPhone: "00233 24 123 4567" }), null);
  assert.equal(validatedApplication({ ...applicant, email: "not-an-email" }), null);
  assert.equal(validatedApplication({ ...applicant, name: "Ama" }), null);
});

test("primary phone or Gmail alias is a strong review signal", () => {
  assert.equal(matchesExisting(applicant, {
    name: "Different Person", email: "different@something.com", phone: "+233241234567",
  }), true);
  assert.equal(matchesExisting({ ...applicant, email: "a.ma+new@gmail.com" }, {
    email: "ama@gmail.com", phone: "0500000000",
  }), true);
});

test("shared emergency contact alone never blocks a different student", () => {
  const existing = {
    name: "Kofi Mensah", phone: "020 333 4444",
    emergencyContactPhone: "055 987 6543", email: "kofi@example.com",
  };
  assert.equal(matchesExisting(applicant, existing), false);
  assert.equal(matchesExisting(validatedApplication(applicant), {...existing, name: "Ama Ofori"}), false);
});

test("checks existing normalized identities and legacy primary phones without broad scan", async () => {
  assert.equal(await findProbableDuplicate(fakeDb([
    { id: "one", name: "Unknown", phone: "0241234567", email: "other@example.com" },
  ]), applicant), true);
  assert.equal(await findProbableDuplicate(fakeDb([
    { name: "Unknown", phone: "0201111111", emergencyContactPhoneIdentity: "233559876543" },
  ]), applicant), false);
  assert.equal(await findProbableDuplicate(fakeDb([
    { name: "Ama Ofori", emailIdentity: "ama@gmail.com", phoneIdentity: "233201111111" },
  ]), { ...applicant, email: "a.ma+new@gmail.com" }), true);
});

test("names and shared emergency contacts never create duplicate decisions", async () => {
  const family = Array.from({length: 257}, (_,i) => ({
    id: "family-"+i, name: "Ama Ofori", email: "different-"+i+"@example.com",
    phoneIdentity: "233201000"+String(i).padStart(3,"0"),
    emergencyContactPhoneIdentity: "233559876543",
  }));
  assert.equal(await findProbableDuplicate(fakeDb(family), applicant), false);
});

test("public review endpoint returns only a generic response without student details", async () => {
  let handler;
  const app = { post(path, fn) {
    assert.equal(path, "/auth/signup-duplicate-check");
    handler = fn;
  } };
  const records = [{ id: "secret-student-code", name: "Private Person", phone: "0241234567", email: "private@example.com" }];
  registerSignupDuplicateReviewRoutes(app, { admin: { firestore: () => fakeDb(records) } });
  const response = {
    statusCode: 200, headers: {},
    set(key, val) { this.headers[key] = val; return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
  await handler({ headers: { "x-real-ip": "203.0.113.121" }, ip: "203.0.113.121", body: applicant }, response);
  assert.equal(response.statusCode, 409);
  assert.equal(response.body.code, "REVIEW_REQUIRED");
  assert.equal(response.headers["Cache-Control"], "no-store");
  assert.doesNotMatch(JSON.stringify(response.body), /secret-student-code|private@example.com|Private Person/);
});
