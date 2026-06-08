import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SUCCESS_ID = "falowen-submit-success-screen";

const looksLikeSubmissionSuccess = (text = "") => {
  const clean = String(text || "").toLowerCase();
  return clean.includes("submission is saved") || clean.includes("submission saved") || clean.includes("your submission is saved");
};

const insertSuccessScreen = () => {
  if (typeof document === "undefined") return;
  if (!String(window.location.pathname || "").includes("/campus/submit")) return;

  const existing = document.getElementById(SUCCESS_ID);
  const pageText = document.body?.innerText || "";

  if (!looksLikeSubmissionSuccess(pageText)) {
    existing?.remove();
    return;
  }

  if (existing) return;

  const target = Array.from(document.querySelectorAll("form, section, div")).find((node) =>
    looksLikeSubmissionSuccess(node.innerText || "")
  );
  if (!target?.parentElement) return;

  const screen = document.createElement("section");
  screen.id = SUCCESS_ID;
  screen.setAttribute("role", "status");
  screen.setAttribute("aria-live", "polite");
  screen.className = "submit-success-screen";
  screen.innerHTML = `
    <div class="submit-success-screen__icon">✅</div>
    <div class="submit-success-screen__body">
      <h2>Assignment submitted successfully</h2>
      <p>Your tutor can now review your work. You will receive a notification when feedback is ready.</p>
      <div class="submit-success-screen__actions">
        <a href="/campus/course">Back to Course Book</a>
        <a href="/campus/results">View Results</a>
      </div>
    </div>
  `;

  target.parentElement.insertBefore(screen, target);
};

const SubmitSuccessScreenInjector = () => {
  const location = useLocation();

  useEffect(() => {
    if (!String(location.pathname || "").includes("/campus/submit")) {
      document.getElementById(SUCCESS_ID)?.remove();
      return undefined;
    }

    let timeoutId = null;
    const scheduleUpdate = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(insertSuccessScreen, 120);
    };

    scheduleUpdate();
    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      observer.disconnect();
      document.getElementById(SUCCESS_ID)?.remove();
    };
  }, [location.pathname]);

  return null;
};

export default SubmitSuccessScreenInjector;
