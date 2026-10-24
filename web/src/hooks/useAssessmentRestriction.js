import { useLayoutEffect, useSyncExternalStore } from "react";
import { isAssessmentRestricted, registerAssessmentRestriction, subscribeAssessmentRestrictions } from "../utils/assessmentRestrictions";

export function useAssessmentRestriction(enabled = true) {
  useLayoutEffect(() => enabled ? registerAssessmentRestriction() : undefined, [enabled]);
}

export function useAssessmentRestricted(routeRestricted = false) {
  const mountedAssessment = useSyncExternalStore(subscribeAssessmentRestrictions, isAssessmentRestricted, () => false);
  return routeRestricted || mountedAssessment;
}
