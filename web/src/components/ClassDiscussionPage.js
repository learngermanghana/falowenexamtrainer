import React from "react";
import { useLocation } from "react-router-dom";
import ClassDiscussionPanel from "./ClassDiscussionPanel";
import ClassMembersTab from "./ClassMembersTab";

const ClassDiscussionPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeTab = params.get("tab");

  return activeTab === "members" ? <ClassMembersTab /> : <ClassDiscussionPanel />;
};

export default ClassDiscussionPage;
