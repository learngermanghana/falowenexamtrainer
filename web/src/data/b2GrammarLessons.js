import { getB2LessonContentAlignment } from "./b2LessonContentAlignment";

const focus = (title, english, explanation, pattern, rules, examples) =>
  Object.freeze({ title, english, explanation, pattern, rules: Object.freeze(rules), examples: Object.freeze(examples) });

const B2_GRAMMAR_FOCUS_LIBRARY = Object.freeze({
  method: focus(
    "indem / dadurch, dass",
    "method / how something is achieved",
    "Mit indem und dadurch, dass erklärst du die Methode, durch die ein Ergebnis erreicht wird. Beide Strukturen beantworten sinngemäß die Frage: Wie wird das erreicht?",
    "Hauptsatz + indem + ... Verb am Ende | Hauptsatz + dadurch, dass + ... Verb am Ende",
    [
      "Nach indem und dass steht das konjugierte Verb am Ende des Nebensatzes.",
      "indem ist kompakter; dadurch, dass hebt die Methode stärker hervor.",
    ],
    [
      "Man reduziert Abfall, indem man Mehrwegprodukte benutzt.",
      "Der Energieverbrauch sinkt dadurch, dass Gebäude besser gedämmt werden.",
    ],
  ),
  purpose: focus(
    "um ... zu / damit",
    "purpose / goal",
    "Mit um ... zu und damit formulierst du ein Ziel. um ... zu passt normalerweise, wenn Haupt- und Nebensatz dasselbe Subjekt haben. damit ist flexibler und erlaubt unterschiedliche Subjekte.",
    "um + ... + zu + Infinitiv | damit + Subjekt + ... + Verb am Ende",
    [
      "Nutze um ... zu bei gleichem Handelnden.",
      "Nutze damit, wenn das Subjekt im Zielsatz ausdrücklich genannt werden soll oder wechselt.",
    ],
    [
      "Viele Menschen fahren Fahrrad, um Emissionen zu reduzieren.",
      "Die Stadt baut sichere Radwege, damit mehr Menschen das Fahrrad nutzen.",
    ],
  ),
  consequence: focus(
    "wodurch / sodass",
    "result / consequence",
    "wodurch und sodass verbinden eine Ursache mit ihrer Folge. wodurch bezieht sich oft auf eine ganze vorherige Handlung; sodass leitet direkt das Ergebnis ein.",
    "Aussage, wodurch + ... Verb am Ende | Aussage, sodass + ... Verb am Ende",
    [
      "Nach wodurch und sodass steht das konjugierte Verb am Ende.",
      "Formuliere zuerst Ursache oder Maßnahme und danach die konkrete Folge.",
    ],
    [
      "Mehr Produkte werden repariert, wodurch weniger Müll entsteht.",
      "Der öffentliche Verkehr wurde ausgebaut, sodass mehr Menschen auf das Auto verzichten können.",
    ],
  ),
  passive: focus(
    "Passiv",
    "passive voice",
    "Das Vorgangspassiv rückt den Prozess oder die Handlung in den Mittelpunkt. Der Handelnde ist unwichtig, unbekannt oder kann mit von + Dativ ergänzt werden.",
    "werden + Partizip II",
    [
      "Präsens: wird / werden + Partizip II.",
      "Präteritum: wurde / wurden + Partizip II.",
      "Perfekt: ist / sind + Partizip II + worden.",
    ],
    [
      "Verpackungen werden getrennt gesammelt.",
      "Neue Regeln wurden im letzten Jahr eingeführt.",
    ],
  ),
  modalPassive: focus(
    "Modalpassiv",
    "modal verb + passive",
    "Das Modalpassiv verbindet müssen, sollen, können oder dürfen mit dem Passiv. Es eignet sich besonders für Regeln, Pflichten, Möglichkeiten und Empfehlungen.",
    "Modalverb + ... + Partizip II + werden",
    [
      "Das Modalverb steht konjugiert auf Position zwei.",
      "Am Satzende stehen Partizip II + werden.",
    ],
    [
      "Recyclingmaterialien müssen besser gekennzeichnet werden.",
      "Digitale Systeme können transparenter gestaltet werden.",
    ],
  ),
  nominalization: focus(
    "Nominalisierung",
    "turning actions/qualities into nouns",
    "Nominalisierungen machen Aussagen kompakter und sachlicher. Verben oder Adjektive werden als Nomen verwendet und großgeschrieben.",
    "Verb / Adjektiv → Nomen: verbessern → die Verbesserung; nachhaltig → die Nachhaltigkeit",
    [
      "Nominalisierte Wörter werden großgeschrieben.",
      "Nutze Nominalisierungen besonders in sachlichen B2-Texten, aber vermeide unnötig schwere Nominalketten.",
    ],
    [
      "Die Wiederverwendung von Produkten spart Rohstoffe.",
      "Durch die Verbesserung der Infrastruktur sinkt die Belastung.",
    ],
  ),
  relative: focus(
    "Relativsätze",
    "relative clauses",
    "Relativsätze geben zusätzliche Informationen zu einem Nomen. Das Relativpronomen richtet sich im Genus und Numerus nach dem Bezugswort; der Kasus hängt von seiner Funktion im Relativsatz ab.",
    "Nomen, Relativpronomen + ... + Verb am Ende",
    [
      "Das Verb steht im Relativsatz am Ende.",
      "Bestimme zuerst das Bezugswort und danach die Funktion des Relativpronomens im Nebensatz.",
    ],
    [
      "Eine Schule, die zusätzliche Förderung anbietet, verbessert Bildungschancen.",
      "Das System, das viele Daten verarbeitet, muss transparent sein.",
    ],
  ),
  relativePrep: focus(
    "Relativsätze mit Präpositionen",
    "relative clauses after prepositions",
    "Steht im Relativsatz eine Präposition, steht sie direkt vor dem Relativpronomen. Der Kasus wird von der Präposition bestimmt.",
    "Nomen, Präposition + Relativpronomen + ... + Verb am Ende",
    [
      "Präposition und Relativpronomen bleiben zusammen: mit dem, für die, über das, an denen.",
      "Der Kasus folgt der Präposition, nicht automatisch dem Bezugswort.",
    ],
    [
      "Das Viertel, in dem viele Familien wohnen, braucht bessere Busverbindungen.",
      "Die Plattform, über die Daten gesammelt werden, muss klare Regeln haben.",
    ],
  ),
  proportional: focus(
    "je ... desto",
    "the more ... the more / less",
    "Mit je ... desto beschreibst du zwei Entwicklungen, die miteinander zusammenhängen. Der je-Satz ist ein Nebensatz; der desto-Satz folgt der Hauptsatzwortstellung.",
    "Je + Komparativ + ... + Verb am Ende, desto + Komparativ + Verb + Subjekt ...",
    [
      "Im je-Satz steht das konjugierte Verb am Ende.",
      "Nach desto folgt im Hauptsatz direkt das konjugierte Verb.",
    ],
    [
      "Je besser der Nahverkehr ist, desto weniger Menschen fahren mit dem Auto.",
      "Je früher Kinder gefördert werden, desto größer sind ihre Bildungschancen.",
    ],
  ),
  concession: focus(
    "obwohl / trotz",
    "concession / despite",
    "obwohl und trotz zeigen einen Gegensatz zu einer Erwartung. obwohl leitet einen Nebensatz ein; trotz steht mit einem Nomen oder einer Nominalgruppe.",
    "obwohl + ... Verb am Ende | trotz + Genitiv/Dativ in üblichem Sprachgebrauch",
    [
      "Nach obwohl steht das konjugierte Verb am Ende.",
      "Nach trotz folgt kein Nebensatz, sondern eine Nominalgruppe.",
    ],
    [
      "Obwohl die Mieten steigen, ziehen weiterhin viele Menschen in die Stadt.",
      "Trotz hoher Kosten bleibt Weiterbildung für viele wichtig.",
    ],
  ),
  concessionExtended: focus(
    "obgleich",
    "formal concession / although",
    "obgleich funktioniert grammatisch wie obwohl, wirkt aber formeller und eignet sich besonders für schriftliche Argumentation.",
    "obgleich + ... Verb am Ende",
    [
      "Das konjugierte Verb steht am Ende.",
      "Nutze obgleich sparsam als formellere Alternative zu obwohl.",
    ],
    [
      "Obgleich gute Sprachkenntnisse wichtig sind, hängt Integration von mehreren Faktoren ab.",
      "Obgleich die Maßnahme sinnvoll erscheint, muss ihre Wirkung geprüft werden.",
    ],
  ),
  nevertheless: focus(
    "trotzdem / dennoch",
    "nevertheless / however",
    "trotzdem und dennoch verbinden zwei selbstständige Aussagen. Sie drücken aus, dass die zweite Aussage trotz der ersten gilt.",
    "Aussage. Trotzdem / Dennoch + Verb + Subjekt ...",
    [
      "Steht trotzdem oder dennoch auf Position eins, folgt das konjugierte Verb auf Position zwei.",
      "dennoch wirkt meist etwas formeller als trotzdem.",
    ],
    [
      "Die Umstellung ist teuer. Trotzdem lohnt sie sich langfristig.",
      "Die Datenlage ist begrenzt. Dennoch lassen sich erste Tendenzen erkennen.",
    ],
  ),
  contrast: focus(
    "während / wohingegen",
    "contrast / whereas",
    "während und wohingegen können zwei unterschiedliche Situationen oder Positionen direkt gegenüberstellen. wohingegen ist besonders klar für einen sachlichen Kontrast.",
    "Aussage, während / wohingegen + ... Verb am Ende",
    [
      "Im Nebensatz steht das konjugierte Verb am Ende.",
      "Nutze diese Struktur für echte Gegensätze, nicht nur für zwei unabhängige Fakten.",
    ],
    [
      "Während das Auto flexibel ist, verursacht der öffentliche Verkehr pro Person oft weniger Emissionen.",
      "In der Stadt gibt es viele Angebote, wohingegen auf dem Land Wege häufig länger sind.",
    ],
  ),
  withoutInstead: focus(
    "ohne ... zu / statt ... zu",
    "without doing / instead of doing",
    "ohne ... zu beschreibt, dass eine Handlung nicht stattfindet. statt ... zu zeigt, dass eine Handlung durch eine andere ersetzt wird. Beide Strukturen funktionieren am besten bei gleichem Subjekt.",
    "ohne / statt + ... + zu + Infinitiv",
    [
      "Bei gleichem Subjekt brauchst du kein zweites ausgesprochenes Subjekt.",
      "Das zu steht direkt beim Infinitiv am Ende der Infinitivgruppe.",
    ],
    [
      "Man kann einkaufen, ohne jedes Produkt einzeln zu verpacken.",
      "Viele Menschen reparieren Geräte, statt sie sofort wegzuwerfen.",
    ],
  ),
  pairedNotOnly: focus(
    "nicht nur ... sondern auch",
    "not only ... but also",
    "Mit nicht nur ... sondern auch verbindest du zwei gleichwertige Informationen und verstärkst die zweite.",
    "nicht nur X, sondern auch Y",
    [
      "X und Y sollten grammatisch parallel gebaut sein.",
      "Achte darauf, dass nicht nur und sondern auch dieselbe Satzfunktion verbinden.",
    ],
    [
      "Mehrweg spart nicht nur Verpackung, sondern auch Rohstoffe.",
      "Digitale Bildung braucht nicht nur Geräte, sondern auch Medienkompetenz.",
    ],
  ),
  pairedBoth: focus(
    "sowohl ... als auch",
    "both ... and",
    "Mit sowohl ... als auch nennst du zwei gleichwertige Aspekte ohne Gegensatz.",
    "sowohl X als auch Y",
    [
      "Verbinde grammatisch parallele Elemente.",
      "Bei einem gemeinsamen Verb bleibt der Satzbau klar und kompakt.",
    ],
    [
      "Sowohl Schulen als auch Familien tragen Verantwortung.",
      "Die Maßnahme stärkt sowohl Teilhabe als auch Chancengleichheit.",
    ],
  ),
  conditional: focus(
    "falls / sofern",
    "condition / if, provided that",
    "falls und sofern nennen eine Bedingung. sofern wirkt häufig formeller und bedeutet sinngemäß unter der Voraussetzung, dass.",
    "falls / sofern + ... Verb am Ende",
    [
      "Das konjugierte Verb steht am Ende des Nebensatzes.",
      "Nutze sofern besonders für klare Bedingungen, Regeln oder Einschränkungen.",
    ],
    [
      "Falls zusätzliche Förderung nötig ist, sollte sie früh angeboten werden.",
      "KI kann eingesetzt werden, sofern Quellen und Ergebnisse überprüft werden.",
    ],
  ),
  conditionalKonjunktiv: focus(
    "Konjunktiv II",
    "hypothetical, polite or unreal situations",
    "Der Konjunktiv II eignet sich für Vorschläge, hypothetische Folgen, Wünsche und vorsichtige Bewertungen. Auf B2 ist die würde-Form häufig, daneben sind wäre, hätte, könnte und müsste besonders wichtig.",
    "würde + Infinitiv | wäre / hätte / könnte / müsste",
    [
      "Nutze könnte / müsste / sollte für differenzierte Vorschläge.",
      "Vermeide unnötige würde-Formen, wenn eine gebräuchliche Konjunktiv-II-Form existiert.",
    ],
    [
      "Die Stadt könnte mehr bezahlbaren Wohnraum fördern.",
      "Es wäre sinnvoll, klare Datenschutzregeln einzuführen.",
    ],
  ),
  zwarHowever: focus(
    "zwar ... jedoch",
    "admittedly ... however",
    "zwar ... jedoch eignet sich für eine ausgewogene Einräumung: Du erkennst zuerst einen Punkt an und begrenzt oder relativierst ihn danach.",
    "Zwar + Aussage, jedoch + Verb + Subjekt ...",
    [
      "zwar kündigt die Einräumung an; jedoch markiert den entscheidenden Gegensatz.",
      "Nach jedoch auf Position eins folgt das konjugierte Verb.",
    ],
    [
      "Digitale Kurse sind zwar flexibel, jedoch ersetzen sie nicht in jeder Situation den persönlichen Austausch.",
      "Die Studie ist zwar umfangreich, jedoch sind die Ergebnisse nicht auf jede Gruppe übertragbar.",
    ],
  ),
  sourceLanguage: focus(
    "indirekte Rede und Quellenangaben",
    "reported information and source attribution",
    "Bei wissenschaftlichen oder medialen Aussagen musst du klar zeigen, wer etwas behauptet und wie sicher die Information ist. Indirekte Rede und Quellenangaben schaffen Distanz zur Aussage.",
    "Laut Quelle ... | Die Studie zeigt, dass ... | Die Autorin erklärt, ... | Konjunktiv I, wenn passend",
    [
      "Trenne fremde Aussagen klar von deiner eigenen Bewertung.",
      "Nutze Konjunktiv I vor allem dann, wenn du eine fremde Aussage ausdrücklich als Wiedergabe markieren willst.",
    ],
    [
      "Laut der Studie ist der Effekt besonders bei jüngeren Teilnehmenden sichtbar.",
      "Die Forschenden erklären, die Ergebnisse seien noch nicht abschließend.",
    ],
  ),
  sourcePreps: focus(
    "laut / zufolge / nach Angaben",
    "according to",
    "Diese Ausdrücke nennen die Quelle einer Information. Sie sind besonders nützlich in sachlichen Zusammenfassungen und Diskussionen über Forschung.",
    "laut + Dativ/Genitiv | der Quelle zufolge | nach Angaben + Genitiv/von",
    [
      "zufolge steht typischerweise nach der Bezugsgruppe: der Studie zufolge.",
      "nach Angaben braucht eine klare Quelle: nach Angaben des Instituts / nach Angaben von Fachleuten.",
    ],
    [
      "Laut einer aktuellen Studie verändert sich das Konsumverhalten.",
      "Den Forschenden zufolge sind weitere Daten notwendig.",
    ],
  ),
  cause: focus(
    "aufgrund",
    "because of / due to",
    "aufgrund nennt einen Grund in nominaler Form und eignet sich gut für formellere B2-Texte.",
    "aufgrund + Genitiv (häufig auch von + Dativ bei längeren Gruppen)",
    [
      "Nach aufgrund folgt eine Nominalgruppe, kein vollständiger Nebensatz.",
      "Nutze aufgrund, wenn du einen Grund knapp und sachlich formulieren möchtest.",
    ],
    [
      "Aufgrund hoher Mieten ziehen manche Familien ins Umland.",
      "Aufgrund fehlender Infrastruktur sind viele Menschen auf das Auto angewiesen.",
    ],
  ),
  reviewRelations: focus(
    "Ursache, Folge, Gegensatz, Einräumung, Ziel und Methode",
    "cause, result, contrast, concession, purpose and method",
    "Für die B2-Prüfung musst du nicht möglichst viele Konnektoren verwenden, sondern die logische Beziehung korrekt auswählen. Entscheide zuerst: Begründe ich, zeige ich eine Folge, stelle ich einen Gegensatz her, räume ich etwas ein, nenne ich ein Ziel oder erkläre ich eine Methode?",
    "Grund: weil/da/aufgrund · Folge: deshalb/sodass/wodurch · Gegensatz: während/wohingegen · Einräumung: obwohl/trotz · Ziel: um ... zu/damit · Methode: indem/dadurch, dass",
    [
      "Wähle den Konnektor nach der logischen Funktion, nicht nur nach Stil.",
      "Kontrolliere danach die Wortstellung: Nebensatzverb am Ende, Hauptsatzverb auf Position zwei.",
    ],
    [
      "Weil Wohnraum knapp ist, steigen die Preise; dadurch werden viele Haushalte stärker belastet.",
      "Obwohl digitale Angebote Vorteile haben, müssen klare Regeln gelten, damit alle fair teilnehmen können.",
    ],
  ),
});

const DAY_FOCUS_KEYS = Object.freeze({
  1: ["method", "purpose", "consequence"],
  2: ["passive", "modalPassive", "nominalization"],
  3: ["proportional", "concession", "withoutInstead"],
  4: ["withoutInstead", "pairedNotOnly", "method"],
  5: ["contrast", "proportional", "conditionalKonjunktiv"],
  6: ["passive", "modalPassive", "conditional", "consequence"],
  7: ["relativePrep", "conditionalKonjunktiv", "consequence"],
  8: ["purpose", "passive", "modalPassive", "nominalization"],
  9: ["modalPassive", "conditional", "concession", "nevertheless"],
  10: ["relative", "purpose", "proportional"],
  11: ["contrast", "method", "conditionalKonjunktiv"],
  12: ["zwarHowever", "proportional", "concession", "conditionalKonjunktiv"],
  13: ["passive", "nominalization", "sourcePreps"],
  14: ["sourceLanguage", "concession", "zwarHowever"],
  15: ["relativePrep", "conditionalKonjunktiv", "cause", "concession"],
  16: ["contrast", "proportional", "concession", "nevertheless"],
  17: ["purpose", "contrast", "withoutInstead"],
  18: ["proportional", "passive", "modalPassive", "nominalization"],
  19: ["purpose", "withoutInstead", "concession", "nevertheless", "proportional"],
  20: ["relativePrep", "contrast", "consequence"],
  21: ["conditional", "passive", "modalPassive", "conditionalKonjunktiv", "method"],
  22: ["passive", "modalPassive", "proportional", "conditional", "consequence"],
  23: ["passive", "relativePrep", "consequence", "concession"],
  24: ["passive", "modalPassive", "method", "conditional", "consequence"],
  25: ["contrast", "method", "concession"],
  26: ["concession", "concessionExtended", "contrast", "relativePrep"],
  27: ["pairedNotOnly", "pairedBoth", "concession", "method"],
  28: ["reviewRelations", "passive", "relative", "nominalization", "conditionalKonjunktiv"],
});

const DAY_GRAMMAR_RELEVANCE = Object.freeze({
  1: "Beim Thema Müllvermeidung müssen Lernende erklären, wie eine Maßnahme funktioniert, welches Ziel sie hat und welche Folge daraus entsteht.",
  2: "Recycling und Kreislaufwirtschaft bestehen aus Prozessen und Regeln. Passiv beschreibt diese Abläufe sachlich; Nominalisierungen helfen bei Begriffen wie Wiederverwendung, Trennung und Verwertung.",
  3: "Bei Lebensmittelverschwendung geht es um Zusammenhänge, Einräumungen und Alternativen: je genauer geplant wird, desto weniger wird weggeworfen; trotz Hindernissen kann man handeln.",
  4: "Bewusster Einkauf lebt von Alternativen und kombinierten Vorteilen. ohne/statt zu, nicht nur ... sondern auch und indem helfen, konkrete Kaufentscheidungen präzise zu formulieren.",
  5: "Mobilität verlangt Vergleich und Abwägung. während/wohingegen vergleicht Verkehrsmittel, je ... desto zeigt Zusammenhänge und Konjunktiv II eignet sich für realistische Stadtvorschläge.",
  6: "Energie ist ein Prozess- und Regelthema. Passiv erklärt Erzeugung und Verbrauch, falls/sofern formuliert Bedingungen und sodass/wodurch macht Folgen von Maßnahmen sichtbar.",
  7: "Bei Wohnen und Stadtentwicklung beschreiben Lernende Orte und Maßnahmen, auf die sie sich beziehen. Relativsätze mit Präpositionen präzisieren Orte; Konjunktiv II formuliert Vorschläge und sodass/wodurch deren Folgen.",
  8: "Bildungsgerechtigkeit verlangt Ziele, Fördermaßnahmen und sachliche Begriffe. um ... zu/damit erklärt Förderziele, Passiv beschreibt institutionelle Maßnahmen und Nominalisierung unterstützt formelle Bildungssprache.",
  9: "Schulpflicht und Leistung betreffen Pflichten, Bedingungen und Ausnahmen. Modalpassiv formuliert, was getan werden muss oder kann; falls/sofern und obwohl/dennoch helfen bei ausgewogenen Regeln.",
  10: "Frühkindliche Bildung braucht genaue Beschreibungen von Einrichtungen, Zielen und Zusammenhängen. Relativsätze, um ... zu/damit und je ... desto passen direkt zu Förderung und Entwicklung.",
  11: "Digitale und traditionelle Bildung wird verglichen und verbessert. während/wohingegen strukturiert den Vergleich, Konjunktiv II formuliert Vorschläge und indem/dadurch, dass erklärt deren Umsetzung.",
  12: "Bei Studiengebühren und lebenslangem Lernen müssen Vorteile, Nachteile und hypothetische Lösungen abgewogen werden. Dafür eignen sich zwar ... jedoch, obwohl/trotz, je ... desto und Konjunktiv II.",
  13: "Wissenschaft wird über Prozesse und Quellen erklärt. Passiv beschreibt Forschungsschritte, Nominalisierung macht die Darstellung sachlicher und laut/zufolge/nach Angaben kennzeichnet die Quelle.",
  14: "Desinformation verlangt sprachliche Distanz zu fremden Behauptungen. Indirekte Rede und Quellenangaben markieren, wer etwas sagt; obwohl und zwar ... jedoch helfen, Aussagen vorsichtig einzuordnen.",
  15: "Wohnraummangel verlangt Ursachen, genaue Wohnungsbezüge und Lösungsvorschläge. aufgrund/trotz/obwohl erklärt Gründe und Hindernisse, Relativsätze mit Präpositionen präzisieren Wohnsituationen und Konjunktiv II formuliert Maßnahmen.",
  16: "Stadt und Land werden direkt verglichen. während/wohingegen stellt Unterschiede gegenüber, je ... desto zeigt Zusammenhänge und obwohl/dennoch erlaubt eine differenzierte Bewertung.",
  17: "Vereinbarkeit von Familie und Beruf bedeutet Ziele, Alternativen und Kontraste. um ... zu/damit, während/wohingegen und ohne/statt zu bilden genau diese Beziehungen ab.",
  18: "Fachkräftemangel wird über Entwicklungen, institutionelle Maßnahmen und Qualifizierung diskutiert. je ... desto zeigt Wechselwirkungen, Passiv/Modalpassiv beschreibt Maßnahmen und Nominalisierung passt zu Weiterbildung und Qualifikation.",
  19: "Homeoffice verlangt eine ausgewogene Diskussion über Vorteile, Grenzen und Ziele. obwohl/trotzdem räumt Gegenseiten ein, um ... zu/damit erklärt Ziele, ohne/statt zu Alternativen und je ... desto Folgen.",
  20: "Bei sozialen Medien müssen Plattformen, Datenwege und Folgen genau beschrieben werden. Relativsätze mit Präpositionen präzisieren Bezugspunkte, während/wohingegen kontrastiert privat und öffentlich und wodurch/sodass zeigt Folgen.",
  21: "KI in Bildung braucht Regeln und Bedingungen. falls/sofern definiert erlaubte Nutzung, Passiv/Modalpassiv formuliert Prozesse und Pflichten, Konjunktiv II Vorschläge und indem/dadurch, dass konkrete Prüfschritte.",
  22: "Automatisierung betrifft Prozesse, Pflichten, Bedingungen und Folgen. Passiv/Modalpassiv beschreibt, was automatisiert wird, je ... desto Entwicklungen, sofern/falls Bedingungen und wodurch Konsequenzen.",
  23: "Datenschutz und Werbung sind datengetriebene Prozesse. Passiv beschreibt Datenerhebung, Relativsätze mit Präpositionen die Systeme, wodurch/sodass die Folgen und obwohl mögliche Einschränkungen.",
  24: "Telemedizin verbindet medizinische Prozesse mit Bedingungen und Folgen. Passiv/Modalpassiv beschreibt Versorgung, indem/dadurch, dass Funktionsweisen, sofern Bedingungen und sodass/wodurch Auswirkungen.",
  25: "Nachhaltiger Tourismus verlangt Vergleich, Einräumung und konkrete Maßnahmen. während/wohingegen stellt Tourismusformen gegenüber, obwohl/trotz zeigt Zielkonflikte und indem/dadurch, dass erklärt Lösungen.",
  26: "Migration und Integration erfordern differenzierte Vergleiche und präzise Bezüge auf Institutionen und Erfahrungen. obwohl/obgleich/trotz, während/wohingegen und Relativsätze mit Präpositionen unterstützen genau diese Perspektiven.",
  27: "Gleichstellung verlangt mehrere gleichwertige Faktoren, Einräumungen und konkrete Maßnahmen. nicht nur ... sondern auch, sowohl ... als auch, obwohl/trotz und indem/dadurch, dass strukturieren diese Argumentation.",
  28: "Der Prüfungstag bündelt die wichtigsten logischen Beziehungen und B2-Strukturen. Lernende wählen je nach Aussage Ursache, Folge, Gegensatz, Ziel, Passiv, Relativsatz, Nominalisierung oder Konjunktiv II.",
});

const DAY_MODEL_SENTENCES = Object.freeze({
  1: "Haushalte vermeiden Müll, indem sie Mehrwegbehälter nutzen, sodass weniger Einwegverpackungen entsorgt werden müssen.",
  2: "Wertstoffe werden getrennt gesammelt, damit sie wiederverwendet werden können; die Wiederverwendung senkt den Bedarf an neuen Rohstoffen.",
  3: "Je genauer Einkäufe geplant werden, desto weniger Lebensmittel werden weggeworfen, obwohl spontane Angebote weiterhin zum Mehrkauf verleiten können.",
  4: "Man kann Verpackungsmüll reduzieren, ohne auf notwendige Produkte zu verzichten, indem man Mehrweg- statt Einwegverpackungen wählt.",
  5: "Während das Auto besonders flexibel ist, ist der öffentliche Verkehr oft klimafreundlicher; je zuverlässiger er wird, desto attraktiver ist er.",
  6: "Erneuerbare Energie kann stärker genutzt werden, sofern Netze ausgebaut werden, sodass der Anteil fossiler Energie sinkt.",
  7: "Grünflächen, in denen Menschen sich erholen können, würden die Lebensqualität verbessern, obwohl dafür in dicht bebauten Städten Flächen umgestaltet werden müssten.",
  8: "Zusätzliche Förderung wird angeboten, damit Lernende gleiche Chancen erhalten; durch die Verbesserung des Zugangs können soziale Unterschiede verringert werden.",
  9: "Leistungen sollten transparent bewertet werden, sofern die Kriterien für alle nachvollziehbar sind; dennoch muss individuelle Förderung möglich bleiben.",
  10: "Kindergärten, die frühe Sprachförderung anbieten, können Kinder unterstützen, damit der Übergang in die Schule leichter gelingt.",
  11: "Während digitale Plattformen flexibles Lernen ermöglichen, könnte Präsenzunterricht für komplexe Diskussionen weiterhin besonders wichtig sein.",
  12: "Studiengebühren sind zwar eine Finanzierungsquelle, jedoch könnten sie den Zugang erschweren; je höher die Kosten sind, desto wichtiger werden Fördermodelle.",
  13: "Laut aktuellen Untersuchungen werden neue Behandlungsmethoden regelmäßig geprüft; die Veröffentlichung der Ergebnisse ermöglicht eine sachliche Bewertung.",
  14: "Die Forschenden erklären, die Daten seien begrenzt; obwohl die Ergebnisse interessant sind, sollten sie daher nicht ohne weitere Prüfung verallgemeinert werden.",
  15: "Aufgrund hoher Mieten könnten Städte mehr Wohnungen fördern, für die langfristig bezahlbare Bedingungen gelten.",
  16: "Während Städte viele Dienstleistungen bieten, sind ländliche Regionen oft ruhiger; je besser die Infrastruktur ist, desto kleiner werden praktische Unterschiede.",
  17: "Viele Eltern reduzieren Arbeitszeit, um Betreuung zu sichern, während andere flexible Modelle nutzen, ohne ihre Wochenstunden dauerhaft zu senken.",
  18: "Je gezielter Beschäftigte weitergebildet werden, desto leichter können offene Stellen besetzt werden; neue Qualifikationen müssen deshalb systematisch gefördert werden.",
  19: "Obwohl Homeoffice Wege spart, müssen klare Grenzen geschaffen werden, damit Beschäftigte abschalten können, statt ständig erreichbar zu sein.",
  20: "Plattformen, über die persönliche Daten veröffentlicht werden, beeinflussen die öffentliche Identität, wodurch private Entscheidungen langfristige Folgen haben können.",
  21: "KI kann im Unterricht eingesetzt werden, sofern Ergebnisse überprüft werden; Lernende könnten Quellen vergleichen, indem sie Aussagen systematisch prüfen.",
  22: "Je mehr Routinetätigkeiten automatisiert werden, desto wichtiger wird Weiterbildung; neue Kompetenzen müssen gefördert werden, sodass Beschäftigte wechseln können.",
  23: "Daten, aus denen personalisierte Werbung erstellt wird, werden häufig automatisch ausgewertet, wodurch Nutzerprofile sehr detailliert werden können.",
  24: "Gesundheitsdaten müssen geschützt werden, sofern digitale Systeme genutzt werden; Telemedizin kann Versorgung verbessern, indem Wege und Wartezeiten reduziert werden.",
  25: "Während Massentourismus Einnahmen schafft, belastet er manche Orte; nachhaltiger Tourismus kann helfen, indem Besucherströme besser verteilt werden.",
  26: "Obgleich Sprache eine zentrale Rolle spielt, hängt Integration auch von Institutionen ab, mit denen Zugewanderte im Alltag in Kontakt kommen.",
  27: "Chancengleichheit braucht nicht nur klare Regeln, sondern auch Verfahren, die sowohl Betroffene als auch Institutionen nachvollziehen können.",
  28: "Obwohl gesellschaftlicher Wandel Konflikte erzeugen kann, könnten transparente Regeln entwickelt werden, damit Veränderungen fair gestaltet werden.",
});

export const B2_GRAMMAR_LESSONS = Object.freeze(
  Object.fromEntries(
    Array.from({ length: 28 }, (_, index) => index + 1).map((day) => {
      const alignment = getB2LessonContentAlignment(day);
      const keys = DAY_FOCUS_KEYS[day] || [];
      const focuses = keys.map((key) => B2_GRAMMAR_FOCUS_LIBRARY[key]).filter(Boolean);
      return [day, Object.freeze({
        day,
        title: alignment?.grammar_topic || "B2 Grammatik",
        context: alignment?.lessonTopic || alignment?.title || "",
        goal: alignment?.goal || "",
        whyThisGrammar: DAY_GRAMMAR_RELEVANCE[day] || "",
        focuses: Object.freeze(focuses),
        modelSentence: DAY_MODEL_SENTENCES[day] || "",
        miniExercise: `Formuliere zum heutigen Thema „${alignment?.title || "B2"}“ vier eigene Sätze. Verwende mindestens zwei der Grammatikstrukturen aus diesem Lernblock und markiere in jedem Satz die verwendete Struktur.`,
      })];
    }),
  ),
);

export const getB2GrammarLesson = (day) => B2_GRAMMAR_LESSONS[Number(day)] || null;

export default B2_GRAMMAR_LESSONS;
