const DAY_INDEX = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
let brochureData = null;
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

const normalizeClassSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^classes\/?/, "")
    .replace(/\/index\.html$/, "")
    .replace(/\/$/, "");

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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return brochureData.classes
    .filter((course) => course.availability === "always" || course.startDate)
    .filter((course) => {
      if (course.availability === "always") return true;
      const start = new Date(`${course.startDate}T00:00:00`);
      return start >= today;
    })
    .sort((a, b) => {
      if (a.availability === "always" && b.availability !== "always") return 1;
      if (b.availability === "always" && a.availability !== "always") return -1;
      return String(a.startDate || "9999").localeCompare(String(b.startDate || "9999"));
    });
}

function getCourseList() {
  const upcoming = getUpcomingClasses();
  return upcoming.length ? upcoming : brochureData.classes;
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
        label: index === 0 && course.orientationDate ? "Orientation" : index === 1 && course.orientationDate ? "Lesson 1" : `Lesson ${course.orientationDate ? index : index + 1}`,
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

function updateMeta(course, shareUrl) {
  const title = `${course.title} | Falowen Classes`;
  const description = `${course.title} starts ${formatDate(course.startDate)}. View fee, meeting times, generated schedule, payment link, and payment agreement.`;
  document.title = title;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute("content", description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", title);
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute("content", description);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", shareUrl);
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

  if (paymentCard) {
    paymentCard.querySelectorAll(".button").forEach((button) => button.parentElement?.classList.add("payment-buttons"));
    body.appendChild(paymentCard);
  }

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

  intro.textContent = `This Payment Agreement is entered into on ${today} for ${course.title} students of Learn Language Education Academy and Felix Asadu (“Teacher”).`;
  const terms = [
    `<strong>Payment Amount:</strong> The student agrees to pay a total of ${formatMoney(course.tuitionGhs)}. The fee is the same regardless of learning mode: online, in person, self-learning, or recorded lectures.`,
    `<strong>Payment Schedule:</strong> Payment may be made in full or in two installments. The first installment is ${formatMoney(firstPayment)}, and the remaining balance of ${formatMoney(balance)} is due one month after the first payment. Minimum first installment is ${formatMoney(firstPayment)}.`,
    `<strong>Learning Mode & Attendance Rights:</strong> For each scheduled class session, the student may join in person, online, or via recorded lecture, and is responsible for choosing and attending in their preferred way each time.`,
    `<strong>Class Duration & Contract Term:</strong> This class runs from ${formatDate(course.startDate)} to ${formatDate(course.endDate)}. The service provides a 6-month contract period from enrollment, during which the student has access to Falowen, even after the scheduled class sessions end.`,
    `<strong>Post-Contract Access:</strong> After 6 months, continued access requires either an extension at GHS 1,000 per month or enrollment in a new class at the then-current fee.`,
    `<strong>Attendance:</strong> Attendance is recorded for each session in My Results & Resources.`,
    `<strong>Certification:</strong> Certificates are issued upon successful completion and assignment submission. This is a Certificate of Completion, not a Goethe-Institut certificate. Where official language certification is required, the student must sit the exam at Goethe-Institut or another recognized provider.`,
    `<strong>Late Payments:</strong> Late payment may lead to revoked access to learning platforms. No refund will be made.`,
    `<strong>Refunds:</strong> Once payment is confirmed and access is granted, no refunds will be provided except where required by law.`,
    `<strong>How to Pay:</strong> Pay inside your Falowen account after choosing a class under Upcoming Classes, or use the payment button on this page. If you have payment issues, contact info@falowen.app or use WhatsApp support on this page.`,
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
  const schedule = generateSchedule(course);
  const paymentLink = buildPaystackLink(course);
  const firstPayment = Math.min(course.tuitionGhs || 0, brochureData.payment.minimumInstallmentGhs);
  const balance = Math.max((course.tuitionGhs || 0) - firstPayment, 0);
  const shareUrl = getClassShareUrl(course);

  renderTabs(sourceList);
  updateMeta(course, shareUrl);
  hideClassInformationBox();
  ensurePaymentButtons();
  ensureClassLayout();
  renderAgreement(course, firstPayment, balance);

  document.getElementById("selectionNotice").innerHTML = courses.length
    ? `<span>Next available class:</span><br><strong>${courses[0].title} starts ${formatDate(courses[0].startDate)}</strong>`
    : "Available class options are shown below.";

  const blueTitle = document.getElementById("blueClassTitle");
  if (blueTitle) blueTitle.textContent = `${course.language} ${course.level}`;
  const blueMeta = document.getElementById("blueClassMeta");
  if (blueMeta) {
    blueMeta.innerHTML = [
      `📍 ${course.city}`,
      `📅 Starts ${formatDate(course.startDate)}`,
      course.endDate ? `🏁 Ends ${formatDate(course.endDate)}` : "",
    ].filter(Boolean).map((item) => `<span>${item}</span>`).join("");
  }

  document.getElementById("classPills").innerHTML = [
    `${course.language} ${course.level}`,
    course.city,
    course.availability === "always" ? "Always open" : `Starts ${formatDate(course.startDate)}`,
    course.endDate ? `Ends ${formatDate(course.endDate)}` : "",
  ].filter(Boolean).map((text) => `<span class="pill">${text}</span>`).join("");
  document.getElementById("classTitle").textContent = course.title;
  document.getElementById("classFormat").textContent = course.format;
  document.getElementById("stats").innerHTML = [
    ["Total fee", formatMoney(course.tuitionGhs)],
    ["First payment", formatMoney(firstPayment)],
    ["Balance after first payment", formatMoney(balance)],
  ].map(([label, value]) => `<div class="stat"><span>${label}</span><b>${value}</b></div>`).join("");
  document.getElementById("highlights").innerHTML = (course.highlights || []).map((item) => `<li>${item}</li>`).join("");
  document.getElementById("paymentSummary").textContent = `${course.title}: pay ${formatMoney(course.tuitionGhs)} in full or reserve your seat with ${formatMoney(firstPayment)}. Remaining balance: ${formatMoney(balance)} due one month after the first payment.`;
  document.getElementById("payLink").href = paymentLink;
  document.getElementById("payHero").href = paymentLink;
  const shareLink = document.getElementById("shareLink");
  if (shareLink) shareLink.href = shareUrl;
  document.getElementById("scheduleLink").href = course.scheduleUrl || shareUrl;
  document.getElementById("scheduleLink").style.display = course.scheduleUrl ? "inline-flex" : "none";
  document.getElementById("whatsappLink").href = `${brochureData.support.whatsapp}?text=${encodeURIComponent(`Hello, I want to enquire about ${course.title} starting ${formatDate(course.startDate)}.`)}`;

  document.getElementById("meetingRows").innerHTML = course.meetingDays?.length
    ? course.meetingDays.map((slot) => `<tr><td>${slot.day}</td><td>${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}</td><td>${course.location}</td></tr>`).join("")
    : `<tr><td colspan="3">Self-learning / no fixed live meeting days.</td></tr>`;

  const copy = `${course.title}\nFee: ${formatMoney(course.tuitionGhs)}\nFirst payment: ${formatMoney(firstPayment)}\nMeeting times: ${course.meetingDays?.length ? course.meetingDays.map((slot) => `${slot.day} ${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`).join(", ") : "Self-learning"}\nPayment link: ${paymentLink}`;
  const copyText = document.getElementById("copyText");
  if (copyText) copyText.textContent = copy;
  window.currentBrochureText = copy;

  document.getElementById("scheduleHint").textContent = schedule.length
    ? `${course.totalSessions} sessions generated from ${formatDate(course.startDate)}`
    : "This track is self-learning, so there is no fixed live class schedule.";
  document.getElementById("scheduleList").innerHTML = schedule.length
    ? schedule.map((item) => `<div class="session-row"><div class="session-num">#${item.number}</div><div><div class="session-title">${item.label}</div><div class="session-meta">${formatDate(item.date)} · ${item.day} · 🕒 ${formatTime(item.startTime)} – ${formatTime(item.endTime)}</div></div></div>`).join("")
    : `<div class="session-row"><div class="session-num">∞</div><div><div class="session-title">Self-learning</div><div class="session-meta">Start anytime after registration and payment confirmation.</div></div></div>`;
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

fetch("/classes/classes-data.json")
  .then((response) => response.json())
  .then((data) => {
    brochureData = data;
    render();
  })
  .catch((error) => {
    document.getElementById("classTitle").textContent = "Could not load class brochure";
    document.getElementById("classFormat").textContent = error.message || "Please try again later.";
  });
