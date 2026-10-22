import { createOrResumeSignupAccount } from "../lib/signupAuthRecovery";

const credentials = (email = "student@example.com") => ({ user: { uid: "uid-123", email } });
const defaults = () => ({
  email: "student@example.com", password: "sample-password",
  createAccount: jest.fn().mockResolvedValue(credentials()),
  signIn: jest.fn().mockResolvedValue(credentials()),
  findProfile: jest.fn().mockResolvedValue(null),
  deletionStatus: jest.fn().mockResolvedValue(null),
  signOutExisting: jest.fn().mockResolvedValue(undefined),
});
const duplicate = () => Object.assign(new Error("already exists"), { code: "auth/email-already-in-use" });

test("new signup never triggers a profile recovery lookup", async () => {
  const deps = defaults();
  const result = await createOrResumeSignupAccount(deps);
  expect(result.resumed).toBe(false);
  expect(deps.signIn).not.toHaveBeenCalled();
  expect(deps.findProfile).not.toHaveBeenCalled();
});

test("same-email authenticated incomplete signup can resume", async () => {
  const deps = defaults(); deps.createAccount.mockRejectedValue(duplicate());
  const result = await createOrResumeSignupAccount(deps);
  expect(result.resumed).toBe(true);
  expect(deps.findProfile).toHaveBeenCalledWith("uid-123", "student@example.com");
});

test("existing student profile cannot be overwritten", async () => {
  const deps = defaults(); deps.createAccount.mockRejectedValue(duplicate());
  deps.findProfile.mockResolvedValue({ studentCode: "A123" });
  await expect(createOrResumeSignupAccount(deps)).rejects.toMatchObject({code:"auth/email-already-in-use"});
  expect(deps.signOutExisting).toHaveBeenCalled();
});

test("an account being deleted cannot be recreated", async () => {
  const deps = defaults(); deps.createAccount.mockRejectedValue(duplicate());
  deps.deletionStatus.mockResolvedValue("completed");
  await expect(createOrResumeSignupAccount(deps)).rejects.toMatchObject({code:"auth/email-already-in-use"});
  expect(deps.signOutExisting).toHaveBeenCalled();
});

test("a lead or email collision without correct password never recovers", async () => {
  const deps = defaults(); deps.createAccount.mockRejectedValue(duplicate());
  deps.signIn.mockRejectedValue(Object.assign(new Error("bad password"), {code:"auth/invalid-credential"}));
  await expect(createOrResumeSignupAccount(deps)).rejects.toMatchObject({code:"auth/email-already-in-use"});
  expect(deps.findProfile).not.toHaveBeenCalled();
});

test("Firestore lookup errors never silently turn into a new student", async () => {
  const deps = defaults(); deps.createAccount.mockRejectedValue(duplicate());
  deps.findProfile.mockRejectedValue(new Error("permission-denied"));
  await expect(createOrResumeSignupAccount(deps)).rejects.toThrow("permission-denied");
});
