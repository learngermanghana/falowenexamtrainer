export const B2_READING = Object.freeze({
  teil1: {
    title: "Teil 1",
    time: "18 Minuten",
    intro:
      "Sie lesen in einem Forum, wie Menschen über Minimalismus im täglichen Leben denken. Auf welche der vier Personen (A, B, C oder D) treffen die einzelnen Aussagen zu? Die Personen können mehrmals gewählt werden.",
    forumTitle: "Minimalismus – Befreiung oder moderner Luxus?",
    people: [
      {
        id: "A",
        name: "Sandra",
        meta: "34, Grafikdesignerin",
        text:
          "Vor zwei Jahren habe ich angefangen, mein Leben radikal auszumisten. Ich besaß viel zu viele Dinge, die mich gedanklich belastet haben. Beim Entrümpeln habe ich bestimmt die Hälfte meiner Kleidung und Möbel verschenkt oder verkauft. Seitdem fühle ich mich deutlich freier und habe viel weniger Stress im Alltag. Wenn ich heute etwas kaufe, achte ich extrem auf hohe Qualität und Langlebigkeit, anstatt mir billige Massenware anzuschaffen. Für mich bedeutet Minimalismus vor allem, sich auf das Wesentliche zu konzentrieren und nicht ständig dem neuesten Konsumtrend hinterherzulaufen.",
      },
      {
        id: "B",
        name: "Michael",
        meta: "41, Ingenieur",
        text:
          "Ich sehe diesen ganzen Hype um den Minimalismus eher kritisch. Ehrlich gesagt ist das für mich ein Phänomen von wohlhabenden Menschen, die es sich leisten können, Dinge wegzuwerfen – weil sie im Notfall einfach alles neu kaufen können. Als Vater von zwei Kindern ist ein minimalistischer Haushalt für mich völlig unpraktisch. Wir brauchen Werkzeuge, alte Kleidung zum Wechseln und Vorräte. Man weiß nie, wann man etwas noch einmal gebrauchen kann. Warum sollte ich gut funktionierende Gegenstände entsorgen, nur um einem Modetrend zu folgen?",
      },
      {
        id: "C",
        name: "Elena",
        meta: "28, Studentin",
        text:
          "Für mich steht beim Minimalismus der ökologische Aspekt im Vordergrund. Wenn wir weniger konsumieren, schützen wir die Umwelt und reduzieren Müll. Ich lebe auf engem Raum in einer WG und besitze kaum physische Gegenstände – Bücher, Musik und Dokumente habe ich komplett digitalisiert. Das spart enorm viel Platz. Außerdem gebe ich mein Geld lieber für Erlebnisse wie Reisen oder Konzertbesuche aus als für materielle Dinge. Dieser Lebensstil schont nicht nur meinen Geldbeutel, sondern macht mich auch viel flexibler.",
      },
      {
        id: "D",
        name: "Florian",
        meta: "52, Lehrer",
        text:
          "Ich bin durch eine berufliche Krise zum Minimalismus gekommen. Ich habe gemerkt, dass mich mein Vollzeitjob und der ständige Leistungsdruck krank gemacht haben. Deshalb habe ich meine Arbeitszeit reduziert. Ich verdiene zwar jetzt weniger Geld, habe aber viel mehr wertvolle Freizeit gewonnen. Für mich bedeutet Minimalismus nicht nur, weniger Dinge zu besitzen, sondern auch gedanklich auszumisten: weniger Zeit in sozialen Medien zu verbringen und öfter mal unerreichbar zu sein. Diese mentale Ruhe ist mir wichtiger als jeder materielle Wohlstand.",
      },
    ],
    example: {
      number: 0,
      statement: "hat durch das Entrümpeln der Wohnung mehr Leichtigkeit im Alltag gewonnen.",
      answer: "A",
    },
    questions: [
      { number: 1, statement: "meint, dass Minimalismus ein Trend für finanzielle Besserverdiener ist.", answer: "B" },
      { number: 2, statement: "legt beim Einkaufen großen Wert auf gute Verarbeitung und Haltbarkeit.", answer: "A" },
      { number: 3, statement: "nutzt digitale Medien, um Wohnraum zu sparen.", answer: "C" },
      { number: 4, statement: "verringerte die Arbeitszeit, um mehr Lebensqualität und Zeit zu haben.", answer: "D" },
      { number: 5, statement: "verzichtet bewusst auf die ständige Nutzung digitaler Netzwerke.", answer: "D" },
      { number: 6, statement: "hält es für sinnvoll, Gegenstände für eine spätere Nutzung aufzubewahren.", answer: "B" },
      { number: 7, statement: "investiert verfügbares Geld bevorzugt in Aktivitäten statt in Eigentum.", answer: "C" },
      { number: 8, statement: "sieht im verringerten Konsum vor allem einen Beitrag zum Umweltschutz.", answer: "C" },
      { number: 9, statement: "findet einen minimalistischen Lebensstil mit einer Familie schwer umsetzbar.", answer: "B" },
    ],
  },  teil2: {
    title: "Teil 2",
    time: "12 Minuten",
    intro:
      "Lesen Sie den Text aus einer Zeitung. Welche Sätze (A–H) passen in die Lücken (10–15)? Zwei Sätze passen nicht. Markieren Sie Ihre Antworten.",
    articleTitle: "Die Renaissance der Reparaturkultur",
    paragraphs: [
      {
        number: 10,
        before:
          "In vielen Städten schießen sogenannte Repair-Cafés wie Pilze aus dem Boden. Hier kommen Menschen zusammen, um defekte Toaster, Fahrräder oder Kleidungsstücke gemeinsam zu reparieren, statt sie wegzuwerfen.",
        after:
          "Initiatoren betonen, dass es bei diesen Treffen nicht nur um Geldersparnis geht, sondern vor allem um ein neues Bewusstsein für Nachhaltigkeit.",
      },
      {
        number: 11,
        before:
          "Früher war das Reparieren eine Selbstverständlichkeit, da Konsumgüter teuer und kostbar waren. Mit dem Aufkommen der Massenproduktion und günstiger Importe veränderte sich jedoch das Konsumverhalten radikal.",
        after:
          "Wegwerfen und Neuanschaffen wurde für viele Verbraucher oft günstiger und bequemer, als Ersatzteile zu beschaffen oder professionelle Handwerker zu bezahlen.",
      },
      {
        number: 12,
        before:
          "Die Folgen dieser Entwicklung für die Umwelt sind gravierend. Riesige Mengen an Elektroschrott belasten die Ökosysteme weltweit, und wertvolle Rohstoffe gehen unwiederbringlich verloren.",
        after:
          "Aus diesem Grund fordern Verbraucherschützer und Umweltorganisationen schon seit Längerem ein gesetzlich verankertes „Recht auf Reparatur“.",
      },
      {
        number: 13,
        before:
          "Dieses Konzept soll Hersteller dazu verpflichten, technische Geräte von vornherein so zu konstruieren, dass sie problemlos geöffnet und repariert werden können.",
        after:
          "Darüber hinaus müssen Ersatzteile über viele Jahre hinweg zu angemessenen Preisen zur Verfügung gestellt werden. Erste Richtlinien der Europäischen Union weisen bereits in diese Richtung.",
      },
      {
        number: 14,
        before:
          "Allerdings gibt es auch Kritik seitens mancher Industrieunternehmen. Sie befürchten hohe Zusatzkosten bei der Produktentwicklung und verweisen auf Sicherheitsrisiken, wenn Laien an komplexen elektronischen Geräten hantieren.",
        after:
          "Befürworter halten dagegen, dass gut verständliche Anleitungen und modulare Bauweisen solche Gefahren minimieren können.",
      },
      {
        number: 15,
        before:
          "Der Erfolg der Repair-Cafés zeigt jedenfalls, dass in der Bevölkerung ein Umdenken stattfindet. Das gemeinsame Werkeln stärkt zudem das Gemeinschaftsgefühl in den Nachbarschaften.",
        after:
          "Am Ende profitieren somit nicht nur die Umwelt und der Geldbeutel, sondern auch das soziale Miteinander.",
      },
    ],
    sentences: [
      {
        id: "A",
        text:
          "Viele Unternehmen befürchten zudem, dass durch erzwungene Transparenz geschützte Betriebsgeheimnisse offengelegt werden könnten.",
      },
      {
        id: "B",
        text:
          "Ehrenamtliche Fachleute unterstützen die Besucherinnen und Besucher dabei kostenlos mit Werkzeug und praktischem Know-how.",
      },
      {
        id: "C",
        text:
          "Gegenstände wurden zunehmend als Einwegprodukte betrachtet, die nach kurzem Gebrauch einfach ersetzt wurden.",
      },
      {
        id: "D",
        text:
          "Daher suchen immer mehr Bürgerinnen und Bürger nach Möglichkeiten, den wachsenden Müllbergen etwas entgegenzusetzen.",
      },
      {
        id: "E",
        text:
          "Deshalb weigern sich viele Kunden heutzutage komplett, neue elektronische Geräte zu kaufen.",
      },
      {
        id: "F",
        text:
          "Zudem müsste die starke Verklebung von Gehäusen, die das eigenständige Öffnen verhindert, verboten werden.",
      },
      {
        id: "G",
        text:
          "Aus diesem Grund bieten immer mehr Schulen verpflichtenden Handwerksunterricht für Kinder an.",
      },
      {
        id: "H",
        text:
          "Viele Menschen erleben es als sehr befriedigend, ein kaputtes Objekt wieder selbst funktionstüchtig zu machen.",
      },
    ],
    answers: {
      10: "B",
      11: "C",
      12: "D",
      13: "F",
      14: "A",
      15: "H",
    },
  },

  teil3: {
    title: "Teil 3",
    time: "12 Minuten",
    intro:
      "Lesen Sie den Text aus einer Zeitung und die Aufgaben 16 bis 21 dazu. Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.",
    articleTitle: "Arbeitswelt im Wandel: Die Vier-Tage-Woche auf dem Prüfstand",
    paragraphs: [
      "Immer mehr Unternehmen in Deutschland testen ein Arbeitsmodell, das vor wenigen Jahren noch als nahezu undenkbar galt: die Vier-Tage-Woche bei vollem Lohnausgleich. Während Gewerkschaften und Arbeitnehmervertreter das Modell als bahnbrechenden Schritt für die Gesundheit und Zufriedenheit der Beschäftigten feiern, äußern viele Wirtschaftsverbände erhebliche Bedenken hinsichtlich der Wettbewerbsfähigkeit und Produktivität.",
      "Ein großes Pilotprojekt in Großbritannien sowie ähnliche Versuche in skandinavischen Ländern zeigten überraschend vielversprechende Ergebnisse. Die Mehrheit der teilnehmenden Betriebe berichtete von einer gleichbleibenden oder sogar steigenden Produktivität, obwohl die Gesamtarbeitszeit von 40 auf 32 Stunden reduziert wurde. Zudem ging der Krankenstand unter den Angestellten spürbar zurück. Psychologen erklären diesen Effekt damit, dass Beschäftigte durch das verlängerte Wochenende deutlich besser entspannen können und motivierter an ihren Arbeitsplatz zurückkehren.",
      "Dennoch lässt sich das Modell nicht ohne Weiteres auf alle Branchen übertragen. Besonders im Dienstleistungssektor, in der Pflege sowie im Handwerk stoßen Unternehmen schnell an ihre Grenzen. In Berufen, die eine ständige Präsenz vor Ort erfordern, bedeutet eine Reduzierung der Arbeitszeit, dass zusätzliches Personal eingestellt werden muss, um die entstehenden Lücken zu füllen. Angesichts des akuten Fachkräftemangels in vielen Wirtschaftsbereichen halten Kritiker dies jedoch für eine reine Illusion.",
      "Ein weiteres Argument der Gegner betrifft die sogenannte Arbeitsverdichtung. Wenn die gleiche Arbeitsmenge in vier statt fünf Tagen erledigt werden muss, steigt der tägliche Stresspegel für die Beschäftigten erheblich. Pausenzeiten werden oft verkürzt, und der informelle Austausch unter Kolleginnen und Kollegen leidet. Einige Experten warnen daher davor, dass der vermeintliche Gewinn an Freizeit durch eine deutlich höhere Belastung an den verbleibenden Arbeitstagen teuer erkauft werden könnte.",
      "Trotz aller Einwände zeichnet sich ab, dass flexible Arbeitszeitmodelle für die jüngere Generation von Arbeitnehmern ein entscheidendes Kriterium bei der Arbeitgeberwahl darstellen. Betriebe, die sich diesen Entwicklungen komplett verschließen, könnten es in Zukunft schwer haben, qualifizierten Nachwuchs zu gewinnen. Fachleute plädieren daher für individuelle, branchenspezifische Lösungen anstelle starrer gesetzlicher Vorgaben für die gesamte Wirtschaft.",
    ],
    questions: [
      {
        number: 16,
        question: "Die Einführung der Vier-Tage-Woche bei gleichem Gehalt …",
        options: [
          { id: "a", label: "wird von Wirtschaftsverbänden wegen möglicher Leistungseinbußen kritisch gesehen." },
          { id: "b", label: "führt nach Ansicht der Gewerkschaften zu schlechteren Arbeitsbedingungen." },
          { id: "c", label: "ist in den meisten deutschen Unternehmen bereits gesetzlich vorgeschrieben." },
        ],
        answer: "a",
      },
      {
        number: 17,
        question: "Welche Erkenntnis brachten internationale Pilotprojekte hervor?",
        options: [
          { id: "a", label: "Die Fehlzeiten der Mitarbeiter wegen Krankheit nahmen deutlich zu." },
          { id: "b", label: "Trotz verkürzter Arbeitszeit blieb die Arbeitsleistung stabil oder stieg an." },
          { id: "c", label: "Die teilnehmenden Betriebe erlitten erhebliche finanzielle Verluste." },
        ],
        answer: "b",
      },
      {
        number: 18,
        question: "Warum ist das Modell in Bereichen wie der Pflege oder dem Handwerk schwer umsetzbar?",
        options: [
          { id: "a", label: "Weil die Angestellten dort keine verkürzten Arbeitszeiten wünschen." },
          { id: "b", label: "Weil diese Branchen eine ständige Präsenz erfordern und Personal fehlt." },
          { id: "c", label: "Weil die Kundschaft am Wochenende keine Dienstleistungen nutzt." },
        ],
        answer: "b",
      },
      {
        number: 19,
        question: "Welche Gefahr sehen Kritiker in Bezug auf die „Arbeitsverdichtung“?",
        options: [
          { id: "a", label: "Dass die Mitarbeiter mehr Pausen machen und weniger arbeiten." },
          { id: "b", label: "Dass der tägliche Druck steigt und soziale Kontakte im Betrieb abnehmen." },
          { id: "c", label: "Dass die Gehälter Schritt für Schritt gesenkt werden müssen." },
        ],
        answer: "b",
      },
      {
        number: 20,
        question: "Für jüngere Arbeitssuchende ist die Flexibilität der Arbeitszeit …",
        options: [
          { id: "a", label: "ein wichtiges Entscheidungskriterium bei der Bewerbung." },
          { id: "b", label: "heutzutage von eher geringer Bedeutung." },
          { id: "c", label: "nur dann attraktiv, wenn sie ausschließlich von zu Hause aus arbeiten." },
        ],
        answer: "a",
      },
      {
        number: 21,
        question: "Welches Fazit ziehen Fachleute bezüglich der Zukunft dieses Arbeitsmodells?",
        options: [
          { id: "a", label: "Es sollte ein einheitliches Gesetz für alle Unternehmen geben." },
          { id: "b", label: "Die Vier-Tage-Woche sollte bundesweit verboten werden." },
          { id: "c", label: "Es braucht maßgeschneiderte Lösungen für die jeweiligen Branchen." },
        ],
        answer: "c",
      },
    ],
  },
});

export const B2_FINAL_MOCK_STORAGE_KEY = "falowen:b2-final-mock:b2-mock-01";
