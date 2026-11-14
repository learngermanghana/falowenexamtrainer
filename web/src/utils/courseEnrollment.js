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
