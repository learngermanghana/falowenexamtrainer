/*
 * Figma-inspired visual presentation for published Falowen class brochures.
 * The canonical course loader, payment agreement, schedule, FAQ, registration
 * and review components remain unchanged, and are reused below this hero.
 */
(function () {
  "use strict";

  var pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  var params = new URLSearchParams(window.location.search);
  var isClassPath = /^\/classes\/[^/]+$/.test(pathname) && pathname !== "/classes/index.html";
  var isOpenClass = params.get("open") === "1" || params.get("view") === "details" || params.get("details") === "1";
  if (!isClassPath && !isOpenClass) return;
  document.body.classList.add("figma-brochure-detail");

  var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var levelNames = {
    A1: "BEGINNER", A2: "ELEMENTARY", B1: "INTERMEDIATE",
    B2: "UPPER INTERMEDIATE", C1: "ADVANCED", C2: "PROFICIENT"
  };
  var titles = {
    A1: "Start speaking German with confidence.",
    A2: "Build confidence in everyday German.",
    B1: "Communicate independently in German.",
    B2: "Take your German further.",
    C1: "Express yourself confidently in advanced German.",
    C2: "Refine your German at the highest level."
  };

  function make(tag, cls, value) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (value !== undefined) el.textContent = value;
    return el;
  }

  function appendText(parent, tag, cls, text) {
    var el = make(tag, cls, text);
    parent.appendChild(el);
    return el;
  }

  function safeRegistrationLink() {
    var existing = document.getElementById("mainSignupCta");
    var href = existing?.getAttribute("href") || "";
    // The registration CTA must never send visitors to an arbitrary location.
    var slug = String(window.currentBrochureCourse?.slug || "");
    var fallback = "/signup/" + (slug ? "?class=" + encodeURIComponent(slug) : "");
    try {
      var target = new URL(href || fallback, window.location.origin);
      return target.origin === window.location.origin && target.pathname.startsWith("/signup")
        ? target.href
        : new URL(fallback, window.location.origin).href;
    } catch (_error) {
      return new URL(fallback, window.location.origin).href;
    }
  }

  function formatTime(value) {
    var parts = String(value || "").split(":").map(Number);
    if (parts.length < 2 || !Number.isInteger(parts[0]) || !Number.isInteger(parts[1])) {
      return String(value || "").trim();
    }
    return (parts[0] % 12 || 12) + ":" + String(parts[1]).padStart(2, "0") + (parts[0] >= 12 ? " pm" : " am");
  }

  function formatMeeting(course) {
    if (course.availability === "always" || course.isSelfLearning) {
      return { days: "Learn at your own pace", times: "No fixed live timetable" };
    }
    if (course.availability === "enquiry") {
      return { days: "Next class to be announced", times: "Schedule pending" };
    }
    var slots = Array.isArray(course.meetingDays) ? course.meetingDays.filter(function (slot) {
      return slot && slot.day;
    }) : [];
    if (!slots.length) return { days: "Meeting days to be announced", times: "Schedule pending" };

    var sorted = slots.slice().sort(function (a, b) {
      return dayNames.indexOf(a.day) - dayNames.indexOf(b.day);
    });
    var sameTime = sorted.every(function (slot) {
      return slot.startTime === sorted[0].startTime && slot.endTime === sorted[0].endTime;
    });
    var days = sorted.map(function (slot) { return slot.day; });
    var firstIndex = dayNames.indexOf(days[0]);
    var consecutive = firstIndex >= 0 && sorted.every(function (slot, i) {
      return dayNames.indexOf(slot.day) === firstIndex + i;
    });
    var dayLabel = consecutive && days.length >= 3
      ? days[0] + " to " + days[days.length - 1]
      : days.join(", ");
    var times = sameTime
      ? formatTime(sorted[0].startTime) + " – " + formatTime(sorted[0].endTime)
      : sorted.map(function (slot) {
          return slot.day + ": " + formatTime(slot.startTime) + " – " + formatTime(slot.endTime);
        }).join(" · ");
    return { days: dayLabel, times: times };
  }

  function enrollmentStatus(course) {
    if (course.availability === "always" || course.isSelfLearning) return "START ANYTIME";
    if (course.availability === "enquiry" || course.status === "closed") return "NEXT INTAKE — ENQUIRE";
    if (course.endDate && /^\d{4}-\d{2}-\d{2}$/.test(course.endDate) &&
        course.endDate < new Date().toISOString().slice(0, 10)) {
      return "NEXT INTAKE — ENQUIRE";
    }
    return "ENROLMENT OPEN";
  }

  function renderShell() {
    var page = document.querySelector("main.page");
    if (!page || document.getElementById("figmaBrochureHero")) return;

    var nav = make("header", "figma-brochure-nav hide-print");
    nav.id = "figmaBrochureNav";
    var navInner = make("div", "figma-brochure-nav-inner");
    var logo = make("a", "figma-brochure-logo");
    logo.href = "/";
    logo.setAttribute("aria-label", "Falowen home");
    appendText(logo, "span", "figma-brochure-logo-symbol", "LL");
    var logoCopy = make("span", "figma-brochure-logo-copy");
    appendText(logoCopy, "strong", "", "Learn Language");
    appendText(logoCopy, "small", "", "EDUCATION ACADEMY");
    logo.appendChild(logoCopy);
    navInner.appendChild(logo);

    var links = make("nav", "figma-brochure-links");
    links.setAttribute("aria-label", "Class brochure sections");
    [
      ["Overview", "#figmaBrochureHero"],
      ["Schedule", "#meeting-times-section"],
      ["Fees", "#classDecisionSummary"],
      ["Reviews", "#studentReviewsCard"],
      ["FAQs", "#faq-section"]
    ].forEach(function (item) {
      var link = make("a", "", item[0]);
      link.href = item[1];
      links.appendChild(link);
    });
    navInner.appendChild(links);
    var registerNav = make("a", "figma-brochure-nav-register", "Register now →");
    registerNav.id = "figmaBrochureNavRegister";
    registerNav.href = "/signup/";
    navInner.appendChild(registerNav);
    nav.appendChild(navInner);

    var hero = make("section", "figma-brochure-hero");
    hero.id = "figmaBrochureHero";
    hero.setAttribute("aria-labelledby", "figmaBrochureHeading");
    var content = make("div", "figma-brochure-hero-inner");
    var copy = make("div", "figma-brochure-copy");
    var tags = make("div", "figma-brochure-tags");
    var status = appendText(tags, "span", "figma-brochure-status", "CLASS INFORMATION");
    status.id = "figmaBrochureStatus";
    var levelPill = appendText(tags, "span", "figma-brochure-level", "GERMAN");
    levelPill.id = "figmaBrochureLevel";
    copy.appendChild(tags);

    var kicker = appendText(copy, "p", "figma-brochure-course", "GERMAN CLASS");
    kicker.id = "figmaBrochureCourse";
    var heading = appendText(copy, "h1", "", "Explore your German class.");
    heading.id = "figmaBrochureHeading";
    var intro = appendText(copy, "p", "figma-brochure-intro", "Live teaching, practice, and learning resources together in Falowen.");
    intro.id = "figmaBrochureIntro";
    var actions = make("div", "figma-brochure-hero-actions");
    var register = make("a", "figma-brochure-primary", "Register now →");
    register.id = "figmaBrochureHeroRegister";
    register.href = "/signup/";
    var schedule = make("a", "figma-brochure-secondary", "View schedule");
    schedule.href = "#meeting-times-section";
    actions.appendChild(register);
    actions.appendChild(schedule);
    copy.appendChild(actions);
    content.appendChild(copy);

    var summary = make("aside", "figma-brochure-summary");
    summary.setAttribute("aria-label", "Selected class at a glance");
    var priceRow = make("div", "figma-brochure-price-row");
    var priceCopy = make("div", "");
    appendText(priceCopy, "span", "figma-brochure-overline", "COURSE FEE");
    var price = appendText(priceCopy, "strong", "figma-brochure-price", "Check class fee");
    price.id = "figmaBrochurePrice";
    priceRow.appendChild(priceCopy);
    var mode = appendText(priceRow, "span", "figma-brochure-mode", "Live class");
    mode.id = "figmaBrochureMode";
    summary.appendChild(priceRow);
    var facts = make("div", "figma-brochure-facts");
    var iconNames = ["▣", "⌖", "▶"];
    var factElements = [];
    iconNames.forEach(function (icon, i) {
      var row = make("div", "figma-brochure-fact");
      var symbol = appendText(row, "span", "figma-brochure-fact-icon", icon);
      symbol.setAttribute("aria-hidden", "true");
      var detail = make("div", "");
      var title = appendText(detail, "strong", "", "");
      var caption = appendText(detail, "small", "", "");
      row.appendChild(detail);
      facts.appendChild(row);
      factElements.push({ title: title, caption: caption });
    });
    summary.appendChild(facts);
    var priceNote = appendText(summary, "p", "figma-brochure-fee-note",
      "Full fee shown in Ghana cedis. Payment options and terms are detailed below.");
    content.appendChild(summary);
    hero.appendChild(content);

    document.body.insertBefore(nav, page);
    document.body.insertBefore(hero, page);
    window.__falowenFigmaBrochure = {
      update: function (course) {
        if (!course || !course.level) return;
        var isSelf = course.availability === "always" || course.isSelfLearning;
        var level = String(course.level).toUpperCase();
        var statusLabel = enrollmentStatus(course);
        status.textContent = statusLabel;
        status.classList.toggle("is-enquiry", statusLabel.indexOf("ENQUIRE") >= 0);
        levelPill.textContent = (course.language || "German").toUpperCase() + " · " +
          (isSelf ? "SELF-LEARNING" : (levelNames[level] || level));
        kicker.textContent = String(course.title || level + " German class").toUpperCase();
        heading.textContent = isSelf
          ? "Learn German on your schedule."
          : (titles[level] || "Learn German with confidence.");
        intro.textContent = isSelf
          ? "Practise independently with Falowen lessons and learning tools, with the support available for your programme."
          : "A structured " + level + " German course with live teaching, guided practice and the Falowen learning platform — all working together.";
        var cost = Number(course.tuitionGhs);
        price.textContent = Number.isFinite(cost) && cost > 0
          ? "GHS " + cost.toLocaleString("en-GH")
          : "Fee on request";
        mode.textContent = isSelf ? "Self-learning" : /hybrid/i.test(String(course.format || "")) ? "Hybrid" : "Live class";

        var meeting = formatMeeting(course);
        factElements[0].title.textContent = meeting.days;
        factElements[0].caption.textContent = meeting.times === "Schedule pending"
          ? meeting.times
          : meeting.times + (isSelf ? "" : " · Ghana time");
        factElements[1].title.textContent = isSelf
          ? "Online self-learning"
          : (course.location || "Venue to be announced");
        factElements[1].caption.textContent = isSelf
          ? "Learn from wherever you are"
          : /hybrid|online/i.test(String(course.format || ""))
            ? "Join in person or live online"
            : String(course.format || "See class details below");
        factElements[2].title.textContent = /record/i.test(String(course.format || ""))
          ? "Recorded lesson access"
          : "Falowen learning platform";
        factElements[2].caption.textContent = /record/i.test(String(course.format || ""))
          ? "Review lesson material in Falowen"
          : "Study and practise with course resources";
        var href = safeRegistrationLink();
        register.href = href;
        registerNav.href = href;
        if (statusLabel.indexOf("ENQUIRE") >= 0) {
          register.textContent = "Enquire about next class →";
          registerNav.textContent = "Enquire now →";
        } else {
          register.textContent = "Register now →";
          registerNav.textContent = "Register now →";
        }
        priceNote.textContent = "Full fee in Ghana cedis. See fees, installment options and terms below.";
      }
    };
  }

  function sync(event) {
    var course = event?.detail?.course || window.currentBrochureCourse;
    if (!course || !course.level) return;
    renderShell();
    window.__falowenFigmaBrochure?.update(course);
  }
  // Every class render (including a different class or new FX rate) reuses the
  // same shell and updates from the published course — no hard-coded class.
  window.addEventListener("falowen:brochure-rendered", sync);
  if (document.readyState === "complete") sync();
  else window.addEventListener("load", sync, { once: true });
})();