(function () {
  const REVIEWS_JSON_URL = "/reviews.json";
  const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Learn+Language+Education+Academy+(Former+%22Learn+German+Ghana%22)/data=!4m2!3m1!1s0x0:0xbd2e1fb7eabd20da?sa=X&ved=1t:2428&ictx=111";

  function injectStyles() {
    if (document.getElementById("brochureFooterReviewStyles")) return;
    const style = document.createElement("style");
    style.id = "brochureFooterReviewStyles";
    style.textContent = `
      .student-reviews-card { margin-top: 16px; display: grid; gap: 12px; }
      .student-reviews-card h2 { font-size: 20px; margin: 0; }
      .student-reviews-intro { margin: 0; color: #475569; font-size: 14px; line-height: 1.55; }
      .student-review-grid { display: grid; gap: 10px; }
      .student-review { border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 14px; padding: 12px; display: grid; gap: 6px; }
      .student-review-head { display: flex; justify-content: space-between; gap: 10px; align-items: center; }
      .student-review-name { font-weight: 900; color: #111827; }
      .student-review-stars { color: #f59e0b; font-size: 13px; white-space: nowrap; }
      .student-review-text { margin: 0; color: #334155; font-size: 14px; line-height: 1.55; }
      .student-review-empty { color: #64748b; font-size: 14px; margin: 0; }
      .brochure-footer { margin-top: 16px; border: 1px solid #dbeafe; background: #eff6ff; border-radius: 14px; padding: 16px; display: grid; gap: 12px; }
      .brochure-footer h2 { margin: 0; font-size: 18px; color: #0f172a; }
      .brochure-footer p { margin: 0; color: #334155; font-size: 14px; line-height: 1.55; }
      .brochure-footer-links { display: grid; gap: 8px; }
      .brochure-footer-links a { display: block; padding: 11px 12px; border-radius: 12px; background: #ffffff; border: 1px solid #bfdbfe; color: #1d4ed8; font-weight: 850; text-decoration: none; font-size: 14px; }
      @media (min-width: 760px) {
        .student-review-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .brochure-footer { grid-template-columns: 1fr 1.2fr; align-items: start; }
        .brochure-footer-links { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
    `;
    document.head.appendChild(style);
  }

  const STAR_RATINGS = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  };

  function normalizeReviews(payload) {
    const source = Array.isArray(payload?.reviews) ? payload.reviews : [];
    return source
      .map((review) => ({
        name: String(review?.reviewer?.displayName || "Student").trim() || "Student",
        rating: STAR_RATINGS[String(review?.starRating || "").toUpperCase()] || Number(review?.starRating) || 5,
        text: String(review?.comment || "").replace(/\s+/g, " ").trim(),
        createdAt: String(review?.createTime || ""),
      }))
      .filter((review) => review.text)
      .sort((a, b) => {
        const ratingDifference = b.rating - a.rating;
        if (ratingDifference) return ratingDifference;
        return String(b.createdAt).localeCompare(String(a.createdAt));
      })
      .slice(0, 3);
  }

  function stars(rating) {
    const safeRating = Math.max(1, Math.min(5, Number(rating) || 5));
    return "★★★★★".slice(0, safeRating);
  }

  function addReviewsCard() {
    if (document.getElementById("studentReviewsCard")) return;
    const agreement = document.getElementById("payment-agreement-section") || document.getElementById("agreementCard");
    const anchor = agreement || document.querySelector(".page > section:last-of-type") || document.querySelector(".page");
    if (!anchor) return;

    const card = document.createElement("section");
    card.id = "studentReviewsCard";
    card.className = "card student-reviews-card";
    card.innerHTML = `
      <h2>What students say</h2>
      <p class="student-reviews-intro">Recent Google reviews from students who have learned with Learn Language Education Academy.</p>
      <div class="student-review-grid" id="studentReviewGrid">
        <p class="student-review-empty">Loading student reviews…</p>
      </div>
    `;
    anchor.insertAdjacentElement("afterend", card);

    fetch(REVIEWS_JSON_URL, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Review file returned ${response.status}`);
        return response.json();
      })
      .then((payload) => {
        const reviews = normalizeReviews(payload);
        const grid = document.getElementById("studentReviewGrid");
        if (!grid) return;

        if (!reviews.length) {
          grid.innerHTML = '<p class="student-review-empty">Google reviews will appear here when the review export contains written comments.</p>';
          return;
        }

        grid.innerHTML = reviews
          .map(
            (review) => `
              <article class="student-review">
                <div class="student-review-head">
                  <span class="student-review-name">${escapeHtml(review.name)}</span>
                  <span class="student-review-stars">${stars(review.rating)}</span>
                </div>
                <p class="student-review-text">${escapeHtml(review.text)}</p>
              </article>
            `
          )
          .join("");
      })
      .catch(() => {
        const grid = document.getElementById("studentReviewGrid");
        if (grid) grid.innerHTML = '<p class="student-review-empty">Student reviews could not load now. Please check again later.</p>';
      });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function addFooter() {
    if (document.getElementById("classBrochureFooter")) return;
    const page = document.querySelector(".page");
    if (!page) return;

    const footer = document.createElement("footer");
    footer.id = "classBrochureFooter";
    footer.className = "brochure-footer";
    footer.innerHTML = `
      <div>
        <h2>Learn Language Education Academy</h2>
        <p>Learn German with structured classes, tutor support, Falowen app practice, and clear class schedules.</p>
      </div>
      <nav class="brochure-footer-links" aria-label="Learn Language Education Academy links">
        <a href="https://www.learngermanghana.com/tutors" target="_blank" rel="noreferrer">Tutors</a>
        <a href="https://www.learngermanghana.com/blog" target="_blank" rel="noreferrer">Blog</a>
        <a href="https://www.learngermanghana.com/about" target="_blank" rel="noreferrer">About us</a>
        <a href="${GOOGLE_MAPS_URL}" target="_blank" rel="noreferrer">Find us on Google Maps</a>
      </nav>
    `;
    page.appendChild(footer);
  }

  function run() {
    injectStyles();
    addReviewsCard();
    addFooter();
  }

  window.addEventListener("load", run);
  [300, 900, 1600].forEach((delay) => setTimeout(run, delay));
})();
