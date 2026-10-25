import React, { useEffect, useMemo, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";
import { A1_SAMPLE_SECTIONS, A1_SAMPLE_DISCLOSURE } from "../data/a1BookSample";
import "./BookStoreCheckout.css";
import BooksCatalog, { indicativeUsd } from "./BooksCatalog";
import WritingGuideDetail from "./WritingGuideDetail";
import BookShoppingCart from "./BookShoppingCart";
import { addBookCartItem, readBookCart, saveBookCart } from "../utils/bookCart";

const API = getBackendUrl();
const money = value => `GH₵${Number(value || 0).toFixed(2)}`;
const SAMPLE_LABELS = { grammar: "Grammar", knowledge: "Knowledge check", workbook: "Workbook" };
const BOOK_DETAILS = [
  { icon: "01", title: "Foundations", text: "Greetings, pronunciation, introductions and everyday vocabulary." },
  { icon: "02", title: "Grammar that clicks", text: "Articles, German cases, modal verbs, negation and prepositions." },
  { icon: "03", title: "Apply the language", text: "Work through reading, writing, listening-related tasks and speaking activities." },
  { icon: "04", title: "Build confidence", text: "Practise conversations, directions, letters, the weather and health." },
];
const FAQ = [
  { question: "Is this a Goethe examination book?", answer: "No. This is a Falowen A1 course and practice workbook. The final mock examination is offered separately in Falowen’s Exams Room." },
  { question: "What is included in the digital edition?", answer: "The complete 250-page A1 Grammar Notes & Workbook PDF is arranged manually after Paystack payment verification. The free sample is only a short excerpt." },
  { question: "When will I receive the printed book?", answer: "The printed edition is produced on demand, only after successful payment. Falowen will contact you to coordinate printing, collection or delivery. No fixed delivery date is promised at checkout." },
  { question: "Is delivery included in GH₵800?", answer: "No. The GH₵800 price covers the printed book. Delivery is charged separately and arranged with Falowen." },
  { question: "How is payment confirmed?", answer: "Pay with Paystack, retain the transaction receipt and reference, and use the secure order-confirmation page. Falowen verifies your payment with Paystack before arranging your book." },
];
const sections = ["overview", "contents", "sample", "faq"];
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options, headers: { ...(options.body ? { "Content-Type": "application/json" } : {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Book payments are temporarily unavailable.");
  return payload;
}

function SampleContent({ section }) {
  if (!section) return null;
  return <div className="fb-sample-paper">
    <p className="fb-sample-kicker">{section.kicker}</p>
    <h3>{section.title}</h3>
    <p>{section.intro}</p>
    {section.blocks?.map(block => <div className="fb-sample-block" key={block.heading}>
      <h4>{block.heading}</h4>
      {block.lines.map(([de, en]) => <div className="fb-word-row" key={de}><strong>{de}</strong><span>{en}</span></div>)}
    </div>)}
    {section.questions?.map(question => <div key={question.prompt} className="fb-sample-block">
      <h4>{question.prompt}</h4>
      {question.choices.map((choice, index) => <div className="fb-answer" key={choice}>
        <span aria-hidden="true" className="fb-answer-ring" /> {String.fromCharCode(97 + index)}. {choice}
      </div>)}
    </div>)}
    {section.passage && <div className="fb-sample-block"><h4>Teil 1 · Reading text</h4>
      <p lang="de">{section.passage}</p><h4>Translation</h4><p>{section.translation}</p>
      <div className="fb-answer"><strong>Sample question:</strong> {section.question}</div>
    </div>}
    <span className="fb-sample-mark">FREE SAMPLE · FALOWEN A1</span>
  </div>;
}

async function exportFreeSample() {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, margin = 20;
  let y = 20;
  const wrap = (txt, size = 11, lineHeight = 6) => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", "normal");
    for (const line of pdf.splitTextToSize(String(txt), W - margin * 2)) {
      if (y + lineHeight > 280) { pdf.addPage(); y = 20; }
      pdf.text(line, margin, y);
      y += lineHeight;
    }
  };
  const heading = (txt, size = 15) => {
    if (y > 260) { pdf.addPage(); y = 20; }
    pdf.setTextColor(24, 66, 117);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(size);
    pdf.text(String(txt), margin, y);
    y += size / 2 + 5;
    pdf.setTextColor(33, 46, 67);
  };
  pdf.setProperties({ title: "Falowen Deutsch A1 – Free Sample", author: "Falowen", subject: "Selected A1 Day 1 workbook excerpts" });
  pdf.setFillColor(13, 37, 76); pdf.rect(0, 0, 210, 70, "F");
  pdf.setTextColor(255, 255, 255); pdf.setFont("helvetica", "bold"); pdf.setFontSize(17);
  pdf.text("FALOWEN", margin, 24);
  pdf.setFontSize(29); pdf.text("Deutsch A1", margin, 43);
  pdf.setFontSize(13); pdf.text("Course & Workbook | FREE SAMPLE", margin, 57);
  pdf.setTextColor(33, 46, 67); y = 89;
  wrap("Selected excerpts from Day 1 of the Falowen A1 course materials. This is a reformatted preview; exact printed page design may differ.", 11, 7);
  y += 6; heading("What you can explore", 16);
  wrap("Formal greetings, real practice questions, and a short workbook reading task.", 12, 7);
  wrap("Original book: 250 pages across 22 printable lesson days. Digital edition GH₵99; printed edition GH₵800 (delivery extra).", 10, 7);
  for (const s of A1_SAMPLE_SECTIONS) {
    pdf.addPage(); y = 22; heading(s.kicker, 11); heading(s.title, 18);
    wrap(s.intro, 11, 7); y += 6;
    for (const block of s.blocks || []) {
      heading(block.heading, 13);
      for (const [a,b] of block.lines) { wrap(a + " — " + b, 11, 7); }
      y += 5;
    }
    for (const q of s.questions || []) {
      heading(q.prompt, 12); q.choices.forEach((choice,i) => wrap("    " + String.fromCharCode(97+i) + ". " + choice, 11, 7)); y += 6;
    }
    if (s.passage) { heading("Reading text", 13); wrap(s.passage, 11, 7); y += 8; heading("Translation", 13); wrap(s.translation, 11, 7); y += 7; heading("Sample question", 13); wrap(s.question, 11, 7); }
  }
  const count = pdf.getNumberOfPages();
  for (let i=1;i<=count;i++) {
    pdf.setPage(i); pdf.setDrawColor(210, 223, 235); pdf.line(20, 286, 190, 286);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); pdf.setTextColor(105, 117, 134);
    pdf.text("Falowen A1 - free educational sample | www.falowen.app/books", 20, 291);
    pdf.text(String(i) + " / " + count, 190, 291, { align: "right" });
  }
  pdf.save("Falowen-Deutsch-A1-Free-Sample.pdf");
}

function ReceiptConfirmation() {
  const query = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const orderId = query.get("order"), key = query.get("key");
  const [order, setOrder] = useState(null), [error, setError] = useState(""), [busy, setBusy] = useState(false);
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
  const copyReceipt = async () => {
    if (!order || !navigator.clipboard?.writeText) return setError("Please select the receipt reference displayed below.");
    try {
      await navigator.clipboard.writeText([
        "Falowen Books payment details", `Books: ${order.title}`,
        ...(order.items || []).map(item => `${item.quantity} × ${item.title} — ${money(item.lineTotalGhs)}`),
        `Edition: ${order.format}`, `Order: ${order.orderId}`,
        `Paystack reference: ${order.reference}`,
        `Amount: ${money(order.priceGhs)}`,
        `Status: ${order.status === "paid" ? "Verified by Falowen" : "Not yet verified"}`
      ].join("\n"));
    } catch (_) { setError("Copy failed. You can select the reference displayed below."); }
  };
  return <main className="fb-page fb-receipt-page"><div className="fb-receipt-wrap">
    <a className="fb-top-back" href="/books">← Back to Books</a>
    <div className="fb-receipt-card">
      <span className="fb-eyebrow">FALOWEN · SECURE ORDER</span>
      <h1>Book payment confirmation</h1>
      <p>A return from Paystack is not proof of payment. Only verified transactions are marked paid.</p>
      {order ? <div className="fb-receipt-detail" aria-live="polite">
        <div className={"fb-payment-state " + (order.status === "paid" ? "is-paid" : "")}>
          {order.status === "paid" ? "✓ Payment verified with Paystack" : order.status === "rejected" ? "Payment needs review" : "Awaiting secure confirmation"}
        </div>
        <dl>
          <dt>Books</dt><dd>{order.title}</dd>
          {Array.isArray(order.items) && order.items.map(item => <React.Fragment key={item.bookId}>
            <dt>Edition</dt><dd>{item.title} · {item.quantity} {item.quantity === 1 ? "copy" : "copies"} · {money(item.lineTotalGhs)}</dd>
          </React.Fragment>)}
          <dt>Order ID</dt><dd><code>{order.orderId}</code></dd>
          <dt>Paystack reference</dt><dd><code>{order.reference}</code></dd>
          <dt>Amount</dt><dd><strong>{money(order.priceGhs)}</strong></dd>
        </dl>
        <p>{order.status === "paid"
          ? order.format === "printed" || (order.items || []).some(item => item.format === "printed")
            ? "Falowen will arrange any printed copies after payment verification. Delivery costs are separate. Digital PDFs are supplied manually."
            : "Falowen will arrange the PDF manually. No automatic download is issued."
          : "If you have been charged, do not pay a second time. Retain your Paystack receipt and check again."}</p>
        <button type="button" className="fb-btn fb-btn-ghost" onClick={copyReceipt}>Copy receipt details</button>
      </div> : null}
      {error ? <p className="fb-error" role="alert">{error}</p> : null}
      <button type="button" className="fb-btn fb-btn-primary" disabled={busy} onClick={refresh}>
        {busy ? "Checking with Paystack…" : "Check payment status"}
      </button>
    </div>
  </div></main>;
}

export default function BookStoreCheckout({ completed = false, productSlug = "" }) {
  const [books, setBooks] = useState([]), [enabled, setEnabled] = useState(false);
  const [catalogTitles, setCatalogTitles] = useState([]);
  const [fxQuote, setFxQuote] = useState(null);
  const isCatalogue = !productSlug;
  const isCart = productSlug === "cart";
  const isWritingGuide = productSlug === "how-to-unlock-your-german-writing-skills-a1-c2";
  const isA2 = productSlug === "deutsch-a2-course-workbook";
  const [bookId, setBookId] = useState(isWritingGuide ? "writing-skills-a1-c2-digital" : "a1-digital");
  const [copyQuantity, setCopyQuantity] = useState(1);
  const [cart, setCart] = useState(readBookCart);
  const [added, setAdded] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"), [sampleId, setSampleId] = useState("grammar");
  const [openFaq, setOpenFaq] = useState(0), [downloadBusy, setDownloadBusy] = useState(false);

  useEffect(() => {
    const previous = document.title;
    document.title = completed ? "Book payment confirmation | Falowen"
      : isCart ? "Shopping Cart | Falowen Books"
      : isWritingGuide ? "German Writing Skills Guide A1–C2 | Falowen Books"
      : isA2 ? "Deutsch A2 Grammar and Workbook | Falowen Books"
      : isCatalogue ? "Falowen Books | German Workbooks and Writing Guides"
      : "Deutsch A1 Course & Workbook | Falowen Books";
    const canonical = completed || isCart ? "" : "https://www.falowen.app/books" +
      (productSlug ? "/" + productSlug : "");
    const description = isA2
      ? "Explore Falowen's upcoming Deutsch A2 grammar, reading, writing and speaking workbook."
      : isWritingGuide ? "Practical German writing guide for A1 to C2 with connectors, emails and exercises."
      : isCatalogue ? "Shop Falowen German workbooks, digital learning books and writing guides."
      : "Deutsch A1 course and workbook, 250-page digital or print-on-demand editions.";
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content");
    if (meta) meta.setAttribute("content", description);
    let link = document.querySelector('link[rel="canonical"]');
    const previousCanonical = link?.getAttribute("href");
    if (!link && canonical) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    if (link && canonical) link.setAttribute("href", canonical);
    return () => {
      document.title = previous;
      if (meta && previousDescription !== null) meta.setAttribute("content", previousDescription);
      if (link && previousCanonical != null) link.setAttribute("href", previousCanonical);
      else if (link && canonical && previousCanonical == null) link.remove();
    };
  }, [completed, isCart, isWritingGuide, isA2, isCatalogue, productSlug]);
  useEffect(() => {
    if (completed) return;
    let active = true;
    request("/books/catalog").then(payload => {
      if (!active) return;
      setBooks(payload.books || []);
      setCatalogTitles(Array.isArray(payload.catalogTitles) ? payload.catalogTitles : []);
      setEnabled(Boolean(payload.paymentsEnabled));
    }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [completed]);

  useEffect(() => {
    if (completed) return undefined;
    let active = true;
    // Use the same cached daily quote as Falowen sign-up; GHS remains the Paystack charge currency.
    request("/fx/usd-ghs").then(quote => {
      if (active && Number.isFinite(Number(quote.usdToGhs)) && Number(quote.usdToGhs) > 0) {
        setFxQuote({ usdToGhs: Number(quote.usdToGhs), stale: Boolean(quote.stale) });
      }
    }).catch(() => { /* No guessed or stale hardcoded rates. */ });
    return () => { active = false; };
  }, [completed]);

  const selected = useMemo(() => books.find(b => b.id === bookId), [books,bookId]);
  const sample = A1_SAMPLE_SECTIONS.find(s => s.id === sampleId);
  const addToCart = (book, quantity = 1) => {
    if (!book) return;
    const next = saveBookCart(addBookCartItem(cart, book, quantity));
    setCart(next);
    setAdded((book.format === "printed" ? "Printed copies" : "Digital edition") +
      " added to your cart.");
  };
  const buyNow = (book, quantity = 1) => {
    if (!book) return;
    saveBookCart(addBookCartItem(cart, book, quantity));
    window.location.assign("/books/cart");
  };
  const download = async () => {
    setDownloadBusy(true); setError("");
    try { await exportFreeSample(); } catch (e) { setError("The sample could not be created on this device. You can still read the preview below."); }
    finally { setDownloadBusy(false); }
  };
  if (completed) return <ReceiptConfirmation />;
  if (isCart) return <main className="fb-page"><BookShoppingCart books={books} paymentsEnabled={enabled} fxQuote={fxQuote}/></main>;
  return <main className="fb-page">
    <div className="fb-topbar"><div className="fb-shell fb-topbar-inner">
      <a href="/" className="fb-brand" aria-label="Falowen homepage">
        <span className="fb-brand-symbol">F</span><strong>FALOWEN</strong><span className="fb-brand-divider" /><span>BOOKS</span>
      </a>
      <a className="fb-top-back" href="/">← Back to Falowen</a>
    </div></div>
    <div className="fb-shell">
      <nav className="fb-breadcrumb" aria-label="Breadcrumb"><a href="/">Falowen</a><span>/</span><strong>Books</strong></nav>
      <div className="fb-book-product-nav">
        <a className="fb-cart-link" href="/books">{isCatalogue ? "Browse all titles" : "← All books"}</a>
        <a className="fb-cart-link" href="/books/cart">Shopping cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</a>
      </div>
      {isCatalogue && <BooksCatalog books={books} catalogTitles={catalogTitles} fxQuote={fxQuote} />}
      {productSlug && <div id="fb-book-featured" style={{scrollMarginTop:24}}>
        {isA2 ? <section className="fb-book-coming" aria-label="Upcoming Deutsch A2 course book">
          <p className="fb-eyebrow">FALOWEN BOOK LIBRARY · COMING SOON</p>
          <h1>Deutsch A2 · Course &amp; Workbook</h1>
          <p>441 pages of German grammar, writing, reading, listening questions and speaking practice. The book is being prepared for publication.</p>
          <p>Digital and printed editions are planned. Printing and delivery prices will be confirmed after the printer's quotation. No A2 checkout is available yet.</p>
          <a href="/books" className="fb-btn fb-btn-soft">Browse available books</a>
        </section>
        : isWritingGuide ? <WritingGuideDetail book={books.find(b => b.id === "writing-skills-a1-c2-digital")}
          fxQuote={fxQuote} onAddToCart={addToCart} onBuyNow={buyNow}
          enabled={enabled} added={added} /> :
      <section className="fb-hero" aria-label="Falowen Deutsch A1 book">
        <div className="fb-visual-col">
          <div className="fb-cover-stage">
            <div className="fb-cover-perspective"><img src="/books/a1-cover.svg" alt="Falowen Deutsch A1 Course and Workbook front cover" className="fb-main-cover" /></div>
            <div className="fb-cover-shine" aria-hidden="true" />
          </div>
          <div className="fb-cover-caption"><span className="fb-caption-dot" /> Original Falowen learning materials · CEFR A1</div>
          <button type="button" className="fb-preview-link" onClick={() => {setActiveTab("sample");document.getElementById("fb-book-details")?.scrollIntoView({behavior:"smooth",block:"start"});}}>
            <span aria-hidden="true">▤</span> Read a free sample <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="fb-book-intro">
          <div className="fb-pills"><span>A1 · BEGINNER</span><span>GRAMMAR + WORKBOOK</span></div>
          <p className="fb-eyebrow">FALOWEN LANGUAGE LIBRARY</p>
          <h1>Deutsch <em>A1</em><span>Course &amp; Workbook</span></h1>
          <p className="fb-lede">A clear, practical introduction to German—from your first greeting to confident everyday conversations.</p>
          <p className="fb-description">Structured grammar explanations, vocabulary in context, short knowledge checks and guided workbook activities in one beginner-friendly resource.</p>
          <div className="fb-book-stats">
            <div><strong>250</strong><small>pages</small></div>
            <div><strong>22</strong><small>lesson days</small></div>
            <div><strong>A1</strong><small>CEFR level</small></div>
          </div>
          <ul className="fb-feature-list">
            <li>Step-by-step grammar, with practical German examples</li>
            <li>Everyday speaking, reading and writing practice</li>
            <li>Useful for classroom learning and independent revision</li>
            <li>Free sample available before purchase</li>
          </ul>
          <div className="fb-intro-actions">
            <a className="fb-btn fb-btn-primary" href="#fb-purchase">Choose your edition <span aria-hidden="true">→</span></a>
            <button type="button" className="fb-btn fb-btn-soft" onClick={() => {setActiveTab("sample");document.getElementById("fb-book-details")?.scrollIntoView({behavior:"smooth"});}}>Explore the book</button>
          </div>
        </div>
        <aside className="fb-purchase-card" id="fb-purchase">
          <div className="fb-purchase-header"><span className="fb-eyebrow">CHOOSE YOUR EDITION</span><h2>Start with A1</h2><p>One book. Two ways to learn.</p></div>
          <div className="fb-editions" role="radiogroup" aria-label="Choose book edition">
            {books.filter(book => book.id === "a1-digital" || book.id === "a1-printed").length ?
              books.filter(book => book.id === "a1-digital" || book.id === "a1-printed").map(book => <label key={book.id} className={"fb-edition" + (bookId === book.id ? " selected" : "")}>
              <input type="radio" name="edition" checked={bookId === book.id} onChange={() => setBookId(book.id)} />
              <span className="fb-edition-icon" aria-hidden="true">{book.format === "digital" ? "▧" : "▤"}</span>
              <span className="fb-edition-label"><strong>{book.format === "digital" ? "Digital PDF" : "Printed book"}</strong>
                <small>{book.format === "digital" ? "Manual PDF delivery" : "Printed on demand"}</small>
              </span>
              <span className="fb-edition-price">{money(book.priceGhs).replace(".00","")}
                {indicativeUsd(book.priceGhs, fxQuote) && <small>{indicativeUsd(book.priceGhs, fxQuote)}</small>}
              </span>
            </label>) : <p className="fb-muted">Loading editions…</p>}
          </div>
          {selected?.format === "printed" && <p className="fb-shipping-note">Print orders are produced after payment. Delivery is arranged and charged separately.</p>}
          <div className="fb-form">
            <label className="fb-copy-picker">Number of {selected?.format === "printed" ? "printed copies" : "digital copies"}
              <input type="number" min="1" max={selected?.format === "printed" ? "10" : "1"}
                value={selected?.format === "digital" ? 1 : copyQuantity}
                disabled={selected?.format !== "printed"}
                onChange={event => setCopyQuantity(Math.max(1, Math.min(10, Number(event.target.value) || 1)))}/>
            </label>
            <div className="fb-total"><span>{selected?.format === "printed" ? "Books subtotal" : "Book price"}</span>
              <span className="fb-total-prices"><strong>{selected ? money(selected.priceGhs * (selected.format === "printed" ? copyQuantity : 1)) : "—"}</strong>
                {selected && indicativeUsd(selected.priceGhs * (selected.format === "printed" ? copyQuantity : 1), fxQuote) &&
                  <small>{indicativeUsd(selected.priceGhs * (selected.format === "printed" ? copyQuantity : 1), fxQuote)} · display only</small>}
              </span>
            </div>
            <button type="button" className="fb-btn fb-btn-primary fb-pay" disabled={!selected}
              onClick={() => addToCart(selected, selected.format === "printed" ? copyQuantity : 1)}>
              Add to cart
            </button>
            <button type="button" className="fb-btn fb-btn-soft fb-pay" disabled={!selected || !enabled}
              onClick={() => buyNow(selected, selected.format === "printed" ? copyQuantity : 1)}>
              {enabled ? "Buy now · Review cart" : "Checkout temporarily unavailable"}
            </button>
            {added && <p className="fb-add-feedback" role="status">{added} <a href="/books/cart">View cart</a></p>}
            {error && <p className="fb-error" role="alert">{error}</p>}
          </div>
          <p className="fb-secure-note"><span aria-hidden="true">◈</span> Verified payment through Paystack in GHS. Keep your transaction receipt.</p>
          <p className="fb-manual-note">Falowen arranges your book after payment verification. No automatic PDF download or delivery tracking.</p>
        </aside>
      </section>}
      </div>}
      {productSlug && !isWritingGuide && !isA2 && <section id="fb-book-details" className="fb-details">
        <div className="fb-tabbar" role="tablist" aria-label="Book information">
          {sections.map(id => <button key={id} type="button" role="tab" aria-selected={activeTab === id} className={activeTab===id?"active":""} onClick={()=>setActiveTab(id)}>
            {({overview:"Overview",contents:"What's inside",sample:"Free sample",faq:"Questions"})[id]}
          </button>)}
        </div>
        {activeTab === "overview" && <div className="fb-tab-content fb-overview">
          <div><span className="fb-eyebrow">ABOUT THE BOOK</span><h2>Learn German one practical step at a time.</h2>
            <p>The Falowen A1 Course &amp; Workbook brings classroom grammar notes and exercises into a single structured resource. It is designed to help early-stage learners practise and revisit the basics at their own pace.</p>
            <p>Includes grammar sections, learner exercises and activities for all 22 printable A1 lesson days. The separate final mock examination is not included in this book.</p>
          </div>
          <div className="fb-outcomes"><h3>By the end of your A1 foundation</h3>
            <ul><li>Greet and introduce yourself</li><li>Talk about family, prices, time and daily activities</li><li>Understand articles, basic cases and modal verbs</li><li>Write short messages and practise everyday exchanges</li></ul>
          </div>
        </div>}
        {activeTab === "contents" && <div className="fb-tab-content"><span className="fb-eyebrow">LEARNING JOURNEY</span><h2>From day one to confident basics</h2>
          <div className="fb-topic-grid">{BOOK_DETAILS.map(x => <div className="fb-topic" key={x.icon}>
            <span>{x.icon}</span><h3>{x.title}</h3><p>{x.text}</p>
          </div>)}</div>
          <p className="fb-muted">The PDF covers 22 printed lesson days. Day 0 (platform orientation) and the final A1 mock exam (Day 23) remain online rather than in the book.</p>
        </div>}
        {activeTab === "sample" && <div className="fb-tab-content">
          <div className="fb-sample-heading"><div><span className="fb-eyebrow">SEE BEFORE YOU BUY</span><h2>A real look inside Day 1</h2><p>{A1_SAMPLE_DISCLOSURE}</p></div>
            <button type="button" className="fb-btn fb-btn-primary" onClick={download} disabled={downloadBusy}>{downloadBusy ? "Preparing PDF…" : "↓ Download free sample PDF"}</button>
          </div>
          <div className="fb-sample-layout"><div className="fb-sample-menu" aria-label="Sample section selector">
            {A1_SAMPLE_SECTIONS.map(s => <button type="button" key={s.id} className={sampleId===s.id?"active":""} onClick={()=>setSampleId(s.id)}>
              <span>{SAMPLE_LABELS[s.id]}</span><small>{s.kicker}</small>
            </button>)}
          </div><SampleContent section={sample} /></div>
        </div>}
        {activeTab === "faq" && <div className="fb-tab-content fb-faq"><span className="fb-eyebrow">GOOD TO KNOW</span><h2>Frequently asked questions</h2>
          {FAQ.map((item,i)=><div className="fb-faq-item" key={item.question}>
            <button type="button" aria-expanded={openFaq===i} onClick={()=>setOpenFaq(openFaq===i?-1:i)}>
              <strong>{item.question}</strong><span aria-hidden="true">{openFaq===i?"−":"+"}</span>
            </button>
            {openFaq===i && <p>{item.answer}</p>}
          </div>)}
        </div>}
      </section>}
      <footer className="fb-footer"><span>© {new Date().getFullYear()} Falowen · German learning made practical</span><a href="/">Return to Falowen</a></footer>
    </div>
  </main>;
}
