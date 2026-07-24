import React, { Suspense, lazy } from "react";
import A1Day1GreetingsGrammarPage from "./A1Day1GreetingsGrammarPage";
import GermanAlphabetGrammarNotesPage from "./GermanAlphabetGrammarNotesPage";
import SingularPronounsConjugationPage from "./SingularPronounsConjugationPage";
import A1Day3Kapitel12GrammarNotesPage from "./A1Day3Kapitel12GrammarNotesPage";
import GermanNumbersGrammarPage from "./GermanNumbersGrammarPage";
import A1Day7PricesPreferencesGrammarPage from "./A1Day7PricesPreferencesGrammarPage";
import FormingBasicStatementsPage from "./FormingBasicStatementsPage";
import A1Day9NominativeAccusativeGrammarPage from "./A1Day9NominativeAccusativeGrammarPage";
import ObjectsAndColorsPage from "./ObjectsAndColorsPage";
import TwelveHourClockPage from "./TwelveHourClockPage";
import A1Day12TwentyFourHourClockDatesPage from "./A1Day12TwentyFourHourClockDatesPage";
import A1Day16FoodAndNegationGrammarPage from "./A1Day16FoodAndNegationGrammarPage";
import DirectionsImperativePage from "./DirectionsImperativePage";
import TwoCasePrepositionsPage from "./TwoCasePrepositionsPage";
import DativeArticlesMitBeiZuPage from "./DativeArticlesMitBeiZuPage";
import WeatherPerfektLetterPage from "./WeatherPerfektLetterPage";
import HealthBodyPartsPage from "./HealthBodyPartsPage";

const LetterWritingGrammarNotesPage = lazy(() =>
  import("./LetterWritingIntroPage").then((module) => ({
    default: module.LetterWritingGrammarNotesPage,
  })),
);

const A1_GRAMMAR_NOTES_BY_ASSIGNMENT = {
  "A1-0.1": A1Day1GreetingsGrammarPage,
  "A1-0.2": GermanAlphabetGrammarNotesPage,
  "A1-1.1": SingularPronounsConjugationPage,
  "A1-1.2": A1Day3Kapitel12GrammarNotesPage,
  "A1-2": GermanNumbersGrammarPage,
  "A1-3": A1Day7PricesPreferencesGrammarPage,
  "A1-4": FormingBasicStatementsPage,
  "A1-5": A1Day9NominativeAccusativeGrammarPage,
  "A1-6": ObjectsAndColorsPage,
  "A1-7": TwelveHourClockPage,
  "A1-8": A1Day12TwentyFourHourClockDatesPage,
  "A1-9": A1Day16FoodAndNegationGrammarPage,
  "A1-11": DirectionsImperativePage,
  "A1-12.1": TwoCasePrepositionsPage,
  "A1-12.2": DativeArticlesMitBeiZuPage,
  "A1-12.3": LetterWritingGrammarNotesPage,
  "A1-13": WeatherPerfektLetterPage,
  "A1-14.1": HealthBodyPartsPage,
};

export const getA1GrammarNotesComponent = (assignmentKey) =>
  A1_GRAMMAR_NOTES_BY_ASSIGNMENT[String(assignmentKey || "").trim()] || null;

const A1WorkbookGrammarNotes = ({ assignmentKey }) => {
  const GrammarNotes = getA1GrammarNotesComponent(assignmentKey);
  if (!GrammarNotes) {
    return (
      <section style={{ display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Grammar Notes</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Grammar notes are not linked for this A1 workbook yet. Continue with the Assignment and Submit tabs.
        </p>
      </section>
    );
  }

  return (
    <Suspense fallback={<p style={{ margin: 0 }}>Loading grammar notes…</p>}>
      <GrammarNotes />
    </Suspense>
  );
};

export default A1WorkbookGrammarNotes;
