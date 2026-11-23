const { courseExpiry, allowsTrialRequest } = require("../trialPractice");
const exams = require("../trialExams.json");

test.each(["A1", "A2", "B1", "B2"])("%s allows its assigned paper and rejects another mock or level", async level => {
  const req = { path: "/" + level.toLowerCase() + "-mock/attempt/start", body: { mockId: exams[level].engineId } };
  expect(await allowsTrialRequest(req, {level})).toBe(true);
  expect(await allowsTrialRequest({...req, body: {mockId: level.toLowerCase() + "-mock-08"}}, {level})).toBe(false);
  expect(await allowsTrialRequest(req, {level: "C1"})).toBe(false);
});

test("C1 can save only its selected reading paper", async () => {
  const req = { path: "/exam-room/results", method: "POST", body: { level: "C1", setId: "c1-reading-sample-01", section: "lesen" } };
  expect(await allowsTrialRequest(req, {level:"C1"})).toBe(true);
  expect(await allowsTrialRequest({...req, body:{...req.body, setId:"c1-reading-sample-02"}}, {level:"C1"})).toBe(false);
});

test("Day 1 audio belongs to course trials, and A1 Mock 2 uses Hören Sample 2", async () => {
  const day = {path:"/course-media/a1/audio-url",query:{day:"1"}};
  expect(await allowsTrialRequest(day,{level:"A1",course:true})).toBe(true);
  expect(await allowsTrialRequest(day,{level:"A1",course:false})).toBe(false);
  expect(await allowsTrialRequest({...day,query:{day:"2"}},{level:"A1",course:true})).toBe(false);
  expect(await allowsTrialRequest({path:"/course-media/a1/exam-hoeren-audio-url",query:{sampleId:"sample-2"}},{level:"A1"})).toBe(true);
});

test("course trial recognises legacy starts and exempts paid accounts", () => {
  const profile = {level:"B1",trialStatus:"active",joined_at:"2026-11-01"};
  expect(courseExpiry(profile)).toBe(Date.parse("2026-11-08"));
  expect(courseExpiry({...profile,paymentStatus:"paid"})).toBeNull();
});

test("registration creates the student and one expiring grant in the same batch", async () => {
  const handlers = {};
  const app = { post: (path, fn) => { handlers[path] = fn; }, get: () => {} };
  const writes = [];
  const batch = { create: (ref, data) => writes.push([ref.path, data]), commit: jest.fn() };
  const db = {
    batch: () => batch,
    collection: name => ({
      doc: id => ({path: name + "/" + id, get: async () => ({exists:false})}),
      where: () => ({limit: () => ({get: async () => ({empty:true})})}),
    }),
  };
  const firestore = Object.assign(() => db, {FieldValue:{serverTimestamp:() => "serverTime"}});
  const admin = {firestore, auth: () => ({getUser: async () => ({}), setCustomUserClaims: async () => {}})};
  require("../mockCommerce").registerMockCommerceRoutes(app, {admin, getAuthedUser: async () => ({uid:"test", email:"test@example.com"})});
  const res = {status:jest.fn().mockReturnThis(), json:jest.fn()};
  const now = Date.now();
  await handlers["/mock/register"]({body:{name:"Test Student",level:"A1"}},res);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(batch.commit).toHaveBeenCalledTimes(1);
  expect(writes.map(([path]) => path)).toEqual(["students/test","mockSubscriptions/test_trial"]);
  expect(writes[1][1]).toMatchObject({scope:"trial",level:"A1",mockIds:["a1-final-02"]});
  expect(writes[1][1].expiresAtMs).toBeGreaterThanOrEqual(now + 7*86400000);
  expect(writes[1][1].expiresAtMs).toBeLessThanOrEqual(Date.now() + 7*86400000);
});
