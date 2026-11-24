const { once } = require("node:events");
let mockStudent;
const mockDb = {
  collection(name) {
    if (name === "students") return {
      doc: () => ({ get: async () => ({ exists: true, data: () => mockStudent }) }),
      where(field, op, uid) {
        expect([field, op, uid]).toEqual(["uid", "==", "learner"]);
        return { limit: () => ({ get: async () => ({ empty: false, docs: [{ data: () => mockStudent }] }) }) };
      },
    };
    if (name === "aiAuditLogs") return { add: async () => {} };
    return { doc: () => ({ get: async () => ({ data: () => ({}) }) }) };
  },
  runTransaction: work => work({ get: async () => ({ exists: false }), set: () => {} }),
};
jest.mock("firebase-admin", () => ({
  apps: [{}], auth: () => ({ verifyIdToken: async () => ({ uid: "learner" }) }),
  firestore: Object.assign(() => mockDb, {
    Timestamp: { now: () => 0 }, FieldValue: { serverTimestamp: () => 0 },
  }),
}));
jest.mock("../openaiClient", () => ({ createChatCompletion: jest.fn(async () => "Test reply") }));
const { createChatCompletion } = require("../openaiClient");
const app = require("../app");
let server;
const originalKey = process.env.OPENAI_API_KEY;
beforeAll(async () => {
  process.env.OPENAI_API_KEY = "test";
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
});
afterAll(async () => {
  if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalKey;
  await new Promise(resolve => server.close(resolve));
});
async function promptFor(route, student) {
  mockStudent = student;
  createChatCompletion.mockClear();
  const response = await fetch(`http://127.0.0.1:${server.address().port}${route}`, {
    method: "POST", headers: { Authorization: "Bearer test", "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Mein Hobby", answer: "Mein Hobby", level: "C1" }),
  });
  expect(response.status).toBe(200);
  expect(createChatCompletion).toHaveBeenCalledTimes(1);
  return createChatCompletion.mock.calls[0][0][0].content;
}
test.each([
  ["/chatbuddy/respond", "Target CEFR level: B1."],
  ["/speaking/custom-chat", "Target CEFR level: B1."],
  ["/speaking/presentation-chat", "give feedback half in English and half in German"],
  ["/speaking/presentation-upgrade", "Target level context: B1."],
])("%s uses the active German placement", async (route, expected) => {
  expect(await promptFor(route, { program: "swahili", level: "A1", secondaryProgram: "german",
    coursePlacements: { german: { level: "B1" } } })).toContain(expected);
});
test.each([
  [{ level: "A2" }, "A2"],
  [{ program: "german", level: "B2", secondaryProgram: "swahili", coursePlacements: { german: { level: "A1" } } }, "B2"],
  [{ program: "swahili", level: "A1", coursePlacements: { german: { level: "B1" } } }, "A1"],
  [{ program: "swahili", level: "B2", secondaryProgram: "german" }, "A1"],
])("handles primary, legacy, inactive and missing placements %#", async (student, expected) => {
  expect(await promptFor("/chatbuddy/respond", student)).toContain(`Target CEFR level: ${expected}.`);
});
