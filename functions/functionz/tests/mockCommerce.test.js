const { READY_MOCKS, PACKAGES, isReady, processMockWebhook } = require("../mockCommerce");

function fakeAdmin(initialOrder) {
  const values = new Map([["mockOrders/ref-1", initialOrder]]);
  const firestore = () => ({
    collection: (name) => ({ doc: (id) => ({ key: `${name}/${id}` }) }),
    runTransaction: async (work) => work({
      get: async ({ key }) => ({
        exists: values.has(key),
        data: () => values.get(key),
      }),
      create: ({ key }, value) => {
        if (values.has(key)) throw new Error("duplicate record");
        values.set(key, value);
      },
      update: ({ key }, update) => values.set(key, { ...values.get(key), ...update }),
    }),
  });
  firestore.FieldValue = { serverTimestamp: () => "server-time" };
  return { firestore, values };
}
const mockOrder = () => ({
  uid: "uid-123", studentId: "student-123", email: "learner@example.com",
  level: "A1", packageId: "single", amountGhs: 49,
  checkoutPesewas: 5000, mockIds: ["a1-final-01"], status: "pending",
  days: 14,
});
const signedPayload = () => ({
  reference: "ref-1", status: "success", amount: 5000, currency: "GHS",
  customer: { email: "learner@example.com" },
  metadata: { productType: "mock_package", uid: "uid-123", level: "A1", packageId: "single" }
});

describe("Falowen Exams package inventory", () => {
  test("six CEFR levels are represented, but unavailable mocks are never sold", () => {
    expect(Object.keys(READY_MOCKS)).toEqual(["A1","A2","B1","B2","C1","C2"]);
    expect(isReady("A1", PACKAGES.ready)).toBe(true);
    expect(isReady("A2", PACKAGES.ready)).toBe(false);
    expect(isReady("B2", PACKAGES.single)).toBe(true);
    expect(isReady("C1", PACKAGES.single)).toBe(false);
    expect(isReady("C2", PACKAGES.single)).toBe(false);
  });
  test("prices and access are derived from server-side catalog, not checkout form", () => {
    expect(PACKAGES.single).toMatchObject({ priceGhs:49, fullMocks:1, days:14 });
    expect(PACKAGES.ready).toMatchObject({ priceGhs:119, fullMocks:3, days:30 });
  });
});

describe("signed mock webhook processing", () => {
  test("grants one isolated entitlement without touching tuition profile", async () => {
    const admin = fakeAdmin(mockOrder());
    const result = await processMockWebhook({ admin, data: signedPayload() });
    expect(result.body.status).toBe("synced");
    expect(admin.values.get("mockPurchases/ref-1")).toMatchObject({
      uid:"uid-123", level:"A1", mockIds:["a1-final-01"], status:"active"
    });
    expect(admin.values.get("mockOrders/ref-1").status).toBe("paid");
    expect([...admin.values.keys()]).toEqual([
      "mockOrders/ref-1", "mockPurchases/ref-1"
    ]);
  });
  test("replayed webhook cannot generate duplicate entitlements", async () => {
    const admin = fakeAdmin(mockOrder());
    await processMockWebhook({ admin, data: signedPayload() });
    const result = await processMockWebhook({ admin, data: signedPayload() });
    expect(result.body.status).toBe("duplicate");
    expect(admin.values.size).toBe(2);
  });
  test.each([
    ["amount", 4900], ["currency", "USD"], ["status", "failed"]
  ])("rejects a mismatch in %s", async (property, value) => {
    const admin = fakeAdmin(mockOrder());
    const data = { ...signedPayload(), [property]: value };
    const result = await processMockWebhook({ admin, data });
    expect(result.body.status).toBe("rejected");
    expect(admin.values.has("mockPurchases/ref-1")).toBe(false);
  });
  test("rejects tampered package identity or missing original order", async () => {
    const admin = fakeAdmin(mockOrder());
    const bad = signedPayload();
    bad.metadata.packageId = "ready";
    expect((await processMockWebhook({admin, data:bad})).body.status).toBe("rejected");
    expect(admin.values.has("mockPurchases/ref-1")).toBe(false);
    const another = fakeAdmin(mockOrder());
    expect((await processMockWebhook({admin:another,data:{...signedPayload(),reference:"unknown"}})).body.reason).toBe("order_not_found");
  });
});
