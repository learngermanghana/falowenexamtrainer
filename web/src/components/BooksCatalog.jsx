import React, { useMemo, useState } from "react";
import "./BooksCatalog.css";

const ghs = amount => "GH₵" + Number(amount || 0).toFixed(2);
export const indicativeUsd = (ghsAmount, fxQuote) => {
  const rate = Number(fxQuote?.usdToGhs);
  const amount = Number(ghsAmount);
  if (!Number.isFinite(rate) || rate <= 0 || !Number.isFinite(amount)) return "";
  return "≈ " + new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(amount / rate) + " USD";
};

export const matchCatalogTitles = (titles = [], search = "", level = "all", format = "all") => {
  const term = String(search).trim().toLocaleLowerCase();
  return titles.filter(title => {
    const words = [
      title.title, title.description, ...(title.topics || []),
      ...(title.levelTags || []), ...(title.formats || []),
    ].join(" ").toLocaleLowerCase();
    return (!term || words.includes(term))
      && (level === "all" || (title.levelTags || []).includes(level))
      && (format === "all" || (title.formats || []).includes(format));
  });
};

export const BOOK_PAGES = Object.freeze({
  "a1-course-workbook": {href:"/books/deutsch-a1-course-workbook",cover:"/books/a1-cover.svg"},
  "writing-skills-a1-c2": {href:"/books/how-to-unlock-your-german-writing-skills-a1-c2",cover:"/books/writing-skills-a1-c2-cover.svg"},
  "a1-writing-model-exams": {href:"/books/goethe-a1-writing-model-exams",cover:"/books/a1-writing-exams-cover.svg"},
  "a2-four-skills-exam-guide": {href:"/books/goethe-a2-four-skills-exam-guide",cover:"/books/a2-exam-guide-cover.svg"},
  "b1-four-skills-exam-guide": {href:"/books/goethe-b1-four-skills-exam-guide",cover:"/books/b1-exam-guide-cover.svg"},
});

export default function BooksCatalog({ catalogTitles = [], books = [], fxQuote, onSelectBook, basePath = "/books" }) {
  const bookHref = page => basePath + page.href.slice("/books".length);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [format, setFormat] = useState("all");
  const results = useMemo(
    () => matchCatalogTitles(catalogTitles, search, level, format),
    [catalogTitles, search, level, format],
  );
  return <section className="fb-library" id="fb-library" aria-label="Browse Falowen books">
    <div className="fb-library-heading">
      <div>
        <p className="fb-eyebrow">FALOWEN BOOK LIBRARY</p>
        <h1>Find your next German learning book</h1>
        <p>Browse book covers, prices and formats. Select View Book for previews and checkout.</p>
      </div>
      <div className="fb-library-fx">
        <strong>GHS is the checkout currency.</strong>
        <span>{fxQuote
          ? "USD estimates use Falowen's daily exchange-rate quote" + (fxQuote.stale ? " (last available rate)." : ".")
          : "USD estimates are temporarily unavailable."}</span>
        <span>USD is for comparison only; Paystack charges in Ghana cedis.</span>
      </div>
    </div>
    <div className="fb-library-tools">
      <label>Search all books
        <input type="search" value={search} onChange={event => setSearch(event.target.value)}
          placeholder="E.g. writing, A1, grammar, email, exam" aria-label="Search all Falowen books" />
      </label>
      <label>CEFR level
        <select value={level} onChange={event => setLevel(event.target.value)}>
          <option value="all">All levels</option>
          {["A1", "A2", "B1", "B2", "C1", "C2"].map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </label>
      <label>Format
        <select value={format} onChange={event => setFormat(event.target.value)}>
          <option value="all">All formats</option>
          <option value="digital">Digital PDF</option>
          <option value="printed">Printed</option>
        </select>
      </label>
    </div>
    <p className="fb-library-resultcount" role="status">{results.length} {results.length === 1 ? "book" : "books"} found</p>
    <div className="fb-library-grid">
      {results.map(title => {
        const available = title.status === "available";
        const offers = books.filter(book => (title.bookIds || []).includes(book.id));
        return <article key={title.id} className="fb-library-card">
          {BOOK_PAGES[title.id] && <a className="fb-library-cover-link" href={bookHref(BOOK_PAGES[title.id])}
              aria-label={"View " + title.title}>
            <img src={BOOK_PAGES[title.id].cover} alt={title.title + " cover"} loading="lazy" width="190" height="269" />
          </a>}
          <div className="fb-library-cardmeta">
            <span>{(title.levelTags || []).join(" · ")}</span><span>{title.pages} pages</span>
          </div>
          <h2>{title.title}</h2><p>{title.description}</p>
          <div className="fb-library-offers">
            {available && offers.length ? offers.map(book => <div className="fb-library-offer" key={book.id}>
              <span>{book.format === "printed" ? "Printed on demand" : "Digital PDF"}</span>
              <strong>{ghs(book.priceGhs)}
                {indicativeUsd(book.priceGhs, fxQuote) && <small>{indicativeUsd(book.priceGhs, fxQuote)} · estimate</small>}
              </strong>
            </div>) : <p className="fb-library-coming">Coming soon · Price to be announced</p>}
          </div>
          {BOOK_PAGES[title.id]
            ? <a className="fb-btn fb-btn-soft fb-library-action" href={bookHref(BOOK_PAGES[title.id])}>View Book</a>
            : available && offers.length && onSelectBook
              ? <button className="fb-btn fb-btn-soft fb-library-action" type="button"
                  onClick={() => onSelectBook(offers[0].id)}>View Book</button>
              : <p className="fb-library-pending">Ask Falowen about availability.</p>}
        </article>;
      })}
      {!results.length && <div className="fb-library-empty">
        <strong>No books match those filters.</strong><p>Try another word or CEFR level.</p>
        <button type="button" className="fb-btn fb-btn-ghost" onClick={() => {
          setSearch(""); setLevel("all"); setFormat("all");
        }}>Clear filters</button>
      </div>}
    </div>
  </section>;
}
