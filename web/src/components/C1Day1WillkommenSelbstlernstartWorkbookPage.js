import React from "react";
import { Navigate } from "react-router-dom";

const C1_DAY1_WORKBOOK_ROUTE = "/campus/course/lesson/C1/1?view=workbook";

const C1Day1WillkommenSelbstlernstartWorkbookPage = () => (
  <Navigate to={C1_DAY1_WORKBOOK_ROUTE} replace />
);

export default C1Day1WillkommenSelbstlernstartWorkbookPage;

export const __TESTING__ = { C1_DAY1_WORKBOOK_ROUTE };
