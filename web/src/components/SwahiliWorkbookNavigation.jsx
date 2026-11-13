import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useSwahiliWorkbookTab(tabs) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const requestedTab = params.get("view");
  const activeTab = tabs.some(({ key }) => key === requestedTab) ? requestedTab : "grammar";

  function selectTab(key) {
    params.set("view", key);
    navigate(
      { pathname: location.pathname, search: params.toString(), hash: location.hash },
      { replace: true, state: location.state }
    );
  }

  return [activeTab, selectTab];
}

export function SwahiliWorkbookNavigation({ tabs, activeTab, onChange }) {
  const navRef = useRef(null);
  const index = tabs.findIndex(({ key }) => key === activeTab);
  const previous = tabs[index - 1];
  const next = tabs[index + 1];

  function open(tab) {
    onChange(tab.key);
    const section = navRef.current?.closest("main")?.querySelector('[role="tabpanel"]');
    section?.scrollIntoView?.({ block: "start" });
    section?.focus({ preventScroll: true });
  }

  return (
    <nav ref={navRef} className="swahili-workbook-actions" aria-label="Workbook navigation">
      <button type="button" disabled={!previous} onClick={() => open(previous)}>← {previous?.label || "Previous"}</button>
      <button type="button" disabled={!next} onClick={() => open(next)}>{next ? next.label + " →" : "Next"}</button>
    </nav>
  );
}
