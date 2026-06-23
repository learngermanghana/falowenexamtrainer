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
    var select = document.getElementById("leadClass");
    if (select && select.value) return cleanSlug(select.value);
    var url = new URL(window.location.href);
    var fromQuery = url.searchParams.get("class") || url.searchParams.get("level") || url.searchParams.get("slug");
    if (fromQuery) return cleanSlug(fromQuery);
    var match = window.location.pathname.match(/^\/classes\/([^/]+)\/?$/);
    return match ? match[1] : "";
  }

  function signupUrl(slug) {
    return slug ? "/signup/?class=" + encodeURIComponent(slug) : "/signup/";
  }

  function setText(element, value) {
    if (element && element.textContent !== value) element.textContent = value;
  }

  function style() {
    if (document.getElementById("simpleClassFlowStyles")) return;
    var tag = document.createElement("style");
    tag.id = "simpleClassFlowStyles";
    tag.textContent =
      "body.simple-classes-form .page > section:not(.hero):not(.lead-capture-card):not(#studentReviewsCard)," +
      "body.simple-classes-form .page > .grid," +
      "body.simple-classes-form .page > .card:not(.lead-capture-card):not(#studentReviewsCard)," +
      "body.simple-classes-form #brochureToc," +
      "body.simple-classes-form #class-summary," +
      "body.simple-classes-form #meeting-times-section," +
      "body.simple-classes-form #class-schedule-section," +
      "body.simple-classes-form #payment-agreement-section," +
      "body.simple-classes-form .hero-actions," +
      "body.simple-classes-form .footer{display:none!important}" +
      "body.simple-classes-form .hero{padding:14px 16px;gap:10px}" +
      "body.simple-classes-form .hero h1{font-size:clamp(25px,8vw,36px)}" +
      "body.simple-classes-form .hero p{font-size:15px;line-height:1.55}" +
      ".simple-class-steps{display:grid;grid-template-columns:1fr;gap:8px;margin-top:10px}" +
      ".simple-class-step{display:flex;align-items:center;gap:9px;border:1px solid #dbeafe;background:#f8fbff;border-radius:12px;padding:9px 10px;color:#1e293b;font-size:13px;font-weight:750;line-height:1.35}" +
      ".simple-class-step-number{display:grid;place-items:center;flex:0 0 28px;width:28px;height:28px;border-radius:999px;background:#1455f5;color:#fff;font-size:12px;font-weight:900}" +
      "body.simple-classes-form .lead-actions{display:grid!important;grid-template-columns:1fr!important;gap:9px!important}" +
      ".lead-register-now{width:100%;min-height:50px;background:#0f766e!important;border-color:#0f766e!important;color:#fff!important;text-decoration:none!important}" +
      "body.simple-classes-form .lead-help,body.simple-classes-form .lead-open-link,body.simple-classes-form .lead-small-actions{display:none!important}" +
      "@media(min-width:760px){.simple-class-steps{grid-template-columns:repeat(4,minmax(0,1fr))}.simple-class-step{align-items:flex-start}body.simple-classes-form .lead-actions{grid-template-columns:repeat(3,minmax(0,1fr))!important}}";
    document.head.appendChild(tag);
  }

  function ensureSteps() {
    var hero = document.querySelector(".hero");
    if (!hero || hero.querySelector(".simple-class-steps")) return;
    var steps = document.createElement("div");
    steps.className = "simple-class-steps";
    steps.setAttribute("aria-label", "Four steps to view a class brochure");
    steps.innerHTML =
      '<div class="simple-class-step"><span class="simple-class-step-number">1</span><span>Enter your full name</span></div>' +
      '<div class="simple-class-step"><span class="simple-class-step-number">2</span><span>Add your phone number and email</span></div>' +
      '<div class="simple-class-step"><span class="simple-class-step-number">3</span><span>Choose your German level and class</span></div>' +
      '<div class="simple-class-step"><span class="simple-class-step-number">4</span><span>Save and open the class brochure</span></div>';
    hero.appendChild(steps);
  }

  function ensureRegisterButton() {
    var form = document.getElementById("leadCaptureForm");
    if (!form) return;
    var actions = form.querySelector(".lead-actions");
    if (!actions) return;
    var register = document.getElementById("leadRegisterNow");
    if (!register) {
      register = document.createElement("a");
      register.id = "leadRegisterNow";
      register.className = "button lead-register-now";
      register.textContent = "Register right away";
      var whatsapp = actions.querySelector(".lead-whatsapp");
      if (whatsapp) actions.insertBefore(register, whatsapp);
      else actions.appendChild(register);
    }
    var nextHref = signupUrl(selectedSlug());
    if (register.getAttribute("href") !== nextHref) register.setAttribute("href", nextHref);
  }

  function removeTechnicalCopy() {
    var help = document.querySelector("#leadCaptureForm .lead-help");
    if (help) help.remove();
    var openLink = document.getElementById("leadOpenClassLink");
    if (openLink) openLink.remove();
    var skip = document.getElementById("skipLeadGate");
    if (skip) {
      var skipActions = skip.closest ? skip.closest(".lead-small-actions") : null;
      if (skipActions) skipActions.remove();
      else skip.remove();
    }
  }

  function simplifyStatusCopy() {
    var status = document.getElementById("leadStatus");
    if (!status) return;
    var text = String(status.textContent || "");
    var next = text
      .replace(/selected class information/gi, "class brochure")
      .replace(/class information/gi, "class brochure")
      .replace(/Saving enquiry/gi, "Saving your details");
    setText(status, next);
  }

  function setupFormPage() {
    if (!isFormPage()) return;
    document.body.classList.add("simple-classes-form");
    var eyebrow = document.querySelector(".hero .eyebrow");
    var title = document.querySelector(".hero h1");
    var text = document.querySelector(".hero p");
    setText(eyebrow, "FALOWEN GERMAN CLASSES");
    setText(title, "Choose the German class you want");
    setText(text, "Complete four simple steps to view the brochure for your preferred class.");
    ensureSteps();

    var cardTitle = document.querySelector("#leadCaptureCard h2");
    var cardText = document.querySelector("#leadCaptureCard p");
    var submit = document.querySelector("#leadCaptureForm button[type='submit']");
    var classLabel = document.querySelector("label[for='leadClass']");
    setText(cardTitle, "Enter your details to continue");
    setText(cardText, "Choose your level and class, then open the brochure with the full class details.");
    setText(classLabel, "German level and class");
    if (submit && !submit.disabled) setText(submit, "Save and view class brochure");

    removeTechnicalCopy();
    ensureRegisterButton();
    simplifyStatusCopy();
  }

  function setupDetailPage() {
    if (!isDetailPage()) return;
    document.body.classList.remove("lead-gate-active", "simple-classes-form");
    var leadCard = document.getElementById("leadCaptureCard");
    if (leadCard) leadCard.remove();
    var slug = selectedSlug();
    document.querySelectorAll("a[href^='/signup'],a[href^='/classes/?class']").forEach(function (link) {
      var href = signupUrl(slug);
      if (link.getAttribute("href") !== href) link.setAttribute("href", href);
      setText(link, "Register Now");
      link.removeAttribute("target");
      link.removeAttribute("rel");
    });
  }

  function run() {
    style();
    setupFormPage();
    setupDetailPage();
  }

  run();
  window.addEventListener("load", run);
  document.addEventListener("change", function (event) {
    if (event.target && event.target.id === "leadClass") ensureRegisterButton();
  });
  [100, 350, 800, 1500, 2500, 5000].forEach(function (delay) { window.setTimeout(run, delay); });
})();
