import React, { useMemo, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";
import { indicativeUsd } from "./BooksCatalog";
import { clampBookQuantity, pricedCartLines, readBookCart, saveBookCart } from "../utils/bookCart";
import "./BookShoppingCart.css";

const ghs = value => "GH₵" + Number(value || 0).toFixed(2);
const API = getBackendUrl();

export default function BookShoppingCart({ books = [], paymentsEnabled = false, fxQuote }) {
  const [cart, setCart] = useState(readBookCart);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lines = useMemo(() => pricedCartLines(cart, books), [cart, books]);
  const total = lines.reduce((sum, line) => sum + line.lineTotalGhs, 0);
  const hasUnavailable = lines.some(line => line.missing);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const change = next => setCart(saveBookCart(next));

  async function checkout(event) {
    event.preventDefault();
    setError("");
    if (!cart.length || hasUnavailable || !paymentsEnabled) return;
    setBusy(true);
    try {
      const response = await fetch(API + "/books/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map(({ bookId, quantity }) => ({ bookId, quantity })),
          ...customer,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw Error(result.error || "Checkout is temporarily unavailable.");
      const url = new URL(result.authorization_url);
      if (url.protocol !== "https:" || !["checkout.paystack.com", "paystack.com"].includes(url.hostname))
        throw Error("Unexpected payment page.");
      window.location.assign(url.toString());
    } catch (e) { setError(e.message); setBusy(false); }
  }

  return <div className="fb-shell fb-cart-shell">
    <nav className="fb-breadcrumb" aria-label="Breadcrumb"><a href="/">Falowen</a><span>/</span><a href="/books">Books</a><span>/</span><strong>Cart</strong></nav>
    <div className="fb-cart-heading"><div><p className="fb-eyebrow">FALOWEN BOOKS</p><h1>Your shopping cart</h1>
      <p>Choose editions and quantities before paying securely in Ghana cedis.</p></div>
      <a href="/books" className="fb-btn fb-btn-soft">Continue browsing books</a>
    </div>
    {!cart.length ? <div className="fb-cart-empty"><h2>Your cart is empty</h2>
      <p>Explore the Falowen book library and add a digital or printed edition.</p>
      <a href="/books" className="fb-btn fb-btn-primary">Browse all books</a></div> :
    <div className="fb-cart-layout">
      <section className="fb-cart-lines" aria-label="Books in your cart">
        <h2>{count} {count === 1 ? "copy" : "copies"} selected</h2>
        {lines.map(line => <article className="fb-cart-line" key={line.bookId}>
          <div><h3>{line.book?.title || line.bookId}</h3>
            <p>{line.book?.format === "printed" ? "Printed on demand" : "Digital PDF"}</p>
            {line.missing ? <p role="alert" className="fb-error">This edition is not available; remove it to continue.</p> : null}
          </div>
          <div className="fb-cart-line-controls">
            <label>Copies <input aria-label={`Copies of ${line.book?.title || line.bookId}`}
              type="number" min="1" max={line.book?.format === "digital" ? "1" : "10"}
              value={line.quantity} onChange={event => {
                const q = clampBookQuantity(event.target.value, line.book?.format);
                change(cart.map(item => item.bookId === line.bookId ? { ...item, quantity: q } : item));
              }} disabled={line.book?.format === "digital"}/></label>
            <strong>{line.book ? ghs(line.lineTotalGhs) : "Unavailable"}</strong>
            <button type="button" onClick={() => change(cart.filter(item => item.bookId !== line.bookId))}>Remove</button>
          </div>
        </article>)}
        <p className="fb-cart-note">Printed editions are produced after verified payment. Delivery and packaging costs are quoted separately; they are not included in the cart total. Digital editions are supplied manually.</p>
      </section>
      <aside className="fb-cart-checkout">
        <h2>Order summary</h2>
        <p className="fb-cart-subtotal"><span>Books subtotal</span><strong>{ghs(total)}</strong></p>
        {indicativeUsd(total, fxQuote) ? <p className="fb-cart-usd">{indicativeUsd(total, fxQuote)} · estimate only</p> : null}
        <p className="fb-cart-note">Paystack charges in GHS. The server rechecks prices, quantities and available editions before creating a payment.</p>
        <form className="fb-form" onSubmit={checkout}>
          <p className="fb-form-title">Your contact details</p>
          {[["name","Full name","text","Your full name"],["email","Email address","email","you@example.com"],
            ["phone","Phone / WhatsApp","tel","+233 ..."]].map(([id,label,type,placeholder]) =>
            <label key={id}>{label}<input required type={type} placeholder={placeholder}
              autoComplete={id === "name" ? "name" : id === "email" ? "email" : "tel"}
              value={customer[id]} onChange={event => setCustomer(prev => ({...prev,[id]:event.target.value}))}/></label>)}
          {error ? <p className="fb-error" role="alert">{error}</p> : null}
          <button type="submit" className="fb-btn fb-btn-primary fb-pay"
            disabled={busy || hasUnavailable || !paymentsEnabled || !total}>
            {busy ? "Opening secure payment…" : !paymentsEnabled ? "Checkout temporarily unavailable" :
              "Checkout " + ghs(total)}</button>
        </form>
        <p className="fb-cart-note">Keep your Paystack receipt. Falowen verifies payment before printing or supplying the book.</p>
      </aside>
    </div>}
  </div>;
}
