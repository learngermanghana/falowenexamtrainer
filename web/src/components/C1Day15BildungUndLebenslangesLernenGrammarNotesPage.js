import React from "react";
import { Navigate } from "react-router-dom";

const C1_DAY15_GRAMMAR_ROUTE =
  "/campus/course/lesson/C1/15?chapter=3.5&view=grammar";

const C1Day15BildungUndLebenslangesLernenGrammarNotesPage = () => (
  <Navigate to={C1_DAY15_GRAMMAR_ROUTE} replace />
);

export default C1Day15BildungUndLebenslangesLernenGrammarNotesPage;

export const __TESTING__ = { C1_DAY15_GRAMMAR_ROUTE };
