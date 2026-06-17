import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { detectLevelKey } from "../lib/day0Workbook";
import HomeClassMembersCard from "./HomeClassMembersCard";

const selfLearningLevels = new Set(["B2", "C1"]);

const findHomeRoot = (marker) => {
  let node = marker?.parentElement || null;
  while (node && !node.parentElement?.classList?.contains("layout-main")) {
    node = node.parentElement;
  }
  return node;
};

const findMainAccessCard = (homeRoot) =>
  Array.from(homeRoot?.children || []).find((child) => {
    const text = String(child.textContent || "");
    return text.includes("Enter Campus") && text.includes("Open Exams Room");
  }) || null;

const HomeClassMembersPortal = () => {
  const { studentProfile } = useAuth();
  const navigate = useNavigate();
  const markerRef = useRef(null);
  const [target, setTarget] = useState(null);
  const level = detectLevelKey(studentProfile);
  const shouldShow =
    Boolean(studentProfile?.className) &&
    Boolean(level) &&
    !selfLearningLevels.has(level);

  useEffect(() => {
    if (!shouldShow || typeof document === "undefined") return undefined;
    const homeRoot = findHomeRoot(markerRef.current);
    if (!homeRoot) return undefined;

    const existing = homeRoot.querySelector(":scope > [data-home-class-members-host]");
    const host = existing || document.createElement("div");
    if (!existing) {
      host.dataset.homeClassMembersHost = "true";
      const mainAccessCard = findMainAccessCard(homeRoot);
      homeRoot.insertBefore(host, mainAccessCard || homeRoot.children[1] || null);
    }
    setTarget(host);

    return () => {
      setTarget(null);
      if (!existing) host.remove();
    };
  }, [shouldShow]);

  if (!shouldShow) return null;

  const card = (
    <HomeClassMembersCard
      studentProfile={studentProfile}
      onViewMembers={() => navigate("/campus/discussion?tab=members")}
      onOpenDiscussion={() => navigate("/campus/discussion")}
    />
  );

  return (
    <>
      <span ref={markerRef} hidden aria-hidden="true" />
      {target ? createPortal(card, target) : null}
    </>
  );
};

export default HomeClassMembersPortal;
