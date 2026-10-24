import React, { Suspense, lazy } from "react";

const LazyA2B1GrammarNotesContent = lazy(() =>
  import("./A2B1WorkbookGrammarNotesContent").then((module) => ({
    default: module.A2B1GrammarNotesTab,
  })),
);

export const A2B1GrammarNotesTab = ({ level, day }) => (
  <Suspense fallback={<p style={{ margin: 0 }}>Loading grammar notes…</p>}>
    <LazyA2B1GrammarNotesContent level={level} day={day} />
  </Suspense>
);
