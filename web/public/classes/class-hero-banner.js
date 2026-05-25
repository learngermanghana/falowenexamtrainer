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

  function addStyles() {
    if (document.getElementById("simpleClassFlowStyles")) return;
    var style = document.createElement("style");
    style.id = "simpleClassFlowStyles";
    style.textContent = "body.simple-classes-form .page>section:not(.hero):not(.lead-capture-card):not(#studentReviewsCard),body.simple-classes-form .page>.grid,body.simple-classes-form .page>.card:not(.lead-capture-card):not(#studentReviewsCard),body.simple-classes-form #brochureToc,body.simple-classes-form #class-summary,body.simple-classes-form #meeting-times-section,body.simple-classes-form #class-schedule-section,body.simple-classes-form #payment-agreement-section,body.simple-classes-form .hero-actions,body.simple-classes-form .footer{display:none!important}body.simple-classes-form .hero{padding:14px 16px!important;gap:8px!important;border-radius:18px!important}body.simple-classes-form .hero h1{font-size:clamp(25px,8vw,36px)!important}body.simple-classes-form .hero p{font-size:14px!important;line-height:1.5!important}.hero{padding-top:14px!important;padding-bottom:14px!important}.hero-visual-card{min-height:auto!important}.simple-register-note{margin-top:10px;color:#334155;font-size:14px;line-height:1.55}";
    document.head.appendChild(style);
  }

  function updateHeroForForm() {
    if (!isFormPage()) return;
    document.body.classList.add("simple-classes-form");
    var eyebrow = document.querySelector(".hero .eyebrow");
    var title = document.querySelector(".hero h1");
    var text = document.querySelector(".hero p");
    if (eyebrow) eyebrow.textContent = "FALOWEN GERMAN CLASSES";
    if (title) title.textContent = "Register your interest in a German class";
    if (text) text.textContent = "Fill your name, email, phone number, and the class or level you want. We will save it to the lead sheet and then open the selected class information page.";
  }

  function improveLeadFormText() {
    if (!isFormPage()) return;
    var h2 = document.querySelector("#leadCaptureCard h2");
    var p = document.querySelector("#leadCaptureCard p");
    var button = document.querySelector("#leadCaptureForm button[type='submit']");
    var skip = document.getElementById("skipLeadGate");
    if (h2) h2.textContent = "Fill the form to continue";
    if (p) p.textContent = "No payment question here. We only collect your contact details and selected class for follow-up.";
    if (button) button.textContent = "Save and show class information";
    if (skip) skip.style.display = "none";
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
        window.location.assign(detailsUrl(slug));
      }, 900);
    }, true);
  }

  function updateDetailButtons() {
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
    var cta = document.getElementById("mainSignupCta");
    if (cta) {
      cta.href = formUrl(slug);
      cta.textContent = "Register Now";
    }
  }

  function run() {
    addStyles();
    updateHeroForForm();
    improveLeadFormText();
    updateDetailButtons();
  }

  redirectAfterLeadSubmit();
  run();
  window.addEventListener("load", run);
  [100, 350, 800, 1500, 2500].forEach(function (delay) { window.setTimeout(run, delay); });
})();
