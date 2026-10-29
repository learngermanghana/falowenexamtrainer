import React from "react";
import { Link, useLocation } from "react-router-dom";
import BookStoreCheckout from "./BookStoreCheckout";
import "./CampusBooksPage.css";

/**
 * Render the same existing bookstore inside the signed-in Campus shell.
 * Public /books pages remain available independently for visitors and SEO.
 * Paystack authorization still takes place on the provider's secure website.
 */
export default function CampusBooksPage() {
  const { pathname } = useLocation();
  const sectionPath = "/campus/books";
  const suffix = pathname.startsWith(sectionPath)
    ? pathname.slice(sectionPath.length).replace(/\/$/, "")
    : "";

  let store;
  if (!suffix) {
    store = <BookStoreCheckout catalogOnly campus />;
  } else if (suffix === "/complete") {
    store = <BookStoreCheckout completed campus />;
  } else {
    const match = suffix.match(/^\/([^/]+?)(\/checkout)?$/);
    store = match
      ? <BookStoreCheckout slug={match[1]} checkout={Boolean(match[2])} campus />
      : <div role="alert"><p>Book page not found.</p><Link to={sectionPath}>Browse books</Link></div>;
  }

  return (
    <section className="campus-books" aria-label="Falowen Books" data-campus-books="true">
      {store}
    </section>
  );
}
