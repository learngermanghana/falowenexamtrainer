import React from "react";
import { useAuth } from "../context/AuthContext";
import AuthGate from "./AuthGate";
import A1Day20LetterWritingWorkbookPage from "./A1Day20LetterWritingWorkbookPage";

export const A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH =
  "/campus/course/letter-writing-intro-german-a1-day-12-3";

export default function A1Day20Chapter123DirectWorkbookRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main
        className="layout-main"
        style={{ minWidth: 0, display: "grid", placeItems: "center", padding: 24 }}
      >
        <p role="status" style={{ margin: 0 }}>
          Loading Chapter 12.3 assignment…
        </p>
      </main>
    );
  }

  if (!user) return <AuthGate initialMode="login" />;

  return (
    <main className="layout-main" style={{ minWidth: 0 }}>
      <A1Day20LetterWritingWorkbookPage />
    </main>
  );
}
