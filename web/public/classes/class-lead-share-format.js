(function () {
  const DATA_URL = "/classes/classes-data.json";
  const DEFAULT_LOCATION = "Ghana, Accra - Awoshie";
  const COPY_BUTTON_ID = "leadCopyClassDetails";
  const STYLE_ID = "falowenClassLeadShareFormatStyles";

  const slugify = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  function formatDate(iso) {
    if (!iso) return "Not set";
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${iso}T00:00:00Z`));
  }

  function formatTime(time) {
    const parts = String(time || "").split(":").map(Number);
    const hourRaw = parts[0];
    const minute = parts[1];
    if (!Number.isFinite(hourRaw) || !Number.isFinite(minute)) return String(time || "");
    return `${hourRaw % 12 || 12}:${String(minute).padStart(2, "0")} ${hourRaw >= 12 ? "pm" : "am"}`;
  }

  function getCourseTitle(course) {
    if (course && course.title) return String(course.title).trim();
    const level = String((course && course.level) || "German").trim();
    const city = String((course && course.city) || "").trim();
    if (course && course.availability === "always") return `${level} Self-learning`;
    return level && city ? `${level} ${city} Klasse` : level || city || "German class";
  }

  const getCourseSlug = (course) =>
    slugify((course && (course.slug || course.id)) || getCourseTitle(course));

  function getCourseCohort(course) {
    if (course && course.availability === "always") return "Self-learning";
    return String(
      (course && (course.cohortName || course.cohort || course.city)) || getCourseTitle(course)
    ).trim();
  }

  function getCourseLocation(course) {
    if (course && course.availability === "always") {
      return String(course.location || "Online self-learning").trim();
    }
    return String((course && (course.location || course.venue)) || DEFAULT_LOCATION).trim();
  }

  function getScheduleRows(course) {
    if (!Array.isArray(course && course.meetingDays) || !course.meetingDays.length) {
      return [course && course.availability === "always" ? "Flexible self-learning schedule" : "Schedule not set"];
    }
    return course.meetingDays.map((slot) => {
      const start = formatTime(slot && slot.startTime);
      const end = formatTime(slot && slot.endTime);
      return `${String((slot && slot.day) || "Class day").trim()}: ${start}${start && end ? " – " : ""}${end}`;
    });
  }

  function getPublicClassUrl(course) {
    const url = new URL("/classes/", window.location.origin);
    url.searchParams.set("class", getCourseSlug(course));
    url.searchParams.set("open", "1");
    return url.href;
  }

  function buildShareText(course) {
    const lines = [
      "Hello Falowen, I would like more information about this German class:",
      "",
      `*Class:* ${getCourseTitle(course)}`,
      `*Cohort:* ${getCourseCohort(course)}`,
      `*Venue:* ${getCourseLocation(course)}`,
    ];

    if (course && course.availability === "always") {
      lines.push("*Dates:* Always open");
    } else {
      lines.push(`*Start:* ${formatDate(course && course.startDate)}`);
      lines.push(`*End:* ${formatDate(course && course.endDate)}`);
    }

    lines.push("*Schedule:*");
    getScheduleRows(course).forEach((row) => lines.push(`• ${row}`));
    lines.push("");
    lines.push(`*Public class details:* ${getPublicClassUrl(course)}`);
    lines.push("No login is required to view these details.");
    return lines.join("\n");
  }

  function buildWhatsAppUrl(data, course) {
    const configured = String(
      (data && data.support && data.support.whatsapp) || "https://wa.me/233241113054"
    ).split("?")[0];
    return `${configured}?text=${encodeURIComponent(buildShareText(course))}`;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #leadSelectedClassSummary.lead-selected-class { display:grid; gap:8px; padding:12px; font-weight:500; }
      .lead-class-share-title { display:block; color:#0f172a; font-size:16px; font-weight:900; line-height:1.3; }
      .lead-class-share-row { display:grid; grid-template-columns:minmax(72px,auto) 1fr; gap:8px; align-items:start; color:#334155; font-size:13px; line-height:1.45; }
      .lead-class-share-row strong { color:#1e3a8a; font-weight:850; }
      .lead-class-share-schedule { display:grid; gap:3px; }
      .lead-class-share-schedule span, .lead-class-share-note { display:block; }
      .lead-class-share-note { border-top:1px solid #bfdbfe; padding-top:8px; color:#475569; font-size:12px; font-weight:700; }
      .lead-copy { width:100%; min-height:50px; }
      @media (min-width:760px) { .lead-copy { grid-column:1 / -1; } }
    `;
    document.head.appendChild(style);
  }

  function addRow(summary, label, value) {
    const row = document.createElement("span");
    row.className = "lead-class-share-row";
    const heading = document.createElement("strong");
    heading.textContent = label;
    const content = document.createElement("span");
    content.textContent = value;
    row.append(heading, content);
    summary.appendChild(row);
  }

  function renderSummary(summary, course) {
    summary.textContent = "";
    summary.dataset.copyText = buildShareText(course);
    summary.dataset.shareSlug = getCourseSlug(course);
    summary.setAttribute("aria-label", "Selected class information ready to copy");

    const title = document.createElement("span");
    title.className = "lead-class-share-title";
    title.textContent = getCourseTitle(course);
    summary.appendChild(title);

    addRow(summary, "Cohort", getCourseCohort(course));
    addRow(summary, "Venue", getCourseLocation(course));
    addRow(
      summary,
      "Dates",
      course && course.availability === "always"
        ? "Always open"
        : `${formatDate(course && course.startDate)} – ${formatDate(course && course.endDate)}`
    );

    const scheduleRow = document.createElement("span");
    scheduleRow.className = "lead-class-share-row";
    const scheduleHeading = document.createElement("strong");
    scheduleHeading.textContent = "Schedule";
    const schedule = document.createElement("span");
    schedule.className = "lead-class-share-schedule";
    getScheduleRows(course).forEach((value) => {
      const item = document.createElement("span");
      item.textContent = `• ${value}`;
      schedule.appendChild(item);
    });
    scheduleRow.append(scheduleHeading, schedule);
    summary.appendChild(scheduleRow);

    const note = document.createElement("span");
    note.className = "lead-class-share-note";
    note.textContent = "Copy or send these details before filling the form. No login is required.";
    summary.appendChild(note);
  }

  function copyText(value) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      return navigator.clipboard.writeText(value);
    }
    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("Copy command failed"));
      } catch (error) {
        reject(error);
      } finally {
        textarea.remove();
      }
    });
  }

  function ensureCopyButton(card, summary) {
    const actions = card.querySelector(".lead-actions");
    if (!actions || card.querySelector(`#${COPY_BUTTON_ID}`)) return;
    const button = document.createElement("button");
    button.id = COPY_BUTTON_ID;
    button.type = "button";
    button.className = "button lead-copy";
    button.textContent = "Copy selected class details";
    actions.appendChild(button);

    button.addEventListener("click", () => {
      copyText(summary.dataset.copyText || summary.textContent || "")
        .then(() => {
          button.textContent = "Copied for WhatsApp";
          const status = card.querySelector("#leadStatus");
          if (status) status.textContent = "Class details copied. Paste them into WhatsApp or any message.";
        })
        .catch(() => {
          button.textContent = "Select and copy the details above";
        })
        .finally(() => {
          window.setTimeout(() => {
            button.textContent = "Copy selected class details";
          }, 2200);
        });
    });
  }

  function shortenOptions(select, classes) {
    Array.from(select.options || []).forEach((option) => {
      const course = classes.find((item) => getCourseSlug(item) === option.value);
      if (!course) return;
      const dates = course.availability === "always"
        ? "Always open"
        : `${formatDate(course.startDate)} – ${formatDate(course.endDate)}`;
      option.textContent = `${getCourseTitle(course)} · ${dates}`;
    });
  }

  function enhanceCard(data) {
    const card = document.getElementById("leadCaptureCard");
    if (!card) return false;
    const select = card.querySelector("#leadClass");
    const summary = card.querySelector("#leadSelectedClassSummary");
    const whatsapp = card.querySelector(".lead-whatsapp");
    const classes = Array.isArray(data && data.classes) ? data.classes : [];
    if (!select || !summary || !classes.length) return false;

    const renderSelectedCourse = () => {
      const course = classes.find((item) => getCourseSlug(item) === select.value) || classes[0];
      if (!course) return;
      renderSummary(summary, course);
      if (whatsapp) {
        whatsapp.href = buildWhatsAppUrl(data, course);
        whatsapp.textContent = "Send selected class on WhatsApp";
        whatsapp.setAttribute("aria-label", `Send ${getCourseTitle(course)} details on WhatsApp`);
      }
    };

    if (select.dataset.shareOptionsFormatted !== "true") {
      shortenOptions(select, classes);
      select.dataset.shareOptionsFormatted = "true";
    }
    if (select.dataset.shareListenerAttached !== "true") {
      select.addEventListener("change", () => window.setTimeout(renderSelectedCourse, 0));
      select.dataset.shareListenerAttached = "true";
    }

    renderSelectedCourse();
    ensureCopyButton(card, summary);
    return true;
  }

  function waitForLeadCard(data, attempt) {
    if (enhanceCard(data) || attempt >= 40) return;
    window.setTimeout(() => waitForLeadCard(data, attempt + 1), 100);
  }

  function init() {
    injectStyles();
    fetch(DATA_URL)
      .then((response) => response.json())
      .then((data) => waitForLeadCard(data, 0))
      .catch(() => {});
  }

  window.FalowenClassLeadShareFormat = {
    buildShareText,
    buildWhatsAppUrl,
    formatDate,
    formatTime,
    getCourseCohort,
    getCourseTitle,
    getScheduleRows,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
