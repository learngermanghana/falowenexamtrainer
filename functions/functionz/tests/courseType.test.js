const { registerCourseTypeRoutes, processCourseTypeWebhook, adminCourseTypeTransition, preserveCourseExamTrial, examTrialCoursePatch } = require("../courseType");

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
        set: (doc, data, opts) => writes.push(() => records.set(doc.path, opts?.merge ? {...records.get(doc.path), ...data} : data)),
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
  registerCourseTypeRoutes({ post: (path, fn) => { if (path === "/account/course-type") handle = fn; } }, {
    admin,
    getAuthedUser: async (req) => req.user,
    findStudentByCodeOrEmail: async () => ({ ref: studentRef, snap: await studentRef.get() }),
    normalizeStudentBilling: (profile) => ({ paidSoFar: profile.paid || 0 }),
  });
  return {
    admin, records,
    async change(courseType, user = { uid: "student", email: "student@example.org" }, fields = {}) {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await handle({ user, body: { courseType, paid: 9999, ...fields }, headers: {} }, res);
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

test("admin transition preserves payment history and only restores an existing enrollment", () => {
  const billing = student => ({ paidSoFar: student.paid || 0 });
  expect(adminCourseTypeTransition({ paid: 0, balanceDue: 3000, trialEndsAt: "original" }, null, "exam_preparation", billing)).toEqual({
    updates: { courseType: "exam_preparation", accountType: "exam_only", courseEnrollmentPreserved: true },
    policy: { examOnly: true, canRestoreCourse: true },
  });
  expect(adminCourseTypeTransition({ paid: 1000 }, null, "exam_preparation", billing).updates.accountType).toBe("course");
  expect(adminCourseTypeTransition({ accountType: "exam_only" }, { examOnly: true, canRestoreCourse: false }, "full_course", billing).status).toBe(409);
  expect(adminCourseTypeTransition({ accountType: "exam_only" }, { examOnly: true, canRestoreCourse: true }, "full_course", billing).updates.accountType).toBe("course");
});

test("switch preserves the exact original course trial expiry and never restarts an existing exam trial", async () => {
  const end = Date.now() + 3600000;
  const { records, change } = fixture({ paid: 0, balanceDue: 3000, level: "A2", trialEndsAt: new Date(end).toISOString() });
  await change("exam_preparation");
  expect(records.get("mockSubscriptions/student_trial")).toMatchObject({ uid: "student", level: "A2", scope: "trial", expiresAtMs: end });
  await change("full_course");
  await change("exam_preparation");
  expect(records.get("mockSubscriptions/student_trial").expiresAtMs).toBe(end);
});
test("expired course trial does not create a new exam grant", async () => {
  const { records, change } = fixture({ paid: 0, balanceDue: 3000, level: "A2", trialEndsAt: new Date(Date.now() - 1000).toISOString() });
  await change("exam_preparation");
  expect(records.has("mockSubscriptions/student_trial")).toBe(false);
});

test("changing preference does not initiate checkout and recovers a missing preserved trial grant", async () => {
  const end = Date.now()+3600000;
  const {records,change}=fixture({accountType:"exam_only",courseType:"exam_preparation",courseEnrollmentPreserved:true,level:"A2",paid:0,balanceDue:3000,trialEndsAt:new Date(end).toISOString()});
  records.set("courseAccountAccess/student",{examOnly:true,canRestoreCourse:true});
  const res=await change("exam_preparation");
  expect(res.json).toHaveBeenCalledWith({courseType:"exam_preparation",accountType:"exam_only",checkout:null});
  expect(records.get("mockSubscriptions/student_trial").expiresAtMs).toBe(end);
  expect(records.has("courseTypeOrders/student")).toBe(false);
});
test("a direct exam trial transfers only the original remaining days to a validated same-level class", async () => {
  const end=Date.now()+3600000;
  const {records,change}=fixture({accountType:"exam_only",courseType:"exam_preparation",level:"A2",trialStatus:"not_applicable"});
  const grant={uid:"student",scope:"trial",status:"active",level:"A2",expiresAtMs:end,mockIds:[require("../trialExams.json").A2.catalogId]};
  records.set("mockSubscriptions/student_trial",grant);
  records.set("classes/a2",{name:"A2 Evening",level:"A2",language:"German",status:"active",startDate:"2026-01-01",endDate:"2999-01-01",registrationOpen:true});
  await change("full_course",undefined,{classId:"a2",expectedCourseType:"exam_preparation"});
  expect(records.get("students/student")).toMatchObject({accountType:"course",courseType:"full_course",courseEnrollmentPreserved:true,level:"A2",classId:"a2",paid:0,balanceDue:3000,paymentStatus:"pending",trialEndsAt:new Date(end).toISOString()});
  expect(records.get("mockSubscriptions/student_trial")).toEqual(grant);
  await change("exam_preparation");
  await change("full_course");
  expect(records.get("students/student").trialEndsAt).toBe(new Date(end).toISOString());
  expect(records.get("mockSubscriptions/student_trial")).toEqual(grant);
  expect(records.has("courseTypeOrders/student")).toBe(false);
});
test("invalid, expired or different-level trial grants do not unlock Full Course", () => {
  const now=Date.now();
  const student={level:"A2"};
  const course={id:"c",title:"A2",level:"A2",language:"German",publicVisible:true,registrationOpen:true,status:"active",startDate:"2026-01-01",endDate:"2999-01-01",tuitionGhs:3000};
  const grant={uid:"student",scope:"trial",status:"active",level:"A2",expiresAtMs:now+60000,mockIds:[require("../trialExams.json").A2.catalogId]};
  expect(examTrialCoursePatch(student,{...grant,expiresAtMs:now},course,"student",now)).toBeNull();
  expect(examTrialCoursePatch(student,{...grant,uid:"other"},course,"student",now)).toBeNull();
  expect(examTrialCoursePatch(student,grant,{...course,level:"B1"},"student",now)).toBeNull();
  expect(examTrialCoursePatch({...student,trialUsedAt:"old"},grant,course,"student",now)).toBeNull();
});
test("stale preference and pending deletion or dual-language account cannot switch", async () => {
  const {records,change}=fixture({courseType:"full_course",paid:0,balanceDue:3000});
  expect((await change("exam_preparation",undefined,{expectedCourseType:"exam_preparation"})).status).toHaveBeenCalledWith(409);
  records.set("accountDeletionRequests/student",{status:"pending"});
  expect((await change("exam_preparation")).status).toHaveBeenCalledWith(409);
  records.delete("accountDeletionRequests/student");
  records.set("students/student",{...records.get("students/student"),secondaryProgram:"swahili"});
  expect((await change("exam_preparation")).status).toHaveBeenCalledWith(409);
});
