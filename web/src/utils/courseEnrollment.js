const primaryCourse = profile => String(profile?.program || "german").toLowerCase();
export function enrolledCourses(profile) {
  const primary = primaryCourse(profile);
  const secondary = profile?.secondaryProgram;
  return secondary !== primary && ["german", "swahili"].includes(secondary) ? [primary, secondary] : [primary];
}

export function courseProfile(profile, requested) {
  if (!profile || requested === primaryCourse(profile) || !enrolledCourses(profile).includes(requested)) return profile;
  const placement = profile.coursePlacements?.[requested] || {};
  const view = { ...profile, program: requested };
  for (const field of ["classId", "classRecordId", "assignedClassId", "groupId", "cohortId", "className", "classname", "class", "group", "groupName", "cohort", "cohortName", "level", "levelId"]) {
    view[field] = placement[field] || "";
  }
  view.level = placement.level || "A1";
  return view;
}

const coursePreferenceKey = (uid) => `falowen:course:${uid}`;

// Interface language is stored separately. Course preferences are per Firebase
// user and validated against the student's current enrolled programmes.
export function readCoursePreference(uid, allowed = []) {
  if (!uid || typeof window === "undefined") return null;
  const key = coursePreferenceKey(uid);
  try {
    const selected = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
    return allowed.includes(selected) ? selected : null;
  } catch {
    return null;
  }
}

export function saveCoursePreference(uid, course, allowed = []) {
  if (!uid || !allowed.includes(course) || typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(coursePreferenceKey(uid), course);
    window.sessionStorage.removeItem(coursePreferenceKey(uid));
    return true;
  } catch {
    return false;
  }
}
