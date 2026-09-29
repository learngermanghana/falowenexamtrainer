(function () {
  const DEFAULT_POLICY = {
    courseDurationWeeks: 10,
    fullPaymentAccessMonths: 6,
    installmentAccessMonths: 1,
    extensionGhsPerMonth: 1000,
    learningModes: ["In person", "Online", "Recorded lessons"],
    certificateType: "Certificate of Completion",
    officialCertificateNote:
      "Falowen completion certificates do not replace Goethe-Institut or another recognized official language certificate when an official certificate is required.",
  };

  function getPolicy() {
    return { ...DEFAULT_POLICY, ...(window.FalowenClassBrochureData?.coursePolicy || {}) };
  }

  function getFaqs() {
    const policy = getPolicy();
    const modes = (policy.learningModes || DEFAULT_POLICY.learningModes).join(", ");
    return [
      {
        question: "How do I enroll and get access to Falowen?",
        answer:
          "Go to www.falowen.app, click Sign up and create an account. Then open Upcoming Classes, choose your class, and pay. After payment, your learning access is activated and the class appears in Campus.",
      },
      {
        question: "What learning modes are available and how long is the course?",
        answer:
          `Available learning modes are ${modes}. The taught course is approximately ${policy.courseDurationWeeks} weeks. Full payment gives ${policy.fullPaymentAccessMonths} months of Falowen access from enrollment, while the starter installment gives ${policy.installmentAccessMonths} month of access until the balance is due.`,
      },
      {
        question: "Can I continue learning to B1 or B2 if I did not write the A1 or A2 exam?",
        answer:
          "Yes. You can keep learning until you reach the level you need for your goal. You do not have to stop learning because you have not written an earlier official exam yet.",
      },
      {
        question: "Do I receive a certificate upon completion?",
        answer:
          `Yes. Falowen awards a ${policy.certificateType} when you successfully complete the course and required assignments.`,
      },
      {
        question: "Does the Falowen certificate replace a Goethe certificate?",
        answer: policy.officialCertificateNote,
      },
      {
        question: "What happens after my Falowen access period ends?",
        answer:
          `After ${policy.fullPaymentAccessMonths} months, you can extend access at GHS ${Number(policy.extensionGhsPerMonth || 0).toLocaleString("en-GH")} per month or enroll in a new class at the current fee.`,
      },
      {
        question: "Where can I download my receipts, letter of enrollment, results, and attendance?",
        answer:
          "All official documents are available in your account under My Results & Resources. Please download and keep your own copies.",
      },
      {
        question: "How will I receive my assignment results?",
        answer:
          "You will receive an email for each assignment. Your marked work and feedback are also available in Falowen.",
      },
      {
        question: "Do I get weekly progress summaries?",
        answer:
          "Yes. Falowen sends weekly progress summaries with your learning activity and performance information.",
      },
      {
        question: "What if I have payment or access issues?",
        answer:
          "Please check your email, including spam or junk, and your Falowen account. If the issue continues, contact info@falowen.app or use the WhatsApp link on this page.",
      },
    ];
  }

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
    const existing = document.getElementById("faq-section");
    if (existing) existing.remove();
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
        ${getFaqs().map((faq, index) => `
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
  window.addEventListener("falowen:brochure-rendered", run);
  [300, 900, 1600].forEach((delay) => setTimeout(run, delay));
})();
