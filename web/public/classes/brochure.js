const DAY_INDEX = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
const LIVE_CATALOG_ENDPOINTS = [
  "/api/public/classes",
  "https://europe-west1-falowen-examiner-trainer.cloudfunctions.net/publicClassesCatalog",
];
let brochureData = null;
let brochureDataPromise = null;
let selectedClassId = null;

const formatMoney = (amount) => `GHS ${Number(amount || 0).toLocaleString("en-GH")}`;
const formatDate = (iso) => {
  if (!iso) return "Always open";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
};
const formatTime = (time) => {
  if (!time) return "";
  const [hourRaw, minute] = time.split(":").map(Number);
  const suffix = hourRaw >= 12 ? "pm" : "am";
  const hour = hourRaw % 12 || 12;
  return `${hour}:${String(minute).padStart(2, "0")} ${suffix}`;
};
const addDays = (date, days) => new Date(date.getTime() + days * 86400000);
const toIso = (date) => date.toISOString().slice(0, 10);
const setText = (id, text) => {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
};
const setHtml = (id, html) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
};
const setHref = (id, href) => {
  const el = document.getElementById(id);
  if (el && href) el.href = href;
};

function isBrochureDebugMode() {
  const params = new URL(window.location.href).searchParams;
  return params.get("debug") === "1" || localStorage.getItem("falowen:class-brochure-debug") === "1";
}

function writeBrochureDebug(payload) {
  const entry = { at: new Date().toISOString(), ...payload };
  if (window.console && typeof window.console.info === "function") {
    console.info("[Falowen class brochure debug]", entry);
  }
  window.FalowenClassBrochureDebugLog = [entry, ...(window.FalowenClassBrochureDebugLog || [])].slice(0, 25);
  if (!isBrochureDebugMode()) return;
  let box = document.getElementById("brochureDebugBox");
  if (!box) {
    box = document.createElement("details");
    box.id = "brochureDebugBox";
    box.open = true;
    box.style.cssText = "margin:16px auto;max-width:1100px;border:1px dashed #2563eb;border-radius:14px;padding:10px 12px;background:#eff6ff;color:#1e3a8a;font:12px/1.45 system-ui,-apple-system,Segoe UI,sans-serif";
    box.innerHTML = '<summary style="font-weight:800;cursor:pointer">Class data debug</summary><pre id="brochureDebugOutput" style="white-space:pre-wrap;word-break:break-word;max-height:280px;overflow:auto;margin:8px 0 0">[]</pre>';
    (document.querySelector("main.page") || document.body).prepend(box);
  }
  const output = document.getElementById("brochureDebugOutput");
  if (output) output.textContent = JSON.stringify(window.FalowenClassBrochureDebugLog.slice(0, 12), null, 2);
}

const slugifyClassValue = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeClassSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^classes\/?/, "")
    .replace(/\/index\.html$/, "")
    .replace(/\/$/, "");

function addMinutes(time, minutesToAdd) {
  if (!time) return "";
  const [hourRaw, minuteRaw] = String(time).split(":").map(Number);
  const total = hourRaw * 60 + minuteRaw + Number(minutesToAdd || 60);
  return `${String(Math.floor((total % 1440) / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
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

function expandBrochureClass(rawClass = {}, defaults = {}) {
  const level = String(rawClass.level || rawClass.levelId || "A1").toUpperCase();
  const isSelfLearning = rawClass.availability === "always" || rawClass.isSelfLearning === true;
  const city = rawClass.city || (isSelfLearning ? "Online" : "");
  const title = rawClass.title || rawClass.name || (isSelfLearning ? `${level} Self-Learning` : `${level} ${city} Klasse`);
  const slug = rawClass.slug || slugifyClassValue(title);
  const sessionMinutes = rawClass.sessionMinutes || defaults.sessionMinutesByLevel?.[level] || 60;
  const meetingDays = Array.isArray(rawClass.meetingDays)
    ? rawClass.meetingDays.map((slot) => ({ ...slot, endTime: slot.endTime || addMinutes(slot.startTime, sessionMinutes) }))
    : Array.isArray(rawClass.scheduleRules)
      ? rawClass.scheduleRules.map((rule) => {
          const dayKey = String(rule.day || "").slice(0, 3).toLowerCase();
          const day = { sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday" }[dayKey] || rule.day;
          const startTime = rule.startTime || "";
          return { day, startTime, endTime: addMinutes(startTime, rule.durationMinutes || sessionMinutes) };
        })
      : [];
  const totalSessions = Number(rawClass.totalSessions ?? (isSelfLearning ? 0 : defaults.totalSessionsByLevel?.[level] ?? 24));
  const expanded = {
    ...rawClass,
    id: rawClass.id || (isSelfLearning ? `${level.toLowerCase()}-self-learning` : `${slug}-${String(rawClass.startDate || "").slice(0, 10)}`),
    slug,
    classUrl: rawClass.classUrl || `/classes/${slug}`,
    title,
    name: title,
    language: rawClass.language || defaults.language || "German",
    level,
    city,
    location: rawClass.location || (isSelfLearning ? defaults.selfLearningLocation : defaults.location),
    format: rawClass.format || (isSelfLearning ? defaults.selfLearningFormat : defaults.format),
    startDate: String(rawClass.startDate || "").slice(0, 10),
    orientationDate: String(rawClass.orientationDate || rawClass.startDate || "").slice(0, 10),
    endDate: String(rawClass.endDate || "").slice(0, 10),
    totalSessions,
    tuitionGhs: Number(rawClass.tuitionGhs ?? defaults.tuitionGhsByLevel?.[level] ?? 3000),
    meetingDays,
    highlights: rawClass.highlights || defaults.highlightsByLevel?.[level] || [],
    registrationOpen: rawClass.registrationOpen !== false,
    publicVisible: rawClass.publicVisible !== false,
  };
  expanded.scheduleUrl = buildScheduleUrl(defaults, expanded);
  return expanded;
}

function isBrochureClassOpen(course) {
  if (!course || course.publicVisible === false || course.registrationOpen === false) return false;
  if (course.availability === "always" || course.availability === "enquiry") return true;
  if (!course.startDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(`${course.startDate}T00:00:00`);
  const end = course.endDate ? new Date(`${course.endDate}T23:59:59`) : null;
  if (course.status === "active" && (!end || end >= today)) return true;
  if (start <= today && end && end >= today) return true;
  return start >= today;
}

function buildFallbackClassList(staticData, defaults) {
  const expanded = (staticData.classes || []).map((course) => expandBrochureClass(course, defaults));
  const selfLearning = expanded.filter((course) => course.availability === "always");
  const openLive = expanded.filter(
    (course) => course.availability !== "always" && isBrochureClassOpen(course),
  );
  const liveLevels = ["A1", "A2", "B1"];
  const liveByLevel = new Map(
    liveLevels.map((level) => [
      level,
      openLive
        .filter((course) => course.level === level)
        .sort((a, b) => String(a.startDate || "9999-12-31").localeCompare(String(b.startDate || "9999-12-31"))),
    ]),
  );

  const liveChoices = liveLevels.flatMap((level) => {
    const existing = liveByLevel.get(level) || [];
    if (existing.length) return existing;
    return [
      expandBrochureClass(
        {
          id: `${level.toLowerCase()}-next-live-class`,
          slug: `${level.toLowerCase()}-next-live-class`,
          title: `${level} Upcoming live class`,
          level,
          availability: "enquiry",
          status: "enquiry",
          city: "Accra",
          startDate: "",
          endDate: "",
          meetingDays: [],
          tuitionGhs: defaults.tuitionGhsByLevel?.[level],
          location: defaults.location,
          format: defaults.format,
          registrationOpen: true,
          publicVisible: true,
        },
        defaults,
      ),
    ];
  });

  return [...liveChoices, ...selfLearning];
}

async function fetchJsonNoCache(url) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "cache-control": "no-cache", pragma: "no-cache" },
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function fetchLiveClassCatalog() {
  const failures = [];
  for (const endpoint of LIVE_CATALOG_ENDPOINTS) {
    const separator = endpoint.includes("?") ? "&" : "?";
    try {
      const payload = await fetchJsonNoCache(`${endpoint}${separator}fresh=${Date.now()}`);
      if (!Array.isArray(payload?.classes)) throw new Error(`${endpoint} did not return a classes array`);
      return payload;
    } catch (error) {
      failures.push(error?.message || String(error));
    }
  }
  throw new Error(failures.join(" | ") || "Live class catalogue unavailable");
}

async function loadBrochureData() {
  writeBrochureDebug({ step: "loadBrochureData:start", href: window.location.href, requestedSlug: getRequestedSlug() });
  const staticData = await fetchJsonNoCache("/classes/classes-data.json");
  writeBrochureDebug({ step: "staticDataLoaded", classCount: staticData?.classes?.length || 0, hasDefaults: Boolean(staticData?.classDefaults) });
  const defaults = staticData.classDefaults || {};
  const fallbackClasses = buildFallbackClassList(staticData, defaults);
  const staticSelfLearning = fallbackClasses.filter((course) => course.availability === "always");

  try {
    const liveData = await fetchLiveClassCatalog();
    writeBrochureDebug({ step: "liveDataLoaded", classCount: liveData?.classes?.length || 0, generatedAt: liveData?.generatedAt || "" });
    const liveClasses = (liveData.classes || [])
      .map((course) => expandBrochureClass(course, defaults))
      .filter(isBrochureClassOpen);
    const liveTokens = new Set(liveClasses.flatMap((course) => [course.id, course.slug, course.title].filter(Boolean)));
    writeBrochureDebug({ step: "liveClassesExpanded", openClassCount: liveClasses.length, selfLearningCount: staticSelfLearning.length });
    return {
      ...staticData,
      catalogSource: "firestore",
      catalogGeneratedAt: liveData.generatedAt || "",
      classes: [
        ...liveClasses,
        ...staticSelfLearning.filter((course) => ![course.id, course.slug, course.title].some((token) => liveTokens.has(token))),
      ],
    };
  } catch (error) {
    console.warn("Live Falowen class catalogue unavailable", error);
    writeBrochureDebug({
      step: "liveDataError",
      message: error?.message || String(error),
      fallbackClassCount: fallbackClasses.length,
    });
    return {
      ...staticData,
      catalogSource: "fallback",
      catalogError: String(error?.message || error || "Live class API unavailable"),
      classes: fallbackClasses,
    };
  }
}

function loadBrochureDataOnce() {
  if (!brochureDataPromise) brochureDataPromise = loadBrochureData();
  return brochureDataPromise;
}

function getRequestedSlug() {
  const url = new URL(window.location.href);
  const querySlug = url.searchParams.get("class") || url.searchParams.get("slug");
  if (querySlug) return normalizeClassSlug(querySlug);
  return normalizeClassSlug(window.location.pathname);
}

function getClassShareUrl(course) {
  const base = `${window.location.origin}/classes/${course.slug || course.id}/`;
  return base.replace(/\/+/g, "/").replace("https:/", "https://").replace("http:/", "http://");
}

function buildPaystackLink(course) {
  const base = brochureData.payment.paystackBaseLinks[course.level] || brochureData.payment.paystackBaseLinks.A1;
  try {
    const url = new URL(base);
    url.searchParams.set("amount", String(Number(course.tuitionGhs || 0) * 100));
    url.searchParams.set("redirect_url", brochureData.payment.redirectUrl);
    url.searchParams.set("metadata", JSON.stringify({ classId: course.id, className: course.title, level: course.level }));
    return url.toString();
  } catch (error) {
    return base;
  }
}

function getUpcomingClasses() {
  const levelOrder = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  return brochureData.classes
    .filter(isBrochureClassOpen)
    .sort((a, b) => {
      const levelDiff = (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
      if (levelDiff) return levelDiff;
      if (a.availability === "always" && b.availability !== "always") return 1;
      if (b.availability === "always" && a.availability !== "always") return -1;
      if (a.availability === "enquiry" && b.availability !== "enquiry") return 1;
      if (b.availability === "enquiry" && a.availability !== "enquiry") return -1;
      return String(a.startDate || "9999-12-31").localeCompare(String(b.startDate || "9999-12-31"));
    });
}

function getCourseStartLabel(course) {
  if (course?.availability === "always") return "Start anytime";
  if (course?.availability === "enquiry") return "Next class date to be announced";
  return formatDate(course?.startDate);
}

function getCourseMeetingLabel(course) {
  if (course?.availability === "always") return "Self-learning";
  if (course?.availability === "enquiry") return "Schedule to be announced";
  return course?.meetingDays?.length
    ? course.meetingDays.map((slot) => `${slot.day} ${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`).join(", ")
    : "Schedule to be announced";
}

function getCourseList() {
  const upcoming = getUpcomingClasses();
  return upcoming.length ? upcoming : brochureData.classes;
}

function getCurriculumTitle(level, lessonDay) {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  return brochureData?.curriculumByLevel?.[normalizedLevel]?.[String(lessonDay)]
    || brochureData?.curriculumByLevel?.[normalizedLevel]?.[lessonDay]
    || "";
}

function getSessionLabel(course, sessionIndex) {
  if (sessionIndex === 0 && course.orientationDate) return "Orientation";
  const lessonDay = course.orientationDate ? sessionIndex : sessionIndex + 1;
  return getCurriculumTitle(course.level, lessonDay) || `Lesson ${lessonDay}`;
}

function generateSchedule(course) {
  if (!course.startDate || !course.meetingDays?.length || !course.totalSessions) return [];
  const output = [];
  let cursor = new Date(`${course.startDate}T00:00:00Z`);
  const slots = [...course.meetingDays].sort((a, b) => DAY_INDEX[a.day] - DAY_INDEX[b.day] || a.startTime.localeCompare(b.startTime));
  while (output.length < course.totalSessions) {
    const dayName = Object.keys(DAY_INDEX).find((name) => DAY_INDEX[name] === cursor.getUTCDay());
    slots.forEach((slot) => {
      if (slot.day !== dayName || output.length >= course.totalSessions) return;
      const index = output.length;
      output.push({
        number: index + 1,
        date: toIso(cursor),
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        label: getSessionLabel(course, index),
      });
    });
    cursor = addDays(cursor, 1);
  }
  return output;
}

function selectCourse(course) {
  selectedClassId = course.id;
  const nextUrl = getClassShareUrl(course);
  if (window.location.href !== nextUrl) {
    window.history.pushState({ classId: course.id }, "", nextUrl);
  }
  render();
}

function renderTabs(courseList) {
  const tabs = document.getElementById("classTabs");
  if (!tabs) return;
  tabs.innerHTML = "";
  courseList.forEach((course) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `class-tab ${course.id === selectedClassId ? "active" : ""}`;
    button.textContent = course.title;
    button.onclick = () => selectCourse(course);
    tabs.appendChild(button);
  });
}

function updateHeroText() {
  const heroTitle = document.querySelector(".hero h1");
  const heroText = document.querySelector(".hero p");
  if (heroTitle) heroTitle.textContent = "Choose your German class";
  if (heroText) {
    heroText.textContent = "Check the class fee, start date, meeting times and learning mode first. Register when the class fits your schedule, or take the placement test if you are unsure of your level.";
  }
}

function updateMeta(course, shareUrl) {
  const fee = formatMoney(course.tuitionGhs);
  const classLabel = course.availability === "always"
    ? `${course.level} German self-learning`
    : `${course.level} German class – ${course.title}`;
  const title = `${classLabel} | Fees & Schedule | Falowen`;
  const description = course.availability === "always"
    ? `${course.title}: view the course fee, learning mode, Falowen access and registration details.`
    : `${course.title} starts ${formatDate(course.startDate)}. View the ${fee} fee, class times, learning mode, schedule and registration details.`;

  document.title = title;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute("content", description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", title);
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute("content", description);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", shareUrl);

  let structured = document.getElementById("falowenCourseStructuredData");
  if (!structured) {
    structured = document.createElement("script");
    structured.id = "falowenCourseStructuredData";
    structured.type = "application/ld+json";
    document.head.appendChild(structured);
  }
  const courseInstance = course.availability === "always"
    ? {
        "@type": "CourseInstance",
        courseMode: "online",
      }
    : {
        "@type": "CourseInstance",
        courseMode: "hybrid",
        startDate: course.startDate || undefined,
        endDate: course.endDate || undefined,
        location: {
          "@type": "Place",
          name: course.location || "Learn Language Education Academy",
        },
      };
  structured.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description,
    provider: {
      "@type": "Organization",
      name: "Learn Language Education Academy",
      alternateName: brochureData?.academyProfile?.formerName || "Learn German Ghana",
      foundingDate: String(brochureData?.academyProfile?.establishedYear || 2022),
      url: "https://www.falowen.app",
    },
    educationalLevel: course.level,
    hasCourseInstance: courseInstance,
    offers: {
      "@type": "Offer",
      priceCurrency: "GHS",
      price: Number(course.tuitionGhs || 0),
      url: shareUrl,
      availability: "https://schema.org/InStock",
    },
  });
}

function renderCatalogStatus() {
  const existing = document.getElementById("catalogStatusNotice");
  if (brochureData?.catalogSource !== "fallback") {
    existing?.remove();
    return;
  }

  const notice = existing || document.createElement("section");
  notice.id = "catalogStatusNotice";
  notice.className = "card catalog-status-notice";
  notice.setAttribute("role", "status");
  notice.innerHTML = `
    <strong>Live class schedule temporarily unavailable</strong>
    <p>The live class service is reconnecting. A1–B1 remain available for enquiry, and any still-active saved class dates are kept visible without showing expired classes.</p>
    <a class="button" href="https://wa.me/233241113054" target="_blank" rel="noreferrer">Ask about the next live class</a>
  `;

  if (!existing) {
    const tabsCard = document.getElementById("classTabs")?.closest(".card");
    (tabsCard || document.querySelector(".hero"))?.insertAdjacentElement("afterend", notice);
  }
}

function hideClassInformationBox() {
  const copyText = document.getElementById("copyText");
  const copyButton = copyText?.parentElement?.querySelector("button");
  const classInfoCard = copyText?.closest(".card");
  if (classInfoCard) classInfoCard.style.display = "none";
  if (copyButton) copyButton.style.display = "none";
}

function ensureClassLayout() {
  const mainClassCard = document.getElementById("classTitle")?.closest(".card");
  const paymentCard = document.getElementById("payment");
  const classPills = document.getElementById("classPills");
  const title = document.getElementById("classTitle");
  const format = document.getElementById("classFormat");
  const stats = document.getElementById("stats");
  const highlights = document.getElementById("highlights")?.closest(".stack");

  if (!mainClassCard || mainClassCard.dataset.layoutReady === "true") return;
  mainClassCard.classList.add("class-main-card");

  const blueHeader = document.createElement("div");
  blueHeader.className = "class-blue-header";
  blueHeader.innerHTML = `
    <div class="class-blue-title" id="blueClassTitle">German A1</div>
    <div class="class-blue-meta" id="blueClassMeta"></div>
  `;

  const body = document.createElement("div");
  body.className = "class-body";

  [classPills, title, format, stats, highlights].forEach((node) => {
    if (node) body.appendChild(node);
  });

  if (paymentCard) body.appendChild(paymentCard);

  mainClassCard.innerHTML = "";
  mainClassCard.appendChild(blueHeader);
  mainClassCard.appendChild(body);
  mainClassCard.dataset.layoutReady = "true";
}

function ensurePaymentButtons() {
  const payment = document.getElementById("payment");
  if (!payment || payment.dataset.buttonsReady === "true") return;
  const links = ["payLink", "scheduleLink", "whatsappLink"].map((id) => document.getElementById(id)).filter(Boolean);
  const wrap = document.createElement("div");
  wrap.className = "payment-buttons";
  links.forEach((link) => wrap.appendChild(link));
  payment.appendChild(wrap);
  payment.dataset.buttonsReady = "true";
}

function ensureAgreementCard() {
  if (document.getElementById("agreementCard")) return;
  const scheduleCard = document.getElementById("scheduleList")?.closest(".card");
  const agreement = document.createElement("section");
  agreement.className = "card agreement-card";
  agreement.id = "agreementCard";
  agreement.style.marginTop = "16px";
  agreement.innerHTML = `
    <h2>Payment Agreement</h2>
    <p class="agreement-intro" id="agreementIntro"></p>
    <ul class="agreement-list" id="agreementList"></ul>
  `;
  scheduleCard?.insertAdjacentElement("afterend", agreement);
}

function renderAgreement(course, firstPayment, balance) {
  ensureAgreementCard();
  const today = formatDate(new Date().toISOString().slice(0, 10));
  const intro = document.getElementById("agreementIntro");
  const list = document.getElementById("agreementList");
  if (!intro || !list) return;

  const policy = {
    courseDurationWeeks: 10,
    fullPaymentAccessMonths: 6,
    installmentAccessMonths: 1,
    extensionGhsPerMonth: 1000,
    learningModes: ["In person", "Online", "Recorded lessons"],
    certificateType: "Certificate of Completion",
    officialCertificateNote:
      "Falowen completion certificates do not replace Goethe-Institut or another recognized official language certificate when an official certificate is required.",
    paymentIssueContact: "info@falowen.app",
    refundPolicy:
      "Once payment is confirmed and learning access is granted, fees are non-refundable except where required by law.",
    ...(brochureData?.coursePolicy || {}),
  };
  const learningModes = (policy.learningModes || []).join(", ");

  intro.textContent = `This Payment Agreement is entered into on ${today} for ${course.title} students of Learn Language Education Academy and Felix Asadu (“Teacher”).`;
  const terms = [
    `<strong>Payment Amount:</strong> The student agrees to pay a total of ${formatMoney(course.tuitionGhs)}.`,
    `<strong>Payment Schedule:</strong> Payment may be made in full or in two installments. The first installment is ${formatMoney(firstPayment)}, and the remaining balance of ${formatMoney(balance)} is due one month after the first payment. The starter installment gives ${policy.installmentAccessMonths} month of access until the balance is due.`,
    `<strong>Learning Mode & Attendance Rights:</strong> Available learning modes are ${learningModes}. The student may choose the suitable mode for each scheduled session.`,
    `<strong>Class Duration & Contract Term:</strong> The taught course is approximately ${policy.courseDurationWeeks} weeks. Full payment gives ${policy.fullPaymentAccessMonths} months of Falowen access from enrollment, including revision time after the scheduled classes end.`,
    `<strong>Post-Contract Access:</strong> After ${policy.fullPaymentAccessMonths} months, continued access can be extended at GHS ${Number(policy.extensionGhsPerMonth || 0).toLocaleString("en-GH")} per month or by enrolling in a new class at the current fee.`,
    `<strong>Attendance:</strong> Attendance is recorded for each session in My Results & Resources.`,
    `<strong>Certification:</strong> Falowen issues a ${policy.certificateType} upon successful completion and required assignment submission. ${policy.officialCertificateNote}`,
    `<strong>Late Payments:</strong> Late payment may lead to revoked access to learning platforms.`,
    `<strong>Refunds:</strong> ${policy.refundPolicy}`,
    `<strong>How to Pay:</strong> Pay inside your Falowen account after choosing a class under Upcoming Classes. If you have payment issues, contact ${policy.paymentIssueContact} or use WhatsApp support.`,
    `<strong>Class Level & Start Date:</strong> Level, dates, and fees are shown on this page and may vary by cohort. Confirm your class details before paying. By making any payment, you acknowledge and agree to these terms.`,
  ];
  list.innerHTML = terms.map((term) => `<li>${term}</li>`).join("");
}

function render() {
  const courses = getUpcomingClasses();
  const sourceList = getCourseList();
  const requestedSlug = getRequestedSlug();
  const requestedCourse = requestedSlug
    ? brochureData.classes.find((course) => course.slug === requestedSlug || course.id === requestedSlug)
    : null;
  if (requestedCourse) selectedClassId = requestedCourse.id;
  if (!selectedClassId) selectedClassId = sourceList[0]?.id;

  const course = brochureData.classes.find((item) => item.id === selectedClassId) || sourceList[0];
  writeBrochureDebug({
    step: "render:selection",
    requestedSlug,
    selectedClassId,
    selectedTitle: course?.title || "",
    totalClasses: brochureData.classes.length,
    upcomingCount: courses.length,
    sourceCount: sourceList.length,
    catalogSource: brochureData.catalogSource || "static",
    catalogError: brochureData.catalogError || "",
  });
  if (!course) {
    writeBrochureDebug({ step: "render:noCourse", classIds: (brochureData.classes || []).map((item) => ({ id: item.id, slug: item.slug, title: item.title })) });
    setText("classTitle", "No class data found");
    setText("classFormat", "Open this page with ?debug=1 and send the Class data debug panel to Falowen support.");
    return;
  }

  const schedule = generateSchedule(course);
  const paymentLink = buildPaystackLink(course);
  const firstPayment = Math.min(course.tuitionGhs || 0, brochureData.payment.minimumInstallmentGhs);
  const balance = Math.max((course.tuitionGhs || 0) - firstPayment, 0);
  const shareUrl = getClassShareUrl(course);
  const classScheduleUrl = course.scheduleUrl || course.docUrl || shareUrl;

  updateHeroText();
  renderTabs(sourceList);
  updateMeta(course, shareUrl);
  renderCatalogStatus();
  hideClassInformationBox();
  ensurePaymentButtons();
  ensureClassLayout();
  renderAgreement(course, firstPayment, balance);

  setHtml("selectionNotice", courses.length
    ? `<span>Available class:</span><br><strong>${courses[0].title} · ${getCourseStartLabel(courses[0])}</strong>`
    : "Available class options are shown below.");

  setText("blueClassTitle", `${course.language} ${course.level}`);
  setHtml("blueClassMeta", [
    `📍 ${course.city}`,
    `📅 ${getCourseStartLabel(course)}`,
    course.endDate ? `🏁 Ends ${formatDate(course.endDate)}` : "",
  ].filter(Boolean).map((item) => `<span>${item}</span>`).join(""));

  setHtml("classPills", [
    `${course.language} ${course.level}`,
    course.city,
    course.availability === "always"
      ? "Always open"
      : course.availability === "enquiry"
        ? "Next class date to be announced"
        : `Starts ${formatDate(course.startDate)}`,
    course.endDate ? `Ends ${formatDate(course.endDate)}` : "",
  ].filter(Boolean).map((text) => `<span class="pill">${text}</span>`).join(""));
  setText("classTitle", course.title);
  setText("classFormat", course.format);
  setHtml("stats", [
    ["Full course fee", formatMoney(course.tuitionGhs)],
    ["Installment option", `${formatMoney(firstPayment)} first payment`],
    ["Balance after installment", `${formatMoney(balance)} after 1 month`],
  ].map(([label, value]) => `<div class="stat"><span>${label}</span><b>${value}</b></div>`).join(""));
  setHtml("highlights", (course.highlights || []).map((item) => `<li>${item}</li>`).join(""));
  const installmentAccessMonths = Number(brochureData?.coursePolicy?.installmentAccessMonths || 1);
  setText("paymentSummary", `${course.title}: you can pay the full fee of ${formatMoney(course.tuitionGhs)} or start with an installment of ${formatMoney(firstPayment)}. The balance of ${formatMoney(balance)} is due after ${installmentAccessMonths} month${installmentAccessMonths === 1 ? "" : "s"}.`);
  setHref("payLink", paymentLink);
  setHref("payHero", "/signup/");
  setHref("shareLink", shareUrl);
  setHref("scheduleLink", classScheduleUrl);
  const scheduleLink = document.getElementById("scheduleLink");
  if (scheduleLink) scheduleLink.style.display = classScheduleUrl ? "inline-flex" : "none";
  setHref("whatsappLink", `${brochureData.support.whatsapp}?text=${encodeURIComponent(`Hello, I want to enquire about ${course.title}. ${getCourseStartLabel(course)}.`)}`);

  setHtml("meetingRows", course.meetingDays?.length
    ? course.meetingDays.map((slot) => `<tr><td>${slot.day}</td><td>${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}</td><td>Hybrid: in person or online</td></tr>`).join("")
    : course.availability === "always"
      ? `<tr><td colspan="3">Self-learning / no fixed live meeting days.</td></tr>`
      : `<tr><td colspan="3">The next live-class schedule will be announced.</td></tr>`);

  const academyProfile = brochureData?.academyProfile || { establishedYear: 2022, examPassHeadline: "High exam pass rate", germanLevels: "A1–C2" };\n  const copy = `${course.title}\nEstablished: ${academyProfile.establishedYear}\nExam performance: ${academyProfile.examPassHeadline}\nGerman learning: ${academyProfile.germanLevels}\nFull fee: ${formatMoney(course.tuitionGhs)}\nInstallment option: ${formatMoney(firstPayment)} first payment, balance ${formatMoney(balance)} after ${installmentAccessMonths} month${installmentAccessMonths === 1 ? "" : "s"}\nMeeting times: ${getCourseMeetingLabel(course)}\nClass schedule: ${classScheduleUrl}`;
  const copyText = document.getElementById("copyText");
  if (copyText) copyText.textContent = copy;
  window.currentBrochureText = copy;

  setText("scheduleHint", schedule.length
    ? `${course.totalSessions} sessions generated from ${formatDate(course.startDate)}`
    : course.availability === "always"
      ? "This track is self-learning, so there is no fixed live class schedule."
      : "The next live-class schedule will be announced.");
  window.currentBrochureCourse = course;
  writeBrochureDebug({ step: "render:complete", renderedClassId: course.id, renderedSlug: course.slug, scheduleCount: schedule.length, hasPaymentLink: Boolean(paymentLink), hasScheduleUrl: Boolean(classScheduleUrl) });

  setHtml("scheduleList", schedule.length
    ? schedule.map((item) => `<div class="session-row"><div class="session-num">#${item.number}</div><div><div class="session-title">${item.label}</div><div class="session-meta">${formatDate(item.date)} · ${item.day} · 🕒 ${formatTime(item.startTime)} – ${formatTime(item.endTime)}</div></div></div>`).join("")
    : course.availability === "always"
      ? `<div class="session-row"><div class="session-num">∞</div><div><div class="session-title">Self-learning</div><div class="session-meta">Start anytime after registration and payment confirmation.</div></div></div>`
      : `<div class="session-row"><div class="session-num">•</div><div><div class="session-title">Next live class</div><div class="session-meta">The date and meeting times will be published when the next class is confirmed.</div></div></div>`);

  window.dispatchEvent(new CustomEvent("falowen:brochure-rendered", {
    detail: { course, shareUrl, classScheduleUrl, paymentLink },
  }));
}

async function copyBrochureText() {
  try {
    await navigator.clipboard.writeText(window.currentBrochureText || "");
    alert("Brochure reply copied.");
  } catch (error) {
    alert("Copy failed. You can highlight the text and copy manually.");
  }
}

window.addEventListener("popstate", () => render());
window.FalowenLoadClassCatalog = loadBrochureDataOnce;

loadBrochureDataOnce()
  .then((data) => {
    brochureData = data;
    window.FalowenClassBrochureData = data;
    writeBrochureDebug({ step: "loadBrochureData:complete", classCount: data?.classes?.length || 0, catalogSource: data?.catalogSource || "static" });
    render();
  })
  .catch((error) => {
    console.error("Could not load class brochure", error);
    writeBrochureDebug({ step: "loadBrochureData:fatal", message: error?.message || String(error) });
    setText("classTitle", "Class details are loading");
    setText("classFormat", "Please refresh the page if details do not appear.");
  });
