const { registerStudentDocumentRoutes, isTrustedAppsScriptUrl } = require("../studentDocuments");

const makeResponse = () => {
  const res = { headers: {}, code: 200, payload: null };
  res.set = (key, value) => { res.headers[key] = value; return res; };
  res.status = (code) => { res.code = code; return res; };
  res.json = (value) => { res.payload = value; return res; };
  res.send = (value) => { res.payload = value; return res; };
  return res;
};

const makeHandler = ({ authenticated = { uid: "uid-1", email: "Student@Example.com", email_verified: true },
  student = { studentCode: "STU123", email: "student@example.com" }, allowed = true } = {}) => {
  let handler;
  registerStudentDocumentRoutes({
    post: (path, fn) => {
      expect(path).toBe("/students/me/documents/:kind");
      handler = fn;
    },
  }, {
    requireAuthenticatedUser: async () => authenticated,
    getFirestoreSafe: () => ({}),
    findAuthedStudentProfile: async () => ({ data: student }),
    enforceUserQuota: async () => ({ allowed }),
  });
  return handler;
};

describe("student-only document download API", () => {
  beforeEach(() => {
    process.env.ANNOUNCEMENT_WEBHOOK_URL = "https://script.google.com/macros/s/test-id/exec";
    process.env.ANNOUNCEMENT_WEBHOOK_TOKEN = "test-secret";
    global.fetch = jest.fn();
  });
  afterEach(() => {
    delete process.env.ANNOUNCEMENT_WEBHOOK_URL;
    delete process.env.ANNOUNCEMENT_WEBHOOK_TOKEN;
    delete process.env.STUDENT_DOCS_WEBHOOK_URL;
    delete process.env.STUDENT_DOCS_WEBHOOK_TOKEN;
    delete global.fetch;
  });

  test("rejects non-Google webhook hosts", () => {
    expect(isTrustedAppsScriptUrl("https://malicious.example/macros/s/test-id/exec")).toBe(false);
    expect(isTrustedAppsScriptUrl("https://script.google.com/macros/s/test-id/exec")).toBe(true);
  });

  test("rejects unverified or mismatched account identity without a Google call", async () => {
    const handler = makeHandler({ authenticated: { uid: "uid-1", email: "someone@example.com", email_verified: true } });
    const res = makeResponse();
    await handler({ params: { kind: "certificate" }, body: { level: "A1" } }, res);
    expect(res.code).toBe(403);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("rejects unverified learner tokens even when the student record matches", async () => {
    const handler = makeHandler({
      authenticated: { uid: "uid-1", email: "student@example.com", email_verified: false },
    });
    const res = makeResponse();
    await handler({ params: { kind: "transcript" }, body: { level: "A1" } }, res);
    expect(res.code).toBe(403);
    expect(res.payload.error).toMatch(/verify.*email/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("the browser cannot choose another person's student code or email", async () => {
    const handler = makeHandler();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true, level: "A1", kind: "transcript", mime_type: "application/pdf",
        file_name: "My_Transcript.pdf",
        data_base64: Buffer.from("%PDF-1.4\nmock").toString("base64"),
      }),
    });
    const res = makeResponse();
    await handler({ params: { kind: "transcript" },
      body: { level: "A1", student_code: "VICTIM", email: "victim@example.com" } }, res);
    expect(res.code).toBe(200);
    const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(payload.row).toEqual({ student_code: "STU123", email: "student@example.com" });
    expect(payload.action).toBe("exportStudentDocumentFromScores");
    expect(res.headers["Cache-Control"]).toContain("no-store");
    expect(res.headers["Content-Type"]).toBe("application/pdf");
  });

  test.each(["enrollment", "agreement", "receipt", "residence"])("routes %s to Student Docs with the verified identity", async kind => {
    process.env.STUDENT_DOCS_WEBHOOK_URL = "https://script.google.com/macros/s/student-docs/exec";
    process.env.STUDENT_DOCS_WEBHOOK_TOKEN = "registration-secret";
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({
      ok: true, kind, mime_type: "application/pdf", data_base64: Buffer.from("%PDF-copy").toString("base64"),
    }) });
    const res = makeResponse();
    await makeHandler()({ params: { kind }, body: { email: "another@example.com", level: "A2" } }, res);
    expect(res.code).toBe(200);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe(process.env.STUDENT_DOCS_WEBHOOK_URL);
    expect(JSON.parse(options.body)).toEqual({
      token: "registration-secret", action: "exportStudentAccountDocument", source: "falowen-student-account", kind,
      row: { student_code: "STU123", email: "student@example.com" },
    });
  });

  test("does not issue a PDF when canonical certificate verification refuses", async () => {
    const handler = makeHandler();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: false, error: "Certificate not yet eligible for A1: 18/19 required tasks passed" }),
    });
    const res = makeResponse();
    await handler({ params: { kind: "certificate" }, body: { level: "A1" } }, res);
    expect(res.code).toBe(409);
    expect(res.payload.error).toMatch(/not available yet/);
    expect(res.payload.error).toContain("18 of 19 required tasks");
  });

  test("requires server configuration and enforces request quotas", async () => {
    const handler = makeHandler();
    delete process.env.ANNOUNCEMENT_WEBHOOK_TOKEN;
    const unconfigured = makeResponse();
    await handler({ params: { kind: "transcript" }, body: { level: "A2" } }, unconfigured);
    expect(unconfigured.code).toBe(503);
    process.env.ANNOUNCEMENT_WEBHOOK_TOKEN = "test-secret";

    const limited = makeResponse();
    await makeHandler({ allowed: false })({ params: { kind: "transcript" }, body: { level: "A2" } }, limited);
    expect(limited.code).toBe(429);
    expect(global.fetch).not.toHaveBeenCalled();
  });

 test.each(["certificate","transcript","enrollment","agreement","receipt","residence"])("trial users cannot download %s", async kind => {
  const res = makeResponse();
  await makeHandler({student:{studentCode:"STU123",email:"student@example.com",trialStatus:"active",paid:0}})({params:{kind},body:{level:"A1"}},res);
  expect(res.code).toBe(403);
  expect(res.payload.code).toBe("trial_document_restricted");
  expect(global.fetch).not.toHaveBeenCalled();
 });

});
