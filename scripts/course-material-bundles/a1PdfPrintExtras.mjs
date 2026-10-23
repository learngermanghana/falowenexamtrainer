// This function runs inside Playwright's page.evaluate after the lesson's
// required content has hydrated. It only changes the print page, not Falowen.
export const prepareA1PrintDocument = ({ lessonUrl, qrDataUrl }) => {
  const root = document.querySelector("main") || document.body;
  const hide = (element) => element?.style?.setProperty("display", "none", "important");
  const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();

  // Avoid black rectangles where embedded videos normally play.
  root.querySelectorAll(
    '[data-a1-workbook-media], [data-a1-workbook-video-header], [data-a1-grammar-video] [data-a1-workbook-media]'
  ).forEach(hide);

  for (const element of root.querySelectorAll("span,p,strong,small,button,a,h2,h3")) {
    if (element.children.length) continue;
    const text = normalize(element.textContent);
    if (/^(?:Assignment draft\s*[·•-]\s*Not submitted|Draft saved on this device\.?|Draft saves automatically on this device\.?|Saving draft…|0 of \d+ answered\s*[·•-].*|Writing still required|Open Review & Submit.*|Review & Submit Assignment)$/i.test(text)
      || /^Work here is saved as a draft\./i.test(text)
      || /^Your tutor receives it only after/i.test(text)) {
      hide(element);
    }
  }
  for (const heading of root.querySelectorAll("h1,h2,h3,h4,strong")) {
    if (normalize(heading.textContent) !== "Ready for the next lesson?") continue;
    let candidate = heading.parentElement;
    for (let depth = 0; depth < 4 && candidate; depth++, candidate = candidate.parentElement) {
      if (normalize(candidate.textContent).length > 500) break;
      if (/Previous lesson|Next lesson/.test(candidate.textContent || "")) {
        hide(candidate);
        break;
      }
    }
  }

  // Never expose a transient signed Cloudflare R2 audio URL in a PDF.
  // Link to the authenticated course lesson; it is a companion-study QR,
  // not a public audio purchase or permanently accessible media URL.
  const audios = [...root.querySelectorAll("audio")];
  for (const [index, audio] of audios.entries()) {
    const wrapper = audio.parentElement || root;
    if (!wrapper.querySelector('[data-a1-pdf-audio-companion]')) {
      const callout = document.createElement("aside");
      callout.setAttribute("data-a1-pdf-audio-companion", String(index + 1));
      callout.style.cssText = "display:flex;align-items:center;gap:12px;border:1px solid #cbd5e1;border-radius:8px;padding:12px;margin:10px 0;background:#eff6ff;color:#17324d;break-inside:avoid";
      const qr = document.createElement("img");
      qr.src = qrDataUrl;
      qr.alt = "QR code linking to the Falowen listening exercise";
      qr.style.cssText = "height:86px;width:86px;object-fit:contain;background:#fff";
      const details = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = "Hören: Audio im Falowen Course Book";
      const description = document.createElement("p");
      description.textContent = "Scan the QR code to play the listening task. Falowen sign-in is required.";
      description.style.cssText = "font-size:12px;margin:4px 0";
      const urlLine = document.createElement("a");
      urlLine.href = lessonUrl;
      urlLine.textContent = lessonUrl;
      urlLine.style.cssText = "font-size:10px;overflow-wrap:anywhere";
      details.append(title, description, urlLine);
      callout.append(qr, details);
      audio.insertAdjacentElement("beforebegin", callout);
    }
    hide(audio);
  }

  // This asynchronous audio status is meaningless in a paper workbook.
  for (const node of root.querySelectorAll("[role=status],span,p,div")) {
    if (node.children.length) continue;
    if (/^Audio wird geladen\s*(?:…|\.{2,3})?$/i.test(normalize(node.textContent))) hide(node);
  }
};
