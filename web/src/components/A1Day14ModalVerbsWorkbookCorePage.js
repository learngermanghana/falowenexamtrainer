import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import A2Day17InDieApothekeModalverbenFragenGrammarPage from "./A2Day17InDieApothekeModalverbenFragenGrammarPage";
import A1Day14TravelHotelWorkbookPage from "./A1Day14TravelHotelWorkbookPage";

// The same legacy route also serves an A2 Day 17 grammar handoff.
// Never let the A1 workbook or its self-practice state overwrite that page.
export default function A1Day14ModalVerbsWorkbookCorePage() {
  const { search } = useLocation();
  const isA2Day17 = useMemo(() => {
    const query = new URLSearchParams(search || "");
    return String(query.get("level") || "").toUpperCase() === "A2"
      && Number(query.get("day") || 0) === 17;
  }, [search]);

  return isA2Day17
    ? <A2Day17InDieApothekeModalverbenFragenGrammarPage />
    : <A1Day14TravelHotelWorkbookPage />;
}
