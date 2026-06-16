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

const slugify = (value) =>
  String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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
  control.dispatchEvent(new Event(control.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
};

const findLevelSelect = (form) =>
  Array.from(form?.querySelectorAll("select") || []).find((select) =>
    ["A1", "A2", "B1"].every((value) => Array.from(select.options).some((option) => option.value === value))
  );

const readFormDraft = (form) => ({
  name: form.querySelector('[autocomplete="name"]')?.value || "",
  email: form.querySelector('[autocomplete="email"]')?.value || "",
  phone: form.querySelector('[autocomplete="tel"]')?.value || "",
  address: form.querySelector('[autocomplete="street-address"]')?.value || "",
  location: form.querySelector('[autocomplete="address-level2"]')?.value || "",
  learningMode: Array.from(form.querySelectorAll("select")).find((select) => Array.from(select.options).some((option) => option.value === "Hybrid"))?.value || "",
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
  setControlValue(form.querySelector('[autocomplete="tel-national"]'), draft.emergencyContactPhone);
  setControlValue(findLevelSelect(form), draft.level);
  setControlValue(form.querySelector("#class-selection"), draft.className);
  setControlValue(form.querySelector("#initial-payment-amount"), draft.paymentOption);
  const mode = Array.from(form.querySelectorAll("select")).find((select) => Array.from(select.options).some((option) => option.value === "Hybrid"));
  setControlValue(mode, draft.learningMode);
};

const classNameFromQuery = () => {
  const requested = new URLSearchParams(window.location.search).get("class");
  if (!requested) return "";
  const token = slugify(requested);
  return Object.keys(classCatalog).find((name) => {
    const details = classCatalog[name] || {};
    return slugify(name) === token || slugify(details.slug) === token;
  }) || "";
};

const ResumePanel = ({ draft }) => {
  const context = useMemo(() => getPublicFunnelContext(), []);
  const message = encodeURIComponent(
    `Hello Falowen, I started an application but have not finished it.${draft?.name ? ` My name is ${draft.name}.` : ""}${draft?.level ? ` Level: ${draft.level}.` : ""}${draft?.className ? ` Class: ${draft.className}.` : ""}${context.video ? ` I came from YouTube lesson ${context.video}.` : ""} Please help me continue.`
  );

  return (
    <aside style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 14, padding: 14, display: "grid", gap: 8, marginBottom: 12 }}>
      <strong>Continue your application</strong>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.55 }}>Your non-password details are saved on this device. Continue below or ask us to help you finish.</p>
      <a href={`https://wa.me/233205706589?text=${message}`} target="_blank" rel="noopener noreferrer" onClick={() => trackPublicFunnelEvent("incomplete_application_whatsapp_click", { level: draft?.level || context.level || "" })} style={{ width: "fit-content", padding: "9px 12px", borderRadius: 10, background: "#16a34a", color: "#fff", textDecoration: "none", fontWeight: 900 }}>Continue on WhatsApp</a>
    </aside>
  );
};

export default function SignUpPage(props) {
  const rootRef = useRef(null);
  const restoredRef = useRef(false);
  const createdRef = useRef(false);
  const [mount, setMount] = useState(null);
  const [draft, setDraft] = useState(() => (typeof window === "undefined" ? null : readDraft()));

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const level = params.get("level")?.toUpperCase();
    const selectedClass = classNameFromQuery();
    if (["A1", "A2", "B1", "B2", "C1"].includes(level)) window.localStorage.setItem("exam-coach-level", level);
    if (selectedClass) window.localStorage.setItem("exam-coach-class", selectedClass);
    rememberPublicFunnelContext({ level: level || undefined, class: selectedClass || undefined, lastStage: "application" });
  }

  useEffect(() => {
    trackPublicFunnelEvent("application_view");
    const root = rootRef.current;
    if (!root) return undefined;

    const sync = () => {
      const form = root.querySelector("form");
      if (!form) return;

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

    const handleChange = (event) => {
      const form = event.target?.closest?.("form");
      if (!form || !root.contains(form)) return;
      const next = readFormDraft(form);
      writeDraft(next);
      setDraft(next);
    };

    const handleSubmit = (event) => {
      const form = event.target;
      if (!form || !root.contains(form)) return;
      const next = readFormDraft(form);
      writeDraft(next);
      setDraft(next);
      const context = getPublicFunnelContext();
      trackPublicFunnelEvent("application_submit", { level: next.level, className: next.className });
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

    root.addEventListener("input", handleChange, true);
    root.addEventListener("change", handleChange, true);
    root.addEventListener("submit", handleSubmit, true);

    return () => {
      observer.disconnect();
      root.removeEventListener("input", handleChange, true);
      root.removeEventListener("change", handleChange, true);
      root.removeEventListener("submit", handleSubmit, true);
      document.getElementById(MOUNT_ID)?.remove();
    };
  }, []);

  return (
    <div ref={rootRef}>
      <SignUpPageLegacy {...props} />
      {mount && draft ? createPortal(<ResumePanel draft={draft} />, mount) : null}
    </div>
  );
}
