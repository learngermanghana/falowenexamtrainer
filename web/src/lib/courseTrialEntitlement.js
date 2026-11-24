import React from "react";
import { getBackendUrl } from "../services/backendUrl";

// A verified server decision may further restrict the local trial. Unknown
// legacy records and older deployments retain their existing local behavior;
// this adapter never upgrades or creates a course entitlement.
export function restrictTrialWithServer(trial, snapshot) {
  if (!trial || !snapshot?.course) return trial;
  const serverCourse = snapshot.course;
  if (serverCourse.day1 === false) return { ...trial, active: false };
  if (serverCourse.trial && Number.isFinite(serverCourse.endsAtMs)) {
    return { ...trial, endsAtMs: Number.isFinite(trial.endsAtMs)
      ? Math.min(trial.endsAtMs, serverCourse.endsAtMs) : serverCourse.endsAtMs };
  }
  return trial;
}

export function useCourseTrialEntitlement(user, enabled, trialEnd) {
  const [state, setState] = React.useState(null);
  React.useEffect(() => {
    if (!enabled || !user) { setState(null); return undefined; }
    let cancelled = false;
    setState(null);
    user.getIdToken()
      .then(token => fetch(`${getBackendUrl()}/mock/access`, { headers: { Authorization: `Bearer ${token}` } }))
      .then(response => response.ok ? response.json() : null)
      .then(data => { if (!cancelled) setState({ uid: user.uid, snapshot: data?.entitlements || null }); })
      .catch(() => { if (!cancelled) setState(null); });
    return () => { cancelled = true; };
  }, [user, enabled, trialEnd]);
  return state?.uid === user?.uid ? state.snapshot : null;
}
