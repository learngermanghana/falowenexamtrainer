const PROJECT_ID = "demo-test";
const AUTH_URL = "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1";
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

const fields = (values) => ({
  fields: Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      typeof value === "number"
        ? { integerValue: String(value) }
        : { stringValue: String(value) },
    ]),
  ),
});

const write = (token, path, values) =>
  fetch(`${DB_URL}/${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields(values)),
  });

const read = (token, path) =>
  fetch(`${DB_URL}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

const remove = (token, path) =>
  fetch(`${DB_URL}/${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

describe("private writing Firestore rules", () => {
  beforeAll(() => jest.setTimeout(30000));

  it("allows the owner and blocks another authenticated student", async () => {
    const [owner, other] = await Promise.all([signUp("owner"), signUp("other")]);
    const path = `writingProgress/${owner.localId}__course/attempts/attempt-1`;
    const attempt = {
      userId: owner.localId,
      mode: "course",
      level: "B2",
      originalText: "Das ist mein Text.",
      score: 18,
    };

    expect((await write(owner.idToken, path, attempt)).ok).toBe(true);
    expect((await read(owner.idToken, path)).ok).toBe(true);
    expect((await read(other.idToken, path)).status).toBe(403);

    const ownerChange = await write(owner.idToken, path, {
      ...attempt,
      userId: other.localId,
    });
    expect(ownerChange.status).toBe(403);
    expect((await remove(owner.idToken, path)).ok).toBe(true);
  });

  it("protects a student's reference notes", async () => {
    const [owner, other] = await Promise.all([signUp("ref-owner"), signUp("ref-other")]);
    const path = `writingReferences/${owner.localId}-reference`;

    expect(
      (
        await write(owner.idToken, path, {
          userId: owner.localId,
          topic: "Beschwerde",
          body: "Ich möchte mich beschweren.",
        })
      ).ok,
    ).toBe(true);
    expect((await read(owner.idToken, path)).ok).toBe(true);
    expect((await read(other.idToken, path)).status).toBe(403);
  });
});
