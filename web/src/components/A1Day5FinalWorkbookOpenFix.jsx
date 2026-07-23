import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const A1_DAY5_FINAL_WORKBOOK_PATH =
  "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

export const resolveA1Day5FinalWorkbookSearch = ({ pathname = "", search = "" } = {}) => {
  if (normalizePath(pathname) !== A1_DAY5_FINAL_WORKBOOK_PATH) return "";

  const params = new URLSearchParams(search || "");
  const radioDone = params.get("radio") === "done";
  const materialsDone = params.get("materials") === "done";
  const selectedWorkbookTab = String(params.get("workbookTab") || "").trim();

  if (!radioDone || !materialsDone || selectedWorkbookTab) return "";

  // The completed Day 5 link must reveal the workbook immediately. The shared
  // self-practice navigation remains available, but it starts on Teil 1 instead
  // of hiding every workbook section behind the Overview screen.
  params.set("workbookTab", "section-1");
  return `?${params.toString()}`;
};

export default function A1Day5FinalWorkbookOpenFix() {
  const location = useLocation();
  const navigate = useNavigate();
  const nextSearch = useMemo(
    () =>
      resolveA1Day5FinalWorkbookSearch({
        pathname: location.pathname,
        search: location.search,
      }),
    [location.pathname, location.search],
  );

  useEffect(() => {
    if (!nextSearch || nextSearch === location.search) return;

    navigate(
      {
        pathname: location.pathname,
        search: nextSearch,
        hash: location.hash,
      },
      {
        replace: true,
        state: location.state,
      },
    );
  }, [location.hash, location.pathname, location.search, location.state, navigate, nextSearch]);

  return null;
}
