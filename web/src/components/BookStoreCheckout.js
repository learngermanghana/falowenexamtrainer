import React, { useEffect, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";

const API = getBackendUrl();
const money = value => `GH₵${Number(value || 0).toFixed(2)}`;
const styles = {
  page: { minHeight: "100vh", background: "#f5f7fa", padding: "30px 16px", color: "#14243a", fontFamily: "inherit" },
  wrap: { maxWidth: 820, margin: "0 auto" },
  card: { padding: 24, borderRadius: 16, border: "1px solid #dfe7ef", background: "#fff", marginBottom: 16, boxShadow: "0 8px 25px rgba(15,23,42,.04)" },
  input: { display: "block", width: "100%", padding: "12px", border: "1px solid #a9b9c9", borderRadius: 8, marginTop: 6, boxSizing: "border-box", font: "inherit" },
  button: { background: "#146c65", color: "#fff", border: 0, padding: "14px 22px", borderRadius: 10, fontWeight: 750, font: "inherit", cursor: "pointer" },
};
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options, headers: { ...(options.body ? { "Content-Type": "application/json" } : {}) },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Could not load book payments.");
  return result;
}

export default function BookStoreCheckout({ completed = false }) {
  const [books, setBooks] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [bookId, setBookId] = useState("a1-printed");
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState(null);
  const params = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const orderId = params.get("order");
  const key = params.get("key");
  useEffect(() => {
    if (completed) return;
    let active = true;
    request("/books/catalog").then(data => {
      if (!active) return;
      setBooks(data.books || []);
      setEnabled(Boolean(data.paymentsEnabled));
    }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [completed]);
  const orderLookup = `/books/order?order=${encodeURIComponent(orderId || "")}&key=${encodeURIComponent(key || "")}`;
  async function refreshOrder() {
    if (!orderId || !key) return setError("This payment return link is incomplete. Keep your Paystack receipt and contact Falowen.");
    setBusy(true); setError("");
    try {
      await request("/books/verify", { method: "POST", body: JSON.stringify({ order: orderId, key }) });
      setOrder(await request(orderLookup));
    } catch (e) {
      // The saved order may still have been paid by the signed webhook.
      try { setOrder(await request(orderLookup)); } catch (_) { /* keep the first error */ }
      setError(e.message);
    } finally { setBusy(false); }
  }
  useEffect(() => {
    if (!completed || !orderId || !key) return;
    let active = true;
    // Paystack recommends server-side transaction verification on return.
    request("/books/verify", { method: "POST", body: JSON.stringify({ order: orderId, key }) })
      .catch(() => null)
      .then(() => request(orderLookup))
      .then(data => { if (active) setOrder(data); })
      .catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [completed, orderId, key]);
  const copyReceipt = async () => {
    if (!order || !navigator.clipboard?.writeText) {
      setError("Copy is unavailable on this device. You can select the order and Paystack reference displayed above.");
      return;
    }
    try {
      await navigator.clipboard.writeText([
        "Falowen A1 book payment details",
        `Book: ${order.title}`,
        `Edition: ${order.format}`,
        `Order: ${order.orderId}`,
        `Paystack reference: ${order.reference}`,
        `Amount: ${money(order.priceGhs)}`,
        `Status: ${order.status === "paid" ? "Verified by Falowen" : "Not yet verified"}`,
      ].join("\n"));
    } catch (_) { setError("Could not copy the details. You can select the Paystack reference displayed above."); }
  };
  const selected = books.find(b => b.id === bookId);
  const buy = async e => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const data = await request("/books/checkout", { method: "POST", body: JSON.stringify({ bookId, ...customer }) });
      const url = new URL(data.authorization_url);
      if (url.protocol !== "https:" || !["checkout.paystack.com", "paystack.com"].includes(url.hostname)) {
        throw new Error("Unexpected payment page. Please contact Falowen.");
      }
      window.location.assign(url.toString());
    } catch (e) { setError(e.message); setBusy(false); }
  };
  return <main style={styles.page}>
    <div style={styles.wrap}>
      <a href="/" style={{ color: "#146c65", textDecoration: "none", fontWeight: 650 }}>← Falowen</a>
      <div style={{ padding: "20px 0 16px" }}>
        <span style={{ fontSize: 12, letterSpacing: 1.5, color: "#146c65", fontWeight: 800 }}>FALOWEN BOOKS</span>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 38px)", margin: "8px 0" }}>
          {completed ? "A1 book payment confirmation" : "Deutsch A1 – Course & Workbook"}
        </h1>
        <p style={{ color: "#526378", margin: 0 }}>
          {completed ? "Payment is confirmed only after Paystack notifies Falowen." : "Choose the digital edition or a printed copy. Printed books are made to order."}
        </p>
      </div>
      {completed ? <section style={styles.card} aria-live="polite">
        {!order && !error ? <p>Checking your order…</p> : null}
        {order && <><h2 style={{ marginTop: 0 }}>{order.title}</h2>
          <p><strong>Order:</strong> {order.orderId}</p>
          <p><strong>Price:</strong> {money(order.priceGhs)}</p>
          <p><strong>Paystack transaction reference:</strong> <code style={{ overflowWrap: "anywhere" }}>{order.reference}</code></p>
          <p><strong>Payment:</strong> {order.status === "paid" ? "Verified with Paystack" : order.status === "rejected" ? "Needs manual review" : "Awaiting Paystack confirmation"}</p>
          {order.status === "paid" ? <div>
            <p>Payment verified. Save your Paystack email receipt and this reference for your records.</p>
            <p>{order.format === "printed"
              ? "Your printed copy will be arranged manually; delivery is charged separately."
              : "Falowen will arrange your digital PDF manually. There is no automatic download yet."}</p>
            <p>For delivery or access enquiries, provide the Paystack reference shown above so the payment can be matched in the Paystack Dashboard.</p>
          </div> :
            <p>Returning from Paystack does not mean payment succeeded. If money has been deducted, do not pay a second time. Keep your Paystack receipt and check again shortly.</p>}
          <button type="button" style={{ ...styles.button, marginRight: 10, marginBottom: 10, background: "#334155" }} onClick={copyReceipt}>Copy order and receipt details</button>
        </>}
        {error ? <p role="alert" style={{ color: "#ae2525" }}>{error}</p> : null}
        <button type="button" style={styles.button} disabled={busy} onClick={refreshOrder}>{busy ? "Checking…" : "Check payment status"}</button>
      </section> : <>
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Choose your edition</h2>
          {books.length ? books.map(book => <label key={book.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: 15, marginTop: 10, borderRadius: 10, cursor: "pointer", border: bookId === book.id ? "2px solid #146c65" : "1px solid #cbd7df" }}>
            <input type="radio" name="edition" checked={bookId === book.id} onChange={() => setBookId(book.id)} />
            <span style={{ flex: 1 }}><strong>{book.format === "printed" ? "Printed book" : "Digital PDF"}</strong>
              <small style={{ display: "block", color: "#66788a", marginTop: 4 }}>{book.format === "printed" ? "Printed on demand; delivery charged separately" : "Digital access arranged after payment confirmation"}</small>
            </span>
            <strong>{money(book.priceGhs)}</strong>
          </label>) : <p>Loading available editions…</p>}
        </section>
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Payment details</h2>
          <p style={{ color: "#526378" }}>Your contact details are used to confirm your purchase and arrange delivery or digital access.</p>
          <form onSubmit={buy}>
            {[
              ["name", "Full name", "text"],
              ["email", "Email address", "email"],
              ["phone", "Phone / WhatsApp number", "tel"],
            ].map(([id, label, type]) => <label key={id} style={{ display: "block", margin: "12px 0", fontWeight: 650 }}>
              {label}<input style={styles.input} type={type} required value={customer[id]}
                onChange={e => setCustomer(prev => ({ ...prev, [id]: e.target.value }))} />
            </label>)}
            {selected && <p style={{ padding: "12px 0", fontWeight: 750 }}>Book price: {money(selected.priceGhs)} {selected.format === "printed" ? "· Delivery not included" : ""}</p>}
            <p style={{ color: "#637486", fontSize: 13 }}>
              Paystack will process your payment securely. Keep the Paystack receipt and transaction reference; Falowen will arrange the book manually after verification. Delivery for printed orders is charged separately.
            </p>
            {error ? <p role="alert" style={{ color: "#ae2525" }}>{error}</p> : null}
            <button type="submit" style={{ ...styles.button, opacity: !enabled || !selected || busy ? .55 : 1, cursor: !enabled ? "not-allowed" : "pointer" }}
              disabled={!enabled || !selected || busy}>
              {!enabled ? "Book payments opening soon" : busy ? "Opening Paystack…" : `Pay securely · ${money(selected.priceGhs)}`}
            </button>
          </form>
        </section>
      </>}
    </div>
  </main>;
}
