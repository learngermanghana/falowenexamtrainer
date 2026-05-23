(function () {
  function injectStyles() {
    if (document.getElementById("classHeroBannerStyles")) return;
    const style = document.createElement("style");
    style.id = "classHeroBannerStyles";
    style.textContent = `
      .hero.class-hero-banner {
        position: relative;
        overflow: hidden;
        display: grid;
        grid-template-columns: minmax(0, 1.05fr) minmax(260px, .75fr);
        gap: 18px;
        align-items: stretch;
        padding: 24px;
        border: 1px solid rgba(191, 219, 254, .9);
        background:
          radial-gradient(circle at 10% 10%, rgba(255,255,255,.85), transparent 28%),
          radial-gradient(circle at 90% 0%, rgba(96,165,250,.32), transparent 34%),
          linear-gradient(135deg, #0f3faa 0%, #1455f5 48%, #082f72 100%);
        color: #ffffff;
      }

      .hero.class-hero-banner::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
        background-size: 28px 28px;
        mask-image: linear-gradient(90deg, rgba(0,0,0,.2), rgba(0,0,0,.9));
        pointer-events: none;
      }

      .hero.class-hero-banner > * { position: relative; z-index: 1; }
      .hero.class-hero-banner .eyebrow {
        display: inline-flex;
        width: fit-content;
        padding: 7px 11px;
        border-radius: 999px;
        background: rgba(255,255,255,.16);
        border: 1px solid rgba(255,255,255,.22);
        color: #dbeafe;
        font-weight: 900;
        letter-spacing: .08em;
      }

      .hero.class-hero-banner h1 {
        max-width: 720px;
        margin: 2px 0 0;
        color: #ffffff;
        font-size: clamp(30px, 7vw, 58px);
        line-height: .96;
        letter-spacing: -0.06em;
      }

      .hero.class-hero-banner p {
        max-width: 640px;
        color: #e0f2fe;
        font-size: clamp(15px, 2.5vw, 18px);
        line-height: 1.65;
      }

      .hero.class-hero-banner .hero-trust {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .hero.class-hero-banner .hero-trust span {
        background: rgba(255,255,255,.14);
        border: 1px solid rgba(255,255,255,.22);
        color: #ffffff;
        box-shadow: none;
      }

      .hero.class-hero-banner .hero-actions {
        margin-top: 4px;
      }

      .hero.class-hero-banner .hero-actions .button.primary {
        background: #ffffff;
        color: #1455f5;
        border-color: #ffffff;
        box-shadow: 0 18px 40px rgba(15, 23, 42, .22);
      }

      .hero-banner-copy {
        display: grid;
        gap: 12px;
        align-content: center;
      }

      .hero-visual-card {
        align-self: stretch;
        min-height: 280px;
        border-radius: 28px;
        background:
          linear-gradient(180deg, rgba(255,255,255,.97), rgba(239,246,255,.94));
        color: #0f172a;
        padding: 18px;
        display: grid;
        gap: 14px;
        box-shadow: 0 24px 60px rgba(15, 23, 42, .24);
        border: 1px solid rgba(255,255,255,.7);
      }

      .hero-visual-top {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .hero-avatar-stack {
        display: flex;
      }

      .hero-avatar {
        width: 42px;
        height: 42px;
        border-radius: 999px;
        display: grid;
        place-items: center;
        background: #dbeafe;
        border: 2px solid #ffffff;
        margin-left: -8px;
        font-weight: 900;
      }

      .hero-avatar:first-child { margin-left: 0; background: #fef3c7; }
      .hero-avatar:nth-child(2) { background: #dcfce7; }
      .hero-avatar:nth-child(3) { background: #fee2e2; }

      .hero-visual-title {
        display: grid;
        gap: 2px;
      }

      .hero-visual-title strong { font-size: 15px; }
      .hero-visual-title span { color: #64748b; font-size: 12px; font-weight: 800; }

      .hero-course-card {
        border-radius: 22px;
        padding: 16px;
        background: linear-gradient(135deg, #eff6ff, #ffffff);
        border: 1px solid #bfdbfe;
        display: grid;
        gap: 10px;
      }

      .hero-course-card h3 {
        margin: 0;
        font-size: 24px;
        line-height: 1;
        letter-spacing: -0.04em;
        color: #0f172a;
      }

      .hero-course-card p {
        margin: 0;
        color: #475569 !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
      }

      .hero-mini-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }

      .hero-mini-stat {
        border-radius: 16px;
        padding: 12px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
      }

      .hero-mini-stat span {
        display: block;
        color: #64748b;
        font-size: 11px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: .06em;
      }

      .hero-mini-stat strong {
        display: block;
        margin-top: 3px;
        color: #0f172a;
        font-size: 15px;
      }

      .hero-progress {
        height: 9px;
        border-radius: 999px;
        overflow: hidden;
        background: #dbeafe;
      }

      .hero-progress div {
        width: 72%;
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #1455f5, #22c55e);
      }

      @media (max-width: 760px) {
        .hero.class-hero-banner {
          grid-template-columns: 1fr;
          padding: 18px;
          gap: 14px;
          border-radius: 24px;
        }
        .hero-visual-card {
          min-height: auto;
          padding: 14px;
          border-radius: 22px;
        }
        .hero-course-card h3 { font-size: 21px; }
      }
    `;
    document.head.appendChild(style);
  }

  function enhanceHero() {
    const hero = document.querySelector(".hero");
    if (!hero || hero.dataset.heroBannerReady === "true") return;

    injectStyles();
    hero.classList.add("class-hero-banner");

    const existingChildren = Array.from(hero.children);
    const copy = document.createElement("div");
    copy.className = "hero-banner-copy";
    existingChildren.forEach((child) => copy.appendChild(child));

    const title = copy.querySelector("h1");
    const text = copy.querySelector("p");
    const eyebrow = copy.querySelector(".eyebrow");
    const trust = copy.querySelector(".hero-trust");

    if (eyebrow) eyebrow.textContent = "Falowen German Classes";
    if (title) title.textContent = "Start your German journey with confidence.";
    if (text) {
      text.textContent = "Join a supportive learning community for A1 to C1 German. Learn in person, online, or with recordings while keeping your Falowen access for revision and exam preparation.";
    }
    if (trust) {
      trust.innerHTML = "<span>Hybrid classes</span><span>6 months access</span><span>Exam preparation</span>";
    }

    const visual = document.createElement("aside");
    visual.className = "hero-visual-card";
    visual.innerHTML = `
      <div class="hero-visual-top">
        <div class="hero-avatar-stack" aria-hidden="true">
          <div class="hero-avatar">A1</div>
          <div class="hero-avatar">B1</div>
          <div class="hero-avatar">C1</div>
        </div>
        <div class="hero-visual-title">
          <strong>Learn Language Education Academy</strong>
          <span>German learning community</span>
        </div>
      </div>
      <div class="hero-course-card">
        <h3>Upcoming German Class</h3>
        <p>Choose your class, view meeting times, check the schedule, and sign up directly through Falowen.</p>
        <div class="hero-progress"><div></div></div>
      </div>
      <div class="hero-mini-grid">
        <div class="hero-mini-stat"><span>Mode</span><strong>Online + in person</strong></div>
        <div class="hero-mini-stat"><span>Access</span><strong>6 months</strong></div>
        <div class="hero-mini-stat"><span>Levels</span><strong>A1–C1</strong></div>
        <div class="hero-mini-stat"><span>Support</span><strong>App + tutor</strong></div>
      </div>
    `;

    hero.innerHTML = "";
    hero.appendChild(copy);
    hero.appendChild(visual);
    hero.dataset.heroBannerReady = "true";
  }

  window.addEventListener("load", enhanceHero);
  [100, 500, 1200].forEach((delay) => setTimeout(enhanceHero, delay));
})();
