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
    task: "Sieh dir das eingebettete Video über die Wohnungsanzeigen an. Vergleiche die 2-Zimmer-Wohnung und die 3-Zimmer-Wohnung. Trage anschließend deine endgültigen Antwortbuchstaben im Submit-Bereich ein.",
    audioUrl: "https://youtu.be/WuA8Xabn-Uw",
    questions: [
      { stem: "Welche Wohnung ist 70 Quadratmeter groß?", options: ["a) Die 2-Zimmer-Wohnung", "b) Die 3-Zimmer-Wohnung"] },
      { stem: "Welche Wohnung hat einen Balkon?", options: ["a) Die 2-Zimmer-Wohnung", "b) Die 3-Zimmer-Wohnung"] },
      { stem: "Wie hoch sind die Nebenkosten für die 3-Zimmer-Wohnung?", options: ["a) 150 Euro pro Monat", "b) 200 Euro pro Monat"] },
      { stem: "Welche Wohnung erlaubt Haustiere?", options: ["a) Die 2-Zimmer-Wohnung", "b) Die 3-Zimmer-Wohnung"] },
      { stem: "Welche Wohnung ist ab dem 1. August verfügbar?", options: ["a) Die 2-Zimmer-Wohnung", "b) Die 3-Zimmer-Wohnung"] },
    ],
  },
  7: {
    chapter: "3.7",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Sieh dir das eingebettete Video zur Wohnungsbeschreibung an. Achte auf Stockwerk, Größe, Zimmer, Ausstattung und Nebenkosten. Submitte deine Antwortbuchstaben im Submit-Tab.",
    audioUrl: "https://youtu.be/hM1iPUq1Spg",
    questions: [
      { stem: "In welchem Stockwerk befindet sich die Wohnung?", options: ["a) Im ersten Stock", "b) Im zweiten Stock", "c) Im dritten Stock"] },
      { stem: "Wie groß ist die Wohnung?", options: ["a) 70 Quadratmeter", "b) 75 Quadratmeter", "c) 80 Quadratmeter"] },
      { stem: "Wie viele Zimmer hat die Wohnung?", options: ["a) Zwei", "b) Drei", "c) Vier"] },
      { stem: "Was gehört zur Wohnung?", options: ["a) Ein Balkon", "b) Ein Garten", "c) Eine Garage"] },
      { stem: "Wie hoch sind die Nebenkosten?", options: ["a) 100 Euro", "b) 150 Euro", "c) 200 Euro"] },
    ],
  },
  8: {
    chapter: "3.8",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Sieh dir das eingebettete Video zum Thema Rezepte und Essen an. Achte auf den Tag, die Zutaten, den Ort und das Gericht. Submitte deine Antwortbuchstaben im Submit-Tab.",
    audioUrl: "https://youtu.be/mYh4DRaaWSY",
    questions: [
      { stem: "Wann gehen die Personen einkaufen oder kochen zusammen?", options: ["a) Montag", "b) Samstag", "c) Mittwoch"] },
      { stem: "Was kaufen sie?", options: ["a) Fleisch und Fisch", "b) Obst und Gemüse", "c) Brot und Käse"] },
      { stem: "Welche Zutat wird im Hörtext genannt?", options: ["a) Reis", "b) Mozzarella", "c) Kartoffeln"] },
      { stem: "Was machen sie danach?", options: ["a) Sie gehen ins Kino", "b) Sie gehen in ein Café", "c) Sie gehen in die Schule"] },
      { stem: "Welches Gericht wird genannt?", options: ["a) Gemüselasagne", "b) Bratwurst mit Sauerkraut", "c) Fischsuppe"] },
    ],
  },
  9: {
    chapter: "4.9",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Sieh dir das eingebettete Video über Annas letzten Sommerurlaub an. Achte auf das Reiseziel, die Dauer, besondere Orte, Aktivitäten und Annas Wunsch. Submitte deine Antwortbuchstaben im Submit-Tab.",
    audioUrl: "https://youtu.be/Q6PjXP6Ccik",
    questions: [
      { stem: "Wohin ist Anna im letzten Sommerurlaub gereist?", options: ["a) Italien", "b) Griechenland", "c) Spanien"] },
      { stem: "Wie lange blieb Anna auf Kreta?", options: ["a) Eine Woche", "b) Zwei Wochen", "c) Drei Tage"] },
      { stem: "Was hat Anna besonders gut gefallen?", options: ["a) Die Altstadt von Chania", "b) Der Strand von Elafonissi", "c) Die Berge"] },
      { stem: "Was haben Anna und ihre Freunde am letzten Tag gemacht?", options: ["a) Eine Wanderung", "b) Eine Bootstour", "c) Einen Museumsbesuch"] },
      { stem: "Was hofft Anna bald wieder zu tun?", options: ["a) Nach Kreta zu reisen", "b) Nach Italien zu reisen", "c) Nach Spanien zu reisen"] },
    ],
  },
  10: {
    chapter: "4.10",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Höre den Beitrag über das Oktoberfest. Achte auf Ort, Dauer, Essen, Kleidung und Aktivitäten. Submitte deine Antwortbuchstaben im Submit-Tab.",
    audioUrl: "https://youtu.be/yOfTCQDn_JM",
    questions: [
      { stem: "Wo findet das Oktoberfest statt?", options: ["a) Berlin", "b) Hamburg", "c) München", "d) Frankfurt"] },
      { stem: "Wie lange dauert das Oktoberfest?", options: ["a) Eine Woche", "b) Zwei Wochen", "c) Drei Wochen", "d) Vier Wochen"] },
      { stem: "Welche traditionellen Gerichte werden auf dem Oktoberfest serviert?", options: ["a) Pizza und Pasta", "b) Brezeln, Bratwurst und Schweinebraten", "c) Sushi und Ramen", "d) Tacos und Burritos"] },
      { stem: "Welche Kleidung tragen viele Menschen auf dem Oktoberfest?", options: ["a) Anzüge und Kleider", "b) Lederhosen und Dirndl", "c) Jeans und T-Shirts", "d) Bademode"] },
      { stem: "Was gibt es neben Essen und Trinken noch auf dem Oktoberfest?", options: ["a) Konzerte und Opern", "b) Fahrgeschäfte und Spiele", "c) Sportveranstaltungen", "d) Filmvorführungen"] },
    ],
  },
  11: {
    chapter: "4.11",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Höre das Gespräch bei der Autovermietung und beantworte die Fragen. Submitte deine Antwortbuchstaben im Submit-Tab.",
    audioUrl: "https://youtu.be/cpiYNbbIvr4",
    questions: [
      { stem: "Wohin möchte Thomas fahren?", options: ["A) Zum Strand", "B) In die Berge", "C) In die Stadt", "D) Zum Flughafen"] },
      { stem: "Welches Auto wählt Thomas?", options: ["A) Ein kleines Auto", "B) Ein mittelgroßes Auto", "C) Ein großes Auto", "D) Ein Elektroauto"] },
      { stem: "Wie viel kostet das Auto pro Tag?", options: ["A) 40 Euro", "B) 50 Euro", "C) 60 Euro", "D) 70 Euro"] },
      { stem: "Welche Dokumente zeigt Thomas?", options: ["A) Führerschein und Personalausweis", "B) Führerschein und Reisepass", "C) Führerschein und Kreditkarte", "D) Reisepass und Mietvertrag"] },
      { stem: "Was überprüft Thomas vor der Fahrt?", options: ["A) Den Benzinstand", "B) Das Auto auf mögliche Schäden", "C) Das Navigationssystem", "D) Die Klimaanlage"] },
    ],
  },
  12: {
    chapter: "5.12",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Höre den Beitrag über Dr. Müllers Arbeitstag. Trage danach deine endgültigen Antwortbuchstaben im Submit-Bereich ein.",
    audioUrl: "https://youtu.be/VGzHSjn3O-A",
    questions: [
      { stem: "Wann beginnt Dr. Müllers Arbeitstag?", options: ["A) Um 5:00 Uhr", "B) Um 6:00 Uhr", "C) Um 7:00 Uhr", "D) Um 8:00 Uhr"] },
      { stem: "Was macht Dr. Müller um 7:00 Uhr?", options: ["A) Liest die Patientenakten", "B) Bereitet sich auf die Visite vor", "C) Beginnt die Visite auf der Station", "D) Hat eine Besprechung mit Kollegen"] },
      { stem: "Wann beginnt die Sprechstunde?", options: ["A) Um 8:00 Uhr", "B) Um 9:00 Uhr", "C) Um 10:00 Uhr", "D) Um 11:00 Uhr"] },
      { stem: "Was macht Dr. Müller oft während seiner Mittagspause?", options: ["A) Isst in Ruhe", "B) Führt wichtige Telefonate", "C) Geht spazieren", "D) Liest ein Buch"] },
      { stem: "Wann endet Dr. Müllers Arbeitstag selten?", options: ["A) Vor 16:00 Uhr", "B) Vor 17:00 Uhr", "C) Vor 18:00 Uhr", "D) Vor 19:00 Uhr"] },
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
    mode: A2_LISTENING_MODES.SELF_CHECK,
    task: "Öffnen Sie die separate Goethe-Hören-Übung für Teil 4. Falowen Radio gehört zur Vorbereitung vor dem Workbook und ist nicht die Teil-4-Aufgabe.",
    audioUrl: "https://youtu.be/iPScKV6JWaA",
    questions: [],
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
    mode: A2_LISTENING_MODES.SELF_CHECK,
    task: "Öffnen Sie die separate Goethe-Hören-Übung für Teil 4. Falowen Radio gehört zur Vorbereitung vor dem Workbook und ist nicht die Teil-4-Aufgabe.",
    audioUrl: "https://youtu.be/JEJZypJfrD8?list=PLZ6nUCSTx9pKcy_IKo10vFQIlAhwFpEr5",
    questions: [],
  },
  27: {
    chapter: "10.27",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Sieh dir den Beitrag zur digitalen Kommunikation an und beantworte danach die vier Fragen.",
    audioUrl: "https://youtu.be/JEJZypJfrD8?list=PLZ6nUCSTx9pKcy_IKo10vFQIlAhwFpEr5",
    questions: [
      { stem: "Was hat Miriam gestern verloren?", options: ["A) Ihren Laptop", "B) Ihr Handy", "C) Ihre Tasche", "D) Ihren Ausweis"] },
      { stem: "Wo möchte Miriam ein neues Handy bestellen?", options: ["A) Im Supermarkt", "B) Auf www.jumiagh.com", "C) Im Rathaus", "D) In der Bibliothek"] },
      { stem: "Was fragt sie beim Kundenservice?", options: ["A) Nur nach der Farbe", "B) Nach Modell-Empfehlung sowie Bestellung und Lieferung", "C) Nur nach Rabatten", "D) Nach einem Auslandstarif"] },
      { stem: "Was ist ihr wichtig beim neuen Handy?", options: ["A) Gute Kamera und lange Akkulaufzeit", "B) Sehr großes Gewicht", "C) Nur Spiele", "D) Keine Internetfunktion"] },
    ],
  },
  28: {
    chapter: "10.28",
    mode: A2_LISTENING_MODES.GRADED,
    task: "Hören Sie den Beitrag zu Zukunftsplänen. Achten Sie auf Ziele, Zeitangaben und Gründe und beantworten Sie anschließend die Fragen.",
    audioUrl: "https://youtu.be/Teuu287XY_M?list=PLZ6nUCSTx9pKcy_IKo10vFQIlAhwFpEr5",
    questions: [
      { stem: "Worum geht es im Beitrag?", options: ["A) Um Zukunftspläne und Ziele", "B) Nur um Essen", "C) Um eine Reklamation", "D) Nur um das Wetter"] },
      { stem: "Welche Formulierung kann man für Zukunftspläne benutzen?", options: ["A) Ich möchte ...", "B) Gestern habe ich ...", "C) Bitte öffnen Sie ...", "D) Es tut mir leid ..."] },
      { stem: "Was solltest du beim Sprechen über die Zukunft erklären?", options: ["A) Deine Ziele und Gründe", "B) Nur deinen Namen", "C) Nur das Datum", "D) Keine persönlichen Pläne"] },
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
