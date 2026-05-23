(function () {
  const originalFetch = window.fetch.bind(window);
  const DAY_INDEX = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function addMinutes(time, minutesToAdd) {
    if (!time) return "";
    const [hourRaw, minuteRaw] = time.split(":").map(Number);
    const total = hourRaw * 60 + minuteRaw + Number(minutesToAdd || 60);
    const hour = Math.floor((total % 1440) / 60);
    const minute = total % 60;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }

  function addDays(date, days) {
    return new Date(date.getTime() + days * 86400000);
  }

  function toIso(date) {
    return date.toISOString().slice(0, 10);
  }

  function generateMeetingDates(startDate, meetingDays, totalSessions) {
    if (!startDate || !Array.isArray(meetingDays) || !meetingDays.length || !totalSessions) return [];

    const output = [];
    let cursor = new Date(`${startDate}T00:00:00Z`);
    const slots = [...meetingDays].sort((a, b) => {
      const dayDiff = (DAY_INDEX[a.day] ?? 99) - (DAY_INDEX[b.day] ?? 99);
      if (dayDiff !== 0) return dayDiff;
      return String(a.startTime || "").localeCompare(String(b.startTime || ""));
    });

    while (output.length < totalSessions) {
      const dayName = Object.keys(DAY_INDEX).find((name) => DAY_INDEX[name] === cursor.getUTCDay());
      slots.forEach((slot) => {
        if (slot.day !== dayName || output.length >= totalSessions) return;
        output.push(toIso(cursor));
      });
      cursor = addDays(cursor, 1);
    }

    return output;
  }

  function buildScheduleUrl(defaults, course) {
    if (course.scheduleUrl) return course.scheduleUrl;
    if (!course.startDate || !Array.isArray(course.meetingDays) || !course.meetingDays.length) return "";

    const url = new URL(defaults.scheduleBaseUrl || "https://admin.falowen.app/course-schedule/public");
    url.searchParams.set("level", course.level);
    url.searchParams.set("startDate", course.startDate);
    url.searchParams.set("defaultWeekdays", course.meetingDays.map((item) => item.day).join(","));
    url.searchParams.set("holidayDates", "");
    url.searchParams.set("useAdvancedWeekdays", "false");
    url.searchParams.set("weekDaysMap", "{}");
    return url.toString();
  }

  function expandClass(rawClass, defaults) {
    const level = rawClass.level || "A1";
    const isSelfLearning = rawClass.availability === "always" || rawClass.isSelfLearning === true;
    const city = rawClass.city || (isSelfLearning ? "Online" : "");
    const title = rawClass.title || (isSelfLearning ? `${level} Self-Learning` : `${level} ${city} Klasse`);
    const slug = rawClass.slug || slugify(title);
    const tuitionGhs = rawClass.tuitionGhs ?? defaults.tuitionGhsByLevel?.[level] ?? 3000;
    const totalSessions = rawClass.totalSessions ?? (isSelfLearning ? 0 : defaults.totalSessionsByLevel?.[level] ?? 24);
    const sessionMinutes = rawClass.sessionMinutes ?? defaults.sessionMinutesByLevel?.[level] ?? 60;
    const meetingDays = Array.isArray(rawClass.meetingDays)
      ? rawClass.meetingDays.map((slot) => ({
          ...slot,
          endTime: slot.endTime || addMinutes(slot.startTime, sessionMinutes),
        }))
      : [];
    const meetingDates = generateMeetingDates(rawClass.startDate, meetingDays, totalSessions);
    const endDate = rawClass.endDate || meetingDates.at(-1) || "";

    return {
      ...rawClass,
      id: rawClass.id || (isSelfLearning ? `${level.toLowerCase()}-self-learning` : `${slug}-${rawClass.startDate}`),
      slug,
      title,
      language: rawClass.language || defaults.language || "German",
      level,
      city,
      location: rawClass.location || (isSelfLearning ? defaults.selfLearningLocation : defaults.location),
      format: rawClass.format || (isSelfLearning ? defaults.selfLearningFormat : defaults.format),
      availability: rawClass.availability,
      startDate: rawClass.startDate || "",
      orientationDate: rawClass.orientationDate || rawClass.startDate || "",
      endDate,
      totalSessions,
      tuitionGhs,
      meetingDays,
      scheduleUrl: buildScheduleUrl(defaults, { ...rawClass, level, startDate: rawClass.startDate, meetingDays }),
      highlights: rawClass.highlights || defaults.highlightsByLevel?.[level] || [],
    };
  }

  function expandClassData(data) {
    const defaults = data.classDefaults || {};
    return {
      ...data,
      classes: Array.isArray(data.classes) ? data.classes.map((item) => expandClass(item, defaults)) : [],
    };
  }

  window.fetch = function patchedFetch(resource, init) {
    return originalFetch(resource, init).then(async (response) => {
      const url = typeof resource === "string" ? resource : resource?.url || "";
      if (!url.includes("/classes/classes-data.json") && !url.endsWith("classes-data.json")) {
        return response;
      }

      try {
        const data = await response.clone().json();
        const expanded = expandClassData(data);
        return new Response(JSON.stringify(expanded), {
          status: response.status,
          statusText: response.statusText,
          headers: { "content-type": "application/json" },
        });
      } catch (error) {
        return response;
      }
    });
  };
})();
