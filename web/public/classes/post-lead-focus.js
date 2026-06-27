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
      .course-duration-notice {
        display: grid;
        gap: 5px;
        padding: 14px;
        border-radius: 14px;
        border: 1px solid #86efac;
        background: #f0fdf4;
        color: #14532d;
      }
      .course-duration-notice strong { font-size: 17px; }
      .course-duration-notice p { margin: 0; font-size: 14px; line-height: 1.55; }
      .view-other-classes-cta {
        display: inline-flex;
        justify-content: center;
        width: 100%;
        min-height: 48px;
        background: #ffffff !important;
        color: #1d4ed8 !important;
        border-color: #bfdbfe !important;
      }
      @media (max-width: 520px) {
        body.post-lead-focus .page { padding-left: 8px !important; padding-right: 8px !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function hideTopContent() {
    [".intro-video", ".funnel-actions", ".hero", "#brochureToc"].forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (node) {
        node.hidden = true;
        node.setAttribute("aria-hidden", "true");
      });
    });

    document.querySelectorAll("#otherAvailableClasses, .other-classes-card").forEach(function (node) {
      node.remove();
    });

    var tabs = document.getElementById("classTabs");
    var tabsCard = tabs && tabs.closest ? tabs.closest("section.card") : null;
    if (tabsCard) {
      tabsCard.classList.add("post-lead-tabs-card");
      tabsCard.hidden = true;
      tabsCard.setAttribute("aria-hidden", "true");
    }
  }

  function moveSelectedClassFirst() {
    var page = document.querySelector("main.page") || document.querySelector(".page");
    var title = document.getElementById("classTitle");
    var classCard = document.querySelector(".class-main-card") || (title && title.closest ? title.closest(".card") : null);
    if (!page || !classCard) return;
    if (page.firstElementChild !== classCard) page.insertBefore(classCard, page.firstElementChild);
    classCard.setAttribute("data-post-lead-priority", "true");
  }

  function keepOneRegisterButton() {
    var signupLinks = Array.from(document.querySelectorAll("a[href^='/signup']"));
    if (!signupLinks.length) return;

    var primary = document.getElementById("mainSignupCta")
      || signupLinks.find(function (link) { return Boolean(link.closest && link.closest(".class-main-card")); })
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

  function currentCourse() {
    try {
      if (typeof brochureData === "undefined" || !brochureData || !Array.isArray(brochureData.classes)) return null;
      var slug = selectedSlug();
      var title = String(document.getElementById("classTitle")?.textContent || "").trim();
      return brochureData.classes.find(function (course) {
        return course.id === selectedClassId
          || cleanSlug(course.slug || course.id || course.title) === slug
          || String(course.title || "").trim() === title;
      }) || null;
    } catch (error) {
      return null;
    }
  }

  function addDurationNotice() {
    var title = document.getElementById("classTitle");
    if (!title || document.getElementById("courseDurationNotice")) return;
    var notice = document.createElement("div");
    notice.id = "courseDurationNotice";
    notice.className = "course-duration-notice";
    notice.innerHTML = "<strong>10-week live class · 6 months Falowen access</strong><p>The live course is designed to finish within 10 weeks when you attend consistently and complete the work. Full payment gives 6 months of Falowen access to cover unexpected delays, revision, and exam preparation.</p>";
    title.insertAdjacentElement("afterend", notice);
  }

  function clarifyAccessStat() {
    document.querySelectorAll("#stats .stat").forEach(function (stat) {
      var label = stat.querySelector("span");
      var value = stat.querySelector("b");
      var text = String(label?.textContent || "").toLowerCase();
      if (text.includes("access with full payment") || text.includes("falowen access")) {
        label.textContent = "Falowen access after full payment";
        if (value) value.textContent = "6 months";
      }
    });
  }

  function dateToIso(value) {
    if (!value) return "";
    var text = String(value).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
    var parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
  }

  function fallbackCourseFromPage() {
    var title = String(document.getElementById("classTitle")?.textContent || "").trim();
    var level = (title.match(/\b(A1|A2|B1|B2|C1|C2)\b/i) || [])[1] || "A1";
    var blueMeta = String(document.getElementById("blueClassMeta")?.textContent || "");
    var startMatch = blueMeta.match(/Starts\s+([^🏁\n]+)/i);
    var meetingDays = Array.from(document.querySelectorAll("#meetingRows tr")).map(function (row) {
      var cells = row.querySelectorAll("td");
      return cells.length ? { day: String(cells[0].textContent || "").trim() } : null;
    }).filter(Boolean);
    return {
      id: selectedSlug(),
      slug: selectedSlug(),
      title: title,
      level: String(level).toUpperCase(),
      startDate: dateToIso(startMatch && startMatch[1]),
      meetingDays: meetingDays,
      holidayDatesExcluded: [],
    };
  }

  function buildAdminScheduleUrl(course) {
    if (!course || !course.startDate || !Array.isArray(course.meetingDays) || !course.meetingDays.length) return "";
    var url = new URL("https://admin.falowen.app/course-schedule/public");
    url.searchParams.set("level", String(course.level || "A1").toUpperCase());
    url.searchParams.set("startDate", String(course.startDate).slice(0, 10));
    url.searchParams.set("defaultWeekdays", course.meetingDays.map(function (item) { return item.day; }).filter(Boolean).join(","));
    url.searchParams.set("holidayDates", (course.holidayDatesExcluded || course.holidayDates || []).join(","));
    url.searchParams.set("useAdvancedWeekdays", "false");
    url.searchParams.set("weekDaysMap", "{}");
    url.searchParams.set("classId", String(course.id || ""));
    url.searchParams.set("className", String(course.title || course.name || ""));
    return url.toString();
  }

  function repairScheduleLink() {
    var course = currentCourse() || fallbackCourseFromPage();
    var href = buildAdminScheduleUrl(course);
    if (!href) return;

    var hidden = document.getElementById("scheduleLink");
    if (hidden) hidden.href = href;

    document.querySelectorAll("#classScheduleCta, .schedule-simple-card .class-schedule-cta").forEach(function (link) {
      link.href = href;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = "Open class schedule";
    });

    var scheduleCard = document.querySelector(".schedule-simple-card") || document.getElementById("class-schedule-section");
    var copy = scheduleCard && scheduleCard.querySelector("p");
    if (copy) {
      copy.textContent = "This schedule is generated from the current class dates and teaching days managed in Falowen Admin. Open it to see lesson dates, topics, holidays, start date, and end date.";
    }
  }

  function addViewOtherClassesButton() {
    if (document.getElementById("viewOtherClassesCta")) return;
    var anchor = document.querySelector(".schedule-simple-card .class-schedule-cta") || document.getElementById("classScheduleCta") || document.getElementById("mainSignupCta");
    if (!anchor) return;
    var link = document.createElement("a");
    link.id = "viewOtherClassesCta";
    link.className = "button view-other-classes-cta";
    link.href = "/classes/";
    link.textContent = "View other classes";
    anchor.insertAdjacentElement("afterend", link);
  }

  function applyPostLeadFocus() {
    if (!isPostLeadView()) return;
    injectStyles();
    document.body.classList.add("post-lead-focus", "post-lead-class-detail");
    document.body.classList.remove("simple-classes-form", "lead-gate-active");
    var leadCard = document.getElementById("leadCaptureCard");
    if (leadCard) leadCard.remove();
    hideTopContent();
    moveSelectedClassFirst();
    keepOneRegisterButton();
    addDurationNotice();
    clarifyAccessStat();
    repairScheduleLink();
    addViewOtherClassesButton();
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
