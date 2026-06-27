(function () {
  function cleanSlug(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function selectedSlug() {
    var url = new URL(window.location.href);
    var fromQuery = url.searchParams.get("class") || url.searchParams.get("slug") || url.searchParams.get("level");
    if (fromQuery) return cleanSlug(fromQuery);
    var match = window.location.pathname.match(/^\/classes\/([^/]+)\/?$/);
    return match ? cleanSlug(match[1]) : "";
  }

  function hasMatchingSubmittedLead() {
    try {
      var lead = JSON.parse(localStorage.getItem("falowen:last-class-lead") || "null");
      if (!lead) return false;
      var leadSlug = cleanSlug(lead.classSlug || lead.classId || lead.className || "");
      var slug = selectedSlug();
      return Boolean(slug && leadSlug && slug === leadSlug);
    } catch (error) {
      return false;
    }
  }

  function isPostLeadView() {
    var path = window.location.pathname.replace(/\/+$/, "") || "/";
    var isClassArea = path === "/classes" || path === "/classes/index.html" || /^\/classes\/[^/]+$/.test(path);
    if (!isClassArea || !selectedSlug()) return false;
    var url = new URL(window.location.href);
    return url.searchParams.get("open") === "1" || Boolean(url.searchParams.get("leadId")) || hasMatchingSubmittedLead();
  }

  function injectStyles() {
    if (document.getElementById("postLeadFocusStyles")) return;
    var style = document.createElement("style");
    style.id = "postLeadFocusStyles";
    style.textContent = [
      "body.post-lead-focus .intro-video",
      "body.post-lead-focus .funnel-actions",
      "body.post-lead-focus .hero",
      "body.post-lead-focus #brochureToc",
      "body.post-lead-focus #otherAvailableClasses",
      "body.post-lead-focus .other-classes-card",
      "body.post-lead-focus .post-lead-extra-cta",
      "body.post-lead-focus .post-lead-tabs-card{display:none!important}",
      "body.post-lead-focus .page{padding-top:8px!important}",
      "body.post-lead-focus .class-main-card{margin-top:0!important}",
      "body.post-lead-focus #mainSignupCta{display:inline-flex!important;width:100%!important;min-height:52px!important}",
      "@media(max-width:520px){body.post-lead-focus .page{padding-left:8px!important;padding-right:8px!important}}"
    ].join(",").replace(",@media", "}@media").replace("{display:none!important},body", ",body");
    // Replace the compact generated string with valid CSS while keeping this file dependency-free.
    style.textContent = `
      body.post-lead-focus .intro-video,
      body.post-lead-focus .funnel-actions,
      body.post-lead-focus .hero,
      body.post-lead-focus #brochureToc,
      body.post-lead-focus #otherAvailableClasses,
      body.post-lead-focus .other-classes-card,
      body.post-lead-focus .post-lead-extra-cta,
      body.post-lead-focus .post-lead-tabs-card { display: none !important; }
      body.post-lead-focus .page { padding-top: 8px !important; }
      body.post-lead-focus .class-main-card { margin-top: 0 !important; }
      body.post-lead-focus #mainSignupCta { display: inline-flex !important; width: 100% !important; min-height: 52px !important; }
      @media (max-width: 520px) {
        body.post-lead-focus .page { padding-left: 8px !important; padding-right: 8px !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function hideTopAndOtherClassContent() {
    [
      ".intro-video",
      ".funnel-actions",
      ".hero",
      "#brochureToc",
      "#otherAvailableClasses",
      ".other-classes-card"
    ].forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (node) {
        node.hidden = true;
        node.setAttribute("aria-hidden", "true");
      });
    });

    var tabs = document.getElementById("classTabs");
    var tabsCard = tabs && tabs.closest ? tabs.closest("section.card") : null;
    if (tabsCard) {
      tabsCard.classList.add("post-lead-tabs-card");
      tabsCard.hidden = true;
    }
  }

  function moveSelectedClassFirst() {
    var page = document.querySelector("main.page") || document.querySelector(".page");
    var classCard = document.querySelector(".class-main-card") || document.getElementById("classTitle")?.closest(".card");
    if (!page || !classCard) return;
    if (page.firstElementChild !== classCard) page.insertBefore(classCard, page.firstElementChild);
    classCard.setAttribute("data-post-lead-priority", "true");
  }

  function keepOneRegisterButton() {
    var signupLinks = Array.from(document.querySelectorAll("a[href^='/signup']"));
    if (!signupLinks.length) return;

    var primary = document.getElementById("mainSignupCta")
      || signupLinks.find(function (link) { return Boolean(link.closest(".class-main-card")); })
      || signupLinks[0];

    signupLinks.forEach(function (link) {
      if (link === primary) {
        link.classList.remove("post-lead-extra-cta");
        link.hidden = false;
        link.removeAttribute("aria-hidden");
        link.textContent = "Register Now";
      } else {
        link.classList.add("post-lead-extra-cta");
        link.hidden = true;
        link.setAttribute("aria-hidden", "true");
      }
    });
  }

  function applyPostLeadFocus() {
    if (!isPostLeadView()) return;
    injectStyles();
    document.body.classList.add("post-lead-focus", "post-lead-class-detail");
    document.body.classList.remove("simple-classes-form", "lead-gate-active");
    var leadCard = document.getElementById("leadCaptureCard");
    if (leadCard) leadCard.remove();
    hideTopAndOtherClassContent();
    moveSelectedClassFirst();
    keepOneRegisterButton();
  }

  applyPostLeadFocus();
  window.addEventListener("load", applyPostLeadFocus);
  [50, 150, 350, 800, 1500, 3000, 5000].forEach(function (delay) {
    window.setTimeout(applyPostLeadFocus, delay);
  });

  if (isPostLeadView()) {
    var root = document.querySelector("main.page") || document.body;
    var scheduled = false;
    new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        applyPostLeadFocus();
      });
    }).observe(root, { childList: true, subtree: true });
  }
})();
