import React from "react";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 10px 26px rgba(15,23,42,.06)",
};
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: ".95rem" };
const cellStyle = { border: "1px solid #e5e7eb", padding: "10px 12px", textAlign: "left", verticalAlign: "top", lineHeight: 1.6 };

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#14532d"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
  };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 14, background, color, lineHeight: 1.7 }}>{children}</div>;
};
const ExampleBox = ({ children }) => <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff", lineHeight: 1.75 }}>{children}</div>;
const Table = ({ children }) => <div style={{ width: "100%", overflowX: "auto" }}><table style={tableStyle}>{children}</table></div>;
const Mistake = ({ wrong, correct }) => (
  <div style={{ display: "grid", gap: 5, border: "1px solid #fecaca", background: "#fff7f7", borderRadius: 12, padding: 12, lineHeight: 1.65 }}>
    <span><strong>✗ Nicht korrekt:</strong> {wrong}</span>
    <span><strong>✓ Korrekt:</strong> {correct}</span>
  </div>
);
const CheckAnswer = ({ question, children }) => (
  <details style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
    <summary style={{ cursor: "pointer", fontWeight: 800 }}>{question}</summary>
    <div style={{ marginTop: 10, lineHeight: 1.7 }}>{children}</div>
  </details>
);

const lessons = {
  1: {
    title: "Relativsätze mit Präpositionen",
    subtitle: "Lernwege, Personen, Methoden und Ziele präzise miteinander verbinden",
    why: "Auf C1 solltest du nicht viele kurze Hauptsätze aneinanderreihen. Relativsätze helfen dir, Personen, Methoden und abstrakte Ziele genauer zu beschreiben. Entscheidend sind die Präposition, der richtige Kasus und die Verbendstellung.",
    goals: [
      "die Präposition eines Verbs oder Ausdrucks erkennen",
      "bei Personen Präposition + Relativpronomen verwenden",
      "bei Sachen zwischen Relativpronomen und wo(r)-Form unterscheiden",
      "Kasus und Verbposition zuverlässig kontrollieren",
    ],
    sections: [
      {
        title: "1. Die Präposition gehört zum Verb",
        text: "Wähle die Relativform nicht nach Gefühl. Prüfe zuerst, welche Präposition das Verb oder der Ausdruck verlangt.",
        rows: [
          ["arbeiten mit + Dativ", "der Tutor, mit dem ich arbeite"],
          ["sich orientieren an + Dativ", "der Plan, an dem ich mich orientiere"],
          ["sich konzentrieren auf + Akkusativ", "das Ziel, auf das ich mich konzentriere"],
          ["sich entscheiden für + Akkusativ", "die Methode, für die ich mich entscheide"],
        ],
        note: "Lerne Verb und Präposition immer als Einheit: sich konzentrieren auf, sich orientieren an, arbeiten mit, sich entscheiden für.",
      },
      {
        title: "2. Personen: Präposition + Relativpronomen",
        text: "Bei Personen richtet sich das Relativpronomen nach Genus und Numerus des Bezugsworts. Der Kasus kommt von der Präposition.",
        rows: [
          ["Maskulin", "der Tutor, mit dem … / für den …"],
          ["Feminin", "die Mentorin, mit der … / für die …"],
          ["Neutrum", "das Teammitglied, mit dem … / für das …"],
          ["Plural", "die Lernenden, mit denen … / für die …"],
        ],
        mistakes: [["Der Tutor, mit ich arbeite, …", "Der Tutor, mit dem ich arbeite, …"]],
      },
      {
        title: "3. Sachen: Relativpronomen oder wo(r)-Form?",
        text: "Nach einem klar genannten Nomen ist Präposition + Relativpronomen im formellen Standard meist die sicherste Wahl. Wo(r)-Formen sind besonders natürlich nach das, etwas, nichts, alles oder ohne ausdrücklich genanntes Bezugswort.",
        rows: [
          ["genanntes Nomen", "Das Ziel, auf das ich hinarbeite, ist realistisch."],
          ["das / etwas / nichts / alles", "Das ist etwas, worauf ich mich konzentrieren möchte."],
          ["Präposition beginnt mit Vokal", "woran, worauf, worüber"],
          ["Präposition beginnt mit Konsonant", "womit, wofür, wovon"],
        ],
        mistakes: [["Der Tutor, womit ich arbeite, …", "Der Tutor, mit dem ich arbeite, …"]],
      },
      {
        title: "4. Wortstellung und Zeichensetzung",
        text: "Der Relativsatz steht zwischen Kommas. Das konjugierte Verb steht am Ende. Bei mehreren Verben bildet die Verbgruppe den Satzschluss.",
        examples: [
          "Der Lernplan, an dem ich mich täglich orientiere, bleibt flexibel.",
          "Die Methode, für die ich mich entschieden habe, verbindet Selbstlernen und Feedback.",
          "Das ist genau das, worauf ich langfristig hinarbeiten möchte.",
        ],
        mistakes: [["Der Plan, an dem orientiere ich mich, …", "Der Plan, an dem ich mich orientiere, …"]],
      },
    ],
    model: "Ein realistischer Lernweg braucht ein konkretes Ziel, auf das man systematisch hinarbeiten kann. Besonders hilfreich ist eine Lehrkraft, mit der man regelmäßig die eigenen Schwächen analysiert. Ebenso wichtig ist ein flexibler Plan, an dem man sich im Alltag orientieren kann, ohne jede Abweichung als Misserfolg zu betrachten. Das ist etwas, worauf viele Lernende zu wenig achten: Ein anspruchsvolles Ziel sollte messbar sein, aber dennoch an veränderte Lebensbedingungen angepasst werden können.",
    common: ["Präposition des Verbs vergessen", "Kasus nach der Präposition falsch wählen", "wo(r)-Form für Personen verwenden", "Verb im Relativsatz nicht ans Ende stellen", "zu lange und überladene Relativsätze bilden"],
    practice: ["Notiere vier Verben mit Präposition.", "Verbinde zwei Sätze über einen Tutor mit mit dem oder mit der.", "Bilde einen Satz mit das, worauf …", "Schreibe einen Relativsatz im Perfekt.", "Verfasse 70–90 Wörter über deinen Lernweg und nutze drei Relativsätze."],
    checks: [
      ["Der Tutor, ___ ich arbeite, gibt mir Feedback.", "mit dem – arbeiten mit verlangt den Dativ."],
      ["Das Ziel, ___ ich mich konzentriere, ist das Schreiben.", "auf das – nach einem klar genannten Nomen ist Präposition + Relativpronomen die sichere Standardform."],
      ["Das ist etwas, ___ ich mich konzentrieren möchte.", "worauf – nach etwas ist die wo(r)-Form besonders natürlich."],
    ],
  },
  2: {
    title: "Partizip I und Partizip II als Adjektiv",
    subtitle: "Kulturelle Prägung, laufende Entwicklungen und Ergebnisse kompakt ausdrücken",
    why: "Partizipialattribute verdichten Informationen. Statt eines zusätzlichen Relativsatzes kannst du aktive Prozesse oder bereits entstandene Ergebnisse direkt vor einem Nomen beschreiben.",
    goals: ["Partizip I und Partizip II nach Bedeutung unterscheiden", "beide Formen korrekt bilden", "Adjektivendungen ergänzen", "lange Attribute verständlich begrenzen"],
    sections: [
      {
        title: "1. Partizip I: aktiv oder gleichzeitig",
        text: "Partizip I wird mit Infinitiv + d gebildet. Es beschreibt meist eine handelnde Person, einen aktiven Einfluss oder einen laufenden Prozess.",
        rows: [["prägen", "prägend → eine prägende Kultur"], ["wachsen", "wachsend → eine wachsende Vielfalt"], ["sich verändern", "sich verändernd → eine sich verändernde Gesellschaft"], ["verbinden", "verbindend → eine verbindende Erfahrung"]],
        note: "Das -d gehört zum Partizip. Danach folgt noch die Adjektivendung: prägend + e = prägende.",
      },
      {
        title: "2. Partizip II: Ergebnis oder passive Bedeutung",
        text: "Partizip II beschreibt häufig etwas Abgeschlossenes, Erfahrenes oder von außen Bewirktes.",
        rows: [["prägen", "geprägt → eine kulturell geprägte Identität"], ["diskutieren", "diskutiert → häufig diskutierte Fragen"], ["aufwachsen", "aufgewachsen → in zwei Kulturen aufgewachsene Menschen"], ["beeinflussen", "beeinflusst → medial beeinflusste Vorstellungen"]],
        mistakes: [["eine durch Sprache prägend Identität", "eine durch Sprache geprägte Identität"]],
      },
      {
        title: "3. Adjektivendungen bleiben notwendig",
        text: "Ein Partizip vor einem Nomen funktioniert grammatisch wie ein Adjektiv. Artikel, Kasus, Genus und Numerus bestimmen die Endung.",
        rows: [["Nominativ maskulin", "ein prägender Einfluss"], ["Nominativ feminin", "eine prägende Erfahrung"], ["Nominativ neutrum", "ein prägendes Erlebnis"], ["Plural", "kulturell geprägte Lebenswege"]],
        mistakes: [["eine prägend Kultur", "eine prägende Kultur"]],
      },
      {
        title: "4. Erweiterte Attribute oder Relativsatz?",
        text: "Ergänzungen stehen vor dem Partizip und dem Nomen. Wird die Gruppe zu lang, ist ein Relativsatz lesbarer.",
        examples: ["eine durch Familie, Sprache und Alltag geprägte Identität", "in mehreren kulturellen Kontexten aufgewachsene Menschen", "eine sich kontinuierlich verändernde Gesellschaft", "Menschen, die in mehreren kulturellen Kontexten aufgewachsen sind"],
        note: "C1 bedeutet nicht, den längstmöglichen Satz zu schreiben. Präzision und Lesbarkeit sind wichtiger als maximale Verdichtung.",
      },
    ],
    model: "Die persönliche Identität entsteht in einem sich ständig verändernden sozialen Umfeld. Eine durch Sprache, Familie und Alltag geprägte Biografie lässt sich deshalb selten auf eine einzige Herkunft reduzieren. Besonders in mehreren Kulturen aufgewachsene Menschen entwickeln häufig ein vielschichtiges Zugehörigkeitsgefühl. Gleichzeitig können vereinfachende gesellschaftliche Erwartungen dazu führen, dass komplexe Lebenswege nur unzureichend wahrgenommen werden. Ein offenes Identitätsverständnis sollte daher sowohl prägende Erfahrungen als auch laufende persönliche Veränderungen berücksichtigen.",
    common: ["Partizip I und II nach Form statt nach Bedeutung wählen", "Adjektivendung vergessen", "reflexives sich auslassen", "Ergänzungen hinter statt vor das Partizip setzen", "zu lange Attribute ohne klare Struktur bilden"],
    practice: ["Bilde Partizip I aus verändern, verbinden und wachsen.", "Bilde Partizip II aus prägen, beeinflussen und diskutieren.", "Forme einen Relativsatz in ein Partizipialattribut um.", "Forme ein langes Partizipialattribut zurück in einen Relativsatz.", "Schreibe 80–100 Wörter über kulturelle Identität und nutze mindestens vier Partizipialattribute."],
    checks: [["eine Kultur, die Menschen prägt", "eine prägende Kultur – aktive Bedeutung, daher Partizip I."], ["eine Identität, die durch Migration geprägt wurde", "eine durch Migration geprägte Identität – Ergebnis/passive Bedeutung, daher Partizip II."], ["Menschen, die in zwei Kulturen aufgewachsen sind", "in zwei Kulturen aufgewachsene Menschen."]],
  },
  3: {
    title: "Konjunktiv I für indirekte Rede",
    subtitle: "Aussagen aus Medien, Studien und Interviews sachlich und distanziert wiedergeben",
    why: "Mit dem Konjunktiv I kennzeichnest du, dass eine Aussage von einer anderen Quelle stammt. Du berichtest, ohne automatisch zu bestätigen, dass die Information wahr ist.",
    goals: ["direkte in indirekte Rede umformen", "häufige Konjunktiv-I-Formen verwenden", "Gegenwart, Vergangenheit und Zukunft wiedergeben", "bei identischen Formen sinnvoll auf Konjunktiv II ausweichen"],
    sections: [
      {
        title: "1. Funktion: berichten statt bestätigen",
        text: "Ein Einleitungsverb nennt die Quelle. Der folgende Konjunktiv zeigt sprachliche Distanz.",
        rows: [["berichten", "Der Journalist berichtet, die Quelle sei unzuverlässig."], ["behaupten", "Die Plattform behauptet, sie habe reagiert."], ["betonen", "Die Expertin betont, Medienbildung müsse früher beginnen."], ["warnen", "Fachleute warnen, Desinformation könne Vertrauen zerstören."]],
        note: "Konjunktiv I bedeutet nicht automatisch Zweifel. Er markiert zunächst nur: Diese Aussage stammt von jemand anderem.",
      },
      {
        title: "2. Wichtige Formen",
        text: "Besonders häufig sind sein, haben, werden und Modalverben.",
        rows: [["sein", "er/sie sei · sie seien"], ["haben", "er/sie habe · sie hätten*"], ["werden", "er/sie werde · sie würden*"], ["können / müssen / sollen", "könne · müsse · solle"], ["regelmäßiges Verb", "er sage · sie erkläre · die Studie zeige"]],
        note: "*Wenn eine Konjunktiv-I-Form mit dem Indikativ identisch ist, wird häufig Konjunktiv II verwendet: sie hätten, sie würden.",
      },
      {
        title: "3. Zeitverhältnisse ausdrücken",
        text: "Indirekte Rede kann Gegenwart, Vergangenheit und Zukunft wiedergeben.",
        rows: [["Gegenwart", "Sie erklärt, die Quelle sei zuverlässig."], ["Vergangenheit", "Sie erklärt, die Redaktion habe den Beitrag geprüft."], ["Passiv Vergangenheit", "Sie erklärt, der Beitrag sei geprüft worden."], ["Zukunft", "Sie erklärt, die Plattform werde neue Regeln einführen."]],
        mistakes: [["Die Plattform sagt, sie hat neue Regeln eingeführt.", "Die Plattform sagt, sie habe neue Regeln eingeführt."]],
      },
      {
        title: "4. Dass-Satz oder uneingeleitete indirekte Rede",
        text: "Beide Formen sind möglich. Im dass-Satz steht das Verb am Ende. Ohne dass bleibt die normale Satzstruktur erhalten.",
        examples: ["Die Studie zeige, dass viele Jugendliche Nachrichten online konsumierten.", "Die Studie zeige, viele Jugendliche konsumierten Nachrichten online.", "Experten erklärten, die Lage sei komplexer als zunächst angenommen."],
        mistakes: [["Die Studie zeige, dass Medienbildung sei wichtig.", "Die Studie zeige, dass Medienbildung wichtig sei."]],
      },
    ],
    model: "Eine aktuelle Studie komme zu dem Ergebnis, dass viele Nutzer Nachrichten hauptsächlich über soziale Netzwerke konsumierten. Die Forschenden erklärten, emotional formulierte Beiträge würden häufiger geteilt als sachliche Analysen. Zugleich betonten sie, eine hohe Reichweite sei kein Beleg für Glaubwürdigkeit. Medienpädagogen forderten daher, Quellenprüfung müsse bereits in der Schule systematisch vermittelt werden. Plattformen behaupteten zwar, sie hätten ihre Kontrollmechanismen verbessert, unabhängige Fachleute warnten jedoch, technische Maßnahmen allein könnten das Problem nicht lösen.",
    common: ["Konjunktiv I mit eigener Meinung verwechseln", "Indikativ unverändert übernehmen", "Verbposition im dass-Satz falsch setzen", "Vergangenheit ohne habe/sei bilden", "identische Formen nicht durch Konjunktiv II verdeutlichen"],
    practice: ["Forme vier direkte Aussagen in indirekte Rede um.", "Nutze dabei sei, habe, müsse und könne.", "Bilde eine indirekte Aussage in der Vergangenheit.", "Bilde einen dass-Satz mit Verbendstellung.", "Schreibe einen Medienabsatz mit mindestens drei Quellenverben."],
    checks: [["Der Journalist sagt: Die Quelle ist unzuverlässig.", "Der Journalist sagt, die Quelle sei unzuverlässig."], ["Die Plattform erklärt: Wir haben reagiert.", "Die Plattform erklärt, sie habe reagiert."], ["Die Studie zeigt: Medienbildung ist wichtig.", "Die Studie zeige, Medienbildung sei wichtig."]],
  },
  4: {
    title: "Erweiterte Partizipialattribute",
    subtitle: "Teammitglieder, Konflikte, Aufgaben und Ergebnisse präzise beschreiben",
    why: "In sachlichen C1-Texten kannst du mit erweiterten Partizipialattributen komplexe Informationen kompakt vor einem Nomen bündeln. Dabei müssen Bedeutung, Endung und Reihenfolge klar bleiben.",
    goals: ["aktive und passive Bedeutung unterscheiden", "Ergänzungen richtig vor dem Partizip anordnen", "Partizipien korrekt deklinieren", "zwischen kompakter Form und lesbarem Relativsatz entscheiden"],
    sections: [
      {
        title: "1. Aktiv handelnd: Partizip I",
        text: "Das Bezugswort führt die Handlung selbst aus.",
        rows: [["Kollegin unterstützt", "eine unterstützende Kollegin"], ["Teammitglieder suchen", "die nach einer Lösung suchenden Teammitglieder"], ["Beschäftigte kommunizieren", "offen miteinander kommunizierende Beschäftigte"], ["Führungskraft motiviert", "eine das Team motivierende Führungskraft"]],
        mistakes: [["die nach einer Lösung gesuchten Mitarbeitenden", "die nach einer Lösung suchenden Mitarbeitenden"]],
      },
      {
        title: "2. Betroffen oder abgeschlossen: Partizip II",
        text: "Das Bezugswort ist Ergebnis einer Handlung oder von ihr betroffen.",
        rows: [["Aufgaben wurden verteilt", "klar verteilte Aufgaben"], ["Entscheidung wurde getroffen", "die gemeinsam getroffene Entscheidung"], ["Konflikt wurde nicht gelöst", "ein ungelöster Konflikt"], ["Ziele wurden formuliert", "die von der Leitung formulierten Ziele"]],
        note: "Frage dich: Handelt das Nomen selbst, oder wurde mit ihm etwas getan?",
      },
      {
        title: "3. Reihenfolge im erweiterten Attribut",
        text: "Alle Ergänzungen stehen zwischen Artikel und Partizip. Das Partizip steht unmittelbar vor dem Nomen und trägt die Adjektivendung.",
        examples: ["die nach einem tragfähigen Kompromiss suchenden Teammitglieder", "die von allen Beteiligten gemeinsam getroffene Entscheidung", "ein durch unklare Zuständigkeiten entstandener Konflikt", "die unter hohem Zeitdruck arbeitenden Beschäftigten"],
        mistakes: [["die Teammitglieder nach einer Lösung suchenden", "die nach einer Lösung suchenden Teammitglieder"]],
      },
      {
        title: "4. Kompakt schreiben, aber lesbar bleiben",
        text: "Ein langes Attribut kann elegant sein, aber mehrere verschachtelte Ergänzungen erschweren das Verständnis. Dann ist ein Relativsatz besser.",
        rows: [["kompakt", "die von der Leitung klar formulierten Ziele"], ["Relativsatz", "die Ziele, die von der Leitung klar formuliert wurden"], ["zu schwer", "die trotz mehrerer Gespräche noch immer nicht vollständig geklärten Zuständigkeiten"], ["lesbarer", "die Zuständigkeiten, die trotz mehrerer Gespräche noch nicht vollständig geklärt sind"]],
      },
    ],
    model: "Erfolgreiche Teamarbeit setzt klar verteilte Aufgaben und offen kommunizierende Teammitglieder voraus. Ein durch unklare Zuständigkeiten entstandener Konflikt kann selbst ein motiviertes Team langfristig belasten. Besonders wichtig sind daher von allen Beteiligten akzeptierte Gesprächsregeln und eine unterstützende Führungskraft. Die nach einer tragfähigen Lösung suchenden Mitarbeitenden sollten unterschiedliche Interessen offen benennen. Gleichzeitig müssen gemeinsam getroffene Entscheidungen verbindlich umgesetzt werden, damit ein bereits gelöster Konflikt nicht erneut entsteht.",
    common: ["Aktiv und passiv verwechseln", "Partizipendung vergessen", "Ergänzungen an die falsche Stelle setzen", "Partizip I ohne -d bilden", "zu lange Attribute statt eines Relativsatzes verwenden"],
    practice: ["Forme vier Relativsätze in Partizipialattribute um.", "Markiere bei jedem Beispiel aktiv oder passiv.", "Erweitere zwei Attribute mit einer Präpositionalgruppe.", "Forme ein sehr langes Attribut in einen Relativsatz zurück.", "Schreibe 80–100 Wörter über einen Teamkonflikt."],
    checks: [["Kolleginnen, die konstruktiv kommunizieren", "konstruktiv kommunizierende Kolleginnen."], ["Aufgaben, die klar verteilt wurden", "klar verteilte Aufgaben."], ["Mitarbeitende, die nach einem Kompromiss suchen", "nach einem Kompromiss suchende Mitarbeitende."]],
  },
  5: {
    title: "Konditionale und finale Strukturen",
    subtitle: "Bedingungen, Voraussetzungen und berufliche Ziele formell ausdrücken",
    why: "In Anträgen und beruflichen Stellungnahmen musst du klar unterscheiden: Unter welcher Bedingung ist etwas möglich, und zu welchem Zweck soll eine Maßnahme dienen?",
    goals: ["Bedingungen mit wenn, falls, sofern und vorausgesetzt, dass abstufen", "formelle Verb-Erst-Sätze bilden", "um … zu und damit unterscheiden", "formelle Zweckangaben passend einsetzen"],
    sections: [
      {
        title: "1. Bedingungen unterschiedlich stark formulieren",
        text: "Die Konnektoren unterscheiden sich in Sicherheit und Formalität.",
        rows: [["wenn", "neutrale oder wiederholte Bedingung"], ["falls", "mögliche, eher unsichere Bedingung"], ["sofern", "formelle Voraussetzung; nur wenn"], ["vorausgesetzt, dass", "ausdrücklich notwendige Bedingung"]],
        examples: ["Falls der Kurs während der Arbeitszeit stattfindet, würde ich die Stunden nachholen.", "Sofern das Unternehmen die Kosten teilweise übernimmt, kann ich mich anmelden.", "Vorausgesetzt, dass meine Aufgaben vertreten werden, könnte ich teilnehmen."],
      },
      {
        title: "2. Wortstellung und formelle Verb-Erst-Struktur",
        text: "Im konditionalen Nebensatz steht das Verb am Ende. Eine formelle Alternative beginnt direkt mit dem konjugierten Verb.",
        rows: [["Nebensatz zuerst", "Sofern Sie zustimmen, kann ich im September beginnen."], ["Hauptsatz zuerst", "Ich kann im September beginnen, sofern Sie zustimmen."], ["Verb-Erst", "Sollten Sie zustimmen, könnte ich im September beginnen."], ["Vergangenheit", "Hätten Sie früher zugestimmt, hätte ich bereits teilnehmen können."]],
        mistakes: [["Sollten Sie zustimmen, ich könnte beginnen.", "Sollten Sie zustimmen, könnte ich beginnen."]],
      },
      {
        title: "3. um … zu oder damit?",
        text: "Entscheidend ist, ob in beiden Satzteilen dieselbe handelnde Person gemeint ist.",
        rows: [["gleiches Subjekt", "Ich besuche den Kurs, um meine Kompetenzen zu erweitern."], ["unterschiedliche Subjekte", "Das Unternehmen gewährt Lernzeit, damit ich teilnehmen kann."], ["Modalverb", "…, um künftig mehr Verantwortung übernehmen zu können."], ["Negation", "…, damit keine wichtigen Aufgaben liegen bleiben."]],
        mistakes: [["Das Unternehmen unterstützt mich, um ich teilnehmen kann.", "Das Unternehmen unterstützt mich, damit ich teilnehmen kann."]],
      },
      {
        title: "4. Formelle Zweckangaben",
        text: "Nominale Wendungen variieren den Stil, sollten aber natürlich und präzise bleiben.",
        rows: [["mit dem Ziel, … zu", "mit dem Ziel, die Qualität zu verbessern"], ["zu dem Zweck, … zu", "zu dem Zweck, Wissen im Team weiterzugeben"], ["zwecks + Genitiv", "zwecks beruflicher Weiterbildung"], ["für + Akkusativ", "für die Übernahme neuer Aufgaben"]],
        note: "Zwecks wirkt sehr formell und bürokratisch. In einer normalen E-Mail ist um … zu oft klarer.",
      },
    ],
    model: "Sehr geehrte Frau Keller, ich möchte Sie um Unterstützung bei einer Weiterbildung im Projektmanagement bitten. Sofern das Unternehmen einen Teil der Kosten übernehmen könnte, würde ich mich noch in diesem Monat anmelden. Die Weiterbildung möchte ich absolvieren, um künftig komplexere Projekte koordinieren zu können. Zusätzlich wäre eine begrenzte Freistellung hilfreich, damit ich an den verpflichtenden Präsenzterminen teilnehmen kann. Sollten Sie meinem Antrag grundsätzlich zustimmen, würde ich einen detaillierten Zeit- und Vertretungsplan vorlegen. Das erworbene Wissen könnte anschließend im Team weitergegeben werden, damit auch andere Beschäftigte davon profitieren.",
    common: ["Bedingung und Zweck verwechseln", "Verb im Nebensatz nicht ans Ende stellen", "nach Verb-Erst keinen vollständigen Hauptsatz bilden", "um … zu trotz unterschiedlicher Subjekte verwenden", "zu viele bürokratische Nominalformen kombinieren"],
    practice: ["Formuliere dieselbe Bedingung mit falls, sofern und vorausgesetzt, dass.", "Bilde einen Satz mit Sollten Sie …", "Entscheide in fünf Beispielen zwischen um … zu und damit.", "Formuliere eine formelle Zweckangabe.", "Schreibe eine E-Mail von 100–130 Wörtern mit zwei Bedingungen und zwei Zweckstrukturen."],
    checks: [["Das Unternehmen übernimmt die Kosten. Dann melde ich mich an. – sofern", "Sofern das Unternehmen die Kosten übernimmt, melde ich mich an."], ["Ich besuche den Kurs. Ich möchte Projektmanagement lernen.", "Ich besuche den Kurs, um Projektmanagement zu lernen."], ["Die Leitung gewährt Lernzeit. Die Mitarbeitenden können teilnehmen.", "Die Leitung gewährt Lernzeit, damit die Mitarbeitenden teilnehmen können."]],
  },
  6: {
    title: "Kausale, konsekutive und konzessive Strukturen",
    subtitle: "Ursachen, Folgen und Einschränkungen logisch und sprachlich klar unterscheiden",
    why: "Eine differenzierte C1-Argumentation zeigt nicht nur, dass zwei Aussagen zusammenhängen. Sie macht deutlich, ob etwas ein Grund, eine Folge oder ein unerwarteter Gegensatz ist.",
    goals: ["kausale, konsekutive und konzessive Bedeutung unterscheiden", "Nebensatz- und Hauptsatzkonnektoren korrekt verwenden", "nominale Strukturen mit Genitiv bilden", "logische Fehler in Argumentationen vermeiden"],
    sections: [
      {
        title: "1. Drei Bedeutungen sicher unterscheiden",
        text: "Stelle zuerst die richtige Frage. Danach wählst du die grammatische Struktur.",
        rows: [["kausal: Warum?", "Da der Zeitdruck zunimmt, leiden viele Beschäftigte unter Stress."], ["konsekutiv: Mit welcher Folge?", "Der Zeitdruck steigt, sodass die Erholung leidet."], ["konzessiv: Trotz welchen Hindernisses?", "Obwohl Kurse angeboten werden, können nicht alle teilnehmen."]],
        note: "Grund und Folge beschreiben denselben Zusammenhang aus unterschiedlicher Perspektive: Wegen des Zeitdrucks fehlt Erholung. Der Zeitdruck ist hoch, sodass Erholung fehlt.",
      },
      {
        title: "2. Nebensätze und Hauptsatzadverbien",
        text: "Die Wortstellung hängt von der grammatischen Kategorie ab.",
        rows: [["da / zumal", "Nebensatz; Verb am Ende"], ["sodass", "Folgesatz; Verb am Ende"], ["obwohl / obgleich / selbst wenn", "Nebensatz; Verb am Ende"], ["daher / folglich / somit / dennoch", "Hauptsatz; Verb auf Position zwei"]],
        examples: ["Die Belastung nimmt zu. Daher wird Prävention wichtiger.", "Obwohl das Angebot kostenlos ist, können nicht alle teilnehmen.", "Flexible Zeiten sind sinnvoll, zumal viele Beschäftigte Familienpflichten haben."],
        mistakes: [["Daher Prävention wird wichtiger.", "Daher wird Prävention wichtiger."]],
      },
      {
        title: "3. Nominaler Stil mit Genitiv",
        text: "Nominale Strukturen sind in formellen Texten nützlich, dürfen aber nicht jeden Satz schwer machen.",
        rows: [["aufgrund", "aufgrund des hohen Zeitdrucks"], ["angesichts", "angesichts der steigenden Belastung"], ["infolge", "infolge lang anhaltender Überforderung"], ["trotz", "trotz des kostenlosen Angebots"]],
        mistakes: [["angesichts die hohe Belastung", "angesichts der hohen Belastung"]],
      },
      {
        title: "4. Reale Tatsache oder hypothetischer Einwand?",
        text: "Obwohl und obgleich beziehen sich meist auf eine reale Tatsache. Selbst wenn stellt häufig eine angenommene Situation auf.",
        rows: [["obwohl", "Obwohl der Kurs kostenlos ist, fehlt manchen die Zeit."], ["obgleich", "Obgleich Prävention wichtig ist, darf sie nicht bevormunden."], ["selbst wenn", "Selbst wenn der Kurs kostenlos wäre, könnten nicht alle teilnehmen."], ["dennoch", "Der Kurs ist kostenlos. Dennoch können nicht alle teilnehmen."]],
        note: "Achte auf den Modus: Bei einer hypothetischen Situation steht häufig Konjunktiv II: selbst wenn … wäre / hätte / könnte.",
      },
    ],
    model: "Angesichts zunehmender psychischer Belastungen gewinnt Prävention an Bedeutung. Viele Beschäftigte stehen unter dauerhaftem Zeitdruck, sodass Erholung und Bewegung häufig vernachlässigt werden. Obwohl manche Unternehmen Gesundheitsprogramme anbieten, erreichen diese nicht alle Mitarbeitenden. Selbst wenn ein Kurs kostenlos wäre, könnten Personen mit Schichtarbeit oder Familienpflichten möglicherweise nicht teilnehmen. Daher sollten Institutionen flexible Angebote schaffen. Zugleich darf Eigenverantwortung nicht vollständig ausgeblendet werden, zumal langfristige Veränderungen auch persönliche Entscheidungen voraussetzen.",
    common: ["Grund und Folge vertauschen", "Hauptsatzadverb mit Nebensatzwortstellung verwenden", "Genitiv nach angesichts oder trotz falsch bilden", "obwohl für eine Ursache verwenden", "selbst wenn ohne passenden hypothetischen Kontext einsetzen"],
    practice: ["Ordne zehn Konnektoren den drei Bedeutungen zu.", "Forme einen weil-Satz in eine Nominalgruppe mit aufgrund um.", "Forme eine Ursache in eine Folge mit sodass um.", "Schreibe einen realen Gegensatz mit obwohl und einen hypothetischen mit selbst wenn.", "Verfasse 90–110 Wörter über Gesundheit mit mindestens je einer kausalen, konsekutiven und konzessiven Struktur."],
    checks: [["Der Zeitdruck steigt. Gesunde Routinen werden vernachlässigt. – sodass", "Der Zeitdruck steigt, sodass gesunde Routinen vernachlässigt werden."], ["Die Belastung nimmt zu. Prävention wird wichtiger. – daher", "Die Belastung nimmt zu. Daher wird Prävention wichtiger."], ["Der Kurs ist kostenlos. Nicht alle können teilnehmen. – obwohl", "Obwohl der Kurs kostenlos ist, können nicht alle teilnehmen."]],
  },
};

export const hasC1GuidedGrammar = (day) => Boolean(lessons[Number(day)]);

export default function C1Day1To6GrammarNotes({ day, checked = false, onCheckedChange }) {
  const lesson = lessons[Number(day)];
  if (!lesson) return null;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>C1 · Day {day} · Grammar Notes</span>
        <h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>{lesson.title}</h2>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>{lesson.subtitle}</p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Warum brauchst du diese Grammatik auf C1?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>{lesson.why}</p>
        <NoteBox>
          <strong>Nach dieser Lektion kannst du:</strong>
          <ul style={{ ...listStyle, marginTop: 8 }}>{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
        </NoteBox>
      </section>

      {lesson.sections.map((section) => (
        <section key={section.title} style={card}>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{section.title}</h2>
          <p style={{ margin: 0, lineHeight: 1.75 }}>{section.text}</p>
          {section.rows ? (
            <Table>
              <thead><tr><th style={cellStyle}>Struktur / Bedeutung</th><th style={cellStyle}>Form / Beispiel</th></tr></thead>
              <tbody>{section.rows.map(([left, right]) => <tr key={`${left}-${right}`}><td style={cellStyle}><strong>{left}</strong></td><td style={cellStyle}>{right}</td></tr>)}</tbody>
            </Table>
          ) : null}
          {section.examples ? <ExampleBox>{section.examples.map((example) => <div key={example}>• {example}</div>)}</ExampleBox> : null}
          {section.note ? <NoteBox tone="amber"><strong>Merke:</strong> {section.note}</NoteBox> : null}
          {(section.mistakes || []).map(([wrong, correct]) => <Mistake key={wrong} wrong={wrong} correct={correct} />)}
        </section>
      ))}

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>C1-Modellabsatz</h2>
        <NoteBox tone="green">{lesson.model}</NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Typische Fehler</h2>
        <ul style={listStyle}>{lesson.common.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Schrittweise Mini-Übung</h2>
        <ol style={listStyle}>{lesson.practice.map((item) => <li key={item}>{item}</li>)}</ol>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Selbstkontrolle</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Löse die Aufgabe zuerst selbst und öffne danach die Antwort.</p>
        {lesson.checks.map(([question, answer], index) => (
          <CheckAnswer key={question} question={`${index + 1}. ${question}`}><strong>Lösung:</strong> {answer}</CheckAnswer>
        ))}
      </section>

      <section style={card}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.6 }}>
          <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onCheckedChange?.(event.target.checked)} style={{ marginTop: 4 }} />
          <span>Ich habe die vollständigen Grammatiknotizen gelesen und die Beispiele verstanden.</span>
        </label>
      </section>
    </div>
  );
}
