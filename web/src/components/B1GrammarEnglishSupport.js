import React from "react";

const SUPPORT_BY_DAY = Object.freeze({
  1: {
    terms: "Präsens = present tense · Perfekt = conversational past / present perfect",
    rule: "Use Präsens for what is happening now, habits and scheduled future plans. Form Perfekt with haben/sein + Partizip II at the end.",
    example: "Ich lerne Deutsch. · Ich habe Deutsch gelernt.",
  },
  2: {
    terms: "Adjektiv = adjective · weil = because",
    rule: "A weil-clause gives a reason. In the subordinate clause, the conjugated verb goes to the end.",
    example: "Sie ist zuverlässig, weil sie immer pünktlich kommt.",
  },
  3: {
    terms: "Adjektivdeklination = adjective endings · unbestimmter Artikel = indefinite article",
    rule: "After ein/eine, the adjective ending changes according to gender and case. Compare: ein guter Freund → einen guten Freund.",
    example: "Er ist ein erfolgreicher Unternehmer. · Ich kenne einen erfolgreichen Unternehmer.",
  },
  4: {
    terms: "zweiteilige Konnektoren = paired connectors",
    rule: "Learn the connectors as pairs: sowohl … als auch = both … and; entweder … oder = either … or; weder … noch = neither … nor; nicht nur … sondern auch = not only … but also.",
    example: "Die Wohnung ist nicht nur groß, sondern auch ruhig.",
  },
  5: {
    terms: "Konjunktiv II = polite/hypothetical form · indirekte Frage = indirect question",
    rule: "Könnten, würden and wäre make requests and suggestions more polite. In indirect questions, the conjugated verb goes to the end; use ob for yes/no questions.",
    example: "Könnten Sie mir sagen, ob die Wohnung noch frei ist?",
  },
  6: {
    terms: "Komparativ = comparative · als = than · so … wie = as … as",
    rule: "Use als after a comparative, but wie for equality. weil/da send the verb to the end; denn keeps normal main-clause word order.",
    example: "Das Land ist ruhiger als die Stadt. · Die Stadt ist so interessant wie das Land.",
  },
  7: {
    terms: "Genitiv = genitive case · wegen = because of · trotz = despite",
    rule: "The genitive often expresses possession or a relationship. In formal standard German, wegen and trotz are commonly followed by the genitive.",
    example: "Wegen des Preises esse ich seltener Fast Food.",
  },
  8: {
    terms: "Modalverben = modal verbs · müssen = must · sollen = should · dürfen = may · können = can",
    rule: "The conjugated modal verb normally stands in position 2 and the main verb stays as an infinitive at the end.",
    example: "Man sollte regelmäßig Sport treiben.",
  },
  9: {
    terms: "um … zu = in order to · damit = so that · indem = by doing · obwohl = although · trotzdem = nevertheless",
    rule: "Use um … zu mainly when the subject is the same. Use damit for a full purpose clause. obwohl sends the verb to the end; trotzdem starts a normal main clause.",
    example: "Ich mache Pausen, um konzentriert zu bleiben. · Obwohl ich viel arbeite, mache ich Pausen.",
  },
  10: {
    terms: "Komparativ = comparative · Superlativ = superlative · je … desto = the … the …",
    rule: "Use als after a comparative and wie after so/genauso. je … desto links two changes that develop together.",
    example: "Je länger ich offline bin, desto ruhiger werde ich.",
  },
  11: {
    terms: "reziprok = reciprocal / each other",
    rule: "Forms such as miteinander, füreinander, voneinander, aufeinander and gegeneinander describe actions or relationships between two or more people.",
    example: "Im Team helfen wir einander und lernen voneinander.",
  },
  12: {
    terms: "Perfekt/Präteritum = past tenses · zeitliche Konnektoren = sequencing connectors",
    rule: "Use past forms to tell what happened and connectors such as zuerst, dann, danach and schließlich to make the sequence clear. weil and obwohl send the verb to the end.",
    example: "Zuerst sind wir losgegangen. Obwohl es geregnet hat, sind wir weitergelaufen.",
  },
  13: {
    terms: "Passiv = passive voice · Bewertungsadjektive = evaluative adjectives",
    rule: "In the present passive, use werden + Partizip II. The passive focuses on the action or result rather than the person doing it.",
    example: "Der Film wird sehr überzeugend erzählt.",
  },
  14: {
    terms: "während = while/whereas · hingegen = by contrast · im Gegensatz zu = in contrast to",
    rule: "Use these structures to compare two sides. A während-clause places the conjugated verb at the end; hingegen usually works inside normal main-clause word order.",
    example: "Während digitales Lernen flexibel ist, bietet Präsenzunterricht direkten Kontakt.",
  },
  15: {
    terms: "Passiv Präsens = present passive · Passiv mit Modalverb = passive with a modal verb",
    rule: "Present passive: werden + Partizip II. With a modal verb: modal verb + Partizip II + werden at the end.",
    example: "Die Daten werden gespeichert. · Die Daten müssen geschützt werden.",
  },
  16: {
    terms: "Infinitiv mit zu = infinitive with zu · damit / um … zu = purpose",
    rule: "weil, dass and wenn send the conjugated verb to the end. Use um … zu mainly with the same subject; use damit when a full clause is needed.",
    example: "Ich lerne früh, um Stress zu vermeiden. · Ich plane Pausen, damit ich ruhig bleibe.",
  },
  17: {
    terms: "wenn = if/when · weil = because · dass = that · damit = so that · um … zu = in order to",
    rule: "These connectors help explain learning conditions, reasons and goals. In clauses with wenn, weil, dass and damit, the conjugated verb goes to the end.",
    example: "Ich lerne besser, wenn ich regelmäßig Pausen mache.",
  },
  18: {
    terms: "Infinitiv mit zu = infinitive with zu · Relativsatz = relative clause · je nachdem = depending on",
    rule: "A relative clause gives extra information about a noun and places the conjugated verb at the end. je nachdem introduces different possibilities or conditions.",
    example: "Ein Beruf, der zu mir passt, sollte abwechslungsreich sein.",
  },
  19: {
    terms: "Konjunktiv II = polite/hypothetical form · Sie-Form = formal you",
    rule: "Use könnte, würde and wäre to sound polite and professional. In explanatory clauses with weil, da and dass, the conjugated verb goes to the end.",
    example: "Ich würde gern erklären, warum ich mich für diese Stelle interessiere.",
  },
  20: {
    terms: "Relativsatz = relative clause · Modalverb = modal verb · Nebensatz = subordinate clause",
    rule: "Relative clauses describe a noun and place the conjugated verb at the end. Modal verbs express ability, necessity or expectations.",
    example: "Ein Arzt ist eine Person, die Patienten untersucht. · Man muss gut kommunizieren können.",
  },
  21: {
    terms: "zweiteilige Konnektoren = paired connectors · Nebensatz = subordinate clause",
    rule: "Use paired connectors to weigh alternatives and advantages/disadvantages. Keep both parts of the connector together and watch verb position when a subordinate clause follows.",
    example: "Einerseits ist allein wohnen flexibel, andererseits kann es teuer sein.",
  },
  22: {
    terms: "dass-Satz = that-clause · Relativsatz = relative clause · reziprok = reciprocal",
    rule: "dass-clauses and relative clauses put the conjugated verb at the end. Reciprocal forms such as miteinander and füreinander describe mutual actions.",
    example: "Ich finde, dass Vertrauen wichtig ist. · Partner sollten füreinander da sein.",
  },
  23: {
    terms: "Konjunktiv II = polite/hypothetical form · wenn = if/when · weil = because",
    rule: "Use könnten/würden for softer suggestions. In wenn- and weil-clauses, the conjugated verb goes to the end.",
    example: "Wir könnten in ein Café gehen, weil man dort gut sprechen kann.",
  },
});

export const getB1GrammarEnglishSupport = (day) =>
  SUPPORT_BY_DAY[Number(day)] || null;

export default function B1GrammarEnglishSupport({ day }) {
  const support = getB1GrammarEnglishSupport(day);
  if (!support) return null;

  return (
    <aside
      data-b1-grammar-english-support="true"
      style={{
        border: "1px solid #bfdbfe",
        background: "#f8fbff",
        borderRadius: 14,
        padding: 14,
        display: "grid",
        gap: 8,
        lineHeight: 1.65,
      }}
    >
      <div>
        <strong>English help</strong>
        <span style={{ color: "#64748b", marginLeft: 8, fontSize: "0.9rem" }}>
          Short support only — examples and practice stay in German.
        </span>
      </div>
      <div><strong>Key terms:</strong> {support.terms}</div>
      <div><strong>Rule:</strong> {support.rule}</div>
      <div><strong>German example:</strong> {support.example}</div>
    </aside>
  );
}
