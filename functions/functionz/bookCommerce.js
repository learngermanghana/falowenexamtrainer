"use strict";

const { calculateSharedPaystackFee } = require("./paystackFeePolicy");

// Separate from enrolment and mock subscriptions. The paid PDF is never a public asset.
const BOOK = Object.freeze({
  id: "falowen-a1-grammar-workbook",
  level: "A1",
  title: "Falowen A1 Grammar Notes & Workbook",
  format: "PDF",
  pages: 250,
  priceGhs: 99,
  edition: "2026-10",
});
const STORAGE_KEY = "books/private/falowen-a1-grammar-workbook-v1.pdf";
const DOWNLOAD_FILENAME = "Falowen-A1-Grammar-Notes-and-Workbook.pdf";
const BOOK_CALLBACK_URL = "https://www.falowen.app/books/a1?payment=return";
const bookEntitlementId = (uid, productId = BOOK.id) => uid + "_" + productId;
const priceInPesewas = (amount) => Math.round(Number(amount) * 100);
const salesConfigured = (env = process.env) =>
  env.FALOWEN_BOOKS_SALES_ENABLED === "true" &&
  Boolean(env.FALOWEN_BOOKS_PRIVATE_BUCKET) &&
  Boolean(env.PAYSTACK_SECRET);

async function getBookFile(admin, env = process.env) {
  if (!salesConfigured(env)) return null;
  const file = admin.storage().bucket(env.FALOWEN_BOOKS_PRIVATE_BUCKET).file(STORAGE_KEY);
  const [exists] = await file.exists();
  return exists ? file : null;
}

async function isBookReady(admin, env = process.env) {
  try {
    return Boolean(await getBookFile(admin, env));
  } catch (error) {
    console.error("Falowen Books: private PDF availability check failed", error);
    return false;
  }
}

function publicBook(available) {
  return {
    ...BOOK,
    available: Boolean(available),
    checkoutEnabled: Boolean(available),
    paymentProvider: "Paystack",
    checkoutAmountGhs: calculateSharedPaystackFee(BOOK.priceGhs).checkoutAmount,
  };
}

function registerBookCommerceRoutes(app, { admin, getAuthedUser }) {
  const db = () => admin.firestore();

  async function verified(req, res) {
    const identity = await getAuthedUser(req);
    if (!identity) {
      res.status(401).json({ error: "Sign in to Falowen to buy or download your book." });
      return null;
    }
    return identity;
  }

  app.get("/books/catalog", async (_req, res) => {
    res.set("Cache-Control", "no-store");
    return res.json({ books: [publicBook(await isBookReady(admin))] });
  });

  app.get("/books/access", async (req, res) => {
    try {
      const identity = await verified(req, res);
      if (!identity) return;
      const snap = await db().collection("bookEntitlements").doc(bookEntitlementId(identity.uid)).get();
      res.set("Cache-Control", "private, no-store");
      return res.json({
        purchases: snap.exists && snap.data()?.status === "active"
          ? [{ productId: BOOK.id, title: BOOK.title, purchasedAtMs: snap.data().purchasedAtMs }]
          : [],
      });
    } catch (error) {
      console.error("Falowen Books access lookup failed", error);
      return res.status(503).json({ error: "We could not check your book purchases. Try again." });
    }
  });

  app.post("/books/checkout", async (req, res) => {
    try {
      const identity = await verified(req, res);
      if (!identity) return;
      if (req.body?.productId !== BOOK.id) {
        return res.status(400).json({ error: "Unknown book." });
      }
      if (!identity.email) {
        return res.status(400).json({ error: "Add an email address to your account first." });
      }
      // Never charge for a file that cannot be delivered.
      if (!await isBookReady(admin)) {
        return res.status(503).json({ error: "The A1 PDF is being prepared for secure delivery. No payment was taken." });
      }
      const owned = await db().collection("bookEntitlements").doc(bookEntitlementId(identity.uid)).get();
      if (owned.exists && owned.data()?.status === "active") {
        return res.status(409).json({ error: "You already own this book. Use Download from your library." });
      }
      const fee = calculateSharedPaystackFee(BOOK.priceGhs);
      const amount = priceInPesewas(fee.checkoutAmount);
      const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.PAYSTACK_SECRET,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: identity.email,
          amount,
          currency: "GHS",
          callback_url: BOOK_CALLBACK_URL,
          metadata: {
            productType: "book_pdf",
            productId: BOOK.id,
            uid: identity.uid,
            edition: BOOK.edition,
            priceGhs: BOOK.priceGhs,
          },
        }),
      });
      const result = await paystackResponse.json().catch(() => ({}));
      if (!paystackResponse.ok || result.status !== true ||
          !result.data?.reference || !result.data?.authorization_url) {
        return res.status(502).json({ error: "The payment gateway could not start checkout. No payment was taken." });
      }
      const reference = String(result.data.reference);
      await db().collection("bookOrders").doc(reference).create({
        uid: identity.uid,
        email: identity.email.toLowerCase(),
        productId: BOOK.id,
        edition: BOOK.edition,
        priceGhs: BOOK.priceGhs,
        checkoutPesewas: amount,
        status: "pending",
        reference,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return res.json({ reference, authorization_url: result.data.authorization_url });
    } catch (error) {
      console.error("Falowen Books checkout failed", error);
      return res.status(503).json({ error: "Could not prepare secure book checkout. Please try again." });
    }
  });

  // Only owners receive a five-minute signed GCS URL, never a public bucket URL.
  app.post("/books/download", async (req, res) => {
    try {
      const identity = await verified(req, res);
      if (!identity) return;
      const snap = await db().collection("bookEntitlements").doc(bookEntitlementId(identity.uid)).get();
      if (!snap.exists || snap.data()?.status !== "active") {
        return res.status(403).json({ error: "Please purchase the A1 workbook before downloading." });
      }
      const file = await getBookFile(admin);
      if (!file) {
        return res.status(503).json({ error: "Your book is temporarily unavailable. Your purchase remains saved." });
      }
      const [url] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 5 * 60 * 1000,
        responseDisposition: 'attachment; filename="' + DOWNLOAD_FILENAME + '"',
      });
      res.set("Cache-Control", "private, no-store");
      return res.json({ downloadUrl: url, expiresInSeconds: 300 });
    } catch (error) {
      console.error("Falowen Books private download failed", error);
      return res.status(503).json({ error: "Download could not start. Please retry from your library." });
    }
  });
}

// Call only after shared Paystack webhook HMAC verification, never from a callback.
async function processBookWebhook({ admin, data }) {
  const reference = String(data?.reference || "");
  if (!reference) return { status: 400, body: { error: "Missing payment reference" } };
  const db = admin.firestore();
  const orderRef = db.collection("bookOrders").doc(reference);
  const purchaseRef = db.collection("bookPurchases").doc(reference);
  return db.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);
    const purchaseSnap = await tx.get(purchaseRef);
    if (!orderSnap.exists) return { status: 202, body: { status: "rejected", reason: "order_not_found" } };
    const order = orderSnap.data();
    const entitlementRef = db.collection("bookEntitlements").doc(bookEntitlementId(order.uid));
    const entitlementSnap = await tx.get(entitlementRef);
    if (purchaseSnap.exists) return { status: 200, body: { status: "duplicate", reference } };
    const metadata = data?.metadata || {};
    const correct = metadata.productType === "book_pdf" &&
      metadata.productId === BOOK.id && metadata.uid === order.uid &&
      metadata.edition === BOOK.edition &&
      order.productId === BOOK.id && order.edition === BOOK.edition &&
      Number(order.priceGhs) === BOOK.priceGhs &&
      Number(order.checkoutPesewas) === priceInPesewas(calculateSharedPaystackFee(BOOK.priceGhs).checkoutAmount) &&
      Number(data?.amount) === order.checkoutPesewas &&
      String(data?.currency || "").toUpperCase() === "GHS" &&
      String(data?.status || "").toLowerCase() === "success" &&
      String(data?.customer?.email || "").toLowerCase() === order.email &&
      ["pending", "paid"].includes(order.status);
    if (!correct) {
      tx.update(orderRef, { status: "rejected", updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      return { status: 202, body: { status: "rejected", reason: "purchase_mismatch" } };
    }
    const purchasedAtMs = Date.now();
    tx.create(purchaseRef, {
      reference, uid: order.uid, email: order.email, productId: BOOK.id,
      edition: BOOK.edition, priceGhs: BOOK.priceGhs,
      status: "paid", purchasedAtMs,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // One perpetual edition entitlement: never touches tuition, trial, or mock subscriptions.
    if (!entitlementSnap.exists || entitlementSnap.data()?.status !== "active") {
      tx.set(entitlementRef, {
        uid: order.uid, productId: BOOK.id, edition: BOOK.edition,
        status: "active", purchasedAtMs, reference,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    tx.update(orderRef, { status: "paid", paidAtMs: purchasedAtMs });
    return { status: 200, body: { status: "synced", reference } };
  });
}

module.exports = {
  BOOK, STORAGE_KEY, salesConfigured, bookEntitlementId, publicBook,
  isBookReady, registerBookCommerceRoutes, processBookWebhook,
};
