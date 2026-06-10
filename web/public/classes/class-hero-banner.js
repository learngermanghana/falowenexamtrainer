(function () {
  var cachedClassData = null;

  function cleanSlug(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function isFormPage() {
    var path = window.location.pathname.replace(/\/+$/, "") || "/";
    return path === "/classes" || path === "/classes/index.html";
  }

  function isDetailPage() {
    return /^\/classes\/[^/]+\/?$/.test(window.location.pathname);
  }

  function isOpenMode() {
    var url = new URL(window.location.href);
    return url.searchParams.get("open") === "1" || url.searchParams.get("view") === "details" || url.searchParams.get("details") === "1";
  }

  function isClassArea() {
    return isFormPage() || isDetailPage();
  }

  function selectedSlug() {
    var url = new URL(window.location.href);
    var fromQuery = url.searchParams.get("class") || url.searchParams.get("level") || url.searchParams.get("slug");
    if (fromQuery) return cleanSlug(fromQuery);
    var match = window.location.pathname.match(/^\/classes\/([^/]+)\/?$/);
    return match ? match[1] : "";
  }

  function formUrl(slug) {
    return slug ? "/classes/?class=" + encodeURIComponent(slug) : "/classes/";
  }

  function detailsUrl(slug) {
    return slug ? "/classes/" + slug + "/" : "/classes/";
  }

  function protectLeadLandingUrl() {
    if (window.__falowenProtectClassesLeadLanding) return;
    window.__falowenProtectClassesLeadLanding = true;
    var originalReplaceState = history.replaceState.bind(history);
    var originalPushState = history.pushState.bind(history);

    function shouldBlockUrl(url) {
      return !isOpenMode() && isFormPage() && typeof url === "string" && /^\/classes\/[^/]+\/?$/.test(url);
    }

    history.replaceState = function (state, title, url) {
      if (shouldBlockUrl(url)) return undefined;
      return originalReplaceState(state, title, url);
    };

    history.pushState = function (state, title, url) {
      if (shouldBlockUrl(url)) return undefined;
      return originalPushState(state, title, url);
    };
  }

  function formatDate(iso) {
    if (!iso) return "Always open";
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(iso + "T00:00:00Z"));
  }

  function formatMoney(amount) {
    if (!amount) return "Fee on request";
    return "GHS " + Number(amount || 0).toLocaleString("en-GH");
  }

  function classTime(course) {
    if (!course.meetingDays || !course.meetingDays.length) return "Self-learning";
    return course.meetingDays.map(function (slot) {
      return slot.day + " " + (slot.startTime || "");
    }).join(", ");
  }

  function isOpenClass(course) {
    if (!course) return false;
    if (course.availability === "always") return true;
    if (!course.startDate) return false;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var start = new Date(course.startDate + "T00:00:00");
    return start >= today;
  }

  function addStyles() {
    if (document.getElementById("simpleClassFlowStyles")) return;
    var style = document.createElement("style");
    style.id = "simpleClassFlowStyles";
    style.textContent = "body.simple-classes-form .page>section:not(.hero):not(.lead-capture-card):not(#studentReviewsCard),body.simple-classes-form .page>.grid,body.simple-classes-form .page>.card:not(.lead-capture-card):not(#studentReviewsCard),body.simple-classes-form #brochureToc,body.simple-classes-form #class-summary,body.simple-classes-form #meeting-times-section,body.simple-classes-form #class-schedule-section,body.simple-classes-form #payment-agreement-section,body.simple-classes-form .hero-actions,body.simple-classes-form .footer{display:none!important}body.simple-classes-form .lead-small-actions{display:none!important}body.simple-classes-form .hero{padding:14px 16px!important;gap:8px!important;border-radius:18px!important}body.simple-classes-form .hero h1{font-size:clamp(25px,8vw,36px)!important}body.simple-classes-form .hero p{font-size:14px!important;line-height:1.5!important}.hero{padding-top:14px!important;padding-bottom:14px!important}.hero-visual-card{min-height:auto!important}#studentReviewsCard{display:grid!important}#classBrochureFooter{display:grid!important}.brochure-footer{display:grid!important}.other-classes-card{margin-top:16px;display:grid;gap:12px}.other-classes-card h2{margin:0;font-size:20px}.other-classes-card p{margin:0;color:#475569;font-size:14px;line-height:1.55}.other-classes-grid{display:grid;gap:10px}.other-class-item{border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;padding:12px;display:grid;gap:8px}.other-class-item strong{color:#0f172a;font-size:15px}.other-class-meta{color:#475569;font-size:13px;line-height:1.45}.other-class-actions{display:grid;grid-template-columns:1fr;gap:8px}.other-class-actions a{min-height:40px;border-radius:12px;padding:10px 12px;font-size:13px}@media(min-width:760px){.other-classes-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.other-class-actions{grid-template-columns:1fr 1fr}}";
    document.head.appendChild(style);
  }

  function updateHeroForForm() {
    if (!isFormPage() || isOpenMode()) {
      document.body.classList.remove("simple-classes-form", "lead-gate-active");
      return;
    }
    document.body.classList.add("simple-classes-form");
    document.body.classList.remove("lead-gate-active");
    var eyebrow = document.querySelector(".hero .eyebrow");
    var title = document.querySelector(".hero h1");
    var text = document.querySelector(".hero p");
    if (eyebrow) eyebrow.textContent = "FALOWEN GERMAN CLASSES";
    if (title) title.textContent = "Register your interest in a German class";
    if (text) text.textContent = "Fill your name, email, phone number, and the class or level you want. We will save it to the lead sheet and then open the selected class information page.";
  }

  function improveLeadFormText() {
    if (!isFormPage() || isOpenMode()) return;
    var h2 = document.querySelector("#leadCaptureCard h2");
    var p = document.querySelector("#leadCaptureCard p");
    var button = document.querySelector("#leadCaptureForm button[type='submit']");
    var skip = document.getElementById("skipLeadGate");
    if (h2) h2.textContent = "Fill the form to continue";
    if (p) p.textContent = "No payment question here. We only collect your contact details and selected class for follow-up.";
    if (button) button.textContent = "Save and show class information";
    if (skip) {
      var actions = skip.closest ? skip.closest(".lead-small-actions") : null;
      if (actions) actions.remove();
      else skip.remove();
    }
  }

  function redirectAfterLeadSubmit() {
    document.addEventListener("submit", function (event) {
      var form = event.target;
      if (!form || form.id !== "leadCaptureForm" || !isFormPage()) return;
      var select = form.querySelector("#leadClass");
      var slug = select && select.value ? select.value : selectedSlug();
      var status = document.getElementById("leadStatus");
      if (status) status.textContent = "Saved. Opening selected class information...";
      window.setTimeout(function () {
        window.location.assign("/classes/?class=" + encodeURIComponent(slug) + "&open=1");
      }, 500);
    }, true);
  }

  function updateDetailButtons() {
    if (!isDetailPage() && !isOpenMode()) return;
    document.body.classList.remove("lead-gate-active", "simple-classes-form");
    var leadCard = document.getElementById("leadCaptureCard");
    if (leadCard) leadCard.remove();
    var slug = selectedSlug();
    document.querySelectorAll("a[href^='/signup'],a[href^='/classes/?class']").forEach(function (link) {
      link.href = formUrl(slug);
      link.textContent = "Register Now";
      link.removeAttribute("target");
      link.removeAttribute("rel");
    });
    var cta = document.getElementById("mainSignupCta");
    if (cta) {
      cta.href = formUrl(slug);
      cta.textContent = "Register Now";
    }
  }

  function renderOtherClasses(data) {
    if ((!isDetailPage() && !isOpenMode()) || document.getElementById("otherAvailableClasses")) return;
    var currentSlug = selectedSlug();
    var courses = (data.classes || [])
      .filter(isOpenClass)
      .filter(function (course) { return course.slug !== currentSlug && course.id !== currentSlug; })
      .slice(0, 6);
    if (!courses.length) return;

    var card = document.createElement("section");
    card.id = "otherAvailableClasses";
    card.className = "card other-classes-card";
    card.innerHTML = "<div><h2>Other available classes</h2><p>Students can also check these classes before registering.</p></div><div class='other-classes-grid'>" +
      courses.map(function (course) {
        var slug = course.slug || cleanSlug(course.title);
        return "<article class='other-class-item'><strong>" + course.title + "</strong><div class='other-class-meta'>" +
          "Starts: " + formatDate(course.startDate) + "<br>" +
          "Time: " + classTime(course) + "<br>" +
          "Fee: " + formatMoney(course.tuitionGhs) +
          "</div><div class='other-class-actions'><a class='button' href='" + detailsUrl(slug) + "'>View details</a><a class='button primary' href='" + formUrl(slug) + "'>Register</a></div></article>";
      }).join("") + "</div>";

    var anchor = document.getElementById("class-summary") || document.querySelector(".class-main-card") || document.querySelector(".hero");
    if (anchor) anchor.insertAdjacentElement("afterend", card);
  }

  function getCurrentCourse(data) {
    if (!data || !Array.isArray(data.classes)) return null;
    var titleEl = document.getElementById("classTitle");
    var title = titleEl ? titleEl.textContent.trim() : "";
    var slug = selectedSlug();
    return data.classes.find(function (course) {
      return course.slug === slug || course.id === slug || course.title === title;
    }) || null;
  }

  function syncFeesForCurrentClass(data) {
    if (!isDetailPage() && !isOpenMode()) return;
    var source = data || cachedClassData;
    var course = getCurrentCourse(source);
    if (!course || !course.tuitionGhs) return;

    var full = Number(course.tuitionGhs || 0);
    var minimum = Number(source && source.payment && source.payment.minimumInstallmentGhs ? source.payment.minimumInstallmentGhs : 2000);
    var first = Math.min(full, minimum);
    var balance = Math.max(full - first, 0);
    var fullText = formatMoney(full);
    var firstText = formatMoney(first);
    var balanceText = formatMoney(balance);

    var stats = document.getElementById("stats");
    if (stats) {
      stats.innerHTML = "<div class='stat'><span>Recommended full payment</span><b>" + fullText + "</b></div><div class='stat'><span>Access with full payment</span><b>6 months</b></div><div class='stat'><span>Installment starter</span><b>" + firstText + "</b></div>";
    }

    var paymentCard = document.getElementById("paymentGuidanceCard");
    if (paymentCard) {
      paymentCard.innerHTML = "<h3>Payment options</h3><div class='payment-option-grid'><div class='payment-option recommended'><strong>Best option: Pay full " + fullText + "</strong><p>You get 6 months Falowen access. This helps if your class ends but you still need time to prepare for exams or revise before your exam date.</p></div><div class='payment-option'><strong>Installment: Start with " + firstText + "</strong><p>This gives only 1 month access. The balance of " + balanceText + " must be paid after one month, otherwise access and the contract can be terminated.</p></div></div>";
    }

    var agreementList = document.getElementById("agreementList");
    if (agreementList) {
      var items = Array.from(agreementList.querySelectorAll("li"));
      if (items[0]) items[0].innerHTML = "<strong>Payment Amount:</strong> The full course fee is " + fullText + ". Full payment is recommended because it gives the student 6 months access to Falowen, including access after the live class ends.";
      if (items[1]) items[1].innerHTML = "<strong>Payment Schedule:</strong> The student may pay the full fee of " + fullText + ", or start with " + firstText + ". The " + firstText + " installment gives only 1 month access. The remaining balance of " + balanceText + " must be paid after one month; otherwise access may be revoked and the contract may be terminated.";
      if (items[3]) items[3].innerHTML = "<strong>Class Duration & Contract Term:</strong> Full payment gives a 6-month Falowen access period from enrollment. This access continues after the scheduled class ends, helping students revise and prepare when their exam date is later than the class end date.";
    }
  }

  function loadOtherClasses() {
    if (!isDetailPage() && !isOpenMode()) return;
    fetch("/classes/classes-data.json")
      .then(function (response) { return response.json(); })
      .then(function (data) {
        cachedClassData = data;
        renderOtherClasses(data);
        syncFeesForCurrentClass(data);
      })
      .catch(function () {});
  }

  function watchClassSwitches() {
    if ((!isDetailPage() && !isOpenMode()) || window.__falowenWatchingClassSwitches) return;
    window.__falowenWatchingClassSwitches = true;
    var lastTitle = "";
    window.setInterval(function () {
      var titleEl = document.getElementById("classTitle");
      var title = titleEl ? titleEl.textContent.trim() : "";
      if (title && title !== lastTitle) {
        lastTitle = title;
        window.setTimeout(function () { syncFeesForCurrentClass(cachedClassData); }, 80);
        window.setTimeout(function () { syncFeesForCurrentClass(cachedClassData); }, 450);
      }
    }, 350);
  }

  function ensureReviewsAndFooter() {
    if (!isClassArea()) return;
    var page = document.querySelector(".page");
    if (!page) return;

    var reviews = document.getElementById("studentReviewsCard");
    if (reviews) reviews.style.display = "grid";

    var footer = document.getElementById("classBrochureFooter");
    if (!footer) {
      footer = document.createElement("footer");
      footer.id = "classBrochureFooter";
      footer.className = "brochure-footer";
      footer.innerHTML = "<div><h2>Learn Language Education Academy</h2><p>Learn German with structured classes, tutor support, Falowen app practice, and clear class schedules.</p></div><nav class='brochure-footer-links' aria-label='Learn Language Education Academy links'><a href='https://www.learngermanghana.com/tutors' target='_blank' rel='noreferrer'>Tutors</a><a href='https://www.learngermanghana.com/blog' target='_blank' rel='noreferrer'>Blog</a><a href='https://www.learngermanghana.com/about' target='_blank' rel='noreferrer'>About us</a><a href='https://www.google.com/maps/search/?api=1&query=Learn%20Language%20Education%20Academy%20Awoshie%20Accra' target='_blank' rel='noreferrer'>Find us on Google Maps</a></nav>";
      page.appendChild(footer);
    }
    footer.style.display = "grid";
  }

  function run() {
    protectLeadLandingUrl();
    addStyles();
    updateHeroForForm();
    improveLeadFormText();
    updateDetailButtons();
    loadOtherClasses();
    watchClassSwitches();
    syncFeesForCurrentClass(cachedClassData);
    ensureReviewsAndFooter();
  }

  protectLeadLandingUrl();
  redirectAfterLeadSubmit();
  run();
  window.addEventListener("load", run);
  [100, 350, 800, 1500, 2500, 4000].forEach(function (delay) { window.setTimeout(run, delay); });
})();