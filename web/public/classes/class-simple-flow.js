(function () {
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

  function style() {
    if (document.getElementById("simpleClassFlowStyles")) return;
    var tag = document.createElement("style");
    tag.id = "simpleClassFlowStyles";
    tag.textContent = "body.simple-classes-form .page > section:not(.hero):not(.lead-capture-card):not(#studentReviewsCard),body.simple-classes-form .page > .grid,body.simple-classes-form .page > .card:not(.lead-capture-card):not(#studentReviewsCard),body.simple-classes-form #brochureToc,body.simple-classes-form #class-summary,body.simple-classes-form #meeting-times-section,body.simple-classes-form #class-schedule-section,body.simple-classes-form #payment-agreement-section,body.simple-classes-form .hero-actions,body.simple-classes-form .footer{display:none!important}body.simple-classes-form .hero{padding:14px 16px;gap:8px}body.simple-classes-form .hero h1{font-size:clamp(25px,8vw,36px)}body.simple-classes-form .hero p{font-size:14px;line-height:1.5}.simple-register-note{margin-top:10px;color:#334155;font-size:14px;line-height:1.55}.simple-register-note strong{color:#0f172a}";
    document.head.appendChild(tag);
  }

  function setupFormPage() {
    if (!isFormPage()) return;
    document.body.classList.add("simple-classes-form");
    var eyebrow = document.querySelector(".hero .eyebrow");
    var title = document.querySelector(".hero h1");
    var text = document.querySelector(".hero p");
    if (eyebrow) eyebrow.textContent = "FALOWEN GERMAN CLASSES";
    if (title) title.textContent = "Register your interest in a German class";
    if (text) text.textContent = "Fill your name, email, phone number, and the class or level you want. We will save it to the lead sheet and then open the selected class information page.";

    var timer = window.setInterval(function () {
      var cardTitle = document.querySelector("#leadCaptureCard h2");
      var cardText = document.querySelector("#leadCaptureCard p");
      var submit = document.querySelector("#leadCaptureForm button[type='submit']");
      var skip = document.getElementById("skipLeadGate");
      if (cardTitle) cardTitle.textContent = "Fill the form to continue";
      if (cardText) cardText.textContent = "No payment question here. We only collect your contact details and selected class for follow-up.";
      if (submit) submit.textContent = "Save and show class information";
      if (skip) skip.style.display = "none";
    }, 250);
    window.setTimeout(function () { window.clearInterval(timer); }, 5000);
  }

  function redirectOnSubmit() {
    document.addEventListener("submit", function (event) {
      var form = event.target;
      if (!form || form.id !== "leadCaptureForm" || !isFormPage()) return;
      var select = form.querySelector("#leadClass");
      var slug = select && select.value ? select.value : selectedSlug();
      if (!slug) return;
      var status = document.getElementById("leadStatus");
      if (status && !status.classList.contains("error")) status.textContent = "Opening selected class information...";
      window.setTimeout(function () { window.location.assign(detailsUrl(slug)); }, 1500);
    }, true);
  }

  function setupDetailPage() {
    if (!isDetailPage()) return;
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
    var mainCta = document.getElementById("mainSignupCta");
    if (mainCta) {
      mainCta.href = formUrl(slug);
      mainCta.textContent = "Register Now";
    }
  }

  function run() {
    style();
    setupFormPage();
    setupDetailPage();
  }

  redirectOnSubmit();
  run();
  window.addEventListener("load", run);
  [100, 350, 800, 1500, 2500].forEach(function (delay) { window.setTimeout(run, delay); });
})();