import React from "react";
import { Navigate } from "react-router-dom";

const C1_DAY12_WORKBOOK_ROUTE = "/campus/course/lesson/C1/12?view=workbook";

const C1Day12FreizeitUndKulturWorkbookPage = () => (
  <Navigate to={C1_DAY12_WORKBOOK_ROUTE} replace />
);

export default C1Day12FreizeitUndKulturWorkbookPage;

export const __TESTING__ = { C1_DAY12_WORKBOOK_ROUTE };
