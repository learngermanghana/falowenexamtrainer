const crypto = require("crypto");
const http = require("http");

const mockVerifyIdToken = jest.fn();
const mockStudentGet = jest.fn();
const mockStudentSet = jest.fn();
const mockEventSet = jest.fn();
const mockEventGet = jest.fn();
const mockInitSet = jest.fn();
const mockAppendSheet = jest.fn();

jest.mock("firebase-admin", () => ({
  auth: () => ({ verifyIdToken: mockVerifyIdToken }),
  firestore: Object.assign(
    () => ({
      collection: (name) => {
        if (name === "students") {
          return {
            doc: () => ({
              get: mockStudentGet,
              set: mockStudentSet,
              id: "student-doc-id",
            }),
            where: () => ({ limit: () => ({ get: jest.fn().mockResolvedValue({ empty: true }) }) }),
          };
        }
        if (name === "paystackWebhookEvents") {
          return { doc: () => ({ get: mockEventGet, set: mockEventSet, id: "event-doc-id" }) };
        }
        if (name === "paystackInitRequests") {
          return { doc: () => ({ set: mockInitSet }) };
        }
        return { doc: () => ({ set: jest.fn(), get: jest.fn() }) };
      },
      runTransaction: async (callback) => callback({
        get: mockEventGet,
        set: (ref, data) => ref.set(data),
      }),
    }),
    { FieldValue: { serverTimestamp: () => "SERVER_TIMESTAMP", delete: () => "DELETE_FIELD" } }
  ),
}));

jest.mock("../app", () => (req, res) => res.status(404).json({ error: "legacy" }));
jest.mock("../studentsSheet", () => ({
  appendStudentToStudentsSheetSafely: (...args) => mockAppendSheet(...args),
}));

const listen = (app) => new Promise((resolve) => {
  const server = http.createServer(app);
  server.listen(0, () => resolve(server));
});

const request = async (app, path, { method = "POST", body = {}, headers = {} } = {}) => {
  const server = await listen(app);
  const port = server.address().port;
  const payload = JSON.stringify(body);

  try {
    return await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path,
          method,
          headers: {
            "content-type": "application/json",
            "content-length": Buffer.byteLength(payload),
            ...headers,
          },
        },
        (res) => {
          let raw = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => { raw += chunk; });
          res.on("end", () => {
            resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : {} });
          });
        }
      );
      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  } finally {
    server.close();
  }
};

const signedWebhookHeaders = (payload) => {
  const raw = JSON.stringify(payload);
  return {
    "x-paystack-signature": crypto.createHmac("sha512", "test_secret").update(raw).digest("hex"),
  };
};

const loadApp = () => {
  jest.resetModules();
  process.env.PAYSTACK_SECRET = "test_secret";
  return require("../paymentAwareApp");
};

const mockStudent = (data) => {
  mockStudentGet.mockResolvedValue({
    exists: true,
    id: "student-doc-id",
    ref: { id: "student-doc-id", set: mockStudentSet },
    data: () => ({
      studentCode: "STU123",
      email: "student@example.com",
      tuitionCurrency: "GHS",
      ...data,
    }),
  });
};

describe("Paystack billing normalization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: true,
      json: async () => ({ status: true, data: { authorization_url: "https://paystack.test/pay", reference: "ref_123" } }),
    });
    mockVerifyIdToken.mockResolvedValue({ uid: "uid-1", email: "student@example.com" });
    mockEventGet.mockResolvedValue({ exists: false });
    mockAppendSheet.mockResolvedValue(undefined);
  });

  afterEach(() => {
    delete process.env.PAYSTACK_SECRET;
  });

  it("accepts GH₵200 as final payment when paid is current and initialPaymentAmount is stale", async () => {
    const app = loadApp();
    mockStudent({ tuitionFee: 3000, paid: 2800, initialPaymentAmount: 0, balanceDue: 200 });

    const response = await request(app, "/paystack/initialize", {
      body: { studentCode: "STU123", amount: 200 },
      headers: { authorization: "Bearer token" },
    });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const paystackBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(paystackBody.metadata.balanceBefore).toBe(200);
    expect(paystackBody.metadata.paidSoFar).toBe(2800);
  });

  it("rejects a below-minimum payment that is not the final balance", async () => {
    const app = loadApp();
    mockStudent({ tuitionFee: 3000, paid: 500, balanceDue: 2500 });

    const response = await request(app, "/paystack/initialize", {
      body: { studentCode: "STU123", amount: 200 },
      headers: { authorization: "Bearer token" },
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Minimum payment is GH₵2000");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("normalizes currency symbols, commas, and numeric strings", () => {
    const { normalizeStudentBilling } = loadApp();
    expect(normalizeStudentBilling({ tuitionFee: "GH₵3,000", paid: "2,800", balanceDue: "GH₵200" })).toEqual(
      expect.objectContaining({ tuitionFee: 3000, paidSoFar: 2800, effectiveBalance: 200 })
    );
  });

  it("falls back to initialPaymentAmount when paid is missing", async () => {
    const app = loadApp();
    mockStudent({ tuitionFee: 3000, initialPaymentAmount: 2800, balanceDue: 200 });

    const response = await request(app, "/paystack/initialize", {
      body: { studentCode: "STU123", amount: 200 },
      headers: { authorization: "Bearer token" },
    });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it("uses derived balance when explicit balance is stale", () => {
    const { normalizeStudentBilling } = loadApp();
    expect(normalizeStudentBilling({ tuitionFee: 3000, paid: 2800, balanceDue: 3000 })).toEqual(
      expect.objectContaining({ explicitBalance: 3000, derivedBalance: 200, effectiveBalance: 200 })
    );
  });

  it("updates paid and initialPaymentAmount after a successful webhook payment", async () => {
    const app = loadApp();
    mockStudent({ tuitionFee: 3000, paid: 2800, initialPaymentAmount: 0, balanceDue: 200 });
    const payload = {
      event: "charge.success",
      data: {
        reference: "ref_webhook",
        amount: 20408,
        currency: "GHS",
        fees: 408,
        paid_at: new Date().toISOString(),
        customer: { email: "student@example.com" },
        metadata: {
          studentCode: "STU123",
          tuitionAmount: 200,
          checkoutAmount: 204.08,
          studentFeeContribution: 4.08,
          feePolicy: "shared_50_50",
        },
      },
    };

    const response = await request(app, "/paystack/webhook", {
      body: payload,
      headers: signedWebhookHeaders(payload),
    });

    expect(response.status).toBe(200);
    expect(response.body.paymentStatus).toBe("paid");
    expect(mockStudentSet).toHaveBeenCalledWith(expect.objectContaining({
      paid: 3000,
      initialPaymentAmount: 3000,
      balanceDue: 0,
      paymentStatus: "paid",
    }), { merge: true });
  });
});
