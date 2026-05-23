(function () {
  const whoForByLevel = {
    A1: [
      "You are starting German from zero or need a fresh foundation.",
      "You want live guidance, assignments, and a clear beginner structure.",
      "You want to prepare toward Goethe A1 readiness step by step.",
    ],
    A2: [
      "You have already completed A1 or know basic German.",
      "You want to improve everyday speaking, writing, reading, and listening.",
      "You want a structured path toward Goethe A2 readiness.",
    ],
    B1: [
      "You can already communicate at basic level and want stronger independence.",
      "You want exam-style speaking, writing, reading, and listening practice.",
      "You want a guided path toward B1 certificate readiness.",
    ],
    B2: [
      "You want a flexible higher-level German learning path.",
      "You can study independently with AI and tutor support when needed.",
      "You want to build stronger academic, career, and exam communication.",
    ],
    C1: [
      "You want advanced German for work, study, or professional communication.",
      "You are ready for independent learning with structured support.",
      "You want to improve advanced writing, speaking, reading, and argumentation.",
    ],
  };

  function getLevelFromPage() {
    const blueTitle = document.getElementById("blueClassTitle")?.textContent || "";
    const title = document.getElementById("classTitle")?.textContent || "";
    const match = `${blueTitle} ${title}`.match(/\b(A1|A2|B1|B2|C1|C2)\b/i);
    return match ? match[1].toUpperCase() : "A1";
  }

  function enhanceHero() {
    const hero = document.querySelector(".hero");
    if (!hero || hero.dataset.enhanced === "true") return;
    const title = hero.querySelector("h1");
    const text = hero.querySelector("p");
    if (title) title.textContent = "Welcome to Falowen German Community";
    if (text) {
      text.textContent =
        "You are welcome to join a supportive German learning community that has helped many students in Ghana and beyond start, continue, and prepare for their German language journey with confidence.";
      const trust = document.createElement("div");
      trust.className = "hero-trust";
      trust.innerHTML = "<span>✅ Live class</span><span>🎥 Recordings</span><span>📱 Falowen app support</span>";
      text.insertAdjacentElement("afterend", trust);
    }
    hero.dataset.enhanced = "true";
  }

  function enhanceWhoFor() {
    const body = document.querySelector(".class-body");
    const highlights = document.getElementById("highlights")?.closest(".stack");
    if (!body || !highlights) return;
    let card = document.getElementById("whoForCard");
    const level = getLevelFromPage();
    const items = whoForByLevel[level] || whoForByLevel.A1;

    if (!card) {
      card = document.createElement("div");
      card.id = "whoForCard";
      card.className = "who-for-card";
      highlights.insertAdjacentElement("afterend", card);
    }

    card.innerHTML = `
      <h3>This class is good for you if:</h3>
      <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
    `;
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
    enhanceHero();
    enhanceWhoFor();
    enhanceAgreement();
  }

  const observer = new MutationObserver(() => runEnhancements());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("load", runEnhancements);
  setTimeout(runEnhancements, 300);
  setTimeout(runEnhancements, 1000);
})();
