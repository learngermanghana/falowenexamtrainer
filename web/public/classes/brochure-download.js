(function () {
  const HTML2CANVAS_URL = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
  const JSPDF_URL = "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js";
  const DEFAULT_LOCATION = "Ghana, Accra - Awoshie";
  const DEFAULT_WHATSAPP = "+233 24 111 3054";

  const text = (selector, fallback = "") =>
    String(document.querySelector(selector)?.textContent || fallback).replace(/\s+/g, " ").trim();

  const escapeHtml = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const slugify = (value = "") =>
    String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "falowen-class";

  function loadScript(src, ready) {
    if (ready()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Could not load ${src}`));
      document.head.appendChild(script);
    });
  }

  function getFeeData() {
    const rows = Array.from(document.querySelectorAll("#stats .stat"));
    const full = rows[0]?.querySelector("b")?.textContent?.trim() || "GHS 0";
    const installment = rows[2]?.querySelector("b")?.textContent?.trim()
      || rows[1]?.querySelector("b")?.textContent?.replace(/\s*first payment/i, "").trim()
      || "GHS 0";
    const paymentCards = Array.from(document.querySelectorAll(".payment-option"));
    const installmentText = paymentCards[1]?.textContent || "";
    const balanceMatch = installmentText.match(/balance(?: of)?\s+(GHS\s*[\d,]+)/i)
      || text("#paymentSummary").match(/balance(?: of)?\s+(GHS\s*[\d,]+)/i);
    return {
      full,
      installment,
      balance: balanceMatch?.[1] || "the remaining balance",
    };
  }

  function getMeetingRows() {
    return Array.from(document.querySelectorAll("#meetingRows tr"))
      .map((row) => Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent.trim()))
      .filter((cells) => cells.length >= 2)
      .map((cells) => ({ day: cells[0], time: cells[1] }));
  }

  function cleanReview(value = "") {
    let result = String(value)
      .replace(/\s+/g, " ")
      .replace(/\.([A-Z])/g, ". $1")
      .replace(/\s+([,.!?])/g, "$1")
      .replace(/\bseemless\b/gi, "seamless")
      .replace(/\bstate of art\b/gi, "state-of-the-art")
      .trim();
    if (result.length > 210) {
      result = `${result.slice(0, 207).replace(/\s+\S*$/, "")}...`;
    }
    return result;
  }

  function getReviews() {
    return Array.from(document.querySelectorAll(".student-review"))
      .slice(0, 2)
      .map((review) => ({
        name: String(review.querySelector(".student-review-name")?.textContent || "Student").replace(/\s+/g, " ").trim(),
        stars: review.querySelector(".student-review-stars")?.textContent?.trim() || "★★★★★",
        quote: cleanReview(review.querySelector(".student-review-text")?.textContent || ""),
      }))
      .filter((review) => review.quote);
  }

  function getPageData() {
    const blueTitle = text("#blueClassTitle", "German class");
    const levelMatch = blueTitle.match(/\b(A1|A2|B1|B2|C1|C2)\b/i);
    const level = levelMatch?.[1]?.toUpperCase() || "A1";
    const classTitle = text("#classTitle", `${blueTitle} class`);
    const meta = Array.from(document.querySelectorAll("#blueClassMeta span"))
      .map((item) => item.textContent.replace(/^[^A-Za-z0-9]+/, "").trim());
    const location = text("#classLocationCard strong", DEFAULT_LOCATION);
    const whoFor = text("#whoForCard p", "Students who want structured German lessons with tutor support.");
    const mode = text("#classModeCard p", "Hybrid: join in person, online, or use recorded lessons when needed.");
    const scheduleUrl = document.getElementById("classScheduleCta")?.href
      || document.getElementById("scheduleLink")?.href
      || window.location.href;
    const signupUrl = document.getElementById("mainSignupCta")?.href
      || document.querySelector("a[href^='/signup']")?.href
      || `${window.location.origin}/signup/`;
    const { full, installment, balance } = getFeeData();
    return {
      blueTitle,
      level,
      classTitle,
      meta,
      location,
      whoFor,
      mode,
      scheduleUrl,
      signupUrl,
      full,
      installment,
      balance,
      meetings: getMeetingRows(),
      reviews: getReviews(),
    };
  }

  function benefitCards(level) {
    const examLabel = level === "A1" ? "A1 exam preparation" : `${level} exam-style preparation`;
    return [
      ["Live lessons", "Structured teaching with clear weekly targets."],
      ["Tutor feedback", "Assignments are reviewed so you know what to improve."],
      ["Recorded lectures", "Catch up when you cannot attend a live session."],
      ["Falowen practice", "Grammar, vocabulary, speaking and writing support."],
      ["Progress tracking", "Results, attendance and learning progress in one place."],
      ["Exam readiness", `${examLabel} and revision support.`],
    ];
  }

  function buildReviews(reviews) {
    const source = reviews.length ? reviews : [
      {
        name: "Falowen student",
        stars: "★★★★★",
        quote: "The hybrid format made it possible to continue learning consistently, whether online or in person.",
      },
      {
        name: "Falowen student",
        stars: "★★★★★",
        quote: "The lessons, tutor support and Falowen practice helped me understand German step by step.",
      },
    ];
    return source.map((review) => `
      <article class="pdf-review">
        <div class="pdf-review-head"><strong>${escapeHtml(review.name)}</strong><span>${escapeHtml(review.stars)}</span></div>
        <p>“${escapeHtml(review.quote)}”</p>
      </article>
    `).join("");
  }

  function buildBrochure(data) {
    const benefits = benefitCards(data.level)
      .map(([title, description]) => `
        <div class="pdf-benefit"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(description)}</span></div>
      `).join("");
    const meetings = data.meetings.length
      ? data.meetings.map((meeting) => `<tr><td>${escapeHtml(meeting.day)}</td><td>${escapeHtml(meeting.time)}</td><td>Hybrid</td></tr>`).join("")
      : '<tr><td colspan="3">Self-learning - no fixed meeting time.</td></tr>';
    const meta = data.meta.slice(0, 4).map((item) => `<span>${escapeHtml(item)}</span>`).join("");

    const wrapper = document.createElement("div");
    wrapper.id = "falowenPdfBrochure";
    wrapper.setAttribute("aria-hidden", "true");
    wrapper.innerHTML = `
      <section class="pdf-page pdf-page-one">
        <header class="pdf-brand-row">
          <div class="pdf-brand"><img src="/falo.png" alt="" /><div><strong>Learn Language Education Academy</strong><span>Powered by Falowen</span></div></div>
          <div class="pdf-level-badge">German ${escapeHtml(data.level)}</div>
        </header>

        <div class="pdf-hero">
          <div class="pdf-kicker">LIVE GERMAN PROGRAM · ACCRA + ONLINE</div>
          <h1>Start speaking German confidently in 10 weeks</h1>
          <p>Live classes, tutor feedback, recorded lectures and six months of Falowen practice to help you learn consistently and prepare for your next goal.</p>
        </div>

        <section class="pdf-class-card">
          <div>
            <div class="pdf-small-label">YOUR SELECTED CLASS</div>
            <h2>${escapeHtml(data.classTitle)}</h2>
            <p>${escapeHtml(data.classTitle)} is the cohort name. Classes take place in ${escapeHtml(data.location)} and online.</p>
          </div>
          <div class="pdf-meta-row">${meta}</div>
        </section>

        <section>
          <div class="pdf-section-title"><span>What your course includes</span><small>Everything students need in one structured programme</small></div>
          <div class="pdf-benefit-grid">${benefits}</div>
        </section>

        <section class="pdf-price-grid">
          <div class="pdf-price-card recommended">
            <span class="pdf-price-tag">BEST VALUE</span>
            <strong>Full course fee</strong>
            <div class="pdf-price">${escapeHtml(data.full)}</div>
            <p>Includes six months of Falowen access for lessons, revision and exam preparation.</p>
          </div>
          <div class="pdf-price-card">
            <span class="pdf-price-tag neutral">INSTALLMENT PLAN</span>
            <strong>Start with</strong>
            <div class="pdf-price">${escapeHtml(data.installment)}</div>
            <p>Activates one month of access. Pay ${escapeHtml(data.balance)} before the month ends to keep access active.</p>
          </div>
        </section>

        <section class="pdf-cta">
          <div><strong>Register for ${escapeHtml(data.classTitle)}</strong><span>Create your Falowen account, choose this class and complete payment.</span></div>
          <div class="pdf-cta-url">www.falowen.app/classes</div>
        </section>

        <div class="pdf-two-cards">
          <div><strong>Class location</strong><span>${escapeHtml(data.location)}</span></div>
          <div><strong>Flexible class mode</strong><span>${escapeHtml(data.mode)}</span></div>
        </div>

        <footer class="pdf-page-footer"><span>Learn Language Education Academy</span><span>Page 1 of 2</span></footer>
      </section>

      <section class="pdf-page pdf-page-two">
        <header class="pdf-brand-row compact">
          <div class="pdf-brand"><img src="/falo.png" alt="" /><div><strong>${escapeHtml(data.classTitle)}</strong><span>Class brochure</span></div></div>
          <div class="pdf-level-badge">${escapeHtml(data.level)}</div>
        </header>

        <div class="pdf-page-two-grid">
          <section class="pdf-panel">
            <div class="pdf-section-title"><span>Meeting times</span><small>Join in Awoshie or online</small></div>
            <table class="pdf-table"><thead><tr><th>Day</th><th>Time</th><th>Mode</th></tr></thead><tbody>${meetings}</tbody></table>
          </section>

          <section class="pdf-panel">
            <div class="pdf-section-title"><span>Who this class is for</span></div>
            <p class="pdf-body-copy">${escapeHtml(data.whoFor)}</p>
          </section>

          <section class="pdf-panel">
            <div class="pdf-section-title"><span>How to join</span><small>Four simple steps</small></div>
            <ol class="pdf-step-list">
              <li><b>1</b><span>Create your Falowen account.</span></li>
              <li><b>2</b><span>Choose ${escapeHtml(data.classTitle)} under Upcoming Classes.</span></li>
              <li><b>3</b><span>Pay the full course fee or begin with the installment plan.</span></li>
              <li><b>4</b><span>Join in person, online, or use the recorded lesson when needed.</span></li>
            </ol>
          </section>

          <section class="pdf-panel pdf-faq-panel">
            <div class="pdf-section-title"><span>Essential questions</span></div>
            <div class="pdf-faq-grid">
              <div><strong>Do all learning modes cost the same?</strong><span>Yes. The class fee covers in-person, online and recorded participation.</span></div>
              <div><strong>Will I receive a certificate?</strong><span>A completion certificate is issued after the course requirements and assignments are completed.</span></div>
              <div><strong>Is it a Goethe certificate?</strong><span>No. Official Goethe certification requires a separate exam with an approved provider.</span></div>
              <div><strong>Where are my results and documents?</strong><span>Receipts, results and attendance records are available in My Results &amp; Resources.</span></div>
            </div>
          </section>

          <section class="pdf-panel">
            <div class="pdf-section-title"><span>What students say</span><small>Student experiences with the academy</small></div>
            <div class="pdf-review-grid">${buildReviews(data.reviews)}</div>
          </section>
        </div>

        <section class="pdf-contact">
          <div><strong>Ready to begin?</strong><span>Register online or contact the academy for support.</span></div>
          <div class="pdf-contact-grid">
            <span><b>Website</b> www.falowen.app/classes</span>
            <span><b>WhatsApp</b> ${DEFAULT_WHATSAPP}</span>
            <span><b>Email</b> info@falowen.app</span>
            <span><b>Location</b> ${escapeHtml(data.location)}</span>
          </div>
        </section>

        <footer class="pdf-page-footer"><span>Structured classes · Tutor support · Falowen practice</span><span>Page 2 of 2</span></footer>
      </section>
    `;
    return wrapper;
  }

  function injectStyles() {
    if (document.getElementById("falowenBrochureDownloadStyles")) return;
    const style = document.createElement("style");
    style.id = "falowenBrochureDownloadStyles";
    style.textContent = `
      #downloadBrochureButton[aria-busy="true"] { opacity: .72; cursor: wait; }
      #falowenPdfBrochure { position: fixed; left: -10000px; top: 0; width: 794px; z-index: -1; font-family: Inter, Arial, sans-serif; color: #0f172a; }
      .pdf-page { width: 794px; height: 1123px; overflow: hidden; background: #ffffff; padding: 42px 46px 34px; display: flex; flex-direction: column; gap: 22px; position: relative; }
      .pdf-page * { box-sizing: border-box; }
      .pdf-page h1, .pdf-page h2, .pdf-page p { margin: 0; }
      .pdf-brand-row { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
      .pdf-brand-row.compact { padding-bottom: 14px; border-bottom: 1px solid #dbeafe; }
      .pdf-brand { display: flex; align-items: center; gap: 11px; }
      .pdf-brand img { width: 42px; height: 42px; object-fit: contain; border-radius: 11px; }
      .pdf-brand div { display: grid; gap: 2px; }
      .pdf-brand strong { font-size: 16px; }
      .pdf-brand span { color: #64748b; font-size: 11px; }
      .pdf-level-badge { border-radius: 999px; padding: 9px 14px; background: #1455f5; color: #ffffff; font-size: 13px; font-weight: 900; }
      .pdf-hero { border-radius: 24px; padding: 30px; background: linear-gradient(135deg, #0f2f91 0%, #1455f5 58%, #ec4899 150%); color: #ffffff; display: grid; gap: 12px; }
      .pdf-kicker, .pdf-small-label { font-size: 10px; font-weight: 900; letter-spacing: .1em; }
      .pdf-hero h1 { font-size: 36px; line-height: 1.05; max-width: 610px; letter-spacing: -.035em; }
      .pdf-hero p { max-width: 620px; font-size: 15px; line-height: 1.55; color: #e0e7ff; }
      .pdf-class-card { border: 1px solid #bfdbfe; background: #eff6ff; border-radius: 18px; padding: 18px 20px; display: grid; gap: 12px; }
      .pdf-class-card h2 { font-size: 24px; margin-top: 4px; }
      .pdf-class-card p { color: #334155; font-size: 12px; line-height: 1.5; margin-top: 5px; }
      .pdf-meta-row { display: flex; flex-wrap: wrap; gap: 7px; }
      .pdf-meta-row span { border-radius: 999px; background: #ffffff; border: 1px solid #bfdbfe; color: #1e3a8a; padding: 7px 9px; font-size: 10px; font-weight: 800; }
      .pdf-section-title { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; margin-bottom: 11px; }
      .pdf-section-title > span { font-size: 17px; font-weight: 900; }
      .pdf-section-title small { color: #64748b; font-size: 10px; }
      .pdf-benefit-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
      .pdf-benefit { min-height: 76px; border: 1px solid #e2e8f0; border-radius: 14px; padding: 11px; display: grid; align-content: start; gap: 5px; background: #f8fafc; }
      .pdf-benefit strong { font-size: 12px; }
      .pdf-benefit span { color: #475569; font-size: 10px; line-height: 1.45; }
      .pdf-price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .pdf-price-card { border: 1px solid #e2e8f0; border-radius: 16px; padding: 15px; display: grid; gap: 6px; }
      .pdf-price-card.recommended { border: 2px solid #1455f5; background: #eff6ff; }
      .pdf-price-tag { width: fit-content; border-radius: 999px; background: #1455f5; color: #ffffff; padding: 5px 8px; font-size: 8px; font-weight: 900; letter-spacing: .06em; }
      .pdf-price-tag.neutral { background: #e2e8f0; color: #334155; }
      .pdf-price-card > strong { font-size: 12px; }
      .pdf-price { font-size: 25px; font-weight: 950; letter-spacing: -.03em; }
      .pdf-price-card p { color: #475569; font-size: 10px; line-height: 1.45; }
      .pdf-cta { border-radius: 16px; padding: 16px 18px; background: #0f172a; color: #ffffff; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
      .pdf-cta > div:first-child { display: grid; gap: 4px; }
      .pdf-cta strong { font-size: 15px; }
      .pdf-cta span { color: #cbd5e1; font-size: 10px; }
      .pdf-cta-url { background: #ffffff; color: #1455f5; border-radius: 999px; padding: 9px 13px; font-size: 11px; font-weight: 900; white-space: nowrap; }
      .pdf-two-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .pdf-two-cards > div { border-left: 4px solid #1455f5; background: #f8fafc; border-radius: 10px; padding: 11px 12px; display: grid; gap: 4px; }
      .pdf-two-cards strong { font-size: 11px; }
      .pdf-two-cards span { color: #475569; font-size: 9.5px; line-height: 1.4; }
      .pdf-page-footer { margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 9px; display: flex; justify-content: space-between; color: #64748b; font-size: 9px; }
      .pdf-page-two { gap: 17px; }
      .pdf-page-two-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .pdf-panel { border: 1px solid #e2e8f0; border-radius: 16px; padding: 14px; background: #ffffff; }
      .pdf-panel:nth-child(1), .pdf-faq-panel, .pdf-panel:nth-child(5) { grid-column: 1 / -1; }
      .pdf-table { width: 100%; border-collapse: collapse; }
      .pdf-table th, .pdf-table td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: left; font-size: 10px; }
      .pdf-table th { color: #475569; background: #f8fafc; }
      .pdf-body-copy { color: #334155; font-size: 11px; line-height: 1.55; }
      .pdf-step-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 7px; }
      .pdf-step-list li { margin: 0; display: flex; align-items: center; gap: 9px; color: #334155; font-size: 10px; }
      .pdf-step-list b { flex: 0 0 24px; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; background: #1455f5; color: #ffffff; }
      .pdf-faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .pdf-faq-grid > div { border-radius: 12px; padding: 10px; background: #f8fafc; display: grid; gap: 4px; }
      .pdf-faq-grid strong { font-size: 10px; }
      .pdf-faq-grid span { color: #475569; font-size: 9px; line-height: 1.45; }
      .pdf-review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
      .pdf-review { border-left: 4px solid #f59e0b; background: #fffbeb; border-radius: 12px; padding: 11px; display: grid; gap: 7px; }
      .pdf-review-head { display: flex; justify-content: space-between; gap: 8px; font-size: 10px; }
      .pdf-review-head span { color: #f59e0b; letter-spacing: .04em; }
      .pdf-review p { color: #475569; font-size: 9px; line-height: 1.5; }
      .pdf-contact { margin-top: auto; border-radius: 18px; padding: 16px 18px; background: linear-gradient(135deg, #eff6ff, #fdf2f8); border: 1px solid #bfdbfe; display: grid; gap: 10px; }
      .pdf-contact > div:first-child { display: grid; gap: 3px; }
      .pdf-contact strong { font-size: 16px; }
      .pdf-contact span { color: #334155; font-size: 10px; }
      .pdf-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px 15px; }
      .pdf-contact-grid span { background: #ffffff; border-radius: 10px; padding: 8px 10px; }
      .pdf-contact-grid b { color: #1455f5; margin-right: 4px; }
      body.falowen-brochure-print-fallback > *:not(#falowenPdfBrochure) { display: none !important; }
      @media print {
        body.falowen-brochure-print-fallback { margin: 0 !important; background: #ffffff !important; }
        body.falowen-brochure-print-fallback #falowenPdfBrochure { position: static; left: auto; top: auto; width: auto; z-index: auto; }
        body.falowen-brochure-print-fallback .pdf-page { break-after: page; page-break-after: always; }
        body.falowen-brochure-print-fallback .pdf-page:last-child { break-after: auto; page-break-after: auto; }
        @page { size: A4 portrait; margin: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureDownloadButton() {
    const actions = document.querySelector(".hero-actions");
    if (!actions) return;
    let button = document.getElementById("downloadBrochureButton");
    if (!button) {
      button = document.createElement("button");
      button.id = "downloadBrochureButton";
      button.type = "button";
      button.className = "button amber";
      button.textContent = "Download brochure";
    }
    if (!actions.contains(button)) actions.appendChild(button);
  }

  function polishPageCopy() {
    const rows = Array.from(document.querySelectorAll("#stats .stat"));
    if (rows[0]?.querySelector("span")) rows[0].querySelector("span").textContent = "Full course fee";
    const options = Array.from(document.querySelectorAll(".payment-option"));
    const fee = getFeeData();
    if (options[0]) {
      const heading = options[0].querySelector("strong");
      if (heading) heading.textContent = `Full course fee: ${fee.full}`;
    }
    if (options[1]) {
      const paragraph = options[1].querySelector("p");
      if (paragraph) paragraph.textContent = `This activates one month of Falowen access. Pay ${fee.balance} before the end of the first month to keep your course and platform access active.`;
    }
  }

  function setButtonState(button, busy, label) {
    if (!button) return;
    button.disabled = busy;
    button.setAttribute("aria-busy", String(busy));
    button.textContent = label;
  }

  async function renderPdfPage(page) {
    return window.html2canvas(page, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
    });
  }

  async function downloadBrochure() {
    const button = document.getElementById("downloadBrochureButton");
    setButtonState(button, true, "Preparing PDF...");
    injectStyles();
    document.getElementById("falowenPdfBrochure")?.remove();
    const data = getPageData();
    const brochure = buildBrochure(data);
    document.body.appendChild(brochure);

    try {
      await loadScript(HTML2CANVAS_URL, () => typeof window.html2canvas === "function");
      await loadScript(JSPDF_URL, () => Boolean(window.jspdf?.jsPDF));
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const pages = Array.from(brochure.querySelectorAll(".pdf-page"));
      const pdf = new window.jspdf.jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
      for (let index = 0; index < pages.length; index += 1) {
        const canvas = await renderPdfPage(pages[index]);
        if (index > 0) pdf.addPage("a4", "portrait");
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.94), "JPEG", 0, 0, 210, 297, undefined, "FAST");
      }
      pdf.save(`${slugify(data.classTitle)}-falowen-brochure.pdf`);
      brochure.remove();
    } catch (error) {
      console.error("Could not generate the Falowen brochure PDF", error);
      document.body.classList.add("falowen-brochure-print-fallback");
      const cleanup = () => {
        document.body.classList.remove("falowen-brochure-print-fallback");
        brochure.remove();
        window.removeEventListener("afterprint", cleanup);
      };
      window.addEventListener("afterprint", cleanup);
      window.print();
      setTimeout(cleanup, 2000);
    } finally {
      setButtonState(button, false, "Download brochure");
    }
  }

  function run() {
    injectStyles();
    ensureDownloadButton();
    polishPageCopy();
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("#downloadBrochureButton")) {
      event.preventDefault();
      downloadBrochure();
    }
  });

  window.downloadClassBrochure = downloadBrochure;
  window.addEventListener("load", run);
  [100, 350, 800, 1500, 2600].forEach((delay) => setTimeout(run, delay));
})();
