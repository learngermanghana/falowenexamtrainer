import React from "react";
import { Navigate } from "react-router-dom";

const C1_DAY11_WORKBOOK_ROUTE = "/campus/course/lesson/C1/11?view=workbook";

const C1Day11EngagementUndEhrenamtWorkbookPage = () => (
  <Navigate to={C1_DAY11_WORKBOOK_ROUTE} replace />
);

export default C1Day11EngagementUndEhrenamtWorkbookPage;

export const __TESTING__ = { C1_DAY11_WORKBOOK_ROUTE };
