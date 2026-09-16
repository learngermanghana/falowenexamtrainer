// Explicit teaching content for the current 28-day B2 curriculum.
// Repeated structures share the rule, but every application and check belongs to its day.
const CONCEPTS = {
  method: {
    title: "Eine Methode erklären: indem / dadurch, dass",
    explanation: "Frage: Wie oder auf welche Weise wird etwas erreicht? Der indem-Satz nennt die Handlung, mit der man ein Ergebnis erreicht. Dadurch, dass hat dieselbe Funktion und hebt das Mittel stärker hervor. Eine bloße Ursache mit weil beantwortet dagegen die Frage Warum?",
    formation: "Hauptsatz, indem + Subjekt + ... + konjugiertes Verb. / Dadurch, dass + Subjekt + ... + Verb, Verb + Subjekt + ... . Dadurch allein ist ein Adverb im Hauptsatz: Dadurch sparen wir Energie.",
    mistake: "Nicht: indem wir kaufen weniger. Richtig: indem wir weniger kaufen. Im vorangestellten Nebensatz steht das Verb am Ende; danach beginnt der Hauptsatz mit dem Verb.",
  },
  purpose: {
    title: "Eine Absicht ausdrücken: um ... zu / damit",
    explanation: "Eine Absicht ist ein gewünschtes Ergebnis, das noch nicht eingetreten sein muss. Um ... zu hat kein eigenes Subjekt: Die handelnde Person lässt sich normalerweise aus dem Hauptsatz ergänzen. Damit enthält ein eigenes Subjekt und ist deshalb nötig, wenn andere Personen vom Ziel betroffen sind; es ist auch bei gleichem Subjekt möglich.",
    formation: "Subjekt + Verb + ..., um ... zu + Infinitiv. / Hauptsatz, damit + Subjekt + ... + Verb. Bei trennbaren Verben: einzusparen. Mit Modalverb: um ... sparen zu können.",
    mistake: "Nicht: Die Stadt baut Kitas, um Eltern arbeiten zu können. Richtig: Die Stadt baut Kitas, damit Eltern arbeiten können. Die Stadt baut, die Eltern arbeiten: zwei verschiedene Subjekte.",
  },
  result: {
    title: "Eine Folge ausdrücken: sodass / wodurch",
    explanation: "Sodass führt eine tatsächliche oder erwartete Folge ein. Wodurch bezieht sich hier auf den ganzen vorangehenden Sachverhalt: Dieser bewirkt die Folge. Anders als damit behaupten diese Verknüpfungen keine Absicht. Prüfe immer, ob der erste Sachverhalt den zweiten wirklich auslöst.",
    formation: "Hauptsatz, sodass + Subjekt + ... + Verb. / Hauptsatz, wodurch + Subjekt + ... + Verb. Beide Nebensätze stehen nach der Aussage, aus der sich die Folge ergibt.",
    mistake: "Nicht: ..., sodass die Kosten sinken können werden. Richtig: ..., sodass die Kosten sinken können. Bei einem Modalverb steht der Infinitiv direkt vor dem konjugierten Modalverb.",
  },
  passive: {
    title: "Vorgänge beschreiben: Passiv und Modalpassiv",
    explanation: "Im Vorgangspassiv steht die Handlung im Mittelpunkt. Das Akkusativobjekt des Aktivsatzes wird zum Subjekt: Die Firma prüft die Daten → Die Daten werden geprüft. Der Handelnde kann mit von + Dativ ergänzt werden. Das Modalpassiv ergänzt etwa eine Pflicht (müssen), Möglichkeit (können) oder Empfehlung (sollten).",
    formation: "Präsens: wird/werden + Partizip II. Präteritum: wurde/wurden + Partizip II. Perfekt: ist/sind + Partizip II + worden. Modalpassiv: muss/müssen + Partizip II + werden. Nebensatz: weil die Daten geprüft werden müssen.",
    mistake: "Nicht: Die Daten müssen prüfen werden. Richtig: Die Daten müssen geprüft werden. Unterscheide Vorgang (Die Tür wird geöffnet) und Zustand (Die Tür ist geöffnet).",
  },
  nominal: {
    title: "Handlungen verdichten: Nominalisierung",
    explanation: "Nominalisierungen machen eine Handlung zum Nomen und sind in sachlichen Texten nützlich. Ein Objekt lässt sich häufig als Genitivattribut anschließen: Man fördert die Kinder → die Förderung der Kinder. Nicht jedes Verb bildet ein Nomen mit -ung; auch der Ausbau, der Zugang und das Lernen sind typische Formen.",
    formation: "Verbgruppe → Artikel + Nomen + Ergänzung: Daten auswerten → die Auswertung der Daten. Nach durch folgt Akkusativ: durch die Auswertung. Nach bei folgt Dativ: bei der Auswertung. Ein nominalisiertes Infinitivverb ist großgeschrieben und sächlich: das Lernen.",
    mistake: "Nicht: durch die fördern der Kinder. Richtig: durch die Förderung der Kinder. Überlade den Text nicht mit Nominalgruppen; ein Verbalsatz kann klarer sein.",
  },
  relative: {
    title: "Nomen genauer bestimmen: Relativsätze",
    explanation: "Ein Relativsatz erklärt, welche Person oder Sache gemeint ist. Genus und Numerus kommen vom Bezugswort; der Kasus ergibt sich aus der Aufgabe im Relativsatz. Vergleiche: ein Kurs, der hilft (Subjekt), und ein Kurs, den ich besuche (Akkusativobjekt).",
    formation: "Nominativ m/f/n/Plural: der/die/das/die. Akkusativ: den/die/das/die. Dativ: dem/der/dem/denen. Das Verb steht am Ende. Eingeschobene Relativsätze haben davor und danach ein Komma.",
    mistake: "Nicht automatisch den Kasus des Bezugsworts übernehmen: Ich suche einen Kurs, der mir hilft. Einen Kurs steht im Akkusativ, aber der ist das Subjekt von hilft.",
  },
  relativePrep: {
    title: "Relativsätze mit Präpositionen",
    explanation: "Die Präposition gehört zur Aussage im Relativsatz, zum Beispiel sprechen über, teilnehmen an oder wohnen in. Sie steht vor dem Relativpronomen und bestimmt dessen Kasus. Das Bezugswort liefert nur Genus und Numerus. Bei Ortsangaben unterscheidest du Ort (in + Dativ) und Richtung (in + Akkusativ).",
    formation: "Präposition + Relativpronomen + Subjekt + ... + Verb: ein Haus, in dem wir wohnen; eine Frage, über die wir sprechen; Menschen, mit denen wir arbeiten. Genitiv: ein System, über dessen Wirkung wir sprechen / Systeme, über deren Wirkung wir sprechen.",
    mistake: "Nicht: Häuser, in die wir wohnen. Richtig: Häuser, in denen wir wohnen. Wohnen bezeichnet hier einen Ort, keine Bewegung zu einem Ziel.",
  },
  proportional: {
    title: "Zwei Entwicklungen verbinden: je ... desto",
    explanation: "Je ... desto beschreibt einen Zusammenhang zwischen zwei veränderlichen Größen. Beide Teile enthalten einen Komparativ. Der erste Teil nennt die Bedingung bzw. Veränderung; der zweite zeigt, wie sich die andere Größe entsprechend verändert. Der Satz beweist für sich allein noch keinen wissenschaftlichen Zusammenhang.",
    formation: "Je + Komparativ + Subjekt + ... + Verb, desto + Komparativ + Verb + Subjekt + ... . Beispielstruktur: Je genauer wir planen, desto weniger kaufen wir. Auch umso ist statt desto möglich.",
    mistake: "Nicht: Je besser wir planen, desto wir sparen mehr. Richtig: Je besser wir planen, desto mehr sparen wir. Die desto-Gruppe besetzt die erste Position des Hauptsatzes.",
  },
  concession: {
    title: "Eine unerwartete Gegenwirkung: obwohl / obgleich / trotz",
    explanation: "Du nennst einen Umstand, der ein anderes Ergebnis erwarten lässt, und zeigst, dass dieses Ergebnis nicht eintritt. Obwohl verbindet einen Nebensatz; obgleich bedeutet dasselbe und klingt formeller. Trotz verbindet keine Sätze, sondern steht vor einer Nominalgruppe, in der Standardschriftsprache mit Genitiv.",
    formation: "Obwohl + Subjekt + ... + Verb, Verb + Subjekt + ... . / Trotz + Genitiv + Verb + Subjekt + ... . Obwohl die Kosten hoch sind → trotz der hohen Kosten.",
    mistake: "Nicht: trotz die Kosten hoch sind. Richtig: obwohl die Kosten hoch sind / trotz der hohen Kosten. Nicht obwohl und aber als doppelte Verknüpfung desselben Satzpaares verwenden.",
  },
  nevertheless: {
    title: "Trotzdem / dennoch im Hauptsatz",
    explanation: "Trotzdem und dennoch greifen einen bereits genannten Umstand auf und nennen ein unerwartetes Ergebnis. Sie sind Adverbien, keine Nebensatzkonjunktionen. Obwohl stellt den hinderlichen Umstand im Nebensatz dar; trotzdem/dennoch steht im Hauptsatz mit dem unerwarteten Ergebnis.",
    formation: "Die Kosten sind hoch. Trotzdem investieren wir. / Die Kosten sind hoch; wir investieren dennoch. Nach trotzdem/dennoch am Satzanfang folgt direkt das konjugierte Verb.",
    mistake: "Nicht: Trotzdem wir investieren. Richtig: Trotzdem investieren wir. Obwohl die Kosten hoch sind, investieren wir hat eine andere Satzstruktur.",
  },
  alternative: {
    title: "Eine fehlende oder ersetzte Handlung: ohne / statt ... zu",
    explanation: "Ohne ... zu nennt eine Handlung, die nicht stattfindet. Statt ... zu nennt die nicht gewählte Alternative. Der gedachte Handelnde der Infinitivgruppe muss zur Hauptsatzaussage passen. Bei unterschiedlichen Subjekten brauchst du in der Regel ohne dass bzw. statt dass mit einem vollständigen Nebensatz.",
    formation: "Hauptsatz, ohne / (an)statt ... zu + Infinitiv. Trennbares Verb: wegzuwerfen. Mit Modalverb: ohne ... verzichten zu müssen. Anderes Subjekt: Sie arbeitet, ohne dass jemand sie stört.",
    mistake: "Nicht: ohne zu wegwerfen. Richtig: ohne wegzuwerfen. Kein eigenes Subjekt in einer Infinitivgruppe: ohne dass die Kinder warten müssen, nicht ohne die Kinder warten zu müssen.",
  },
  addition: {
    title: "Zwei Aspekte verbinden: nicht nur ... sondern auch / sowohl ... als auch",
    explanation: "Sowohl ... als auch stellt zwei Aspekte gleichberechtigt nebeneinander. Nicht nur ... sondern auch betont, dass zusätzlich zum ersten Aspekt ein weiterer wichtig ist. Verbinde grammatisch parallele Teile, etwa zwei Nomen, zwei Infinitive oder zwei Aussagen.",
    formation: "sowohl + A + als auch + B (normalerweise ohne Komma). nicht nur + A, sondern auch + B (mit Komma vor sondern). Die Präposition kann wiederholt werden: sowohl für Kinder als auch für Erwachsene.",
    mistake: "Nicht: sowohl Bildung und Arbeit. Richtig: sowohl Bildung als auch Arbeit. Bei nicht nur bleibt der zweite Teil positiv: nicht nur sparen, sondern auch wiederverwenden.",
  },
  contrast: {
    title: "Unterschiede vergleichen: während / wohingegen",
    explanation: "Beim Vergleichen stellt während zwei unterschiedliche Eigenschaften oder Situationen gegenüber. Wohingegen bedeutet dagegen und macht den Gegensatz eindeutig; es steht meist nach der ersten Aussage. Während kann zusätzlich zeitlich gemeint sein (während ich arbeite). Entscheide aus dem Zusammenhang, welche Bedeutung gemeint ist.",
    formation: "Während + Subjekt + ... + Verb, Verb + Subjekt + ... . / Hauptsatz, wohingegen + Subjekt + ... + Verb. In beiden Nebensätzen steht das konjugierte Verb am Ende.",
    mistake: "Nicht: Während Busse sind günstig, Autos sind flexibel. Richtig: Während Busse günstig sind, sind Autos flexibel. Vergleiche möglichst dieselbe Eigenschaft auf beiden Seiten.",
  },
  hypothetical: {
    title: "Vorschläge und Möglichkeiten: Konjunktiv II",
    explanation: "Könnte nennt eine Möglichkeit, sollte eine Empfehlung. Würde + Infinitiv beschreibt eine vorgestellte Handlung oder Folge. Wäre und hätte verwendet man gewöhnlich direkt statt würde sein/haben. Ein wenn-Satz kann eine hypothetische Voraussetzung ergänzen; daraus folgt nicht, dass die Voraussetzung bereits erfüllt ist.",
    formation: "Die Stadt könnte + Infinitiv. / Wenn + Subjekt + ... + hätte/wäre, würde + Subjekt + ... + Infinitiv. Modalverben haben keinen zusätzlichen zu-Infinitiv: könnte fördern, sollte prüfen.",
    mistake: "Nicht: Die Stadt könnte würde helfen / könnte zu helfen. Richtig: Die Stadt könnte helfen. Im hypothetischen Bedingungssatz: Wenn sie mehr Geld hätte, könnte sie helfen.",
  },
  condition: {
    title: "Voraussetzungen formulieren: falls / sofern",
    explanation: "Falls bedeutet für den Fall, dass und beschreibt einen möglichen Fall. Sofern bedeutet unter der Voraussetzung, dass und hebt eine notwendige Einschränkung deiner Aussage hervor. Du formulierst damit eine Bedingung, keine sichere Vorhersage und keinen Grund.",
    formation: "Falls/Sofern + Subjekt + ... + Verb, Verb + Subjekt + ... . / Hauptsatz, sofern + Subjekt + ... + Verb. In sachlichen Bedingungen ist der Indikativ üblich; der Konjunktiv II ist nicht automatisch nötig.",
    mistake: "Nicht: Sofern die Technik funktioniert, wir können starten. Richtig: Sofern die Technik funktioniert, können wir starten. Der Nebensatz besetzt die erste Position vor dem Hauptsatzverb.",
  },
  balance: {
    title: "Einräumen und einschränken: zwar ... jedoch",
    explanation: "Mit zwar bestätigst du zuerst einen berechtigten Punkt. Mit jedoch schränkst du ihn ein oder stellst einen Gegenpunkt gegenüber. Beide Teile können Hauptsätze sein. Der zweite Punkt erhält meist mehr argumentatives Gewicht.",
    formation: "Die Maßnahme ist zwar teuer, sie hilft jedoch vielen Menschen. / Die Maßnahme ist zwar teuer; jedoch hilft sie vielen Menschen. Jedoch im Vorfeld → Verb direkt danach; jedoch im Mittelfeld → normale Hauptsatzstruktur.",
    mistake: "Nicht: jedoch sie hilft vielen Menschen. Richtig: jedoch hilft sie vielen Menschen / sie hilft jedoch vielen Menschen. Zwar allein lässt die erwartete Einschränkung oft offen.",
  },
  sources: {
    title: "Quellen nennen: laut / zufolge / nach Angaben",
    explanation: "Eine Quellenangabe zeigt, von wem eine Information stammt. Sie ist kein Beweis dafür, dass die Aussage stimmt. Laut steht vor der Quelle (Dativ oder Genitiv); zufolge steht in dieser Verwendung hinter einer Quelle im Dativ. Nach Angaben nennt die berichtende Person oder Institution.",
    formation: "laut der Studie / der Studie zufolge / nach Angaben des Instituts. Nach Angaben von + Dativ: nach Angaben von Forschenden. Steht die ganze Quellenangabe am Satzanfang, folgt das Verb: Der Studie zufolge sinkt der Verbrauch.",
    mistake: "Nicht: der Studie zufolge der Verbrauch sinkt. Richtig: Der Studie zufolge sinkt der Verbrauch. Erfundenen Beispielsätzen keine scheinbar echte Studie zuordnen; bei echten Aussagen die konkrete Quelle nennen.",
  },
  reported: {
    title: "Fremde Aussagen wiedergeben: indirekte Rede",
    explanation: "Indirekte Rede trennt eine fremde Aussage von deiner eigenen Bewertung. Im formellen Bericht nutzt du Konjunktiv I: sein → sei, haben → habe, können → könne. Er kennzeichnet die Wiedergabe, nicht automatisch Zweifel. Ein dass-Satz kann auch im Indikativ stehen; in sachlichen Berichten signalisiert der Konjunktiv die Distanz klarer.",
    formation: "Direkt: Die Forscherin sagt: „Die Methode ist zuverlässig.“ Indirekt: Sie sagt, die Methode sei zuverlässig / dass die Methode zuverlässig sei. Wenn Konjunktiv I und Indikativ gleich aussehen, ist Konjunktiv II als Ersatz möglich: sie haben → sie hätten.",
    mistake: "Nicht: Die Forscherin sagt, dass die Methode sei zuverlässig. Richtig: ..., dass die Methode zuverlässig sei. Pronomen und Zeit-/Ortsangaben an die berichtende Perspektive anpassen.",
  },
  cause: {
    title: "Gründe nennen: weil / aufgrund",
    explanation: "Weil nennt einen Grund in einem vollständigen Nebensatz. Aufgrund verdichtet einen Grund zu einer Nominalgruppe und wirkt sachlicher. Unterscheide Grund und Einräumung: Aufgrund der hohen Kosten verzichten wir darauf; trotz der hohen Kosten machen wir es dennoch.",
    formation: "weil + Subjekt + ... + Verb / aufgrund + Genitiv: aufgrund der steigenden Mieten. Alternativ aufgrund von + Dativ: aufgrund von Lieferproblemen. Umformung: weil Wohnungen fehlen → aufgrund des Wohnungsmangels.",
    mistake: "Nicht: aufgrund die Mieten steigen. Richtig: weil die Mieten steigen / aufgrund der steigenden Mieten. Die Nominalisierung ersetzt den gesamten Nebensatz, nicht nur weil.",
  },
};

// section: concept, topic-specific example, explanation of that exact example.
const s = (concept, sentence, analysis) => ({ concept, ...CONCEPTS[concept], sentence, analysis });
// check: a real choice about meaning, word order or case (not a lesson-title quiz).
const q = (question, answer, wrong, explanation) => ({ question, answer, options: [answer, ...wrong], explanation });

export const B2_GRAMMAR_EXPLANATIONS = {
  1: {
    introduction: "Beim Müllvermeiden unterscheidest du drei Fragen: Wie handle ich? Was will ich erreichen? Was passiert als Folge? Ein Stoffbeutel ist die Methode, weniger Einwegmüll das Ziel; tatsächlich eingesparte Tüten sind die Folge. Die Konnektoren machen diese Unterschiede sichtbar.",
    sections: [
      s("method", "Wir vermeiden Einwegtüten, indem wir Stoffbeutel mitnehmen. Dadurch, dass wir Stoffbeutel mitnehmen, vermeiden wir Einwegtüten.", "Mitnehmen ist die konkrete Methode. Im indem-Satz steht mitnehmen am Ende; nach dem vorangestellten dadurch-dass-Satz folgt vermeiden vor wir."),
      s("purpose", "Ich nutze eine Brotdose, um Verpackungen einzusparen. Die Schule stellt Trinkwasser bereit, damit die Kinder ihre Flaschen auffüllen können.", "Im ersten Satz handelt zweimal ich. Im zweiten Satz stellt die Schule Wasser bereit, aber die Kinder füllen ihre Flaschen: Deshalb braucht der Zielsatz ein eigenes Subjekt."),
      s("result", "Wir kaufen lose Äpfel, sodass weniger Verpackungsmüll entsteht. Wir verwenden die Gläser erneut, wodurch wir Abfall vermeiden.", "Sodass nennt das Ergebnis des Einkaufs; wodurch bezieht sich auf das erneute Verwenden der Gläser. Damit würde stattdessen nur die Absicht hervorheben."),
    ],
    checks: [q("Die Stadt stellt Trinkbrunnen auf, ___ Passanten ihre Flaschen auffüllen können. Welcher Zielkonnektor passt?", "damit", ["um ... zu", "trotz"], "Stadt und Passanten sind unterschiedliche Subjekte. Damit leitet einen vollständigen Zielsatz ein."), q("Ergänze die Methode: Wir reduzieren Müll, indem wir ___.", "Mehrwegflaschen benutzen", ["benutzen Mehrwegflaschen", "Mehrwegflaschen zu benutzen"], "Indem verlangt einen Nebensatz mit konjugiertem Verb am Ende, keinen zu-Infinitiv.")],
    task: "Erkläre eine Müllvermeidungsmaßnahme in drei Sätzen: Methode mit indem, Ziel mit damit oder um ... zu und Folge mit sodass.",
    sample: "Wir kaufen im Unverpacktladen ein, indem wir eigene Behälter mitbringen. Wir verwenden die Behälter mehrfach, um Einwegverpackungen zu vermeiden. Wir benötigen dadurch weniger Tüten, sodass weniger Abfall entsteht.",
  },
  2: {
    introduction: "Bei Recyclingprozessen ist meist wichtiger, was mit dem Material geschieht, als wer es bearbeitet. Beschreibe zuerst den Vorgang im Passiv, fasse dann einen Arbeitsschritt als Nomen zusammen und erkläre mit einem Relativsatz, welche Materialien gemeint sind.",
    sections: [
      s("passive", "Die Anlage sortiert die Verpackungen. → Die Verpackungen werden sortiert. Sie müssen anschließend gereinigt werden.", "Verpackungen wechselt vom Akkusativobjekt zum Subjekt im Plural; deshalb werden. Müssen + gereinigt + werden bezeichnet einen notwendigen Verarbeitungsschritt."),
      s("nominal", "Die Betriebe verwenden Rohstoffe wieder. → Die Wiederverwendung der Rohstoffe spart Material.", "Wiederverwendung ist das neue Subjekt im Singular: spart. Der Rohstoffe ist ein Genitivattribut und nennt, was wiederverwendet wird."),
      s("relative", "Verpackungen, die aus einem einzigen Material bestehen, lassen sich oft leichter recyceln. Das Material, das die Anlage aussortiert, wird getrennt gesammelt.", "Die ist im ersten Relativsatz das Subjekt (Plural). Das ist im zweiten das Akkusativobjekt zu aussortiert; die Anlage ist dort das Subjekt."),
    ],
    checks: [q("Die Verpackungen müssen vor dem Recycling ___.", "gereinigt werden", ["reinigen werden", "gereinigt sein worden"], "Modalpassiv: müssen + Partizip II + werden. Gereinigt ist das Partizip von reinigen."), q("Nominalisiere: Man verwendet die Rohstoffe wieder.", "die Wiederverwendung der Rohstoffe", ["die Wiederverwenden die Rohstoffe", "der Wiederverwendung die Rohstoffe"], "Wiederverwendung ist feminin; das frühere Objekt wird hier zum Genitivattribut der Rohstoffe.")],
    task: "Beschreibe das Recycling von Glas mit einem Passivsatz, einer Nominalisierung und einem Relativsatz.",
    sample: "Altglas wird nach Farben sortiert. Die Wiederverwertung des Glases spart Rohstoffe. Glas, das stark verschmutzt ist, muss vor der Verarbeitung gereinigt werden.",
  },
  3: {
    introduction: "Lebensmittelverschwendung lässt sich durch Einkaufsplanung verringern. Zeige, wie Planung und Abfallmenge zusammenhängen, warum essbare Produkte trotzdem weggeworfen werden und welche Handlung das Wegwerfen ersetzen kann.",
    sections: [
      s("proportional", "Je genauer wir unsere Einkäufe planen, desto weniger Lebensmittel werfen wir weg.", "Genauer und weniger sind die beiden Vergleichsformen. Planen beendet den je-Satz; im Hauptsatz folgen auf desto weniger Lebensmittel das Verb werfen und das Subjekt wir."),
      s("concession", "Obwohl die Äpfel Druckstellen haben, sind sie noch essbar. Trotz ihrer Druckstellen sind die Äpfel noch essbar.", "Druckstellen lassen vielleicht erwarten, dass die Äpfel unbrauchbar sind. Obwohl nimmt den ganzen Satz auf; trotz ihrer Druckstellen bildet eine Nominalgruppe."),
      s("method", "Wir retten Lebensmittel, indem wir übrig gebliebenes Gemüse zu Suppe verarbeiten.", "Die konkrete Verarbeitung ist das Mittel zum Retten. Verarbeiten steht am Ende; weil würde einen Grund statt der Methode nennen."),
      s("alternative", "Wir kochen aus Resten eine Suppe, statt sie wegzuwerfen. Wir verwenden die Reste, ohne neue Zutaten zu kaufen.", "Wir ist in beiden Infinitivgruppen mitgedacht. Wegzuwerfen hat zu zwischen Vorsilbe und Verbstamm; ohne nennt die nicht ausgeführte Zusatzhandlung."),
    ],
    checks: [q("Je besser wir planen, ___.", "desto weniger kaufen wir unnötig ein", ["desto wir kaufen weniger unnötig ein", "desto weniger wir unnötig einkaufen"], "Nach der desto-Gruppe folgt das Hauptsatzverb kaufen; die trennbare Vorsilbe ein steht am Schluss."), q("Wir verarbeiten die Reste, statt sie ___.", "wegzuwerfen", ["zu wegwerfen", "wegwerfen zu"], "Bei wegwerfen steht zu zwischen weg und werfen.")],
    task: "Schreibe einen Zusammenhang mit je ... desto und einen konkreten Vorschlag mit statt ... zu.",
    sample: "Je genauer Haushalte ihre Vorräte prüfen, desto seltener kaufen sie zu viel ein. Sie könnten Reste einfrieren, statt sie wegzuwerfen.",
  },
  4: {
    introduction: "Beim bewussten Einkauf beschreibst du eine Alternative zu Einwegplastik und zeigst mehrere Vorteile. Trenne dabei die gewählte Methode von ihren Folgen: Ein Nachfüllsystem zu nutzen ist eine Handlung; weniger Verpackungsmüll ist deren Ergebnis.",
    sections: [
      s("alternative", "Ich kaufe loses Obst, statt verpackte Portionen zu wählen. Ich transportiere es, ohne eine neue Tüte zu kaufen.", "Statt nennt die ersetzte Kaufentscheidung; ohne nennt eine Handlung, die ausbleibt. In beiden Gruppen ist ich das gedachte Subjekt."),
      s("addition", "Nachfüllsysteme verringern nicht nur den Verpackungsmüll, sondern auch den Rohstoffverbrauch.", "Den Verpackungsmüll und den Rohstoffverbrauch sind parallele Akkusativobjekte. Der zweite Vorteil erweitert das erste Argument."),
      s("method", "Wir sparen Verpackungen, indem wir Waschmittel nachfüllen. Dadurch benötigen wir weniger Einwegflaschen.", "Indem erklärt das Vorgehen. Dadurch steht im zweiten Satz allein als Adverb: Danach kommt das Verb benötigen, nicht das Subjekt wir."),
      s("result", "Der Laden bietet Nachfüllstationen an, wodurch Kundinnen und Kunden ihre Behälter wiederverwenden können.", "Wodurch bezieht sich auf das Angebot der Stationen. Das Ergebnis ist eine neue Möglichkeit; können steht am Ende des Nebensatzes."),
    ],
    checks: [q("Mehrweg spart nicht nur Verpackungen, ___ Rohstoffe.", "sondern auch", ["als auch", "aber nur"], "Nicht nur wird mit sondern auch ergänzt. Sowohl würde als auch verlangen."), q("Wir benutzen Nachfüllstationen. Dadurch ___ weniger Flaschen.", "kaufen wir", ["wir kaufen", "zu kaufen wir"], "Dadurch ist ein Hauptsatzadverb. Es besetzt Position eins, kaufen steht auf Position zwei.")],
    task: "Erkläre eine Alternative zu Einwegverpackungen und entwickle zwei Vorteile mit nicht nur ... sondern auch.",
    sample: "Ich fülle meine Flasche auf, statt eine neue Einwegflasche zu kaufen. So vermeide ich nicht nur Plastikmüll, sondern auch unnötige Ausgaben.",
  },
  5: {
    introduction: "Eine Diskussion über Mobilität braucht faire Vergleiche: Vergleiche etwa die Flexibilität von Auto und Bus. Zeige anschließend, wie ein besseres Angebot die Verkehrsmittelwahl beeinflussen kann und mit welcher Maßnahme die Stadt das erreicht.",
    sections: [
      s("contrast", "Während Autofahrende ihre Abfahrtszeit frei wählen können, sind Busfahrgäste an den Fahrplan gebunden.", "Verglichen wird dieselbe Eigenschaft: zeitliche Flexibilität. Können steht am Ende des Nebensatzes; danach beginnt der Hauptsatz mit sind."),
      s("proportional", "Je häufiger die Busse fahren, desto kürzer sind die Wartezeiten.", "Häufiger und kürzer verbinden Taktung und Wartezeit. Die desto-Gruppe steht direkt vor sind."),
      s("method", "Die Stadt entlastet den Verkehr dadurch, dass sie sichere Radwege ausbaut.", "Der dadurch-dass-Satz nennt die konkrete Maßnahme. Ausbaut ist ein trennbares Verb, wird im Nebensatz aber zusammengeschrieben."),
    ],
    checks: [q("Während das Auto flexibel ___, ist die Bahn für viele Strecken praktisch.", "ist", ["zu sein", "sein"], "Während leitet einen Nebensatz mit einem konjugierten Verb am Ende ein."), q("Je zuverlässiger die Busse fahren, ___ nutzen die Menschen sie.", "desto häufiger", ["desto häufig", "je häufiger"], "Im zweiten Teil steht desto + Komparativ. Häufiger ist der Komparativ von häufig.")],
    task: "Vergleiche zwei Verkehrsmittel und erkläre mit dadurch, dass eine Verbesserung des öffentlichen Verkehrs.",
    sample: "Während das Auto eine flexible Route erlaubt, fährt der Bus auf einer festen Strecke. Die Stadt verbessert das Busangebot dadurch, dass sie die Taktzeiten verkürzt.",
  },
  6: {
    introduction: "Beim Energiesparen beschreibst du technische Maßnahmen, ihren Nutzen und mögliche Hindernisse. Das Passiv hilft bei sachlichen Prozessbeschreibungen; Nominalisierungen verdichten Maßnahmen wie den Ausbau der Solarenergie.",
    sections: [
      s("passive", "Alte Heizungen werden ersetzt. Die Gebäude müssen besser gedämmt werden.", "Die Maßnahmen stehen im Vordergrund. Müssen ergänzt die Notwendigkeit; gedämmt werden bleibt am Satzende."),
      s("nominal", "Man baut erneuerbare Energien aus. → Der Ausbau erneuerbarer Energien verringert die Abhängigkeit von fossilen Brennstoffen.", "Ausbauen wird zu der Ausbau, nicht zu einer erfundenen -ung-Form. Ausbau ist Singular, daher verringert."),
      s("concession", "Obwohl die Anlage teuer ist, lohnt sich die Investition langfristig. Trotz der hohen Anschaffungskosten wird die Anlage installiert.", "Hohe Kosten sind das Gegenargument. Trotz verlangt eine Nominalgruppe; obwohl verlangt Subjekt und Verb."),
      s("result", "Das Haus wird gedämmt, sodass weniger Wärme verloren geht. Die Familie senkt den Verbrauch, wodurch ihre Stromrechnung sinkt.", "Beide Nebensätze beschreiben Folgen. Wodurch bezieht sich auf das Senken des Verbrauchs, nicht auf ein einzelnes Nomen."),
    ],
    checks: [q("Die Gebäude müssen besser ___.", "gedämmt werden", ["dämmen werden", "gedämmt wurden"], "Nach müssen steht der Infinitiv werden zusammen mit dem Partizip gedämmt."), q("___ der hohen Kosten investiert die Familie in eine Solaranlage.", "Trotz", ["Obwohl", "Sodass"], "Der hohen Kosten ist eine Nominalgruppe im Genitiv; trotz passt dazu.")],
    task: "Beschreibe eine Energiesparmaßnahme im Modalpassiv und erläutere eine Folge sowie einen Einwand.",
    sample: "Die Fenster müssen erneuert werden. Danach entweicht weniger Wärme, sodass der Heizbedarf sinkt. Obwohl die Arbeiten teuer sind, können sie sich langfristig lohnen.",
  },
  7: {
    introduction: "Für klimafreundliches Wohnen musst du Gebäude und Wohnviertel präzise beschreiben. Nutze Relativsätze für deren Eigenschaften und den Konjunktiv II für Vorschläge, deren Umsetzung noch offen ist.",
    sections: [
      s("relativePrep", "Viertel, in denen viele Bäume stehen, bieten im Sommer mehr Schatten.", "In bezeichnet einen Ort und verlangt Dativ. Das Bezugswort Viertel ist Plural; deshalb in denen."),
      s("hypothetical", "Wenn die Kommune mehr Flächen hätte, könnte sie zusätzliche Parks anlegen.", "Hätte formuliert eine hypothetische Voraussetzung; könnte nennt die dadurch mögliche Maßnahme. Es wird nicht behauptet, dass die Flächen bereits verfügbar sind."),
      s("result", "Die Stadt pflanzt Bäume, sodass mehr schattige Aufenthaltsorte entstehen.", "Entstehen ist die Folge des Pflanzens. Damit würde betonen, dass Schatten das angestrebte Ziel ist."),
      s("concession", "Obwohl die Sanierung aufwendig ist, spart das Haus danach Energie. Trotz des hohen Aufwands wird es saniert.", "Der Einwand wird zuerst eingeräumt. Des hohen Aufwands ist Genitiv nach trotz."),
    ],
    checks: [q("Wohnviertel, in ___ viele Bäume stehen, sind im Sommer angenehmer.", "denen", ["die", "dessen"], "In + Dativ für einen Ort und das Bezugswort im Plural ergeben in denen."), q("Wenn die Stadt mehr Geld hätte, ___ sie Dächer begrünen.", "könnte", ["kann zu", "würde könnte"], "Könnte ist eine passende Konjunktiv-II-Form; begrünen ist der zugehörige Infinitiv.")],
    task: "Beschreibe ein klimafreundliches Viertel mit einem Relativsatz und mache einen hypothetischen Vorschlag.",
    sample: "Ein Viertel, in dem es viele Grünflächen gibt, bietet Platz zur Erholung. Die Stadt könnte zusätzliche Bäume pflanzen, wenn sie dafür geeignete Flächen hätte.",
  },
  8: {
    introduction: "Bei Bildungsgerechtigkeit ist die Unterscheidung zwischen Maßnahme und Ziel wichtig: Stipendien sind ein Mittel; gleicher Zugang zum Studium ist das Ziel. Häufig handeln Institutionen, während Lernende profitieren – deshalb brauchst du oft damit.",
    sections: [
      s("purpose", "Die Stiftung vergibt Stipendien, damit Jugendliche unabhängig vom Einkommen ihrer Eltern studieren können. Jugendliche beantragen ein Stipendium, um ihr Studium zu finanzieren.", "Im ersten Satz wechseln die Subjekte; im zweiten beantragen und finanzieren dieselben Jugendlichen. Deshalb sind unterschiedliche Zielstrukturen passend."),
      s("method", "Schulen verbessern Bildungschancen, indem sie kostenlose Lernmaterialien bereitstellen.", "Bereitstellen ist eine konkrete Methode. Der Satz erklärt, wie Unterstützung erfolgt, nicht bloß, warum Bildung wichtig ist."),
      s("nominal", "Man fördert benachteiligte Lernende. → Die Förderung benachteiligter Lernender verbessert ihre Chancen.", "Der nominalisierte Ausdruck ist das Subjekt. Benachteiligter Lernender ist ein Genitivattribut im Plural ohne Artikel."),
    ],
    checks: [q("Die Schule bietet Lernhilfe an, ___ alle Kinder teilnehmen können.", "damit", ["um ... zu", "trotz"], "Die Schule organisiert, die Kinder nehmen teil: Der Zielsatz braucht ein eigenes Subjekt."), q("Welche Form benennt die Maßnahme als Nomen?", "die Förderung der Lernenden", ["die fördern der Lernenden", "das Förderung die Lernenden"], "Förderung ist ein feminines Nomen; der Lernenden bezeichnet die geförderten Personen im Genitiv.")],
    task: "Schlage eine Maßnahme gegen ungleiche Bildungschancen vor. Trenne Methode und Ziel.",
    sample: "Die Schule unterstützt Kinder, indem sie kostenlose Nachhilfe anbietet. Die Stunden finden am Nachmittag statt, damit auch Kinder mit langen Schulwegen teilnehmen können.",
  },
  9: {
    introduction: "Schulpflicht und Leistungsbewertung betreffen Pflichten, Empfehlungen und Voraussetzungen. Müssen und sollten unterscheiden Verbindlichkeit und Empfehlung. Mit sofern begrenzt du eine Aussage auf die Bedingungen, unter denen sie gilt.",
    sections: [
      s("passive", "Leistungen müssen nach transparenten Kriterien bewertet werden. Kinder mit Lernschwierigkeiten sollten gezielt unterstützt werden.", "Müssen formuliert eine Anforderung; sollten eine Empfehlung. Beide Sätze verwenden Partizip II + werden nach dem Modalverb."),
      s("condition", "Sofern genügend Personal vorhanden ist, kann die Schule Förderkurse anbieten. Falls ein Kind häufig fehlt, sucht die Schule das Gespräch.", "Sofern nennt die Voraussetzung für das Angebot; falls behandelt einen möglichen konkreten Fall."),
      s("concession", "Obwohl Noten Orientierung bieten, zeigen sie nicht jede Fähigkeit eines Kindes.", "Der Nutzen wird eingeräumt, anschließend wird seine Reichweite eingeschränkt. Bieten steht am Ende des obwohl-Satzes."),
      s("nevertheless", "Noten bieten Orientierung. Dennoch brauchen Kinder persönliche Rückmeldungen.", "Dennoch steht im Hauptsatz mit dem ergänzenden Bedarf. Direkt danach folgt brauchen."),
    ],
    checks: [q("Sofern genügend Lehrkräfte vorhanden sind, ___ angeboten werden.", "können Förderkurse", ["Förderkurse können", "zu können Förderkurse"], "Nach dem vorangestellten Bedingungssatz beginnt der Hauptsatz mit können."), q("Noten sind wichtig. Dennoch ___ nicht jede Fähigkeit.", "erfassen sie", ["sie erfassen", "sie zu erfassen"], "Dennoch ist ein Adverb im Hauptsatz und fordert hier Verbzweitstellung.")],
    task: "Formuliere eine schulische Pflicht im Modalpassiv und eine Fördermaßnahme mit einer Voraussetzung.",
    sample: "Bewertungskriterien müssen verständlich erklärt werden. Sofern genug Lehrkräfte zur Verfügung stehen, können zusätzliche Förderstunden eingerichtet werden.",
  },
  10: {
    introduction: "Beim Kindergarten beschreibst du Einrichtungen, Förderziele und Entwicklungsbedingungen. Relativsätze helfen zu sagen, welche Betreuung du meinst. Ziele können die Kinder, aber auch die Eltern betreffen.",
    sections: [
      s("relative", "Eine Kita, die lange geöffnet ist, unterstützt berufstätige Eltern. Die Erzieherin, der die Kinder vertrauen, begleitet die Eingewöhnung.", "Die ist Subjekt zu geöffnet ist; der steht im Dativ, weil vertrauen einen Dativ verlangt. Das Bezugswort Erzieherin ist feminin."),
      s("purpose", "Die Erzieherin liest Geschichten vor, damit die Kinder ihren Wortschatz erweitern. Sie besucht eine Fortbildung, um neue Fördermethoden kennenzulernen.", "Vorlesen und Wortschatz erweitern haben unterschiedliche Subjekte. Besuchen und kennenlernen beziehen sich dagegen beide auf die Erzieherin."),
      s("proportional", "Je verlässlicher die Betreuung ist, desto leichter können Eltern ihren Arbeitstag planen.", "Verlässlicher und leichter verbinden Betreuungsqualität und Planbarkeit. Können folgt unmittelbar auf desto leichter."),
    ],
    checks: [q("Die Erzieherin, ___ die Kinder vertrauen, arbeitet seit Jahren in der Kita.", "der", ["die", "den"], "Vertrauen verlangt Dativ; bei einer femininen Person lautet das Relativpronomen der."), q("Die Kita erweitert ihre Öffnungszeiten, ___ Eltern flexibler arbeiten können.", "damit", ["um ... zu", "ohne ... zu"], "Kita und Eltern sind verschiedene Subjekte. Ein damit-Satz drückt das Ziel aus.")],
    task: "Beschreibe eine gute Kita mit einem Relativsatz und erkläre das Ziel einer Fördermaßnahme.",
    sample: "Eine Kita, die auf die Bedürfnisse der Kinder eingeht, schafft Vertrauen. Die Fachkräfte bieten Sprachspiele an, damit die Kinder neue Wörter im Alltag verwenden können.",
  },
  11: {
    introduction: "Digitale und analoge Lernformen haben unterschiedliche Stärken. Vergleiche ihre Eigenschaften, erkläre den konkreten Einsatz eines digitalen Werkzeugs und schlage eine realistische Verbesserung vor.",
    sections: [
      s("contrast", "Während digitale Übungen sofort Rückmeldungen geben können, ermöglicht ein Unterrichtsgespräch direkte Nachfragen.", "Der Gegensatz betrifft zwei Arten von Rückmeldung. Während ist hier vergleichend, nicht zeitlich gemeint."),
      s("method", "Die Lehrkraft unterstützt individuelles Lernen dadurch, dass sie Übungen nach Lernstand auswählt.", "Die Auswahl nach Lernstand ist die Methode. Auswählt steht am Ende des dass-Satzes; dadurch kündigt dieses Mittel an."),
      s("hypothetical", "Schulen könnten Leihgeräte anbieten. Wenn alle Kinder Zugang hätten, würde die digitale Gruppenarbeit leichter gelingen.", "Könnten ist ein Vorschlag. Hätten und würde ... gelingen stellen eine gedachte Voraussetzung und deren Folge dar."),
    ],
    checks: [q("Die Schule könnte ihren Unterricht verbessern, indem sie ___.", "Lehrkräfte schult", ["schult Lehrkräfte", "Lehrkräfte zu schulen"], "Indem braucht einen vollständigen Nebensatz mit dem konjugierten Verb schult am Ende."), q("Wenn alle Kinder ein Gerät hätten, ___ die Zusammenarbeit leichter gelingen.", "würde", ["werden zu", "hätte zu"], "Würde + Infinitiv beschreibt die hypothetische Folge.")],
    task: "Vergleiche digitales Lernen mit Präsenzunterricht und formuliere einen Vorschlag mit könnte.",
    sample: "Während Lernplattformen zeitliche Flexibilität bieten, erleichtert Präsenzunterricht spontane Gespräche. Schulen könnten beide Formen miteinander verbinden.",
  },
  12: {
    introduction: "Bei Studiengebühren brauchst du eine abgewogene Argumentation. Räume mögliche Vorteile ein, prüfe Zugangshürden und formuliere Alternativen. Nutze Nominalisierungen gezielt für Maßnahmen wie die Finanzierung des Studiums.",
    sections: [
      s("concession", "Obwohl ein Studium teuer ist, nehmen viele ein Studium auf. Trotz der hohen Kosten entscheiden sie sich dafür.", "Obwohl enthält die vollständige Aussage; trotz der hohen Kosten verdichtet sie zu einer Nominalgruppe."),
      s("balance", "Gebühren bringen zwar Einnahmen, sie erschweren jedoch manchen Menschen den Zugang zur Hochschule.", "Zwar erkennt einen Vorteil an; jedoch führt den gewichtigeren Einwand ein. Jedoch steht hier im Mittelfeld nach sie erschweren."),
      s("proportional", "Je höher die Studienkosten sind, desto wichtiger wird eine verlässliche Förderung.", "Höher und wichtiger verbinden finanzielle Belastung und Förderbedarf. Wird folgt direkt auf desto wichtiger."),
      s("nominal", "Der Staat finanziert das Studium mit. → Die Mitfinanzierung des Studiums entlastet Familien.", "Mitfinanzierung ist das Subjekt; des Studiums nennt im Genitiv den Gegenstand der Finanzierung."),
      s("hypothetical", "Ein einkommensabhängiges Stipendium könnte den Zugang erleichtern.", "Könnte bezeichnet eine mögliche Wirkung des Vorschlags. Nach könnte steht der Infinitiv erleichtern ohne zu."),
    ],
    checks: [q("Gebühren schaffen zwar Einnahmen; jedoch ___ den Zugang erschweren.", "können sie", ["sie können", "sie zu können"], "Steht jedoch vor dem Hauptsatz, folgt das konjugierte Verb können direkt danach."), q("Welche Nominalgruppe entspricht: das Studium finanzieren?", "die Finanzierung des Studiums", ["die finanzieren des Studiums", "der Finanzierung das Studium"], "Finanzierung ist feminin; das Studienobjekt wird zu des Studiums im Genitiv.")],
    task: "Schreibe eine Abwägung mit zwar ... jedoch und schlage eine Finanzierungslösung im Konjunktiv II vor.",
    sample: "Studiengebühren können zwar zusätzliche Mittel schaffen, sie belasten jedoch einkommensschwache Familien. Der Staat könnte gezielte Stipendien finanzieren.",
  },
  13: {
    introduction: "In einem Forschungsbericht beschreibst du Verfahren und unterscheidest das Ergebnis von seiner Quelle. Die folgenden Quellenformulierungen sind Sprachbeispiele, keine Behauptungen über eine konkrete veröffentlichte Studie.",
    sections: [
      s("passive", "Das Forschungsteam untersucht die Proben. → Die Proben werden untersucht. Anschließend wurden die Ergebnisse verglichen.", "Wer handelt, tritt in den Hintergrund. Werden beschreibt den aktuellen Prozess; wurden + verglichen einen abgeschlossenen Vorgang in der Vergangenheit."),
      s("nominal", "Das Team wertet die Daten aus. → Die Auswertung der Daten dauert mehrere Wochen.", "Die Handlung wird zum Subjekt im Singular. Der Daten ist Genitiv Plural und benennt die ausgewerteten Informationen."),
      s("sources", "Der Studie zufolge ist die Methode wirksam. Nach Angaben des Forschungsteams müssen weitere Versuche folgen.", "Zufolge steht hinter der Studie (Dativ). Nach Angaben des Forschungsteams nennt den Urheber; müssen folgt nach der gesamten Quellenangabe."),
    ],
    checks: [q("Die Proben ___ gestern untersucht.", "wurden", ["worden", "werden zu"], "Wurden + Partizip II ist Vorgangspassiv im Präteritum. Worden braucht im Perfekt zusätzlich sind."), q("Welche Quellenangabe ist korrekt?", "Der Studie zufolge", ["Die Studie zufolge", "Zufolge die Studie"], "Nachgestelltes zufolge verlangt hier Dativ: der Studie.")],
    task: "Beschreibe einen erfundenen Forschungsablauf mit Passiv, Nominalisierung und klar gekennzeichneter Quellenangabe.",
    sample: "In diesem erfundenen Beispiel werden Wasserproben untersucht. Die Auswertung der Proben dauert eine Woche. Nach Angaben des fiktiven Teams sind weitere Messungen nötig.",
  },
  14: {
    introduction: "Beim Umgang mit Desinformation darfst du eine fremde Behauptung nicht unbemerkt als eigene Tatsache darstellen. Nenne die Quelle, gib ihre Aussage wieder und formuliere getrennt davon deine Einschränkung.",
    sections: [
      s("reported", "Die Autorin behauptet: „Die Behandlung ist wirksam.“ → Die Autorin behauptet, die Behandlung sei wirksam.", "Sei ist Konjunktiv I von sein. Der Satz berichtet nur die Behauptung; er bestätigt nicht, dass die Behandlung tatsächlich wirkt."),
      s("sources", "Nach Angaben der Autorin sei die Methode zuverlässig.", "Die Quellenangabe und sei markieren gemeinsam die fremde Aussage. Die Glaubwürdigkeit der Quelle muss zusätzlich geprüft werden."),
      s("passive", "Die Behauptung wird vor der Veröffentlichung überprüft.", "Überprüft werden bezeichnet den Prüfprozess. Ob die Behauptung danach belegt ist, wird mit diesem Satz noch nicht gesagt."),
      s("concession", "Obwohl der Beitrag professionell gestaltet ist, fehlen überprüfbare Belege.", "Professionelle Gestaltung lässt Glaubwürdigkeit erwarten, garantiert sie aber nicht. Der obwohl-Satz räumt den positiven Eindruck ein."),
      s("balance", "Die Aussage klingt zwar plausibel, sie ist jedoch nicht ausreichend belegt.", "Plausibilität und Beleglage sind verschiedene Kriterien. Jedoch setzt die Einschränkung ins argumentative Zentrum."),
    ],
    checks: [q("Die Forscherin sagt, dass die Methode zuverlässig ___. Verwende Konjunktiv I.", "sei", ["wäre", "ist"], "Sei ist Konjunktiv I; wäre ist Konjunktiv II und ist der Indikativ. Im dass-Satz steht sei am Ende."), q("Was bedeutet: Der Autor behauptet, die Therapie sei wirksam?", "Die Aussage des Autors wird wiedergegeben.", ["Die Wirksamkeit ist damit bewiesen.", "Die Aussage ist automatisch falsch."], "Konjunktiv I kennzeichnet fremde Rede. Er ist weder ein Beweis noch ein automatischer Ausdruck von Unglauben.")],
    task: "Berichte eine erfundene Aussage im Konjunktiv I und schränke sie mit zwar ... jedoch ein.",
    sample: "Ein fiktiver Anbieter behauptet, sein Lernprogramm sei besonders wirksam. Die Beschreibung klingt zwar überzeugend, es fehlen jedoch unabhängige Untersuchungen.",
  },
  15: {
    introduction: "Über Wohnraummangel argumentierst du präziser, wenn du betroffene Gruppen benennst, Ursachen erläuterst und mögliche Lösungen von bestehenden Tatsachen unterscheidest. Aufgrund erklärt einen Grund; trotz räumt ein Hindernis ein.",
    sections: [
      s("relativePrep", "Familien, für die die Miete eine große Belastung ist, brauchen bezahlbaren Wohnraum.", "Für verlangt Akkusativ; die bezieht sich auf Familien im Plural. Die zweite die gehört zu die Miete und ist ein Artikel."),
      s("hypothetical", "Die Stadt könnte leer stehende Gebäude in Wohnungen umwandeln.", "Könnte + umwandeln formuliert einen Vorschlag und lässt die tatsächliche Umsetzbarkeit offen."),
      s("cause", "Weil die Mieten steigen, ziehen manche Familien um. Aufgrund der steigenden Mieten ziehen manche Familien um.", "Der ganze Grundsatz wird durch die Genitivgruppe der steigenden Mieten ersetzt. Die Hauptsatzaussage bleibt gleich."),
      s("concession", "Obwohl die Mieten hoch sind, bleiben viele in der Stadt. Trotz der hohen Mieten bleiben viele in der Stadt.", "Hier folgt aus hohen Mieten gerade nicht der erwartete Umzug. Deshalb ist trotz statt aufgrund passend."),
    ],
    checks: [q("Menschen, für ___ die Miete zu hoch ist, benötigen Unterstützung.", "die", ["denen", "der"], "Für verlangt Akkusativ; das Bezugswort Menschen ist Plural."), q("Formuliere einen Grund als Nominalgruppe: Weil die Mieten steigen, ...", "Aufgrund der steigenden Mieten ...", ["Trotz der steigenden Mieten ...", "Aufgrund die Mieten steigen ..."], "Aufgrund + Genitiv nennt den Grund; trotz würde die logische Beziehung verändern.")],
    task: "Nenne eine Ursache für Umzüge und schlage mit könnte eine wohnungspolitische Maßnahme vor.",
    sample: "Aufgrund der hohen Mieten ziehen manche Haushalte an den Stadtrand. Die Kommune könnte mehr bezahlbare Wohnungen fördern.",
  },
  16: {
    introduction: "Stadt und Land lassen sich nach Wohnkosten, Verkehr oder Versorgung vergleichen. Vermeide pauschale Urteile: Ein während-Satz vergleicht konkrete Eigenschaften, und obwohl/dennoch macht sichtbar, dass ein Vorteil nicht alle Nachteile aufhebt.",
    sections: [
      s("contrast", "Während im Stadtzentrum häufig Busse fahren, ist das Angebot in manchen Dörfern begrenzt.", "Beide Seiten vergleichen das Verkehrsangebot. Häufig und begrenzt sind konkrete Merkmale, keine pauschale Bewertung ganzer Lebensweisen."),
      s("proportional", "Je besser ein Dorf angebunden ist, desto leichter erreichen die Bewohner wichtige Einrichtungen.", "Besser und leichter verbinden Anbindung und Erreichbarkeit. Erreichen folgt nach desto leichter."),
      s("concession", "Obwohl das Dorf ruhig liegt, ist es für Pendler nicht immer praktisch.", "Ruhe ist der eingeräumte Vorteil, Alltagstauglichkeit die Einschränkung. Liegt beendet den Nebensatz."),
      s("nevertheless", "Das Dorf liegt ruhig. Dennoch brauchen viele Haushalte ein Auto.", "Dennoch führt einen trotz des Vorteils bestehenden Nachteil ein. Brauchen steht vor viele Haushalte."),
    ],
    checks: [q("Je besser die Anbindung ist, ___.", "desto leichter erreichen wir die Stadt", ["desto wir erreichen leichter die Stadt", "desto leicht wir die Stadt erreichen"], "Die Komparativgruppe desto leichter steht vor dem Hauptsatzverb erreichen."), q("Das Landleben bietet Ruhe. Dennoch ___ manche Menschen die Stadt.", "bevorzugen", ["zu bevorzugen", "bevorzugt"], "Dennoch steht auf Position eins; bevorzugen ist das konjugierte Verb für das Pluralsubjekt manche Menschen.")],
    task: "Vergleiche die Versorgung in Stadt und Land und ergänze eine Einschränkung mit dennoch.",
    sample: "Während es in der Stadt oft mehrere Arztpraxen gibt, sind die Wege auf dem Land länger. Das Landleben bietet viel Ruhe. Dennoch kann die medizinische Versorgung schwieriger erreichbar sein.",
  },
  17: {
    introduction: "Bei der Vereinbarkeit von Familie und Beruf wirken mehrere Personen zusammen. Prüfe bei Infinitivgruppen immer, wer handelt. Wenn Arbeitgeber etwas ermöglichen und Eltern davon profitieren, ist damit meist die richtige Zielstruktur.",
    sections: [
      s("purpose", "Der Betrieb bietet Gleitzeit an, damit Eltern ihre Kinder abholen können. Eltern passen ihre Arbeitszeiten an, um die Betreuung zu organisieren.", "Betrieb und Eltern sind im ersten Satz verschiedene Subjekte. Im zweiten handeln die Eltern sowohl beim Anpassen als auch beim Organisieren."),
      s("contrast", "Während eine Familie auf Großeltern zurückgreifen kann, ist eine andere auf eine Kita angewiesen.", "Die Aussage vergleicht unterschiedliche Betreuungsmöglichkeiten, ohne eine davon als allgemein verfügbar darzustellen."),
      s("alternative", "Eltern möchten arbeiten, ohne ständig improvisieren zu müssen. Sie teilen die Betreuung auf, statt sie einer Person zu überlassen.", "Ohne nennt die vermiedene Belastung; statt nennt eine ersetzte Organisationsform. Bei müssen steht zu vor dem Modalinfinitiv."),
    ],
    checks: [q("Die Firma führt Gleitzeit ein, ___ Eltern ihre Kinder abholen können.", "damit", ["um ... zu", "statt ... zu"], "Der Betrieb handelt, die Eltern sollen profitieren. Dafür braucht der Zielsatz ein eigenes Subjekt."), q("Eltern wollen arbeiten, ohne ständig ___.", "improvisieren zu müssen", ["zu improvisieren müssen", "müssen improvisieren"], "In der Infinitivgruppe mit Modalverb steht der Vollverbinfinitiv vor zu müssen.")],
    task: "Erkläre ein Betreuungsproblem und formuliere eine Arbeitgebermaßnahme samt Ziel.",
    sample: "Manche Eltern müssen ihre Arbeitszeit reduzieren, um die Betreuung sicherzustellen. Betriebe könnten flexible Schichten anbieten, damit Eltern ihre Arbeitszeiten besser abstimmen können.",
  },
  18: {
    introduction: "Beim Fachkräftemangel verbindest du Qualifizierung mit ihrem Zweck. Beschreibe, wie Weiterbildung organisiert wird, welches Ziel Unternehmen verfolgen und welche Zusammenhänge zwischen Kompetenzen und Einsatzmöglichkeiten bestehen.",
    sections: [
      s("proportional", "Je gezielter Beschäftigte geschult werden, desto besser können sie neue Aufgaben übernehmen.", "Gezielter und besser verbinden Schulung und Handlungsmöglichkeiten. Der je-Satz enthält ein Passiv: geschult werden."),
      s("purpose", "Der Betrieb finanziert Kurse, damit Beschäftigte neue Software bedienen können. Beschäftigte besuchen Kurse, um ihre Kenntnisse zu erweitern.", "Die beiden Zielkonstruktionen unterscheiden institutionelles Handeln mit anderen Begünstigten von einer eigenen Lernabsicht."),
      s("passive", "Neue Fachkräfte werden während der Einarbeitung begleitet.", "Wer begleitet, muss nicht genannt werden; entscheidend ist die Unterstützungsmaßnahme. Neue Fachkräfte ist das Pluralsubjekt."),
      s("nominal", "Behörden erkennen Abschlüsse an. → Die Anerkennung ausländischer Abschlüsse erleichtert den Berufseinstieg.", "Anerkennung nominalisiert anerkennen; ausländischer Abschlüsse ist Genitiv Plural ohne Artikel."),
    ],
    checks: [q("Je gezielter die Weiterbildung ist, ___ können Beschäftigte neue Aufgaben übernehmen.", "desto besser", ["desto gut", "je besser"], "Gut hat den unregelmäßigen Komparativ besser. Der zweite Teil beginnt mit desto."), q("Die Anerkennung ausländischer Abschlüsse ___ den Berufseinstieg.", "erleichtert", ["erleichtern", "erleichterten"], "Das Subjekt ist die Anerkennung im Singular; Abschlüsse steht nur im Genitivattribut.")],
    task: "Erkläre eine Weiterbildungsmaßnahme im Passiv und nenne das Ziel aus Sicht der Beschäftigten.",
    sample: "Die Beschäftigten werden im Umgang mit neuer Software geschult. Sie nehmen teil, um anspruchsvollere Aufgaben übernehmen zu können.",
  },
  19: {
    introduction: "Bei Homeoffice und Erreichbarkeit unterscheidest du gewünschte Grenzen, vermiedene Belastungen und tatsächliche Wirkungen. Ein Vorteil wie Flexibilität kann neben einem Nachteil wie Dauerstress bestehen.",
    sections: [
      s("purpose", "Ich schalte Benachrichtigungen aus, um mich zu erholen. Das Team vereinbart Ruhezeiten, damit alle ungestört abschalten können.", "Eigene Absicht erlaubt um ... zu; die Teamregel verfolgt ein Ziel für alle und wird mit damit erläutert."),
      s("alternative", "Sie beendet ihren Arbeitstag, ohne später E-Mails zu prüfen. Sie macht eine Pause, statt weiterzuarbeiten.", "Ohne nennt das ausbleibende Prüfen, statt die Alternative zur Pause. Weiterzuarbeiten enthält zu innerhalb des trennbaren Verbs."),
      s("concession", "Obwohl Homeoffice Wege spart, kann es die Grenze zwischen Arbeit und Freizeit verwischen.", "Der Vorteil wird eingeräumt, aber eine unerwartete Belastung bleibt möglich. Kann folgt unmittelbar auf den vorangestellten Nebensatz."),
      s("nevertheless", "Homeoffice spart Wege. Trotzdem fällt manchen Beschäftigten das Abschalten schwer.", "Trotzdem leitet einen Hauptsatz ein. Das konjugierte Verb fällt steht vor dem übrigen Satz."),
      s("proportional", "Je klarer die Arbeitszeiten geregelt sind, desto leichter lässt sich die Freizeit planen.", "Klarer und leichter verbinden klare Regeln mit Planbarkeit. Lässt folgt auf die desto-Gruppe."),
    ],
    checks: [q("Sie macht eine Pause, statt ___.", "weiterzuarbeiten", ["zu weiterarbeiten", "weiterarbeiten zu"], "Bei weiterarbeiten steht zu zwischen dem ersten Bestandteil und arbeiten."), q("Homeoffice ist flexibel. Trotzdem ___ das Abschalten schwer.", "fällt manchen Beschäftigten", ["manchen Beschäftigten fällt", "fallen manchen Beschäftigten"], "Das Verb steht nach trotzdem; das Abschalten ist das Subjekt im Singular.")],
    task: "Formuliere eine Regel für den Feierabend mit Ziel und einem eingeräumten Gegenargument.",
    sample: "Das Team legt Ruhezeiten fest, damit alle nach Feierabend abschalten können. Obwohl dringende Aufgaben vorkommen, sollten Ausnahmen klar begrenzt bleiben.",
  },
  20: {
    introduction: "In sozialen Medien beschreibst du Plattformen und unterscheidest private Entscheidungen von öffentlichen Folgen. Ein Relativsatz benennt die betreffende Plattform; wodurch erläutert, was eine Veröffentlichung auslösen kann.",
    sections: [
      s("relativePrep", "Plattformen, auf denen Menschen persönliche Fotos teilen, beeinflussen ihre öffentliche Darstellung.", "Auf bezeichnet hier den digitalen Ort. Es verlangt Dativ; das Pluralwort Plattformen führt zu auf denen."),
      s("contrast", "Während manche Nutzer ihr Profil öffentlich halten, beschränken andere den Zugriff.", "Verglichen werden zwei Umgangsweisen mit Sichtbarkeit. Nach dem vorangestellten während-Satz steht beschränken vor andere."),
      s("result", "Ein Foto wird weitergeleitet, wodurch es auch unbekannte Personen sehen können. Der Beitrag bleibt gespeichert, sodass er später erneut auftauchen kann.", "Die Weiterleitung und Speicherung haben Folgen. Wodurch verweist auf den ganzen ersten Sachverhalt; können bzw. kann steht am Ende."),
    ],
    checks: [q("Plattformen, auf ___ private Fotos geteilt werden, sollten klare Einstellungen anbieten.", "denen", ["die", "dem"], "Auf bezeichnet einen Ort; Dativ Plural lautet denen."), q("Ein Beitrag wird öffentlich geteilt, ___ ihn auch Fremde lesen können. Welcher Folgekonnektor passt?", "sodass", ["obwohl", "um ... zu"], "Sodass beschreibt die Folge. Obwohl wäre eine Einräumung und um ... zu eine Infinitivkonstruktion für ein Ziel.")],
    task: "Beschreibe eine Plattform mit einem Relativsatz und erläutere eine mögliche Folge öffentlicher Beiträge.",
    sample: "Eine Plattform, auf der Profile öffentlich sichtbar sind, erfordert bewusste Einstellungen. Beiträge können kopiert werden, wodurch die Kontrolle über ihre Verbreitung verloren gehen kann.",
  },
  21: {
    introduction: "Bei KI in Schule und Hochschule brauchen Vorschläge klare Bedingungen. Beschreibe den Einsatz sachlich, zeige eine verantwortliche Arbeitsweise und grenze ein, unter welchen Voraussetzungen KI sinnvoll genutzt werden kann.",
    sections: [
      s("passive", "KI wird zur Vorbereitung von Übungen eingesetzt. Die Antworten werden anschließend von Lernenden überprüft.", "Der Einsatz und die Prüfung stehen im Mittelpunkt. Von Lernenden ergänzt im zweiten Satz den Handelnden im Dativ."),
      s("method", "Studierende prüfen KI-Antworten, indem sie die Angaben mit Originalquellen vergleichen.", "Der Vergleich ist die überprüfbare Methode. Eine allgemeine Aussage wie KI hilft erklärt noch keine Arbeitsweise."),
      s("condition", "Sofern die Nutzung offengelegt wird, kann die Lehrkraft den Arbeitsprozess besser beurteilen.", "Die Transparenz ist die ausdrücklich genannte Voraussetzung. Der Satz erteilt keine pauschale Erlaubnis für jede KI-Nutzung."),
      s("hypothetical", "Die Hochschule könnte Regeln für zulässige KI-Hilfen entwickeln.", "Könnte macht einen Vorschlag. Entwickeln steht als Infinitiv am Ende, ohne zu."),
    ],
    checks: [q("KI-Antworten werden von den Studierenden ___.", "überprüft", ["überprüfen", "zu überprüfen"], "Vorgangspassiv besteht aus werden und Partizip II: überprüft."), q("Sofern die Nutzung transparent ist, ___ die Lehrkraft sie nachvollziehen.", "kann", ["zu können", "können"], "Nach dem Nebensatz folgt das Hauptsatzverb; die Lehrkraft ist Singular.")],
    task: "Schlage eine KI-Regel vor und begründe eine Voraussetzung für die Nutzung mit sofern.",
    sample: "Die Hochschule könnte eine Kennzeichnung von KI-Hilfen verlangen. Sofern Quellen selbst geprüft werden, kann KI die Vorbereitung einer Diskussion unterstützen.",
  },
  22: {
    introduction: "Automatisierung verändert einzelne Tätigkeiten und damit Kompetenzanforderungen. Das Passiv beschreibt die Veränderung; sofern verhindert, dass mögliche Vorteile ohne Bedingungen versprochen werden.",
    sections: [
      s("passive", "Routineaufgaben werden automatisiert. Beschäftigte müssen für neue Aufgaben qualifiziert werden.", "Wer automatisiert, ist im ersten Satz zweitrangig. Der zweite nennt eine notwendige Begleitmaßnahme im Modalpassiv."),
      s("proportional", "Je mehr Aufgaben automatisiert werden, desto wichtiger wird die Weiterbildung.", "Mehr und wichtiger verbinden den Umfang der Automatisierung mit dem Qualifizierungsbedarf. Weiterbildung ist Singular: wird."),
      s("condition", "Sofern Beschäftigte rechtzeitig geschult werden, können sie neue Aufgaben übernehmen. Falls eine Tätigkeit entfällt, ist eine Beratung sinnvoll.", "Sofern nennt die Voraussetzung für Chancen; falls behandelt einen möglichen konkreten Verlust einer Tätigkeit."),
      s("result", "Die Software übernimmt Dateneingaben, wodurch sich die Aufgaben des Teams verändern.", "Wodurch bezieht sich auf die Übernahme der Dateneingabe. Der Satz benennt eine Veränderung, ohne sie automatisch positiv zu bewerten."),
    ],
    checks: [q("Beschäftigte müssen rechtzeitig ___.", "weitergebildet werden", ["weiterbilden werden", "weitergebildet wurden"], "Modalpassiv verlangt Partizip II + Infinitiv werden."), q("Welche Verknüpfung kennzeichnet eine Voraussetzung?", "sofern die Beschäftigten geschult werden", ["obwohl die Beschäftigten geschult werden", "sodass die Beschäftigten geschult werden"], "Sofern drückt eine Bedingung aus, obwohl eine Einräumung und sodass eine Folge.")],
    task: "Beschreibe eine automatisierte Tätigkeit und eine Bedingung für einen fairen Übergang.",
    sample: "Wiederkehrende Dateneingaben werden automatisiert. Sofern Beschäftigte weitergebildet werden, können sie stärker an der Qualitätskontrolle mitwirken.",
  },
  23: {
    introduction: "Bei personalisierter Werbung erklärst du Verarbeitungsschritte und ihre Folgen. Präpositionale Relativsätze helfen, über Systeme und deren Funktionsweise zu sprechen. Ein möglicher Nutzen beseitigt Datenschutzbedenken nicht automatisch.",
    sections: [
      s("passive", "Nutzungsdaten werden gesammelt und zu Profilen zusammengeführt.", "Das Passiv beschreibt, was mit den Daten passiert. Gesammelt und zusammengeführt teilen sich das Hilfsverb werden."),
      s("relativePrep", "Algorithmen, über deren Funktionsweise wenig bekannt ist, wählen Anzeigen aus.", "Über gehört zu über etwas bekannt sein. Deren ist ein besitzanzeigendes Relativwort im Genitiv und verweist auf die Algorithmen: ihre Funktionsweise."),
      s("result", "Die Plattform speichert Suchanfragen, wodurch detaillierte Interessenprofile entstehen. Die Werbung wird angepasst, sodass verschiedene Nutzer unterschiedliche Anzeigen sehen.", "Der erste Vorgang ermöglicht Profile; der zweite führt zu unterschiedlichen Anzeigen. Die Folgen sind inhaltlich an den jeweiligen Vorgang gebunden."),
      s("concession", "Obwohl eine Anzeige relevant ist, kann die dafür genutzte Datensammlung problematisch sein.", "Relevanz ist der eingeräumte Vorteil. Die Bewertung der Datensammlung bleibt davon getrennt."),
    ],
    checks: [q("Algorithmen, über ___ Funktionsweise wenig bekannt ist, beeinflussen die Werbung.", "deren", ["dessen", "denen"], "Deren verweist besitzanzeigend auf das Pluralwort Algorithmen. Dessen wäre für ein maskulines oder neutrales Singularwort passend."), q("Nutzungsdaten ___ zu Profilen zusammengeführt.", "werden", ["haben", "wurden zu"], "Werden + zusammengeführt bildet das Vorgangspassiv im Präsens.")],
    task: "Erkläre einen Datenverarbeitungsschritt und eine daraus folgende Wirkung auf die Werbung.",
    sample: "Klickdaten werden ausgewertet. Daraus entstehen Interessenprofile, wodurch Anzeigen gezielter ausgewählt werden können. Obwohl die Werbung dadurch passender wirkt, bleiben Fragen zum Datenschutz offen.",
  },
  24: {
    introduction: "Telemedizin bietet Möglichkeiten unter bestimmten Voraussetzungen. Eine sorgfältige Argumentation benennt konkrete Abläufe, erforderlichen Schutz und begrenzte Wirkungen, statt jede digitale Technik pauschal als Verbesserung darzustellen.",
    sections: [
      s("passive", "Befunde werden digital übermittelt. Gesundheitsdaten müssen besonders sorgfältig geschützt werden.", "Der erste Satz beschreibt einen Prozess, der zweite eine Anforderung. Müssen + geschützt + werden ist Modalpassiv."),
      s("method", "Eine Praxis erleichtert Nachfragen dadurch, dass sie Videosprechstunden anbietet.", "Das Angebot ist die konkrete Methode. Dadurch, dass erklärt das Wie; es sagt nicht, dass jede Untersuchung online möglich ist."),
      s("condition", "Sofern keine körperliche Untersuchung nötig ist, kann eine Videosprechstunde geeignet sein.", "Der sofern-Satz begrenzt die Aussage ausdrücklich auf einen Fall. Kann bleibt zusätzlich eine Möglichkeitsaussage."),
      s("result", "Die Praxis übermittelt den Befund digital, sodass der Patient ihn schneller erhält. Rückfragen werden gebündelt, wodurch sich doppelte Anrufe vermeiden lassen.", "Sodass und wodurch nennen mögliche Prozessfolgen. Sie ersetzen keine Begründung dafür, ob die Versorgung insgesamt besser wird."),
    ],
    checks: [q("Gesundheitsdaten müssen sicher ___.", "gespeichert werden", ["speichern werden", "gespeichert wurden"], "Modalpassiv: müssen + gespeichert + werden."), q("Sofern keine Untersuchung vor Ort nötig ist, ___ eine Videosprechstunde helfen.", "kann", ["zu können", "können"], "Nach dem vorangestellten Bedingungssatz folgt das konjugierte Hauptsatzverb kann.")],
    task: "Beschreibe einen telemedizinischen Ablauf und nenne eine Voraussetzung sowie eine Schutzanforderung.",
    sample: "Befunde werden über ein digitales System bereitgestellt. Sofern ein persönlicher Termin nicht nötig ist, kann die Praxis Rückfragen online klären. Die Daten müssen vor unbefugtem Zugriff geschützt werden.",
  },
  25: {
    introduction: "Tourismus kann Einkommen schaffen und gleichzeitig Orte belasten. Vergleiche Perspektiven und erläutere konkrete Wege zu verantwortlicherem Reisen. Obwohl/trotz räumt Hindernisse ein, ohne die vorgeschlagene Alternative aufzugeben.",
    sections: [
      s("contrast", "Während Hotels von vielen Gästen profitieren, leiden manche Anwohner unter dem zusätzlichen Verkehr.", "Zwei Gruppen bewerten denselben Besucheranstieg unterschiedlich. Wohingegen wäre ebenfalls als nachgestellter Gegensatz möglich."),
      s("method", "Reisende stärken lokale Betriebe, indem sie Unterkünfte vor Ort buchen. Dadurch, dass sie außerhalb der Hauptsaison reisen, verteilen sie die Nachfrage gleichmäßiger.", "Beide Sätze nennen konkrete Handlungen als Mittel. Nach dem vorangestellten dadurch-dass-Satz folgt verteilen vor sie."),
      s("concession", "Obwohl die Bahnfahrt länger dauert, wählen sie den Zug. Trotz der längeren Fahrzeit wählen sie den Zug.", "Das Hindernis ist der Zeitaufwand. Der längeren Fahrzeit ist die nominale Entsprechung im Genitiv."),
    ],
    checks: [q("Touristen unterstützen lokale Betriebe, indem sie ___.", "regionale Angebote nutzen", ["nutzen regionale Angebote", "regionale Angebote zu nutzen"], "Der indem-Satz endet mit dem konjugierten Verb nutzen."), q("___ der längeren Fahrzeit reisen sie mit dem Zug.", "Trotz", ["Obwohl", "Wohingegen"], "Nach trotz folgt die Genitivgruppe der längeren Fahrzeit; die anderen Konnektoren verlangen einen Satz.")],
    task: "Vergleiche zwei Perspektiven auf Tourismus und nenne eine nachhaltigere Reisemethode.",
    sample: "Während Restaurants von Gästen profitieren, fühlen sich manche Anwohner durch den Lärm belastet. Reisende können stark besuchte Orte entlasten, indem sie außerhalb der Hauptsaison kommen.",
  },
  26: {
    introduction: "Bei Migration und Integration vergleichst du unterschiedliche Erfahrungen, ohne sie zu verallgemeinern. Relativsätze benennen passende Anlaufstellen; obwohl, obgleich und trotz helfen, Hindernisse und Fortschritte gemeinsam darzustellen.",
    sections: [
      s("concession", "Obwohl sie gute Deutschkenntnisse hat, braucht sie Unterstützung beim Antrag. Obgleich sie gut Deutsch spricht, ist die Fachsprache schwierig. Trotz ihrer Sprachkenntnisse benötigt sie Beratung.", "Alle drei Varianten räumen vorhandene Kenntnisse ein. Obgleich ist formeller; trotz verlangt die Nominalgruppe statt eines Nebensatzes."),
      s("contrast", "Während einige Zugewanderte direkt arbeiten können, müssen andere zunächst ihre Abschlüsse anerkennen lassen.", "Die Aussage vergleicht zwei Situationen. Sie behauptet nicht, dass alle Zugewanderten dieselben Bedingungen haben."),
      s("relativePrep", "Die Beratungsstelle, an die sich neue Einwohner wenden können, hilft bei der Orientierung.", "Sich wenden an verlangt Akkusativ. Beratungsstelle ist feminin, deshalb an die; können beendet den Relativsatz."),
    ],
    checks: [q("Die Beratungsstelle, an ___ sich Zugewanderte wenden können, ist gut erreichbar.", "die", ["der", "denen"], "Sich wenden an verlangt Akkusativ. Bei Beratungsstelle im Singular feminin lautet das Pronomen die."), q("Welche Nominalgruppe ersetzt: Obwohl sie gute Sprachkenntnisse hat?", "Trotz ihrer guten Sprachkenntnisse", ["Trotz sie gute Sprachkenntnisse hat", "Aufgrund ihrer guten Sprachkenntnisse"], "Trotz + Genitiv bewahrt die Einräumung. Aufgrund würde daraus eine Ursache machen.")],
    task: "Beschreibe ein Integrationshindernis trotz vorhandener Kompetenzen und eine passende Beratungsstelle.",
    sample: "Trotz ihrer Berufserfahrung muss sie ihren Abschluss anerkennen lassen. Eine Stelle, an die sie sich wenden kann, unterstützt sie bei den Unterlagen.",
  },
  27: {
    introduction: "Gleichstellung betrifft sowohl Regeln als auch ihre Umsetzung. Verbinde diese Aspekte, räume fortbestehende Hindernisse ein und erläutere konkret, wie faire Verfahren Diskriminierung verringern können.",
    sections: [
      s("addition", "Faire Verfahren brauchen sowohl klare Kriterien als auch unabhängige Kontrollen. Sie stärken nicht nur die Chancengleichheit, sondern auch das Vertrauen.", "Sowohl ... als auch verbindet zwei Voraussetzungen gleichberechtigt. Nicht nur ... sondern auch ergänzt einen weiteren Nutzen; die verbundenen Teile sind jeweils parallele Nominalgruppen."),
      s("concession", "Obwohl Gleichbehandlung vorgeschrieben ist, erleben manche Menschen Benachteiligung. Trotz bestehender Regeln sind Kontrollen nötig.", "Die Regeln sind der eingeräumte positive Umstand, aber sie garantieren die Praxis nicht. Bestehender Regeln ist Genitiv Plural ohne Artikel."),
      s("method", "Eine Organisation verringert Benachteiligung, indem sie Bewerbungen nach einheitlichen Kriterien bewertet.", "Die einheitliche Bewertung nennt einen überprüfbaren Handlungsschritt statt einer bloßen Absichtserklärung."),
    ],
    checks: [q("Faire Verfahren brauchen sowohl klare Regeln ___ wirksame Kontrollen.", "als auch", ["sondern auch", "und auch zwar"], "Sowohl bildet ein festes Paar mit als auch."), q("Welche Form passt nach trotz?", "bestehender Regeln", ["bestehende Regeln sind", "bestehenden Regeln werden"], "Trotz steht hier vor einem Genitiv Plural ohne Artikel: bestehender Regeln.")],
    task: "Nenne zwei Voraussetzungen für Gleichstellung und erkläre eine konkrete Maßnahme gegen Benachteiligung.",
    sample: "Gleichstellung braucht sowohl transparente Regeln als auch wirksame Beschwerdewege. Arbeitgeber können Benachteiligung verringern, indem sie Auswahlkriterien vorab festlegen.",
  },
  28: {
    introduction: "Im Prüfungstraining wählst du Grammatik nach der Beziehung zwischen deinen Gedanken. Eine Ursache erklärt das Warum, eine Methode das Wie, ein Ziel die Absicht und eine Folge das Ergebnis. Kombiniere diese Funktionen an einer konkreten gesellschaftlichen Maßnahme, statt möglichst viele Konnektoren in einen Satz zu packen.",
    sections: [
      s("cause", "Weil viele Haushalte hohe Wohnkosten haben, ist bezahlbarer Wohnraum ein wichtiges Ziel. Aufgrund der hohen Wohnkosten braucht es zusätzliche Angebote.", "Beide Formen nennen denselben Grund. Beim Nominalstil ersetzt eine Genitivgruppe den ganzen weil-Satz."),
      s("result", "Die Stadt baut zusätzliche Wohnungen, sodass sich das Angebot vergrößert.", "Die Angebotsvergrößerung ist eine Folge der Maßnahme. Ob Mieten dadurch sinken, muss gesondert begründet werden."),
      s("contrast", "Während manche Menschen eine Wohnung im Zentrum suchen, bevorzugen andere das Umland.", "Hier stehen zwei Präferenzen gegenüber; es handelt sich nicht um Ursache und Wirkung."),
      s("concession", "Obwohl neue Wohnungen teuer sind, darf bezahlbarer Wohnraum nicht vernachlässigt werden.", "Der Kosteneinwand wird anerkannt, hebt das Ziel aber nicht auf."),
      s("purpose", "Die Stadt fördert Wohnungsbau, damit Familien bezahlbar wohnen können.", "Die Stadt handelt mit einer Absicht zugunsten der Familien. Damit behauptet noch nicht, dass das Ziel schon erreicht ist."),
      s("method", "Die Stadt schafft Wohnraum, indem sie leer stehende Gebäude umbaut.", "Der Umbau beantwortet Wie? und ist damit die Methode, nicht nur ein allgemeines Ziel."),
      s("passive", "Leer stehende Gebäude können zu Wohnungen umgebaut werden.", "Modalpassiv verbindet die mögliche Maßnahme mit einer sachlichen Darstellung des Vorgangs."),
      s("relativePrep", "Familien, für die hohe Mieten eine Belastung sind, würden davon profitieren.", "Für + Akkusativ verlangt bei Familien das Relativpronomen die. Der Satz benennt die Zielgruppe genau."),
      s("nominal", "Die Umwandlung leer stehender Gebäude kann zusätzlichen Wohnraum schaffen.", "Die Umwandlung ist das Subjekt im Singular; leer stehender Gebäude ist Genitiv Plural."),
      s("hypothetical", "Die Kommune könnte zuerst prüfen, welche Gebäude geeignet wären.", "Könnte formuliert den Vorschlag; wären kennzeichnet die noch zu prüfende Eignung."),
    ],
    checks: [q("Die Stadt baut Wohnungen, damit Familien bezahlbar wohnen können. Welche Funktion hat damit?", "Ziel", ["bereits bewiesene Folge", "Gegensatz"], "Damit nennt die Absicht. Sodass würde eine Folge beschreiben."), q("Welcher Satz verbindet eine mögliche Maßnahme mit korrektem Modalpassiv?", "Leer stehende Gebäude könnten umgebaut werden.", ["Leer stehende Gebäude könnten umbauen werden.", "Leer stehende Gebäude könnten umgebaut wurden."], "Könnten + Partizip II + werden bildet Modalpassiv im Konjunktiv II.")],
    task: "Schreibe einen kurzen Prüfungsabsatz zu Wohnen, Bildung oder Umwelt: Position, Grund, Einwand, konkrete Maßnahme und Ziel. Verwende mindestens vier unterschiedliche Strukturen sinnvoll.",
    sample: "Meiner Ansicht nach braucht die Stadt mehr bezahlbaren Wohnraum, weil viele Familien unter hohen Mieten leiden. Obwohl Neubauten teuer sind, sollte das Problem nicht aufgeschoben werden. Die Kommune könnte das Angebot vergrößern, indem sie leer stehende Gebäude umbaut. Diese könnten gefördert werden, damit Familien mit geringem Einkommen dort wohnen können.",
  },
};

export const getB2DetailedGrammarLesson = (day, alignment) => {
  const content = B2_GRAMMAR_EXPLANATIONS[Number(day)];
  if (!content || !alignment) return null;
  return {
    title: `B2-Grammatik: ${alignment.grammar_topic}`,
    explanation: [content.introduction],
    sections: content.sections,
    rules: content.sections.map((section) => section.formation),
    examples: content.sections.map((section) => section.sentence),
    miniExercise: content.task,
    sampleAnswer: content.sample,
    // Keep answer text stable while varying its position across days and checks.
    knowledgeTest: content.checks.map((check, index) => {
      const offset = (Number(day) + index) % check.options.length;
      return { ...check, options: [...check.options.slice(offset), ...check.options.slice(0, offset)] };
    }),
  };
};
