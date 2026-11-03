// B1 Mock 3 Lesen source: teacher-uploaded Goethe-style Übungssatz (Teil 1–5).
// Transcribed as native structured content: no PDF embed or learner-facing solutions.
// Reading key validated against Goethe-Institut official Modellsatz Teil 1 solutions:
// https://bfu.goethe.de/b1_mod/lesen_l1.php (Aufgabe 2 = Richtig).
// The teacher source had erroneously marked Aufgabe 2 as Falsch.
const statements = (start, rows) => rows.map(([question, answer], index) => ({
  number: start + index, question, answer,
}));
const choices = (start, rows) => rows.map(([question, a, b, c, answer], index) => ({
  number: start + index,
  question,
  options: [{ id: "a", label: a }, { id: "b", label: b }, { id: "c", label: c }],
  answer,
}));

export const B1_MOCK3_LESEN = {
  id: "b1-mock-03-lesen",
  label: "B1 Mock 3 · Lesen",
  teil1: {
    title: "Teil 1", time: "10 Minuten",
    intro: "Lesen Sie den Text und die Aufgaben 1 bis 6 dazu. Wählen Sie: Sind die Aussagen Richtig oder Falsch?",
    heading: "SusannesAlltagsBlog.at",
    subheading: "Mein Alltag, meine Gedanken, mein Leben...",
    date: "Donnerstag, den 23. Juni",
    paragraphs: [
      "Was mir heute passiert ist, das glaubt mir keiner: Als ich zu Mittag nichts ahnend in der Küche beim Kochen stand, klingelte mein Handy. Eine Frauenstimme erklärte mir, dass meine Brieftasche in der Bankfiliale abgegeben worden war und ich sie dort abholen könnte. Mir wurde ganz heiß – mir war noch gar nicht aufgefallen, dass sie fehlte! Und ich hatte ja auch noch relativ viel Bargeld eingesteckt! Schnell holte ich meine Handtasche hervor und suchte nach der Brieftasche. Es stimmte! Auch nach längerem Kramen in der Tasche konnte ich sie nicht finden. Mein Geld war tatsächlich verschwunden!",
      "Ich machte mich also auf den Weg zur Bank und überlegte, wo ich meine Brieftasche liegen gelassen hatte: Sicherlich im Supermarkt an der Kasse. Jedenfalls kam ich bei der Bank an und war schon gespannt darauf zu erfahren, wo meine Brieftasche gefunden worden war und natürlich, ob etwas fehlte. Die Bankangestellte teilte mir mit, dass ein junger Mann die Brieftasche abgegeben hatte. Er hatte sie auf dem Parkplatz vor dem Supermarkt gefunden und wollte sie eigentlich ins Fundbüro bringen – wie man es in so einem Fall eben macht. Der Weg dorthin war ihm aber zu weit und so suchte er nach einer anderen Möglichkeit, mir die Brieftasche zurückzugeben. Das muss man sich einmal vorstellen: Er war so clever, dass er auf der Bankomatkarte nach meinem Namen suchte und die nächste Filiale meiner Bank aufsuchte... Die Bank würde ja die Kontaktdaten zu meinem Namen haben und könnte mich so anrufen. Er fuhr in die nächste Filiale und dank der Computervernetzung der Filialen konnte meine Telefonnummer schnell herausgefunden werden.",
      "Da stand ich nun mit meiner Brieftasche, die mir beim Verlassen des Supermarktes aus der Handtasche gerutscht sein muss. Zum Glück war alles noch da! Ich bin sooo froh, dass diese Episode so gut ausgegangen ist. Nun weiß ich leider gar nicht, wie ich dem ehrlichen Finder danken kann. Vielleicht liest er ja diesen Blogeintrag oder es liest ihn jemand, dem er die Geschichte erzählt hat: „Vielen, vielen Dank, lieber Finder!“",
      "Bis bald, eure Susanne",
    ],
    questions: statements(1, [
      ["Erst durch den Anruf bemerkte Susanne das Fehlen ihrer Brieftasche.", "richtig"],
      ["Susanne glaubte, die Brieftasche beim Bezahlen vergessen zu haben.", "richtig"],
      ["Der Finder hatte die Brieftasche ins Fundbüro gebracht.", "falsch"],
      ["Die Telefonnummer der Bank war in der Brieftasche.", "falsch"],
      ["In Susannes Brieftasche fehlte nichts.", "richtig"],
      ["Susanne konnte dem Finder persönlich für seine Ehrlichkeit danken.", "falsch"],
    ]),
  },
  teil2: {
    title: "Teil 2", time: "20 Minuten",
    heading: "Text 1: Umweltfreundliche Energie in Feldheim (aus einer deutschen Zeitung)",
    paragraphs: [
      "In der kleinen Gemeinde Feldheim in Brandenburg wurde vor einigen Jahren ein innovatives Energieprojekt gestartet. Eine moderne Bio-Gasanlage, die von dem Landwirt Eckhard Meier betrieben wird, produziert seit geraumer Zeit sowohl Strom als auch Wärme für das gesamte Dorf. Wissenschaftler der Universität Göttingen begleiteten das Projekt von Anfang an. Sie wollten demonstrieren, dass ein ganzes Dorf energetisch unabhängig sein kann und vollständig mit umweltfreundlichen, erneuerbaren Energien versorgt werden kann.",
    ],
    questions: choices(7, [
      ["In diesem Text geht es um...", "die neue Technologie von Eckhard Meier.", "die umweltfreundliche Stromproduktion in Feldheim.", "einen Studiengang an der Universität Göttingen.", "b"],
      ["Die Wissenschaftler wollten zeigen, dass...", "ein ganzes Dorf von modernen Energien leben kann.", "eine Bio-Gasanlage mehr Strom produziert, als ein Dorf braucht.", "man größere Mengen Strom sparen kann.", "a"],
      ["Welcher Vorteil ergibt sich laut Artikel für die Dorfbewohner?", "Sie zahlen keine Heizkosten mehr.", "Sie erhalten sowohl Wärme als auch Strom aus lokaler Produktion.", "Sie arbeiten alle in der Bio-Gasanlage.", "b"],
    ]),
    text2: {
      title: "Teil 2 · Text 2",
      intro: "Lesen Sie den zweiten Text. Wählen Sie für die Aufgaben 10 bis 12 a, b oder c.",
      heading: "Text 2: Tour durch Murtens Geschichte (aus einer Schweizer Broschüre)",
      paragraphs: [
        "Mit der Rundfahrt „Zeitreise per Velo“ können Touristen das Städtchen Murten und seine Geschichte sportlich neu entdecken. Die Tour startet am Bahnhof von Murten, wo die sportlichen Teilnehmer auf das eigene oder ein gemietetes Velo steigen. Die weniger sportlichen und jene, die es schon immer ausprobieren wollten, steigen aufs Elektro-Velo. Dieses kann ebenfalls am Bahnhof gemietet werden.",
        "Vom Bahnhof führt der Weg auf den historischen Hügel, wo Karl der Kühne sein Hauptquartier aufbaute, bevor sein Heer im Jahr 1476 besiegt wurde. Die Sportlichen kommen bei der Fahrt auf den Hügel ins Schwitzen, während die E-Biker ganz einfach den Elektromotor nutzen. Oben angekommen kann man die wunderbare Aussicht auf den Murtensee genießen. Nach einer kurzen Pause geht es weiter nach Merlach. Dort steht ein Denkmal für Soldaten, die in der Schlacht bei Murten 1476 umgekommen sind. Danach geht die Fahrt zum Hafen und in die Altstadt. Unterwegs erfahren die Velofahrer vieles über die Region. „Mit der Velorundfahrt für Gruppen wollen wir unser Angebot für aktive Radfahrer erweitern“, sagt der Geschäftsführer von Murten Tourismus. Damit soll sowohl das Gebiet für Velo-Touristen interessant gemacht als auch der Trend zum E-Bike unterstützt werden.",
        "Velo = Schweizer Standard für „Fahrrad“",
      ],
      questions: choices(10, [
        ["In diesem Text geht es darum, dass...", "die Geschichte von Murten neu erzählt wird.", "es ein neues Tourismus-Angebot gibt.", "man in Murten neue Velo-Wege bauen will.", "b"],
        ["Für die Rundfahrt...", "braucht man ein eigenes Velo.", "muss man nicht sportlich sein.", "sollte man mit der Bahn anreisen.", "b"],
        ["Der Geschäftsführer von Murten Tourismus will, dass...", "es in Murten mehr Stadtführungen für Gruppen gibt.", "die Leute normale Velos statt Elektro-Velos benutzen.", "mehr Velo-Touristen in die Region kommen.", "c"],
      ]),
    },
  },
  teil3: {
    title: "Teil 3", time: "10 Minuten",
    context: "Nach dem Ende Ihres gemeinsamen Deutschkurses suchen einige Ihrer Kolleginnen und Kollegen nach passenden Möglichkeiten zum Weiterlernen. Lesen Sie die Situationen 13 bis 19 und die Anzeigen A bis J. Jede Anzeige darf nur einmal verwendet werden. Gibt es keine passende Anzeige, wählen Sie 0. Anzeige I ist das Beispiel.",
    exampleAd: "I",
    ads: [
      ["A", "Schweizer Autoren, leicht gemacht", "Nach 100 Lernstunden schon literarische Kurzgeschichten & Romane lesen? Kein Problem! Die Reihe bietet vereinfachte Originalversionen für Sprachlerner. www.schweizer-leseverlag.ch"],
      ["B", "Trainingsprogramm Deutsch", "Sie wollen Deutsch verbessern, haben aber keine Zeit für Kurse? Lernen Sie gratis im Internet! 10 Kurslektionen, Grammatik & Übungen online. www.sprachenlernen.de"],
      ["C", "DEUTSCH IN DER SCHWEIZ", "Intensivkurse (20-30 Std), Schreibkurse (Fernstudium!), Sommerkurse für Jugendliche & Erwachsene. Kurs: Deutsch im Hotel. Nur Tageskurse! www.deutschinderschweiz.ch"],
      ["D", "Job & Sprache-Net", "Jobs für Deutschlernende in Deutschland, Österreich & Schweiz. Erfahrungen in Hotel & Restaurant sammeln (Juni–August). Unterkunft frei! www.jobundsprache-net.com"],
      ["E", "Sprachschule ORION", "Trainer/innen gesucht (Vollzeit). Kurszeiten 8:00–17:00h, Niveaus A1–C1. Allgemein & Berufsbezogen (z.B. Deutsch für Tourismus). office@deutschintensiv.de"],
      ["F", "Deutsch erLesen", "Das Magazin richtet sich an Deutschinteressierte im In- und Ausland. Erscheint monatlich mit aktuellen Originalartikeln aus der deutschen Presse. info@deutsch-erlesen.de"],
      ["G", "Verlag für deutsche Literatur", "Lektor/in gesucht für Auswahl & Korrektur von Werken junger Autoren. Romane, Gedichtbände & Hörbücher. junge-literatur@berlin.de"],
      ["H", "Deutsch in Linz", "Deutsch-Intensivkurse Mo–Fr (9:30–13h & 14–17h). Für Berufstätige bieten wir flexible Kurszeiten an (Termine nach Wunsch, auch abends!). www.deutschinlinz-schule.at"],
      ["I", "Sprache und Kultur in Wien", "Deutschkurse ganzjährig! Spezialangebote für den Sommer. Infos unter: www.sprache-kultur@aon.at"],
      ["J", "DIGITAL LEARNING", "Neues Computerprogramm für Büromanagement und Buchhaltung in englischer und deutscher Sprache. Im Buchhandel erhältlich. software@digital-learning.net"],
    ],
    situations: [
      { number: 13, text: "Leon möchte im Sommer im Tourismus-Bereich arbeiten, um sein Deutsch zu verbessern.", answer: "d" },
      { number: 14, text: "Giovanna sucht deutsche Hörbücher, damit sie unterwegs Deutsch lernen kann.", answer: "0" },
      { number: 15, text: "Mirjeta hat keine Zeit für einen Kurs, möchte sich aber regelmäßig über Neuigkeiten aus Deutschland informieren.", answer: "f" },
      { number: 16, text: "Maria möchte am Computer Deutsch lernen.", answer: "b" },
      { number: 17, text: "Susan liest am liebsten Literatur, wenn die Texte nicht zu schwierig sind.", answer: "a" },
      { number: 18, text: "Miroslav will den schriftlichen Ausdruck verbessern, weil er im Studium viel schreiben muss.", answer: "c" },
      { number: 19, text: "Juan kann nur am Abend einen Kurs besuchen.", answer: "h" },
    ],
  },
  teil4: {
    title: "Teil 4", time: "15 Minuten",
    context: "Lesen Sie die Kommentare 20 bis 26 zu einem Artikel über das Thema „Verbot von Gewalt-Videospielen (Killerspielen)“. Ist die Person für ein Verbot? Wählen Sie Ja oder Nein.",
    comments: [
      { number: 20, person: "Stefan, 19, Graz", text: "Ich könnte mir vorstellen, dass ein Verbot die gegenteilige Wirkung hätte, denn ein verbotenes Spiel ist doch noch interessanter als ein nicht verbotenes! Außerdem ist es gar nicht möglich, alle Killerspiele abzuschaffen, weil es davon schon viel zu viele gibt. Mein Fazit: Warum verbieten?", answer: "nein" },
      { number: 21, person: "Dagmar, 23, Leipzig", text: "Wer entscheidet letztlich darüber, welche Spiele man nicht braucht? Dürfen diese Menschen dann auch darüber entscheiden, welche Bücher, Filme oder Musik wir nicht brauchen? Viel wichtiger ist es doch, dass Kinder und Jugendliche lernen, selbst zwischen virtueller und realer Gewalt zu unterscheiden!", answer: "nein" },
      { number: 22, person: "Kathleen, 49, Cuxhaven", text: "„Töten auf Probe“ soll erlaubt sein? Das bedeutet: Mal schnell zu üben, wie man jemanden umbringt, ist eine Freizeitbeschäftigung. Wie zynisch kann man sein? Nicht jeder wird zum Glück zum Monster, aber die Einstellung dahinter ist Ausdruck einer unglaublichen Gleichgültigkeit. Das muss gestoppt werden, und zwar schnell.", answer: "ja" },
      { number: 23, person: "Marius, 34, St. Gallen", text: "Ich spiele solche Spiele seit bald drei Jahren regelmäßig. Ich habe eine kleine Tochter, eine Frau und einen Job und spiele für den Ausgleich. Nur weil es mal dazu kommt, dass jemand die Realität nicht sieht und durchdreht, müssen dann alle die anderen ein Verbot hinnehmen? Es wäre besser, die Altersbeschränkung auf 18 Jahre festzulegen.", answer: "nein" },
      { number: 24, person: "Jonny, 21, Berlin", text: "„Killerspiele“ machen schnell aggressiv und man wird davon abhängig. Außerdem besteht die Gefahr, dass jemand nicht mit solchen Spielen umgehen kann und zum Nachahmungstäter wird. Das sind nur zwei Gründe, warum man gegen diese Spiele endlich etwas tun sollte.", answer: "ja" },
      { number: 25, person: "Robert, 18, Winterthur", text: "In dieser Diskussion fehlt immer die genaue Kenntnis! Meistens ist es bei sogenannten „Killerspielen“ nämlich so, dass man in einem Team spielt. Ein solches Spiel stärkt also den Teamgeist. Außerdem steht die Taktik im Vordergrund und nicht eine bestimmte Methode, jemanden umzubringen.", answer: "nein" },
      { number: 26, person: "Marinette, 38, Frankfurt", text: "Ich denke, dass gewisse Situationen oder Dinge einen Menschen dazu bringen können, etwas zu tun, das er sonst nicht tun würde. Das kann gerade bei sogenannten „Killerspielen“ der Fall sein. Deshalb scheint mir ein Verbot sinnvoll zu sein, auch wenn so ein Verbot allein wahrscheinlich nicht viel nützt.", answer: "ja" },
    ],
  },
  teil5: {
    title: "Teil 5", time: "10 Minuten",
    context: "Sie informieren sich über die Hausordnung des Dresdner Berufsbildungszentrums BZW, in dem Sie einen Kurs gebucht haben.",
    heading: "HAUSORDNUNG — Dresdner Berufsbildungszentrum (BZW)",
    sections: [
      ["Unterrichtszeiten", "Die vereinbarten Unterrichtszeiten sind verbindlich. Ist die Lehrperson zehn Minuten nach Unterrichtsbeginn nicht da, informiert die Klassenvertretung das Sekretariat."],
      ["Ordnung", "In sämtlichen Räumen und Anlagen unserer Schule ist auf Ordnung und Sauberkeit zu achten. Schulräume, Einrichtungen und Anlagen sind sorgfältig zu benützen. Außerhalb der Unterrichtszeiten dürfen sich Lernende nicht in den Klassenräumen aufhalten. Es ist untersagt, in den Klassenräumen etwas an die Wände zu kleben oder zu schreiben und Schulmöbel in andere Räume zu bringen. Mitarbeitende und Lernende, die Schäden feststellen, melden diese dem Sekretariat."],
      ["Störungen", "Mitarbeitende und Lernende sorgen dafür, dass der Schulbetrieb nicht gestört wird."],
      ["Alkohol- und Drogenkonsum", "Der Konsum von Alkohol, illegalen Drogen sowie anderen psychoaktiven Substanzen ist auf dem gesamten Schulareal und während schulischer Veranstaltungen (einschließlich aller Pausen) verboten. In Ausnahmefällen kann die Schulleitung den Konsum von Alkohol erlauben."],
      ["Rauchen", "Rauchen ist nur im Freien beziehungsweise in den dafür vorgesehenen Zonen gestattet. Wir bitten darum, die aufgestellten Aschenbecher zu benutzen."],
      ["Diebstahl", "Es empfiehlt sich, Wertsachen und Bargeld sorgfältig aufzubewahren. Die Schule stellt den Lernenden und Mitarbeitenden kostenlos Schließfächer zur Verfügung. Für verlorene Schlüssel wird eine Gebühr von Euro 50,- erhoben. Die Schule übernimmt für Diebstähle keine Haftung."],
      ["Fundgegenstände", "Fundgegenstände bitte im Sekretariat abgeben."],
      ["Parkplätze", "Auf dem Schulareal stehen keine Gratis-Autoparkplätze zur Verfügung. Fahrräder müssen in den dafür vorgesehenen Fahrradkeller gebracht und abgeschlossen werden. Mopeds und Motorräder sind auf dem Schulareal nicht erlaubt."],
    ],
    questions: choices(27, [
      ["Schüler...", "dürfen keine Fahrräder mit zur Schule bringen.", "dürfen ihre Fahrräder auf den Schulhof stellen.", "müssen ihre Fahrräder in einen speziellen Raum stellen.", "c"],
      ["Für die Klassenräume des BZW gilt:", "Schüler dürfen keine Poster aufhängen.", "Schüler müssen dort selber aufräumen.", "Schüler können dort nach dem Unterricht lernen.", "a"],
      ["Um die verschließbaren Fächer benutzen zu können, muss man...", "einen Schlüssel im Sekretariat verlangen.", "einmalig 50,- Euro zahlen.", "Schüler sein oder im BZW arbeiten.", "c"],
      ["Das Trinken von Alkohol...", "kann von der Schulleitung genehmigt werden.", "muss der Lehrperson gemeldet werden.", "ist ohne Ausnahme verboten.", "a"],
    ]),
  },
};
