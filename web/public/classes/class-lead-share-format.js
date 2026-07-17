(function () {
  const DATA_URL = "/classes/classes-data.json";
  const DEFAULT_LOCATION = "Ghana, Accra - Awoshie";
  const STYLE_ID = "falowenClassLeadShareFormatStyles";
  const COPY_BUTTON_ID = "leadCopyClassDetails";

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

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
    if (!time) return "";
    const parts = String(time).split(":").map(Number);
    const hourRaw = parts[0];
    const minute = parts[1];
    if (!Number.isFinite(hourRaw) || !Number.isFinite(minute)) return String(time);
    const suffix = hourRaw >= 12 ? "pm" : "am";
    const hour = hourRaw % 12 || 12;
    return `${hour}:${String(minute).padStart(2, "0")} ${suffix}`;
  }

  function getCourseTitle(course) {
    if (course && course.title) return String(course.title).trim();
    const level = String((course && course.level) || "German").trim();
    const city = String((course && course.city) || "").trim();
    if (course && course.availability === "always") return `${level} Self-learning`;
    if (level && city) return `${level} ${city} Klasse`;
    return level || city || "German class";
  }

  function getCourseSlug(course) {
    return slugify((course && (course.slug || course.id)) || getCourseTitle(course));
  }

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
      const day = String((slot && slot.day) || "Class day").trim();
      const start = formatTime(slot && slot.startTime);
      const end = formatTime(slot && slot.endTime);
      return `${day}: ${start}${start && end ? " – " : ""}${end}`.trim();
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

  function getWhatsAppBase(data) {
    const configured = String((data && data.support && data.support.whatsapp) || "https://wa.me/233241113054").trim();
    return configured.split("?")[0];
  }

  function buildWhatsAppUrl(data, course) {
    return `${getWhatsAppBase(data)}?text=${encodeURIComponent(buildShareText(course))}`;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #leadSelectedClassSummary.lead-selected-class {
        display: grid;
        gap: 8px;
        padding: 12px;
        font-weight: 500;
      }
      .lead-class-share-title {
        display: block;
        color: #0f172a;
        font-size: 16px;
        font-weight: 900;
        line-height: 1.3;
      }
      .lead-class-share-row {
        display: grid;
        grid-template-columns: minmax(72px, auto) 1fr;
        gap: 8px;
        align-items: start;
        color: #334155;
        font-size: 13px;
        line-height: 1.45;
      }
      .lead-class-share-row strong {
        color: #1e3a8a;
        font-weight: 850;
      }
      .lead-class-share-schedule {
        display: grid;
        gap: 3px;
      }
      .lead-class-share-schedule span { display: block; }
      .lead-class-share-note {
        display: block;
        border-top: 1px solid #bfdbfe;
        padding-top: 8px;
        color: #475569;
        font-size: 12px;
        font-weight: 700;
      }
      .lead-copy {
        width: 100%;
        min-height: 50px;
      }
      @media (min-width: 760px) {
        .lead-copy { grid-column: 1 / -1; }
      }
    `;
    document.head.appendChild(style);
  }

  function appendLabelledRow(summary, label, value) {
    const row = document.createElement("span");
    row.className = "lead-class-share-row";

    const heading = document.createElement("strong");
    heading.textContent = label;

    const content = document.createElement("span");
    content.textContent = value;

    row.appendChild(heading);
    row.appendChild(content);
    summary.appendChild(row);
  }

  function renderStructuredSummary(summary, course) {
    summary.textContent = "";
    summary.dataset.shareSlug = getCourseSlug(course);
    summary.dataset.copyText = buildShareText(course);
    summary.setAttribute("aria-label", "Selected class information ready to copy");

    const title = document.createElement("span");
    title.className = "lead-class-share-title";
    title.textContent = getCourseTitle(course);
    summary.appendChild(title);

    appendLabelledRow(summary, "Cohort", getCourseCohort(course));
    appendLabelledRow(summary, "Venue", getCourseLocation(course));

    if (course && course.availability === "always") {
      appendLabelledRow(summary, "Dates", "Always open");
    } else {
      appendLabelledRow(
        summary,
        "Dates",
        `${formatDate(course && course.startDate)} – ${formatDate(course && course.endDate)}`
      );
    }

    const scheduleRow = document.createElement("span");
    scheduleRow.className = "lead-class-share-row";
    const scheduleHeading = document.createElement("strong");
    scheduleHeading.textContent = "Schedule";
    const schedule = document.createElement("span");
    schedule.className = "lead-class-share-schedule";
    getScheduleRows(course).forEach((row) => {
      const item = document.createElement("span");
      item.textContent = `• ${row}`;
      schedule.appendChild(item);
    });
    scheduleRow.appendChild(scheduleHeading);
    scheduleRow.appendChild(schedule);
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
        document.execCommand("copy");
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        textarea.remove();
      }
    });
  }

  function ensureCopyButton(card, summary) {
    const actions = card.querySelector(".lead-actions");
    if (!actions) return null;

    let button = card.querySelector(`#${COPY_BUTTON_ID}`);
    if (!button) {
      button = document.createElement("button");
      button.id = COPY_BUTTON_ID;
      button.type = "button";
      button.className = "button lead-copy";
      button.textContent = "Copy selected class details";
      actions.appendChild(button);

      button.addEventListener("click", () => {
        const copyValue = summary.dataset.copyText || summary.textContent || "";
        const originalLabel = "Copy selected class details";
        copyText(copyValue)
          .then(() => {
            button.textContent = "Copied for WhatsApp";
            const status = card.querySelector("#leadStatus");
            if (status) status.textContent = "Class details copied. Paste them into WhatsApp or any message.";
            window.setTimeout(() => {
              button.textContent = originalLabel;
            }, 2200);
          })
          .catch(() => {
            button.textContent = "Select and copy the details above";
            window.setTimeout(() => {
              button.textContent = originalLabel;
            }, 2500);
          });
      });
    }

    return button;
  }

  function shortenSelectOptions(select, classes) {
    Array.from(select.options || []).forEach((option) => {
      const course = classes.find((item) => getCourseSlug(item) === option.value);
      if (!course) return;
      const dates = course.availability === "always"
        ? "Always open"
        : `${formatDate(course.startDate)} – ${formatDate(course.endDate)}`;
      option.textContent = `${getCourseTitle(course)} · ${dates}`;
    });
  }

  function enhanceLeadCard(data) {
    const card = document.getElementById("leadCaptureCard");
    if (!card) return false;

    const select = card.querySelector("#leadClass");
    const summary = card.querySelector("#leadSelectedClassSummary");
    const whatsapp = card.querySelector(".lead-whatsapp");
    const classes = Array.isArray(data && data.classes) ? data.classes : [];
    if (!select || !summary || !classes.length) return false;

    const course = classes.find((item) => getCourseSlug(item) === select.value) || classes[0];
    if (!course) return false;

    if (select.dataset.shareOptionsFormatted !== "true") {
      shortenSelectOptions(select, classes);
      select.dataset.shareOptionsFormatted = "true";
    }

    if (
      summary.dataset.shareSlug !== getCourseSlug(course) ||
      !summary.querySelector(".lead-class-share-title")
    ) {
      renderStructuredSummary(summary, course);
    }

    if (whatsapp) {
      whatsapp.href = buildWhatsAppUrl(data, course);
      whatsapp.textContent = "Send selected class on WhatsApp";
      whatsapp.setAttribute("aria-label", `Send ${getCourseTitle(course)} details on WhatsApp`);
    }

    ensureCopyButton(card, summary);
    return true;
  }

  function init() {
    injectStyles();
    fetch(DATA_URL)
      .then((response) => response.json())
      .then((data) => {
        const runEnhancement = () => enhanceLeadCard(data);
        runEnhancement();

        const observer = new MutationObserver(runEnhancement);
        observer.observe(document.body, { childList: true, subtree: true });

        document.addEventListener("change", (event) => {
          if (event.target && event.target.id === "leadClass") {
            window.setTimeout(runEnhancement, 0);
          }
        });

        window.setTimeout(runEnhancement, 400);
        window.setTimeout(runEnhancement, 1000);
      })
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
