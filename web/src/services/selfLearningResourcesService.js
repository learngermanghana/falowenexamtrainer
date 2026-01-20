import b2Resources from "../data/selfLearningResources/b2Resources.json";
import c1Resources from "../data/selfLearningResources/c1Resources.json";

const RESOURCE_MAP = {
  B2: b2Resources,
  C1: c1Resources,
};

export const fetchSelfLearningResources = async (level) => {
  const resources = RESOURCE_MAP[level];
  if (!resources) {
    throw new Error("Resources not available for this level.");
  }
  return resources;
};
