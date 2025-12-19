// Legacy student data imported from Firebase.
// Provide an array of student records shaped as:
// { email: "student@example.com", firstName: "Alex", level: "B1", studentCode: "ALEX-B1-XYZ" }
// You can overwrite this at runtime by assigning `window.__LEGACY_STUDENTS__ = [...]` before React mounts.

const runtimeStudents =
  typeof window !== "undefined" && Array.isArray(window.__LEGACY_STUDENTS__)
    ? window.__LEGACY_STUDENTS__
    : [];

const legacyStudents = runtimeStudents;

export default legacyStudents;
