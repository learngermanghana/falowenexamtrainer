const {
  BOOK, STORAGE_KEY, salesConfigured, bookEntitlementId,
  publicBook, isBookReady, processBookWebhook,
} = require("../bookCommerce");
const { calculateSharedPaystackFee } = require("../paystackFeePolicy");

function fakeAdmin(initial = {}) {
  const values = new Map(Object.entries(initial));
  const firestore = () => ({
    collection: (name) => ({ doc: (id) => ({ key: name + "/" + id }) }),
    runTransaction: async (work) => work({
      get: async ({ key }) => ({
        exists: values.has(key),
        data: () => values.get(key),
      }),
      create: ({ key }, value) => {
        if (values.has(key)) throw new Error("Duplicate " + key);
        values.set(key, value);
      },
      update: ({ key }, value) => values.set(key, { ...values.get(key), ...value }),
      set: ({ key }, value) => values.set(key, value),
    }),
  });
  firestore.FieldValue = { serverTimestamp: () => "server-time" };
  return { firestore, values };
}

const paidAmount = Math.round(calculateSharedPaystackFee(BOOK.priceGhs).checkoutAmount * 100);
const order = () => ({
  uid: "buyer-1", email: "buyer@example.com",
  productId: BOOK.id, edition: BOOK.edition, priceGhs: 99,
  checkoutPesewas: paidAmount, reference: "pay-1", status: "pending",
});
const webhook = () => ({
  reference: "pay-1", status: "success", amount: paidAmount, currency: "GHS",
  customer: { email: "buyer@example.com" },
  metadata: { productType: "book_pdf", productId: BOOK.id, uid: "buyer-1", edition: BOOK.edition },
});

describe("Falowen A1 book product", () => {
  test("has exactly one private 250-page A1 title and GH₵99 server-side price", () => {
    expect(BOOK).toMatchObject({ id: "falowen-a1-grammar-workbook", pages: 250, level: "A1", priceGhs: 99 });
    expect(STORAGE_KEY).toMatch(/^books\/private\//);
    expect(bookEntitlementId("buyer-1")).toBe("buyer-1_" + BOOK.id);
    expect(publicBook(false)).toMatchObject({ available: false, checkoutEnabled: false });
    expect(publicBook(true).checkoutAmountGhs).toBeGreaterThan(BOOK.priceGhs);
    expect(publicBook(true)).not.toHaveProperty("storageKey");
  });

  test("sales are disabled without explicit flag, private R2 bucket and Paystack secret", () => {
    const r2 = {
      R2_ACCOUNT_ID: "a".repeat(32), R2_ACCESS_KEY_ID: "key",
      R2_SECRET_ACCESS_KEY: "secret", R2_BOOKS_BUCKET: "falowen-books-private",
    };
    expect(salesConfigured({ PAYSTACK_SECRET: "secret", ...r2 })).toBe(false);
    expect(salesConfigured({ FALOWEN_BOOKS_SALES_ENABLED: "true", PAYSTACK_SECRET: "secret" })).toBe(false);
    expect(salesConfigured({ FALOWEN_BOOKS_SALES_ENABLED: "true", PAYSTACK_SECRET: "secret", ...r2 })).toBe(true);
  });

  test("even a configured product stays unavailable until HEAD confirms its private PDF exists", async () => {
    const env = {
      FALOWEN_BOOKS_SALES_ENABLED: "true", PAYSTACK_SECRET: "secret",
      R2_ACCOUNT_ID: "a".repeat(32), R2_ACCESS_KEY_ID: "key",
      R2_SECRET_ACCESS_KEY: "secret", R2_BOOKS_BUCKET: "falowen-books-private",
    };
    const oldFetch = global.fetch;
    global.fetch = jest.fn(async () => ({ ok: false, status: 404 }));
    try {
      expect(await isBookReady(null, env)).toBe(false);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch.mock.calls[0][1].method).toBe("HEAD");
    } finally { global.fetch = oldFetch; }
  });
});

describe("Falowen Books Paystack purchase authorization", () => {
  test("only a verified order can add one isolated book entitlement", async () => {
    const admin = fakeAdmin({ "bookOrders/pay-1": order() });
    const result = await processBookWebhook({ admin, data: webhook() });
    expect(result.body.status).toBe("synced");
    expect(admin.values.get("bookOrders/pay-1").status).toBe("paid");
    expect(admin.values.get("bookPurchases/pay-1")).toMatchObject({
      uid: "buyer-1", productId: BOOK.id, status: "paid", priceGhs: 99,
    });
    expect(admin.values.get("bookEntitlements/buyer-1_" + BOOK.id)).toMatchObject({
      uid: "buyer-1", productId: BOOK.id, status: "active",
    });
    expect([...admin.values.keys()].every(key => key.startsWith("book"))).toBe(true);
  });

  test("replayed event does not duplicate a purchase", async () => {
    const admin = fakeAdmin({ "bookOrders/pay-1": order() });
    await processBookWebhook({ admin, data: webhook() });
    const again = await processBookWebhook({ admin, data: webhook() });
    expect(again.body.status).toBe("duplicate");
    expect(admin.values.size).toBe(3);
  });

  test.each([
    ["amount", { amount: paidAmount - 100 }],
    ["currency", { currency: "USD" }],
    ["status", { status: "failed" }],
    ["email", { customer: { email: "other@example.com" } }],
    ["product", { metadata: { ...webhook().metadata, productId: "a2" } }],
    ["uid", { metadata: { ...webhook().metadata, uid: "other-buyer" } }],
    ["edition", { metadata: { ...webhook().metadata, edition: "2027-01" } }],
  ])("rejects a forged or mismatched %s", async (_label, patch) => {
    const admin = fakeAdmin({ "bookOrders/pay-1": order() });
    const result = await processBookWebhook({ admin, data: { ...webhook(), ...patch } });
    expect(result.body).toMatchObject({ status: "rejected", reason: "purchase_mismatch" });
    expect(admin.values.has("bookEntitlements/buyer-1_" + BOOK.id)).toBe(false);
  });

  test("existing paid-book access remains active on accidental second purchase", async () => {
    const entitlementKey = "bookEntitlements/buyer-1_" + BOOK.id;
    const admin = fakeAdmin({
      "bookOrders/pay-1": order(),
      [entitlementKey]: { uid: "buyer-1", status: "active", reference: "older-payment", purchasedAtMs: 1 },
    });
    await processBookWebhook({ admin, data: webhook() });
    expect(admin.values.get(entitlementKey).reference).toBe("older-payment");
    expect(admin.values.get("bookPurchases/pay-1").status).toBe("paid");
  });

  test("missing order cannot issue a book or change any student record", async () => {
    const admin = fakeAdmin();
    const result = await processBookWebhook({ admin, data: webhook() });
    expect(result.body.reason).toBe("order_not_found");
    expect(admin.values.size).toBe(0);
  });
});
