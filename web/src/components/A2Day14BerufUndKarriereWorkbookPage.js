import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import A2Day14QuickLearnSpeaking from "./A2Day14QuickLearnSpeaking";

const A2Day14BerufUndKarriereWorkbookPage = () => (
  <A2StandardTabbedWorkbookPage
    day={14}
    chapter="5.14"
    title="Beruf und Karriere"
    workbookId="A2Day14BerufUndKarriere"
    topicPrompt="Beruf und Karriere"
    sprechenContent={<A2Day14QuickLearnSpeaking />}
    mindMapOnlySpeaking
  />
);

export default A2Day14BerufUndKarriereWorkbookPage;
