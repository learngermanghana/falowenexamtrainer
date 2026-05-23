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

  function injectLiteStyles() {
    if (document.getElementById("brochureLiteStyles")) return;
    const style = document.createElement("style");
    style.id = "brochureLiteStyles";
    style.textContent = `
      .page { max-width: 820px; }
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
      #stats { padding: 14px; gap: 10px; }
      .stat { align-items: flex-start; }
      .stat b { font-size: 16px; }
      .class-mode-card, .who-for-card, .after-signup-card { padding: 12px; gap: 6px; border: 1px solid #bfdbfe; background: #eff6ff; border-radius: 14px; display: grid; }
      .class-mode-card h3, .who-for-card h3, .after-signup-card h3 { font-size: 15px; margin: 0; }
      .class-mode-card p, .who-for-card p, .after-signup-card p { margin: 0; color: #334155; font-size: 14px; line-height: 1.55; }
      .after-signup-card ol { margin: 0; padding-left: 19px; color: #334155; font-size: 14px; line-height: 1.55; }
      .after-signup-card li { margin: 4px 0; }
      .main-signup-cta, .class-schedule-cta { width: 100%; font-size: 17px; min-height: 50px; }
      .class-schedule-cta { background: #ffffff; border-color: #bfdbfe; color: #1d4ed8; }
      th, td { padding: 10px 6px; font-size: 14px; }
      .meeting-card-title { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
      .schedule-simple-card { display: grid; gap: 10px; }
      .schedule-simple-card p { margin: 0; color: #334155; font-size: 14px; line-height: 1.55; }
      #scheduleList { display: none !important; }
      .session-row { display: none !important; }
      .schedule-preview-button { display: none !important; }
      .agreement-card { gap: 10px; }
      .agreement-card h2 { font-size: 20px; }
      .agreement-toggle { padding: 12px 14px; }
      .footer { display: none; }
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

    if (title) title.textContent = "Welcome to Falowen German Community";
    if (text && hero.dataset.heroTextReady !== "true") {
      text.textContent = "Join a supportive German learning community that has helped students in Ghana and beyond learn step by step with live classes, recordings, assignments, and app support.";
      const trust = document.createElement("div");
      trust.className = "hero-trust";
      trust.innerHTML = "<span>Live class</span><span>Recordings</span><span>App support</span>";
      text.insertAdjacentElement("afterend", trust);
      hero.dataset.heroTextReady = "true";
    }

    if (actions && actions.dataset.signupOnly !== "true") {
      actions.innerHTML = `<a class="button primary" href="${getSignupUrl()}">Sign up</a>`;
      actions.dataset.signupOnly = "true";
    }
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
    card.innerHTML = "<h3>Class mode</h3><p>This class is hybrid. You can join in person, join online, or follow the recorded lessons when needed.</p>";
    scheduleCta.insertAdjacentElement("afterend", card);
  }

  function addAfterSignupCard() {
    const anchor = document.getElementById("classModeCard") || document.getElementById("classScheduleCta") || document.getElementById("mainSignupCta");
    if (!anchor || document.getElementById("afterSignupCard")) return;
    const card = document.createElement("div");
    card.id = "afterSignupCard";
    card.className = "after-signup-card";
    card.innerHTML = `
      <h3>After signup</h3>
      <ol>
        <li>Create your Falowen account.</li>
        <li>Choose this class under Upcoming Classes.</li>
        <li>Make full payment or start with installment.</li>
        <li>Join in person, online, or use recordings.</li>
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

  function enhanceAgreement() {
    const card = document.getElementById("agreementCard");
    if (!card || card.dataset.collapsible === "true") return;

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
    simplifyClassInfo();
    addMainSignupButton();
    addClassScheduleButton();
    addHybridModeCard();
    addAfterSignupCard();
    enhanceWhoFor();
    simplifyScheduleCard();
    enhanceAgreement();
    applySignupLinks();
  }

  window.addEventListener("load", runEnhancements);
  [100, 350, 800, 1500].forEach((delay) => setTimeout(runEnhancements, delay));
})();
