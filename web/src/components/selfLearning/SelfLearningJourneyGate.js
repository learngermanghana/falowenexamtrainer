import React from "react";
import { BrowserRouter, useInRouterContext } from "react-router-dom";
import RadioFirstWorkbookGate from "../RadioFirstWorkbookGate";

const MATERIALS_PARAM = "materials";
const MATERIALS_DONE = "done";

// Keep these helpers temporarily so old bookmarked URLs and any callers that
// still carry ?materials=done remain harmless. The materials selector itself
// is no longer part of the self-learning journey.
export const hasCompletedSelfLearningMaterials = (search = "") => {
  try {
    return new URLSearchParams(search).get(MATERIALS_PARAM) === MATERIALS_DONE;
  } catch (_error) {
    return false;
  }
};

export const buildCompletedMaterialsSearch = (search = "") => {
  const params = new URLSearchParams(search || "");
  params.set(MATERIALS_PARAM, MATERIALS_DONE);
  const query = params.toString();
  return query ? `?${query}` : "";
};

// Compatibility export. Supporting videos now live inside the practice book,
// so this wrapper must never pause the learner on an intermediate selector.
export const SelfLearningMaterialsSelector = ({ children }) => children;

const SelfLearningJourneyContent = ({
  level,
  day,
  radio = null,
  children,
}) => {
  if (!radio) return children;

  return (
    <RadioFirstWorkbookGate level={level} day={day} resource={radio}>
      {children}
    </RadioFirstWorkbookGate>
  );
};

const SelfLearningJourneyGate = (props) => {
  const inRouterContext = useInRouterContext();

  if (inRouterContext) {
    return <SelfLearningJourneyContent {...props} />;
  }

  return (
    <BrowserRouter>
      <SelfLearningJourneyContent {...props} />
    </BrowserRouter>
  );
};

export default SelfLearningJourneyGate;
