import React from "react";
import { Navigate } from "react-router-dom";

const C1_DAY15_WORKBOOK_ROUTE =
  "/campus/course/lesson/C1/15?chapter=3.5&view=workbook";

const C1Day15BildungUndLebenslangesLernenWorkbookPage = () => (
  <Navigate to={C1_DAY15_WORKBOOK_ROUTE} replace />
);

export default C1Day15BildungUndLebenslangesLernenWorkbookPage;

export const __TESTING__ = { C1_DAY15_WORKBOOK_ROUTE };
