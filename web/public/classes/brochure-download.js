(function () {
  const HTML2CANVAS_URL = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
  const JSPDF_URL = "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js";
  const QRCODE_URL = "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js";
  const DEFAULT_LOCATION = "Awoshie, Accra, Ghana";
  const DEFAULT_WHATSAPP = "233205706589";

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

  function getCoursePolicy() {
    return {
      courseDurationWeeks: 10,
      fullPaymentAccessMonths: 6,
      installmentAccessMonths: 1,
      learningModes: ["In person", "Online", "Recorded lessons"],
      certificateType: "Certificate of Completion",
      officialCertificateNote:
        "Falowen completion certificates do not replace Goethe-Institut or another recognized official language certificate when an official certificate is required.",
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
      locationLabel: DEFAULT_LOCATION,
      mapsUrl: "https://maps.app.goo.gl/CPYX7uCj9YSELc1Q9",
      classroomImage: "/classes/llea-classroom.jpg",
      ...(window.FalowenClassBrochureData?.academyProfile || {}),
    };
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
    const course = window.currentBrochureCourse || {};
    const policy = getCoursePolicy();
    const academyProfile = getAcademyProfile();
    const mapsUrl = course.mapsUrl || academyProfile.mapsUrl || "";
    const classroomImage = course.classroomImage || academyProfile.classroomImage || "";
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
      policy,
      academyProfile,
      mapsUrl,
      classroomImage,
      isSelfLearning: course.availability === "always",
      meetings: getMeetingRows(),
      reviews: getReviews(),
    };
  }

  function benefitCards(level, isSelfLearning = false) {
    const examLabel = level === "A1" ? "A1 exam preparation" : `${level} exam-style preparation`;
    if (isSelfLearning) {
      return [
        ["Flexible study", "Work through Falowen lessons and practice on your own schedule."],
        ["Tutor support", "Use available tutor support when you need guidance."],
        ["Falowen practice", "Grammar, vocabulary, speaking and writing support."],
        ["Progress tracking", "Results and learning progress in one place."],
        ["Structured course", "Follow the level curriculum instead of studying random topics."],
        ["Exam readiness", `${examLabel} and revision support.`],
      ];
    }
    return [
      ["Live lessons", "Structured teaching with clear weekly targets."],
      ["Tutor feedback", "Assignments are reviewed so you know what to improve."],
      ["Recorded lessons", "Catch up when you cannot attend a live session."],
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
    const policy = data.policy || getCoursePolicy();
    const academyProfile = data.academyProfile || getAcademyProfile();
    const modes = policy.learningModes || ["In person", "Online", "Recorded lessons"];
    const isSelfLearning = Boolean(data.isSelfLearning);
    const courseDuration = Number(policy.courseDurationWeeks || 10);
    const fullAccessMonths = Number(policy.fullPaymentAccessMonths || 6);
    const installmentAccessMonths = Number(policy.installmentAccessMonths || 1);
    const pageTotal = isSelfLearning ? 2 : 3;
    const heroKicker = isSelfLearning ? "FLEXIBLE GERMAN SELF-LEARNING" : "LIVE GERMAN PROGRAM · ACCRA + ONLINE";
    const heroTitle = isSelfLearning
      ? `Build your German independently with Falowen support`
      : `Build your German in ${courseDuration} structured weeks`;
    const heroBody = isSelfLearning
      ? `Structured Falowen practice, tutor support and flexible study access for your next German goal.`
      : `Live teaching, tutor feedback, recorded lessons and ${fullAccessMonths} months of Falowen access with full payment.`;
    const classDescription = isSelfLearning
      ? `This programme is self-learning and can be started after registration and access activation.`
      : `${data.classTitle} is the cohort name. Classes take place in ${data.location} and online.`;
    const meetingSubtitle = isSelfLearning ? "Study on your own schedule" : "Join in Awoshie or online";
    const benefits = benefitCards(data.level, isSelfLearning)
      .map(([title, description]) => `
        <div class="pdf-benefit"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(description)}</span></div>
      `).join("");
    const meetings = data.meetings.length
      ? data.meetings.map((meeting) => `<tr><td>${escapeHtml(meeting.day)}</td><td>${escapeHtml(meeting.time)}</td><td>${escapeHtml(isSelfLearning ? "Self-learning" : "Hybrid")}</td></tr>`).join("")
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
          <div class="pdf-kicker">${escapeHtml(heroKicker)}</div>
          <h1>${escapeHtml(heroTitle)}</h1>
          <p>${escapeHtml(heroBody)}</p>
        </div>

        <section class="pdf-class-card">
          <div>
            <div class="pdf-small-label">YOUR SELECTED CLASS</div>
            <h2>${escapeHtml(data.classTitle)}</h2>
            <p>${escapeHtml(classDescription)}</p>
          </div>
          <div class="pdf-meta-row">${meta}</div>
        </section>

        <section class="pdf-track-record">
          <div class="pdf-track-record-intro">
            <div class="pdf-small-label">OUR TRACK RECORD</div>
            <p>${escapeHtml(academyProfile.overview)}</p>
          </div>
          <div class="pdf-track-record-grid">
            <div><span>Established</span><strong>${escapeHtml(academyProfile.establishedYear)}</strong></div>
            <div><span>Exam performance</span><strong>${escapeHtml(academyProfile.examPassHeadline)}</strong></div>
            <div><span>German learning</span><strong>${escapeHtml(academyProfile.germanLevels)}</strong></div>
          </div>
          <small>German language examinations generally · not limited to one exam provider</small>
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
            <p>Includes ${fullAccessMonths} months of Falowen access for lessons, revision and exam preparation.</p>
          </div>
          <div class="pdf-price-card">
            <span class="pdf-price-tag neutral">INSTALLMENT PLAN</span>
            <strong>Start with</strong>
            <div class="pdf-price">${escapeHtml(data.installment)}</div>
            <p>Activates ${installmentAccessMonths} month of access. Pay ${escapeHtml(data.balance)} before the first access period ends to keep access active.</p>
          </div>
        </section>

        <section class="pdf-cta">
          <div><strong>Register for ${escapeHtml(data.classTitle)}</strong><span>Create your Falowen account, choose this class and complete payment.</span></div>
          <div class="pdf-cta-url">www.falowen.app</div>
        </section>

        <div class="pdf-two-cards">
          <div><strong>Class location</strong><span>${escapeHtml(data.location)}</span></div>
          <div><strong>Flexible class mode</strong><span>${escapeHtml(data.mode)}</span></div>
        </div>

        <footer class="pdf-page-footer"><span>Learn Language Education Academy</span><span>Page 1 of ${pageTotal}</span></footer>
      </section>

      <section class="pdf-page pdf-page-two">
        <header class="pdf-brand-row compact">
          <div class="pdf-brand"><img src="/falo.png" alt="" /><div><strong>${escapeHtml(data.classTitle)}</strong><span>Class brochure</span></div></div>
          <div class="pdf-level-badge">${escapeHtml(data.level)}</div>
        </header>

        <div class="pdf-page-two-grid">
          <section class="pdf-panel">
            <div class="pdf-section-title"><span>Meeting times</span><small>${escapeHtml(meetingSubtitle)}</small></div>
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
              <li><b>4</b><span>${escapeHtml(isSelfLearning ? "Start studying in Falowen and follow your own schedule." : `Choose a learning mode for each session: ${modes.join(", ")}.`)}</span></li>
            </ol>
          </section>

          <section class="pdf-panel pdf-faq-panel">
            <div class="pdf-section-title"><span>Essential questions</span></div>
            <div class="pdf-faq-grid">
              <div><strong>What learning modes are available?</strong><span>${escapeHtml(isSelfLearning ? "This programme is self-learning." : modes.join(", "))}</span></div>
              <div><strong>Will I receive a certificate?</strong><span>${escapeHtml(`A ${policy.certificateType || "Certificate of Completion"} is issued after the course requirements and assignments are completed.`)}</span></div>
              <div><strong>Is it an official exam certificate?</strong><span>${escapeHtml(policy.officialCertificateNote || "Official language certification requires a separate exam with a recognized provider.")}</span></div>
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
            <span><b>Website</b> www.falowen.app</span>
            <span><b>WhatsApp</b> ${DEFAULT_WHATSAPP}</span>
            <span><b>Email</b> info@falowen.app</span>
            <span><b>Location</b> ${escapeHtml(data.location)}</span>
          </div>
        </section>

        <footer class="pdf-page-footer"><span>Structured classes · Tutor support · Falowen practice</span><span>Page 2 of ${pageTotal}</span></footer>
      </section>

      ${isSelfLearning ? "" : `\n        <section class="pdf-page pdf-page-three">
          <header class="pdf-brand-row compact">
            <div class="pdf-brand"><img src="/falo.png" alt="" /><div><strong>Visit Learn Language Education Academy</strong><span>Awoshie · Accra</span></div></div>
            <div class="pdf-level-badge">LLEA</div>
          </header>

          <div class="pdf-location-hero">
            <div>
              <div class="pdf-small-label">IN-PERSON CLASSROOM</div>
              <h2>Know exactly where to go before your first class</h2>
              <p>In-person lessons take place at our Awoshie learning space. Use the Google Maps location below for the exact route and entrance.</p>
            </div>
            <div class="pdf-location-address">
              <span>Class location</span>
              <strong>${escapeHtml(academyProfile.locationLabel || data.location || DEFAULT_LOCATION)}</strong>
            </div>
          </div>

          <section class="pdf-classroom-photo">
            ${data.classroomImage ? `<img class="pdf-classroom-image" src="${escapeHtml(data.classroomImage)}" alt="Learn Language Education Academy classroom" crossorigin="anonymous" />` : ""}
            <div class="pdf-classroom-fallback">LLEA classroom photo</div>
                      <div class="pdf-classroom-caption">LLEA classroom · Awoshie, Accra</div>
          </section>

          <section class="pdf-map-panel">
            <div>
              <div class="pdf-section-title"><span>Open the exact location</span><small>Google Maps</small></div>
              <p class="pdf-body-copy">Use this link before travelling to class. It opens the exact LLEA map location instead of a general Awoshie search.</p>
              <div class="pdf-map-url">${escapeHtml(data.mapsUrl || academyProfile.mapsUrl || "")}</div>
            </div>
            <div id="pdfMapsQr" class="pdf-maps-qr"><span>Google Maps</span></div>
          </section>

          <section class="pdf-arrival-panel">
            <div><strong>Before class</strong><span>Open the map link, check your route and plan to arrive early for in-person lessons.</span></div>
            <div><strong>Hybrid option</strong><span>If needed, students can also join online according to the class arrangement.</span></div>
            <div><strong>Need help?</strong><span>Contact the academy using the WhatsApp or email details in this brochure.</span></div>
          </section>

          <footer class="pdf-page-footer"><span>${escapeHtml(academyProfile.academyName || "Learn Language Education Academy")}</span><span>Page 3 of 3</span></footer>
        </section>\n      `}
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
      .pdf-page-one { gap: 15px; }
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
      .pdf-track-record { border: 1px solid #bfdbfe; border-radius: 16px; background: #ffffff; padding: 13px 15px; display: grid; gap: 9px; }
      .pdf-track-record-intro { display: grid; gap: 4px; }
      .pdf-track-record-intro p { color: #475569; font-size: 9.5px; line-height: 1.45; }
      .pdf-track-record-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .pdf-track-record-grid > div { border-radius: 10px; background: #eff6ff; border: 1px solid #dbeafe; padding: 8px 9px; display: grid; gap: 3px; }
      .pdf-track-record-grid span { color: #64748b; font-size: 7.5px; font-weight: 900; text-transform: uppercase; letter-spacing: .04em; }
      .pdf-track-record-grid strong { color: #0f172a; font-size: 10.5px; line-height: 1.3; }
      .pdf-track-record > small { color: #64748b; font-size: 7.5px; }
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
      .pdf-page-three { gap: 18px; }
      .pdf-location-hero { border-radius: 22px; padding: 24px; background: #eff6ff; border: 1px solid #bfdbfe; display: grid; grid-template-columns: 1.4fr .6fr; gap: 18px; align-items: center; }
      .pdf-location-hero h2 { font-size: 28px; line-height: 1.08; margin: 5px 0 8px; }
      .pdf-location-hero p { color: #334155; font-size: 12px; line-height: 1.55; }
      .pdf-location-address { border-radius: 14px; padding: 14px; background: #ffffff; display: grid; gap: 5px; }
      .pdf-location-address span { color: #64748b; font-size: 9px; font-weight: 900; text-transform: uppercase; }
      .pdf-location-address strong { font-size: 14px; line-height: 1.35; }
      .pdf-classroom-photo { height: 390px; border-radius: 20px; overflow: hidden; background: #e2e8f0; border: 1px solid #cbd5e1; position: relative; }
      .pdf-classroom-image { width: 100%; height: 100%; object-fit: cover; display: block; }
      .pdf-classroom-fallback { display: none; width: 100%; height: 100%; place-items: center; color: #64748b; font-size: 14px; font-weight: 800; }
      .pdf-classroom-caption { position: absolute; left: 14px; bottom: 14px; border-radius: 999px; padding: 7px 10px; background: rgba(15,23,42,.86); color: #ffffff; font-size: 9px; font-weight: 900; }
      .pdf-map-panel { display: grid; grid-template-columns: 1fr 150px; gap: 16px; align-items: center; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; }
      .pdf-map-url { margin-top: 10px; border-radius: 10px; background: #f8fafc; padding: 10px; font-size: 9px; line-height: 1.4; overflow-wrap: anywhere; color: #1d4ed8; font-weight: 800; }
      .pdf-maps-qr { width: 150px; height: 150px; border: 1px solid #dbeafe; border-radius: 14px; background: #ffffff; display: grid; place-items: center; overflow: hidden; }
      .pdf-maps-qr canvas { width: 138px !important; height: 138px !important; }
      .pdf-maps-qr span { color: #64748b; font-size: 11px; font-weight: 800; }
      .pdf-arrival-panel { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
      .pdf-arrival-panel > div { border-radius: 14px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 13px; display: grid; gap: 5px; }
      .pdf-arrival-panel strong { font-size: 11px; }
      .pdf-arrival-panel span { color: #475569; font-size: 9.5px; line-height: 1.45; }
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
      const months = Number(getCoursePolicy().installmentAccessMonths || 1);
      if (paragraph) paragraph.textContent = `This activates ${months} month of Falowen access. Pay ${fee.balance} before that access period ends to keep your course and platform access active.`;
    }
  }

  function setButtonState(button, busy, label) {
    if (!button) return;
    button.disabled = busy;
    button.setAttribute("aria-busy", String(busy));
    button.textContent = label;
  }

  async function prepareLocationPage(brochure, data) {
    const locationPage = brochure.querySelector(".pdf-page-three");
    const image = brochure.querySelector(".pdf-classroom-image");
    let classroomImageReady = false;

    if (image) {
      classroomImageReady = await new Promise((resolve) => {
        if (image.complete) {
          resolve(Boolean(image.naturalWidth));
          return;
        }
        image.addEventListener("load", () => resolve(true), { once: true });
        image.addEventListener("error", () => resolve(false), { once: true });
      });
    }

    if (locationPage && !classroomImageReady) {
      locationPage.remove();
      const pages = brochure.querySelectorAll(".pdf-page");
      pages.forEach((page, index) => {
        const pageNumber = page.querySelector(".pdf-page-footer span:last-child");
        if (pageNumber) pageNumber.textContent = `Page ${index + 1} of ${pages.length}`;
      });
      return;
    }

    const qrTarget = brochure.querySelector("#pdfMapsQr");
    if (qrTarget && data.mapsUrl) {
      try {
        await loadScript(QRCODE_URL, () => Boolean(window.QRCode?.toCanvas));
        const canvas = document.createElement("canvas");
        await window.QRCode.toCanvas(canvas, data.mapsUrl, { width: 138, margin: 1 });
        qrTarget.replaceChildren(canvas);
      } catch (error) {
        console.warn("Could not generate Google Maps QR code", error);
      }
    }
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
      await prepareLocationPage(brochure, data);
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
  window.addEventListener("falowen:brochure-rendered", run);
  [100, 350, 800, 1500, 2600].forEach((delay) => setTimeout(run, delay));
})();
