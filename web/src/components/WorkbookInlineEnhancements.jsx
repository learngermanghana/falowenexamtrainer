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
    let legacyCard = null;
    let legacyDisplay = "";
    let attempts = 0;

    const install = () => {
      const writingSection = document.getElementById("writing");
      if (!writingSection) {
        attempts += 1;
        if (attempts < 30) frameId = window.requestAnimationFrame(install);
        return;
      }

      legacyCard = Array.from(writingSection.children).find((element) =>
        String(element.textContent || "").includes("Where to write and submit")
      );

      mountedNode = document.createElement("div");
      mountedNode.setAttribute("data-workbook-class-share", "family-and-hobbies");

      if (legacyCard) {
        legacyDisplay = legacyCard.style.display;
        legacyCard.style.display = "none";
        writingSection.insertBefore(mountedNode, legacyCard);
      } else {
        writingSection.appendChild(mountedNode);
      }

      setMountNode(mountedNode);
    };

    install();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (legacyCard) legacyCard.style.display = legacyDisplay;
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
