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
  teil4: {
    title: "Teil 4",
    time: "12 Minuten",
    intro:
      "Lesen Sie die 8 Stellungnahmen (A–H) zum Thema „Künstliche Intelligenz (KI) in der Arbeitswelt“. Welche Stellungnahme passt zu welcher Aussage (22–27)? Zwei Stellungnahmen passen nicht. Markieren Sie Ihre Antworten.",
    topic: "Künstliche Intelligenz (KI) in der Arbeitswelt",
    statements: [
      {
        id: "A",
        person: "Sandra",
        role: "Marketingmanagerin",
        text:
          "Ich nutze KI-Tools täglich für das Verfassen erster Textentwürfe und die Bildgenerierung. Das spart mir extrem viel Zeit bei einfachen Routineaufgaben, sodass ich mich voll auf strategische Entscheidungen und kreative Konzeptentwicklung konzentrieren kann. KI ersetzt uns nicht, sondern ergänzt unsere menschlichen Fähigkeiten hervorragend.",
      },
      {
        id: "B",
        person: "Markus",
        role: "Buchhalter",
        text:
          "In unserer Abteilung wurden vor kurzem automatisierte Programme eingeführt. Seitdem herrscht bei vielen Kolleginnen und Kollegen große Unsicherheit. Zwar wird behauptet, dass niemand entlassen werden soll, aber freigewordene Stellen werden einfach nicht mehr nachbesetzt. Ich befürchte, dass dadurch auf lange Sicht viele Arbeitsplätze schleichend verloren gehen.",
      },
      {
        id: "C",
        person: "Elena",
        role: "IT-Sicherheitsexpertin",
        text:
          "Das größte Problem beim Einsatz von KI in Unternehmen ist der Schutz vertraulicher Daten. Wenn sensible Firmeninterna oder Kundendaten in globale Algorithmen eingespeist werden, ist das ein unkalkulierbares Risiko. Bevor der Gesetzgeber hier keine strengen rechtlichen Leitlinien schafft, sollten Firmen äußerst zurückhaltend agieren.",
      },
      {
        id: "D",
        person: "Florian",
        role: "Wirtschaftsberater",
        text:
          "Wir dürfen den Anschluss an den Weltmarkt nicht verlieren. Länder wie die USA und China investieren Milliarden in KI-Technologien. Wenn europäische Unternehmen aus Sorge vor Risiken zögern und den Wandel ausbremsen, werden wir wirtschaftlich den Kürzeren ziehen. Innovation erfordert Mut zur Veränderung.",
      },
      {
        id: "E",
        person: "Thomas",
        role: "Logistikleiter",
        text:
          "Durch den Einsatz intelligenter Systeme in unserem Lager konnten wir die Fehlerquote beim Verpacken von Waren nahezu auf Null senken. Das führt zu einer enormen Kosteneinsparung und zufriedeneren Kunden. Für reine Kontrollarbeiten sind Maschinen dem Menschen schlichtweg überlegen.",
      },
      {
        id: "F",
        person: "Sabine",
        role: "Berufsschullehrerin",
        text:
          "Ich stelle fest, dass junge Menschen durch die ständige Nutzung von KI-Tools kaum noch lernen, komplexe Aufgaben eigenständig zu durchdenken. Wenn man sich bei jeder Problemstellung sofort auf Algorithmen verlässt, verkümmern das kritische Denken und die analytischen Fähigkeiten. Das halte ich für eine sehr bedenkliche Entwicklung.",
      },
      {
        id: "G",
        person: "Dr. Aris",
        role: "Mediziner",
        text:
          "Mich stört an der aktuellen Debatte, dass meistens nur über Risiken gesprochen wird. Dabei bietet KI gerade im Gesundheitswesen riesige Chancen, etwa bei der Früherkennung von Tumorerkrankungen durch präzise Bildanalyse. Hier kann moderne Technologie das Leben von Tausenden Menschen retten.",
      },
      {
        id: "H",
        person: "Jörg",
        role: "Soziologe",
        text:
          "Ein unkontrollierter Einsatz von KI wird die soziale Ungleichheit in unserer Gesellschaft weiter verschärfen. Während hochqualifizierte Fachkräfte profitieren und noch produktiver werden, drohen Geringqualifizierte abgetrennt zu werden. Die Politik muss dringend Steuerungsinstrumente entwickeln, um diesen sozialen Graben zu verhindern.",
      },
    ],
    questions: [
      {
        number: 22,
        statement:
          "befürchtet einen schleichenden Abbau von Stellen durch die Nichtbesetzung freier Arbeitsplätze.",
        answer: "B",
      },
      {
        number: 23,
        statement:
          "sieht in der Nutzung von KI im medizinischen Bereich ein großes Potenzial zur Lebensrettung.",
        answer: "G",
      },
      {
        number: 24,
        statement:
          "warnt vor einer Verschlechterung der eigenständigen Denk- und Problemlösefähigkeiten bei Lernenden.",
        answer: "F",
      },
      {
        number: 25,
        statement:
          "betont die Notwendigkeit von schnellen Innovationen, um international wettbewerbsfähig zu bleiben.",
        answer: "D",
      },
      {
        number: 26,
        statement:
          "sieht durch KI-Tools eine Entlastung von Routinearbeiten und mehr Raum für Kreativität.",
        answer: "A",
      },
      {
        number: 27,
        statement:
          "hält strengere rechtliche Vorgaben zum Schutz vertraulicher Informationen für erforderlich.",
        answer: "C",
      },
    ],
  },
});

export const B2_LISTENING = Object.freeze({
  teil1: {
    id: "teil-1",
    title: "Hören · Teil 1",
    audioObjectKey: "b2/mock-hoeren-1/teil-1.mp3",
    audioNote:
      "Einleitung, Beispiel, Lesepause und Text 1 bis Text 5 sind bereits in dieser einen Datei enthalten.",
    intro:
      "Die Audiodatei enthält die Einleitung, den Beispieltext, die Lesepause für 01 und 02 sowie die fünf Texte zu den Aufgaben 1 bis 10.",
    example: [
      {
        number: "01",
        question: "Der Flug am 14. Juni wurde …",
        options: [
          { id: "a", label: "verspätet." },
          { id: "b", label: "gestrichen." },
          { id: "c", label: "umgebucht, ohne die Kundin zu informieren." },
        ],
        answer: "b",
      },
      {
        number: "02",
        question: "Was soll Herr Vogel tun?",
        options: [
          { id: "a", label: "Die Zusatzkosten bezahlen." },
          { id: "b", label: "Bis Freitag zurückrufen." },
          { id: "c", label: "Das Hotel anrufen." },
        ],
        answer: "b",
      },
    ],
    texts: [
      {
        title: "Text 1 · Fahrradkurier",
        questions: [
          {
            number: 1,
            question: "Was gefällt dem Sprecher an seiner Arbeit am meisten?",
            options: [
              { id: "a", label: "Das hohe Gehalt." },
              { id: "b", label: "Dass er draußen arbeitet." },
              { id: "c", label: "Dass er keine Route planen muss." },
            ],
            answer: "b",
          },
          {
            number: 2,
            question: "Was plant er für die Zukunft?",
            options: [
              { id: "a", label: "Er will den Job wechseln." },
              { id: "b", label: "Er will in ein Büro zurück." },
              { id: "c", label: "Er will mit Kollegen eine Firma gründen." },
            ],
            answer: "c",
          },
        ],
      },
      {
        title: "Text 2 · Radio: Pfandbecher",
        questions: [
          {
            number: 3,
            question: "Wie ist die Bilanz in Freiburg?",
            options: [
              { id: "a", label: "Niemand nutzt die Pfandbecher." },
              { id: "b", label: "Etwa ein Drittel der Kunden nutzt sie, mehr als erwartet." },
              { id: "c", label: "Alle Cafés machen mit." },
            ],
            answer: "b",
          },
          {
            number: 4,
            question: "Was diskutiert der Stadtrat?",
            options: [
              { id: "a", label: "Finanzielle Hilfe für kleine Betriebe." },
              { id: "b", label: "Eine sofortige Pflicht zum Mehrwegbecher." },
              { id: "c", label: "Ein Verbot von Cafés." },
            ],
            answer: "a",
          },
        ],
      },
      {
        title: "Text 3 · Bibliothek: Ansage",
        questions: [
          {
            number: 5,
            question: "Was gilt für Medien, deren Leihfrist in der Schließzeit endet?",
            options: [
              { id: "a", label: "Man muss sie sofort abgeben." },
              { id: "b", label: "Es entstehen keine Gebühren." },
              { id: "c", label: "Man muss sie verlängern." },
            ],
            answer: "b",
          },
          {
            number: 6,
            question: "Was ist in der Zweigstelle anders?",
            options: [
              { id: "a", label: "Samstags ist bis 16 Uhr geöffnet." },
              { id: "b", label: "Sie schließt ebenfalls." },
              { id: "c", label: "Das Lesecafé öffnet dort neu." },
            ],
            answer: "a",
          },
        ],
      },
      {
        title: "Text 4 · Professorin: Lernen",
        questions: [
          {
            number: 7,
            question: "Woran liegt das Problem laut der Professorin meist?",
            options: [
              { id: "a", label: "An zu vielen Aufgaben." },
              { id: "b", label: "An der Organisation des Lernens." },
              { id: "c", label: "An zu wenig Büchern." },
            ],
            answer: "b",
          },
          {
            number: 8,
            question: "Was bietet die Universität an?",
            options: [
              { id: "a", label: "Online-Prüfungen." },
              { id: "b", label: "Mehr Aufgaben." },
              { id: "c", label: "Abendkurse." },
            ],
            answer: "c",
          },
        ],
      },
      {
        title: "Text 5 · Berufswechsel: Tischlerin",
        questions: [
          {
            number: 9,
            question: "Warum hat die Sprecherin ihren Job gekündigt?",
            options: [
              { id: "a", label: "Sie hat zu wenig verdient." },
              { id: "b", label: "Die Schreibtischarbeit machte sie nicht mehr glücklich." },
              { id: "c", label: "Ihr Chef war unfreundlich." },
            ],
            answer: "b",
          },
          {
            number: 10,
            question: "Wie reagiert die Familie?",
            options: [
              { id: "a", label: "Alle sind dagegen." },
              { id: "b", label: "Die meisten unterstützen sie, nur der Vater ist skeptisch." },
              { id: "c", label: "Niemand weiß davon." },
            ],
            answer: "b",
          },
        ],
      },
    ],
  },
  teil2: {
    id: "teil-2",
    title: "Hören · Teil 2",
    audioObjectKey: "b2/mock-hoeren-1/teil-2.mp3",
    audioNote:
      "Die vollständige Audiodatei für Teil 2 wird hier als eine zusammenhängende Prüfungsaudio abgespielt.",
    intro:
      "Hören Sie das Interview und bearbeiten Sie die Aufgaben 11 bis 16. Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.",
    questions: [
      {
        number: 11,
        question: "Warum wurde der Professor Meeresbiologe?",
        options: [
          { id: "a", label: "Sein Lehrer hat es empfohlen." },
          { id: "b", label: "Ein Urlaub in Ägypten hat ihn dazu gebracht." },
          { id: "c", label: "Seine Eltern sind Biologen." },
        ],
        answer: "b",
      },
      {
        number: 12,
        question: "Was ist laut dem Professor die Hauptursache für das Korallensterben?",
        options: [
          { id: "a", label: "Die Verschmutzung der Meere." },
          { id: "b", label: "Zu viel Fischerei." },
          { id: "c", label: "Die steigende Wassertemperatur." },
        ],
        answer: "c",
      },
      {
        number: 13,
        question: "Wie lange dauert die Erholung eines Riffs nach einer Bleiche oft?",
        options: [
          { id: "a", label: "Ein paar Wochen." },
          { id: "b", label: "Etwa ein Jahr." },
          { id: "c", label: "Zehn Jahre oder länger." },
        ],
        answer: "c",
      },
      {
        number: 14,
        question: "Wie arbeiten die Freiwilligen?",
        options: [
          { id: "a", label: "Sie zählen Fische und fotografieren Korallen." },
          { id: "b", label: "Sie bekommen ein festes Gehalt." },
          { id: "c", label: "Sie arbeiten nur im Labor." },
        ],
        answer: "a",
      },
      {
        number: 15,
        question: "Wie sieht der Professor die Zukunft der Riffe?",
        options: [
          { id: "a", label: "Sehr pessimistisch." },
          { id: "b", label: "Vorsichtig optimistisch, aber die Politik muss schneller handeln." },
          { id: "c", label: "Völlig sorglos." },
        ],
        answer: "b",
      },
      {
        number: 16,
        question: "Was empfiehlt er jedem Einzelnen?",
        options: [
          { id: "a", label: "Weniger Flugreisen und weniger Fleisch." },
          { id: "b", label: "Keine Sonnencreme zu benutzen." },
          { id: "c", label: "Mehr Fische zu essen." },
        ],
        answer: "a",
      },
    ],
  },
  teil3: {
    id: "teil-3",
    title: "Hören · Teil 3",
    audioObjectKey: "b2/mock-hoeren-1/teil-3.mp3",
    audioNote:
      "Die vollständige Audiodatei für Teil 3 wird hier als eine zusammenhängende Prüfungsaudio abgespielt.",
    intro:
      "Wer sagt das? Ordnen Sie die Aussagen 17 bis 22 Frau Lenz, Herrn Albers oder Herrn Demir zu.",
    speakers: [
      { id: "a", label: "Frau Lenz" },
      { id: "b", label: "Herr Albers" },
      { id: "c", label: "Herr Demir" },
    ],
    example: {
      statement: "Wir teilen uns Werkzeug, Garten und ein Auto.",
      answer: "a",
    },
    questions: [
      {
        number: 17,
        statement: "Ich habe weniger Besitz und fühle mich dadurch freier.",
        answer: "b",
      },
      {
        number: 18,
        statement: "Die Miete ist bei uns niedriger als auf dem normalen Markt.",
        answer: "c",
      },
      {
        number: 19,
        statement: "Es gab am Anfang Streit wegen unterschiedlicher Ruhezeiten.",
        answer: "a",
      },
      {
        number: 20,
        statement: "Ein Stellplatz war schwer zu finden.",
        answer: "b",
      },
      {
        number: 21,
        statement: "Man muss regelmäßig an langen Versammlungen teilnehmen.",
        answer: "c",
      },
      {
        number: 22,
        statement: "Ältere Menschen sind bei uns nicht mehr einsam.",
        answer: "a",
      },
    ],
  },
  teil4: {
    id: "teil-4",
    title: "Hören · Teil 4",
    audioObjectKey: "b2/mock-hoeren-1/teil-4.mp3",
    audioNote:
      "Die vollständige Audiodatei für Teil 4 wird hier als eine zusammenhängende Prüfungsaudio abgespielt.",
    intro:
      "Hören Sie den Vortrag und bearbeiten Sie die Aufgaben 23 bis 30. Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.",
    questions: [
      {
        number: 23,
        question: "Was ist laut dem Redner entscheidend für gute Leistung?",
        options: [
          { id: "a", label: "Möglichst lange zu arbeiten." },
          { id: "b", label: "Die Zeit gut einzuteilen." },
          { id: "c", label: "Mehr Pausen als Arbeit." },
        ],
        answer: "b",
      },
      {
        number: 24,
        question: "Wann sollte man die wichtigsten Aufgaben erledigen?",
        options: [
          { id: "a", label: "Am Vormittag." },
          { id: "b", label: "Am späten Abend." },
          { id: "c", label: "Direkt nach dem Mittagessen." },
        ],
        answer: "a",
      },
      {
        number: 25,
        question: "Wie oft sollte man seine E-Mails ansehen?",
        options: [
          { id: "a", label: "Alle paar Minuten." },
          { id: "b", label: "Nur einmal pro Woche." },
          { id: "c", label: "Dreimal am Tag." },
        ],
        answer: "c",
      },
      {
        number: 26,
        question: "Wie sollte man die Pausen verbringen?",
        options: [
          { id: "a", label: "Am Handy." },
          { id: "b", label: "Mit etwas Bewegung." },
          { id: "c", label: "Im Gespräch mit Kollegen." },
        ],
        answer: "b",
      },
      {
        number: 27,
        question: "Was sagt der Redner über Multitasking?",
        options: [
          { id: "a", label: "Es ist besonders effektiv." },
          { id: "b", label: "Man macht dabei mehr Fehler." },
          { id: "c", label: "Es spart Zeit bei Besprechungen." },
        ],
        answer: "b",
      },
      {
        number: 28,
        question: "Warum ist ein aufgeräumter Schreibtisch hilfreich?",
        options: [
          { id: "a", label: "Er sieht besser aus." },
          { id: "b", label: "Er ist wichtig für Kunden." },
          { id: "c", label: "Man verliert weniger Zeit mit Suchen." },
        ],
        answer: "c",
      },
      {
        number: 29,
        question: "Was empfiehlt er am Ende des Arbeitstages?",
        options: [
          { id: "a", label: "Zehn Minuten für den nächsten Tag zu planen." },
          { id: "b", label: "Alle E-Mails zu beantworten." },
          { id: "c", label: "Den Schreibtisch zu putzen." },
        ],
        answer: "a",
      },
      {
        number: 30,
        question: "Wie sollen Besprechungen sein?",
        options: [
          { id: "a", label: "Möglichst mit allen Kollegen." },
          { id: "b", label: "Ohne feste Dauer." },
          { id: "c", label: "Mit nötigen Personen und höchstens dreißig Minuten." },
        ],
        answer: "c",
      },
    ],
  },
});

export const B2_WRITING_TASKS = Object.freeze([
  {
    id: "teil1",
    title: "Teil 1 · Forumsbeitrag",
    meta: "Empfohlene Arbeitszeit: 50 Minuten · ca. 150 Wörter",
    topic: "Homeoffice – Arbeiten von zu Hause aus",
    prompt:
      "Sie schreiben einen Beitrag für ein Online-Forum zum Thema „Homeoffice – Arbeiten von zu Hause aus“.",
    points: [
      "Äußern Sie Ihre Meinung zum Thema Arbeiten im Homeoffice.",
      "Nennen Sie Gründe, warum dieses Arbeitsmodell heutzutage immer beliebter wird.",
      "Nennen Sie Möglichkeiten, wie Unternehmen ihre Mitarbeiter im Homeoffice gut unterstützen können.",
      "Nennen Sie Vor- und Nachteile der Arbeit im Büro als Alternative zum Homeoffice.",
    ],
    guidance:
      "Denken Sie an eine getrennte Einleitung und einen passenden Schlusssatz. Verbinden Sie die Punkte zu einem zusammenhängenden Text.",
    target: 150,
  },
  {
    id: "teil2",
    title: "Teil 2 · Formelle Nachricht",
    meta: "Empfohlene Arbeitszeit: 25 Minuten · ca. 100 Wörter",
    topic: "Projektseminar und Dienstreise",
    prompt:
      "Sie nehmen zurzeit an einer beruflichen Weiterbildung teil. Nächste Woche soll ein wichtiges Projektseminar stattfinden, an dem Sie wegen einer unaufschiebbaren Dienstreise nicht teilnehmen können. Schreiben Sie eine formelle Nachricht an die Seminarleiterin, Frau Dr. Weber.",
    points: [
      "Schreiben Sie den Grund für Ihre Nachricht und entschuldigen Sie Ihr Fehlen.",
      "Erklären Sie, warum die Dienstreise dringend erforderlich ist.",
      "Machen Sie einen Vorschlag, wie Sie den verpassten Seminarstoff nachholen können.",
      "Bitten Sie um Zusendung der Unterlagen oder Präsentationen.",
    ],
    guidance:
      "Achten Sie auf eine passende formelle Anrede, einen klaren Aufbau und einen angemessenen Schluss.",
    target: 100,
  },
]);

export const B2_SPEAKING = Object.freeze({
  teil1: {
    id: "teil1",
    title: "Teil 1 · Präsentation",
    prepSeconds: 15 * 60,
    maxRecordingSeconds: 4 * 60,
    instruction:
      "Wählen Sie eines der beiden Themen. Strukturieren Sie Ihre Präsentation klar und sprechen Sie zusammenhängend. Nennen Sie Beispiele, begründen Sie Ihre Position und schließen Sie mit einem kurzen Fazit.",
    themes: [
      {
        id: "thema1",
        title: "Konsumverhalten – Kaufen wir zu viele unnötige Dinge?",
        prompt:
          "Sprechen Sie über das Kaufverhalten in der heutigen Gesellschaft und Möglichkeiten, bewusster einzukaufen.",
      },
      {
        id: "thema2",
        title: "Weiterbildung im Beruf – Pflicht oder Eigenverantwortung?",
        prompt:
          "Sprechen Sie über Möglichkeiten und die Bedeutung von lebenslangem Lernen und beruflicher Fortbildung.",
      },
    ],
  },
  teil2: {
    id: "teil2",
    title: "Teil 2 · Diskutieren / Standpunkte austauschen",
    maxRecordingSeconds: 5 * 60,
    topic:
      "Soll der öffentliche Personennahverkehr (ÖPNV) für alle Bürger komplett kostenlos sein?",
    points: [
      "Tauschen Sie Ihre Argumente aus: Nennen Sie Vor- und Nachteile eines kostenlosen Bus- und Bahnverkehrs, zum Beispiel Umwelt, Finanzierung, Qualität und Verkehrsbelastung.",
      "Gehen Sie auf Gegenargumente ein: Stimmen Sie einer anderen Position zu oder widersprechen Sie höflich und begründen Sie Ihre Reaktion.",
      "Erreichen Sie ein Fazit: Versuchen Sie am Ende, eine gemeinsame Position oder eine klare Zusammenfassung zu formulieren.",
    ],
    simulationNote:
      "Da in diesem Mock kein Partner-Audio vorgegeben ist, simulieren Sie beide Seiten der Diskussion: Nennen Sie mindestens ein Gegenargument ausdrücklich und reagieren Sie darauf.",
  },
});

export const B2_FINAL_MOCK_STORAGE_KEY = "falowen:b2-final-mock:b2-mock-01";
