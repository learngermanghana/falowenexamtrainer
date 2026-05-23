(function () {
  const STORAGE_KEY = "falowen:class-leads";
  const LAST_LEAD_KEY = "falowen:last-class-lead";
  const LEAD_GATE_KEY = "falowen:class-lead-captured";
  const ENDPOINT_KEY = "falowen:class-leads-endpoint";
  const DEFAULT_APPS_SCRIPT_ENDPOINT = "https://script.google.com/macros/s/AKfycbzrUe3IC5w24Rmf_Ed-8HmdKzV3mn0BQyg2qsaveOSQOYunQj89MM23mgDhjGbsMa2gSA/exec";

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function safeJsonParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function getRequestedSlug() {
    const url = new URL(window.location.href);
    const querySlug = url.searchParams.get("class") || url.searchParams.get("slug");
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
    const [hourRaw, minute] = time.split(":").map(Number);
    const suffix = hourRaw >= 12 ? "pm" : "am";
    const hour = hourRaw % 12 || 12;
    return `${hour}:${String(minute).padStart(2, "0")} ${suffix}`;
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

  function saveStoredLead(lead) {
    const leads = loadStoredLeads();
    const filtered = leads.filter((item) => item.id !== lead.id);
    filtered.unshift(lead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 50)));
    localStorage.setItem(LAST_LEAD_KEY, JSON.stringify(lead));
    localStorage.setItem(LEAD_GATE_KEY, "1");
    localStorage.setItem("exam-coach-class", lead.className);
    localStorage.setItem("falowen:class-lead-id", lead.id);
  }

  function getLastLead() {
    return safeJsonParse(localStorage.getItem(LAST_LEAD_KEY) || "null", null);
  }

  function shouldGate() {
    const lead = getLastLead();
    const requestedSlug = getRequestedSlug();
    if (!lead) return true;
    if (!requestedSlug) return false;
    return slugify(lead.classSlug || lead.className) !== requestedSlug;
  }

  function injectStyles() {
    if (document.getElementById("classLeadStyles")) return;
    const style = document.createElement("style");
    style.id = "classLeadStyles";
    style.textContent = `
      body.lead-gate-active .page > section:not(.hero):not(.lead-capture-card),
      body.lead-gate-active .page > .card:not(.lead-capture-card),
      body.lead-gate-active .page > footer,
      body.lead-gate-active .footer,
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
      .lead-submit { width: 100%; min-height: 50px; }
      .lead-status { min-height: 20px; color: #1d4ed8; font-weight: 800; font-size: 13px; }
      .lead-small-actions { display: flex; flex-wrap: wrap; gap: 8px; }
      .lead-small-actions button { border: 0; background: transparent; color: #1d4ed8; font-weight: 800; padding: 0; cursor: pointer; }
      @media (min-width: 760px) {
        .lead-form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .lead-field.full { grid-column: 1 / -1; }
      }
    `;
    document.head.appendChild(style);
  }

  function getClassSummary(course) {
    const times = Array.isArray(course.meetingDays)
      ? course.meetingDays.map((slot) => `${slot.day} ${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`).join(", ")
      : "Self-learning";
    return `${course.title} · Starts ${formatDate(course.startDate)} · ${times}`;
  }

  function currentCourseFromData(data) {
    const requestedSlug = getRequestedSlug();
    const classes = data.classes || [];
    return (
      classes.find((course) => slugify(course.slug || course.title) === requestedSlug) ||
      classes.find((course) => course.availability !== "always") ||
      classes[0]
    );
  }

  function renderLeadCard(data) {
    if (document.getElementById("leadCaptureCard")) return;
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const classes = data.classes || [];
    const selected = currentCourseFromData(data);
    const lastLead = getLastLead();

    const card = document.createElement("section");
    card.id = "leadCaptureCard";
    card.className = "card lead-capture-card";
    card.innerHTML = `
      <div>
        <h2>Welcome. Which class are you interested in?</h2>
        <p>Please leave your details and choose a class. We will show the class information and keep your enquiry so we can remind you before the class begins.</p>
      </div>
      <form class="lead-capture-form" id="leadCaptureForm">
        <div class="lead-form-grid">
          <div class="lead-field">
            <label for="leadName">Your name</label>
            <input id="leadName" name="name" autocomplete="name" required placeholder="Enter your full name" />
          </div>
          <div class="lead-field">
            <label for="leadPhone">Phone / WhatsApp</label>
            <input id="leadPhone" name="phone" autocomplete="tel" required placeholder="024..." />
          </div>
          <div class="lead-field">
            <label for="leadEmail">Email</label>
            <input id="leadEmail" name="email" type="email" autocomplete="email" required placeholder="name@email.com" />
          </div>
          <div class="lead-field">
            <label for="leadClass">Choose class</label>
            <select id="leadClass" name="classSlug" required>
              ${classes.map((course) => `<option value="${course.slug}" ${course.id === selected?.id ? "selected" : ""}>${getClassSummary(course)}</option>`).join("")}
            </select>
          </div>
        </div>
        <p class="lead-help">Your details are saved as a class enquiry lead. We use them only to follow up about the class you selected.</p>
        <button class="button primary lead-submit" type="submit">Save and view class details</button>
        <div class="lead-status" id="leadStatus"></div>
        <div class="lead-small-actions">
          <button type="button" id="skipLeadGate">I already submitted, show class details</button>
        </div>
      </form>
    `;
    hero.insertAdjacentElement("afterend", card);

    if (lastLead) {
      card.querySelector("#leadName").value = lastLead.name || "";
      card.querySelector("#leadPhone").value = lastLead.phone || "";
      card.querySelector("#leadEmail").value = lastLead.email || "";
    }

    const select = card.querySelector("#leadClass");
    select.addEventListener("change", () => {
      const course = classes.find((item) => item.slug === select.value);
      if (!course) return;
      window.history.replaceState(null, "", `/classes/${course.slug}/`);
      try {
        const tabs = Array.from(document.querySelectorAll(".class-tab"));
        const match = tabs.find((button) => slugify(button.textContent) === course.slug);
        if (match) match.click();
      } catch (error) {}
    });

    card.querySelector("#skipLeadGate").addEventListener("click", () => {
      localStorage.setItem(LEAD_GATE_KEY, "1");
      document.body.classList.remove("lead-gate-active");
    });

    card.querySelector("#leadCaptureForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const course = classes.find((item) => item.slug === select.value) || selected || classes[0];
      const lead = buildLead(card, course);
      saveStoredLead(lead);
      document.body.classList.remove("lead-gate-active");
      updateSignupLinksWithLead(lead);
      submitLead(data, lead);
    });
  }

  function buildLead(card, course) {
    return {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      source: "classes-brochure",
      status: "new_lead",
      name: card.querySelector("#leadName").value.trim(),
      phone: card.querySelector("#leadPhone").value.trim(),
      email: card.querySelector("#leadEmail").value.trim(),
      classId: course.id || "",
      classSlug: course.slug || slugify(course.title),
      className: course.title || "",
      level: course.level || "",
      startDate: course.startDate || "",
      endDate: course.endDate || "",
      meetingTimes: Array.isArray(course.meetingDays)
        ? course.meetingDays.map((slot) => `${slot.day} ${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`).join(", ")
        : "Self-learning",
      scheduleUrl: course.scheduleUrl || course.docUrl || "",
      paymentStatus: "unknown",
      paidAt: "",
      followUpCount: 0,
      nextFollowUpAt: "",
    };
  }

  function updateSignupLinksWithLead(lead) {
    const signupUrl = `/signup/?class=${encodeURIComponent(lead.classSlug)}&className=${encodeURIComponent(lead.className)}&leadId=${encodeURIComponent(lead.id)}`;
    document.querySelectorAll("a[href^='/signup']").forEach((link) => {
      link.href = signupUrl;
    });
  }

  function submitLead(data, lead) {
    const status = document.getElementById("leadStatus");
    const endpoint = getLeadEndpoint(data);
    if (!endpoint) {
      if (status) status.textContent = "Saved. App Script sync will start after the endpoint is added.";
      return;
    }

    if (status) status.textContent = "Saving enquiry...";
    fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "saveLead", lead }),
    })
      .then(() => {
        if (status) status.textContent = "Saved. Class details are ready below.";
      })
      .catch(() => {
        if (status) status.textContent = "Saved on this device. Sync will retry when configured.";
      });
  }

  function init() {
    injectStyles();
    if (shouldGate()) document.body.classList.add("lead-gate-active");

    fetch("/classes/classes-data.json")
      .then((response) => response.json())
      .then((data) => {
        renderLeadCard(data);
        const lead = getLastLead();
        if (lead) updateSignupLinksWithLead(lead);
      })
      .catch(() => {
        document.body.classList.remove("lead-gate-active");
      });
  }

  window.addEventListener("load", init);
  setTimeout(init, 350);
})();
