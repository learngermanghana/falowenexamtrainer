import React, { Component, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";

const FAMILY_WORKBOOK = Object.freeze({
  lessonId: "A1-2.3",
  level: "A1",
  day: 6,
  chapter: "2.3",
  slug: "a1-day-6-family-and-hobbies-workbook",
  title: "Family and Hobbies workbook",
  load: () => import("./A1Day6FamilyAndHobbiesWorkbookPage"),
});

export const A1_WORKBOOK_ROUTES = Object.freeze({
  [FAMILY_WORKBOOK.slug]: FAMILY_WORKBOOK,
});

export const findA1WorkbookByPath = (pathname = "") => {
  const slug = String(pathname).split("?")[0].replace(/\/+$/, "").split("/").pop()?.toLowerCase();
  return A1_WORKBOOK_ROUTES[slug] || null;
};

const stateStyle = { ...styles.container, padding: 24 };

class WorkbookErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[A1 workbook] render failed", { error, componentStack: info.componentStack });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <main role="alert" style={stateStyle}>
          <h1>Workbook unavailable</h1>
          <p>We could not load this workbook. Please refresh the page or return to the Course Book.</p>
        </main>
      );
    }
    return this.props.children;
  }
}

export default function A1WorkbookRoutePage() {
  const location = useLocation();
  const workbook = findA1WorkbookByPath(location.pathname);

  if (!workbook) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[A1 workbook] lookup returned no record", { pathname: location.pathname });
    }
    return (
      <main role="alert" style={stateStyle}>
        <h1>Workbook not found</h1>
        <p>No published A1 workbook matches this address.</p>
      </main>
    );
  }

  const Workbook = React.lazy(workbook.load);
  return (
    <WorkbookErrorBoundary key={workbook.lessonId}>
      <Suspense fallback={<main style={stateStyle} aria-busy="true">Loading {workbook.title}…</main>}>
        <Workbook />
      </Suspense>
    </WorkbookErrorBoundary>
  );
}
