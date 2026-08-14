(function () {
  var STAR_VALUES = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalize(raw) {
    return (raw && Array.isArray(raw.reviews) ? raw.reviews : []).map(function (review) {
      return {
        name: review && review.reviewer && review.reviewer.displayName ? review.reviewer.displayName : "Google reviewer",
        rating: STAR_VALUES[review && review.starRating] || 0,
        text: review && review.comment ? review.comment.trim() : "",
        createdAt: review && review.createTime ? review.createTime : ""
      };
    }).filter(function (review) { return review.rating > 0; });
  }

  function stars(count) {
    return "★★★★★".slice(0, count);
  }

  function summary(reviews) {
    if (!reviews.length) return { average: "–", count: 0 };
    var total = reviews.reduce(function (sum, review) { return sum + review.rating; }, 0);
    return { average: (total / reviews.length).toFixed(1), count: reviews.length };
  }

  function selectFeatured(reviews) {
    var writtenFiveStar = reviews.filter(function (review) { return review.rating === 5 && review.text; });
    return writtenFiveStar.slice(0, 3);
  }

  function mountReviews(reviews) {
    if (document.getElementById("falowen-google-reviews")) return true;
    var shell = document.querySelector(".falowen-home-shell");
    if (!shell) return false;

    var featuredReviews = selectFeatured(reviews);
    if (!featuredReviews.length) return true;
    var stats = summary(reviews);

    var section = document.createElement("section");
    section.id = "falowen-google-reviews";
    section.className = "falowen-google-reviews";
    section.setAttribute("aria-labelledby", "falowen-google-reviews-title");

    section.innerHTML =
      '<div class="falowen-google-reviews__header">' +
        '<div>' +
          '<span class="falowen-google-reviews__eyebrow">Student reviews</span>' +
          '<h2 id="falowen-google-reviews-title">Trusted by German learners in Ghana and abroad</h2>' +
          '<p>Real feedback from learners using Falowen and Learn Language Education Academy.</p>' +
        '</div>' +
        '<div class="falowen-google-reviews__score" aria-label="' + stats.average + ' out of 5 from ' + stats.count + ' exported Google reviews">' +
          '<strong>' + stats.average + ' <span aria-hidden="true">★</span></strong>' +
          '<span>' + stats.count + ' exported Google reviews</span>' +
        '</div>' +
      '</div>' +
      '<div class="falowen-google-reviews__grid">' +
        featuredReviews.map(function (review) {
          return '<article class="falowen-google-review-card">' +
            '<div class="falowen-google-review-card__stars" aria-label="' + review.rating + ' out of 5 stars">' + stars(review.rating) + '</div>' +
            '<p>“' + escapeHtml(review.text) + '”</p>' +
            '<footer><strong>' + escapeHtml(review.name) + '</strong><span>Google Review</span></footer>' +
          '</article>';
        }).join("") +
      '</div>' +
      '<a class="falowen-google-reviews__link" href="/reviews/">See all student reviews →</a>';

    var style = document.createElement("style");
    style.id = "falowen-google-reviews-styles";
    style.textContent =
      '.falowen-google-reviews{background:#fff;border:1px solid #e2e8f0;border-radius:22px;padding:22px;display:grid;gap:18px}' +
      '.falowen-google-reviews__header{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;flex-wrap:wrap}' +
      '.falowen-google-reviews__eyebrow{display:inline-block;color:#1d4ed8;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}' +
      '.falowen-google-reviews h2{margin:0;font-size:clamp(24px,4vw,32px);letter-spacing:-.02em}' +
      '.falowen-google-reviews__header p{margin:7px 0 0;color:#475569;line-height:1.6}' +
      '.falowen-google-reviews__score{min-width:190px;border:1px solid #fde68a;background:#fffbeb;border-radius:16px;padding:13px 16px;display:grid;gap:3px}' +
      '.falowen-google-reviews__score strong{font-size:24px;color:#92400e}' +
      '.falowen-google-reviews__score span{font-size:13px;font-weight:800;color:#78350f}' +
      '.falowen-google-reviews__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}' +
      '.falowen-google-review-card{border:1px solid #e2e8f0;border-radius:18px;padding:18px;display:grid;gap:12px;background:#f8fafc}' +
      '.falowen-google-review-card__stars{color:#d97706;letter-spacing:.08em;font-size:18px}' +
      '.falowen-google-review-card p{margin:0;color:#334155;line-height:1.65;font-size:14px}' +
      '.falowen-google-review-card footer{display:grid;gap:2px;margin-top:auto}' +
      '.falowen-google-review-card footer strong{font-size:14px}' +
      '.falowen-google-review-card footer span{font-size:12px;color:#64748b;font-weight:700}' +
      '.falowen-google-reviews__link{width:fit-content;color:#1d4ed8;font-weight:900;text-decoration:none}' +
      '@media(max-width:760px){.falowen-google-reviews{padding:18px}.falowen-google-reviews__grid{grid-template-columns:1fr}.falowen-google-reviews__score{width:100%}}';
    document.head.appendChild(style);

    var finalCta = shell.querySelector(".falowen-final-cta");
    if (finalCta) shell.insertBefore(section, finalCta);
    else shell.appendChild(section);
    return true;
  }

  function start(reviews) {
    if (mountReviews(reviews)) return;
    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;
      if (mountReviews(reviews) || attempts > 40) window.clearInterval(timer);
    }, 250);
    window.addEventListener("falowen:app-mounted", function () { mountReviews(reviews); });
  }

  fetch("/reviews.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("Reviews request failed");
      return response.json();
    })
    .then(function (raw) { start(normalize(raw)); })
    .catch(function (error) { console.error("Could not load Google reviews", error); });
})();
