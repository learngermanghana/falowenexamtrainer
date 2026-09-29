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
    const className = getCurrentClassName();
    if (!className) return "/signup/";
    const slug = slugify(className);
    return `/signup/?class=${encodeURIComponent(slug)}&className=${encodeURIComponent(className)}`;
  }

  function getFeeParts() {
    const rows = Array.from(document.querySelectorAll("#stats .stat"));
    return {
      full: rows[0]?.querySelector("b")?.textContent?.trim() || "GHS 2,800",
      first: (rows[1]?.querySelector("b")?.textContent || "GHS 2,000").replace(/\s*first payment/i, "").trim(),
      balance: (rows[2]?.querySelector("b")?.textContent || "GHS 800").replace(/\s*after 1 month/i, "").trim(),
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
      @media (max-width: 760px) {
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
        .class-main-card .class-body { grid-template-columns: 1.05fr .95fr; align-items: start; }
        #classTitle { grid-column: 1 / -1; }
        #stats { grid-column: 1; }
        #paymentGuidanceCard { grid-column: 2; grid-row: 2 / span 2; }
        #mainSignupCta, #classScheduleCta { grid-column: 1; }
        #classModeCard { grid-column: 1; }
        #afterSignupCard, #whoForCard { grid-column: 1 / -1; }
        .payment-option-grid { grid-template-columns: 1fr 1fr; }
        .page > .card, .page > .grid, .page > section { max-width: none; }
      }
      @media (max-width: 520px) {
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
      trust.innerHTML = "<span>Live class</span><span>Recordings</span><span>Falowen app</span>";
      text.insertAdjacentElement("afterend", trust);
      hero.dataset.heroTextReady = "true";
    }

    if (actions) {
      const scheduleHref = document.getElementById("scheduleLink")?.getAttribute("href") || "";
      actions.innerHTML = `
        <a id="heroRegisterCta" class="button primary" href="${getSignupUrl()}">Register for this class</a>
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
      cta.textContent = "Sign up and choose this class";
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
      <div class="stat"><span>Full course fee</span><b>${full}</b></div>
      <div class="stat"><span>Access with full payment</span><b>${policy.fullPaymentAccessMonths} months</b></div>
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
    if (!scheduleCta || document.getElementById("classModeCard")) return;

    const card = document.createElement("div");
    card.id = "classModeCard";
    card.className = "class-mode-card";
    const modes = getCoursePolicy().learningModes || ["In person", "Online", "Recorded lessons"];
    card.innerHTML = `<h3>Class mode</h3><p>This class is flexible: ${modes.join(", ")}. Choose the suitable mode for each session.</p>`;
    scheduleCta.insertAdjacentElement("afterend", card);
  }

  function addAfterSignupCard() {
    const anchor = document.getElementById("classModeCard") || document.getElementById("classScheduleCta") || document.getElementById("mainSignupCta");
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
        <li>Join in person, online, or use recorded lessons. Full payment keeps Falowen access for ${policy.fullPaymentAccessMonths} months.</li>
      </ol>
    `;
    anchor.insertAdjacentElement("afterend", card);
  }

  function simplifyClassInfo() {
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

  function simplifyScheduleCard() {
    const scheduleList = document.getElementById("scheduleList");
    const card = scheduleList?.closest(".card");
    const hiddenScheduleLink = document.getElementById("scheduleLink");
    if (!card || !hiddenScheduleLink || card.dataset.simpleSchedule === "true") return;

    const href = hiddenScheduleLink.getAttribute("href") || "#";
    card.classList.add("schedule-simple-card");
    card.innerHTML = `
      <h2>Class schedule</h2>
      <p>Open the full class schedule to see all lessons, dates, topics, start date, end date, and meeting times.</p>
      <a class="button class-schedule-cta" href="${href}" target="_blank" rel="noreferrer">Open class schedule</a>
    `;
    card.dataset.simpleSchedule = "true";
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

  function addStickyMobileCta() {
    const courseTitle =
      document.getElementById("classTitle")?.textContent?.trim()
      || document.getElementById("leadDecisionTitle")?.textContent?.trim()
      || "Falowen German class";
    if (!courseTitle || /loading|no class/i.test(courseTitle)) return;

    let bar = document.getElementById("brochureMobileCta");
    if (!bar) {
      bar = document.createElement("aside");
      bar.id = "brochureMobileCta";
      bar.className = "brochure-mobile-cta hide-print";
      bar.setAttribute("aria-label", "Class registration actions");
      document.body.appendChild(bar);
    }

    const signupHref = getSignupUrl();
    const whatsappHref =
      document.getElementById("whatsappLink")?.getAttribute("href")
      || "https://wa.me/233241113054?text=" + encodeURIComponent("Hello Falowen, I would like more information about your German classes.");
    bar.innerHTML = `
      <div class="brochure-mobile-cta-copy">
        <strong>${courseTitle}</strong>
        <span>Ready when the schedule works for you.</span>
      </div>
      <div class="brochure-mobile-cta-actions">
        <a class="button primary" href="${signupHref}">Register</a>
        <a class="button" href="${whatsappHref}" target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
    `;
    document.body.classList.add("has-mobile-brochure-cta");
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
    tagSections();
    simplifyClassInfo();
    improvePaymentMessaging();
    addMainSignupButton();
    addClassScheduleButton();
    addHybridModeCard();
    addAfterSignupCard();
    enhanceWhoFor();
    simplifyScheduleCard();
    tagSections();
    enhanceAgreement();
    applySignupLinks();
    addStickyMobileCta();
  }

  window.addEventListener("load", runEnhancements);
  window.addEventListener("falowen:brochure-rendered", runEnhancements);
  [100, 350, 800, 1500].forEach((delay) => setTimeout(runEnhancements, delay));
})();
