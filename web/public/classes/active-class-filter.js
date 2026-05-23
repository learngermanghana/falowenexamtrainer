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
    const times = Array.isArray(course.meetingDays) && course.meetingDays.length
      ? course.meetingDays.map((slot) => `${slot.day} ${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`).join(", ")
      : "Self-learning";
    return `${course.title} · Starts ${formatDate(course.startDate)} · ${times}`;
  }

  function getActiveClasses(data) {
    return (data.classes || [])
      .filter(isCourseOpen)
      .sort((a, b) => {
        if (a.availability === "always" && b.availability !== "always") return 1;
        if (b.availability === "always" && a.availability !== "always") return -1;
        return String(a.startDate || "9999-12-31").localeCompare(String(b.startDate || "9999-12-31"));
      });
  }

  function applyActiveClassFilter(data) {
    const select = document.getElementById("leadClass");
    if (!select || select.dataset.activeFiltered === "true") return false;

    const activeClasses = getActiveClasses(data);
    const status = document.getElementById("leadStatus");
    const submit = document.querySelector("#leadCaptureForm button[type='submit']");
    const help = document.querySelector(".lead-help");

    if (!activeClasses.length) {
      select.innerHTML = '<option value="">No upcoming class is open now</option>';
      select.disabled = true;
      if (submit) submit.disabled = true;
      if (status) status.textContent = "No upcoming class is open now. Please check again later.";
      return true;
    }

    const requestedSlug = getRequestedSlug();
    const requestedIsActive = activeClasses.some((course) => course.slug === requestedSlug || course.id === requestedSlug);
    const selectedSlug = requestedIsActive ? requestedSlug : activeClasses[0].slug;

    select.innerHTML = activeClasses
      .map((course) => `<option value="${course.slug}" ${course.slug === selectedSlug ? "selected" : ""}>${classLabel(course)}</option>`)
      .join("");

    select.dataset.activeFiltered = "true";
    if (help) help.textContent = "Only upcoming classes and always-open self-learning classes are shown here.";

    if (!requestedIsActive && activeClasses[0]) {
      const nextUrl = `/classes/${activeClasses[0].slug}/`;
      window.history.replaceState(null, "", nextUrl);
      select.dispatchEvent(new Event("change", { bubbles: true }));
      if (status) status.textContent = "The old class link is closed, so we selected the next available class.";
    }

    return true;
  }

  function init() {
    fetch("/classes/classes-data.json")
      .then((response) => response.json())
      .then((data) => {
        if (applyActiveClassFilter(data)) return;
        const timer = setInterval(() => {
          if (applyActiveClassFilter(data)) clearInterval(timer);
        }, 250);
        setTimeout(() => clearInterval(timer), 5000);
      })
      .catch(() => {});
  }

  window.addEventListener("load", init);
  setTimeout(init, 500);
})();
