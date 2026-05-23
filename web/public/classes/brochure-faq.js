(function () {
  const FAQS = [
    {
      question: "How do I enroll and get access to Falowen?",
      answer:
        "Go to www.falowen.app, click Sign up and create an account. Then open Upcoming Classes, choose your class, and pay. After payment, you get automatic access and the school will contact you in the app.",
    },
    {
      question: "Do online, in-person, self-learning, or recorded lectures cost the same?",
      answer:
        "Yes. The fee is the same for all learning modes. For each session, you may join in person, online, or via recorded lecture. You decide each time. Class duration is 10 weeks, about 3 months. Full payment gives 6 months total access to Falowen from enrollment. After 6 months, you can extend at GHS 1,000 per month or enroll in a new 10-week class.",
    },
    {
      question: "Can I continue learning to B1 or B2 if I did not write the A1 or A2 exam?",
      answer:
        "Yes. You can keep learning until you reach the level you need for your goal. For example, if your target is B1 or B2, you can study step by step until you are ready for that level before registering for the official exam. You do not have to stop learning just because you have not written the A1 or A2 exam yet. Our courses are structured to help you build from one level to the next and keep your knowledge updated, even while you are waiting for your preferred exam date.",
    },
    {
      question: "Do I receive a certificate upon completion?",
      answer:
        "Yes. Certificates are awarded when you successfully complete the course and have submitted all required assignments.",
    },
    {
      question: "Does the Falowen certificate replace a Goethe certificate?",
      answer:
        "No. Falowen issues a Certificate of Completion. It is not an official Goethe-Institut certificate and does not replace embassy, school, university, or employer requirements. When official language certification is required, you must write the exam with Goethe-Institut or another recognized exam provider.",
    },
    {
      question: "Where can I download my receipts, letter of enrollment, results, and attendance?",
      answer:
        "All official documents are available in your account under My Results & Resources. Please download and keep your own copies.",
    },
    {
      question: "How will I receive my assignment results?",
      answer:
        "You will receive an email for each assignment. If you opt in, you may also receive Telegram notifications.",
    },
    {
      question: "Do I get weekly progress summaries?",
      answer:
        "Yes. We send weekly summaries that include your average score and learning streaks.",
    },
    {
      question: "What if I have payment or access issues?",
      answer:
        "Please check your email, including spam or junk, and your Falowen account. If the issue continues, contact info@falowen.app or chat on WhatsApp using the link on this page.",
    },
  ];

  function injectStyles() {
    if (document.getElementById("brochureFaqStyles")) return;
    const style = document.createElement("style");
    style.id = "brochureFaqStyles";
    style.textContent = `
      .faq-card { margin-top: 16px; display: grid; gap: 12px; }
      .faq-card h2 { margin: 0; font-size: 20px; }
      .faq-intro { margin: 0; color: #475569; font-size: 14px; line-height: 1.55; }
      .faq-list { display: grid; gap: 8px; }
      .faq-item { border: 1px solid #e2e8f0; border-radius: 14px; background: #f8fafc; overflow: hidden; }
      .faq-question { width: 100%; display: flex; justify-content: space-between; gap: 12px; align-items: center; border: 0; background: transparent; color: #0f172a; font-weight: 900; text-align: left; padding: 13px 14px; cursor: pointer; font: inherit; }
      .faq-question span:first-child { line-height: 1.35; }
      .faq-icon { color: #1d4ed8; font-size: 18px; flex: 0 0 auto; }
      .faq-answer { padding: 0 14px 14px; color: #334155; font-size: 14px; line-height: 1.6; }
      .faq-answer[hidden] { display: none; }
    `;
    document.head.appendChild(style);
  }

  function addFaqToToc() {
    const tocLinks = document.querySelector(".toc-links");
    if (!tocLinks || document.getElementById("tocFaqLink")) return;
    const link = document.createElement("a");
    link.id = "tocFaqLink";
    link.href = "#faq-section";
    link.textContent = "FAQ";
    tocLinks.appendChild(link);
  }

  function addFaqSection() {
    if (document.getElementById("faq-section")) return;
    const agreement = document.getElementById("payment-agreement-section") || document.getElementById("agreementCard");
    const anchor = agreement || document.querySelector(".page > section:last-of-type") || document.querySelector(".page");
    if (!anchor) return;

    const section = document.createElement("section");
    section.id = "faq-section";
    section.className = "card faq-card";
    section.innerHTML = `
      <h2>Frequently Asked Questions</h2>
      <p class="faq-intro">Quick answers about enrollment, access, learning mode, exams, documents, and support.</p>
      <div class="faq-list">
        ${FAQS.map((faq, index) => `
          <div class="faq-item">
            <button class="faq-question" type="button" aria-expanded="${index === 0 ? "true" : "false"}" aria-controls="faq-answer-${index}">
              <span>${faq.question}</span>
              <span class="faq-icon">${index === 0 ? "−" : "+"}</span>
            </button>
            <div class="faq-answer" id="faq-answer-${index}" ${index === 0 ? "" : "hidden"}>${faq.answer}</div>
          </div>
        `).join("")}
      </div>
    `;
    anchor.insertAdjacentElement("afterend", section);

    section.querySelectorAll(".faq-question").forEach((button) => {
      button.addEventListener("click", () => {
        const answer = document.getElementById(button.getAttribute("aria-controls"));
        const icon = button.querySelector(".faq-icon");
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
        if (answer) answer.hidden = isOpen;
        if (icon) icon.textContent = isOpen ? "+" : "−";
      });
    });
  }

  function run() {
    injectStyles();
    addFaqToToc();
    addFaqSection();
  }

  window.addEventListener("load", run);
  [300, 900, 1600].forEach((delay) => setTimeout(run, delay));
})();
