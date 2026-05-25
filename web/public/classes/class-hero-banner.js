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

  function protectLeadLandingUrl() {
    if (window.__falowenProtectClassesLeadLanding) return;
    window.__falowenProtectClassesLeadLanding = true;
    var originalReplaceState = history.replaceState.bind(history);
    var originalPushState = history.pushState.bind(history);

    function shouldBlockUrl(url) {
      return isFormPage() && typeof url === "string" && /^\/classes\/[^/]+\/?$/.test(url);
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
    style.textContent = "body.simple-classes-form .page>section:not(.hero):not(.lead-capture-card):not(#studentReviewsCard),body.simple-classes-form .page>.grid,body.simple-classes-form .page>.card:not(.lead-capture-card):not(#studentReviewsCard),body.simple-classes-form #brochureToc,body.simple-classes-form #class-summary,body.simple-classes-form #meeting-times-section,body.simple-classes-form #class-schedule-section,body.simple-classes-form #payment-agreement-section,body.simple-classes-form .hero-actions,body.simple-classes-form .footer{display:none!important}body.simple-classes-form .lead-small-actions{display:none!important}body.simple-classes-form .hero{padding:14px 16px!important;gap:8px!important;border-radius:18px!important}body.simple-classes-form .hero h1{font-size:clamp(25px,8vw,36px)!important}body.simple-classes-form .hero p{font-size:14px!important;line-height:1.5!important}.hero{padding-top:14px!important;padding-bottom:14px!important}.hero-visual-card{min-height:auto!important}.other-classes-card{margin-top:16px;display:grid;gap:12px}.other-classes-card h2{margin:0;font-size:20px}.other-classes-card p{margin:0;color:#475569;font-size:14px;line-height:1.55}.other-classes-grid{display:grid;gap:10px}.other-class-item{border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;padding:12px;display:grid;gap:8px}.other-class-item strong{color:#0f172a;font-size:15px}.other-class-meta{color:#475569;font-size:13px;line-height:1.45}.other-class-actions{display:grid;grid-template-columns:1fr;gap:8px}.other-class-actions a{min-height:40px;border-radius:12px;padding:10px 12px;font-size:13px}@media(min-width:760px){.other-classes-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.other-class-actions{grid-template-columns:1fr 1fr}}";
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
        window.location.assign(detailsUrl(slug));
      }, 500);
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

  function renderOtherClasses(data) {
    if (!isDetailPage() || document.getElementById("otherAvailableClasses")) return;
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

  function loadOtherClasses() {
    if (!isDetailPage()) return;
    fetch("/classes/classes-data.json")
      .then(function (response) { return response.json(); })
      .then(renderOtherClasses)
      .catch(function () {});
  }

  function run() {
    protectLeadLandingUrl();
    addStyles();
    updateHeroForForm();
    improveLeadFormText();
    updateDetailButtons();
    loadOtherClasses();
  }

  protectLeadLandingUrl();
  redirectAfterLeadSubmit();
  run();
  window.addEventListener("load", run);
  [100, 350, 800, 1500, 2500].forEach(function (delay) { window.setTimeout(run, delay); });
})();
