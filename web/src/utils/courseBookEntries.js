const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const TASK_SECTIONS = ["schreiben_sprechen", "lesen_hören"];

const normalizeToken = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "");

const getTaskChapter = (task = {}, entry = {}) =>
  String(task.chapter || task.displayChapter || entry.displayChapter || entry.chapter || "").trim();

const getTaskAssignmentId = (task = {}, entry = {}) =>
  task.assignmentId || task.assignment_id || task.assignmentKey || entry.assignmentId || entry.assignment_id || entry.assignmentKey || null;

const getTaskTitle = (task = {}, entry = {}) =>
  task.topic || task.title || task.assignmentTitle || entry.topic || entry.title || entry.assignmentTitle || `Day ${entry.day}`;

export const expandCourseBookEntry = (entry = {}) => {
  const tasks = TASK_SECTIONS.flatMap((section) =>
    toArray(entry?.[section]).filter(Boolean).map((task) => ({ section, task }))
  );

  if (tasks.length <= 1) return [entry];

  return tasks.map(({ section, task }, index) => {
    const chapter = getTaskChapter(task, entry);
    const assignmentId = getTaskAssignmentId(task, entry);
    const assignment = task.assignment === undefined ? Boolean(entry.assignment) : Boolean(task.assignment);

    return {
      ...entry,
      topic: getTaskTitle(task, entry),
      title: task.title || task.topic || entry.title,
      chapter,
      displayChapter: chapter,
      assignment,
      progressionEligible:
        task.progressionEligible === undefined ? entry.progressionEligible : task.progressionEligible,
      assignmentId,
      assignment_id: assignmentId,
      lesen_hören: section === "lesen_hören" ? task : undefined,
      schreiben_sprechen: section === "schreiben_sprechen" ? task : undefined,
      courseBookTaskIndex: index + 1,
      courseBookTaskSection: section,
    };
  });
};

export const expandCourseBookEntries = (entries = []) =>
  toArray(entries).flatMap((entry) => expandCourseBookEntry(entry));

export const findCourseBookEntry = ({ entries = [], day, chapter = "" } = {}) => {
  const requestedDay = Number(day);
  const requestedChapter = normalizeToken(chapter);
  const matches = expandCourseBookEntries(entries).filter(
    (entry) => Number(entry?.displayDay ?? entry?.day) === requestedDay
  );

  if (!requestedChapter) return matches[0] || null;

  return (
    matches.find((entry) => {
      const tokens = [
        entry?.displayChapter,
        entry?.chapter,
        entry?.assignmentId,
        entry?.assignment_id,
        entry?.assignmentKey,
      ].map(normalizeToken);
      return tokens.includes(requestedChapter) || tokens.some((token) => token.endsWith(`-${requestedChapter}`));
    }) ||
    matches[0] ||
    null
  );
};
