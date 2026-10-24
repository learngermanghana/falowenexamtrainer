import React from "react";
import { Navigate } from "react-router-dom";

const C1_DAY13_WORKBOOK_ROUTE = "/campus/course/lesson/C1/13?view=workbook";

const C1Day13MehrsprachigkeitWorkbookPage = () => (
  <Navigate to={C1_DAY13_WORKBOOK_ROUTE} replace />
);

export default C1Day13MehrsprachigkeitWorkbookPage;

export const __TESTING__ = { C1_DAY13_WORKBOOK_ROUTE };
