import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const buildRedirectPath = (search = "") => {
  const params = new URLSearchParams(search || "");
  if (!params.get("view")) params.set("view", "workbook");
  const query = params.toString();
  return `/campus/course/lesson/A2/5${query ? `?${query}` : ""}`;
};

export default function A2Day5FreizeitWorkbookPage() {
  const location = useLocation();
  return <Navigate to={buildRedirectPath(location.search)} replace />;
}
