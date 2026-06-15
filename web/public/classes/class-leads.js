(function () {
  const STORAGE_KEY = "falowen:class-leads";
  const LAST_LEAD_KEY = "falowen:last-class-lead";
  const ENDPOINT_KEY = "falowen:class-leads-endpoint";
  const CTA_VARIANT_KEY = "falowen:class-lead-cta-variant";
  const DEFAULT_APPS_SCRIPT_ENDPOINT = "https://script.google.com/macros/s/AKfycbzrUe3IC5w24Rmf_Ed-8HmdKzV3mn0BQyg2qsaveOSQOYunQj89MM23mgDhjGbsMa2gSA/exec";

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function currentUrl() {
    return new URL(window.location.href);
  }

  function isLeadLandingPage() {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    return path === "/classes" || path === "/classes/index.html";
  }

  function isExactClassPage() {
    return /^\/classes\/[^/]+\/?$/.test(window.location.pathname);
  }

  function isOpenMode() {
    const params = currentUrl().searchParams;
    return params.get("open") === "1" || params.get("view") === "details" || params.get("details") === "1";
  }

  function isDebugMode() {
    const params = currentUrl().searchParams;
    return params.get("debug") === "1" || localStorage.getItem("falowen:class-lead-debug") === "1";
  }

  function safeJsonParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function getRequestedSlug() {
    const url = currentUrl();
    const querySlug = url.searchParams.get("class") || url.searchParams.get("slug") || url.searchParams.get("level");
    if (querySlug) return slugify(querySlug);
    const match = window.location.pathname.match(/^\/classes\/([^/]+)\/?$/);
    return match ? slugify(match[1]) : "";
  }

  function formatDate(iso) {
    if (!iso) return "Always open";
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
  }

  function formatTime(time) {
    if (!time) return "";
    const [hourRaw, minute] = String(time || "").split(":").map(Number);
    if (!Number.isFinite(hourRaw) || !Number.isFinite(minute)) return String(time || "");
    const suffix = hourRaw >= 12 ? "pm" : "am";
    const hour = hourRaw % 12 || 12;
    return `${hour}:${String(minute).padStart(2, "0")} ${suffix}`;
  }

  function getCourseTitle(course) {
    if (course?.title) return course.title;
    const level = String(course?.level || "German").trim();
    const city = String(course?.city || "").trim();
    if (course?.availability === "always" && level) return `${level} Self-learning`;
    if (level && city) return `${level} ${city} Klasse`;
    return level || city || "German class";
  }

  function getCourseSlug(course) {
    return slugify(course?.slug || course?.id || getCourseTitle(course));
  }

  function buildClassUrl(courseOrSlug, extraParams) {
    const slug = typeof courseOrSlug === "string" ? slugify(courseOrSlug) : getCourseSlug(courseOrSlug);
    const params = new URLSearchParams({ class: slug, open: "1" });
    if (isDebugMode()) params.set("debug", "1");
    Object.entries(extraParams || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
    });
    return `/classes/?${params.toString()}`;
  }

  function getLeadEndpoint(data) {
    return (
      window.FALOWEN_CLASS_LEAD_ENDPOINT ||
      data?.leadCapture?.appsScriptEndpoint ||
      localStorage.getItem(ENDPOINT_KEY) ||
      DEFAULT_APPS_SCRIPT_ENDPOINT
    );
  }

  function loadStoredLeads() {
    return safeJsonParse(localStorage.getItem(STORAGE_KEY) || "[]", []);
  }

  function getLeadCtaCopy() {
    const variants = ["Unlock class schedule", "See fees & timetable", "Continue to class details"];
    const stored = Number(localStorage.getItem(CTA_VARIANT_KEY));
    if (Number.isInteger(stored) && stored >= 0 && stored < variants.length) return variants[stored];
    const chosen = Math.floor(Math.random() * variants.length);
    localStorage.setItem(CTA_VARIANT_KEY, String(chosen));
    return variants[chosen];
  }

  function saveStoredLead(lead) {
    const leads = loadStoredLeads();
    const filtered = leads.filter((item) => item.id !== lead.id);
    filtered.unshift(lead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 50)));
    localStorage.setItem(LAST_LEAD_KEY, JSON.stringify(lead));
    localStorage.setItem("exam-coach-class", lead.className);
    localStorage.setItem("falowen:class-lead-id", lead.id);
  }

  function getLastLead() {
    return safeJsonParse(localStorage.getItem(LAST_LEAD_KEY) || "null", null);
  }

  function shouldGate() {
    if (isExactClassPage()) return false;
    if (isOpenMode()) return false;
    return isLeadLandingPage();
  }

  function writeDebug(payload) {
    const output = document.getElementById("leadDebugOutput");
    if (!output) return;
    const previous = safeJsonParse(output.textContent || "[]", []);
    previous.unshift({ at: new Date().toISOString(), ...payload });
    output.textContent = JSON.stringify(previous.slice(0, 8), null, 2);
  }

  function injectStyles() {
    if (document.getElementById("classLeadStyles")) return;
    const style = document.createElement("style");
    style.id = "classLeadStyles";
    style.textContent = `
      body.lead-gate-active .page > section:not(.hero):not(.lead-capture-card):not(#studentReviewsCard),
      body.lead-gate-active .page > .card:not(.lead-capture-card):not(#studentReviewsCard),
      body.lead-gate-active .page > .grid,
      body.lead-gate-active .page > p.footer,
      body.lead-gate-active .hero-actions { display: none !important; }
      .lead-capture-card { margin-top: 14px; display: grid; gap: 14px; border-color: #bfdbfe; background: linear-gradient(180deg, #ffffff, #eff6ff); }
      .lead-capture-card h2 { margin: 0; font-size: clamp(23px, 7vw, 34px); letter-spacing: -0.035em; }
      .lead-capture-card p { margin: 0; color: #334155; line-height: 1.6; font-size: 14px; }
      .lead-capture-form { display: grid; gap: 10px; }
      .lead-field { display: grid; gap: 5px; }
      .lead-field label { font-weight: 850; color: #0f172a; font-size: 13px; }
      .lead-field input, .lead-field select { width: 100%; min-height: 46px; border-radius: 12px; border: 1px solid #cbd5e1; background: #ffffff; padding: 10px 12px; font: inherit; color: #111827; }
      .lead-field input:focus, .lead-field select:focus { outline: 2px solid #bfdbfe; border-color: #1455f5; }
      .lead-form-grid { display: grid; gap: 10px; }
      .lead-help { color: #64748b; font-size: 12px; line-height: 1.45; }
      .lead-actions { display: grid; gap: 10px; }
      .lead-submit { width: 100%; min-height: 50px; }
      .lead-whatsapp { width: 100%; min-height: 50px; }
      .lead-status { min-height: 20px; color: #1d4ed8; font-weight: 800; font-size: 13px; }
      .lead-status.error { color: #b91c1c; }
      .lead-inline-error { color: #b91c1c; font-size: 12px; min-height: 16px; }
      .lead-consent { display: flex; gap: 10px; align-items: flex-start; font-size: 12px; color: #334155; line-height: 1.45; }
      .lead-consent input { margin-top: 2px; }
      .lead-consent a { color: #1455f5; }
      .lead-open-link { display: inline-flex; width: fit-content; color: #1455f5; font-weight: 850; text-decoration: none; }
      .lead-debug { display: none; border: 1px dashed #93c5fd; border-radius: 12px; padding: 8px 10px; background: #eff6ff; color: #1e3a8a; font-size: 12px; }
      .lead-debug.active { display: block; }
      .lead-debug pre { margin: 8px 0 0; white-space: pre-wrap; word-break: break-word; max-height: 220px; overflow: auto; }
      @media (min-width: 760px) {
        .lead-form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .lead-field.full { grid-column: 1 / -1; }
        .lead-actions { grid-template-columns: 1fr 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  function getClassSummary(course) {
    const times = Array.isArray(course.meetingDays)
      ? course.meetingDays.map((slot) => `${slot.day} ${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`).join(", ")
      : "Self-learning";
    return `${getCourseTitle(course)} · Starts ${formatDate(course.startDate)} · ${times}`;
  }

  function currentCourseFromData(data) {
    const requestedSlug = getRequestedSlug();
    const classes = data.classes || [];
    return (
      classes.find((course) => getCourseSlug(course) === requestedSlug) ||
      classes.find((course) => course.availability !== "always") ||
      classes[0]
    );
  }

  function setStatus(status, message, isError) {
    if (!status) return;
    status.textContent = message || "";
    status.classList.toggle("error", Boolean(isError));
    status.setAttribute("role", isError ? "alert" : "status");
    status.setAttribute("aria-live", "polite");
    if (message) status.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function openClassPage(course, reason) {
    const url = buildClassUrl(course, reason ? { reason } : null);
    writeDebug({ step: "openClassPage", url, reason, slug: typeof course === "string" ? course : getCourseSlug(course) });
    if (!url.includes("class=")) return;
    window.location.href = url;
  }

  function renderLeadCard(data) {
    if (!isLeadLandingPage() || isOpenMode()) return;
    if (document.getElementById("leadCaptureCard")) return;
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const classes = data.classes || [];
    const selected = currentCourseFromData(data);
    const lastLead = getLastLead();
    const selectedSlug = getCourseSlug(selected);

    const card = document.createElement("section");
    card.id = "leadCaptureCard";
    card.className = "card lead-capture-card";
    card.innerHTML = `
      <div>
        <h2>Fill the form to continue</h2>
        <p>No payment question here. We only collect your contact details and selected class for follow-up.</p>
      </div>
      <form class="lead-capture-form" id="leadCaptureForm" novalidate>
        <div class="lead-form-grid">
          <div class="lead-field">
            <label for="leadName">Full name</label>
            <input id="leadName" name="name" autocomplete="name" required placeholder="Enter your full name" />
            <div class="lead-inline-error" id="leadNameError"></div>
          </div>
          <div class="lead-field">
            <label for="leadPhone">Phone / WhatsApp</label>
            <input id="leadPhone" name="phone" autocomplete="tel" required placeholder="024..." inputmode="tel" />
            <div class="lead-inline-error" id="leadPhoneError"></div>
          </div>
          <div class="lead-field">
            <label for="leadEmail">Email</label>
            <input id="leadEmail" name="email" type="email" autocomplete="email" required placeholder="name@email.com" />
            <div class="lead-inline-error" id="leadEmailError"></div>
          </div>
          <div class="lead-field">
            <label for="leadClass">Class / level you want</label>
            <select id="leadClass" name="classSlug" required>
              ${classes.map((course) => {
                const slug = getCourseSlug(course);
                const isSelected = slug === selectedSlug;
                return `<option value="${slug}" ${isSelected ? "selected" : ""}>${getClassSummary(course)}</option>`;
              }).join("")}
            </select>
            <div class="lead-inline-error" id="leadClassError"></div>
          </div>
        </div>
        <label class="lead-consent" for="leadConsent">
          <input id="leadConsent" name="consent" type="checkbox" />
          <span>I agree to be contacted by Falowen via WhatsApp, phone, or email about this class enquiry. Read our <a href="/privacy" target="_blank" rel="noreferrer">privacy policy</a>.</span>
        </label>
        <div class="lead-inline-error" id="leadConsentError"></div>
        <p class="lead-help">Your details sync to the Falowen lead sheet. After saving, we will open the class page you selected.</p>
        <div class="lead-actions">
          <button class="button primary lead-submit" id="leadSubmitButton" type="submit">${getLeadCtaCopy()}</button>
          <a class="button amber lead-whatsapp" href="https://wa.me/233241113054?text=${encodeURIComponent("Hello Falowen, I would like more information about your German classes.")}" target="_blank" rel="noreferrer">Contact us on WhatsApp</a>
        </div>
        <a class="lead-open-link" id="leadOpenClassLink" href="${buildClassUrl(selected)}">Open selected class information without saving</a>
        <div class="lead-status" id="leadStatus"></div>
        <details class="lead-debug ${isDebugMode() ? "active" : ""}" id="leadDebugBox" ${isDebugMode() ? "open" : ""}>
          <summary>Class form debug</summary>
          <pre id="leadDebugOutput">[]</pre>
        </details>
      </form>
    `;
    hero.insertAdjacentElement("afterend", card);

    if (lastLead) {
      card.querySelector("#leadName").value = lastLead.name || "";
      card.querySelector("#leadPhone").value = lastLead.phone || "";
      card.querySelector("#leadEmail").value = lastLead.email || "";
    }

    const form = card.querySelector("#leadCaptureForm");
    const select = card.querySelector("#leadClass");
    const nameInput = card.querySelector("#leadName");
    const emailInput = card.querySelector("#leadEmail");
    const phoneInput = card.querySelector("#leadPhone");
    const consentInput = card.querySelector("#leadConsent");
    const nameError = card.querySelector("#leadNameError");
    const emailError = card.querySelector("#leadEmailError");
    const phoneError = card.querySelector("#leadPhoneError");
    const classError = card.querySelector("#leadClassError");
    const consentError = card.querySelector("#leadConsentError");
    const submitButton = card.querySelector("#leadSubmitButton");
    const openLink = card.querySelector("#leadOpenClassLink");
    const debugBox = card.querySelector("#leadDebugBox");

    function selectedCourse() {
      return classes.find((item) => getCourseSlug(item) === select.value) || selected || classes[0];
    }

    function syncOpenLink() {
      const course = selectedCourse();
      const url = buildClassUrl(course);
      if (openLink && url) openLink.href = url;
      writeDebug({ step: "syncOpenLink", selectedValue: select.value, url, classCount: classes.length });
    }

    syncOpenLink();
    select.addEventListener("change", syncOpenLink);
    openLink.addEventListener("click", function () {
      if (debugBox) debugBox.classList.add("active");
      writeDebug({ step: "manualOpenLinkClick", href: openLink.href });
    });

    function normalizePhone(value) {
      return String(value || "").replace(/\s+/g, "").replace(/[()\-]/g, "");
    }

    function clearErrors() {
      [nameError, emailError, phoneError, classError, consentError].forEach((node) => {
        if (node) node.textContent = "";
      });
    }

    function validateLeadForm() {
      let valid = true;
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = normalizePhone(phoneInput.value);
      clearErrors();

      if (!name) {
        nameError.textContent = "Enter your full name before continuing.";
        valid = false;
      }

      if (!phone) {
        phoneError.textContent = "Enter your phone or WhatsApp number.";
        valid = false;
      } else if (!/^\+?[0-9]{8,15}$/.test(phone)) {
        phoneError.textContent = "Enter a valid phone number with 8 to 15 digits.";
        valid = false;
      }

      if (!email) {
        emailError.textContent = "Enter your email address.";
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.textContent = "Enter a valid email address (example: name@email.com).";
        valid = false;
      }

      if (!select.value) {
        classError.textContent = "Select the class or level you want.";
        valid = false;
      }

      if (!consentInput.checked) {
        consentError.textContent = "You can continue, but tick this box if you want us to contact you about the class.";
      }

      phoneInput.value = phone;
      return valid;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = card.querySelector("#leadStatus");
      setStatus(status, "", false);
      if (debugBox) debugBox.classList.add("active");

      const course = selectedCourse();
      const targetUrl = buildClassUrl(course);
      writeDebug({ step: "submit", selectedValue: select.value, targetUrl, courseTitle: getCourseTitle(course), courseSlug: getCourseSlug(course) });

      if (!course || !getCourseSlug(course)) {
        setStatus(status, "Could not find the selected class. Use the debug box below and send a screenshot.", true);
        writeDebug({ step: "blocked", reason: "missing_course_or_slug", classes: classes.map((item) => ({ title: getCourseTitle(item), slug: getCourseSlug(item) })) });
        return;
      }

      const isValid = validateLeadForm();
      submitButton.disabled = true;
      submitButton.textContent = isValid ? "Saving..." : "Opening class...";

      const lead = buildLead(card, course);
      try {
        saveStoredLead(lead);
        updateSignupLinksWithLead(lead);
      } catch (error) {
        writeDebug({ step: "localSaveError", message: error?.message || String(error) });
      }

      if (!isValid) {
        setStatus(status, "Opening the class information. Some contact details were not saved correctly.", true);
        window.setTimeout(() => openClassPage(course, "validation_fallback"), 500);
        return;
      }

      submitLead(data, lead, course);
    });
  }

  function buildLead(card, course) {
    return {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      source: "classes-lead-landing",
      status: "new_lead",
      name: card.querySelector("#leadName").value.trim(),
      phone: card.querySelector("#leadPhone").value.trim(),
      email: card.querySelector("#leadEmail").value.trim(),
      consentToContact: !!card.querySelector("#leadConsent")?.checked,
      classId: course.id || getCourseSlug(course),
      classSlug: getCourseSlug(course),
      className: getCourseTitle(course),
      level: course.level || "",
      startDate: course.startDate || "",
      endDate: course.endDate || "",
      meetingTimes: Array.isArray(course.meetingDays)
        ? course.meetingDays.map((slot) => `${slot.day} ${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`).join(", ")
        : "Self-learning",
      scheduleUrl: course.scheduleUrl || course.docUrl || "",
      paymentStatus: "not_requested",
      paidAt: "",
      followUpCount: 0,
      nextFollowUpAt: "",
    };
  }

  function updateSignupLinksWithLead(lead) {
    const signupUrl = `/classes/?class=${encodeURIComponent(lead.classSlug)}&leadId=${encodeURIComponent(lead.id)}`;
    document.querySelectorAll("a[href^='/signup'], a[href^='/classes/?class']").forEach((link) => {
      link.href = signupUrl;
    });
  }

  function submitLead(data, lead, course) {
    const status = document.getElementById("leadStatus");
    const endpoint = getLeadEndpoint(data);
    const targetCourse = course || { slug: lead.classSlug, title: lead.className };
    let opened = false;
    const openClass = (reason) => {
      if (opened) return;
      opened = true;
      openClassPage(targetCourse, reason || "lead_saved_or_timeout");
    };

    if (status) setStatus(status, "Saving enquiry and opening class information...", false);
    writeDebug({ step: "submitLead", endpoint: endpoint ? "configured" : "missing", target: buildClassUrl(targetCourse) });

    if (!endpoint) {
      window.setTimeout(() => openClass("no_endpoint"), 250);
      return;
    }

    const submission = fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "saveLead", lead }),
    }).catch((error) => {
      writeDebug({ step: "leadFetchError", message: error?.message || String(error) });
    });

    Promise.race([
      submission,
      new Promise((resolve) => window.setTimeout(resolve, 900)),
    ]).finally(() => window.setTimeout(() => openClass("fetch_complete_or_timeout"), 100));
  }

  function init() {
    injectStyles();
    if (shouldGate()) document.body.classList.add("lead-gate-active");
    else document.body.classList.remove("lead-gate-active");
    if (isExactClassPage()) document.body.classList.remove("lead-gate-active");

    fetch("/classes/classes-data.json")
      .then((response) => response.json())
      .then((data) => {
        writeDebug({ step: "dataLoaded", classCount: data?.classes?.length || 0, requestedSlug: getRequestedSlug(), openMode: isOpenMode() });
        renderLeadCard(data);
        const lead = getLastLead();
        if (lead) updateSignupLinksWithLead(lead);
      })
      .catch((error) => {
        document.body.classList.remove("lead-gate-active");
        writeDebug({ step: "dataLoadError", message: error?.message || String(error) });
      });
  }

  window.FalowenClassLeadDebug = {
    slugify,
    getCourseTitle,
    getCourseSlug,
    buildClassUrl,
    shouldGate,
    isOpenMode,
  };

  window.addEventListener("load", init);
  setTimeout(init, 350);
})();
