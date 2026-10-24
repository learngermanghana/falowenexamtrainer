# A1 shared workbook migration matrix

The section inventory was taken from each React workbook's visible headings, not inferred from its day. All records are submission-enabled. The canonical registry is the source of routes, identity, section tabs, and previous/next order.

| Assignment | Route | Component | Existing sections | Shared tabs |
|---|---|---|---|---|
| A1-0.1 | `/campus/course/a1-day-1-greetings-workbook` | A1Day1GreetingsWorkbookPage | Reading Text; Multiple-Choice Questions | Overview, Teil 1, Teil 2, Submit |
| A1-0.2 | `/campus/course/a1-day-2-german-alphabet-reviewing-workbook` | A1Day3GermanAlphabetReviewingWorkbookPage | Reading and Writing; Questions; Hören | Overview, Teil 1, Teil 2, Teil 3, Submit |
| A1-1.1 | `/campus/course/a1-day-2-kapitel-1-1-workbook` | A1Day2Kapitel11WorkbookPage | Personalpronomen; Verben konjugieren; Sätze ergänzen; Fehler korrigieren; Kurzer Text | Overview, Teil 1–5, Submit |
| A1-1.2 | `/campus/course/a1-day-3-pronouns-introducing-yourself-workbook` | A1Day3PronounsIntroducingYourselfWorkbookPage | Lesen; Schreiben (Exercise); Hören | Overview, Teil 1–3, Submit |
| A1-2 | `/campus/course/a1-day-4-numbers-for-beginners-workbook` | A1Day4NumbersForBeginnersWorkbookPage | Reading / Writing; Questions | Overview, Teil 1–2, Submit |
| A1-3 | `/campus/course/a1-chapter-3-asking-about-prices-workbook` | A1Chapter3AskingAboutPricesWorkbookPage | Preise und Kosten; Familie; Hobbys | Overview, Teil 1–3, Submit |
| A1-4 | `/campus/course/a1-day-8-countries-and-languages-workbook` | A1Day8CountriesAndLanguagesWorkbookPage | Translation; Germany's Neighbors essay; Hören | Overview, Teil 1–3, Submit |
| A1-5 | `/campus/course/a1-chapter-5-german-cases-workbook` | A1Chapter5GermanCasesWorkbookPage | Vocabulary Review; Nominative; Accusative | Overview, Teil 1–3, Submit |
| A1-6 | `/campus/course/a1-day-10-objects-colors-possessive-articles-workbook` | A1Day10ObjectsColorsPossessiveArticlesWorkbookPage | Reading / Writing; Questions; Hören | Overview, Teil 1–3, Submit |
| A1-7 | `/campus/course/a1-day-11-understanding-time-workbook` | A1Day11UnderstandingTimeWorkbookPage | Lesen; Hören | Overview, Teil 1–2, Submit |
| A1-8 | `/campus/course/a1-day-12-24-hour-clock-and-dates-workbook` | A1Day12TwentyFourHourClockAndDatesWorkbookPage | two Lesen exercises; Hörverstehen; Vocabulary reminder | Overview, Teil 1–4, Submit |
| A1-9 | `/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook` | A1Day16FoodAndDailyLifeWorkbookPage | Lesen; Fragen; Hörverstehen; Schreiben | Overview, Teil 1–4, Submit |
| A1-10 | `/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook` | A1Day16FoodAndNegationKapitel10WorkbookPage | Lesen / Schreiben; Hören | Overview, Teil 1–2, Submit |
| A1-11 | `/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook` | A1Day17InstructionsDirectionsKapitel11WorkbookPage | two Lesen essays; Schreiben | Overview, Teil 1–3, Submit |
| A1-12.1 | `/campus/course/two-case-prepositions-wechselpraepositionen-day-18` | A1Day18Kapitel121WorkbookPage | Lesen essay; Anzeigen; Hören | Overview, Teil 1–3, Submit |
| A1-12.2 | `/campus/course/a1-12-2-dative-articles-mit-bei-zu` | A1Day18Kapitel122WorkbookPage | Lesen essay; Anzeigen; Hören | Overview, Teil 1–3, Submit |
| A1-12.3 | `/campus/course/letter-writing-intro-german-a1-day-12-3` | LetterWritingIntroPage | informal letter; formal letter | Overview, Teil 1–2, Submit |
| A1-13 | `/campus/course/a1-day-21-weather-workbook` | A1Day21WeatherWorkbookPage | Anzeigen; Nachricht; Schreiben | Overview, Teil 1–3, Submit |
| A1-14.1 | `/campus/course/a1-day-22-health-and-body-parts-workbook` | A1Day22HealthBodyPartsWorkbookPage | Lesen; Schreiben; Wortschatz | Overview, Teil 1–3, Submit |

## Architecture and legacy removal

`A1SharedAssignmentWorkbookLayout` derives its tabs solely from the registry, keeps every section mounted while switching visibility, validates one non-empty `WorkbookSection` per declaration in development, locks submission identity, normalizes invalid URL tabs, and uses the explicit 19-item neighbor order. Registered routes opt out of the MutationObserver/click-driven legacy services, preventing duplicate injected navigation.

## Remaining risk

The eight browser smoke cases should continue to run against an authenticated deployment because radio-first access and cloud submission require Firebase state that is unavailable in isolated unit tests.
