const { READY_MOCKS, PACKAGES, isReady, processMockWebhook, subscriptionKey } = require("../mockCommerce");

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
      set: ({ key }, value, options) => values.set(key, options?.merge ? { ...values.get(key), ...value } : value),
    }),
  });
  firestore.FieldValue = { serverTimestamp: () => "server-time" };
  return { firestore, values };
}
const mockOrder = () => ({
  uid: "uid-123", studentId: "student-123", email: "learner@example.com",
  level: "A1", packageId: "monthly", amountGhs: 99,
  checkoutPesewas: 10000, mockIds: ["a1-final-01", "a1-final-02", "a1-final-03"], status: "pending",
  scope: "level", days: 30,
});
const signedPayload = () => ({
  reference: "ref-1", status: "success", amount: 10000, currency: "GHS",
  customer: { email: "learner@example.com" },
  metadata: { productType: "mock_package", uid: "uid-123", level: "A1", packageId: "monthly" }
});

describe("Falowen Exams package inventory", () => {
  test("six CEFR levels are represented, but unavailable mocks are never sold", () => {
    expect(Object.keys(READY_MOCKS)).toEqual(["A1","A2","B1","B2","C1","C2"]);
    expect(isReady("A1", PACKAGES.monthly)).toBe(true);
    expect(isReady("A2", PACKAGES.monthly)).toBe(true);
    expect(isReady("B2", PACKAGES.monthly)).toBe(true);
    expect(isReady("C1", PACKAGES.monthly)).toBe(true);
    expect(isReady("C2", PACKAGES.monthly)).toBe(true);
  });
  test("C1/C2 monthly subscriptions work with practice-only catalogue entries", async () => {
    for (const level of ["C1", "C2"]) {
      const admin = fakeAdmin({
        ...mockOrder(), level, mockIds: [], scope: "level",
      });
      const payload = {
        ...signedPayload(),
        metadata: { ...signedPayload().metadata, level },
      };
      const outcome = await processMockWebhook({ admin, data: payload });
      expect(outcome.body.status).toBe("synced");
      expect(admin.values.get(`mockSubscriptions/uid-123_${level}`)).toMatchObject({level, status:"active"});
    }
  });
  test("prices and access are derived from server-side catalog, not checkout form", () => {
    expect(Object.keys(PACKAGES)).toEqual(["monthly"]);
    expect(PACKAGES.monthly).toMatchObject({ priceGhs:99, days:30, scope:"level" });
    expect(subscriptionKey("abc", "A1")).toBe("abc_A1");
  });
});

describe("signed mock webhook processing", () => {
  test("grants one isolated entitlement without touching tuition profile", async () => {
    const admin = fakeAdmin(mockOrder());
    const result = await processMockWebhook({ admin, data: signedPayload() });
    expect(result.body.status).toBe("synced");
    expect(admin.values.get("mockPurchases/ref-1")).toMatchObject({
      uid:"uid-123", level:"A1", scope:"level", status:"active"
    });
    expect(admin.values.get("mockOrders/ref-1").status).toBe("paid");
    expect(admin.values.get("mockSubscriptions/uid-123_A1")).toMatchObject({
      uid:"uid-123", level:"A1", status:"active", packageId:"monthly"
    });
    expect(admin.values.get("mockSubscriptions/uid-123_A1").expiresAtMs).toBeGreaterThan(Date.now() + 29 * 86400000);
    expect([...admin.values.keys()]).toEqual([
      "mockOrders/ref-1", "mockPurchases/ref-1", "mockSubscriptions/uid-123_A1"
    ]);
  });
  test("replayed webhook cannot generate duplicate entitlements", async () => {
    const admin = fakeAdmin(mockOrder());
    await processMockWebhook({ admin, data: signedPayload() });
    const result = await processMockWebhook({ admin, data: signedPayload() });
    expect(result.body.status).toBe("duplicate");
    expect(admin.values.size).toBe(3);
  });
  test.each([
    ["amount", 9900], ["currency", "USD"], ["status", "failed"]
  ])("rejects a mismatch in %s", async (property, value) => {
    const admin = fakeAdmin(mockOrder());
    const data = { ...signedPayload(), [property]: value };
    const result = await processMockWebhook({ admin, data });
    expect(result.body.status).toBe("rejected");
    expect(admin.values.has("mockPurchases/ref-1")).toBe(false);
  });
  test("renewal extends the existing expiry instead of shortening paid access", async () => {
    const admin = fakeAdmin(mockOrder());
    await processMockWebhook({ admin, data: signedPayload() });
    const firstExpiry = admin.values.get("mockSubscriptions/uid-123_A1").expiresAtMs;
    admin.values.set("mockOrders/ref-2", { ...mockOrder(), reference:"ref-2" });
    await processMockWebhook({ admin, data: { ...signedPayload(), reference:"ref-2" } });
    const secondExpiry = admin.values.get("mockSubscriptions/uid-123_A1").expiresAtMs;
    expect(secondExpiry).toBe(firstExpiry + 30 * 86400000);
    expect(admin.values.get("mockPurchases/ref-2").status).toBe("active");
  });
  test("rejects tampered package identity or missing original order", async () => {
    const admin = fakeAdmin(mockOrder());
    const bad = signedPayload();
    bad.metadata.packageId = "single";
    expect((await processMockWebhook({admin, data:bad})).body.status).toBe("rejected");
    expect(admin.values.has("mockPurchases/ref-1")).toBe(false);
    const another = fakeAdmin(mockOrder());
    expect((await processMockWebhook({admin:another,data:{...signedPayload(),reference:"unknown"}})).body.reason).toBe("order_not_found");
  });
});
