import React, { Suspense, lazy } from "react";
import { A2SecondStageGrammarUpgrade } from "./A2SecondStageLearningUpgrade";
import A2TopicCollocationPractice from "./A2TopicCollocationPractice";

const LazyA2B1GrammarNotesContent = lazy(() =>
  import("./A2B1WorkbookGrammarNotesContent").then((module) => ({
    default: module.A2B1GrammarNotesTab,
  })),
);

export const A2B1GrammarNotesTab = ({ level, day }) => {
  const normalizedLevel = String(level || "").toUpperCase();
  const numericDay = Number(day);
  const showA2Collocations = normalizedLevel === "A2" && numericDay >= 1 && numericDay <= 28;

  return (
    <>
      <Suspense fallback={<p style={{ margin: 0 }}>Loading grammar notes…</p>}>
        <LazyA2B1GrammarNotesContent level={level} day={day} />
      </Suspense>
      {normalizedLevel === "A2" ? <A2SecondStageGrammarUpgrade day={numericDay} /> : null}
      {showA2Collocations ? <A2TopicCollocationPractice day={numericDay} /> : null}
    </>
  );
};
