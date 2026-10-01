(function () {
  const whoForByLevel = {
    A1: "Best for beginners starting German from zero or rebuilding their foundation.",
    A2: "Best for students who have finished A1 and want stronger everyday communication.",
    B1: "Best for students preparing for independent communication and exam-style practice.",
    B2: "Best for flexible higher-level learners who can study independently with support.",
    C1: "Best for advanced learners preparing for work, study, or professional communication.",
  };

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function getCurrentClassName() {
    const title = document.getElementById("classTitle")?.textContent || "";
    return title && !/loading|could not/i.test(title) ? title.trim() : "";
  }

  function getSignupUrl() {
    const course = window.currentBrochureCourse || {};
    const level = String(course.level || "").trim().toUpperCase();
    if (course.availability === "enquiry" && /^(A1|A2|B1)$/.test(level)) {
      return `/signup/?level=${encodeURIComponent(level)}&enquiry=1`;
    }

    const className = getCurrentClassName();
    if (!className) return level ? `/signup/?level=${encodeURIComponent(level)}` : "/signup/";
    const slug = course.slug || slugify(className);
    const params = new URLSearchParams({
      class: slug,
      className,
    });
    if (level) params.set("level", level);
    return `/signup/?${params.toString()}`;
  }

  function getFeeParts() {
    const course = window.currentBrochureCourse || {};
    const fullAmount = Number(course.tuitionGhs || 0);
    const minimumInstallment = Number(window.FalowenClassBrochureData?.payment?.minimumInstallmentGhs || 2000);
    if (fullAmount > 0) {
      const firstAmount = Math.min(fullAmount, minimumInstallment);
      const balanceAmount = Math.max(fullAmount - firstAmount, 0);
      const money = (amount) => `GHS ${Number(amount || 0).toLocaleString("en-GH")}`;
      return {
        full: money(fullAmount),
        first: money(firstAmount),
        balance: money(balanceAmount),
      };
    }

    const rows = Array.from(document.querySelectorAll("#stats .stat"));
    const paymentText = document.getElementById("paymentSummary")?.textContent || "";
    const amounts = paymentText.match(/GHS\s*[\d,]+/g) || [];
    return {
      full: rows[0]?.querySelector("b")?.textContent?.trim() || amounts[0] || "GHS 3,000",
      first: amounts[1] || "GHS 2,000",
      balance: amounts[2] || "GHS 1,000",
    };
  }

  function getCoursePolicy() {
    return {
      courseDurationWeeks: 10,
      fullPaymentAccessMonths: 6,
      installmentAccessMonths: 1,
      extensionGhsPerMonth: 1000,
      learningModes: ["In person", "Online", "Recorded lessons"],
      ...(window.FalowenClassBrochureData?.coursePolicy || {}),
    };
  }

  function getAcademyProfile() {
    return {
      academyName: "Learn Language Education Academy",
      formerName: "Learn German Ghana",
      establishedYear: 2022,
      germanLevels: "A1–C2",
      examPassHeadline: "High exam pass rate",
      examPassDescription: "Our students have maintained a high pass rate in German language examinations.",
      overview: "Learn Language Education Academy has supported German learners since 2022 with structured teaching, assignments and exam preparation.",
      locationLabel: "Awoshie, Accra, Ghana",
      mapsUrl: "https://maps.app.goo.gl/CPYX7uCj9YSELc1Q9",
      classroomImage: "/classes/llea-classroom.jpg",
      links: {
        blog: "https://blog.falowen.app",
        linkedin: "https://www.linkedin.com/in/learngermanghana/",
        youtube: "https://www.youtube.com/@LLEAGhana",
        contractAgreement: "https://legal.falowen.app/",
      },
      ...(window.FalowenClassBrochureData?.academyProfile || {}),
    };
  }

  function getVisitorGuideUrl() {
    const course = window.currentBrochureCourse || {};
    const classSlug = course.slug || slugify(getCurrentClassName());
    const params = new URLSearchParams();
    if (classSlug) params.set("class", classSlug);
    params.set("source", "class-brochure");
    return `/visitor-guide?${params.toString()}`;
  }

  function formatDecisionDate(value) {
    if (!value) return "To be confirmed";
    const parsed = new Date(`${String(value).slice(0, 10)}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "To be confirmed";
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(parsed);
  }

  function meetingSummary(course = {}) {
    if (course.availability === "always") return "Self-learning · start anytime";
    const rows = Array.isArray(course.meetingDays) ? course.meetingDays : [];
    if (!rows.length) return "Schedule to be confirmed";
    return rows
      .map((slot) => `${slot.day || ""} ${slot.startTime || ""}${slot.endTime ? `–${slot.endTime}` : ""}`.trim())
      .filter(Boolean)
      .join(" · ");
  }

  function decisionModeCopy(course = {}) {
    if (course.availability === "always") {
      return "Study independently in Falowen on your own schedule, with available tutor support.";
    }
    return "Attend in person in Awoshie, join the live class online, or use recorded lessons when you cannot attend live.";
  }

  function addDecisionSummary() {
    const classHeaderCard = document.querySelector(".class-main-card") || document.getElementById("class-summary");
    if (!classHeaderCard) return;
    let card = document.getElementById("classDecisionSummary");
    if (!card) {
      card = document.createElement("section");
      card.id = "classDecisionSummary";
      card.className = "card class-decision-summary";
    }
    if (classHeaderCard.nextElementSibling !== card) {
      classHeaderCard.insertAdjacentElement("afterend", card);
    }

    const course = window.currentBrochureCourse || {};
    const profile = getAcademyProfile();
    const level = getLevelFromPage();
    const className = getCurrentClassName() || `${level} German class`;
    const { full } = getFeeParts();
    const start = course.availability === "always" ? "Start anytime" : formatDecisionDate(course.startDate);
    const schedule = meetingSummary(course);
    const scheduleHref = document.getElementById("scheduleLink")?.getAttribute("href") || "#class-schedule-section";
    const isSelfLearning = course.availability === "always";
    const mapAction = !isSelfLearning && profile.mapsUrl
      ? `<a class="decision-secondary-action" href="${profile.mapsUrl}" target="_blank" rel="noreferrer">Open Google Maps</a>`
      : "";

    card.innerHTML = `
      <div class="decision-summary-heading">
        <span>Class at a glance</span>
        <strong>${className}</strong>
      </div>
      <div class="decision-summary-grid">
        <div><span>Course fee</span><strong>${full}</strong></div>
        <div><span>Start date</span><strong>${start}</strong></div>
        <div class="decision-summary-wide"><span>Meeting times</span><strong>${schedule}</strong></div>
        <div class="decision-summary-wide"><span>Learning mode</span><strong>${decisionModeCopy(course)}</strong></div>
      </div>
      <div class="decision-summary-actions">
        <a id="mainSignupCta" class="button primary main-signup-cta" href="${getSignupUrl()}">Register for this class</a>
        <a id="decisionScheduleCta" class="button class-schedule-cta" href="${scheduleHref}" ${scheduleHref.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>View schedule</a>
        ${mapAction}
      </div>
    `;
  }

  function addCourseBenefits() {
    const decisionSummary = document.getElementById("classDecisionSummary");
    const classSummary = document.querySelector(".class-main-card") || document.getElementById("class-summary");
    const anchor = decisionSummary || classSummary;
    if (!anchor) return;
    let card = document.getElementById("courseBenefitsCard");
    if (!card) {
      card = document.createElement("section");
      card.id = "courseBenefitsCard";
      card.className = "card course-benefits-card";
    }
    if (anchor.nextElementSibling !== card) {
      anchor.insertAdjacentElement("afterend", card);
    }
    card.innerHTML = `
      <div>
        <span class="course-benefits-eyebrow">What students receive</span>
        <h2>One structured learning system</h2>
        <p>Class teaching and Falowen work together, so students know what to learn, practise and improve next.</p>
      </div>
      <div class="course-benefits-grid">
        <article><strong>Advanced teaching slides</strong><span>Clear teacher-led explanations and examples for each lesson.</span></article>
        <article><strong>Recorded teacher explanations</strong><span>Review key lessons again when you need more time.</span></article>
        <article><strong>Course book & workbooks</strong><span>Grammar, vocabulary, reading, listening, writing and speaking practice.</span></article>
        <article><strong>Tutor-marked assignments</strong><span>Receive scores and feedback on selected course work.</span></article>
        <article><strong>Progress tracking</strong><span>Attendance, results and learning progress stay visible in one place.</span></article>
        <article><strong>Exam preparation</strong><span>Practise the skills and task types used in German-language examinations.</span></article>
      </div>
    `;
  }

  function groupSecondaryCourseDetails() {
    const benefits = document.getElementById("courseBenefitsCard");
    const classSummary = document.querySelector(".class-main-card") || document.getElementById("class-summary");
    const anchor = benefits || classSummary;
    if (!anchor) return;

    let details = document.getElementById("courseDetailsDisclosure");
    if (!details) {
      details = document.createElement("details");
      details.id = "courseDetailsDisclosure";
      details.className = "card course-details-disclosure";
      details.innerHTML = `
        <summary>More course & payment details</summary>
        <div class="course-details-content"></div>
      `;
      anchor.insertAdjacentElement("afterend", details);
    }

    if (details.dataset.responsiveInitialised !== "true") {
      details.open = window.matchMedia("(min-width: 761px)").matches;
      details.dataset.responsiveInitialised = "true";
    }
    const content = details.querySelector(".course-details-content");
    ["paymentGuidanceCard", "afterSignupCard", "whoForCard"].forEach((id) => {
      const node = document.getElementById(id);
      if (node && node.parentElement !== content) content.appendChild(node);
    });
  }

  function injectLiteStyles() {
    if (document.getElementById("brochureLiteStyles")) return;
    const style = document.createElement("style");
    style.id = "brochureLiteStyles";
    style.textContent = `
      .page { max-width: 1040px; }
      .hero { gap: 8px; padding: 14px 16px; }
      .hero h1 { font-size: clamp(24px, 7vw, 34px); letter-spacing: -0.035em; }
      .hero p { font-size: 14px; line-height: 1.55; }
      .hero-trust { gap: 6px; }
      .hero-trust span { padding: 6px 9px; font-size: 12px; }
      .card { box-shadow: none; }
      .class-blue-header { padding: 20px; }
      .class-blue-title { font-size: clamp(30px, 8vw, 38px); margin-bottom: 10px; }
      .class-body { padding: 18px; gap: 14px; }
      #classFormat, #classPills, #highlights, #payment { display: none !important; }
      .brochure-detail-clean .class-main-card .class-body { display: none !important; }
      .brochure-detail-clean .class-main-card { overflow: hidden; }
      .meeting-schedule-actions { margin-top: 12px; display: grid; gap: 8px; }
      .meeting-schedule-actions p { margin: 0; color: #475569; font-size: 13px; line-height: 1.5; }
      .meeting-schedule-actions .button { width: 100%; }

      .class-tabs { padding-bottom: 4px; }
      .class-tab { padding: 8px 11px; font-size: 13px; }
      .notice { font-size: 14px; }
      .toc-card { margin-top: 12px; display: grid; gap: 10px; }
      .toc-card h2 { font-size: 17px; margin: 0; }
      .toc-links { display: grid; gap: 8px; }
      .toc-links a { display: block; border: 1px solid #bfdbfe; background: #ffffff; color: #1d4ed8; border-radius: 12px; padding: 11px 12px; font-size: 14px; font-weight: 800; text-decoration: none; }
      #stats { padding: 14px; gap: 10px; }
      .stat { align-items: flex-start; }
      .stat b { font-size: 16px; }
      .payment-guidance-card, .class-mode-card, .who-for-card, .after-signup-card { padding: 12px; gap: 6px; border: 1px solid #bfdbfe; background: #eff6ff; border-radius: 14px; display: grid; }
      .payment-guidance-card { background: #f8fafc; border-color: #e2e8f0; }
      .payment-guidance-card h3, .class-mode-card h3, .who-for-card h3, .after-signup-card h3 { font-size: 15px; margin: 0; }
      .payment-guidance-card p, .class-mode-card p, .who-for-card p, .after-signup-card p { margin: 0; color: #334155; font-size: 14px; line-height: 1.55; }
      .payment-option-grid { display: grid; gap: 10px; }
      .payment-option { padding: 12px; border-radius: 12px; background: #ffffff; border: 1px solid #e2e8f0; }
      .payment-option.recommended { border-color: #1455f5; background: #eff6ff; }
      .payment-option strong { display: block; color: #111827; margin-bottom: 4px; }
      .after-signup-card ol { margin: 0; padding-left: 19px; color: #334155; font-size: 14px; line-height: 1.55; }
      .after-signup-card li { margin: 4px 0; }
      .main-signup-cta, .class-schedule-cta { width: 100%; font-size: 17px; min-height: 50px; }
      .class-schedule-cta { background: #ffffff; border-color: #bfdbfe; color: #1d4ed8; }
      th, td { padding: 10px 6px; font-size: 14px; }
      .meeting-card-title { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
      .schedule-simple-card { display: grid; gap: 10px; }
      .schedule-simple-card p { margin: 0; color: #334155; font-size: 14px; line-height: 1.55; }
      #scheduleList { display: none !important; }
      .hero-placement-action { display: inline-flex; align-items: center; color: #1d4ed8; font-size: 13px; font-weight: 850; text-decoration: none; padding: 8px 2px; }
      .brochure-mobile-cta { display: none; }
      .catalog-status-notice { border-color: #fde68a; background: #fffbeb; color: #78350f; gap: 8px; }
      .catalog-status-notice p { margin: 0; color: #92400e; }
      .academy-track-record-card { display: grid; gap: 10px; border-color: #e2e8f0; background: #ffffff; }
      .academy-school-reference { grid-template-columns: minmax(0, 1fr) auto; align-items: center; }
      .academy-school-reference > div:first-child { display: grid; gap: 4px; }
      .academy-school-reference-label { color: #1d4ed8; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; }
      .academy-school-reference strong { color: #0f172a; font-size: 16px; }
      .academy-school-reference p { margin: 0; color: #475569; font-size: 13px; line-height: 1.5; }
      .academy-school-reference-action { border-radius: 10px; background: #eff6ff; color: #1d4ed8; padding: 9px 11px; font-size: 12px; font-weight: 900; text-decoration: none; white-space: nowrap; }
      .academy-trust-links { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 8px 12px; }
      .academy-trust-links a { color: #1d4ed8; font-size: 12px; font-weight: 850; text-decoration: none; }
      .academy-trust-links a:hover { text-decoration: underline; }
      .class-decision-summary { display: grid; gap: 14px; border: 1px solid #bfdbfe; background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%); }
      .decision-summary-heading { display: grid; gap: 3px; }
      .decision-summary-heading > span, .course-benefits-eyebrow { color: #1d4ed8; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; }
      .decision-summary-heading > strong { color: #0f172a; font-size: clamp(21px, 5vw, 28px); line-height: 1.2; }
      .decision-summary-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
      .decision-summary-grid > div { border: 1px solid #dbeafe; background: #ffffff; border-radius: 12px; padding: 11px; display: grid; gap: 4px; }
      .decision-summary-grid span { color: #64748b; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .04em; }
      .decision-summary-grid strong { color: #0f172a; font-size: 14px; line-height: 1.45; }
      .decision-summary-wide { grid-column: 1 / -1; }
      .decision-summary-actions { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, .65fr); gap: 8px; align-items: center; }
      .decision-summary-actions .main-signup-cta, .decision-summary-actions .class-schedule-cta { width: 100%; }
      .decision-secondary-action { grid-column: 1 / -1; width: fit-content; color: #1d4ed8; font-size: 13px; font-weight: 850; text-decoration: none; }
      .course-benefits-card { display: grid; gap: 14px; }
      .course-benefits-card h2 { margin: 4px 0 0; font-size: 22px; }
      .course-benefits-card > div:first-child > p { margin: 6px 0 0; color: #475569; line-height: 1.55; font-size: 14px; }
      .course-benefits-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; }
      .course-benefits-grid article { border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 12px; padding: 11px; display: grid; gap: 5px; }
      .course-benefits-grid strong { font-size: 13px; color: #0f172a; }
      .course-benefits-grid span { font-size: 12px; line-height: 1.45; color: #475569; }
      .course-details-disclosure { padding: 0; overflow: hidden; }
      .course-details-disclosure > summary { cursor: pointer; padding: 15px 16px; font-weight: 900; color: #0f172a; list-style-position: inside; }
      .course-details-content { border-top: 1px solid #e2e8f0; padding: 14px; display: grid; gap: 10px; }

      @media (max-width: 620px) {
        .academy-school-reference { grid-template-columns: 1fr; }
        .academy-school-reference-action { width: fit-content; }
      }
      @media (max-width: 760px) {
        .intro-video, #brochureToc { display: none !important; }
        .class-decision-summary { margin-top: 10px; }
        .decision-summary-actions { grid-template-columns: 1fr; }
        .decision-secondary-action { justify-self: start; }
        .course-benefits-grid { grid-template-columns: 1fr 1fr; }
        .course-details-disclosure:not([open]) .course-details-content { display: none; }
        body.has-mobile-brochure-cta { padding-bottom: 86px; }
        .brochure-mobile-cta {
          position: fixed;
          left: 8px;
          right: 8px;
          bottom: max(8px, env(safe-area-inset-bottom));
          z-index: 80;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 8px;
          align-items: center;
          border: 1px solid #cbd5e1;
          border-radius: 16px;
          background: rgba(255,255,255,.97);
          box-shadow: 0 14px 36px rgba(15,23,42,.18);
          padding: 9px;
          backdrop-filter: blur(10px);
        }
        .brochure-mobile-cta-copy { min-width: 0; display: grid; gap: 2px; }
        .brochure-mobile-cta-copy strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; color: #0f172a; }
        .brochure-mobile-cta-copy span { font-size: 11px; color: #64748b; }
        .brochure-mobile-cta-actions { display: flex; gap: 6px; }
        .brochure-mobile-cta .button { width: auto; min-height: 42px; padding: 9px 11px; border-radius: 11px; font-size: 12px; }
      }
      .session-row { display: none !important; }
      .schedule-preview-button { display: none !important; }
      .agreement-card { gap: 10px; }
      .agreement-card h2 { font-size: 20px; }
      .agreement-toggle { padding: 12px 14px; }
      .footer { display: none; }
      @media (min-width: 900px) {
        .class-main-card .class-body { grid-template-columns: 1fr; align-items: start; }
        #classTitle, #stats { grid-column: 1 / -1; }
        .payment-option-grid { grid-template-columns: 1fr 1fr; }
        .page > .card, .page > .grid, .page > section { max-width: none; }
      }
      @media (max-width: 520px) {
        .decision-summary-grid, .course-benefits-grid { grid-template-columns: 1fr; }
        .decision-summary-wide { grid-column: auto; }
        .page { padding: 8px 8px 28px; }
        .hero { padding: 14px; }
        .card { padding: 14px; }
        .class-blue-header { padding: 18px; }
        .class-body { padding: 16px; }
      }
    `;
    document.head.appendChild(style);
  }

  function getLevelFromPage() {
    const blueTitle = document.getElementById("blueClassTitle")?.textContent || "";
    const title = document.getElementById("classTitle")?.textContent || "";
    const match = `${blueTitle} ${title}`.match(/\b(A1|A2|B1|B2|C1|C2)\b/i);
    return match ? match[1].toUpperCase() : "A1";
  }

  function applySignupLinks() {
    const href = getSignupUrl();
    document.querySelectorAll("a[href^='/signup']").forEach((link) => {
      link.href = href;
    });
  }

  function enhanceHero() {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const title = hero.querySelector("h1");
    const text = hero.querySelector("p");
    const actions = hero.querySelector(".hero-actions");

    if (title) title.textContent = "Choose your German class";
    if (text && hero.dataset.heroTextReady !== "true") {
      text.textContent = "Check the fee, start date, meeting times and learning mode first. Register when the class fits your schedule.";
      const trust = document.createElement("div");
      trust.className = "hero-trust";
      const isSelfLearning = window.currentBrochureCourse?.availability === "always";
      trust.innerHTML = isSelfLearning
        ? "<span>Self-learning</span><span>Flexible study</span><span>Falowen app</span>"
        : "<span>Live class</span><span>Recordings</span><span>Falowen app</span>";
      text.insertAdjacentElement("afterend", trust);
      hero.dataset.heroTextReady = "true";
    }

    if (actions) {
      const scheduleHref = document.getElementById("scheduleLink")?.getAttribute("href") || "";
      actions.innerHTML = `
        <a id="heroScheduleCta" class="button" href="${scheduleHref || "#class-schedule-section"}" ${scheduleHref ? 'target="_blank" rel="noreferrer"' : ""}>View full schedule</a>
        <a class="hero-placement-action" href="/placement-test">Not sure of your level? Take the free placement test.</a>
      `;
      actions.dataset.signupOnly = "true";
    }
  }

  function addTableOfContents() {
    const hero = document.querySelector(".hero");
    if (!hero || document.getElementById("brochureToc")) return;
    const toc = document.createElement("section");
    toc.id = "brochureToc";
    toc.className = "card toc-card";
    toc.innerHTML = `
      <h2>On this page</h2>
      <div class="toc-links">
        <a href="#class-summary">Class & fees</a>
        <a href="#meeting-times-section">Meeting times</a>
        <a href="#class-schedule-section">Class schedule</a>
        <a href="#payment-agreement-section">Payment agreement</a>
      </div>
    `;
    hero.insertAdjacentElement("afterend", toc);
  }

  function tagSections() {
    const mainCard = document.querySelector(".class-main-card");
    if (mainCard) mainCard.id = "class-summary";
    const meetingRows = document.getElementById("meetingRows");
    const meetingCard = meetingRows?.closest(".card");
    if (meetingCard) meetingCard.id = "meeting-times-section";
    const scheduleList = document.getElementById("scheduleList");
    const scheduleCard = scheduleList?.closest(".card") || document.querySelector(".schedule-simple-card");
    if (scheduleCard) scheduleCard.id = "class-schedule-section";
    const agreement = document.getElementById("agreementCard");
    if (agreement) agreement.id = "payment-agreement-section";
  }

  function addMainSignupButton() {
    const stats = document.getElementById("stats");
    if (!stats) return;
    let cta = document.getElementById("mainSignupCta");
    if (!cta) {
      cta = document.createElement("a");
      cta.id = "mainSignupCta";
      cta.className = "button primary main-signup-cta";
      cta.textContent = "Register for this class";
      stats.insertAdjacentElement("afterend", cta);
    }
    cta.href = getSignupUrl();
  }

  function improvePaymentMessaging() {
    const stats = document.getElementById("stats");
    if (!stats) return;
    const { full, first, balance } = getFeeParts();
    const policy = getCoursePolicy();
    stats.innerHTML = `
      <div class="stat"><span>Falowen access with full payment</span><b>${policy.fullPaymentAccessMonths} months</b></div>
      <div class="stat"><span>Installment starter</span><b>${first}</b></div>
    `;

    let card = document.getElementById("paymentGuidanceCard");
    if (!card) {
      card = document.createElement("div");
      card.id = "paymentGuidanceCard";
      card.className = "payment-guidance-card";
      stats.insertAdjacentElement("afterend", card);
    }
    card.innerHTML = `
      <h3>Payment options</h3>
      <div class="payment-option-grid">
        <div class="payment-option recommended">
          <strong>Pay full ${full}</strong>
          <p>Full payment gives ${policy.fullPaymentAccessMonths} months of Falowen access, including revision time after the live class ends.</p>
        </div>
        <div class="payment-option">
          <strong>Installment: Start with ${first}</strong>
          <p>The starter payment gives ${policy.installmentAccessMonths} month of access. The remaining balance of ${balance} is due after one month.</p>
        </div>
      </div>
    `;
  }

  function addClassScheduleButton() {
    const signup = document.getElementById("mainSignupCta");
    const hiddenScheduleLink = document.getElementById("scheduleLink");
    if (!signup || !hiddenScheduleLink) return;

    const href = hiddenScheduleLink.getAttribute("href");
    if (!href || href === "#") return;

    const decisionCta = document.getElementById("decisionScheduleCta");
    if (decisionCta) {
      decisionCta.href = href;
      decisionCta.target = "_blank";
      decisionCta.rel = "noreferrer";
      document.getElementById("classScheduleCta")?.remove();
      return;
    }

    let cta = document.getElementById("classScheduleCta");
    if (!cta) {
      cta = document.createElement("a");
      cta.id = "classScheduleCta";
      cta.className = "button class-schedule-cta";
      cta.target = "_blank";
      cta.rel = "noreferrer";
      cta.textContent = "Open class schedule";
      signup.insertAdjacentElement("afterend", cta);
    }
    cta.href = href;
  }

  function addHybridModeCard() {
    const scheduleCta = document.getElementById("classScheduleCta") || document.getElementById("mainSignupCta");
    if (!scheduleCta) return;

    let card = document.getElementById("classModeCard");
    if (!card) {
      card = document.createElement("div");
      card.id = "classModeCard";
      card.className = "class-mode-card";
      scheduleCta.insertAdjacentElement("afterend", card);
    }

    if (document.getElementById("classDecisionSummary")) {
      card.remove();
      return;
    }

    const isSelfLearning = window.currentBrochureCourse?.availability === "always";
    card.innerHTML = isSelfLearning
      ? "<h3>Learning mode</h3><p>Self-learning: study independently in Falowen with flexible practice and available tutor support.</p>"
      : "<h3>Class mode</h3><p>Attend in person in Awoshie, join the live class online, or use recorded lessons when you cannot attend live.</p>";
  }

  function addTrackRecordCard() {
    const profile = getAcademyProfile();
    let card = document.getElementById("academyTrackRecordCard");
    if (!card) {
      card = document.createElement("section");
      card.id = "academyTrackRecordCard";
      card.className = "card academy-track-record-card academy-school-reference";
    }

    card.innerHTML = `
      <div>
        <span class="academy-school-reference-label">About LLEA</span>
        <strong>Want to know more about the school?</strong>
        <p>See the classroom, meet the team and learn how LLEA and Falowen work together.</p>
      </div>
      <a class="academy-school-reference-action" href="${getVisitorGuideUrl()}">About the school & team</a>
      <div class="academy-trust-links">
        ${profile.links?.blog ? `<a href="${profile.links.blog}" target="_blank" rel="noreferrer">Blog</a>` : ""}
        ${profile.links?.youtube ? `<a href="${profile.links.youtube}" target="_blank" rel="noreferrer">YouTube</a>` : ""}
        ${profile.links?.linkedin ? `<a href="${profile.links.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>` : ""}
        ${profile.links?.contractAgreement ? `<a href="${profile.links.contractAgreement}" target="_blank" rel="noreferrer">Legal / Contract</a>` : ""}
      </div>
    `;

    const leadCard = document.getElementById("leadCaptureCard");
    if (leadCard) {
      card.remove();
      return;
    }

    const page = document.querySelector(".page");
    if (!page) return;
    if (!card.isConnected) page.appendChild(card);
  }

  function addAfterSignupCard() {
    const anchor = document.getElementById("paymentGuidanceCard") || document.getElementById("stats");
    if (!anchor || document.getElementById("afterSignupCard")) return;
    const policy = getCoursePolicy();
    const card = document.createElement("div");
    card.id = "afterSignupCard";
    card.className = "after-signup-card";
    card.innerHTML = `
      <h3>What happens after you register?</h3>
      <ol>
        <li>Create or sign in to your Falowen account.</li>
        <li>Choose this class and complete your payment.</li>
        <li>Your class and learning materials appear in Campus after access is activated.</li>
        <li>Falowen sends class and learning reminders as your course progresses.</li>
        <li>Join in person in Awoshie, attend the live class online, or use recorded lessons when you cannot attend live. Full payment keeps Falowen access for ${policy.fullPaymentAccessMonths} months.</li>
      </ol>
    `;
    anchor.insertAdjacentElement("afterend", card);
  }

  function simplifyClassInfo() {
    const classMainCard = document.querySelector(".class-main-card");
    if (classMainCard && !document.getElementById("leadCaptureCard")) {
      document.body.classList.add("brochure-detail-clean");
    }
    const highlights = document.getElementById("highlights")?.closest(".stack");
    if (highlights) highlights.style.display = "none";
    const payment = document.getElementById("payment");
    if (payment) payment.style.display = "none";
  }

  function enhanceWhoFor() {
    const anchor = document.getElementById("afterSignupCard") || document.getElementById("classModeCard") || document.getElementById("mainSignupCta");
    if (!anchor) return;

    let card = document.getElementById("whoForCard");
    const level = getLevelFromPage();
    const text = whoForByLevel[level] || whoForByLevel.A1;

    if (!card) {
      card = document.createElement("div");
      card.id = "whoForCard";
      card.className = "who-for-card";
      anchor.insertAdjacentElement("afterend", card);
    }

    card.innerHTML = `<h3>Who this class is for</h3><p>${text}</p>`;
  }

  function mergeMeetingAndSchedule() {
    const meetingRows = document.getElementById("meetingRows");
    const meetingCard = meetingRows?.closest(".card");
    const hiddenScheduleLink = document.getElementById("scheduleLink");
    if (!meetingCard) return;

    meetingCard.id = "meeting-times-section";
    const heading = meetingCard.querySelector("h2");
    if (heading) heading.textContent = "Meeting times & class schedule";

    let actions = meetingCard.querySelector(".meeting-schedule-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "meeting-schedule-actions";
      meetingCard.appendChild(actions);
    }

    const href = hiddenScheduleLink?.getAttribute("href") || "#";
    actions.innerHTML = `
      <p>These are the weekly meeting times. Open the full schedule for lesson dates, topics, holidays, start date and end date.</p>
      <a class="button class-schedule-cta" href="${href}" ${href !== "#" ? 'target="_blank" rel="noreferrer"' : ""}>Open full class schedule</a>
    `;

    const scheduleList = document.getElementById("scheduleList");
    const scheduleCard = scheduleList?.closest(".card") || document.getElementById("class-schedule-section");
    if (scheduleCard && scheduleCard !== meetingCard) {
      const wrapper = scheduleCard.parentElement;
      scheduleCard.remove();
      if (wrapper?.classList?.contains("grid") && !wrapper.querySelector(".card")) wrapper.remove();
    }
  }

  function enforceBrochureOrder() {
    const page = document.querySelector(".page");
    const classHeader = document.querySelector(".class-main-card") || document.getElementById("class-summary");
    if (!page || !classHeader || !document.body.classList.contains("brochure-detail-clean")) return;

    const decision = document.getElementById("classDecisionSummary");
    const benefits = document.getElementById("courseBenefitsCard");
    const meeting = document.getElementById("meeting-times-section");
    const details = document.getElementById("courseDetailsDisclosure");
    const agreement = document.getElementById("payment-agreement-section");
    const reviews = document.getElementById("studentReviewsCard");
    const academy = document.getElementById("academyTrackRecordCard");
    const faq = document.getElementById("faq-section");
    const footer = document.getElementById("classBrochureFooter");

    const ordered = [decision, benefits, meeting, details, agreement, reviews, academy, faq, footer].filter(Boolean);
    let anchor = classHeader;
    ordered.forEach((node) => {
      if (anchor.nextElementSibling !== node) anchor.insertAdjacentElement("afterend", node);
      anchor = node;
    });

    document.getElementById("classLocationCard")?.remove();
  }

  function updateAgreementTerms() {
    const list = document.getElementById("agreementList");
    if (!list || list.dataset.paymentUpdated === "true") return;
    const { full, first, balance } = getFeeParts();
    const policy = getCoursePolicy();
    const items = Array.from(list.querySelectorAll("li"));
    if (items[0]) {
      items[0].innerHTML = `<strong>Payment Amount:</strong> The full course fee is ${full}. Full payment gives ${policy.fullPaymentAccessMonths} months of Falowen access.`;
    }
    if (items[1]) {
      items[1].innerHTML = `<strong>Payment Schedule:</strong> The student may pay the full fee of ${full}, or start with ${first}. The starter payment gives ${policy.installmentAccessMonths} month of access. The remaining balance of ${balance} is due after one month; otherwise access may be revoked.`;
    }
    if (items[2]) {
      items[2].innerHTML = `<strong>Learning Mode & Attendance Rights:</strong> Available learning modes are ${(policy.learningModes || []).join(", ")}. The student may choose the suitable mode for each scheduled session.`;
    }
    if (items[3]) {
      items[3].innerHTML = `<strong>Class Duration & Contract Term:</strong> The taught course is approximately ${policy.courseDurationWeeks} weeks. Full payment gives a ${policy.fullPaymentAccessMonths}-month Falowen access period from enrollment, including revision time after scheduled classes end.`;
    }
    if (items[4]) {
      items[4].innerHTML = `<strong>Post-Contract Access:</strong> After ${policy.fullPaymentAccessMonths} months, continued access can be extended at GHS ${Number(policy.extensionGhsPerMonth || 0).toLocaleString("en-GH")} per month or by enrolling in a new class at the current fee.`;
    }
    if (items[8] && policy.refundPolicy) {
      items[8].innerHTML = `<strong>Refunds:</strong> ${policy.refundPolicy}`;
    }
    list.dataset.paymentUpdated = "true";
  }

  function removeStickyMobileRegisterBar() {
    document.getElementById("brochureMobileCta")?.remove();
    document.body.classList.remove("has-mobile-brochure-cta");
  }

  function enhanceAgreement() {
    const card = document.getElementById("agreementCard");
    if (!card) return;
    updateAgreementTerms();
    if (card.dataset.collapsible === "true") return;

    const intro = document.getElementById("agreementIntro");
    const list = document.getElementById("agreementList");
    if (!intro || !list) return;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "agreement-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Read Payment Agreement";

    const content = document.createElement("div");
    content.className = "agreement-content";
    content.hidden = true;

    intro.insertAdjacentElement("beforebegin", toggle);
    content.appendChild(intro);
    content.appendChild(list);
    toggle.insertAdjacentElement("afterend", content);

    toggle.addEventListener("click", () => {
      const isOpen = !content.hidden;
      content.hidden = isOpen;
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.textContent = isOpen ? "Read Payment Agreement" : "Hide Payment Agreement";
    });

    card.dataset.collapsible = "true";
  }

  function runEnhancements() {
    injectLiteStyles();
    enhanceHero();
    addTableOfContents();
    addDecisionSummary();
    tagSections();
    simplifyClassInfo();
    improvePaymentMessaging();
    addMainSignupButton();
    addClassScheduleButton();
    addHybridModeCard();
    addAfterSignupCard();
    enhanceWhoFor();
    addCourseBenefits();
    groupSecondaryCourseDetails();
    addTrackRecordCard();
    mergeMeetingAndSchedule();
    tagSections();
    enhanceAgreement();
    applySignupLinks();
    removeStickyMobileRegisterBar();
    enforceBrochureOrder();
  }

  window.addEventListener("load", runEnhancements);
  window.addEventListener("falowen:brochure-rendered", runEnhancements);
  [100, 350, 800, 1500, 2400, 4200].forEach((delay) => setTimeout(runEnhancements, delay));
})();
