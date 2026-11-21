import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import PlacementTestPage2026 from "./PlacementTestPage2026";
import PlacementFunnelNextStep from "./PlacementFunnelNextStep";
import "./PlacementTestPage.css";
import {
  rememberPublicFunnelContext,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";

const MOUNT_ID = "falowen-placement-funnel-next-step";

const readResult = (root) => {
  const section = Array.from(root?.querySelectorAll("section") || []).find((node) =>
    String(node.textContent || "").includes("Suggested level:")
  );
  if (!section) return null;

  const text = String(section.textContent || "").replace(/\s+/g, " ");
  const level = text.match(/Suggested level:\s*(A1|A2|B1|B2|C1)/i)?.[1]?.toUpperCase() || "A1";
  const score = text.match(/Score:\s*(\d+)\s*\/\s*(\d+)/i);
  return {
    section,
    language: section.dataset.placementLanguage === "swahili" ? "swahili" : "german",
    registered: section.dataset.placementRegistered === "true",
    level,
    attemptId: section.dataset.placementAttemptId || "",
    a1: Number(section.dataset.placementA1 || 0),
    a2: Number(section.dataset.placementA2 || 0),
    b1: Number(section.dataset.placementB1 || 0),
    correct: Number(score?.[1] || 0),
    total: Number(score?.[2] || 0),
  };
};

export default function PlacementTestPage() {
  const location = useLocation();
  const language = new URLSearchParams(location.search).get("language") === "swahili" ? "swahili" : "german";
  const rootRef = useRef(null);
  const trackedRef = useRef("");
  const [mount, setMount] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const context = rememberPublicFunnelContext({ lastStage: "placement_test" });
    trackPublicFunnelEvent("placement_test_view", {
      source: context.source || context.src || "direct",
    });
  }, [language]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const sync = () => {
      const parsed = readResult(root);
      if (!parsed) {
        document.getElementById(MOUNT_ID)?.remove();
        setMount(null);
        setResult(null);
        return;
      }

      let target = document.getElementById(MOUNT_ID);
      if (!target) {
        target = document.createElement("div");
        target.id = MOUNT_ID;
        parsed.section.insertAdjacentElement("afterend", target);
      }

      setMount((current) => (current === target ? current : target));
      setResult((current) =>
        current?.level === parsed.level &&
        current?.correct === parsed.correct &&
        current?.total === parsed.total &&
        current?.attemptId === parsed.attemptId &&
        current?.language === parsed.language
          ? current
          : { registered:parsed.registered, language:parsed.language, level: parsed.level, correct: parsed.correct, total: parsed.total, attemptId: parsed.attemptId, a1:parsed.a1, a2:parsed.a2, b1:parsed.b1 }
      );

      const key = parsed.attemptId;
      if (trackedRef.current !== key) {
        trackedRef.current = key;
        rememberPublicFunnelContext({ level: parsed.level, lastStage: "placement_complete" });
        trackPublicFunnelEvent("placement_result_view", {
          level: parsed.level,
          correct: parsed.correct,
          total: parsed.total,
        });
      }
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      document.getElementById(MOUNT_ID)?.remove();
    };
  }, [language]);

  return (
    <div ref={rootRef} className="falowen-placement-shell" data-placement-theme={language}>
      <header className="falowen-placement-top">
        <div className="falowen-placement-top-inner">
          <a className="falowen-placement-brand" href="/" aria-label="Falowen home">
            <span className="falowen-placement-brand-badge" aria-hidden="true">{language === "swahili" ? "SW" : "DE"}</span>
            <span className="falowen-placement-brand-copy">
              <span className="falowen-placement-brand-name">{language === "swahili" ? "Kiswahili" : "Deutsch"}</span>
              <span className="falowen-placement-brand-by">by Falowen</span>
            </span>
          </a>
          <span className="falowen-placement-header-label">{language === "swahili" ? "Kiswahili placement test" : "German placement test"}</span>
          <div className="falowen-placement-top-actions">
            <nav className="falowen-placement-language-nav" aria-label="Choose placement-test language">
              <a href="/placement-test" aria-current={language === "german" ? "page" : undefined}>German</a>
              <a href="/placement-test?language=swahili" aria-current={language === "swahili" ? "page" : undefined}>Kiswahili</a>
            </nav>
            <span className="falowen-placement-free">Free · No account required</span>
          </div>
        </div>
      </header>
      <PlacementTestPage2026 key={language} language={language} />
      {mount && result ? createPortal(<PlacementFunnelNextStep result={result} />, mount) : null}
    </div>
  );
}
