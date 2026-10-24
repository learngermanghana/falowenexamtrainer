import React, { useEffect, useState } from "react";
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { getBackendUrl } from "../services/backendUrl";
import { updatePageMeta } from "../lib/pageMeta";
import LegalFooter from "./LegalFooter";
import "./FalowenBooksPage.css";

const FALLBACK_BOOK = {
  id: "falowen-a1-grammar-workbook",
  title: "Falowen A1 Grammar Notes & Workbook",
  level: "A1",
  priceGhs: 99,
  pages: 250,
  edition: "2026-10",
  format: "PDF",
  available: false,
};

const publicApi = async (path, { token, method = "GET", body } = {}) => {
  const res = await fetch(getBackendUrl() + path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.error || "Falowen Books is temporarily unavailable.");
  return payload;
};

function BookCover({ small = false }) {
  return <div className={"falowen-book-cover" + (small ? " falowen-book-cover-small" : "")} aria-label="Falowen A1 workbook cover illustration" role="img">
    <div className="falowen-cover-top">FALOWEN <span>2026 EDITION</span></div>
    <div className="falowen-cover-level">A1</div>
    <div className="falowen-cover-accent" />
    <div className="falowen-cover-title">Grammar<br />Notes &<br />Workbook</div>
    <div className="falowen-cover-de">Deutsch lernen.<br />Deutsch verstehen.</div>
    <div className="falowen-cover-bottom"><span>BEGINNER GERMAN</span><span>250 PAGES</span></div>
  </div>;
}

function Sample() {
  const [answer, setAnswer] = useState("");
  const options = ["Hallo!", "Guten Morgen, Frau Becker.", "Tschüss!"];
  return <div className="falowen-books-shell">
    <nav className="falowen-books-nav" aria-label="Books navigation"><a href="/books">← Falowen Books</a><a href="/books/a1">View A1 book</a></nav>
    <div className="falowen-books-sample">
      <span className="falowen-books-eyebrow">FREE INTERACTIVE SAMPLE · DAY 1</span>
      <h1>Basic Greetings, Goodbyes, and How You Are</h1>
      <p>Explore a short sample adapted from the opening grammar lesson. The full book contains structured Grammar Notes and Workbook exercises.</p>
      <section className="falowen-books-lesson">
        <h2>1. Formal and informal greetings</h2>
        <p>In German, greetings change depending on the situation and the person you are talking to.</p>
        <div className="falowen-books-greeting-grid">
          <div><h3>Formal</h3><p><strong>Guten Morgen</strong> — Good morning</p><p><strong>Guten Tag</strong> — Good day</p><p><strong>Guten Abend</strong> — Good evening</p><small>Polite, professional or first-time situations.</small></div>
          <div><h3>Informal</h3><p><strong>Hallo</strong> — Hello</p><p><strong>Hi</strong> — Hi</p><p><strong>Tschüss</strong> — Bye</p><small>Friends, classmates and peers.</small></div>
        </div>
      </section>
      <section className="falowen-books-lesson">
        <h2>2. Try a question</h2>
        <p><strong>You meet your teacher for the first time in the morning. Which greeting is best?</strong></p>
        <fieldset className="falowen-books-options">
          <legend className="falowen-books-screen-reader">Choose one greeting</legend>
          {options.map(option => <label key={option} className={answer === option ? "is-selected" : ""}>
            <input type="radio" name="greeting-answer" value={option} checked={answer === option} onChange={() => setAnswer(option)} />{option}
          </label>)}
        </fieldset>
        {answer && <p role="status" className={answer === options[1] ? "falowen-sample-correct" : "falowen-sample-try"}>{answer === options[1] ? "Correct! Use Guten Morgen and the formal title Frau." : "Try again. You are meeting a teacher for the first time."}</p>}
      </section>
      <div className="falowen-books-sample-cta">
        <div><h2>Continue with the full A1 workbook</h2><p>250 pages of grammar explanations and exercises for independent learning.</p></div>
        <a href="/books/a1" className="falowen-books-button primary">See the complete book →</a>
      </div>
    </div>
    <LegalFooter />
  </div>;
}

function AccountForm({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    setError(""); setWorking(true);
    try {
      if (!auth) throw new Error("Secure sign-in is not configured right now.");
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      }
      onSuccess?.();
    } catch (err) {
      setError(err?.code === "auth/email-already-in-use"
        ? "This email already has a Falowen account. Choose Sign in."
        : err?.code === "auth/invalid-credential"
          ? "Email or password not recognized. Please check your details."
          : err.message || "Could not sign in.");
    } finally { setWorking(false); }
  }
  return <form className="falowen-book-account" onSubmit={submit}>
    <h3>{mode === "login" ? "Sign in to purchase" : "Create a book buyer account"}</h3>
    <p>Use your existing Falowen login or create a free account just for books. Buying this PDF does not enrol you in a class.</p>
    <label>Email address<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
    <label>Password<input type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={mode === "register" ? 8 : undefined} required value={password} onChange={e => setPassword(e.target.value)} /></label>
    {error && <p role="alert" className="falowen-books-error">{error}</p>}
    <button className="falowen-books-button primary" type="submit" disabled={working}>{working ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
    <button className="falowen-books-link-button" type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "New to Falowen? Create an account" : "Already registered? Sign in"}</button>
  </form>;
}

export default function FalowenBooksPage({ mode = "catalog" }) {
  const { user } = useAuth();
  const [book, setBook] = useState(FALLBACK_BOOK);
  const [checking, setChecking] = useState(true);
  const [owned, setOwned] = useState(false);
  const [accessLoading, setAccessLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const isSample = mode === "sample";
  const isProduct = mode === "product";

  useEffect(() => {
    updatePageMeta({
      title: isSample ? "Free A1 German Grammar Sample | Falowen Books"
        : isProduct ? "A1 Grammar Notes & Workbook — 250 Pages | Falowen Books"
          : "Falowen Books | German Grammar Workbooks",
      description: isSample
        ? "Try a free sample from Falowen's beginner German A1 Grammar Notes and Workbook."
        : "Explore the Falowen A1 Grammar Notes & Workbook, a 250-page beginner German self-study PDF. Preview lesson activities and learn about secure digital access.",
      canonicalPath: isSample ? "/books/a1/sample" : isProduct ? "/books/a1" : "/books",
    });
  }, [isSample, isProduct]);

  useEffect(() => {
    if (isSample) return undefined;
    let mounted = true;
    publicApi("/books/catalog").then(data => {
      if (mounted) setBook(data.books?.find(item => item.id === FALLBACK_BOOK.id) || FALLBACK_BOOK);
    }).catch(() => {
      if (mounted) setError("We could not check book availability. Please try again later.");
    }).finally(() => { if (mounted) setChecking(false); });
    return () => { mounted = false; };
  }, [isSample]);

  useEffect(() => {
    if (!user || isSample) { setOwned(false); setAccessLoading(false); return undefined; }
    let mounted = true;
    setAccessLoading(true);
    user.getIdToken().then(token => publicApi("/books/access", { token }))
      .then(data => { if (mounted) setOwned(Boolean(data.purchases?.some(item => item.productId === FALLBACK_BOOK.id))); })
      .catch(() => { if (mounted) setError("Unable to check previous purchases. Please retry before paying."); })
      .finally(() => { if (mounted) setAccessLoading(false); });
    return () => { mounted = false; };
  }, [user, isSample]);

  async function reloadAccess() {
    if (!user) return;
    setError(""); setAccessLoading(true);
    try {
      const token = await user.getIdToken();
      const data = await publicApi("/books/access", { token });
      setOwned(Boolean(data.purchases?.some(item => item.productId === FALLBACK_BOOK.id)));
    } catch (err) { setError(err.message); }
    finally { setAccessLoading(false); }
  }

  async function checkout() {
    if (!user || !book.available || accessLoading || checking || working || error) return;
    setWorking(true); setError(""); setNotice("");
    try {
      const token = await user.getIdToken();
      const result = await publicApi("/books/checkout", {
        token, method: "POST", body: { productId: FALLBACK_BOOK.id },
      });
      const url = new URL(result.authorization_url);
      if (url.protocol !== "https:" || !["checkout.paystack.com", "paystack.com"].includes(url.hostname)) {
        throw new Error("Unexpected payment gateway destination.");
      }
      window.location.assign(url.toString());
    } catch (err) { setError(err.message); setWorking(false); }
  }

  async function download() {
    setWorking(true); setError("");
    try {
      const token = await user.getIdToken();
      const data = await publicApi("/books/download", { token, method: "POST" });
      const url = new URL(data.downloadUrl);
      if (url.protocol !== "https:" || !url.hostname.endsWith(".googleapis.com")) {
        throw new Error("Unexpected secure download address.");
      }
      window.location.assign(url.toString());
    } catch (err) { setError(err.message); }
    finally { setWorking(false); }
  }

  if (isSample) return <Sample />;

  const returned = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).get("payment") === "return";

  return <div className="falowen-books-shell">
    <nav className="falowen-books-nav" aria-label="Books navigation">
      <a href="/" className="falowen-books-logo"><span>F</span> Falowen Books</a>
      <div><a href="/books" aria-current={!isProduct ? "page" : undefined}>Books</a><a href="/classes">Live classes</a><a href="https://exams.falowen.app/">Exam practice</a></div>
    </nav>
    <main>
      <section className="falowen-books-hero">
        <div className="falowen-books-hero-copy">
          <span className="falowen-books-eyebrow">FALOWEN BOOKS · THE A1 COLLECTION</span>
          <h1>{isProduct ? "Your German journey starts on page one." : "A better way to begin German."}</h1>
          <p>Meet the Falowen A1 Grammar Notes & Workbook. Clear explanations, guided practice, and space to build confidence — from your first greeting to real conversations.</p>
          <div className="falowen-books-hero-actions">
            <a href="/books/a1/sample" className="falowen-books-button primary">Try a free sample →</a>
            <a href="/books/a1#purchase" className="falowen-books-button secondary">View the book</a>
          </div>
          <div className="falowen-books-hero-facts"><span>✓ 250 A4 pages</span><span>✓ Beginner-friendly</span><span>✓ Study at your own pace</span></div>
        </div>
        <div className="falowen-books-hero-art"><BookCover /><span className="falowen-books-cover-shadow" /></div>
      </section>

      <section className="falowen-books-feature-grid" aria-label="What's inside">
        <article><span className="falowen-books-feature-icon">Aa</span><h2>Grammar made clear</h2><p>Build simple, correct German sentences with examples and explanations.</p></article>
        <article><span className="falowen-books-feature-icon">✎</span><h2>Practice on paper</h2><p>Reinforce each topic through workbook tasks, reading and writing activities.</p></article>
        <article><span className="falowen-books-feature-icon">◎</span><h2>Everyday confidence</h2><p>Study greetings, introductions, numbers, family, hobbies and more.</p></article>
      </section>

      <section id="purchase" className="falowen-books-product-panel">
        <div className="falowen-books-product-details">
          <span className="falowen-books-eyebrow">FIRST EDITION · A1 BEGINNER</span>
          <h2>{book.title}</h2>
          <p>The complete printable A1 Grammar Notes & Workbook compiled from Falowen's beginner lessons. Designed for independent study or as a companion to class.</p>
          <ul>
            <li>Full {book.pages}-page digital PDF edition</li>
            <li>Grammar notes, workbook activities and writing practice</li>
            <li>One-time book purchase, not a monthly subscription</li>
            <li>Downloadable after confirmed payment when sales open</li>
          </ul>
          <p className="falowen-books-audio-note">Some audio QR activities lead to authenticated Falowen Course Book lessons. Standalone PDF purchase does not include a course membership or guarantee access to those recordings.</p>
          <a href="/books/a1/sample" className="falowen-books-preview-link">Explore the free sample lesson →</a>
        </div>
        <aside className="falowen-books-purchase" aria-label="A1 workbook purchase">
          <span className="falowen-books-status">{book.available ? "Digital edition available" : "Digital launch in preparation"}</span>
          <div className="falowen-books-price">GH₵{book.priceGhs}<span> one-time</span></div>
          {book.available && <p className="falowen-books-fee">Paystack total including Falowen's shared processing-fee policy: GH₵{book.checkoutAmountGhs}</p>}
          {returned && !owned && <p role="status" className="falowen-books-notice">You've returned from Paystack. Your book becomes available after signed payment confirmation. Use Check purchase below.</p>}
          {notice && <p role="status" className="falowen-books-notice">{notice}</p>}
          {error && <p role="alert" className="falowen-books-error">{error}</p>}
          {owned ? <>
            <p className="falowen-books-owned">✓ The A1 workbook is in your library.</p>
            <button className="falowen-books-button primary" type="button" disabled={working} onClick={download}>{working ? "Preparing download…" : "Download my A1 workbook ↓"}</button>
            <small>Private download link expires after 5 minutes. Reopen this page to request another.</small>
          </> : checking || accessLoading ? <p role="status">Checking your book access…</p>
            : !book.available ? <>
              <p className="falowen-books-notice">We're completing private file delivery and checking the commercial edition. No payments are being accepted yet.</p>
              <a href="/books/a1/sample" className="falowen-books-button primary">Try the free sample →</a>
              <a href="/classes" className="falowen-books-quiet-link">Explore Falowen A1 classes</a>
            </> : !user ? <AccountForm onSuccess={() => setNotice("Signed in. Checking your library…")} /> : <>
              <p className="falowen-books-owner">Signed in as {user.email}</p>
              <button type="button" className="falowen-books-button primary" disabled={working || Boolean(error)} onClick={checkout}>{working ? "Opening Paystack…" : "Buy A1 digital workbook →"}</button>
              {returned && <button className="falowen-books-link-button" type="button" onClick={reloadAccess}>Check purchase confirmation</button>}
            </>}
          {user && !owned && !book.available && returned && <button className="falowen-books-link-button" type="button" onClick={reloadAccess}>Check existing purchase</button>}
          <p className="falowen-books-safe">🔒 Secure checkout when enabled · No payment before private delivery is ready</p>
        </aside>
      </section>

      <section className="falowen-books-next-step">
        <div><span className="falowen-books-eyebrow">NEXT STEP</span><h2>Prefer a teacher to guide you?</h2><p>The book is self-study material. Falowen also offers German classes and interactive exam practice as separate services.</p></div>
        <a className="falowen-books-button secondary" href="/classes">Explore German classes →</a>
      </section>
    </main>
    <LegalFooter />
  </div>;
}
