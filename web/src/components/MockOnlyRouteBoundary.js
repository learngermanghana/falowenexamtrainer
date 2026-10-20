import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MOCK_EXAM_CATALOG } from "../data/mockExamCatalog";
import { isMockPortal, MockExamOnlyGate } from "./MockExamCommerce";

// Top-level boundary also covers lesson routes owned by index.jsx outside App.js.
// The server-side purchase lookup in MockExamOnlyGate is the second layer.
export default function MockOnlyRouteBoundary({ children }) {
  const { user, studentProfile } = useAuth();
  const location = useLocation();
  const examOnly = studentProfile?.accountType === "exam_only";
  if (!examOnly && !isMockPortal()) return children;
  const route = location.pathname;
  if (["/mock/register", "/mock/checkout", "/mock/complete", "/mock/free-hoeren", "/login", "/login/", "/signup", "/signup/"].includes(route)) return children;
  if (/^\/exams(?:\/|$)/.test(route)) return children;
  const allowedMock = Object.values(MOCK_EXAM_CATALOG).some(
    (item) => item.status !== "planned" && item.id !== "a2-course-preview-01" && item.route === route
  );
  if (allowedMock) {
    if (isMockPortal() && !user) return <Navigate to="/login/" replace />;
    if (examOnly) return <MockExamOnlyGate>{children}</MockExamOnlyGate>;
    return children;
  }
  // Keep the public exam storefront at the subdomain root; redirect other
  // authenticated app URLs to the existing Exams Room.
  return <Navigate to="/exams/overview" replace />;
}
