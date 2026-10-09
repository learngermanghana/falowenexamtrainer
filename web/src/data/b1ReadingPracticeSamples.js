// Three original B1 Goethe-style Lesen practice sets inspired by the five-part
// format of the B1 mock. The final mock question bank is never mutated.
const trueFalse = (start, rows) => rows.map(([question, answer], index) => ({
  number: start + index, question, answer,
}));
const multipleChoice = (start, rows) => rows.map(([question, a, b, c, answer], index) => ({
  number: start + index, question,
  options: [{ id: "a", label: a }, { id: "b", label: b }, { id: "c", label: c }],
  answer,
}));
const matching = (rows) => rows.map(([text, answer], index) => ({
  number: 13 + index, text, answer,
}));
const comments = (rows) => rows.map(([person, text, answer], index) => ({
  number: 20 + index, person, text, answer,
}));
const readingSet = ({ id, label, blog, press, courses, debate, rules }) => ({
  id, label,
  teil1: {
    title: "Teil 1", time: "10 Minuten",
    intro: "Lesen Sie den Blogeintrag und die Aufgaben 1 bis 6. Richtig oder Falsch?",
    ...blog, questions: trueFalse(1, blog.questions),
  },
  teil2: {
    title: "Teil 2", time: "20 Minuten",
    heading: press.first.heading, paragraphs: press.first.paragraphs,
    questions: multipleChoice(7, press.first.questions),
    text2: {
      title: "Teil 2 · Text 2",
      intro: "Lesen Sie den zweiten Presseartikel. Wählen Sie für die Aufgaben 10 bis 12 a, b oder c.",
      heading: press.second.heading, paragraphs: press.second.paragraphs,
      questions: multipleChoice(10, press.second.questions),
    },
  },
  teil3: {
    title: "Teil 3", time: "10 Minuten",
    context: courses.context, ads: courses.ads,
    situations: matching(courses.situations),
  },
  teil4: {
    title: "Teil 4", time: "15 Minuten", context: debate.context,
    comments: comments(debate.comments),
  },
  teil5: {
    title: "Teil 5", time: "10 Minuten", context: rules.context,
    heading: rules.heading, sections: rules.sections,
    questions: multipleChoice(27, rules.questions),
  },
});

export const B1_READING_PRACTICE_SAMPLES = Object.freeze([
  readingSet({
    id: "b1-reading-sample-01", label: "Lesen Sample 1",
    blog: {
      heading: "MariesTagebuch.de", subheading: "Geschichten aus dem Alltag",
      date: "Montag, 12. Mai",
      paragraphs: [
        "Heute hätte ich beinahe mein Portemonnaie verloren. Nach der Arbeit war ich auf dem Wochenmarkt einkaufen. Zu Hause wollte ich die Rechnung bezahlen, doch mein Geldbeutel war nicht mehr in der Handtasche. Ich suchte lange in der Küche und im Flur, ohne Erfolg.",
        "Eine Stunde später rief eine Mitarbeiterin meiner Bank an. Ein junger Mann hatte das Portemonnaie bei der Bushaltestelle neben dem Markt entdeckt. Weil meine Bankkarte darin lag, brachte er es zur nächsten Filiale. Dort konnte man mich über meine Kundendaten erreichen.",
        "Ich fuhr sofort zur Bank. Zum Glück waren das Bargeld und alle Karten noch da. Den Namen des Finders durfte die Mitarbeiterin mir nicht nennen. Deshalb schreibe ich diese Geschichte: Vielleicht erreicht ihn auf diesem Weg mein Dank.",
      ],
      questions: [
        ["Marie bemerkte schon auf dem Wochenmarkt, dass ihr Geldbeutel fehlte.", "falsch"],
        ["Marie suchte zuerst zu Hause nach ihrem Portemonnaie.", "richtig"],
        ["Der Finder entdeckte den Geldbeutel an einer Haltestelle.", "richtig"],
        ["Ein Mitarbeiter vom Markt rief Marie persönlich an.", "falsch"],
        ["Bei der Rückgabe fehlten mehrere Bankkarten.", "falsch"],
        ["Marie hoffte, dem Finder über ihren Blog danken zu können.", "richtig"],
      ],
    },
    press: {
      first: {
        heading: "Ferien auf dem Land statt am Meer",
        paragraphs: [
          "Viele Eltern planen heute einen Urlaub auf einem Bauernhof. Ihre Kinder können dort Tiere beobachten und sehen, wie Gemüse angebaut wird. Besonders Familien aus Großstädten gefällt diese Abwechslung zum Alltag.",
          "Der Landwirt Paul Richter vermietet seit sechs Jahren Gästezimmer. Er erzählt, dass die Kinder gern beim Füttern helfen. Für die Bauern ist der Besuch außerdem eine zusätzliche Einnahmequelle, weil der Verkauf landwirtschaftlicher Produkte nicht immer genug Geld bringt.",
          "Ein Bauernhof bietet selten einen Swimmingpool oder Hotelservice. Dafür sind die Wege zur Natur kurz und eine Übernachtung ist oft preiswerter als ein Flugurlaub.",
        ],
        questions: [
          ["Warum entscheiden sich Eltern für einen Bauernhof?", "Sie möchten nur am Strand liegen.", "Die Kinder können Natur und Tiere erleben.", "Sie suchen ein Luxushotel.", "b"],
          ["Warum vermietet Paul Richter Zimmer?", "Die Gäste übernehmen seine ganze Arbeit.", "Er hat alle Tiere verkauft.", "Er verdient zusätzliches Geld.", "c"],
          ["Was sollten die Gäste erwarten?", "Einfachen Urlaub in der Natur.", "Ein großes Hotel mit vielen Angeboten.", "Einen Flughafen direkt neben dem Hof.", "a"],
        ],
      },
      second: {
        heading: "Junge Menschen helfen freiwillig",
        paragraphs: [
          "Ob bei der Feuerwehr, in einem Verein oder in der Nachhilfe: Viele Jugendliche engagieren sich nach der Schule. Sie erhalten dafür normalerweise keinen Lohn, möchten aber in ihrer Stadt etwas bewegen.",
          "Das freiwillige Engagement bringt auch Vorteile für die Helfenden. Sie lernen, Verantwortung zu übernehmen, zusammenzuarbeiten und schwierige Situationen zu lösen. Manche Vereine stellen eine Bescheinigung für spätere Bewerbungen aus.",
          "Die größte Schwierigkeit ist oft die Zeit. Vor allem während der Prüfungen müssen Jugendliche ihre ehrenamtlichen Termine reduzieren oder verschieben.",
        ],
        questions: [
          ["Freiwillige Helferinnen und Helfer …", "bekommen immer ein Gehalt.", "arbeiten ohne regelmäßige Bezahlung.", "dürfen nicht mehr zur Schule gehen.", "b"],
          ["Welche Erfahrung ist für spätere Bewerbungen nützlich?", "Die Teilnahme an einem freiwilligen Projekt.", "Nur das Ansehen von Videos.", "Ein bezahlter Urlaub.", "a"],
          ["Warum unterbrechen einige Jugendliche ihre Arbeit im Verein?", "Die Schule nimmt zeitweise viel Zeit in Anspruch.", "Alle Vereine schließen im Sommer.", "Ihre Eltern verlangen dafür Geld.", "a"],
        ],
      },
    },
    courses: {
      context: "Sie lesen Angebote zum Deutschlernen. Welche Anzeige passt zu den Situationen 13 bis 19? Eine Situation hat keine passende Anzeige (0). Anzeige C ist das Beispiel.",
      situations: [
        ["Rashid möchte samstags kostenlos mit anderen Deutsch sprechen.","f"],
        ["Ben möchte im Juli einen ganztägigen Deutschkurs mit Kulturprogramm besuchen.","h"],
        ["Nora sucht einen Deutschkurs für sich und ihr dreijähriges Kind zusammen.","0"],
        ["Igor sucht persönliche Einzelstunden für die Prüfung B2.","d"],
        ["Mila braucht Deutsch speziell für die Arbeit in einer Arztpraxis.","i"],
        ["Daniel möchte geschäftliche E-Mails an einem Wochenende trainieren.","j"],
        ["Klara kann dienstags und donnerstags nur abends Grammatik üben.","a"],
      ],
      ads: [
        ["A","Grammatik am Abend","Dienstag und Donnerstag 18 bis 20 Uhr: Übungen und Rechtschreibung."],
        ["B","Sprachpartner gesucht","Austausch für Studierende an der Universität."],
        ["C","Deutsch per App","Üben Sie von zu Hause, wann immer Sie möchten. Beispielanzeige."],
        ["D","Privater B2-Unterricht","Individuelle Prüfungsvorbereitung bei einer erfahrenen Lehrerin."],
        ["E","Kochen und Deutsch","Freitagabend gemeinsam kochen und sprechen."],
        ["F","Sprachtreff im Park","Jeden Samstag um 15 Uhr sprechen wir kostenlos Deutsch. Keine Anmeldung."],
        ["G","Sprachferien für Kinder","Sommercamp für Schülerinnen und Schüler von 8 bis 16 Jahren."],
        ["H","Sommerdeutsch und Kultur","Im Juli vier Wochen Intensivkurs mit Stadtführungen und Ausflügen."],
        ["I","Deutsch in der Praxis","Wortschatz und Gespräche für medizinische Fachkräfte."],
        ["J","Deutsch im Büro","Samstag und Sonntag: E-Mails und Telefongespräche im Beruf."],
      ],
    },
    debate: {
      context: "Eine Online-Zeitung fragt: Sollten Smartphones im Unterricht grundsätzlich verboten werden? Lesen Sie die Meinungen und wählen Sie Ja (für ein Verbot) oder Nein (gegen ein allgemeines Verbot).",
      comments: [
        ["Lena (22)", "Handys können beim Lernen nützlich sein, zum Beispiel für Wörterbücher. Ein generelles Verbot wäre falsch.", "nein"],
        ["Herr Özdemir (48)", "Ständige Nachrichten lenken meine Klasse ab. Während der Schulstunden sollten alle Smartphones ausgeschaltet und weggelegt werden.", "ja"],
        ["Nina (37)", "Die Schule soll zeigen, wie man digitale Medien sinnvoll nutzt. Ein vollständiges Verbot löst keine Probleme.", "nein"],
        ["Bernd (60)", "Kinder brauchen eine Pause vom Bildschirm. Deshalb sollten Mobiltelefone im Unterricht nicht erlaubt sein.", "ja"],
        ["Paula (29)", "Manchmal brauchen Lernende ihr Handy für Aufgaben. Lehrkräfte können klare Regeln festlegen, ohne alles zu verbieten.", "nein"],
        ["Erik (43)", "Ohne Smartphones konzentrieren sich alle besser. Ich bin für feste Regeln mit einem vollständigen Verbot während des Unterrichts.", "ja"],
        ["Sabine (51)", "Wichtiger als Verbote ist, dass Schülerinnen und Schüler den verantwortlichen Umgang lernen.", "nein"],
      ],
    },
    rules: {
      context: "Sie besuchen ein Weiterbildungszentrum und lesen die Hausordnung.",
      heading: "Hausordnung Bildungszentrum Nord",
      sections: [
        ["Öffnungszeiten", "Montag bis Freitag ist das Haus von 8 bis 20 Uhr geöffnet, Samstag bis 13 Uhr. Besucher melden sich am Empfang."],
        ["Unterrichtsräume", "Essen ist nicht gestattet. Wasser in verschließbaren Flaschen darf mitgebracht werden. Telefone müssen lautlos sein."],
        ["Pausen und Rauchen", "Die Cafeteria befindet sich im zweiten Stock. Rauchen ist nur im gekennzeichneten Hofbereich erlaubt."],
        ["Fundstücke und Geräte", "Verlorene Dinge werden im Sekretariat, Zimmer 014, gesammelt. Schäden an Computern melden Sie sofort der Kursleitung."],
      ],
      questions: [
        ["Was ist im Unterricht erlaubt?", "Im Raum zu frühstücken.", "Wasser aus einer verschlossenen Flasche zu trinken.", "Mit dem Telefon laut zu sprechen.", "b"],
        ["Wo darf geraucht werden?", "Im markierten Teil des Hofes.", "Direkt vor jeder Tür.", "In der Cafeteria.", "a"],
        ["Wo finden Sie verlorene Gegenstände?", "In Zimmer 014 im Sekretariat.", "In der Bibliothek.", "Im Klassenraum der letzten Woche.", "a"],
        ["Sie bemerken einen defekten Computer. Was tun Sie?", "Sie reparieren ihn selbst.", "Sie ignorieren den Schaden.", "Sie informieren die Kursleitung sofort.", "c"],
      ],
    },
  }),
  readingSet({
    id: "b1-reading-sample-02", label: "Lesen Sample 2",
    blog: {
      heading: "TomsStadtgeschichten.de", subheading: "Unterwegs in meiner Stadt",
      date: "Freitag, 4. September",
      paragraphs: [
        "Gestern bin ich mit der Straßenbahn zum Sprachkurs gefahren. Nach dem Aussteigen merkte ich, dass mein Rucksack noch auf dem Sitz lag. Darin waren meine Bücher, meine Hausschlüssel und ein Geschenk für meine Schwester. Ich lief zurück, aber die Bahn war schon weg.",
        "Am Informationsschalter erklärte ich einer Mitarbeiterin, was passiert war. Sie notierte die Liniennummer und meine Telefonnummer. Am Abend bekam ich einen Anruf: Ein Fahrgast hatte den Rucksack beim Fahrer abgegeben, und das Verkehrsunternehmen bewahrte ihn nun im Fundbüro auf.",
        "Heute Morgen holte ich meine Sachen ab. Das Geschenk war unbeschädigt und auch die Schlüssel waren noch da. Leider kannte niemand den Namen des freundlichen Fahrgastes. Beim nächsten Mal werde ich vor dem Aussteigen genauer unter den Sitz schauen.",
      ],
      questions: [
        ["Tom ließ seinen Rucksack in einem öffentlichen Verkehrsmittel liegen.", "richtig"],
        ["Tom bemerkte den Verlust erst nach dem Aussteigen.", "richtig"],
        ["Die Mitarbeiterin weigerte sich, Toms Telefonnummer aufzuschreiben.", "falsch"],
        ["Der Rucksack wurde vom Verkehrsunternehmen im Fundbüro aufbewahrt.", "richtig"],
        ["Aus dem zurückgegebenen Rucksack fehlten das Geschenk und die Schlüssel.", "falsch"],
        ["Tom erfuhr den Namen des Fahrgastes.", "falsch"],
      ],
    },
    press: {
      first: {
        heading: "Ein Gemeinschaftsgarten mitten in der Stadt",
        paragraphs: [
          "Auf einem früher ungenutzten Parkplatz in Leipzig bauen Nachbarinnen und Nachbarn heute Gemüse an. Jede Familie kümmert sich um ein kleines Beet, und gemeinsam werden Wege und Werkzeuge gepflegt.",
          "Das Projekt wurde von einer Gruppe Studierender begonnen. Mittlerweile kommen auch ältere Menschen und Familien mit Kindern. Die Mitglieder tauschen Erfahrungen aus und nehmen an kostenlosen Workshops über Pflanzen und gesunde Ernährung teil.",
          "Man kann sich auf der Projektseite anmelden. Wer kein eigenes Beet bekommt, darf trotzdem an gemeinsamen Gartentagen teilnehmen. Eine kleine Jahresgebühr finanziert Erde und neue Werkzeuge.",
        ],
        questions: [
          ["Wo befindet sich der neue Garten?", "Auf dem Dach eines Kaufhauses.", "Auf einer ehemals ungenutzten Fläche.", "Auf einem privaten Bauernhof.", "b"],
          ["Wer beteiligt sich heute am Gartenprojekt?", "Ausschließlich Studierende.", "Nur professionelle Gärtner.", "Menschen unterschiedlichen Alters.", "c"],
          ["Was ist auch ohne eigenes Beet möglich?", "An Gemeinschaftstagen mithelfen.", "Kostenlos Pflanzen verkaufen.", "Die Werkzeuge mit nach Hause nehmen.", "a"],
        ],
      },
      second: {
        heading: "Eine Ausbildung mit Unterstützung",
        paragraphs: [
          "Immer mehr Betriebe bieten Jugendlichen vor dem Ausbildungsbeginn einen Kennenlerntag an. Dort können sie den Arbeitsalltag beobachten und einfache Aufgaben ausprobieren.",
          "Bei der Tischlerei Müller bekommt jeder neue Auszubildende außerdem eine erfahrene Kollegin als Ansprechperson. Sie erklärt Arbeitsabläufe und beantwortet Fragen, die am Anfang oft entstehen.",
          "Die Geschäftsleitung hofft, dass junge Mitarbeitende dadurch sicherer werden und länger im Betrieb bleiben. Auch die Eltern können einmal im Jahr an einem Informationstag teilnehmen.",
        ],
        questions: [
          ["Wozu dient der Kennenlerntag?", "Um den Beruf vor Ausbildungsbeginn kennenzulernen.", "Um Urlaub zu buchen.", "Um die Abschlussprüfung abzulegen.", "a"],
          ["Wer hilft neuen Auszubildenden bei Fragen?", "Nur andere Schülerinnen und Schüler.", "Eine erfahrene Person im Betrieb.", "Ausschließlich die Eltern.", "b"],
          ["Was möchte die Firma erreichen?", "Weniger Unterricht in der Berufsschule.", "Weniger Kontakt zu den Eltern.", "Dass die Auszubildenden sich wohlfühlen und bleiben.", "c"],
        ],
      },
    },
    courses: {
      context: "Sie suchen passende Freizeit- und Weiterbildungskurse. Ordnen Sie die Situationen 13 bis 19 zu. Eine Situation passt zu keiner Anzeige (0). Anzeige C ist das Beispiel.",
      situations: [
        ["Kira kann nur montags nach der Arbeit einen Fotokurs besuchen.","j"],
        ["Hanna möchte am Wochenende gesunde vegetarische Gerichte kochen lernen.","e"],
        ["Eva möchte an einem Samstag lernen, wie man ein Fahrrad repariert.","d"],
        ["Ali sucht einen günstigen Tanzkurs am Mittwochabend.","f"],
        ["Leon braucht nachts einen individuellen Schwimmkurs.","0"],
        ["Frau Becker möchte mit ihren Kindern am Sonntag gemeinsam töpfern.","i"],
        ["Mehmet möchte sich mit persönlichem Unterricht auf ein Bewerbungsgespräch vorbereiten.","h"],
      ],
      ads: [
        ["A","Schwimmen für Kinder","Samstagvormittag Gruppenkurs im Stadtbad."],
        ["B","Malgruppe im Museum","Offenes Atelier am Dienstag."],
        ["C","Bewegung zu Hause","Onlineübungen rund um die Uhr. Beispielanzeige."],
        ["D","Fahrrad fit machen","Samstag 10 bis 14 Uhr: Reifen wechseln, Bremsen prüfen, Werkzeug benutzen."],
        ["E","Vegetarisch kochen","Samstag und Sonntag: frische regionale Küche praktisch kennenlernen."],
        ["F","Tanzstudio Süd","Mittwochs um 19 Uhr moderner Tanz zum kleinen Monatspreis."],
        ["G","Spazieren und plaudern","Gemeinsamer Spaziergang jeden Freitagnachmittag."],
        ["H","Karriere-Coaching","Einzeltraining für Bewerbungen und Vorstellungsgespräche."],
        ["I","Familienwerkstatt Keramik","Sonntagvormittag töpfern Eltern mit Kindern ab fünf Jahren gemeinsam."],
        ["J","Fotografie für Einsteiger","Jeden Montag um 18.30 Uhr üben wir Porträts und Stadtbilder."],
      ],
    },
    debate: {
      context: "Leserinnen und Leser diskutieren: Soll die Innenstadt am Wochenende für private Autos gesperrt werden? Ja steht für die Sperrung, Nein dagegen.",
      comments: [
        ["Uwe (40)", "Meine kleine Tochter kann dann gefahrlos Rad fahren. Ich unterstütze eine autofreie Innenstadt.", "ja"],
        ["Beate (61)", "Ich brauche mein Auto, um größere Einkäufe zu transportieren. Eine Sperrung benachteiligt ältere Menschen.", "nein"],
        ["David (24)", "Weniger Verkehr bedeutet weniger Lärm. Die Geschäfte können trotzdem mit dem Bus erreicht werden.", "ja"],
        ["Ines (35)", "Man sollte erst bessere Busverbindungen anbieten, bevor man Straßen sperrt.", "nein"],
        ["Olaf (52)", "Restaurants könnten draußen zusätzliche Tische aufstellen. Deshalb bin ich klar dafür.", "ja"],
        ["Rita (44)", "Meine Kundschaft kommt meist mit dem Auto. Am Wochenende würden wir dadurch Umsatz verlieren.", "nein"],
        ["Marco (31)", "Ich gehe gern zu Fuß in die Stadt. Frische Luft und sichere Wege sind wichtiger als Parkplätze.", "ja"],
      ],
    },
    rules: {
      context: "Sie haben einen Bibliotheksausweis und lesen die Nutzungsordnung der Stadtbibliothek.",
      heading: "Regeln der Stadtbibliothek",
      sections: [
        ["Ausleihe", "Bücher dürfen vier Wochen ausgeliehen werden. Eine Verlängerung ist online möglich, wenn niemand das Buch vorgemerkt hat."],
        ["Arbeitsplätze", "Ruhiges Arbeiten ist im Obergeschoss erlaubt. Telefonate führen Sie bitte ausschließlich im Eingangsbereich."],
        ["Essen und Trinken", "Essen ist in den Lesesälen verboten. Wasser in verschließbaren Flaschen ist erlaubt."],
        ["Rückgabe und Verlust", "Bücher können auch am Automaten zurückgegeben werden. Bei Verlust melden Sie sich sofort an der Information."],
      ],
      questions: [
        ["Wie lange darf man ein Buch normalerweise behalten?", "Zwei Tage.", "Vier Wochen.", "Sechs Monate.", "b"],
        ["Wo dürfen Besucher telefonieren?", "Im Lesesaal.", "Überall.", "Im Eingangsbereich.", "c"],
        ["Was ist am Arbeitsplatz erlaubt?", "Wasser aus einer verschließbaren Flasche.", "Ein warmes Mittagessen.", "Laut Musik hören.", "a"],
        ["Was tun Sie, wenn ein Buch verloren geht?", "Es heimlich ersetzen.", "Die Bibliothek sofort informieren.", "Einfach keine weiteren Bücher ausleihen.", "b"],
      ],
    },
  }),
  readingSet({
    id: "b1-reading-sample-03", label: "Lesen Sample 3",
    blog: {
      heading: "AnjasWochennotizen.de", subheading: "Kleine Erlebnisse und große Überraschungen",
      date: "Dienstag, 18. November",
      paragraphs: [
        "Am Wochenende bin ich mit dem Zug zu einer Freundin gefahren. Am Zielbahnhof war ich so froh über die pünktliche Ankunft, dass ich meinen kleinen Koffer auf dem Bahnsteig vergaß. Erst im Bus fiel mir auf, dass ich nur meinen Rucksack dabeihatte.",
        "Ich meldete den Verlust sofort online bei der Bahn und beschrieb den Koffer genau. Am nächsten Vormittag erhielt ich eine Nachricht: Eine Reinigungskraft hatte ihn gefunden und dem Bahnpersonal übergeben.",
        "Ich musste meinen Ausweis zeigen und konnte den Koffer am Fundschalter abholen. Alle Kleidungsstücke und das Geburtstagsgeschenk waren noch darin. Das war eine Erleichterung! Ich habe der Reinigungskraft über die Bahn ein Dankeschön ausrichten lassen.",
      ],
      questions: [
        ["Anja fuhr am Wochenende mit ihrem Auto zu einer Freundin.", "falsch"],
        ["Der Zug kam erst viele Stunden zu spät an.", "falsch"],
        ["Sie bemerkte erst im Bus, dass ihr Koffer fehlte.", "richtig"],
        ["Eine Reinigungskraft fand den Koffer und gab ihn beim Bahnpersonal ab.", "richtig"],
        ["Anja durfte den Koffer ohne Ausweis vom Fundschalter mitnehmen.", "falsch"],
        ["Das Geburtstagsgeschenk war noch im Koffer, als Anja ihn abholte.", "richtig"],
      ],
    },
    press: {
      first: {
        heading: "Lebensmittel retten statt wegwerfen",
        paragraphs: [
          "In vielen Städten gibt es inzwischen öffentliche Kühlschränke, in die Geschäfte und Privatpersonen überschüssige Lebensmittel legen. Andere dürfen die noch guten Produkte kostenlos mitnehmen.",
          "Eine Freiwilligengruppe in Freiburg kontrolliert jeden Tag den Kühlschrank. Sie entfernt verdorbene Lebensmittel, reinigt die Fächer und erklärt neuen Nutzerinnen und Nutzern die Regeln. Rohes Fleisch darf aus Sicherheitsgründen nicht abgegeben werden.",
          "Der Verein freut sich über weitere Helfer. Wer mitmachen möchte, kann sich online für einen festen Wochentag eintragen. So werden Ressourcen gespart und Menschen aus der Nachbarschaft lernen sich kennen.",
        ],
        questions: [
          ["Was ist die Idee hinter dem öffentlichen Kühlschrank?", "Gute Lebensmittel mit anderen teilen.", "Lebensmittel teurer verkaufen.", "Alte Kühlschränke reparieren.", "a"],
          ["Welche Aufgabe haben die Freiwilligen?", "Sie verkaufen Lebensmittel.", "Sie überprüfen Sauberkeit und Inhalt.", "Sie kochen täglich für ein Restaurant.", "b"],
          ["Wie kann man im Projekt regelmäßig mithelfen?", "Nur über einen Supermarkt.", "Nach einer bezahlten Ausbildung.", "Durch Anmeldung für einen Wochentag.", "c"],
        ],
      },
      second: {
        heading: "Mit dem Nachtzug in den Urlaub",
        paragraphs: [
          "Immer mehr Reisende interessieren sich für Nachtzüge. Sie steigen am Abend ein und erreichen am nächsten Morgen eine andere Stadt. Damit sparen sie oft eine Übernachtung im Hotel.",
          "Die Bahnunternehmen bieten Sitzplätze und Schlafabteile in verschiedenen Preisklassen. Wer früh reserviert, findet meist günstigere Fahrkarten. Allerdings dauern manche Verbindungen länger als eine Flugreise.",
          "Für viele Gäste zählt vor allem die entspannte Reise. Sie müssen nicht lange vorher am Flughafen warten und können unterwegs lesen oder schlafen. Neue Strecken sollen in den nächsten Jahren dazukommen.",
        ],
        questions: [
          ["Warum ist der Nachtzug für einige Reisende praktisch?", "Man kommt morgens am Ziel an.", "Man muss den ganzen Tag fahren.", "Es gibt keine Schlafmöglichkeiten.", "a"],
          ["Wie bekommt man oft einen günstigeren Preis?", "Man kauft erst nach Abfahrt.", "Man reserviert frühzeitig.", "Man fährt nur an Feiertagen.", "b"],
          ["Welcher Nachteil wird genannt?", "Die Züge fahren nie ins Ausland.", "Reisende können nicht schlafen.", "Einige Strecken brauchen mehr Zeit als ein Flug.", "c"],
        ],
      },
    },
    courses: {
      context: "Sie und Ihre Freunde suchen berufliche Weiterbildung. Finden Sie die passende Anzeige für die Situationen 13 bis 19. Eine Situation hat keine Lösung (0). Anzeige C ist das Beispiel.",
      situations: [
        ["Yara sucht Einzelberatung, um ihren Lebenslauf zu verbessern.","a"],
        ["Rolf möchte ein Kursangebot auf einem Schiff für sich und seinen Hund.","0"],
        ["Oskar braucht einen Abendkurs für Telefonate mit internationalen Kunden.","j"],
        ["Sofia kann dienstags nachmittags lernen, Präsentationen zu gestalten.","f"],
        ["Tim möchte an zwei Tagen ein Zertifikat für Erste Hilfe erwerben.","b"],
        ["Linda möchte am Wochenende lernen, professionelle Tabellen am Computer zu erstellen.","e"],
        ["Mara sucht einen kostenlosen offenen Gesprächstreff für Arbeitssuchende.","h"],
      ],
      ads: [
        ["A","Bewerbungsberatung einzeln","Persönliches Coaching für Lebenslauf und Anschreiben."],
        ["B","Erste Hilfe für Betriebe","Zweitägiger Kurs mit Bescheinigung am Kursende."],
        ["C","Lernen auf dem Handy","Selbstlernkurse ohne feste Unterrichtszeit. Beispielanzeige."],
        ["D","Online-Kurs am Vormittag","Allgemeine Berufskunde ohne Prüfungen."],
        ["E","Tabellen für den Beruf","Samstag und Sonntag üben wir Formeln und Auswertungen am PC."],
        ["F","Erfolgreich präsentieren","Dienstags um 15 Uhr: Aufbau, Folien und freies Sprechen."],
        ["G","Tipps für Selbstständige","Informationsabend zur Gründung einer Firma."],
        ["H","Berufstreff im Bürgerhaus","Kostenloser Austausch für Stellensuchende, jeden Freitag."],
        ["I","Handwerk in der Stadt","Einführungsabend über Ausbildungsberufe."],
        ["J","Englisch am Telefon","Montag und Mittwoch ab 18 Uhr: Kundengespräche sicher führen."],
      ],
    },
    debate: {
      context: "In einem Forum wird gefragt: Sollten Firmen grundsätzlich mehr Homeoffice anbieten? Wählen Sie Ja oder Nein.",
      comments: [
        ["Carla (34)", "Ohne den täglichen Arbeitsweg habe ich mehr Zeit für meine Familie. Mehr Homeoffice wäre sehr gut.", "ja"],
        ["Jens (45)", "Im Büro kann ich schnell mit Kolleginnen und Kollegen sprechen. Die Arbeit zu Hause passt nicht zu mir.", "nein"],
        ["Fatma (28)", "Ich arbeite daheim konzentrierter und schaffe mehr. Deshalb sollten Firmen es häufiger ermöglichen.", "ja"],
        ["Holger (51)", "Neue Mitarbeitende brauchen zunächst persönlichen Kontakt im Team. Für alle pauschal Homeoffice anzubieten halte ich für falsch.", "nein"],
        ["Kim (39)", "Ich finde zwei Tage pro Woche zu Hause ideal. Ein flexibles Modell wäre ein Gewinn.", "ja"],
        ["Robert (42)", "Meine kleine Wohnung ist für konzentriertes Arbeiten ungeeignet. Ich möchte lieber regelmäßig ins Büro.", "nein"],
        ["Nadine (47)", "Wer lange mit dem Auto pendelt, würde zu Hause viel Zeit sparen. Ich bin für mehr Wahlmöglichkeiten.", "ja"],
      ],
    },
    rules: {
      context: "Sie beginnen einen Kurs in einem Sportzentrum und erhalten die Nutzungsordnung.",
      heading: "Hausregeln Sport- und Kurszentrum West",
      sections: [
        ["Anmeldung", "Zum ersten Besuch bringen Sie die Buchungsbestätigung und einen Lichtbildausweis mit. Die Anmeldung ist im Erdgeschoss."],
        ["Umkleiden", "Schließfächer können während des Trainings kostenlos genutzt werden. Vor dem Verlassen des Hauses müssen sie geleert werden."],
        ["Getränke und Sauberkeit", "Getränke sind nur in verschlossenen Flaschen erlaubt. Essen Sie bitte im Aufenthaltsraum, nicht in den Trainingsräumen."],
        ["Kursänderung und Sicherheit", "Bei einer Erkrankung informieren Sie die Rezeption spätestens zwei Stunden vor Kursbeginn. Defekte Sportgeräte melden Sie direkt der Trainerin oder dem Trainer."],
      ],
      questions: [
        ["Was brauchen Sie beim ersten Besuch?", "Nur ein Handtuch.", "Buchungsbestätigung und Ausweis.", "Eine ärztliche Bescheinigung.", "b"],
        ["Wann muss ein Schließfach geleert sein?", "Nach dem Besuch.", "Nach einer Woche.", "Erst am Monatsende.", "a"],
        ["Wo darf man essen?", "In allen Kursräumen.", "In der Umkleide.", "Im Aufenthaltsraum.", "c"],
        ["Sie bemerken ein kaputtes Gerät. Was tun Sie?", "Sie trainieren trotzdem weiter.", "Sie informieren das Trainingspersonal.", "Sie bringen es selbst zur Werkstatt.", "b"],
      ],
    },
  }),
]);

export const B1_READING_PART_KEYS = Object.freeze(["teil1", "teil2", "teil3", "teil4", "teil5"]);

export const getB1ReadingQuestions = (sample) => ({
  teil1: sample.teil1.questions,
  teil2: [...sample.teil2.questions, ...sample.teil2.text2.questions],
  teil3: sample.teil3.situations,
  teil4: sample.teil4.comments,
  teil5: sample.teil5.questions,
});
