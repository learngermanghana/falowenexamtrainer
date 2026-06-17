import React, { useMemo } from "react";
import SpeakingMindMap from "./speaking/SpeakingMindMap";
import { buildC1Day3SpeakingMindMap } from "../data/speakingMindMaps/pilotSpeakingMindMaps";

export default function C1Day3SpeakingMindMap({ lesson }) {
  const config = useMemo(
    () => buildC1Day3SpeakingMindMap(lesson),
    [lesson],
  );

  return <SpeakingMindMap config={config} />;
}
