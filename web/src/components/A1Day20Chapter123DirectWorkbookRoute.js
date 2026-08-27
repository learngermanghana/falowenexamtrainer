import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  A1_DAY20_CHAPTER123_RESOURCE_HUB_ROUTE,
  A1_DAY20_CHAPTER123_WORKBOOK_ROUTE,
} from "../data/a1Day20LetterWritingRoutes";
import AuthGate from "./AuthGate";
import A1Day20LetterWritingWorkbookPage from "./A1Day20LetterWritingWorkbookPage";

export const A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH =
  A1_DAY20_CHAPTER123_WORKBOOK_ROUTE;

export const shouldOpenA1Day20Workbook = (search = "") => {
  try {
    return new URLSearchParams(String(search || "")).get("view") === "workbook";
  } catch (_error) {
    return false;
  }
};

export const buildA1Day20ResourceHubDestination = (search = "") => {
  const incoming = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  const destination = new URL(A1_DAY20_CHAPTER123_RESOURCE_HUB_ROUTE, "https://www.falowen.app");

  if (incoming.get("radio") === "done") {
    destination.searchParams.set("radio", "done");
  }

  return `${destination.pathname}?${destination.searchParams.toString()}`;
};

export default function A1Day20Chapter123DirectWorkbookRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

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

  if (!shouldOpenA1Day20Workbook(location.search)) {
    return (
      <Navigate
        to={buildA1Day20ResourceHubDestination(location.search)}
        replace
        state={null}
      />
    );
  }

  return (
    <main className="layout-main" style={{ minWidth: 0 }}>
      <A1Day20LetterWritingWorkbookPage />
    </main>
  );
}
