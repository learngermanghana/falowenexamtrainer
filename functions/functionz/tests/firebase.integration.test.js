const PROJECT_ID = "demo-test";
const AUTH_EMULATOR_URL = "http://127.0.0.1:9099";
const FIRESTORE_REST_URL = `http://127.0.0.1:8080/v1/projects/${PROJECT_ID}/databases/(default)`;
const FIRESTORE_ADMIN_URL = `http://127.0.0.1:8080/emulator/v1/projects/${PROJECT_ID}/databases/(default)`;

const authEndpoint = (path) =>
  `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/${path}?key=fake-api-key`;

const getOobCodes = () =>
  fetch(`${AUTH_EMULATOR_URL}/emulator/v1/projects/${PROJECT_ID}/oobCodes`).then((res) =>
    res.json()
  );

const clearAuthEmulator = () =>
  fetch(`${AUTH_EMULATOR_URL}/emulator/v1/projects/${PROJECT_ID}/accounts`, {
    method: "DELETE",
  });

const clearFirestoreEmulator = () =>
  fetch(`${FIRESTORE_ADMIN_URL}/documents`, {
    method: "DELETE",
  });

const signUpWithEmail = async (email, password) => {
  const response = await fetch(authEndpoint("accounts:signUp"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  if (!response.ok) {
    throw new Error(`Signup failed: ${response.status}`);
  }

  return response.json();
};

const sendVerificationEmail = async (idToken) => {
  const response = await fetch(authEndpoint("accounts:sendOobCode"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestType: "VERIFY_EMAIL", idToken }),
  });

  if (!response.ok) {
    throw new Error(`sendOobCode failed: ${response.status}`);
  }

  return response.json();
};

const applyVerificationCode = async (oobCode) => {
  const response = await fetch(authEndpoint("accounts:update"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oobCode }),
  });

  if (!response.ok) {
    throw new Error(`applyActionCode failed: ${response.status}`);
  }

  return response.json();
};

const lookupAccount = async (idToken) => {
  const response = await fetch(authEndpoint("accounts:lookup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error(`lookup failed: ${response.status}`);
  }

  return response.json();
};

const writeFirestoreDocument = async (idToken, path, fields) => {
  const body = {
    fields: Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [
        key,
        typeof value === "number"
          ? { integerValue: value.toString() }
          : { stringValue: value },
      ])
    ),
  };

  const response = await fetch(`${FIRESTORE_REST_URL}/documents/${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Firestore write failed: ${response.status}`);
  }

  return response.json();
};

const readFirestoreDocument = async (idToken, path) => {
  const response = await fetch(`${FIRESTORE_REST_URL}/documents/${path}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Firestore read failed: ${response.status}`);
  }

  const payload = await response.json();
  return Object.fromEntries(
    Object.entries(payload.fields || {}).map(([key, value]) => {
      if (value.stringValue !== undefined) {
        return [key, value.stringValue];
      }

      if (value.integerValue !== undefined) {
        return [key, Number(value.integerValue)];
      }

      return [key, value];
    })
  );
};

describe("Firebase auth + Firestore integration", () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
    process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  });

  afterAll(async () => {
    await Promise.all([clearAuthEmulator(), clearFirestoreEmulator()]);
  });

  const findVerificationCode = async (email) => {
    const payload = await getOobCodes();
    const code = payload.oobCodes?.find(
      (entry) => entry.email === email && entry.requestType === "VERIFY_EMAIL"
    );

    if (!code) {
      throw new Error(`No verification code found for ${email}`);
    }

    return code.oobCode;
  };

  it("creates an email/password user and completes verification", async () => {
    const email = `student-${Date.now()}@example.com`;
    const password = "StrongPass123!";

    const signup = await signUpWithEmail(email, password);
    expect(signup.email).toBe(email);

    await sendVerificationEmail(signup.idToken);
    const verificationCode = await findVerificationCode(email);
    await applyVerificationCode(verificationCode);

    const lookup = await lookupAccount(signup.idToken);
    expect(lookup.users?.[0]?.emailVerified).toBe(true);
  });

  it("allows a verified user to write and read a student profile", async () => {
    const email = `profile-${Date.now()}@example.com`;
    const password = "StrongPass123!";

    const signup = await signUpWithEmail(email, password);
    await sendVerificationEmail(signup.idToken);
    const verificationCode = await findVerificationCode(email);
    await applyVerificationCode(verificationCode);

    const studentId = signup.localId;
    const profilePath = `students/${studentId}`;
    const profileData = {
      firstName: "Ada",
      lastName: "Lovelace",
      email,
      level: "B2",
      createdAt: Date.now(),
    };

    await writeFirestoreDocument(signup.idToken, profilePath, profileData);
    const storedProfile = await readFirestoreDocument(signup.idToken, profilePath);

    expect(storedProfile).toMatchObject(profileData);

    await writeFirestoreDocument(signup.idToken, profilePath, {
      ...profileData,
      level: "C1",
    });
    const updatedProfile = await readFirestoreDocument(signup.idToken, profilePath);

    expect(updatedProfile.level).toBe("C1");
  });
});
