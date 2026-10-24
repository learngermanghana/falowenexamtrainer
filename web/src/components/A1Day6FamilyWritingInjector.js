import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import GroupDiscussionWritingBox from "./GroupDiscussionWritingBox";
import { getDiscussionLesson } from "../utils/discussionLessons";

const findStrongByText = (root, text) =>
  Array.from(root?.querySelectorAll("strong") || []).find(
    (element) => String(element.textContent || "").trim() === text
  );

export default function A1Day6FamilyWritingInjector() {
  const [mountNode, setMountNode] = useState(null);
  const discussionLesson = useMemo(
    () =>
      getDiscussionLesson({
        level: "A1",
        day: 6,
        topic: "Family, Languages, Yes/No Questions and Hobbies",
      }),
    []
  );

  useEffect(() => {
    let hiddenOldCard = null;
    let observer = null;

    const attach = () => {
      const writingSection = document.getElementById("writing");
      if (!writingSection) return false;

      const existingMount = writingSection.querySelector('[data-a1-day6-family-writing-box="true"]');
      if (existingMount) {
        setMountNode(existingMount);
        return true;
      }

      const target = document.createElement("div");
      target.dataset.a1Day6FamilyWritingBox = "true";
      target.style.display = "grid";
      target.style.gap = "12px";

      const finalTaskHeading = findStrongByText(writingSection, "Final writing task");
      const finalTaskCard = finalTaskHeading?.parentElement;
      if (finalTaskCard?.parentElement) {
        finalTaskCard.insertAdjacentElement("afterend", target);
      } else {
        writingSection.appendChild(target);
      }

      const oldHeading = findStrongByText(writingSection, "Where to write and submit");
      hiddenOldCard = oldHeading?.parentElement || null;
      if (hiddenOldCard) hiddenOldCard.style.display = "none";

      setMountNode(target);
      return true;
    };

    if (!attach()) {
      observer = new MutationObserver(() => {
        if (attach() && observer) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      if (observer) observer.disconnect();
      if (hiddenOldCard) hiddenOldCard.style.display = "";
      const node = document.querySelector('[data-a1-day6-family-writing-box="true"]');
      if (node?.parentElement) node.parentElement.removeChild(node);
      setMountNode(null);
    };
  }, []);

  if (!mountNode) return null;

  return createPortal(
    <GroupDiscussionWritingBox
      lessonId={discussionLesson.id}
      lessonLabel={discussionLesson.label}
      activityKey="teil2-family-writing"
      topic="Writing About Your Family"
      questionTitle="Write about yourself and your family"
      question="Write 6–8 German sentences about your name, country, age, family, hobby and languages."
      placeholder="Mein Name ist … Ich komme aus … Ich bin … Jahre alt. Mein Vater heißt …"
      rows={10}
      saveLabel="Save to Group Discussion"
    />,
    mountNode
  );
}
