import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PlacementTestPageLegacy from "./PlacementTestPageLegacy";
import PlacementFunnelNextStep from "./PlacementFunnelNextStep";
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
  const level = text.match(/Suggested level:\s*(A1|A2|B1|B2)/i)?.[1]?.toUpperCase() || "A1";
  const score = text.match(/Score:\s*(\d+)\s*\/\s*(\d+)/i);
  return {
    section,
    level,
    correct: Number(score?.[1] || 0),
    total: Number(score?.[2] || 0),
  };
};

export default function PlacementTestPage() {
  const rootRef = useRef(null);
  const trackedRef = useRef("");
  const [mount, setMount] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const context = rememberPublicFunnelContext({ lastStage: "placement_test" });
    trackPublicFunnelEvent("placement_test_view", {
      source: context.source || context.src || "direct",
    });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const sync = () => {
      const parsed = readResult(root);
      if (!parsed) return;

      let target = document.getElementById(MOUNT_ID);
      if (!target) {
        target = document.createElement("div");
        target.id = MOUNT_ID;
        parsed.section.insertAdjacentElement("afterend", target);
      }

      setMount((current) => (current === target ? current : target));
      setResult({ level: parsed.level, correct: parsed.correct, total: parsed.total });

      const key = `${parsed.level}:${parsed.correct}:${parsed.total}`;
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
  }, []);

  return (
    <div ref={rootRef}>
      <PlacementTestPageLegacy />
      {mount && result ? createPortal(<PlacementFunnelNextStep result={result} />, mount) : null}
    </div>
  );
}
