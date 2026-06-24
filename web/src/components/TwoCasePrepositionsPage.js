import React from "react";
import { useLocation } from "react-router-dom";
import A1Day18Kapitel121WorkbookPage from "./A1Day18Kapitel121WorkbookPage";
import TwoCasePrepositionsPageLegacy from "./TwoCasePrepositionsPageLegacy";

const hasWorkbookView = (location) => {
  const routerSearch = String(location?.search || "");
  const browserSearch = typeof window !== "undefined" ? String(window.location?.search || "") : "";
  const routerView = new URLSearchParams(routerSearch).get("view");
  const browserView = new URLSearchParams(browserSearch).get("view");
  const stateView = String(location?.state?.view || location?.state?.resourceView || "").toLowerCase();

  return routerView === "workbook" || browserView === "workbook" || stateView === "workbook";
};

const TwoCasePrepositionsPage = () => {
  const location = useLocation();

  if (hasWorkbookView(location)) {
    return <A1Day18Kapitel121WorkbookPage />;
  }

  return <TwoCasePrepositionsPageLegacy />;
};

export default TwoCasePrepositionsPage;

export const __TESTING__ = { hasWorkbookView };
