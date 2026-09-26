import React from "react";

const SUPPORT_BY_DAY = Object.freeze({
  1: {
    terms: "Präsens = present tense · Perfekt = conversational past / present perfect",
    rule: "Use Präsens for what is happening now, habits and scheduled future plans. Form Perfekt with haben/sein + Partizip II at the end.",
    structure: "Präsens: subject + conjugated verb. Perfekt: subject + haben/sein + ... + Partizip II.",
    use: "Use Präsens for routines and current situations. Use Perfekt when speaking about completed past events.",
    watchOut: "Do not put the Partizip II in position 2. In Perfekt it normally comes at the end.",
    example: "Ich lerne Deutsch. · Ich habe Deutsch gelernt.",
  },
  2: {
    terms: "Adjektiv = adjective · weil = because · Nebensatz = subordinate clause",
    rule: "A weil-clause gives a reason. In the subordinate clause, the conjugated verb goes to the end.",
    structure: "Main clause + weil + subject + other information + conjugated verb.",
    use: "Use weil when you want to explain the reason for an opinion, description or action.",
    watchOut: "After weil, do not keep normal main-clause word order. The conjugated verb belongs at the end.",
    example: "Sie ist zuverlässig, weil sie immer pünktlich kommt.",
  },
  3: {
    terms: "Adjektivdeklination = adjective endings · unbestimmter Artikel = indefinite article",
    rule: "After ein/eine, the adjective ending changes according to gender and case. Compare: ein guter Freund → einen guten Freund.",
    structure: "Article + adjective ending + noun. The ending changes with gender, case and article type.",
    use: "Use adjective endings whenever an adjective comes directly before a noun.",
    watchOut: "Do not use the same adjective ending everywhere. Akkusativ masculine often changes -er to -en.",
    example: "Er ist ein erfolgreicher Unternehmer. · Ich kenne einen erfolgreichen Unternehmer.",
  },
  4: {
    terms: "zweiteilige Konnektoren = paired connectors",
    rule: "Learn the connectors as pairs: sowohl … als auch = both … and; entweder … oder = either … or; weder … noch = neither … nor; nicht nur … sondern auch = not only … but also.",
    structure: "Place the two connector parts around the two ideas you want to connect.",
    use: "Use paired connectors to compare options, add information or make a contrast more precise.",
    watchOut: "Do not mix pairs. For example, use nicht nur ... sondern auch, not nicht nur ... als auch.",
    example: "Die Wohnung ist nicht nur groß, sondern auch ruhig.",
  },
  5: {
    terms: "Konjunktiv II = polite/hypothetical form · indirekte Frage = indirect question",
    rule: "Könnten, würden and wäre make requests and suggestions more polite. In indirect questions, the conjugated verb goes to the end; use ob for yes/no questions.",
    structure: "Polite request: Könnten/Würden Sie ...? Indirect question: ..., ob/W-Wort + subject + ... + verb.",
    use: "Use Konjunktiv II in polite conversations and use indirect questions when asking for information less directly.",
    watchOut: "In an indirect question, do not use question word order. The verb goes to the end.",
    example: "Könnten Sie mir sagen, ob die Wohnung noch frei ist?",
  },
  6: {
    terms: "Komparativ = comparative · als = than · so … wie = as … as",
    rule: "Use als after a comparative, but wie for equality. weil/da send the verb to the end; denn keeps normal main-clause word order.",
    structure: "größer als ... · so groß wie ... · weil/da + ... + verb · denn + normal word order.",
    use: "Use these forms when comparing city and countryside or explaining reasons.",
    watchOut: "Do not say größer wie in standard German. Use größer als.",
    example: "Das Land ist ruhiger als die Stadt. · Die Stadt ist so interessant wie das Land.",
  },
  7: {
    terms: "Genitiv = genitive case · wegen = because of · trotz = despite",
    rule: "The genitive often expresses possession or a relationship. In formal standard German, wegen and trotz are commonly followed by the genitive.",
    structure: "wegen/trotz + Genitiv: wegen des Preises · trotz des Wetters.",
    use: "Use wegen to give a reason and trotz to show that something happens despite a difficulty.",
    watchOut: "Pay attention to masculine/neuter articles: der/das often becomes des, and the noun may take -s/-es.",
    example: "Wegen des Preises esse ich seltener Fast Food.",
  },
  8: {
    terms: "Modalverben = modal verbs · müssen = must · sollen = should · dürfen = may · können = can",
    rule: "The conjugated modal verb normally stands in position 2 and the main verb stays as an infinitive at the end.",
    structure: "Subject + modal verb + ... + infinitive.",
    use: "Use modal verbs to express obligation, advice, permission and ability.",
    watchOut: "Do not conjugate both verbs. The modal verb is conjugated; the second verb remains infinitive.",
    example: "Man sollte regelmäßig Sport treiben.",
  },
  9: {
    terms: "um … zu = in order to · damit = so that · indem = by doing · obwohl = although · trotzdem = nevertheless",
    rule: "Use um … zu mainly when the subject is the same. Use damit for a full purpose clause. obwohl sends the verb to the end; trotzdem starts a normal main clause.",
    structure: "um + ... + zu + infinitive · damit + subject + ... + verb · obwohl + ... + verb · trotzdem + verb + subject.",
    use: "Use these connectors to express purpose, method and contrast in more developed B1 answers.",
    watchOut: "Do not use um ... zu when the two clauses have different subjects; use damit instead.",
    example: "Ich mache Pausen, um konzentriert zu bleiben. · Obwohl ich viel arbeite, mache ich Pausen.",
  },
  10: {
    terms: "Komparativ = comparative · Superlativ = superlative · je … desto = the … the …",
    rule: "Use als after a comparative and wie after so/genauso. je … desto links two changes that develop together.",
    structure: "je + comparative + ..., desto + comparative + verb + subject ...",
    use: "Use je ... desto when one change directly influences another change.",
    watchOut: "The desto-clause behaves like a main clause, so the conjugated verb comes early.",
    example: "Je länger ich offline bin, desto ruhiger werde ich.",
  },
  11: {
    terms: "reziprok = reciprocal / each other",
    rule: "Forms such as miteinander, füreinander, voneinander, aufeinander and gegeneinander describe actions or relationships between two or more people.",
    structure: "Verb + reciprocal form: miteinander sprechen, voneinander lernen, füreinander da sein.",
    use: "Use reciprocal expressions when several people act toward one another.",
    watchOut: "Choose the preposition that belongs to the meaning of the verb instead of using miteinander for every situation.",
    example: "Im Team helfen wir einander und lernen voneinander.",
  },
  12: {
    terms: "Perfekt/Präteritum = past tenses · zeitliche Konnektoren = sequencing connectors",
    rule: "Use past forms to tell what happened and connectors such as zuerst, dann, danach and schließlich to make the sequence clear. weil and obwohl send the verb to the end.",
    structure: "Zuerst ... Dann ... Danach ... Schließlich ...; subordinate connectors still place the verb at the end.",
    use: "Use sequencing words to make a story or report easy to follow.",
    watchOut: "Avoid writing many disconnected past-tense sentences. Link them so the order of events is clear.",
    example: "Zuerst sind wir losgegangen. Obwohl es geregnet hat, sind wir weitergelaufen.",
  },
  13: {
    terms: "Passiv = passive voice · Bewertungsadjektive = evaluative adjectives",
    rule: "In the present passive, use werden + Partizip II. The passive focuses on the action or result rather than the person doing it.",
    structure: "Subject + form of werden + ... + Partizip II.",
    use: "Use passive voice when the action is more important than the person performing it, for example in a film review or process description.",
    watchOut: "Do not confuse werden as a passive auxiliary with werden meaning 'to become'. Context and the Partizip II show the passive.",
    example: "Der Film wird sehr überzeugend erzählt.",
  },
  14: {
    terms: "während = while/whereas · hingegen = by contrast · im Gegensatz zu = in contrast to",
    rule: "Use these structures to compare two sides. A während-clause places the conjugated verb at the end; hingegen usually works inside normal main-clause word order.",
    structure: "Während + subject + ... + verb, main clause. · X ist ..., Y hingegen ist ...",
    use: "Use these expressions when comparing traditional and digital learning or presenting two contrasting positions.",
    watchOut: "Hingegen does not automatically create a subordinate clause. Keep normal main-clause verb position.",
    example: "Während digitales Lernen flexibel ist, bietet Präsenzunterricht direkten Kontakt.",
  },
  15: {
    terms: "Passiv Präsens = present passive · Passiv mit Modalverb = passive with a modal verb",
    rule: "Present passive: werden + Partizip II. With a modal verb: modal verb + Partizip II + werden at the end.",
    structure: "Present passive: Die Daten werden gespeichert. Modal passive: Die Daten müssen geschützt werden.",
    use: "Use the passive for processes, rules and digital-work procedures when the action matters more than the person doing it.",
    watchOut: "Do not say 'Die Daten müssen werden geschützt.' With a modal verb, the end is Partizip II + werden: geschützt werden.",
    example: "Die Daten werden gespeichert. · Die Daten müssen geschützt werden.",
  },
  16: {
    terms: "Infinitiv mit zu = infinitive with zu · damit / um … zu = purpose",
    rule: "weil, dass and wenn send the conjugated verb to the end. Use um … zu mainly with the same subject; use damit when a full clause is needed.",
    structure: "um + ... + zu + infinitive · damit + subject + ... + conjugated verb.",
    use: "Use purpose structures to explain what you do to reduce stress or achieve a goal.",
    watchOut: "Do not add a new subject inside an um ... zu construction. If the subject changes, use damit.",
    example: "Ich lerne früh, um Stress zu vermeiden. · Ich plane Pausen, damit ich ruhig bleibe.",
  },
  17: {
    terms: "wenn = if/when · weil = because · dass = that · damit = so that · um … zu = in order to",
    rule: "These connectors help explain learning conditions, reasons and goals. In clauses with wenn, weil, dass and damit, the conjugated verb goes to the end.",
    structure: "Connector + subject + other information + conjugated verb at the end.",
    use: "Use these connectors to explain how, when and why you learn effectively.",
    watchOut: "When the subordinate clause comes first, the main clause still begins with its conjugated verb: Wenn ..., lerne ich ...",
    example: "Ich lerne besser, wenn ich regelmäßig Pausen mache.",
  },
  18: {
    terms: "Infinitiv mit zu = infinitive with zu · Relativsatz = relative clause · je nachdem = depending on",
    rule: "A relative clause gives extra information about a noun and places the conjugated verb at the end. je nachdem introduces different possibilities or conditions.",
    structure: "Noun, relative pronoun + ... + verb. · je nachdem, ob/wie/was ...",
    use: "Use relative clauses to describe jobs, skills and people more precisely.",
    watchOut: "Choose the relative pronoun according to gender and grammatical case, not only according to the noun's article.",
    example: "Ein Beruf, der zu mir passt, sollte abwechslungsreich sein.",
  },
  19: {
    terms: "Konjunktiv II = polite/hypothetical form · Sie-Form = formal you",
    rule: "Use könnte, würde and wäre to sound polite and professional. In explanatory clauses with weil, da and dass, the conjugated verb goes to the end.",
    structure: "Ich würde gern ... · Könnten Sie ...? · Ich wäre ...; weil/da/dass + ... + verb.",
    use: "Use these forms in job interviews, formal conversations and careful professional answers.",
    watchOut: "Avoid overly direct forms such as 'Geben Sie mir ...' when a polite request is expected.",
    example: "Ich würde gern erklären, warum ich mich für diese Stelle interessiere.",
  },
  20: {
    terms: "Relativsatz = relative clause · Modalverb = modal verb · Nebensatz = subordinate clause",
    rule: "Relative clauses describe a noun and place the conjugated verb at the end. Modal verbs express ability, necessity or expectations.",
    structure: "Noun + relative pronoun + ... + verb. · subject + modal verb + ... + infinitive.",
    use: "Use these structures when describing professions and the skills or duties they require.",
    watchOut: "In a relative clause, the verb goes to the end even when a modal verb is present.",
    example: "Ein Arzt ist eine Person, die Patienten untersucht. · Man muss gut kommunizieren können.",
  },
  21: {
    terms: "zweiteilige Konnektoren = paired connectors · Nebensatz = subordinate clause",
    rule: "Use paired connectors to weigh alternatives and advantages/disadvantages. Keep both parts of the connector together and watch verb position when a subordinate clause follows.",
    structure: "einerseits ..., andererseits ... · sowohl ... als auch ... · nicht nur ... sondern auch ...",
    use: "Use these connectors to present a balanced B1 argument about different lifestyles or family models.",
    watchOut: "Do not overload one sentence with several connector pairs. One clear contrast is usually stronger.",
    example: "Einerseits ist allein wohnen flexibel, andererseits kann es teuer sein.",
  },
  22: {
    terms: "dass-Satz = that-clause · Relativsatz = relative clause · reziprok = reciprocal",
    rule: "dass-clauses and relative clauses put the conjugated verb at the end. Reciprocal forms such as miteinander and füreinander describe mutual actions.",
    structure: "Ich finde, dass + ... + verb. · noun, relative pronoun + ... + verb. · miteinander/füreinander + verb.",
    use: "Use these structures to explain what is important in relationships and how people treat one another.",
    watchOut: "After dass, use statement word order with the verb at the end; do not use question word order.",
    example: "Ich finde, dass Vertrauen wichtig ist. · Partner sollten füreinander da sein.",
  },
  23: {
    terms: "Konjunktiv II = polite/hypothetical form · wenn = if/when · weil = because",
    rule: "Use könnten/würden for softer suggestions. In wenn- and weil-clauses, the conjugated verb goes to the end.",
    structure: "Wir könnten ... · Ich würde ... · wenn/weil + subject + ... + verb.",
    use: "Use these forms to make suggestions and explain choices in social situations such as arranging a first date.",
    watchOut: "Keep the verb at the end after wenn and weil, even if the clause contains several details.",
    example: "Wir könnten in ein Café gehen, weil man dort gut sprechen kann.",
  },
  24: {
    terms: "indem = by doing · dadurch, dass = by the fact that · je … desto = the … the … · Passiv = passive voice",
    rule: "Use indem to explain how something is done and je … desto to connect two changing quantities. Passive voice describes processes when the action matters more than the actor.",
    structure: "indem + subject + ... + verb · je + comparative + ..., desto + comparative + verb + subject · werden + Partizip II",
    use: "Use these forms to explain sustainable actions, environmental effects and general processes.",
    watchOut: "In the desto-clause the conjugated verb comes directly after the comparative phrase, while indem sends the verb to the end.",
    example: "Je bewusster wir einkaufen, desto weniger Abfall entsteht. · Plastik wird recycelt.",
  },
  25: {
    terms: "falls = if/in case · Relativsatz = relative clause · Passiv mit Modalverb = passive with a modal verb",
    rule: "Use falls for possible conditions, relative clauses to describe products or shops, and modal passive forms for rules and consumer rights.",
    structure: "falls + subject + ... + verb · noun + relative pronoun + ... + verb · modal verb + ... + Partizip II + werden",
    use: "Use these structures for online-shopping conditions, complaints, consumer protection and product descriptions.",
    watchOut: "With a modal passive, do not place werden before the participle. The end should be geschützt werden, zurückgeschickt werden, etc.",
    example: "Falls die Ware beschädigt ist, kann sie zurückgeschickt werden.",
  },
  26: {
    terms: "Plusquamperfekt = past perfect · nachdem = after · bevor = before · Konjunktiv II = polite/hypothetical form",
    rule: "Use Plusquamperfekt for an event that happened before another past event. nachdem and bevor make the sequence explicit; Konjunktiv II makes requests more polite.",
    structure: "hatte/war + Partizip II · nachdem/bevor + subject + ... + verb · Könnten/Würden Sie ...?",
    use: "Use these forms when narrating travel problems in order and when asking staff for help politely.",
    watchOut: "Do not use Plusquamperfekt for every past sentence. Use it mainly when you need to show which past event happened first.",
    example: "Der Zug war schon abgefahren, als wir ankamen. · Könnten Sie mir bitte weiterhelfen?",
  },
  27: {
    terms: "indem = by doing · statt … zu = instead of doing · ohne … zu = without doing · um … zu = in order to",
    rule: "These infinitive and subordinate structures help explain methods, alternatives, avoided actions and goals. Use the zu-forms mainly when the subject stays the same.",
    structure: "indem + ... + verb · statt/ohne/um + ... + zu + infinitive",
    use: "Use them to describe practical eco-friendly habits and explain what you do instead, what you avoid and why.",
    watchOut: "If the subject changes, a full clause such as ohne dass or damit is often needed instead of a simple zu-construction.",
    example: "Statt mit dem Auto zu fahren, nehme ich den Bus. · Ich kaufe regional, um Transportwege zu verkürzen.",
  },
  28: {
    terms: "je … desto = the … the … · obwohl = although · trotzdem = nevertheless · Konjunktiv II = hypothetical form",
    rule: "Use je … desto for linked changes, obwohl for a subordinate contrast and trotzdem for a contrasting main clause. Konjunktiv II expresses realistic hypothetical proposals.",
    structure: "je + comparative + ..., desto + comparative + verb + subject · obwohl + ... + verb · trotzdem + verb + subject",
    use: "Use these structures to discuss climate consequences, obstacles and realistic policy or personal proposals.",
    watchOut: "Do not use the same word order after obwohl and trotzdem: obwohl sends the verb to the end; trotzdem is followed by normal main-clause inversion.",
    example: "Obwohl Busfahren länger dauert, nutze ich den Bus. Trotzdem fahre ich manchmal Auto.",
  },
});

export const getB1GrammarEnglishSupport = (day) =>
  SUPPORT_BY_DAY[Number(day)] || null;

const helpCard = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  background: "#fff",
  padding: 12,
  display: "grid",
  gap: 4,
  lineHeight: 1.6,
};

export default function B1GrammarEnglishSupport({ day }) {
  const support = getB1GrammarEnglishSupport(day);
  if (!support) return null;

  return (
    <aside
      data-b1-grammar-english-support="true"
      style={{
        border: "2px solid #93c5fd",
        background: "#eff6ff",
        borderRadius: 16,
        padding: 16,
        display: "grid",
        gap: 12,
        lineHeight: 1.65,
      }}
    >
      <div style={{ display: "grid", gap: 3 }}>
        <strong style={{ fontSize: "1.05rem", color: "#1d4ed8" }}>
          English support · Read this before the German grammar notes
        </strong>
        <span style={{ color: "#475569", fontSize: "0.92rem" }}>
          The lesson stays mainly in German, but these explanations make the grammar rule and word order clear in English.
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
        <div style={helpCard}>
          <strong>Key terms</strong>
          <span>{support.terms}</span>
        </div>
        <div style={helpCard}>
          <strong>What the rule means</strong>
          <span>{support.rule}</span>
        </div>
        <div style={helpCard}>
          <strong>Sentence structure</strong>
          <span>{support.structure}</span>
        </div>
        <div style={helpCard}>
          <strong>When to use it</strong>
          <span>{support.use}</span>
        </div>
        <div style={{ ...helpCard, background: "#fff7ed", borderColor: "#fed7aa" }}>
          <strong>Common mistake to avoid</strong>
          <span>{support.watchOut}</span>
        </div>
        <div style={{ ...helpCard, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
          <strong>German example</strong>
          <span>{support.example}</span>
        </div>
      </div>
    </aside>
  );
}
