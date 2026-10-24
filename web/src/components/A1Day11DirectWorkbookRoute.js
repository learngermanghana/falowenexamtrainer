import React from "react";
import { useAuth } from "../context/AuthContext";
import AuthGate from "./AuthGate";
import A1Day11UnderstandingTimeWorkbookPage from "./A1Day11UnderstandingTimeWorkbookPage";

export const A1_DAY11_DIRECT_WORKBOOK_PATH =
  "/campus/course/a1-day-11-understanding-time-workbook";

export default function A1Day11DirectWorkbookRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main
        className="layout-main"
        style={{ minWidth: 0, display: "grid", placeItems: "center", padding: 24 }}
      >
        <p role="status" style={{ margin: 0 }}>
          Loading Day 11 assignment…
        </p>
      </main>
    );
  }

  if (!user) return <AuthGate initialMode="login" />;

  return (
    <main className="layout-main" style={{ minWidth: 0 }}>
      <A1Day11UnderstandingTimeWorkbookPage />
    </main>
  );
}
