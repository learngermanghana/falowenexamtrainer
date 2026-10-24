"use strict";
const crypto = require("crypto");

const BOOKS = Object.freeze({
  "a1-digital": Object.freeze({ id: "a1-digital", title: "Falowen Deutsch A1 – Digital Course & Workbook", format: "digital", priceGhs: 99 }),
  "a1-printed": Object.freeze({ id: "a1-printed", title: "Falowen Deutsch A1 – Printed Course & Workbook", format: "printed", priceGhs: 800 }),
});
const CALLBACK_ORIGIN = "https://www.falowen.app";
const allowedEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const moneyToPesewas = amount => Math.round(Number(amount) * 100);
const paymentsEnabled = () => process.env.FALOWEN_BOOK_PAYMENTS_ENABLED === "true";
const sha256 = value => crypto.createHash("sha256").update(value).digest("hex");

function registerBookCommerceRoutes(app, { admin }) {
  const db = () => admin.firestore();
  app.get("/books/catalog", (_req, res) => {
    res.set("Cache-Control", "no-store");
    return res.json({
      books: Object.values(BOOKS).map(({ id, title, format, priceGhs }) => ({
        id, title, format, priceGhs, deliveryIncluded: false,
        checkoutTotalGhs: priceGhs,
      })),
      paymentsEnabled: paymentsEnabled(),
    });
  });

  // Public checkout: customers do not need to be Falowen students.
  // Fulfilment and automatic PDF access will be introduced in a later phase.
  app.post("/books/checkout", async (req, res) => {
    if (!paymentsEnabled()) return res.status(503).json({ error: "Book payments are not open yet." });
    try {
      const requestedBookId = String(req.body?.bookId || "");
      const book = Object.prototype.hasOwnProperty.call(BOOKS, requestedBookId)
        ? BOOKS[requestedBookId] : null;
      const name = String(req.body?.name || "").trim().replace(/\s+/g, " ");
      const email = String(req.body?.email || "").trim().toLowerCase();
      const phone = String(req.body?.phone || "").trim();
      if (!book) return res.status(400).json({ error: "Choose a valid book." });
      if (name.length < 3 || name.length > 120 || email.length > 254 || !allowedEmail.test(email)
        || !/^\+?[0-9\s()-]{8,25}$/.test(phone)) {
        return res.status(400).json({ error: "Enter a valid name, email, and contact number." });
      }
      const secret = process.env.PAYSTACK_SECRET;
      if (!secret) return res.status(503).json({ error: "Payment service is unavailable." });

      const orderId = crypto.randomUUID();
      const lookupKey = crypto.randomBytes(24).toString("hex");
      // Books use an all-in sticker price; Falowen absorbs the gateway fee.
      const checkoutPesewas = moneyToPesewas(book.priceGhs);
      const callback = new URL("/books/complete", CALLBACK_ORIGIN);
      callback.searchParams.set("order", orderId);
      callback.searchParams.set("key", lookupKey);
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          email, currency: "GHS", amount: checkoutPesewas, callback_url: callback.toString(),
          metadata: {
            productType: "falowen_book", orderId, bookId: book.id, priceGhs: book.priceGhs,
            format: book.format,
          }
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.status || !payload.data?.reference || !payload.data?.authorization_url) {
        return res.status(502).json({ error: "Paystack could not start checkout." });
      }
      const paymentUrl = new URL(payload.data.authorization_url);
      if (paymentUrl.protocol !== "https:" || !["checkout.paystack.com", "paystack.com"].includes(paymentUrl.hostname)) {
        return res.status(502).json({ error: "Unexpected payment gateway." });
      }
      await db().collection("bookOrders").doc(orderId).create({
        id: orderId, reference: String(payload.data.reference), bookId: book.id, title: book.title,
        format: book.format, email, name, phone,
        priceGhs: book.priceGhs, checkoutPesewas, lookupKeyHash: sha256(lookupKey),
        status: "pending", fulfilmentStatus: "not_started",
        deliveryIncluded: false, createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.set("Cache-Control", "no-store");
      return res.json({ authorization_url: paymentUrl.toString(), orderId });
    } catch (error) {
      console.error("Book checkout error", error);
      return res.status(500).json({ error: "Unable to start the book checkout." });
    }
  });

  app.get("/books/order", async (req, res) => {
    res.set("Cache-Control", "private, no-store");
    const id = String(req.query?.order || "");
    const key = String(req.query?.key || "");
    if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[0-9a-f]{48}$/i.test(key)) {
      return res.status(400).json({ error: "Invalid order link." });
    }
    try {
      const snap = await db().collection("bookOrders").doc(id).get();
      if (!snap.exists) return res.status(404).json({ error: "Order not found." });
      const order = snap.data();
      if (!order.lookupKeyHash || !crypto.timingSafeEqual(
        Buffer.from(order.lookupKeyHash, "hex"), Buffer.from(sha256(key), "hex")
      )) return res.status(403).json({ error: "Invalid order link." });
      return res.json({
        orderId: id, title: order.title, format: order.format, priceGhs: order.priceGhs,
        status: order.status === "paid" ? "paid" : order.status === "rejected" ? "rejected" : "pending",
        deliveryIncluded: false,
      });
    } catch (error) {
      console.error("Book order status error", error);
      return res.status(503).json({ error: "Order status is temporarily unavailable." });
    }
  });
}

// This is called only from the existing SHA-512 signed Paystack webhook route.
async function processBookWebhook({ admin, data }) {
  const metadata = data?.metadata || {};
  const orderId = String(metadata.orderId || "");
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) {
    return { status: 202, body: { status: "rejected", reason: "bad_order_id" } };
  }
  const db = admin.firestore();
  const ref = db.collection("bookOrders").doc(orderId);
  const receiptRef = db.collection("bookPayments").doc(orderId);
  return db.runTransaction(async tx => {
    const orderSnap = await tx.get(ref);
    const receiptSnap = await tx.get(receiptRef);
    if (!orderSnap.exists) return { status: 202, body: { status: "rejected", reason: "order_not_found" } };
    const order = orderSnap.data();
    if (receiptSnap.exists) return { status: 200, body: { status: "duplicate" } };
    const matches = metadata.productType === "falowen_book"
      && metadata.orderId === order.id && metadata.bookId === order.bookId
      && Number(metadata.priceGhs) === order.priceGhs
      && String(metadata.format) === order.format
      && String(data.reference || "") === order.reference
      && Number(data.amount) === order.checkoutPesewas
      && String(data.currency || "").toUpperCase() === "GHS"
      && String(data.status || "").toLowerCase() === "success"
      && String(data.customer?.email || "").toLowerCase() === order.email;
    if (!matches) {
      tx.update(ref, { status: "rejected", updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      return { status: 202, body: { status: "rejected", reason: "payment_mismatch" } };
    }
    const paidAt = admin.firestore.FieldValue.serverTimestamp();
    tx.create(receiptRef, {
      orderId, bookId: order.bookId, reference: order.reference, amountGhs: order.priceGhs,
      checkoutPesewas: order.checkoutPesewas, status: "paid", paidAt,
    });
    tx.update(ref, { status: "paid", paidAt, fulfilmentStatus: "not_started" });
    return { status: 200, body: { status: "synced", orderId } };
  });
}

module.exports = { BOOKS, registerBookCommerceRoutes, processBookWebhook };
