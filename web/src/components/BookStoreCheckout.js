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
  async function refreshOrder() {
    if (!orderId || !key) return setError("This payment return link is incomplete. Contact Falowen with your Paystack receipt.");
    setBusy(true); setError("");
    try {
      const result = await request(`/books/order?order=${encodeURIComponent(orderId)}&key=${encodeURIComponent(key)}`);
      setOrder(result);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  useEffect(() => {
    if (!completed || !orderId || !key) return;
    let active = true;
    request(`/books/order?order=${encodeURIComponent(orderId)}&key=${encodeURIComponent(key)}`)
      .then(data => { if (active) setOrder(data); })
      .catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [completed, orderId, key]);
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
          <p><strong>Payment:</strong> {order.status === "paid" ? "Confirmed" : order.status === "rejected" ? "Needs review" : "Awaiting secure confirmation"}</p>
          {order.status === "paid" ? <p>Payment confirmed. Falowen will contact you regarding fulfilment. No download or print order has been issued automatically.</p> :
            <p>Returning from Paystack does not mean payment succeeded. If you have paid, check again once Paystack has confirmed the transaction.</p>}
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
              Payment uses Paystack. The book will not be sent or printed automatically; Falowen will arrange fulfilment separately.
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
