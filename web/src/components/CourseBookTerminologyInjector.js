import { useEffect } from "react";

export const replaceCourseBookTerminology = (root = document) => {
  if (!root?.querySelectorAll) return 0;

  let replacements = 0;
  root.querySelectorAll("span").forEach((element) => {
    if (element.textContent?.trim() !== "Tutor-marked") return;
    element.textContent = "Tutor Marked Assignment";
    replacements += 1;
  });

  return replacements;
};

export default function CourseBookTerminologyInjector() {
  useEffect(() => {
    replaceCourseBookTerminology(document);

    const observer = new MutationObserver(() => {
      replaceCourseBookTerminology(document);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
