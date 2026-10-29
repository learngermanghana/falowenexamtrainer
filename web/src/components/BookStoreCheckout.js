import React, { useEffect, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";
import BooksCatalog from "./BooksCatalog";
import BookProductPage from "./BookProductPage";
import "./BookStoreCheckout.css";
const API = getBackendUrl();
const money = value => `GH₵${Number(value || 0).toFixed(2)}`;
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options, headers: { ...(options.body ? { "Content-Type": "application/json" } : {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Book payments are temporarily unavailable.");
  return payload;
}
function ReceiptConfirmation({ basePath = "/books" }) {
  const query = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const orderId = query.get("order"), key = query.get("key");
  const [order, setOrder] = useState(null), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState(false);
  const lookup = `/books/order?order=${encodeURIComponent(orderId || "")}&key=${encodeURIComponent(key || "")}`;
  async function refresh() {
    if (!orderId || !key) { setError("The order link is incomplete. Keep your Paystack receipt for assistance."); return; }
    setBusy(true); setError("");
    try {
      await request("/books/verify", { method: "POST", body: JSON.stringify({ order: orderId, key }) });
    } catch (e) { setError(e.message); }
    try { setOrder(await request(lookup)); } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  useEffect(() => { void refresh(); /* one verification on return */ }, [orderId, key]);
  const openPaidPdf = async bookId => {
    if (!orderId || !key || !bookId) return;
    setDownloadBusy(true); setError("");
    try {
      const result = await request("/books/download",{
        method:"POST",
        body:JSON.stringify({order:orderId,key,bookId}),
      });
      const url = new URL(result.url);
      if (url.protocol !== "https:" || !url.hostname.endsWith(".r2.cloudflarestorage.com") ||
          !url.hostname.startsWith("falowen-books-private.")) throw Error("Unexpected download destination.");
      window.location.assign(url.toString());
    } catch (e) { setError(e.message); }
    finally { setDownloadBusy(false); }
  };
  const copyReceipt = async () => {
    if (!order || !navigator.clipboard?.writeText) return setError("Please select the receipt reference displayed below.");
    try {
      await navigator.clipboard.writeText([
        "Falowen Books payment details", `Book: ${order.title}`,
        `Edition: ${order.format}`, `Order: ${order.orderId}`,
        `Paystack reference: ${order.reference}`,
        `Amount: ${money(order.priceGhs)}`,
        `Status: ${order.status === "paid" ? "Verified by Falowen" : "Not yet verified"}`
      ].join("\n"));
    } catch (_) { setError("Copy failed. You can select the reference displayed below."); }
  };
  return <main className="fb-page fb-receipt-page"><div className="fb-receipt-wrap">
    <a className="fb-top-back" href={basePath}>← Back to Books</a>
    <div className="fb-receipt-card">
      <span className="fb-eyebrow">FALOWEN · SECURE ORDER</span>
      <h1>Book payment confirmation</h1>
      <p>A return from Paystack is not proof of payment. Only verified transactions are marked paid.</p>
      {order ? <div className="fb-receipt-detail" aria-live="polite">
        <div className={"fb-payment-state " + (order.status === "paid" ? "is-paid" : "")}>
          {order.status === "paid" ? "✓ Payment verified with Paystack" : order.status === "rejected" ? "Payment needs review" : "Awaiting secure confirmation"}
        </div>
        <dl>
          <dt>Book</dt><dd>{order.title}</dd>
          <dt>Order ID</dt><dd><code>{order.orderId}</code></dd>
          <dt>Paystack reference</dt><dd><code>{order.reference}</code></dd>
          <dt>Quantity</dt><dd>{order.quantity || 1}</dd>
          <dt>Amount</dt><dd><strong>{money(order.priceGhs)}</strong></dd>
        </dl>
        <p>{order.status === "paid"
          ? order.format === "printed" ? "Falowen will arrange printing manually. Delivery costs are separate." : order.downloadableBookIds?.length ? "Your private PDF download is available below for this verified purchase." : "Falowen will arrange the PDF manually. No automatic download is issued."
          : "If you have been charged, do not pay a second time. Retain your Paystack receipt and check again."}</p>
        {order.status === "paid" && Array.isArray(order.downloadableBookIds)
          ? order.downloadableBookIds.map(id =>
            <button key={id} type="button" className="fb-btn fb-btn-primary" disabled={downloadBusy}
              onClick={() => openPaidPdf(id)}>
              {downloadBusy ? "Preparing your private PDF…" : "Download purchased PDF"}
            </button>)
          : null}
        <button type="button" className="fb-btn fb-btn-ghost" onClick={copyReceipt}>Copy receipt details</button>
      </div> : null}
      {error ? <p className="fb-error" role="alert">{error}</p> : null}
      <button type="button" className="fb-btn fb-btn-primary" disabled={busy} onClick={refresh}>
        {busy ? "Checking with Paystack…" : "Check payment status"}
      </button>
    </div>
  </div></main>;
}


export default function BookStoreCheckout({ completed = false, catalogOnly = false, detailBook = "a1", slug, checkout = false, campus = false }) {
  const basePath = campus ? "/campus/books" : "/books";
  if (completed) return <ReceiptConfirmation basePath={basePath} />;
  if (!catalogOnly) return <BookProductPage slug={slug || (detailBook === "writing"
    ? "how-to-unlock-your-german-writing-skills-a1-c2" : "deutsch-a1-course-workbook")} checkout={checkout} basePath={basePath} />;
  return <BookCataloguePage basePath={basePath} />;
}
function BookCataloguePage({ basePath = "/books" }) {
  const [catalog, setCatalog] = useState({});
  const [fxQuote, setFxQuote] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const previous = document.title;
    document.title = "German Books — Workbooks and Exam Guides | Falowen";
    const existing = document.head.querySelector('link[rel="canonical"]');
    const canonical = existing || document.createElement("link"), old = existing?.getAttribute("href");
    canonical.rel = "canonical"; canonical.href = "https://www.falowen.app/books";
    if (!existing) document.head.appendChild(canonical);
    return () => { document.title = previous; if (!existing) canonical.remove(); else if(old === null) canonical.removeAttribute("href"); else canonical.setAttribute("href",old); };
  }, []);
  useEffect(() => {
    let active = true;
    request("/books/catalog").then(data => { if(active) setCatalog(data); }).catch(e => {if(active) setError(e.message);});
    request("/fx/usd-ghs").then(data => {if(active) setFxQuote(data);}).catch(()=>{});
    return () => {active=false;};
  }, []);
  return <main className="fb-page"><div className="fb-shell">
    {basePath === "/books" ? <a className="fb-top-back" href="/">← Back to Falowen</a> : <a className="fb-top-back" href="/campus/course">← Back to Campus</a>}
    <BooksCatalog books={catalog.books} catalogTitles={catalog.catalogTitles} fxQuote={fxQuote} basePath={basePath} />
    {error && <p className="fb-error" role="alert">{error}</p>}
  </div></main>;
}
