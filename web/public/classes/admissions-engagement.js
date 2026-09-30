(function () {
  var params = new URLSearchParams(window.location.search);
  var ref = String(params.get("ref") || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
  if (ref.length < 8) {
    try {
      ref = sessionStorage.getItem("falowen:admissions-ref") || "";
      if (ref.length < 8) {
        ref = "public_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 12);
        sessionStorage.setItem("falowen:admissions-ref", ref);
      }
    } catch (error) {
      ref = "public_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 12);
    }
  }

  var classSlug = String(params.get("class") || "").trim();
  if (!classSlug) {
    var match = window.location.pathname.match(/^\/classes\/([^/]+)/i);
    classSlug = match ? match[1] : "";
  }

  function track(event) {
    if (!event || !ref) return;
    fetch("/api/public/admissions-engagement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        ref: ref,
        event: event,
        classSlug: classSlug,
        source: "class-brochure",
        path: window.location.pathname,
      }),
    }).catch(function () {});
  }

  function preserveContext(anchor, source) {
    if (!anchor || !anchor.href) return;
    try {
      var url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (ref) url.searchParams.set("ref", ref);
      if (classSlug) url.searchParams.set("class", classSlug);
      url.searchParams.set("source", source || "class-brochure");
      var nextHref = url.pathname + url.search + url.hash;
      if (anchor.getAttribute("href") !== nextHref) anchor.setAttribute("href", nextHref);
    } catch (error) {}
  }

  function ensureVisitorGuideLink() {
    if (document.getElementById("brochureVisitorGuideLink")) return;
    var host = document.querySelector(".hero-actions");
    if (!host) return;
    var link = document.createElement("a");
    link.id = "brochureVisitorGuideLink";
    link.className = "button";
    link.textContent = "About the school & how Falowen works";
    link.href = "/visitor-guide";
    preserveContext(link, "class-brochure");
    host.appendChild(link);
  }

  function wire() {
    ensureVisitorGuideLink();

    document.querySelectorAll('a[href*="/signup"], #payHero, #payLink').forEach(function (anchor) {
      preserveContext(anchor, "class-brochure");
      if (anchor.dataset.admissionsRegistrationWired) return;
      anchor.dataset.admissionsRegistrationWired = "1";
      anchor.addEventListener("click", function () { track("registration_click"); });
    });

    var guide = document.getElementById("brochureVisitorGuideLink");
    if (guide) preserveContext(guide, "class-brochure");
  }

  track("brochure_open");
  wire();
  window.addEventListener("load", wire);
  new MutationObserver(wire).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
  [150, 500, 1200, 2500].forEach(function (delay) { window.setTimeout(wire, delay); });
})();