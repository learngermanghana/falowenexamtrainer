import { checkSignupDuplicate } from "./signupDuplicateCheck";

describe("fail-closed registration duplicate check", () => {
  const applicant = {
    name: "Ama Ofori", email: "ama@example.com", phone: "0241234567",
    emergencyContactPhone: "0559876543",
  };
  const previousFetch = global.fetch;

  afterEach(() => {
    global.fetch = previousFetch;
  });

  test("permits signup only after an explicit clear result", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200, json: async () => ({ code: "CLEAR" }),
    });
    await expect(checkSignupDuplicate(applicant)).resolves.toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/signup-duplicate-check"),
      expect.objectContaining({ method: "POST", cache: "no-store" }),
    );
  });

  test("requires review instead of creating a second account", async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 409 });
    await expect(checkSignupDuplicate(applicant)).rejects.toMatchObject({
      code: "auth/duplicate-review-required",
    });
  });

  test.each([429, 503])("does not bypass checks after status %s", async status => {
    global.fetch = jest.fn().mockResolvedValue({ status });
    await expect(checkSignupDuplicate(applicant)).rejects.toMatchObject({
      code: "auth/duplicate-check-unavailable",
    });
  });

  test("does not bypass malformed successful server responses", async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 200, json: async () => ({}) });
    await expect(checkSignupDuplicate(applicant)).rejects.toMatchObject({
      code: "auth/duplicate-check-unavailable",
    });
  });

  test("does not bypass network errors", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("offline"));
    await expect(checkSignupDuplicate(applicant)).rejects.toMatchObject({
      code: "auth/duplicate-check-unavailable",
    });
  });
});
