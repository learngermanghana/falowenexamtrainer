(function () {
  var CONTEXT_KEY = "falowen:public-funnel-context";
  var FIRST_TOUCH_KEY = "falowen:public-funnel-first-touch";
  var EVENTS_KEY = "falowen:public-funnel-events";
  var VIDEO_ID = "CFkrrVxhdL4";
  var LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycbzrUe3IC5w24Rmf_Ed-8HmdKzV3mn0BQyg2qsaveOSQOYunQj89MM23mgDhjGbsMa2gSA/exec";
  var ATTR_KEYS = ["source", "src", "video", "lesson", "level", "class", "leadId", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  function safeParse(value, fallback) {
    try { return value ? JSON.parse(value) : fallback; } catch (error) { return fallback; }
  }

  function read(key, fallback) {
    try { return safeParse(localStorage.getItem(key), fallback); } catch (error) { return fallback; }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) {}
  }

  function queryContext() {
    var params = new URLSearchParams(window.location.search);
    return ATTR_KEYS.reduce(function (acc, key) {
      var value = params.get(key);
      if (value) acc[key] = value;
      return acc;
    }, {});
  }

  function remember(extra) {
    var previous = read(CONTEXT_KEY, {});
    var next = Object.assign({}, previous, queryContext(), extra || {}, {
      sessionId: previous.sessionId || "funnel_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9),
      landingPath: previous.landingPath || window.location.pathname,
      lastPath: window.location.pathname,
      updatedAt: new Date().toISOString(),
    });
    if (!read(FIRST_TOUCH_KEY, null)) write(FIRST_TOUCH_KEY, Object.assign({}, next, { firstSeenAt: new Date().toISOString() }));
    write(CONTEXT_KEY, next);
    return next;
  }

  function context() {
    return Object.assign({}, read(FIRST_TOUCH_KEY, {}), read(CONTEXT_KEY, {}), queryContext());
  }

  function journeyBase() {
    var existing = context();
    var source = existing.source || existing.src || "classes_video";
    var video = existing.video || existing.lesson || VIDEO_ID;
    return {
      source: source,
      video: video,
      utm_source: existing.utm_source || (source === "classes_video" ? "youtube" : source),
      utm_medium: existing.utm_medium || "classes_video",
      utm_campaign: existing.utm_campaign || "public_funnel",
    };
  }

  function track(stage, details) {
    var event = Object.assign({
      event: "falowen_public_funnel",
      stage: stage,
      at: new Date().toISOString(),
      path: window.location.pathname,
    }, remember(), details || {});
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(event);
    var events = read(EVENTS_KEY, []);
    write(EVENTS_KEY, [event].concat(events).slice(0, 100));
  }

  function buildUrl(path, extra) {
    var data = Object.assign({}, context(), extra || {});
    var url = new URL(path, window.location.origin);
    ATTR_KEYS.forEach(function (key) {
      if (data[key] !== undefined && data[key] !== null && String(data[key]).trim()) {
        url.searchParams.set(key, String(data[key]));
      }
    });
    return url.pathname + url.search + url.hash;
  }

  function addVisibilityFix() {
    if (document.getElementById("falowenFunnelVisibilityFix")) return;
    var style = document.createElement("style");
    style.id = "falowenFunnelVisibilityFix";
    style.textContent = "body.simple-classes-form .page>section.intro-video,body.simple-classes-form .page>section.funnel-actions{display:grid!important}.funnel-actions{margin:0 0 16px;gap:10px}.funnel-action-links{display:flex;gap:10px;flex-wrap:wrap}.funnel-action-links .button{flex:1 1 190px}.funnel-actions p{margin:0;color:#475569}@media(max-width:600px){.funnel-action-links{display:grid}.funnel-action-links .button{width:100%}}";
    document.head.appendChild(style);
  }

  function updateLinks() {
    var base = journeyBase();
    remember(Object.assign({}, base, { lastStage: "classes" }));

    var placement = document.getElementById("funnelPlacementLink");
    var classes = document.getElementById("funnelClassLink");
    var application = document.getElementById("funnelApplicationLink");
    if (placement) placement.href = buildUrl("/placement-test", Object.assign({}, base, { utm_content: "placement_test" }));
    if (classes) classes.href = buildUrl("/classes/", Object.assign({}, base, { utm_content: "choose_class" })) + "#leadCaptureCard";
    if (application) application.href = buildUrl("/signup/", Object.assign({}, base, { utm_content: "continue_application" }));
  }

  function updateIncompleteWhatsApp(form) {
    if (!form) return;
    var attribution = journeyBase();
    var name = form.querySelector("#leadName")?.value.trim() || "";
    var email = form.querySelector("#leadEmail")?.value.trim() || "";
    var phone = form.querySelector("#leadPhone")?.value.trim() || "";
    var classSlug = form.querySelector("#leadClass")?.value || "";
    var link = form.querySelector(".lead-whatsapp");
    if (!link) return;
    var text = "Hello Falowen, I started a class enquiry but have not completed it.";
    if (name) text += " My name is " + name + ".";
    if (email) text += " Email: " + email + ".";
    if (phone) text += " Phone: " + phone + ".";
    if (classSlug) text += " Selected class: " + classSlug + ".";
    if (attribution.video) text += " I came from YouTube lesson " + attribution.video + ".";
    text += " Please help me continue.";
    link.href = "https://wa.me/233205706589?text=" + encodeURIComponent(text);
  }

  function submitAttributedClassInterest(form) {
    var data = context();
    var lead = {
      id: "journey_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      createdAt: new Date().toISOString(),
      source: "public-class-interest",
      status: "class_interest_submitted",
      name: form.querySelector("#leadName")?.value.trim() || "",
      phone: form.querySelector("#leadPhone")?.value.trim() || "",
      email: form.querySelector("#leadEmail")?.value.trim() || "",
      classSlug: form.querySelector("#leadClass")?.value || "",
      className: form.querySelector("#leadClass option:checked")?.textContent || "",
      level: new URLSearchParams(window.location.search).get("level") || data.level || "",
      paymentStatus: "not_requested",
      followUpCount: 0,
      nextFollowUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      attribution: data,
    };
    fetch(LEAD_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "saveLead", lead: lead }),
    }).catch(function () {});
  }

  function wireInteractions() {
    var base = journeyBase();
    [
      ["funnelPlacementLink", "classes_video_placement_click"],
      ["funnelClassLink", "classes_video_class_click"],
      ["funnelApplicationLink", "classes_video_application_click"],
    ].forEach(function (entry) {
      var element = document.getElementById(entry[0]);
      if (element && !element.dataset.funnelWired) {
        element.dataset.funnelWired = "1";
        element.addEventListener("click", function () { track(entry[1], { video: base.video, source: base.source }); });
      }
    });

    var form = document.getElementById("leadCaptureForm");
    if (form && !form.dataset.funnelWired) {
      form.dataset.funnelWired = "1";
      updateIncompleteWhatsApp(form);
      form.addEventListener("input", function () { updateIncompleteWhatsApp(form); });
      form.addEventListener("change", function () { updateIncompleteWhatsApp(form); });
      form.addEventListener("submit", function () {
        var attribution = journeyBase();
        track("class_interest_submit", { video: attribution.video, source: attribution.source, classSlug: form.querySelector("#leadClass")?.value || "" });
        submitAttributedClassInterest(form);
      }, true);
    }
  }

  function run() {
    addVisibilityFix();
    updateLinks();
    wireInteractions();
    var video = document.querySelector(".intro-video iframe");
    if (video) video.style.display = "block";
  }

  var initial = journeyBase();
  remember(Object.assign({}, initial, { lastStage: "classes" }));
  track("classes_page_view", { video: initial.video, source: initial.source });
  run();
  window.addEventListener("load", run);
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
  [100, 350, 800, 1500, 3000].forEach(function (delay) { window.setTimeout(run, delay); });
})();
