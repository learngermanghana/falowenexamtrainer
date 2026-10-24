import React, { useMemo } from "react";
import { getRouteSpeakingMindMap } from "../data/speakingMindMaps/routeMindMaps";
import SpeakingMindMap from "./SpeakingMindMap";

const currentPath = () => {
  if (typeof window === "undefined") return "";
  return String(window.location?.pathname || "").toLowerCase();
};

export default function RouteSpeakingMindMap() {
  const config = useMemo(() => getRouteSpeakingMindMap(currentPath()), []);
  return config ? <SpeakingMindMap config={config} /> : null;
}
