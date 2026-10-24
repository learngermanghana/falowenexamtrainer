import React from "react";
import { Navigate } from "react-router-dom";

const C1_DAY14_WORKBOOK_ROUTE = "/campus/course/lesson/C1/14?view=workbook";

const C1Day14InnovationUndZukunftWorkbookPage = () => (
  <Navigate to={C1_DAY14_WORKBOOK_ROUTE} replace />
);

export default C1Day14InnovationUndZukunftWorkbookPage;

export const __TESTING__ = { C1_DAY14_WORKBOOK_ROUTE };
