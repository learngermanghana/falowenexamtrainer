import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ClassWorkbookShareBox from "./ClassWorkbookShareBox";

const FAMILY_WORKBOOK_PATH = "/campus/course/a1-day-6-family-and-hobbies-workbook";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

const WorkbookInlineEnhancements = ({ pathname }) => {
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    if (normalizePath(pathname) !== FAMILY_WORKBOOK_PATH || typeof document === "undefined") {
      setMountNode(null);
      return undefined;
    }

    let frameId = null;
    let mountedNode = null;
    let attempts = 0;
    const hiddenElements = [];

    const hideElement = (element) => {
      if (!element || hiddenElements.some((item) => item.element === element)) return;
      hiddenElements.push({ element, display: element.style.display });
      element.style.display = "none";
    };

    const install = () => {
      const writingSection = document.getElementById("writing");
      if (!writingSection) {
        attempts += 1;
        if (attempts < 30) frameId = window.requestAnimationFrame(install);
        return;
      }

      const directChildren = Array.from(writingSection.children);
      const finalTaskCard = directChildren.find((element) =>
        String(element.textContent || "").includes("Final writing task")
      );
      const oldSubmitCard = directChildren.find((element) =>
        String(element.textContent || "").includes("Where to write and submit")
      );
      const oldDiscussionBox = writingSection.querySelector('[data-a1-day6-family-writing-box="true"]');

      hideElement(finalTaskCard);
      hideElement(oldSubmitCard);
      hideElement(oldDiscussionBox);

      mountedNode = document.createElement("div");
      mountedNode.setAttribute("data-workbook-class-share", "family-and-hobbies");

      const insertionPoint = finalTaskCard || oldSubmitCard;
      if (insertionPoint?.parentNode === writingSection) {
        writingSection.insertBefore(mountedNode, insertionPoint);
      } else {
        const helpCard = directChildren.find((element) =>
          String(element.textContent || "").includes("Need help?")
        );
        if (helpCard?.parentNode === writingSection) writingSection.insertBefore(mountedNode, helpCard);
        else writingSection.appendChild(mountedNode);
      }

      setMountNode(mountedNode);
    };

    install();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      hiddenElements.forEach(({ element, display }) => {
        if (element) element.style.display = display;
      });
      if (mountedNode?.parentNode) mountedNode.parentNode.removeChild(mountedNode);
    };
  }, [pathname]);

  if (!mountNode) return null;

  return createPortal(
    <ClassWorkbookShareBox
      lessonId="a1-day-6-family-and-hobbies-workbook"
      prompt="Write 6–8 sentences about yourself and your family. Include your name, country, age, family, one hobby, and languages."
    />,
    mountNode
  );
};

export default WorkbookInlineEnhancements;
