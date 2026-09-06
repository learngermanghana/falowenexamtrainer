import React from "react";
import { Navigate } from "react-router-dom";

const C1_DAY16_WORKBOOK_ROUTE = "/campus/course/lesson/C1/16?view=workbook";

const C1Day16TechnologieImAlltagWorkbookPage = () => (
  <Navigate to={C1_DAY16_WORKBOOK_ROUTE} replace />
);

export default C1Day16TechnologieImAlltagWorkbookPage;

export const __TESTING__ = { C1_DAY16_WORKBOOK_ROUTE };
