export const A2_LISTENING_MODES = Object.freeze({
  GRADED: "graded",
  SELF_CHECK: "self-check",
  NONE: "none",
});

export const A2_LISTENING_TASKS = {
  1: {
    chapter: "1.1",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Höre den Text zweimal und beantworte alle fünf Fragen. Achte auf Lenas Pläne, den Film, Sport, das Wetter und das nächste Treffen.",
    audioUrl: "https://youtu.be/z5yj1HQZbQo",
    questions: [
      { stem: "Was hat Lena am Samstag vor?", options: ["A. Spazieren mit Freundin", "B. Ins Kino gehen", "C. Tennis spielen", "D. Spaziergang im Park"] },
      { stem: "Warum freut sich Lena auf den Actionfilm?", options: ["A. Sie liebt spannende Geschichten", "B. Sie mag Comedy", "C. Sie hat ihn schon gesehen", "D. Sie liebt Horror"] },
      { stem: "Welche Sportart betreibt Lena regelmäßig?", options: ["A. Tennis", "B. Schwimmen", "C. Laufen", "D. Yoga"] },
      { stem: "Wie war das Wetter am letzten Wochenende?", options: ["A. Regnerisch und kühl", "B. Sonnig und warm", "C. Bewölkt und windig", "D. Kalt und frostig"] },
      { stem: "Was schlägt Lena für das nächste Treffen vor?", options: ["A. Ins Kino", "B. Tennis", "C. Spaziergang", "D. Kaffee trinken"] },
    ],
  },
  2: {
    chapter: "1.2",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Sieh dir das eingebettete Video an und beantworte danach die drei Hörverstehen-Fragen.",
    audioUrl: "https://youtu.be/5ttnGcZWo-Q",
    questions: [
      { stem: "Warum lernt der Sprecher Deutsch?", options: ["A. Weil er nach Frankreich ziehen möchte.", "B. Weil er in Deutschland arbeiten möchte.", "C. Weil er eine deutsche Freundin hat.", "D. Weil er Deutsch liebt."] },
      { stem: "Welche Methoden benutzt der Sprecher?", options: ["A. Nur Bücher", "B. Nur Filme", "C. Sprachkurse, Apps und Freunde", "D. Nur Musik"] },
      { stem: "Wie oft übt der Sprecher Deutsch?", options: ["A. Jeden Tag eine Stunde.", "B. Einmal pro Woche.", "C. Einmal im Monat.", "D. Nie."] },
    ],
  },
  3: {
    chapter: "1.3",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Sieh dir das eingebettete Video an und beantworte danach die fünf Hörverstehen-Fragen.",
    audioUrl: "https://youtu.be/z0hve7zCDEo",
    questions: [
      { stem: "Wie alt ist Julia?", options: ["a) 24 Jahre", "b) 26 Jahre", "c) 28 Jahre", "d) 30 Jahre"] },
      { stem: "Was macht Julia beruflich?", options: ["a) Köchin", "b) Lehrerin", "c) Architektin", "d) Musikerin"] },
      { stem: "Wo lebt Tobias?", options: ["a) München", "b) Frankfurt", "c) Hamburg", "d) Berlin"] },
      { stem: "Was möchte Tobias in Zukunft machen?", options: ["a) Ein Restaurant eröffnen", "b) Musiker werden", "c) Eine Weltreise machen", "d) Lehrer werden"] },
      { stem: "Was machen Julia und Tobias oft am Wochenende?", options: ["a) Gitarre spielen", "b) Gemeinsam kochen", "c) In die Berge reisen", "d) Ins Kino gehen"] },
    ],
  },
  4: {
    chapter: "2.4",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören: Ein Wochenende mit Freunden planen. Sieh dir das eingebettete Video an und beantworte danach die fünf Fragen.",
    audioUrl: "https://youtu.be/tHAo8hxjKmw",
    questions: [
      { stem: "Wann treffen sich Anna, Ben und Claudia am Samstag?", options: ["a) Um 9 Uhr", "b) Um 10 Uhr", "c) Um 11 Uhr"] },
      { stem: "Was bringt Claudia zum Ausflug mit?", options: ["a) Ein Zelt", "b) Einen Rucksack mit Snacks und Getränken", "c) Einen Reiseführer"] },
      { stem: "Was möchten Ben und Anna im Wald machen?", options: ["a) Einen Film schauen", "b) Ein Picknick machen", "c) Eine Wanderung machen"] },
      { stem: "Was planen sie am Samstagabend?", options: ["a) Ein Konzert zu besuchen", "b) Ein Picknick im Park", "c) In einem Restaurant essen und einen Film schauen"] },
      { stem: "Was wollen sie am Sonntag im Park machen?", options: ["a) Spielen und spazieren gehen", "b) Fußball spielen", "c) Fotos machen"] },
    ],
  },
  5: {
    chapter: "2.5",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Sieh dir das eingebettete Video über Anna und ihre Freizeit an und beantworte danach die Fragen.",
    audioUrl: "https://youtu.be/V8gcgVcUGQM",
    questions: [
      { stem: "Was macht Anna abends gerne?", options: ["a) Tee trinken und lesen", "b) Fernsehen", "c) Telefonieren"] },
      { stem: "Welches Brettspiel spielt Anna oft?", options: ["a) Schach", "b) Mensch ärgere dich nicht", "c) Uno"] },
      { stem: "Was macht Anna jeden Morgen?", options: ["a) Joggen", "b) Yoga", "c) Schwimmen"] },
      { stem: "Wo war Anna letztes Wochenende mit Freunden?", options: ["a) Am Strand", "b) In den Bergen", "c) Im Park"] },
      { stem: "Welche Musik hört Anna zum Konzentrieren?", options: ["a) Pop", "b) Klassische Musik", "c) Jazz"] },
    ],
  },
  6: {
    chapter: "3.6",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie das Gespräch zwischen Anna und Tom zweimal. Lesen Sie zuerst die fünf Fragen. Wählen Sie zu jeder Frage die richtige Antwort: A, B oder C. Tragen Sie Ihre endgültigen Antwortbuchstaben im Submit-Tab unter Teil 4 ein.",
    audioKey: "a2/day-06/day-06.mp3",
    audioUrl: "",
    questions: [
      { stem: "Wie viele Zimmer hat Toms neue Wohnung?", options: ["A) Zwei Zimmer", "B) Drei Zimmer", "C) Vier Zimmer"] },
      { stem: "Was steht neben dem Fenster im Wohnzimmer?", options: ["A) Ein Bücherregal", "B) Eine Lampe", "C) Ein Fernseher"] },
      { stem: "Was sagt Tom über den Kleiderschrank im Schlafzimmer?", options: ["A) Er ist zu groß.", "B) Er ist ein bisschen zu klein.", "C) Er steht links neben dem Bett."] },
      { stem: "Was hat Tom im Arbeitszimmer?", options: ["A) Einen Schreibtisch, einen Stuhl und einen Computer", "B) Ein Sofa, einen Tisch und einen Fernseher", "C) Ein Bett, einen Schrank und eine Lampe"] },
      { stem: "Was möchte Anna am Samstag mitbringen?", options: ["A) Einen Kuchen", "B) Eine Pflanze", "C) Kaffee"] },
    ],
  },
  7: {
    chapter: "3.7",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie das Telefongespräch zwischen Maria Lopez und Herrn Schmidt zweimal. Lesen Sie zuerst die fünf Fragen. Wählen Sie zu jeder Frage die richtige Antwort: A, B oder C. Tragen Sie Ihre endgültigen Antwortbuchstaben im Submit-Tab unter Teil 4 ein.",
    audioKey: "a2/day-07/day-07.mp3",
    audioUrl: "",
    questions: [
      { stem: "Wie groß ist die Wohnung in der Lindenstraße?", options: ["A) 50 Quadratmeter", "B) 60 Quadratmeter", "C) 75 Quadratmeter"] },
      { stem: "Wie viel muss Maria jeden Monat für die Miete mit Nebenkosten bezahlen?", options: ["A) 650 Euro", "B) 100 Euro", "C) 750 Euro"] },
      { stem: "Was sagt Herr Schmidt über Haustiere?", options: ["A) Eine Katze ist erlaubt, ein Hund nicht.", "B) Ein Hund ist erlaubt, eine Katze nicht.", "C) Katzen und Hunde sind erlaubt."] },
      { stem: "Wie hoch ist die Kaution?", options: ["A) 650 Euro", "B) 1.300 Euro", "C) 1.500 Euro"] },
      { stem: "Wann besichtigt Maria die Wohnung?", options: ["A) Am Donnerstag um 17 Uhr", "B) Am Freitag um 18 Uhr", "C) Am Donnerstag um 18 Uhr"] },
    ],
  },
  8: {
    chapter: "3.8",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie das Gespräch im Restaurant zweimal. Lesen Sie zuerst die fünf Fragen. Wählen Sie zu jeder Frage die richtige Antwort: A, B oder C. Tragen Sie Ihre endgültigen Antwortbuchstaben im Submit-Tab unter Teil 4 ein.",
    audioKey: "a2/day-08/day-08.mp3",
    audioUrl: "",
    questions: [
      { stem: "Wo bekommen die beiden Frauen einen Tisch?", options: ["A) Neben der Tür", "B) Am Fenster", "C) Auf der Terrasse"] },
      { stem: "Welche Getränke bestellt die Kundin zuerst?", options: ["A) Ein Mineralwasser und einen Apfelsaft", "B) Zwei Kaffee", "C) Einen Apfelsaft und einen Orangensaft"] },
      { stem: "Was bestellt die Kundin für sich selbst zum Essen?", options: ["A) Schnitzel mit Kartoffelsalat", "B) Spaghetti mit Tomatensoße", "C) Eine Gemüsepfanne mit Reis"] },
      { stem: "Wie möchte die Freundin ihr Schnitzel haben?", options: ["A) Ohne Salat", "B) Mit Kartoffelsalat", "C) Mit Tomatensoße"] },
      { stem: "Was macht die Kundin beim Bezahlen?", options: ["A) Sie bezahlt genau 38,50 Euro und gibt kein Trinkgeld.", "B) Sie gibt 40 Euro und lässt den Rest als Trinkgeld da.", "C) Sie bezahlt nur ihr eigenes Essen und ihre Getränke."] },
    ],
  },
  9: {
    chapter: "4.9",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie das Gespräch zwischen Lena, Max und Jonas zweimal. Lesen Sie zuerst die fünf Fragen. Wählen Sie zu jeder Frage die richtige Antwort: A, B oder C. Tragen Sie Ihre endgültigen Antwortbuchstaben im Submit-Tab unter Teil 4 ein.",
    audioKey: "a2/day-09/day-09.mp3",
    audioUrl: "",
    questions: [
      { stem: "Warum möchte Jonas im Sommer nicht nach Spanien fahren?", options: ["A) Weil er nicht schwimmen kann.", "B) Weil es dort zu kalt ist.", "C) Weil es dort sehr teuer und sehr voll ist."] },
      { stem: "Für welches Reiseziel entscheiden sich die Freunde?", options: ["A) Für einen Strand in Spanien", "B) Für den Wörthersee in Österreich", "C) Für die Berge in der Schweiz"] },
      { stem: "Wo möchten die Freunde übernachten?", options: ["A) Im Zelt auf einem Campingplatz direkt am Wasser", "B) In einem Hotel im Stadtzentrum", "C) In einer Ferienwohnung in den Bergen"] },
      { stem: "Wann möchten die Freunde verreisen?", options: ["A) Vom 10. bis zum 17. Juli", "B) Vom 12. bis zum 19. Juli", "C) Vom 15. bis zum 22. Juli"] },
      { stem: "Welche Aufgaben übernimmt Lena vor der Reise?", options: ["A) Sie bucht die Zugtickets und bringt das Zelt mit.", "B) Sie besorgt die Lebensmittel und schreibt eine Packliste.", "C) Sie bringt das Zelt und den Kocher mit."] },
    ],
  },
  10: {
    chapter: "4.10",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie das Gespräch in der Touristeninformation zweimal. Lesen Sie zuerst die fünf Fragen. Wählen Sie zu jeder Frage die richtige Antwort: A, B oder C. Tragen Sie Ihre endgültigen Antwortbuchstaben im Submit-Tab unter Teil 4 ein.",
    audioKey: "a2/day-10/day-10.mp3",
    audioUrl: "",
    questions: [
      { stem: "Welche Aktivität empfiehlt der Mitarbeiter zuerst?", options: ["A) Eine Hafenrundfahrt", "B) Einen Museumsbesuch", "C) Einen Spaziergang im Stadtpark"] },
      { stem: "Wie viel kostet die Hafenrundfahrt mit der Gästekarte?", options: ["A) 12 Euro", "B) 20 Euro", "C) 25 Euro"] },
      { stem: "Was kann die Touristin mit der Gästekarte machen?", options: ["A) Nur kostenlos ins Museum gehen", "B) Nur die Hafenrundfahrt billiger buchen", "C) Zwei Tage Bus und Bahn fahren und Rabatt im Museum bekommen"] },
      { stem: "Wann beginnt das Konzert in der Elbphilharmonie?", options: ["A) Um 18 Uhr", "B) Um 20 Uhr", "C) Um 22 Uhr"] },
      { stem: "Welches Museum empfiehlt der Mitarbeiter für morgen?", options: ["A) Das Hafenmuseum", "B) Das Kunstmuseum", "C) Das Stadtmuseum"] },
    ],
  },
  11: {
    chapter: "4.11",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie das Gespräch zwischen Anna und Tom zweimal. Lesen Sie zuerst die fünf Fragen. Wählen Sie zu jeder Frage die richtige Antwort: A, B oder C. Tragen Sie Ihre endgültigen Antwortbuchstaben im Submit-Tab unter Teil 4 ein.",
    audioKey: "a2/day-11/day-11.mp3",
    audioUrl: "",
    questions: [
      { stem: "Wie fährt Tom jeden Tag zur Arbeit?", options: ["A) Mit dem Bus", "B) Mit der U-Bahn", "C) Mit dem Auto"] },
      { stem: "Warum fährt Anna lieber mit der U-Bahn?", options: ["A) Sie ist kostenlos.", "B) Sie ist schneller und immer pünktlich.", "C) Sie findet dort immer einen Parkplatz."] },
      { stem: "Warum fährt Anna bei Regen nicht gern mit dem Fahrrad?", options: ["A) Sie hat kein Fahrrad.", "B) Das Fahrrad ist zu teuer.", "C) Bei Regen ist es nicht schön."] },
      { stem: "Wie lange dauert Annas Zugfahrt nach Berlin?", options: ["A) Zwei Stunden", "B) Vier Stunden", "C) Sechs Stunden"] },
      { stem: "Was wollen Anna und Tom morgen machen, wenn der Bus wieder zu spät kommt?", options: ["A) Die U-Bahn nehmen", "B) Mit dem Auto fahren", "C) Ein Taxi nehmen"] },
    ],
  },
  12: {
    chapter: "5.12",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie Lenas Monolog über ihren Traumberuf zweimal. Lesen Sie zuerst die fünf Fragen. Wählen Sie zu jeder Frage die richtige Antwort: A, B oder C. Tragen Sie Ihre endgültigen Antwortbuchstaben im Submit-Tab unter Teil 4 ein.",
    audioKey: "a2/day-12/day-12.mp3",
    audioUrl: "",
    questions: [
      { stem: "Was ist Lenas Traumberuf?", options: ["A) Lehrerin", "B) Tierärztin", "C) Biologin"] },
      { stem: "Welche Tiere hat Lena zu Hause?", options: ["A) Zwei Hunde und eine Katze", "B) Einen Hund und ein Pferd", "C) Einen Hund und zwei Katzen"] },
      { stem: "Wo arbeitet Lena als Tierärztin?", options: ["A) In einer Praxis", "B) Nur auf einem Bauernhof", "C) In einer Schule"] },
      { stem: "Wie lange dauert Lenas Studium?", options: ["A) Drei Jahre", "B) Vier Jahre", "C) Sechs Jahre"] },
      { stem: "Warum muss Lenas Deutsch besser werden?", options: ["A) Weil sie Deutschlehrerin werden möchte.", "B) Weil sie in Deutschland arbeiten möchte.", "C) Weil sie nach Österreich reisen möchte."] },
    ],
  },
  13: {
    chapter: "5.13",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Höre die Tipps zum Vorstellungsgespräch. Trage danach deine endgültigen Antwortbuchstaben im Submit-Bereich ein.",
    audioUrl: "https://youtu.be/kr9Rj2j-ghw",
    questions: [
      { stem: "Warum ist es wichtig, sich über das Unternehmen zu informieren?", options: ["A) Um Produkte zu kaufen", "B) Um Interesse zu zeigen", "C) Um Fragen zu vermeiden", "D) Um Kleidung auszuwählen"] },
      { stem: "Was ist ein Zeichen von Professionalität und Respekt?", options: ["A) Zu spät kommen", "B) Pünktlich sein", "C) Unpassende Kleidung", "D) Leise sprechen"] },
      { stem: "Warum sollte man dem Arbeitgeber Fragen stellen?", options: ["A) Um das Gespräch zu verlängern", "B) Um Unsicherheit zu zeigen", "C) Um Interesse zu zeigen", "D) Um die Kleidung zu bewerten"] },
      { stem: "Welche Art von E-Mail wird nach dem Gespräch empfohlen?", options: ["A) Eine Dankes-E-Mail", "B) Eine Beschwerde-E-Mail", "C) Eine Frage-E-Mail", "D) Eine Kündigungs-E-Mail"] },
      { stem: "Was sollte man während des Gesprächs tun?", options: ["A) Unvorbereitet sein", "B) Klar und deutlich sprechen", "C) Nur zuhören", "D) Unpassende Fragen stellen"] },
    ],
  },
  14: {
    chapter: "5.14",
    mode: A2_LISTENING_MODES.NONE,
    task: "",
    audioUrl: "",
    questions: [],
  },
  15: {
    chapter: "6.15",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie den Beitrag über Sportangebote in der Stadt. Achten Sie auf Kurse, Orte und Zielgruppen.",
    audioUrl: "https://youtu.be/p_OE59m0J-Y",
    questions: [
      { stem: "Was ist besonders beliebt im neuen Fitnessstudio \"Vital Plus\"?", options: ["A) Yoga-Kurse", "B) Pilates- und Aerobic-Kurse", "C) Schwimmkurse", "D) Kletterkurse"] },
      { stem: "Was bietet der Stadtpark im Sommer an?", options: ["A) Kostenlose Yoga-Kurse", "B) Pilates- und Aerobic-Kurse", "C) Schwimmkurse", "D) Fußballturniere"] },
      { stem: "Was bietet das Schwimmbad \"Aqua Fun\" an?", options: ["A) Wassergymnastik und Aqua-Zumba", "B) Kletterkurse", "C) Fußballkurse", "D) Boxtraining"] },
      { stem: "Für wen ist der neue Kletterpark geeignet?", options: ["A) Nur für Anfänger", "B) Nur für Fortgeschrittene", "C) Für Anfänger und Fortgeschrittene", "D) Nur für Kinder"] },
      { stem: "Was bietet der Sportverein \"Fitness für alle\" an?", options: ["A) Yoga-Kurse", "B) Volleyball und Basketball", "C) Schwimmkurse", "D) Tennis und Golf"] },
    ],
  },
  16: {
    chapter: "6.16",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie den Text über gesunde Ernährung, Bewegung, Fitness und regelmäßige Arztbesuche. Wählen Sie jeweils die richtige Antwort.",
    audioUrl: "https://drive.google.com/file/d/1xexwu1sM-Prp_2iyhBbY7UP-91gJ1S5G/view?usp=sharing",
    questions: [
      { stem: "Was wird als ein einfacher Anfang für eine gesunde Ernährung empfohlen?", options: ["A) Mehr Fleisch essen", "B) Mehr Obst und Gemüse essen", "C) Mehr Fast Food essen"] },
      { stem: "Wie lange sollte man täglich mindestens gehen oder sich bewegen?", options: ["A) 10 Minuten", "B) 20 Minuten", "C) 30 Minuten"] },
      { stem: "Was kann motivierend sein, um fit zu bleiben?", options: ["A) Der Besuch eines Fitnessstudios", "B) Mehr zu schlafen", "C) Mehr Fernsehen schauen"] },
      { stem: "Warum ist der regelmäßige Besuch beim Arzt wichtig?", options: ["A) Um neue Rezepte zu bekommen", "B) Um Krankheiten frühzeitig zu erkennen", "C) Um Medikamente zu kaufen"] },
      { stem: "Welche Sportarten werden im Text als motivierend erwähnt?", options: ["A) Yoga und Pilates", "B) Schwimmen und Laufen", "C) Tanzen und Radfahren"] },
    ],
  },
  17: {
    chapter: "6.17",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Höre das Gespräch in der Apotheke. Trage danach deine endgültigen Antwortbuchstaben im Submit-Bereich ein.",
    audioUrl: "https://youtu.be/jgl__L4L9kE",
    questions: [
      { stem: "Warum ging Anna in die Apotheke?", options: ["A) Um Medikamente gegen Husten zu kaufen", "B) Wegen Kopfschmerzen", "C) Um eine Creme zu kaufen", "D) Um Proben zu holen"] },
      { stem: "Was empfahl die Apothekerin gegen Kopfschmerzen?", options: ["A) Aspirin", "B) Paracetamol", "C) Ibuprofen", "D) Nasenspray"] },
      { stem: "Welches Problem hatte Anna noch?", options: ["A) Halsschmerzen", "B) Trockene Haut", "C) Schnupfen", "D) Fieber"] },
      { stem: "Wie reagierte Anna auf die Empfehlungen der Apothekerin?", options: ["A) Sie war skeptisch", "B) Sie war erleichtert", "C) Sie war verwirrt", "D) Sie war unzufrieden"] },
      { stem: "Was bekam Anna zusätzlich zu den Medikamenten?", options: ["A) Ein Rezept", "B) Proben von Produkten", "C) Eine Broschüre", "D) Ein neues Medikament"] },
    ],
  },
  18: {
    chapter: "7.18",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie das Gespräch über einen Anruf bei der Bank. Achten Sie auf Dokumente, Termin, Dauer des Gesprächs, Kontomodelle und Online-Formulare.",
    audioUrl: "https://youtu.be/cHKVQOLWv7c",
    questions: [
      { stem: "Welche Dokumente benötigen Sie, um ein Konto zu eröffnen?", options: ["A) Nur einen Reisepass", "B) Reisepass, Meldebescheinigung, Einkommensnachweis", "C) Nur einen Einkommensnachweis", "D) Keine Dokumente"] },
      { stem: "Wie lange dauert das Beratungsgespräch?", options: ["A) 30 Minuten", "B) Eine Stunde", "C) Zwei Stunden", "D) 15 Minuten"] },
      { stem: "Wie viele Kontomodelle bietet die Bank an?", options: ["A) Zwei", "B) Drei", "C) Vier", "D) Fünf"] },
      { stem: "Welches Konto ist kostenlos?", options: ["A) Basiskonto", "B) Konto mit zusätzlichen Dienstleistungen", "C) Premium-Konto", "D) Geschäftskonto"] },
      { stem: "Was können Sie tun, um Zeit zu sparen?", options: ["A) Die Formulare in der Bankfiliale ausfüllen", "B) Ohne Unterlagen kommen", "C) Einen Termin absagen", "D) Die Formulare vor dem Termin online ausfüllen"] },
    ],
  },
  19: {
    chapter: "7.19",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie den Text ‚Online Shopping und Konsumverhalten‘ und wählen Sie jeweils die richtige Antwort.",
    audioUrl: "https://drive.google.com/file/d/1OsT5j6Y7a-rMdB0HlRJJ98gTgSvxm_LB/view?usp=sharing",
    questions: [
      { stem: "Was bietet Online-Shopping den Verbrauchern?", options: ["A) Hohe Preise", "B) Bequeme Möglichkeit, Produkte nach Hause zu bestellen", "C) Weniger Auswahl"] },
      { stem: "Was ist ein Nachteil des Online-Shoppings?", options: ["A) Geringe Anzahl von Rücksendungen", "B) Hohe Anzahl von Rücksendungen und Umweltbelastung", "C) Niedrige Preise"] },
      { stem: "Worauf müssen Verbraucher beim Online-Kauf achten?", options: ["A) Auf vertrauenswürdige Websites und Schutz persönlicher Daten", "B) Auf hohe Preise", "C) Auf schnelle Lieferung"] },
      { stem: "Wo sollten die Produkte, die online gekauft werden, herkommen?", options: ["A) Aus nachhaltigen Quellen und fairen Bedingungen", "B) Aus dem Ausland", "C) Aus teuren Geschäften"] },
      { stem: "Wie hat das Internet den Konsum verändert?", options: ["A) Es hat den Konsum eingeschränkt", "B) Es hat den Konsum revolutioniert und neue Möglichkeiten geschaffen", "C) Es hat keine großen Veränderungen gebracht"] },
    ],
  },
  20: {
    chapter: "7.20",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie die Reklamationsdialoge. Achten Sie auf das Problem, den Kaufnachweis und die angebotene Lösung.",
    audioUrl: "https://youtu.be/pH1X3E7vOao",
    questions: [
      { stem: "Warum bringt Laura den Wasserkocher zurück?", options: ["A) Er ist zu teuer", "B) Er funktioniert nicht", "C) Er ist zu groß", "D) Er gefällt ihr nicht"] },
      { stem: "Was bringt Laura als Kaufnachweis mit?", options: ["A) Eine Rechnung vom Arzt", "B) Eine Kundenkarte", "C) Den Kassenbon", "D) Einen Brief"] },
      { stem: "Was bietet der Verkäufer Laura an?", options: ["A) Einen Rabatt", "B) Eine Reparatur in einem Jahr", "C) Einen Umtausch oder eine Rückerstattung", "D) Einen Gutschein für Essen"] },
      { stem: "Welches Problem gibt es mit der Jacke?", options: ["A) Sie hat die falsche Farbe", "B) Sie ist beschädigt", "C) Sie hat die falsche Größe", "D) Sie kommt zu spät"] },
      { stem: "Was bittet Laura den Kundenservice zu schicken?", options: ["A) Einen Retourenschein", "B) Eine neue Rechnung", "C) Einen Katalog", "D) Einen Rabattcode"] },
    ],
  },
  21: {
    chapter: "8.21",
    mode: A2_LISTENING_MODES.SELF_CHECK,
    task: "Dies ist eine separate Goethe-Hören-Übung für Teil 4. Hören Sie den Test aufmerksam und kontrollieren Sie Ihre Antworten anschließend mit der Lösung im Video. Falowen Radio gehört zur Vorbereitung vor dem Workbook und ist nicht Teil 4.",
    audioUrl: "https://youtu.be/Qg0tQFveI0M",
    questions: [],
  },
  22: {
    chapter: "8.22",
    mode: A2_LISTENING_MODES.SELF_CHECK,
    task: "Öffnen Sie die separate Goethe-Hören-Übung für Teil 4. Falowen Radio gehört zur Vorbereitung vor dem Workbook und ist nicht die Teil-4-Aufgabe.",
    audioUrl: "https://youtu.be/wK9JOG5lhdc?list=PLtjMpIkGWMzD1BkOt9Jx9RhUk2e439CNZ",
    questions: [],
  },
  23: {
    chapter: "9.23",
    mode: A2_LISTENING_MODES.SELF_CHECK,
    task: "Öffnen Sie die separate Goethe-Hören-Übung für Teil 4. Falowen Radio gehört zur Vorbereitung vor dem Workbook und ist nicht die Teil-4-Aufgabe.",
    audioUrl: "https://youtu.be/6DA1dYfqEZo?list=PLg78ckjpHfZzy9rvr_CmY73BLJiPTiaXL",
    questions: [],
  },
  24: {
    chapter: "9.24",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie den Beitrag über Urlaubsplanung. Achten Sie auf Reiseziel, Hotel, Anreise, Aktivitäten und Vorbereitung und beantworten Sie anschließend die fünf Fragen.",
    audioKey: "a2/day-24/day-24.mp3",
    audioUrl: "",
    questions: [
      { stem: "Für welches Reiseziel entscheiden sich Lisa und Daniel?", options: ["A) Österreich", "B) Italien", "C) Deutschland", "D) Spanien"] },
      { stem: "Was ist ihnen beim Hotel wichtig?", options: ["A) Ein großes Schwimmbad und ein Fitnessstudio", "B) Gutes Frühstück, ein ruhiges Zimmer und die Nähe zum Strand", "C) Nur ein sehr niedriger Preis", "D) Ein Hotel direkt am Bahnhof"] },
      { stem: "Warum entscheiden sie sich für den Zug?", options: ["A) Weil die Autofahrt sehr lang wäre", "B) Weil Flüge ausverkauft sind", "C) Weil sie kein Auto haben", "D) Weil das Hotel nur Zugreisende akzeptiert"] },
      { stem: "Was möchten sie bei ihrem Tagesausflug machen?", options: ["A) Nur einkaufen", "B) Eine Kirche besichtigen, durch die Altstadt spazieren und in einem Restaurant essen", "C) Den ganzen Tag am Strand bleiben", "D) Eine Bergtour machen"] },
      { stem: "Was kontrollieren Lisa und Daniel kurz vor der Reise noch einmal?", options: ["A) Nur die Packliste", "B) Die Abfahrtszeit, die Wettervorhersage und ihre Reservierung", "C) Nur die Hotelbewertungen", "D) Nur die Zugtickets"] },
    ],
  },
  25: {
    chapter: "9.25",
    mode: A2_LISTENING_MODES.NONE,
    task: "",
    audioUrl: "",
    questions: [],
  },
  26: {
    chapter: "10.26",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie den Beitrag über Gefühle in verschiedenen Situationen. Achten Sie darauf, warum Anna, David und Mariam bestimmte Gefühle haben, und beantworten Sie anschließend die fünf Fragen.",
    audioKey: "a2/day-26/day-26.mp3",
    audioUrl: "",
    questions: [
      { stem: "Warum ist Anna vor der Prüfung nervös?", options: ["A) Weil sie nichts gelernt hat", "B) Weil sie immer wieder an die Aufgaben denkt", "C) Weil die Prüfung abgesagt wurde", "D) Weil sie zu spät gekommen ist"] },
      { stem: "Wie fühlt sich Anna, als sie erfährt, dass sie bestanden hat?", options: ["A) Enttäuscht und traurig", "B) Wütend und ungeduldig", "C) Glücklich und erleichtert", "D) Überrascht und nervös"] },
      { stem: "Warum ist David enttäuscht?", options: ["A) Weil er die neue Stelle nicht bekommen hat", "B) Weil seine Freundin keine Zeit hat", "C) Weil er eine Prüfung nicht bestanden hat", "D) Weil er seine Arbeit verloren hat"] },
      { stem: "Wer macht David nach der Absage Mut?", options: ["A) Seine Schwester", "B) Sein Chef", "C) Seine Freundin", "D) Seine Mutter"] },
      { stem: "Was haben Mariams Freunde für sie organisiert?", options: ["A) Eine Reise", "B) Eine Überraschungsparty", "C) Ein Bewerbungsgespräch", "D) Eine Prüfung"] },
    ],
  },
  27: {
    chapter: "10.27",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie den Beitrag über digitale Kommunikation. Achten Sie auf Lisas Kontakt mit ihrer Schwester, Markus bei der Arbeit und Sarahs Umgang mit sozialen Medien und beantworten Sie anschließend die fünf Fragen.",
    audioKey: "a2/day-27/day-27.mp3",
    audioUrl: "",
    questions: [
      { stem: "Warum findet Lisa digitale Kommunikation besonders praktisch?", options: ["A) Weil ihre Schwester in Österreich lebt", "B) Weil sie keine persönlichen Treffen mag", "C) Weil sie nur E-Mails schreibt", "D) Weil sie in Frankfurt arbeitet"] },
      { stem: "Was macht Markus mit seinem Team, wenn ein wichtiges Thema besprochen werden muss?", options: ["A) Sie schreiben nur kurze Nachrichten", "B) Sie machen eine Videokonferenz", "C) Sie treffen sich immer im Büro", "D) Sie benutzen soziale Medien"] },
      { stem: "Warum schaltet Markus nach der Arbeit oft die Benachrichtigungen aus?", options: ["A) Weil sein Handy kaputt ist", "B) Weil er am Abend nicht ständig auf sein Handy schauen möchte", "C) Weil er keine Kollegen hat", "D) Weil er keine Nachrichten lesen kann"] },
      { stem: "Warum postet Sarah heute seltener Fotos von sich selbst?", options: ["A) Weil sie soziale Medien nicht mehr benutzt", "B) Weil ihr Datenschutz wichtiger geworden ist", "C) Weil sie keine Reiseprofile mehr folgt", "D) Weil sie nur noch Videos teilt"] },
      { stem: "Welcher Nachteil digitaler Kommunikation wird im Text genannt?", options: ["A) Nachrichten kommen immer zu spät", "B) Man kann keine Fotos teilen", "C) Missverständnisse können leichter entstehen", "D) Videotelefonie funktioniert nur im Ausland"] },
    ],
  },
  28: {
    chapter: "10.28",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie den Beitrag zu Zukunftsplänen. Achten Sie auf Annas, Davids und Mariams berufliche und persönliche Ziele und beantworten Sie anschließend die fünf Fragen.",
    audioKey: "a2/day-28/day-28.mp3",
    audioUrl: "",
    questions: [
      {
        stem: "Warum möchte Anna eine Weiterbildung im Bereich Tourismus machen?",
        options: [
          "A) Weil sie in eine andere Stadt ziehen möchte",
          "B) Weil sie später mehr Verantwortung übernehmen möchte",
          "C) Weil sie nicht mehr im Hotel arbeiten möchte",
          "D) Weil sie Spanisch lernen möchte",
        ],
      },
      {
        stem: "Was ist Annas berufliches Ziel in ungefähr drei Jahren?",
        options: [
          "A) Eine Sprachschule eröffnen",
          "B) In der Schweiz studieren",
          "C) Hotelmanagerin werden",
          "D) Verkäuferin werden",
        ],
      },
      {
        stem: "Warum möchte David nächstes Jahr einen Kurs in Webentwicklung beginnen?",
        options: [
          "A) Weil er seinen Beruf wechseln möchte und sich für Computer interessiert",
          "B) Weil seine Freundin in einer IT-Firma arbeitet",
          "C) Weil er nach Österreich ziehen möchte",
          "D) Weil er Hotelmanager werden möchte",
        ],
      },
      {
        stem: "Wofür spart David jeden Monat Geld?",
        options: [
          "A) Für eine Reise nach Spanien",
          "B) Für eine Hochzeit im nächsten Jahr",
          "C) Für eine größere Wohnung, die er in zwei oder drei Jahren mieten möchte",
          "D) Für ein eigenes Unternehmen",
        ],
      },
      {
        stem: "Was plant Mariam für nächstes Jahr?",
        options: [
          "A) Eine zweiwöchige Reise nach Spanien und ihr Spanisch zu verbessern",
          "B) Eine Ausbildung im Tourismus",
          "C) Mit ihrem Freund zusammenzuziehen",
          "D) In der Schweiz zu arbeiten",
        ],
      },
    ],
  },
};

export const getA2ListeningTask = (day) => A2_LISTENING_TASKS[Number(day)] || null;

export const A2_LISTENING_DAYS = Object.freeze(
  Object.keys(A2_LISTENING_TASKS).map(Number).sort((a, b) => a - b),
);

export const A2_GRADED_LISTENING_DAYS = Object.freeze(
  A2_LISTENING_DAYS.filter((day) => A2_LISTENING_TASKS[day].mode === A2_LISTENING_MODES.GRADED),
);

export const A2_SELF_CHECK_LISTENING_DAYS = Object.freeze(
  A2_LISTENING_DAYS.filter((day) => A2_LISTENING_TASKS[day].mode === A2_LISTENING_MODES.SELF_CHECK),
);

export const A2_NO_LISTENING_DAYS = Object.freeze(
  A2_LISTENING_DAYS.filter((day) => A2_LISTENING_TASKS[day].mode === A2_LISTENING_MODES.NONE),
);

export default A2_LISTENING_TASKS;
