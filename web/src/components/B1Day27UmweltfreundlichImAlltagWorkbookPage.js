import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { B1_DAY27_UMWELTFREUNDLICH_ALLTAG_WORKBOOK_CONFIG } from "./B1Day27UmweltfreundlichAlltagWorkbookPage";

// Keep the alternate course route aligned with the one authoritative Day 27 task.
export default function B1Day27UmweltfreundlichImAlltagWorkbookPage() {
  return <B1StandardWorkbookPage config={B1_DAY27_UMWELTFREUNDLICH_ALLTAG_WORKBOOK_CONFIG} />;
}
