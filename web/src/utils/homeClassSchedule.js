// Reuse the existing canonical class-timetable route. Never guess a class
// name when a learner is studying independently or is awaiting placement.
export const getHomeClassIdentity = (profile = {}) => ({
  className: String(profile?.className || profile?.classname || profile?.class || "").trim(),
  classId: String(
    profile?.classId || profile?.classRecordId || profile?.assignedClassId || ""
  ).trim(),
});

export const buildFullClassScheduleUrl = ({ className = "", classId = "" } = {}) => {
  const name = String(className || "").trim();
  const id = String(classId || "").trim();
  if (!name && !id) return "";
  const params = new URLSearchParams();
  if (id) params.set("classId", id);
  const query = params.toString();
  return `/campus/course/full-class-calendar/${encodeURIComponent(name || "class")}${query ? `?${query}` : ""}`;
};
