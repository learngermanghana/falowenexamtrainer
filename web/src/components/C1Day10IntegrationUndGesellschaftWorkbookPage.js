import React from "react";
import { Navigate } from "react-router-dom";

const C1_DAY10_WORKBOOK_ROUTE = "/campus/course/lesson/C1/10?view=workbook";

const C1Day10IntegrationUndGesellschaftWorkbookPage = () => (
  <Navigate to={C1_DAY10_WORKBOOK_ROUTE} replace />
);

export default C1Day10IntegrationUndGesellschaftWorkbookPage;

export const __TESTING__ = { C1_DAY10_WORKBOOK_ROUTE };
