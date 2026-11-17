const {
  offerId, buildOffer, publicOffer, assertAvailable, assertEligible, registerCourseDiscountRoutes, recordDiscountPayment,
} = require("../courseDiscounts");

const now = 1800000000000;
const input = { program: "german", level: "A1", kind: "percent", value: 25, tuition: 3000, limit: 1, expiresAt: new Date(now + 3600000).toISOString() };
const billing = student => ({ tuitionFee: student.tuitionFee, paidSoFar: student.paid || 0, effectiveBalance: student.balanceDue });
const initialStudent = uid => ({ uid, program: "german", level: "A1", tuitionFee: 3000, balanceDue: 3000 });

test("calculates percentage and fixed discounts in pesewas", () => {
  expect(publicOffer(buildOffer(input, now))).toMatchObject({ original: 3000, discount: 750, total: 2250 });
  expect(publicOffer(buildOffer({ ...input, kind: "fixed", value: "250.37" }, now))).toMatchObject({ discount: 250.37, total: 2749.63 });
  expect(() => buildOffer({ ...input, value: 100 }, now)).toThrow();
  expect(() => buildOffer({ ...input, program: "swahili", level: "B1" }, now)).toThrow();
});

test("rejects expired, revoked, exhausted or mismatched offers and existing checkouts", () => {
  const offer = buildOffer(input, now);
  for (const bad of [{ ...offer, revoked: true }, { ...offer, allocated: 1 }, { ...offer, expiresAt: now }]) {
    expect(() => assertAvailable(bad, now)).toThrow();
  }
  const student = initialStudent("student");
  for (const change of [{ program: "swahili" }, { level: "B1" }, { courseCheckoutStartedAt: 1 },
    { registrationSource: "university-invite" }, { paymentStatus: "partial", paid: 2000 }]) {
    const changed = { ...student, ...change };
    expect(() => assertEligible(changed, offer, billing(changed))).toThrow();
  }
});

function setup() {
  const code = "a".repeat(24);
  const offerPath = "courseDiscountLinks/" + offerId(code);
  const data = new Map([
    [offerPath, { ...buildOffer({ ...input, expiresAt: new Date(Date.now() + 3600000).toISOString() }, Date.now()), id: offerId(code), code }],
    ["students/one", initialStudent("one")], ["students/two", initialStudent("two")],
  ]);
  const ref = path => ({
    id: path.split("/").at(-1),
    path,
    collection: name => ({ doc: key => ref(path + "/" + name + "/" + key) }),
    get: async () => snap(path),
  });
  const snap = path => ({ exists: data.has(path), data: () => data.get(path) });
  const write = (target, patch) => data.set(target.path, { ...data.get(target.path), ...patch });
  let previous = Promise.resolve();
  const db = {
    collection: name => ({ doc: key => ref(name + "/" + key) }),
    runTransaction: fn => {
      const promise = previous.then(() => fn({
        get: async target => snap(target.path),
        getAll: async (...refs) => refs.map(target => snap(target.path)),
        create: write, update: write, set: write,
      }));
      previous = promise.catch(() => {});
      return promise;
    },
  };
  const routes = {};
  const app = { get: (path, fn) => { routes["GET " + path] = fn; }, post: (path, fn) => { routes["POST " + path] = fn; } };
  registerCourseDiscountRoutes(app, {
    admin: { firestore: Object.assign(() => db, { FieldValue: { serverTimestamp: () => "timestamp" } }) },
    getAuthedUser: async req => req.user,
    findStudentByCodeOrEmail: async ({ studentCode }) => ({ ref: ref("students/" + studentCode) }),
    normalizeStudentBilling: billing,
  });
  const call = async (route, uid, studentCode = uid) => {
    const res = { statusCode: 200, set() {}, status(status) { this.statusCode = status; return this; }, json(value) { this.payload = value; } };
    await routes[route]({ params: { code }, body: { studentCode }, user: uid ? { uid } : null }, res);
    return res;
  };
  return { data, db, ref, offerPath, call };
}

test("reserves one use transactionally; the same student can retry and payment redeems once", async () => {
  const { data, db, ref, offerPath, call } = setup();
  const claim = "POST /course-discounts/:code/claim";
  expect((await call(claim, "two", "one")).statusCode).toBe(403);
  expect((await call("GET /course-discounts/admin", "one")).statusCode).toBe(403);
  const [first, second] = await Promise.all([call(claim, "one"), call(claim, "two")]);
  expect([first.statusCode, second.statusCode]).toEqual([200, 409]);
  expect(data.get(offerPath)).toMatchObject({ allocated: 1, redeemed: 0 });
  expect(data.get("students/one")).toMatchObject({ tuitionFee: 2250, balanceDue: 2250 });
  data.get(offerPath).revoked = true;
  expect((await call(claim, "one")).payload.balanceDue).toBe(2250);
  for (const paid of [2000, 2250]) {
    await recordDiscountPayment({ db, studentRef: ref("students/one"), student: data.get("students/one"),
      eventRef: ref("paystackWebhookEvents/" + paid), eventUpdates: { status: "handled" },
      updates: { paid, balanceDue: 2250 - paid }, normalizeStudentBilling: billing, timestamp: "paid" });
  }
  expect(data.get(offerPath)).toMatchObject({ allocated: 1, redeemed: 1 });
  expect(data.get("paystackWebhookEvents/2250").status).toBe("handled");
});
