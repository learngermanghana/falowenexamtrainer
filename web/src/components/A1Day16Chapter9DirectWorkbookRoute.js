import React from "react";
import { useAuth } from "../context/AuthContext";
import AuthGate from "./AuthGate";
import A1Day16FoodAndDailyLifeWorkbookPage from "./A1Day16FoodAndDailyLifeWorkbookPage";

export const A1_DAY16_CHAPTER9_DIRECT_WORKBOOK_PATH =
  "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook";

export default function A1Day16Chapter9DirectWorkbookRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main
        className="layout-main"
        style={{ minWidth: 0, display: "grid", placeItems: "center", padding: 24 }}
      >
        <p role="status" style={{ margin: 0 }}>
          Loading Chapter 9 assignment…
        </p>
      </main>
    );
  }

  if (!user) return <AuthGate initialMode="login" />;

  return (
    <main className="layout-main" style={{ minWidth: 0 }}>
      <A1Day16FoodAndDailyLifeWorkbookPage />
    </main>
  );
}
