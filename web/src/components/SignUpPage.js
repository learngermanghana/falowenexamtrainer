import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SignUpPageLegacy from "./SignUpPageLegacy";
import { classCatalog } from "../data/classCatalog";
import {
  followUpIso,
  getPublicFunnelContext,
  rememberPublicFunnelContext,
  submitPublicLead,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";

const DRAFT_KEY = "falowen:public-application-draft";
const MOUNT_ID = "falowen-application-resume-panel";

const MOBILE_INPUT_CSS = `
  .signup-page-mobile-safe input:not([type="checkbox"]):not([type="radio"]),
  .signup-page-mobile-safe textarea,
  .signup-page-mobile-safe select {
    color: #111827 !important;
    -webkit-text-fill-color: #111827 !important;
    caret-color: #111827 !important;
    background-color: #ffffff !important;
    opacity: 1 !important;
    font-size: 16px !important;
    line-height: 1.35 !important;
  }

  .signup-page-mobile-safe input:not([type="checkbox"]):not([type="radio"]),
  .signup-page-mobile-safe textarea {
    -webkit-user-select: text !important;
    user-select: text !important;
  }

  .signup-page-mobile-safe select {
    min-height: 48px !important;
  }

  .signup-page-mobile-safe input:not([type="checkbox"]):not([type="radio"])::placeholder,
  .signup-page-mobile-safe textarea::placeholder {
    color: #6b7280 !important;
    -webkit-text-fill-color: #6b7280 !important;
    opacity: 1 !important;
  }

  .signup-page-mobile-safe input:-webkit-autofill,
  .signup-page-mobile-safe input:-webkit-autofill:hover,
  .signup-page-mobile-safe input:-webkit-autofill:focus {
    -webkit-text-fill-color: #111827 !important;
    caret-color: #111827 !important;
    box-shadow: 0 0 0 1000px #ffffff inset !important;
  }

  .signup-password-visibility {
    position: fixed;
    right: 14px;
    bottom: calc(14px + env(safe-area-inset-bottom));
    z-index: 40;
    border: 1px solid #bfdbfe;
    border-radius: 999px;
    background: #ffffff;
    color: #1d4ed8;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    touch-action: manipulation;
  }

  .signup-password-visibility:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.28);
    outline-offset: 2px;
  }
`;

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const readDraft = () => {
  try {
    return JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "null");
  } catch (_error) {
    return null;
  }
};

const writeDraft = (value) => {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(value));
  } catch (_error) {}
};

const setControlValue = (control, value) => {
  if (!control || value === undefined || value === null || value === "") return;
  const prototype = Object.getPrototypeOf(control);
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  if (setter) setter.call(control, value);
  else control.value = value;
  control.dispatchEvent(
    new Event(control.tagName === "SELECT" ? "change" : "input", { bubbles: true })
  );
};

const setAttributes = (element, attributes = {}) => {
  if (!element) return;
  Object.entries(attributes).forEach(([name, value]) => {
    if (value === undefined || value === null) return;
    element.setAttribute(name, String(value));
  });
};

const applyMobileFieldEnhancements = (form, { showPasswords = false } = {}) => {
  if (!form) return;
  form.setAttribute("autocomplete", "on");

  const nameInput = form.querySelector('[autocomplete="name"]');
  setAttributes(nameInput, {
    name: "fullName",
    inputmode: "text",
    autocapitalize: "words",
    enterkeyhint: "next",
  });

  const emailInput = form.querySelector('[autocomplete="email"]');
  setAttributes(emailInput, {
    name: "email",
    inputmode: "email",
    autocapitalize: "none",
    autocorrect: "off",
    spellcheck: "false",
    enterkeyhint: "next",
  });

  const passwordInputs = Array.from(
    form.querySelectorAll('input[autocomplete="new-password"]')
  );
  passwordInputs.forEach((input, index) => {
    input.type = showPasswords ? "text" : "password";
    setAttributes(input, {
      name: index === 0 ? "password" : "confirmPassword",
      autocapitalize: "none",
      autocorrect: "off",
      spellcheck: "false",
      enterkeyhint: "next",
    });
  });

  const phoneInput = form.querySelector('[autocomplete="tel"]');
  setAttributes(phoneInput, {
    name: "phone",
    inputmode: "tel",
    enterkeyhint: "next",
  });
  if (phoneInput && /^0176\b/.test(phoneInput.placeholder || "")) {
    phoneInput.placeholder = "024 123 4567 or +233 24 123 4567";
  }

  const addressInput = form.querySelector('[autocomplete="street-address"]');
  setAttributes(addressInput, {
    name: "address",
    autocapitalize: "words",
  });

  const locationInput = form.querySelector('[autocomplete="address-level2"]');
  setAttributes(locationInput, {
    name: "location",
    inputmode: "text",
    autocapitalize: "words",
    enterkeyhint: "next",
  });

  const emergencyInput = form.querySelector('[autocomplete="tel-national"]');
  setAttributes(emergencyInput, {
    name: "emergencyContactPhone",
    inputmode: "tel",
    enterkeyhint: "next",
  });
  if (emergencyInput && /^0176\b/.test(emergencyInput.placeholder || "")) {
    emergencyInput.placeholder = "024 987 6543 or +233 24 987 6543";
  }
};

const findLevelSelect = (form) =>
  Array.from(form?.querySelectorAll("select") || []).find((select) =>
    ["A1", "A2", "B1"].every((value) =>
      Array.from(select.options).some((option) => option.value === value)
    )
  );

const readFormDraft = (form) => ({
  name: form.querySelector('[autocomplete="name"]')?.value || "",
  email: form.querySelector('[autocomplete="email"]')?.value || "",
  phone: form.querySelector('[autocomplete="tel"]')?.value || "",
  address: form.querySelector('[autocomplete="street-address"]')?.value || "",
  location: form.querySelector('[autocomplete="address-level2"]')?.value || "",
  learningMode:
    Array.from(form.querySelectorAll("select")).find((select) =>
      Array.from(select.options).some((option) => option.value === "Hybrid")
    )?.value || "",
  emergencyContactPhone: form.querySelector('[autocomplete="tel-national"]')?.value || "",
  level: findLevelSelect(form)?.value || "",
  className: form.querySelector("#class-selection")?.value || "",
  paymentOption: form.querySelector("#initial-payment-amount")?.value || "",
  updatedAt: new Date().toISOString(),
});

const restoreDraft = (form, draft) => {
  if (!draft) return;
  setControlValue(form.querySelector('[autocomplete="name"]'), draft.name);
  setControlValue(form.querySelector('[autocomplete="email"]'), draft.email);
  setControlValue(form.querySelector('[autocomplete="tel"]'), draft.phone);
  setControlValue(form.querySelector('[autocomplete="street-address"]'), draft.address);
  setControlValue(form.querySelector('[autocomplete="address-level2"]'), draft.location);
  setControlValue(
    form.querySelector('[autocomplete="tel-national"]'),
    draft.emergencyContactPhone
  );
  setControlValue(findLevelSelect(form), draft.level);
  setControlValue(form.querySelector("#class-selection"), draft.className);
  setControlValue(form.querySelector("#initial-payment-amount"), draft.paymentOption);
  const mode = Array.from(form.querySelectorAll("select")).find((select) =>
    Array.from(select.options).some((option) => option.value === "Hybrid")
  );
  setControlValue(mode, draft.learningMode);
};

const classNameFromQuery = () => {
  const requested = new URLSearchParams(window.location.search).get("class");
  if (!requested) return "";
  const token = slugify(requested);
  return (
    Object.keys(classCatalog).find((name) => {
      const details = classCatalog[name] || {};
      return slugify(name) === token || slugify(details.slug) === token;
    }) || ""
  );
};

const ResumePanel = ({ draft }) => {
  const context = useMemo(() => getPublicFunnelContext(), []);
  const message = encodeURIComponent(
    `Hello Falowen, I started an application but have not finished it.${
      draft?.name ? ` My name is ${draft.name}.` : ""
    }${draft?.level ? ` Level: ${draft.level}.` : ""}${
      draft?.className ? ` Class: ${draft.className}.` : ""
    }${context.video ? ` I came from YouTube lesson ${context.video}.` : ""} Please help me continue.`
  );

  return (
    <aside
      style={{
        border: "1px solid #bbf7d0",
        background: "#f0fdf4",
        borderRadius: 14,
        padding: 14,
        display: "grid",
        gap: 8,
        marginBottom: 12,
      }}
    >
      <strong>Continue your application</strong>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.55 }}>
        Your non-password details are saved on this device. Continue below or ask us to help you finish.
      </p>
      <a
        href={`https://wa.me/233205706589?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackPublicFunnelEvent("incomplete_application_whatsapp_click", {
            level: draft?.level || context.level || "",
          })
        }
        style={{
          width: "fit-content",
          padding: "9px 12px",
          borderRadius: 10,
          background: "#16a34a",
          color: "#fff",
          textDecoration: "none",
          fontWeight: 900,
        }}
      >
        Continue on WhatsApp
      </a>
    </aside>
  );
};

export default function SignUpPage(props) {
  const rootRef = useRef(null);
  const restoredRef = useRef(false);
  const createdRef = useRef(false);
  const showPasswordsRef = useRef(false);
  const [mount, setMount] = useState(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordFieldActive, setPasswordFieldActive] = useState(false);
  const [draft, setDraft] = useState(() =>
    typeof window === "undefined" ? null : readDraft()
  );

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const level = params.get("level")?.toUpperCase();
    const selectedClass = classNameFromQuery();
    if (["A1", "A2", "B1", "B2", "C1"].includes(level)) {
      window.localStorage.setItem("exam-coach-level", level);
    }
    if (selectedClass) window.localStorage.setItem("exam-coach-class", selectedClass);
    rememberPublicFunnelContext({
      level: level || undefined,
      class: selectedClass || undefined,
      lastStage: "application",
    });
  }

  useEffect(() => {
    trackPublicFunnelEvent("application_view");
    const root = rootRef.current;
    if (!root) return undefined;

    let draftSaveTimer = null;
    let focusTimer = null;

    const sync = () => {
      const form = root.querySelector("form");
      if (!form) return;

      applyMobileFieldEnhancements(form, {
        showPasswords: showPasswordsRef.current,
      });

      let target = document.getElementById(MOUNT_ID);
      if (!target) {
        target = document.createElement("div");
        target.id = MOUNT_ID;
        form.insertAdjacentElement("beforebegin", target);
      }
      setMount((current) => (current === target ? current : target));

      if (!restoredRef.current) {
        restoredRef.current = true;
        const saved = readDraft();
        restoreDraft(form, saved);
        const params = new URLSearchParams(window.location.search);
        setControlValue(findLevelSelect(form), params.get("level")?.toUpperCase());
        setControlValue(form.querySelector("#class-selection"), classNameFromQuery());
      }
    };

    sync();
    const observer = new MutationObserver(() => {
      sync();
      const text = String(root.textContent || "");
      if (!createdRef.current && text.includes("Account created!")) {
        createdRef.current = true;
        window.localStorage.removeItem(DRAFT_KEY);
        setDraft(null);
        trackPublicFunnelEvent("account_created");
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    const saveCurrentDraft = () => {
      const form = root.querySelector("form");
      if (!form) return;
      const next = readFormDraft(form);
      writeDraft(next);
      setDraft(next);
    };

    const queueDraftSave = (event) => {
      const form = event.target?.closest?.("form");
      if (!form || !root.contains(form)) return;

      window.clearTimeout(draftSaveTimer);
      draftSaveTimer = window.setTimeout(saveCurrentDraft, 180);
    };

    const handleSubmit = (event) => {
      const form = event.target;
      if (!form || !root.contains(form)) return;
      window.clearTimeout(draftSaveTimer);
      const next = readFormDraft(form);
      writeDraft(next);
      setDraft(next);
      const context = getPublicFunnelContext();
      trackPublicFunnelEvent("application_submit", {
        level: next.level,
        className: next.className,
      });
      submitPublicLead({
        id: `application_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        source: "public-application",
        status: "application_submitted",
        name: next.name,
        email: next.email,
        phone: next.phone,
        level: next.level,
        className: next.className,
        classSlug: slugify(next.className),
        learningMode: next.learningMode,
        paymentStatus: "pending",
        followUpCount: 0,
        nextFollowUpAt: followUpIso(24),
        attribution: context,
      }).catch(() => {});
    };

    const isPasswordInput = (element) =>
      element?.matches?.('input[autocomplete="new-password"]');

    const handleFocusIn = (event) => {
      if (isPasswordInput(event.target)) {
        window.clearTimeout(focusTimer);
        setPasswordFieldActive(true);
      }
    };

    const handleFocusOut = () => {
      window.clearTimeout(focusTimer);
      focusTimer = window.setTimeout(() => {
        setPasswordFieldActive(isPasswordInput(document.activeElement));
      }, 80);
    };

    // Do not update React parent state during the native input event. On mobile,
    // doing so can reset controlled fields before the keyboard composition finishes.
    root.addEventListener("input", queueDraftSave);
    root.addEventListener("change", queueDraftSave);
    root.addEventListener("submit", handleSubmit, true);
    root.addEventListener("focusin", handleFocusIn);
    root.addEventListener("focusout", handleFocusOut);

    return () => {
      observer.disconnect();
      window.clearTimeout(draftSaveTimer);
      window.clearTimeout(focusTimer);
      root.removeEventListener("input", queueDraftSave);
      root.removeEventListener("change", queueDraftSave);
      root.removeEventListener("submit", handleSubmit, true);
      root.removeEventListener("focusin", handleFocusIn);
      root.removeEventListener("focusout", handleFocusOut);
      document.getElementById(MOUNT_ID)?.remove();
    };
  }, []);

  const togglePasswordVisibility = () => {
    const next = !showPasswordsRef.current;
    showPasswordsRef.current = next;
    setShowPasswords(next);
    applyMobileFieldEnhancements(rootRef.current?.querySelector("form"), {
      showPasswords: next,
    });
  };

  return (
    <div ref={rootRef} className="signup-page-mobile-safe">
      <style>{MOBILE_INPUT_CSS}</style>
      <SignUpPageLegacy {...props} />
      {mount && draft ? createPortal(<ResumePanel draft={draft} />, mount) : null}
      {passwordFieldActive ? (
        <button
          type="button"
          className="signup-password-visibility"
          aria-pressed={showPasswords}
          onPointerDown={(event) => event.preventDefault()}
          onClick={togglePasswordVisibility}
        >
          {showPasswords ? "Hide passwords" : "Show passwords"}
        </button>
      ) : null}
    </div>
  );
}
