const { registerCourseTypeRoutes, processCourseTypeWebhook } = require("../courseType");

function fixture(student) {
  const records = new Map([["students/student", { uid: "student", role: "student", level: "A1", ...student }]]);
  const ref = (path) => ({
    path, id: path.split("/")[1],
    get: async () => ({ id: path.split("/")[1], exists: records.has(path), data: () => records.get(path) }),
  });
  const db = {
    collection: (name) => ({ doc: (id) => ref(name + "/" + id) }),
    runTransaction: async (fn) => {
      const writes = [];
      const result = await fn({
        get: (doc) => doc.get(),
        set: (doc, data) => writes.push(() => records.set(doc.path, data)),
        create: (doc, data) => writes.push(() => records.set(doc.path, data)),
        update: (doc, data) => writes.push(() => records.set(doc.path, { ...records.get(doc.path), ...data })),
      });
      writes.forEach(write => write());
      return result;
    },
  };
  const admin = { firestore: Object.assign(() => db, { FieldValue: { serverTimestamp: () => "server" } }) };
  let handle;
  const studentRef = ref("students/student");
  registerCourseTypeRoutes({ post: (_path, fn) => { handle = fn; } }, {
    admin,
    getAuthedUser: async (req) => req.user,
    findStudentByCodeOrEmail: async () => ({ ref: studentRef, snap: await studentRef.get() }),
    normalizeStudentBilling: (profile) => ({ paidSoFar: profile.paid || 0 }),
  });
  return {
    admin, records,
    async change(courseType, user = { uid: "student", email: "student@example.org" }) {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await handle({ user, body: { courseType, paid: 9999 }, headers: {} }, res);
      return res;
    },
  };
}

test("switching a paid course to exam preparation preserves course access and the balance", async () => {
  const { records, change } = fixture({ paid: 2000, balanceDue: 1000, paymentStatus: "partial" });
  await change("exam_preparation");
  expect(records.get("students/student")).toMatchObject({
    courseType: "exam_preparation", accountType: "course", paid: 2000, balanceDue: 1000,
  });
  expect(records.get("courseAccountAccess/student")).toMatchObject({ examOnly: false });
});

test("an unpaid enrollment can be restored with its original balance and trial dates", async () => {
  const { records, change } = fixture({ paid: 0, balanceDue: 3000, trialEndsAt: "original" });
  await change("exam_preparation");
  expect(records.get("courseAccountAccess/student")).toMatchObject({ examOnly: true });
  await change("full_course");
  expect(records.get("students/student")).toMatchObject({
    courseType: "full_course", accountType: "course", paid: 0, balanceDue: 3000, trialEndsAt: "original",
  });
});

test("another student cannot authorize a change, and an exam-only student cannot bypass checkout", async () => {
  const { records, change } = fixture({ accountType: "exam_only", courseType: "exam_preparation" });
  expect((await change("full_course", { uid: "other" })).status).toHaveBeenCalledWith(403);
  expect((await change("full_course")).status).toHaveBeenCalledWith(409);
  expect(records.get("students/student")).not.toHaveProperty("paid");
});

test("only a matching successful tuition order activates a new course once", async () => {
  const { admin, records } = fixture({ accountType: "exam_only", courseType: "exam_preparation" });
  records.set("courseTypeOrders/student", {
    studentId: "student", reference: "trusted", email: "student@example.org",
    checkoutPesewas: 302970, tuitionFee: 3000, level: "B1", classId: "class", className: "B1 Class",
    status: "pending",
  });
  records.set("mockSubscriptions/student_A1", { scope: "level", status: "active" });
  const data = {
    metadata: { uid: "student" }, reference: "trusted", amount: 302970, currency: "GHS",
    status: "success", customer: { email: "student@example.org" }, paid_at: "2026-11-24T12:00:00Z",
  };
  const webhook = (payload) => processCourseTypeWebhook({
    admin, data: payload, normalizeStudentBilling: (student) => ({ paidSoFar: student.paid || 0 }),
    addMonths: () => new Date("2027-05-24T12:00:00Z"),
  });
  expect(await webhook({ ...data, amount: 10 })).toEqual({ status: "rejected" });
  expect(records.get("students/student")).not.toHaveProperty("paid");
  expect(await webhook(data)).toEqual({ status: "synced" });
  expect(await webhook(data)).toEqual({ status: "duplicate" });
  expect(records.get("students/student")).toMatchObject({
    courseType: "full_course", level: "B1", classId: "class", paid: 3000, balanceDue: 0,
  });
  expect(records.get("courseAccountAccess/student")).toMatchObject({ examOnly: false });
  expect(records.get("mockSubscriptions/student_A1")).toEqual({ scope: "level", status: "active" });
});
