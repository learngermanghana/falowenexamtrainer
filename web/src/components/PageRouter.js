import React from "react";
import PlanPage from "./PlanPage";
import HomeActions from "./HomeActions";
import SpeakingPage from "./SpeakingPage";
import WritingPage from "./WritingPage";
import VocabPage from "./VocabPage";
import PracticeLab from "./PracticeLab";
import ProgressPage from "./ProgressPage";
import ResourcePage from "./ResourcePage";
import AccountSettings from "./AccountSettings";
import PlacementCheck from "./PlacementCheck";

const PAGE_DEFINITIONS = [
  { key: "plan", label: "Home · Plan", render: ({ onSelect }) => <PlanPage onSelect={onSelect} /> },
  { key: "home", render: ({ onSelect }) => <HomeActions onSelect={onSelect} /> },
  { key: "speaking", label: "Speaking", render: () => <SpeakingPage /> },
  { key: "writing", label: "Writing", render: () => <WritingPage /> },
  { key: "vocab", label: "Vocabulary", render: () => <VocabPage /> },
  { key: "ueben", label: "Practice", render: () => <PracticeLab /> },
  { key: "progress", label: "Progress", render: () => <ProgressPage /> },
  { key: "resources", label: "Resources", render: () => <ResourcePage /> },
  { key: "account", label: "Account", render: () => <AccountSettings /> },
  { key: "level-check", render: () => <PlacementCheck /> },
  { key: "daily", render: () => <SpeakingPage mode="daily" /> },
  { key: "exam", render: () => <SpeakingPage mode="exam" /> },
];

export const NAVIGABLE_PAGES = PAGE_DEFINITIONS.filter((page) => page.label).map((page) => ({
  key: page.key,
  label: page.label,
}));

const DEFAULT_PAGE_KEY = "plan";

const PageRouter = ({ activePage, onSelectPage }) => {
  const currentPage = PAGE_DEFINITIONS.find((page) => page.key === activePage);
  const safePage = currentPage ?? PAGE_DEFINITIONS.find((page) => page.key === DEFAULT_PAGE_KEY);

  return safePage?.render({ onSelect: onSelectPage }) ?? null;
};

export default PageRouter;
