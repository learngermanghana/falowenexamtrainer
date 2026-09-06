import React from "react";
import { Navigate } from "react-router-dom";

const B2_DAY1_WORKBOOK_ROUTE = "/campus/course/lesson/B2/1?view=workbook";

const B2Day1PersoenlicheIdentitaetWorkbookPage = () => (
  <Navigate to={B2_DAY1_WORKBOOK_ROUTE} replace />
);

export default B2Day1PersoenlicheIdentitaetWorkbookPage;

export const __TESTING__ = { B2_DAY1_WORKBOOK_ROUTE };
