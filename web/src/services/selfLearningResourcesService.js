const RESOURCE_MAP = {};

export const fetchSelfLearningResources = async (level) => {
  const resources = RESOURCE_MAP[level];
  if (!resources) {
    throw new Error("Resources not available for this level.");
  }
  return resources;
};
