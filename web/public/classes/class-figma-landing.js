/*
 * Figma-inspired brochure-first landing. Visual-only enhancement: the published
 * class selector, optional enquiry form and existing brochure links keep their
 * original handlers, identity, and data source.
 */
(function () {
  "use strict";

  var path = window.location.pathname.replace(/\/+$/, "") || "/";
  var params = new URLSearchParams(window.location.search);
  var isRoot = path === "/classes" || path === "/classes/index.html";
  var isDetail = params.get("open") === "1" || params.get("view") === "details" || params.get("details") === "1";
  if (!isRoot || isDetail) return;

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function formatDate(raw) {
    if (!raw) return "";
    var date = new Date(String(raw).slice(0, 10) + "T00:00:00Z");
    return Number.isNaN(date.getTime())
      ? ""
      : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
  }

  function courseDetails(course) {
    if (!course) return { cohort: "To be announced", dates: "Select a class to see dates" };
    if (course.availability === "always" || course.isSelfLearning) {
      return { cohort: "Self-learning", dates: "Start anytime" };
    }
    var cohort = course.city || course.cohort || course.title || "Live class";
    var dates = course.availability === "enquiry"
      ? "Next class date to be announced"
      : [formatDate(course.startDate), formatDate(course.endDate)].filter(Boolean).join(" – ") || "Dates to be announced";
    return { cohort: cohort, dates: dates };
  }

  function addText(parent, tag, cls, value) {
    var node = element(tag, cls, value);
    parent.appendChild(node);
    return node;
  }

  function mount() {
    if (document.getElementById("figmaClassLanding")) return true;
    var page = document.querySelector("main.page");
    var card = document.getElementById("leadCaptureCard");
    var form = card && card.querySelector("#leadCaptureForm");
    var select = form && form.querySelector("#leadClass");
    var classField = form && form.querySelector(".lead-field.full");
    var summary = card && card.querySelector("#leadDecisionSummary");
    var fieldGrid = form && form.querySelector(".lead-form-grid");
    if (!page || !card || !form || !select || !classField || !summary || !fieldGrid) return false;

    var stage = element("div", "figma-class-landing");
    stage.id = "figmaClassLanding";
    var promo = element("aside", "figma-class-promo");
    var brand = element("a", "figma-class-brand");
    brand.href = "/";
    brand.setAttribute("aria-label", "Falowen home");
    addText(brand, "span", "figma-class-brand-mark", "F");
    addText(brand, "span", "figma-class-brand-name", "FALOWEN");
    promo.appendChild(brand);

    var promoCopy = element("div", "figma-class-promo-copy");
    addText(promoCopy, "p", "figma-class-promo-kicker", "GERMAN CLASSES IN GHANA");
    var heroTitle = element("h1", "");
    heroTitle.appendChild(document.createTextNode("Your next "));
    addText(heroTitle, "em", "", "chapter");
    heroTitle.appendChild(document.createTextNode(" starts in German."));
    promoCopy.appendChild(heroTitle);
    addText(promoCopy, "p", "figma-class-promo-description",
      "Choose your class and get every detail you need — fees, timetable, location, and answers — all in one place.");
    promo.appendChild(promoCopy);
    var trust = element("div", "figma-class-trust");
    ["Established 2022", "German A1–C2", "Tutor-supported learning"].forEach(function (label) {
      addText(trust, "span", "", label);
    });
    promo.appendChild(trust);

    var content = element("div", "figma-class-main");
    var header = element("header", "figma-class-heading");
    var headerText = element("div", "");
    addText(headerText, "p", "figma-class-eyebrow", "CLASS BROCHURE");
    addText(headerText, "h2", "", "Choose your class");
    addText(headerText, "p", "figma-class-description",
      "Select a class to view its brochure. No login or personal details required.");
    header.appendChild(headerText);
    var available = element("span", "figma-class-status", "Browse class options");
    header.appendChild(available);
    content.appendChild(header);

    // Reparent existing form nodes rather than cloning them. This preserves
    // the attached class-switch, validation, lead sheet and brochure handlers.
    var originalHeading = card.querySelector(":scope > div:first-child");
    if (originalHeading) originalHeading.remove();
    var selectorPanel = element("div", "figma-class-select-panel");
    var followUpPanel = element("div", "figma-class-follow-panel");
    var formHeading = element("div", "figma-class-follow-heading");
    addText(formHeading, "span", "figma-class-follow-arrow", "↗");
    addText(formHeading, "h3", "", "Want a follow-up?");
    addText(formHeading, "p", "",
      "Leave your details only if you would like us to contact you about a class. You can view the brochure without filling this in.");
    followUpPanel.appendChild(formHeading);

    classField.classList.add("figma-class-select-field");
    selectorPanel.appendChild(classField);
    var meta = element("div", "figma-class-meta");
    var cohortWrap = element("div", "");
    addText(cohortWrap, "span", "", "COHORT");
    var cohortValue = addText(cohortWrap, "strong", "", "");
    var datesWrap = element("div", "");
    addText(datesWrap, "span", "", "DATES");
    var datesValue = addText(datesWrap, "strong", "", "");
    meta.appendChild(cohortWrap);
    meta.appendChild(datesWrap);
    summary.insertBefore(meta, summary.querySelector(".lead-decision-grid"));
    selectorPanel.appendChild(summary);

    fieldGrid.classList.add("figma-class-follow-fields");
    // The existing lead form owns the select even when it is visually on the
    // left: it remains a descendant of the same form after reparenting.
    while (form.firstChild) followUpPanel.appendChild(form.firstChild);
    form.appendChild(selectorPanel);
    form.appendChild(followUpPanel);
    card.replaceChildren(form);

    var brochureButton = selectorPanel.querySelector("#leadViewBrochure");
    if (brochureButton) brochureButton.textContent = "Open full class brochure & FAQs →";
    var submitButton = form.querySelector("#leadSubmitButton");
    if (submitButton && !submitButton.disabled) submitButton.textContent = "Request a follow-up";

    var copyRow = element("div", "figma-class-copy-row");
    var copyButton = element("button", "figma-class-copy-button", "Copy class details");
    copyButton.type = "button";
    var copyStatus = element("span", "figma-class-copy-status", "");
    copyStatus.setAttribute("role", "status");
    copyRow.appendChild(copyButton);
    copyRow.appendChild(copyStatus);
    summary.appendChild(copyRow);

    function syncMeta() {
      var data = window.FalowenClassBrochureData || {};
      var classes = Array.isArray(data.classes) ? data.classes : [];
      var chosen = classes.find(function (course) {
        var raw = String(course.slug || course.id || course.title || "");
        return raw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === select.value;
      });
      var details = courseDetails(chosen);
      cohortValue.textContent = details.cohort;
      datesValue.textContent = details.dates;
      // This is a class selector, not an assertion of confirmed enrolment.
      available.textContent = classes.length ? "Class options available" : "Class information";
    }
    select.addEventListener("change", syncMeta);
    syncMeta();

    copyButton.addEventListener("click", function () {
      var fields = [
        card.querySelector("#leadDecisionTitle")?.textContent || "",
        card.querySelector("#leadDecisionFee")?.textContent || "",
        "Cohort: " + cohortValue.textContent,
        "Dates: " + datesValue.textContent,
        "Meeting times: " + (card.querySelector("#leadDecisionTimes")?.textContent || ""),
        "Venue: " + (card.querySelector("#leadDecisionLocation")?.textContent || ""),
        "Brochure: " + (brochureButton?.href || window.location.href)
      ].filter(Boolean).join("\n");
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        copyStatus.textContent = "Select the details above to copy.";
        return;
      }
      navigator.clipboard.writeText(fields).then(function () {
        copyStatus.textContent = "Class details copied.";
      }).catch(function () {
        copyStatus.textContent = "Unable to copy; select the details above.";
      });
    });

    content.appendChild(card);
    var after = element("p", "figma-class-bottom-note");
    after.appendChild(document.createTextNode("Not sure where to start? "));
    var placement = element("a", "", "Take the free German placement test →");
    placement.href = "/placement-test";
    after.appendChild(placement);
    content.appendChild(after);
    stage.appendChild(promo);
    stage.appendChild(content);
    page.insertBefore(stage, page.firstChild);
    document.body.classList.add("figma-classes-landing");
    document.querySelectorAll(".simple-class-steps").forEach(function (node) { node.remove(); });
    return true;
  }

  function init() {
    if (mount()) return;
    var root = document.querySelector("main.page");
    if (!root) return;
    var observer = new MutationObserver(function () {
      if (mount()) observer.disconnect();
    });
    observer.observe(root, { subtree: true, childList: true });
    window.addEventListener("pagehide", function () { observer.disconnect(); }, { once: true });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();