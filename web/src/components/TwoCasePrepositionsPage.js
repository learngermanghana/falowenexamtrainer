import React from "react";
import { useLocation } from "react-router-dom";
import A1Day18Kapitel121WorkbookPage from "./A1Day18Kapitel121WorkbookPage";
import TwoCasePrepositionsPageLegacy from "./TwoCasePrepositionsPageLegacy";

const TwoCasePrepositionsPage = () => {
  const location = useLocation();
  const requestedView = new URLSearchParams(location.search || "").get("view");

  if (requestedView === "workbook") {
    return <A1Day18Kapitel121WorkbookPage />;
  }

  return <TwoCasePrepositionsPageLegacy />;
};

export default TwoCasePrepositionsPage;
