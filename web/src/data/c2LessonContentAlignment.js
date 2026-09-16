import { C2_DAY_1_TO_7_MASTERY } from "./c2Day1To7Mastery";
import { C2_DAY_8_TO_14_MASTERY } from "./c2Day8To14Mastery";
import { C2_DAY_15_TO_21_MASTERY } from "./c2Day15To21Mastery";
import { C2_DAY_22_TO_28_MASTERY } from "./c2Day22To28Mastery";

const C2_CANONICAL_MASTERY = Object.freeze({
  ...C2_DAY_1_TO_7_MASTERY,
  ...C2_DAY_8_TO_14_MASTERY,
  ...C2_DAY_15_TO_21_MASTERY,
  ...C2_DAY_22_TO_28_MASTERY,
});

// Extra collocations are deliberately keyed by the canonical C2 day. They only
// supplement the collocations already authored in that day's mastery lesson.
// This prevents a second, stale topic list from drifting away from Course Book.
const C2_COLLOCATION_SUPPLEMENTS = Object.freeze({
  1: [["sprachliche Zugehörigkeit signalisieren","signal linguistic belonging","Die Wortwahl kann sprachliche Zugehörigkeit zu einer Gruppe signalisieren."],["ein Register wählen","choose a register","Je nach Adressat muss ein angemessenes Register gewählt werden."],["soziale Distanz markieren","mark social distance","Ein sehr formeller Ton kann soziale Distanz markieren."]],
  2: [["Lerninhalte strukturieren","structure learning content","Lehrkräfte strukturieren komplexe Lerninhalte nach ihrer Relevanz."],["Vorwissen aktivieren","activate prior knowledge","Eine gute Einführung aktiviert vorhandenes Vorwissen."],["Informationen adressatengerecht aufbereiten","prepare information for an audience","Fachwissen muss für unterschiedliche Zielgruppen adressatengerecht aufbereitet werden."]],
  3: [["Daten auswerten","analyse data","Forschende werten die erhobenen Daten systematisch aus."],["eine Schlussfolgerung absichern","support a conclusion","Zusätzliche Messungen können eine Schlussfolgerung empirisch absichern."],["Evidenz vorlegen","present evidence","Für die These muss belastbare Evidenz vorgelegt werden."]],
  4: [["eine Quelle überprüfen","verify a source","Vor der Veröffentlichung sollte die Quelle überprüft werden."],["Berichterstattung einordnen","contextualise coverage","Lesende müssen zugespitzte Berichterstattung kritisch einordnen."],["Distanz zu einer Behauptung wahren","maintain distance from a claim","Journalistische Texte sollten Distanz zu unbelegten Behauptungen wahren."]],
  5: [["politische Verantwortung übernehmen","assume political responsibility","Amtsträger müssen für ihre Entscheidungen politische Verantwortung übernehmen."],["eine Position begründen","justify a position","Eine demokratische Debatte verlangt, dass Positionen nachvollziehbar begründet werden."],["Vertrauen zurückgewinnen","regain trust","Transparente Kommunikation kann helfen, verlorenes Vertrauen zurückzugewinnen."]],
  6: [["Chancengleichheit fördern","promote equal opportunity","Gezielte Investitionen können Chancengleichheit fördern."],["Einkommensunterschiede verringern","reduce income disparities","Steuerpolitische Maßnahmen sollen Einkommensunterschiede verringern."],["strukturelle Nachteile ausgleichen","offset structural disadvantages","Förderprogramme können strukturelle Nachteile teilweise ausgleichen."]],
  7: [["Leistungsdruck ausgesetzt sein","be exposed to performance pressure","Viele Beschäftigte sind dauerhaft hohem Leistungsdruck ausgesetzt."],["Handlungsspielraum gewähren","grant scope for action","Flexible Teams sollten ihren Mitgliedern echten Handlungsspielraum gewähren."],["Arbeitsbedingungen gestalten","shape working conditions","Unternehmen können Arbeitsbedingungen gesundheitsförderlich gestalten."]],
  8: [["algorithmische Entscheidungen treffen","make algorithmic decisions","Automatisierte Systeme treffen zunehmend algorithmische Entscheidungen."],["Trainingsdaten prüfen","check training data","Vor dem Einsatz müssen Trainingsdaten auf Verzerrungen geprüft werden."],["Verantwortung für KI-Systeme tragen","bear responsibility for AI systems","Anbieter tragen Verantwortung für nachvollziehbare KI-Systeme."]],
  9: [["personenbezogene Daten verarbeiten","process personal data","Plattformen dürfen personenbezogene Daten nur auf einer klaren Grundlage verarbeiten."],["Datenschutz gewährleisten","ensure data protection","Technische Maßnahmen müssen einen wirksamen Datenschutz gewährleisten."],["digitale Selbstbestimmung schützen","protect digital self-determination","Transparente Regeln sollen digitale Selbstbestimmung schützen."]],
  10: [["eine Nutzen-Risiko-Abwägung vornehmen","perform a risk-benefit assessment","Vor einer Therapie ist eine sorgfältige Nutzen-Risiko-Abwägung vorzunehmen."],["medizinische Evidenz bewerten","assess medical evidence","Fachgremien bewerten die medizinische Evidenz vor einer Empfehlung."],["ethische Verantwortung tragen","bear ethical responsibility","Medizinische Entscheidungen tragen immer auch eine ethische Verantwortung in sich."]],
  11: [["Emissionen reduzieren","reduce emissions","Langfristige Klimapolitik muss Emissionen deutlich reduzieren."],["Ressourcen schonen","conserve resources","Kreislaufwirtschaft kann natürliche Ressourcen schonen."],["nachhaltige Entwicklung fördern","promote sustainable development","Investitionen in Infrastruktur können nachhaltige Entwicklung fördern."]],
  12: [["Qualifikationen anerkennen","recognise qualifications","Transparente Verfahren erleichtern es, ausländische Qualifikationen anzuerkennen."],["gesellschaftliche Teilhabe ermöglichen","enable social participation","Barrierearme Angebote sollen gesellschaftliche Teilhabe ermöglichen."],["Hürden beim Zugang abbauen","remove access barriers","Beratungsstellen helfen, Hürden beim Zugang zu Leistungen abzubauen."]],
  13: [["kulturelles Erbe bewahren","preserve cultural heritage","Archive und Museen helfen, kulturelles Erbe zu bewahren."],["Vergangenheit deuten","interpret the past","Gesellschaften deuten ihre Vergangenheit aus wechselnden Perspektiven."],["kollektive Erinnerung prägen","shape collective memory","Öffentliche Rituale können die kollektive Erinnerung prägen."]],
  14: [["eine Textstelle deuten","interpret a passage","Eine überzeugende Analyse deutet die Textstelle anhand sprachlicher Hinweise."],["eine alternative Lesart entwickeln","develop an alternative reading","Mehrdeutige Motive erlauben es, eine alternative Lesart zu entwickeln."],["sprachliche Wirkung analysieren","analyse linguistic effect","Die Interpretation sollte die sprachliche Wirkung konkreter Mittel analysieren."]],
  15: [["Preis und Leistung abwägen","weigh price and performance","Konsumenten wägen Preis und Leistung vor einer Entscheidung gegeneinander ab."],["Kaufentscheidungen vergleichen","compare purchase decisions","Die Studie vergleicht Kaufentscheidungen verschiedener Gruppen."],["Nutzen realistisch bewerten","assess benefit realistically","Werbung erschwert es mitunter, den tatsächlichen Nutzen realistisch zu bewerten."]],
  16: [["Werbewirkung untersuchen","examine advertising effects","Die Studie untersucht die Werbewirkung auf junge Zielgruppen."],["eine Zielgruppe ansprechen","address a target group","Personalisierte Werbung spricht eine klar definierte Zielgruppe an."],["eine Botschaft verdichten","condense a message","Gute Kampagnen verdichten ihre Botschaft auf wenige zentrale Aussagen."]],
  17: [["eine Bedingung erfüllen","fulfil a condition","Der Anspruch besteht nur, wenn die festgelegte Bedingung erfüllt ist."],["eine Voraussetzung schaffen","create a prerequisite","Verlässliche Infrastruktur schafft eine wichtige Voraussetzung für Teilhabe."],["an eine Voraussetzung geknüpft sein","be tied to a prerequisite","Die Förderung ist an mehrere Voraussetzungen geknüpft."]],
  18: [["eine Möglichkeit ungenutzt lassen","leave an opportunity unused","Die Institution ließ eine realistische Möglichkeit ungenutzt."],["Folgen vermeiden","avoid consequences","Durch früheres Handeln hätten sich einige Folgen vermeiden lassen."],["rückblickend beurteilen","assess in retrospect","Rückblickend lässt sich die Entscheidung differenzierter beurteilen."]],
  19: [["globale Verflechtungen berücksichtigen","consider global interdependencies","Wirtschaftspolitik muss globale Verflechtungen berücksichtigen."],["Abhängigkeiten verringern","reduce dependencies","Diversifizierung kann einseitige Abhängigkeiten verringern."],["Interessen miteinander abwägen","weigh interests against each other","Internationale Regeln müssen unterschiedliche Interessen miteinander abwägen."]],
  20: [["eine Vermutung andeuten","signal a supposition","Mit wohl lässt sich eine Vermutung vorsichtig andeuten."],["eine Haltung nuancieren","nuance a stance","Diskurspartikeln können eine Haltung fein nuancieren."],["gesprochene Sprache natürlich gestalten","make spoken language natural","Passende Partikeln gestalten gesprochene Sprache natürlicher."]],
  21: [["in Erwägung ziehen","take into consideration","Die Leitung zieht mehrere Alternativen in Erwägung."],["zur Kenntnis nehmen","take note of","Das Gremium nahm die Kritik zur Kenntnis."],["eine Maßnahme ergreifen","take a measure","Die Behörde ergriff eine kurzfristige Maßnahme."],["Verantwortung übernehmen","assume responsibility","Die Leitung übernahm Verantwortung für die Entscheidung."]],
  22: [["eine Zäsur markieren","mark a turning point","Das Ereignis markierte eine historische Zäsur."],["Vergangenheit aufarbeiten","come to terms with the past","Institutionen müssen problematische Teile ihrer Vergangenheit aufarbeiten."],["Erinnerung wachhalten","keep memory alive","Gedenkorte helfen, gesellschaftliche Erinnerung wachzuhalten."],["Ereignisse chronologisch einordnen","place events chronologically","Historische Analysen ordnen Ereignisse chronologisch ein."]],
  23: [["einen Kompromiss aushandeln","negotiate a compromise","Die Delegationen versuchten, einen tragfähigen Kompromiss auszuhandeln."],["Gesprächsbereitschaft signalisieren","signal willingness to talk","Beide Seiten signalisierten weitere Gesprächsbereitschaft."],["diplomatische Beziehungen pflegen","maintain diplomatic relations","Staaten pflegen auch bei Konflikten diplomatische Beziehungen."],["einen Vorbehalt formulieren","formulate a reservation","Die Delegation formulierte ihren Vorbehalt bewusst zurückhaltend."]],
  24: [["einen Beleg anführen","cite evidence","Für die These sollte ein konkreter Beleg angeführt werden."],["eine Prämisse prüfen","examine a premise","Vor der Schlussfolgerung muss die zugrunde liegende Prämisse geprüft werden."],["ein Gegenargument berücksichtigen","consider a counterargument","Eine differenzierte Stellungnahme berücksichtigt ein starkes Gegenargument."],["eine Argumentationslinie entwickeln","develop a line of argument","Der Text entwickelt eine nachvollziehbare Argumentationslinie."]],
  25: [["Daten statistisch auswerten","analyse data statistically","Die Forschenden werten die erhobenen Daten statistisch aus."],["eine Korrelation feststellen","identify a correlation","Die Studie stellt eine deutliche Korrelation fest."],["die Belastbarkeit prüfen","test robustness","Weitere Analysen prüfen die Belastbarkeit des Ergebnisses."],["einen Kausalzusammenhang ausschließen","rule out a causal relationship","Aus der Korrelation lässt sich ein Kausalzusammenhang nicht sicher ableiten oder ausschließen."]],
  26: [["einen Begriff definieren","define a concept","Zu Beginn muss der zentrale Begriff präzise definiert werden."],["eine Prämisse hinterfragen","question a premise","Philosophische Analyse verlangt, auch grundlegende Prämissen zu hinterfragen."],["eine Position logisch herleiten","derive a position logically","Die Position wird aus mehreren Annahmen logisch hergeleitet."],["einen Widerspruch aufzeigen","demonstrate a contradiction","Das Gedankenexperiment zeigt einen möglichen Widerspruch auf."]],
  27: [["einen Text redigieren","edit a text","Vor der Abgabe sollte der Text sorgfältig redigiert werden."],["Bezüge eindeutig herstellen","make references unambiguous","Pronomen müssen eindeutige Bezüge herstellen."],["das Register anpassen","adjust the register","Für einen Fachartikel ist das Register konsequent anzupassen."],["sprachliche Präzision erhöhen","increase linguistic precision","Konkrete Verben erhöhen die sprachliche Präzision."]],
  28: [["Kompetenzen flexibel übertragen","transfer skills flexibly","C2-Lernende übertragen ihre Kompetenzen flexibel auf neue Aufgaben."],["Register sicher wechseln","switch register confidently","Im Prüfungskontext muss man Register sicher wechseln können."],["Evidenz differenziert bewerten","assess evidence in a nuanced way","Starke Antworten bewerten Evidenz differenziert statt absolut."],["Argumente kohärent verknüpfen","link arguments coherently","Konnektoren helfen, Argumente kohärent zu verknüpfen."]],
});

const C2_GRAMMAR_GUIDANCE = Object.freeze({
  1:["Use register shifts to express the same meaning appropriately for different audiences.","Keep the core proposition stable; change vocabulary, stance markers and degree of explicitness rather than distorting the message.","Do not confuse formal language with unnecessarily long or archaic language."],
  2:["Use information structure to control what the reader processes as known, new or especially important.","German main clauses keep the finite verb in position two; moving an element into the Vorfeld changes focus, not the verb-second rule.","Do not front an element unless the resulting focus matches the intended message."],
  3:["Use nominal style for compact academic reference and verbal style when actions and agents should remain transparent.","When nominalising, preserve the logical roles with genitives or prepositional complements; when verbalising, restore a clear subject and finite verb.","Avoid stacking several abstract nouns when a clear verb would be easier to process."],
  4:["Use indirect speech to attribute information and mark distance from a source.","Konjunktiv I normally keeps the reporting clause separate from the reported proposition; use Konjunktiv II where forms would otherwise be ambiguous.","Do not present a disputed quotation as an established fact after removing the source marker."],
  5:["Use subjective modal verbs to distinguish hearsay, self-report and degrees of probability.","With past reference, combine the modal with Infinitiv Perfekt: soll/will/dürfte + Partizip II + haben/sein.","Do not read wollen + Infinitiv Perfekt literally as intention; it can mark what the subject claims about themself."],
  6:["Choose causal language according to the strength of the evidence.","Resultieren aus points back to a cause; führen zu and zur Folge haben point forward to a consequence.","Do not turn correlation into proven causation by using verursachen without evidence."],
  7:["Use Funktionsverbgefüge when they are idiomatic and useful for formal compression.","Learn each noun together with its fixed verb and required preposition/case.","Avoid literal translations such as Einfluss machen when German requires Einfluss nehmen."],
  8:["Use participial attributes to condense technical information without losing readability.","The participial group stands before the noun and carries adjective endings; unpack it into a relative clause when it becomes overloaded.","Do not pile several long modifiers before one noun if the reader can no longer identify the head noun quickly."],
  9:["Use passive alternatives to distinguish possibility, obligation and impersonal agency.","sich lassen + Infinitiv expresses possibility; sein + zu + Infinitiv often expresses necessity; -bar forms an adjective.","Do not treat all passive substitutes as interchangeable: their modality differs."],
  10:["Use subjective modal verbs to grade evidential certainty in medical and ethical claims.","For past inference use könnte/dürfte/muss + Partizip II + haben/sein.","Do not upgrade plausible evidence to certainty with muss unless the inference is genuinely strong."],
  11:["Use concessive and adversative structures to integrate objections while preserving your argument.","wenngleich/obgleich introduce subordinate clauses; ungeachtet takes a nominal complement; wohingegen contrasts two clauses.","Do not use a concessive marker when you actually mean cause or consequence."],
  12:["Learn verbs, nouns and adjectives together with their required prepositions and cases.","The case is controlled by the lexical item: teilhaben an + Dat., angewiesen sein auf + Akk., Beitrag zu + Dat.","Do not choose a preposition by translating directly from English."],
  13:["Use word formation to decode and create precise terms while keeping them transparent.","Identify the base, prefix/suffix and semantic relation inside compounds before forming a new word.","Avoid artificial compounds that are grammatically possible but not idiomatic or interpretable."],
  14:["Separate textual observation from interpretation and mark alternative readings cautiously.","Use verbs such as nahelegen, transportieren and charakterisieren to connect linguistic evidence with interpretation.","Do not present a possible symbolic reading as the only factual meaning of a passage."],
  15:["Use intensifiers and comparison structures to express degree precisely rather than simply saying besser/schlechter.","bei weitem and weitaus strengthen a comparison; im Vergleich zu takes Dativ; insofern als introduces the respect in which a judgement applies.","Do not intensify every evaluation; choose the degree that the evidence supports."],
  16:["Condense related information with relative clauses, participial attributes, nominalisation and apposition.","Keep the main proposition structurally visible and attach secondary information hierarchically.","Do not confuse density with quality: an unreadable sentence should be unpacked."],
  17:["Use conditional structures to specify whether something is a simple condition, formal prerequisite or hypothetical case.","sofern/falls send the finite verb to the end; unter der Voraussetzung, dass introduces a noun phrase plus dass-clause.","Do not use sofern when the relationship is temporal rather than conditional."],
  18:["Use Konjunktiv II Vergangenheit for unreal past conditions, missed opportunities and hypothetical consequences.","Build it with hätte/wäre + Partizip II; modal constructions use hätte + infinitive chain where required.","Do not mix a past unreal condition with an indicative consequence if both are hypothetical."],
  19:["Use complex connectors only when their logical relation is exact.","insofern als specifies a limited respect; zumal adds a reinforcing reason; vielmehr corrects; geschweige denn strengthens a negative progression.","Do not choose advanced connectors merely for difficulty—the semantic relation must fit."],
  20:["Use discourse particles to signal stance, shared knowledge, concession or probability in natural spoken German.","Particles usually occupy the Mittelfeld and are typically unstressed; their effect depends strongly on context and intonation.","Do not translate particles word-for-word or insert them randomly into formal written prose."],
  21:["Treat fixed verb-noun combinations as lexical units.","Memorise the noun together with its conventional verb, article and any preposition.","Avoid productive but non-idiomatic combinations such as eine Entscheidung machen."],
  22:["Use temporal connectors to organise historical sequence, anteriority and simultaneity.","nachdem and ehe introduce subordinate clauses with final verbs; tense choice should make the sequence unambiguous.","Do not rely on connector variety while leaving the chronology unclear."],
  23:["Use hedging to disagree, criticise and negotiate without unnecessary confrontation.","Combine stance frames such as lässt sich nur bedingt teilen with concessive or conditional clauses to state limits precisely.","Do not weaken a position so much that the actual reservation becomes impossible to identify."],
  24:["Build an argument as claim, reason, evidence, objection, response and conclusion.","Use connectors and reference expressions so each sentence shows its logical role in relation to the previous one.","Do not repeat the thesis after an objection; answer, qualify or rebut the objection."],
  25:["Grade statements according to the strength of statistical evidence.","belegen is stronger than nahelegen or darauf hindeuten; causal wording requires more than a correlation.","Do not use beweisen for data that only suggest an association."],
  26:["Use complex sentence periods to represent logical hierarchy, not simply to make sentences longer.","Keep one clear main-clause spine and embed subordinate information where its logical dependency is visible.","Do not stack parenthetical clauses until the reader loses the main proposition."],
  27:["Revise academic and professional prose for precision, cohesion, register and economy.","Replace weak verb-noun padding with precise verbs where possible and make pronoun/reference chains unambiguous.","Do not equate academic style with nominalisation, passive voice or length in every sentence."],
  28:["Combine C2 resources flexibly according to task, audience, evidence and communicative purpose.","Choose register, information structure, connectors and reformulation strategies from function first, then check form.","Do not display complexity for its own sake; C2 control means selecting the most appropriate option."],
});

const uniqueCollocations = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = String(item?.[0] || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getCanonicalC2Mastery = (day) => C2_CANONICAL_MASTERY[Number(day)] || null;

const enhanceC2Mastery = (day, source = null) => {
  const dayNumber = Number(day);
  const canonical = getCanonicalC2Mastery(dayNumber);
  const mastery = canonical || source;
  if (!mastery) return null;

  const collocations = uniqueCollocations([
    ...(Array.isArray(mastery.collocations) ? mastery.collocations : []),
    ...(C2_COLLOCATION_SUPPLEMENTS[dayNumber] || []),
  ]).slice(0, 6);
  const guidance = C2_GRAMMAR_GUIDANCE[dayNumber] || [
    `Use ${mastery.grammarFocus} when it makes the meaning more precise.`,
    "Keep the sentence structure transparent and preserve the intended logical relation.",
    "Do not add complexity unless it improves meaning, register or cohesion.",
  ];
  const contrast = Array.isArray(mastery.contrast) ? mastery.contrast : [];
  const nuance = mastery.nuance || {};
  const examples = contrast.filter(Boolean);

  return {
    ...source,
    ...mastery,
    collocationTopic: mastery.title,
    collocations,
    grammarNotes: {
      title: mastery.grammarFocus,
      usage: guidance[0],
      wordOrder: guidance[1],
      examples,
      commonMistakes: [guidance[2]],
    },
    grammarChecks: [
      {
        question: nuance.q,
        options: Array.isArray(nuance.o) ? nuance.o : [],
        answerIndex: Number.isInteger(nuance.a) ? nuance.a : 0,
        explanation: nuance.e || "Choose the option that best matches the target meaning and register.",
      },
      ...(examples.length >= 2 ? [{
        question: `Which version best demonstrates controlled use of ${mastery.grammarFocus}?`,
        options: examples,
        answerIndex: examples.length - 1,
        explanation: `The final version is the most explicit model of today's target: ${mastery.grammarFocus}. It should be chosen for precision and function, not simply because it is longer.`,
      }] : []),
    ],
    writingExercise: {
      prompt: mastery.challenge || mastery.production,
      planningPrompt: mastery.production || "Plan the content before writing.",
      modelAnswer: [mastery.reformulation?.[1], collocations[0]?.[2], examples.at(-1)]
        .filter(Boolean)
        .filter((value, index, array) => array.indexOf(value) === index)
        .join(" "),
    },
  };
};

const C2_LESSON_CONTENT_ALIGNMENT = Object.freeze(
  Object.fromEntries(
    Object.keys(C2_CANONICAL_MASTERY).map((key) => {
      const day = Number(key);
      return [day, Object.freeze(enhanceC2Mastery(day))];
    }),
  ),
);

const getC2LessonContentAlignment = (day) => C2_LESSON_CONTENT_ALIGNMENT[Number(day)] || null;

const alignC2CurriculumEntry = (entry = {}) => {
  const level = String(entry.level || "").trim().toUpperCase();
  if (level !== "C2") return entry;
  const mastery = getC2LessonContentAlignment(entry.day ?? entry.assignmentDay);
  if (!mastery) return entry;

  return {
    ...entry,
    chapter: mastery.chapter,
    title: mastery.title,
    topic: mastery.title,
    lessonTitle: mastery.title,
    assignmentTitle: mastery.title,
    lessonTopic: mastery.topic,
    grammar_topic: mastery.grammarFocus,
    grammarFocus: mastery.grammarFocus,
    c2Mastery: mastery,
    collocations: mastery.collocations,
    grammarNotes: mastery.grammarNotes,
    grammarChecks: mastery.grammarChecks,
    writingExercise: mastery.writingExercise,
  };
};

const alignC2CurriculumEntries = (entries = []) => entries.map((entry) => alignC2CurriculumEntry(entry));

const alignC2SelfLearningLesson = (lesson = {}) => {
  if (String(lesson.level || "").toUpperCase() !== "C2") return lesson;
  const mastery = getC2LessonContentAlignment(lesson.day);
  if (!mastery) return lesson;
  return { ...lesson, ...mastery, c2Mastery: mastery };
};

export {
  C2_CANONICAL_MASTERY,
  C2_COLLOCATION_SUPPLEMENTS,
  C2_LESSON_CONTENT_ALIGNMENT,
  getCanonicalC2Mastery,
  getC2LessonContentAlignment,
  enhanceC2Mastery,
  alignC2CurriculumEntry,
  alignC2CurriculumEntries,
  alignC2SelfLearningLesson,
};
