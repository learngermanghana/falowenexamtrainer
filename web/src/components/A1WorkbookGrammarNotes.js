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
import TwoCasePrepositionsPageLegacy from "./TwoCasePrepositionsPageLegacy";
import { DativeArticlesMitBeiZuGrammarNotes } from "./DativeArticlesMitBeiZuPage";
import WeatherPerfektLetterPage from "./WeatherPerfektLetterPage";
import HealthBodyPartsPage from "./HealthBodyPartsPage";
import A1Day21WeatherResources from "./A1Day21WeatherResources";

const A1Day20GoetheWritingGrammarPage = lazy(() =>
  import("./A1Day20GoetheWritingGrammarPage"),
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
  "A1-12.1": TwoCasePrepositionsPageLegacy,
  "A1-12.2": DativeArticlesMitBeiZuGrammarNotes,
  "A1-12.3": A1Day20GoetheWritingGrammarPage,
  "A1-13": WeatherPerfektLetterPage,
  "A1-14.1": HealthBodyPartsPage,
};

export const getA1GrammarNotesComponent = (assignmentKey) =>
  A1_GRAMMAR_NOTES_BY_ASSIGNMENT[String(assignmentKey || "").trim()] || null;

const A1Day16KeinQuickGuide = () => (
  <section
    data-a1-day16-kein-quick-guide="true"
    style={{
      border: "1px solid #bfdbfe",
      background: "#eff6ff",
      borderRadius: 16,
      padding: 16,
      display: "grid",
      gap: 12,
      lineHeight: 1.65,
    }}
  >
    <div style={{ display: "grid", gap: 6 }}>
      <h2 style={{ margin: 0 }}>Kein, keine, keinen — when do I use them?</h2>
      <p style={{ margin: 0 }}>
        Use <strong>kein</strong> to negate an indefinite noun or a noun with no article. It usually means
        <strong> no</strong>, <strong>not a</strong>, or <strong>not any</strong>. Use <strong>nicht</strong> to negate
        an action, an adjective, a phrase, or a definite/specific noun.
      </p>
    </div>

    <div style={{ display: "grid", gap: 7 }}>
      <strong>Forms you need for food and drinks</strong>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "1px solid #bfdbfe" }}>Noun</th>
              <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "1px solid #bfdbfe" }}>Form</th>
              <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "1px solid #bfdbfe" }}>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: "8px 10px" }}>der Kaffee</td><td style={{ padding: "8px 10px" }}><strong>keinen</strong></td><td style={{ padding: "8px 10px" }}>Ich trinke keinen Kaffee.</td></tr>
            <tr><td style={{ padding: "8px 10px" }}>die Suppe</td><td style={{ padding: "8px 10px" }}><strong>keine</strong></td><td style={{ padding: "8px 10px" }}>Ich esse keine Suppe.</td></tr>
            <tr><td style={{ padding: "8px 10px" }}>das Brot</td><td style={{ padding: "8px 10px" }}><strong>kein</strong></td><td style={{ padding: "8px 10px" }}>Ich habe kein Brot.</td></tr>
            <tr><td style={{ padding: "8px 10px" }}>die Eier</td><td style={{ padding: "8px 10px" }}><strong>keine</strong></td><td style={{ padding: "8px 10px" }}>Wir haben keine Eier.</td></tr>
          </tbody>
        </table>
      </div>
      <p style={{ margin: 0 }}>
        Important: masculine objects take <strong>keinen</strong>: <em>Ich möchte einen Kaffee.</em> → <em>Ich möchte keinen Kaffee.</em>
      </p>
    </div>

    <div style={{ display: "grid", gap: 7 }}>
      <strong>Compare kein and nicht</strong>
      <div><strong>Ich trinke keinen Kaffee.</strong> = I do not drink coffee / I drink no coffee.</div>
      <div><strong>Ich trinke den Kaffee nicht.</strong> = I am not drinking the specific coffee.</div>
      <div><strong>Die Suppe ist nicht warm.</strong> = <em>nicht</em> negates the adjective <em>warm</em>.</div>
      <div><strong>Ich koche heute nicht.</strong> = <em>nicht</em> negates the action.</div>
    </div>

    <div style={{ display: "grid", gap: 5 }}>
      <strong>Common A1 mistake</strong>
      <div>✗ Ich habe nicht Brot.</div>
      <div>✓ Ich habe kein Brot.</div>
    </div>
  </section>
);

const A1WorkbookGrammarNotes = ({ assignmentKey }) => {
  const normalizedAssignmentKey = String(assignmentKey || "").trim();
  const GrammarNotes = getA1GrammarNotesComponent(normalizedAssignmentKey);
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
    <div style={{ display: "grid", gap: 16 }}>
      {normalizedAssignmentKey === "A1-9" ? <A1Day16KeinQuickGuide /> : null}
      {normalizedAssignmentKey === "A1-13" ? <A1Day21WeatherResources /> : null}
      <Suspense fallback={<p style={{ margin: 0 }}>Loading grammar notes…</p>}>
        <GrammarNotes />
      </Suspense>
    </div>
  );
};

export default A1WorkbookGrammarNotes;