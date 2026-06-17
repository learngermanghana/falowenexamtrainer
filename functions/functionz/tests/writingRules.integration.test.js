const PROJECT_ID = "demo-test";
const AUTH_URL = "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1";
const AUTH_EMULATOR_URL = "http://127.0.0.1:9099";
const DB_URL = `http://127.0.0.1:8080/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const API_KEY = "fake-api-key";
const TEST_PASSWORD = ["Rules", "Test", "123!"].join("");

const signUp = async (prefix) => {
  const email = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const response = await fetch(`${AUTH_URL}/accounts:signUp?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: TEST_PASSWORD, returnSecureToken: true }),
  });
  if (!response.ok) throw new Error(`Auth emulator signup failed: ${response.status}`);
  return response.json();
};

const signInWithCustomToken = async (uid, claims = {}) => {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({ iss: "rules-test", sub: "rules-test", aud: PROJECT_ID, iat: 0, uid, claims }),
  ).toString("base64url");
  const response = await fetch(`${AUTH_URL}/accounts:signInWithCustomToken?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: `${header}.${payload}.`, returnSecureToken: true }),
  });
  if (!response.ok) throw new Error(`Custom token signin failed: ${response.status}`);
  return response.json();
};

const clearAuthEmulator = () =>
  fetch(`${AUTH_EMULATOR_URL}/emulator/v1/projects/${PROJECT_ID}/accounts`, { method: "DELETE" });

const fields = (values) => ({
  fields: Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      typeof value === "number"
        ? { integerValue: String(value) }
        : typeof value === "boolean"
          ? { booleanValue: value }
          : { stringValue: String(value) },
    ]),
  ),
});

const write = (token, path, values) =>
  fetch(`${DB_URL}/${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(fields(values)),
  });

const read = (token, path) => fetch(`${DB_URL}/${path}`, { headers: { Authorization: `Bearer ${token}` } });

const remove = (token, path) =>
  fetch(`${DB_URL}/${path}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });

const ownedWritingCases = [
  ["writingProgress parent", (uid) => `writingProgress/${uid}__course`],
  ["writingProgress attempt", (uid) => `writingProgress/${uid}__course/attempts/attempt-1`],
  ["writingReferences", (uid) => `writingReferences/${uid}-reference`],
  ["savedWriting", (uid) => `savedWriting/${uid}-saved`],
  ["writingFeedback", (uid) => `writingFeedback/${uid}-feedback`],
];

describe("private writing Firestore rules", () => {
  beforeAll(() => jest.setTimeout(30000));
  afterAll(async () => {
    await clearAuthEmulator();
  });

  test.each(ownedWritingCases)("%s allows only the owner to create/read/delete", async (_label, pathFor) => {
    const [owner, other] = await Promise.all([signUp("owner"), signUp("other")]);
    const path = pathFor(owner.localId);
    const attempt = { userId: owner.localId, mode: "course", level: "B2", originalText: "Das ist mein Text.", score: 18 };

    expect((await write(owner.idToken, path, attempt)).ok).toBe(true);
    expect((await read(owner.idToken, path)).ok).toBe(true);
    expect((await read(other.idToken, path)).status).toBe(403);
    expect((await write(other.idToken, pathFor(other.localId), { ...attempt, userId: owner.localId })).status).toBe(403);
    expect((await remove(owner.idToken, path)).ok).toBe(true);
  });

  it("prevents owners from changing ownership fields", async () => {
    const [owner, other] = await Promise.all([signUp("lock-owner"), signUp("lock-other")]);
    const path = `writingProgress/${owner.localId}__course/attempts/attempt-ownership`;
    const attempt = { userId: owner.localId, ownerUid: owner.localId, uid: owner.localId, mode: "course", level: "B2" };

    expect((await write(owner.idToken, path, attempt)).ok).toBe(true);
    expect((await write(owner.idToken, path, { ...attempt, userId: other.localId })).status).toBe(403);
    expect((await write(owner.idToken, path, { ...attempt, uid: other.localId })).status).toBe(403);
    expect((await write(owner.idToken, path, { ...attempt, ownerUid: other.localId })).status).toBe(403);
  });

  it("allows staff reads through explicit admin/tutor claims without granting student writes", async () => {
    const owner = await signUp("staff-owner");
    const staff = await signInWithCustomToken(`staff-${Date.now()}`, { role: "tutor" });
    const path = `writingReferences/${owner.localId}-staff-check`;

    expect((await write(owner.idToken, path, { userId: owner.localId, topic: "Beschwerde" })).ok).toBe(true);
    expect((await read(staff.idToken, path)).ok).toBe(true);
    expect((await write(staff.idToken, path, { userId: owner.localId, topic: "Changed by staff" })).status).toBe(403);
  });
});
