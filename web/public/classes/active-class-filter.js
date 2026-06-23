(function () {
  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function isCourseOpen(course) {
    if (!course) return false;
    if (course.availability === "always") return true;
    if (!course.startDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(`${course.startDate}T00:00:00`);
    const end = course.endDate ? new Date(`${course.endDate}T23:59:59`) : null;
    if (course.status === "active" && (!end || end >= today)) return true;
    return start >= today;
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

  function classLabel(course) {
    if (course.availability === "always") return `${course.title} · Always open · Self-learning`;
    const times = Array.isArray(course.meetingDays) && course.meetingDays.length
      ? course.meetingDays.map((slot) => `${slot.day} ${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`).join(", ")
      : "Schedule pending";
    return `${course.title} · Starts ${formatDate(course.startDate)} · ${times}`;
  }

  function getActiveClasses(data) {
    const sourceIsLive = data.catalogSource === "firestore";
    return (data.classes || [])
      .filter((course) => sourceIsLive || course.availability === "always")
      .filter(isCourseOpen)
      .sort((a, b) => {
        if (a.availability === "always" && b.availability !== "always") return 1;
        if (b.availability === "always" && a.availability !== "always") return -1;
        return String(a.startDate || "9999-12-31").localeCompare(String(b.startDate || "9999-12-31"));
      });
  }

  function applyActiveClassFilter(data) {
    const select = document.getElementById("leadClass");
    if (!select) return false;

    const activeClasses = getActiveClasses(data);
    const status = document.getElementById("leadStatus");
    const submit = document.querySelector("#leadCaptureForm button[type='submit']");
    const help = document.querySelector(".lead-help");
    const sourceIsLive = data.catalogSource === "firestore";

    if (!activeClasses.length) {
      select.innerHTML = '<option value="">No upcoming class is open now</option>';
      select.disabled = true;
      if (submit) submit.disabled = true;
      if (status) status.textContent = sourceIsLive
        ? "No upcoming class is open now. Please check again later."
        : "The live class list is temporarily unavailable. Please try again shortly.";
      select.dataset.activeFiltered = "true";
      select.dataset.catalogSource = data.catalogSource || "unknown";
      return true;
    }

    const requestedSlug = getRequestedSlug();
    const requestedIsActive = activeClasses.some((course) => course.slug === requestedSlug || course.id === requestedSlug);
    const selectedSlug = requestedIsActive ? requestedSlug : activeClasses[0].slug;

    select.innerHTML = activeClasses
      .map((course) => `<option value="${course.slug}" ${course.slug === selectedSlug ? "selected" : ""}>${classLabel(course)}</option>`)
      .join("");
    select.disabled = false;
    if (submit) submit.disabled = false;
    select.dataset.activeFiltered = "true";
    select.dataset.catalogSource = data.catalogSource || "unknown";

    if (help) help.textContent = sourceIsLive
      ? "Class dates and times are synchronized from Falowen Admin."
      : "Live class dates are temporarily unavailable. Only always-open self-learning is shown.";
    if (status && !sourceIsLive) status.textContent = "Live class dates are temporarily unavailable, so old saved dates have been hidden.";

    if (!requestedIsActive && activeClasses[0]) {
      const nextUrl = `/classes/${activeClasses[0].slug}/`;
      window.history.replaceState(null, "", nextUrl);
      select.dispatchEvent(new Event("change", { bubbles: true }));
      if (status && sourceIsLive) status.textContent = "";
    }

    return true;
  }

  function init() {
    fetch("/classes/classes-data.json", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (applyActiveClassFilter(data)) return;
        const timer = setInterval(() => {
          if (applyActiveClassFilter(data)) clearInterval(timer);
        }, 250);
        setTimeout(() => clearInterval(timer), 5000);
      })
      .catch(() => {
        const status = document.getElementById("leadStatus");
        if (status) status.textContent = "The class list could not be loaded. Please refresh and try again.";
      });
  }

  window.addEventListener("load", init);
  setTimeout(init, 500);
})();
