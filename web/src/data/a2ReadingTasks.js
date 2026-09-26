export const A2_READING_TASKS = {
  1: {
    chapter: "1.1",
    format: "Kurze Nachricht",
    title: "Neu im Büro",
    strategy: "Lies zuerst die Fragen. Suche dann im Text nach Namen, Uhrzeiten, Orten und Gründen.",
    text: `Hallo Ben,

ich bin seit Montag neu bei der Firma Keller. Meine Kollegin Jana sitzt neben mir und hilft mir oft. In der Mittagspause essen wir meistens in der Kantine. Am Mittwoch habe ich nach der Arbeit einen Deutschkurs. Am Freitag trinken einige Kollegen nach Feierabend noch einen Kaffee zusammen. Jana hat mich eingeladen. Ich freue mich, weil ich die anderen Kollegen besser kennenlernen möchte.

Viele Grüße
Mira`,
    questions: [
      { stem: "Seit wann arbeitet Mira bei der Firma Keller?", options: ["A) Seit Montag", "B) Seit Mittwoch", "C) Seit Freitag", "D) Seit einem Monat"] },
      { stem: "Wer hilft Mira oft?", options: ["A) Ben", "B) Jana", "C) Der Chef", "D) Der Deutschlehrer"] },
      { stem: "Wo isst Mira meistens in der Mittagspause?", options: ["A) Zu Hause", "B) Im Café", "C) In der Kantine", "D) Im Park"] },
      { stem: "Was macht Mira am Mittwoch nach der Arbeit?", options: ["A) Sie trifft Kollegen.", "B) Sie besucht einen Deutschkurs.", "C) Sie arbeitet länger.", "D) Sie geht einkaufen."] },
      { stem: "Warum freut sich Mira auf Freitag?", options: ["A) Sie hat frei.", "B) Sie bekommt Besuch.", "C) Sie möchte die Kollegen besser kennenlernen.", "D) Sie fährt nach Hause."] },
    ],
  },
  2: {
    chapter: "1.2",
    format: "Personenprofile",
    title: "Lara und David",
    strategy: "Achte auf Aussehen, Charakter, Beruf und Interessen. Nicht jedes Detail steht im gleichen Satz.",
    text: `Lara ist 29 Jahre alt und arbeitet in einem Hotel. Sie ist mittelgroß und hat kurze dunkle Haare. Ihre Freunde sagen, dass sie ruhig und sehr zuverlässig ist. In ihrer Freizeit liest sie gern und geht am Wochenende wandern.

David ist 31 und arbeitet als Krankenpfleger. Er ist groß, trägt eine Brille und hat lockige Haare. Er spricht gern mit Menschen und ist sehr offen. Nach der Arbeit spielt er oft Basketball. Am Sonntag kocht er gern für seine Familie.`,
    questions: [
      { stem: "Wo arbeitet Lara?", options: ["A) In einem Hotel", "B) In einem Krankenhaus", "C) In einer Schule", "D) In einem Restaurant"] },
      { stem: "Wie ist Lara laut ihren Freunden?", options: ["A) Laut und unpünktlich", "B) Ruhig und zuverlässig", "C) Schüchtern und unfreundlich", "D) Lustig und chaotisch"] },
      { stem: "Was trägt David?", options: ["A) Einen Hut", "B) Eine Brille", "C) Einen Bart", "D) Eine Uniform in der Freizeit"] },
      { stem: "Welche Freizeitaktivität macht David oft?", options: ["A) Wandern", "B) Lesen", "C) Basketball spielen", "D) Schwimmen"] },
      { stem: "Was haben Lara und David gemeinsam?", options: ["A) Beide arbeiten im Hotel.", "B) Beide kochen jeden Sonntag.", "C) Beide haben kurze dunkle Haare.", "D) Beide haben Freizeitaktivitäten nach oder neben der Arbeit."] },
    ],
  },
  3: {
    chapter: "1.3",
    format: "Vergleich",
    title: "Zwei Sprachkurse",
    strategy: "Vergleiche Preis, Zeit, Gruppengröße und Weg. Wörter wie billiger, länger, näher und kleiner sind wichtig.",
    text: `Nina möchte einen Deutschkurs besuchen. Sprachschule A kostet 95 Euro im Monat. Der Unterricht ist dienstags und donnerstags von 18:00 bis 19:30 Uhr. In einer Gruppe sind höchstens 12 Personen. Von Ninas Wohnung braucht sie 20 Minuten mit dem Bus.

Sprachschule B kostet 120 Euro im Monat. Der Unterricht ist montags und mittwochs von 18:00 bis 20:00 Uhr. In einer Gruppe sind höchstens 8 Personen. Die Schule ist nur zehn Minuten zu Fuß von Ninas Wohnung entfernt.`,
    questions: [
      { stem: "Welche Sprachschule ist billiger?", options: ["A) Sprachschule A", "B) Sprachschule B", "C) Beide kosten gleich viel.", "D) Das steht nicht im Text."] },
      { stem: "Wo dauert eine Unterrichtsstunde länger?", options: ["A) In Sprachschule A", "B) In Sprachschule B", "C) In beiden gleich lang", "D) Nur am Donnerstag"] },
      { stem: "Welche Schule hat kleinere Gruppen?", options: ["A) Sprachschule A", "B) Sprachschule B", "C) Beide haben 12 Personen.", "D) Keine der Schulen"] },
      { stem: "Welche Schule liegt näher an Ninas Wohnung?", options: ["A) Sprachschule A", "B) Sprachschule B", "C) Beide sind gleich weit.", "D) Das kann man nicht wissen."] },
      { stem: "Wann hat Sprachschule A Unterricht?", options: ["A) Montag und Mittwoch", "B) Dienstag und Donnerstag", "C) Freitag und Samstag", "D) Nur am Dienstag"] },
    ],
  },
  4: {
    chapter: "2.4",
    format: "Chat",
    title: "Treffen am Samstag",
    strategy: "Bei Chats stehen Planänderungen oft in späteren Nachrichten. Lies deshalb bis zum Ende.",
    text: `Lea: Treffen wir uns am Samstag um 15 Uhr im Stadtpark?
Omar: Gerne, aber es soll am Nachmittag regnen.
Lea: Dann vielleicht im Café Central?
Omar: Gute Idee. Das Café ist direkt neben der U-Bahn-Station Rathaus.
Lea: Super. Ich komme mit der U-Bahn. Können wir uns um 15:30 Uhr treffen? Ich arbeite bis 14:45 Uhr.
Omar: Ja. Ich reserviere einen Tisch für uns. Bis Samstag!`,
    questions: [
      { stem: "Wo wollten Lea und Omar sich zuerst treffen?", options: ["A) Im Stadtpark", "B) Im Café Central", "C) Am Rathaus", "D) Bei Omar"] },
      { stem: "Warum ändern sie den Treffpunkt?", options: ["A) Das Café ist geschlossen.", "B) Omar muss arbeiten.", "C) Es soll regnen.", "D) Lea hat kein Geld."] },
      { stem: "Wo liegt das Café Central?", options: ["A) Im Stadtpark", "B) Neben der U-Bahn-Station Rathaus", "C) Am Bahnhof", "D) Neben Leas Arbeit"] },
      { stem: "Wann treffen sie sich am Ende?", options: ["A) Um 14:45 Uhr", "B) Um 15:00 Uhr", "C) Um 15:30 Uhr", "D) Um 16:00 Uhr"] },
      { stem: "Was macht Omar noch?", options: ["A) Er kauft Fahrkarten.", "B) Er reserviert einen Tisch.", "C) Er holt Lea ab.", "D) Er bringt Essen mit."] },
    ],
  },
  5: {
    chapter: "2.5",
    format: "Freizeitprogramm",
    title: "Samstag im Freizeitzentrum",
    strategy: "Scanne zuerst Uhrzeiten, Preise und Orte. Danach liest du nur die passenden Angebote genauer.",
    text: `Freizeitzentrum West – Samstag

09:00–10:00 Yoga im Raum 2 – 6 Euro
10:30–12:00 Fotokurs im Raum 5 – 12 Euro
13:00–15:00 Fahrradtour – Treffpunkt vor dem Eingang – kostenlos
15:30–17:00 Kochkurs „Schnelle Gerichte“ – Küche – 15 Euro
18:00–20:00 Filmabend im Saal – 5 Euro

Für die Fahrradtour und den Kochkurs muss man sich vorher anmelden.`,
    questions: [
      { stem: "Welche Aktivität ist kostenlos?", options: ["A) Yoga", "B) Fotokurs", "C) Fahrradtour", "D) Filmabend"] },
      { stem: "Wo findet der Fotokurs statt?", options: ["A) Im Raum 2", "B) Im Raum 5", "C) In der Küche", "D) Im Saal"] },
      { stem: "Was beginnt um 15:30 Uhr?", options: ["A) Der Filmabend", "B) Die Fahrradtour", "C) Der Kochkurs", "D) Yoga"] },
      { stem: "Wofür muss man sich vorher anmelden?", options: ["A) Für Yoga und Filmabend", "B) Für Fotokurs und Yoga", "C) Für Fahrradtour und Kochkurs", "D) Nur für den Filmabend"] },
      { stem: "Wie viel kostet der Filmabend?", options: ["A) 5 Euro", "B) 6 Euro", "C) 12 Euro", "D) 15 Euro"] },
    ],
  },
  6: {
    chapter: "3.6",
    format: "Wohnungsbeschreibung",
    title: "Mein neues Zimmer",
    strategy: "Achte bei Ortsangaben auf Präpositionen wie neben, vor, an und zwischen.",
    text: `Seit zwei Wochen wohne ich in einer WG. Mein Zimmer ist klein, aber hell. Das Bett steht an der Wand neben dem Fenster. Vor dem Bett liegt ein Teppich. Zwischen dem Schreibtisch und dem Schrank steht eine kleine Pflanze. Meine Bücher liegen im Regal über dem Schreibtisch. In der Küche gibt es einen großen Tisch. Dort essen wir abends oft zusammen. Fahrräder dürfen nicht im Flur stehen; sie müssen im Keller bleiben.`,
    questions: [
      { stem: "Wo steht das Bett?", options: ["A) Neben dem Fenster", "B) Vor dem Schrank", "C) Zwischen Tisch und Tür", "D) Im Flur"] },
      { stem: "Was liegt vor dem Bett?", options: ["A) Eine Pflanze", "B) Ein Teppich", "C) Ein Regal", "D) Ein Fahrrad"] },
      { stem: "Wo stehen die Bücher?", options: ["A) Im Keller", "B) Auf dem Bett", "C) Im Regal über dem Schreibtisch", "D) In der Küche"] },
      { stem: "Was machen die Bewohner oft am Abend?", options: ["A) Sie lernen im Flur.", "B) Sie essen zusammen in der Küche.", "C) Sie fahren Fahrrad.", "D) Sie stellen Möbel um."] },
      { stem: "Wo müssen Fahrräder stehen?", options: ["A) Im Flur", "B) Im Zimmer", "C) Im Keller", "D) Vor dem Haus"] },
    ],
  },
  7: {
    chapter: "3.7",
    format: "Anzeigen zuordnen",
    title: "Drei Wohnungen",
    strategy: "Lies zuerst, was die Person braucht. Vergleiche dann Lage, Preis, Zimmer und Ausstattung.",
    text: `Wohnung A: 1 Zimmer, 32 m², 520 Euro warm. Nähe Universität, möbliert, kein Balkon.

Wohnung B: 2 Zimmer, 55 m², 760 Euro warm. Balkon, ruhige Lage, 15 Minuten mit dem Bus ins Zentrum.

Wohnung C: WG-Zimmer, 20 m², 430 Euro warm. Küche und Bad gemeinsam. Direkt an der U-Bahn. Haustiere erlaubt.`,
    questions: [
      { stem: "Mila studiert und möchte allein wohnen. Die Wohnung soll möglichst nah an der Universität sein.", options: ["A) Wohnung A", "B) Wohnung B", "C) Wohnung C", "D) Keine Wohnung passt."] },
      { stem: "Jonas möchte unbedingt einen Balkon und zwei Zimmer.", options: ["A) Wohnung A", "B) Wohnung B", "C) Wohnung C", "D) Keine Wohnung passt."] },
      { stem: "Sara hat einen kleinen Hund und möchte direkt an einer U-Bahn wohnen.", options: ["A) Wohnung A", "B) Wohnung B", "C) Wohnung C", "D) Keine Wohnung passt."] },
      { stem: "Tim möchte höchstens 450 Euro warm bezahlen und allein wohnen.", options: ["A) Wohnung A", "B) Wohnung B", "C) Wohnung C", "D) Keine Wohnung passt."] },
      { stem: "Welche Wohnung ist möbliert?", options: ["A) Wohnung A", "B) Wohnung B", "C) Wohnung C", "D) Keine Wohnung"] },
    ],
  },
  8: {
    chapter: "3.8",
    format: "Rezept",
    title: "Nudeln mit Gemüse",
    strategy: "Bei Rezepten sind Reihenfolge, Mengen und Imperativformen wichtig. Suche nach zuerst, dann und zum Schluss.",
    text: `Nudeln mit Gemüse – für zwei Personen

Du brauchst: 200 g Nudeln, eine Paprika, eine kleine Zucchini, eine Zwiebel, zwei Tomaten, Öl, Salz und Pfeffer.

Koche zuerst die Nudeln in Salzwasser. Schneide in der Zwischenzeit das Gemüse klein. Gib etwas Öl in eine Pfanne und brate zuerst die Zwiebel. Dann kommen Paprika und Zucchini dazu. Nach fünf Minuten gibst du die Tomaten in die Pfanne. Mische zum Schluss die Nudeln mit dem Gemüse und würze alles mit Salz und Pfeffer.`,
    questions: [
      { stem: "Für wie viele Personen ist das Rezept?", options: ["A) Für eine Person", "B) Für zwei Personen", "C) Für drei Personen", "D) Für vier Personen"] },
      { stem: "Was soll man zuerst kochen?", options: ["A) Die Tomaten", "B) Die Nudeln", "C) Die Zwiebel", "D) Die Paprika"] },
      { stem: "Welches Gemüse kommt zuerst in die Pfanne?", options: ["A) Die Zwiebel", "B) Die Tomaten", "C) Die Zucchini", "D) Die Paprika"] },
      { stem: "Wann kommen die Tomaten in die Pfanne?", options: ["A) Sofort am Anfang", "B) Nach fünf Minuten", "C) Nach dem Essen", "D) Gleichzeitig mit den Nudeln ins Wasser"] },
      { stem: "Was macht man ganz zum Schluss?", options: ["A) Man schneidet die Zwiebel.", "B) Man kauft Gemüse.", "C) Man mischt Nudeln und Gemüse und würzt.", "D) Man kocht Wasser."] },
    ],
  },
  9: {
    chapter: "4.9",
    format: "Hotel-E-Mail",
    title: "Ihre Buchung in Salzburg",
    strategy: "Bei Buchungs-E-Mails sind Datum, Preis, Leistungen und Check-in-Zeit die wichtigsten Informationen.",
    text: `Sehr geehrte Frau Mensah,

vielen Dank für Ihre Buchung. Wir haben für Sie vom 14. bis 17. Oktober ein Einzelzimmer reserviert. Das Zimmer kostet 82 Euro pro Nacht. Frühstück ist im Preis enthalten. WLAN ist kostenlos. Der Check-in ist ab 14 Uhr möglich. Wenn Sie später als 20 Uhr anreisen, informieren Sie bitte die Rezeption. Vom Hauptbahnhof erreichen Sie unser Hotel mit Bus 3 in etwa zehn Minuten.

Freundliche Grüße
Hotel Stadtblick`,
    questions: [
      { stem: "Wie lange bleibt Frau Mensah im Hotel?", options: ["A) Zwei Nächte", "B) Drei Nächte", "C) Vier Nächte", "D) Eine Woche"] },
      { stem: "Was kostet eine Nacht?", options: ["A) 14 Euro", "B) 17 Euro", "C) 82 Euro", "D) 20 Euro"] },
      { stem: "Was ist im Zimmerpreis enthalten?", options: ["A) Abendessen", "B) Frühstück", "C) Eine Busfahrkarte", "D) Ein Taxi"] },
      { stem: "Wann kann Frau Mensah einchecken?", options: ["A) Ab 10 Uhr", "B) Ab 12 Uhr", "C) Ab 14 Uhr", "D) Erst ab 20 Uhr"] },
      { stem: "Was soll sie tun, wenn sie nach 20 Uhr ankommt?", options: ["A) Ein anderes Hotel suchen.", "B) Die Rezeption informieren.", "C) Den Busfahrer anrufen.", "D) Bis morgens warten."] },
    ],
  },
  10: {
    chapter: "4.10",
    format: "Veranstaltungsprogramm",
    title: "Stadtfest am Sonntag",
    strategy: "Bei Programmen kannst du Namen und Uhrzeiten schnell suchen. Lies nicht immer den ganzen Text von Anfang an.",
    text: `Stadtfest am Sonntag – Marktplatz

10:00 Eröffnung mit Musik
11:30 Tanzgruppe aus der Region
13:00 Internationales Mittagessen
14:30 Kinderprogramm vor dem Rathaus
16:00 Konzert der Band „Nordlicht“
18:00 Ende des Festes

Der Eintritt ist kostenlos. Getränke und Essen muss man bezahlen. Bei starkem Regen findet das Konzert im Kulturhaus statt.`,
    questions: [
      { stem: "Wann beginnt das Stadtfest?", options: ["A) Um 10:00 Uhr", "B) Um 11:30 Uhr", "C) Um 13:00 Uhr", "D) Um 18:00 Uhr"] },
      { stem: "Was gibt es um 13:00 Uhr?", options: ["A) Ein Konzert", "B) Ein Kinderprogramm", "C) Internationales Mittagessen", "D) Eine Tanzgruppe"] },
      { stem: "Wo findet das Kinderprogramm statt?", options: ["A) Im Kulturhaus", "B) Vor dem Rathaus", "C) Im Bahnhof", "D) In einem Restaurant"] },
      { stem: "Wie viel kostet der Eintritt?", options: ["A) 5 Euro", "B) 10 Euro", "C) Er ist kostenlos.", "D) Nur Kinder zahlen nichts."] },
      { stem: "Was passiert bei starkem Regen mit dem Konzert?", options: ["A) Es fällt immer aus.", "B) Es beginnt früher.", "C) Es findet im Kulturhaus statt.", "D) Es findet am Bahnhof statt."] },
    ],
  },
  11: {
    chapter: "4.11",
    format: "Verkehrsinformation",
    title: "Drei Wege zum Flughafen",
    strategy: "Vergleiche Fahrzeit, Preis und Abfahrtsort. Zahlen und Einheiten helfen dir beim schnellen Lesen.",
    text: `Zum Flughafen gibt es drei Möglichkeiten:

S-Bahn S8: alle 20 Minuten ab Hauptbahnhof, Fahrzeit 35 Minuten, Ticket 7 Euro.
Flughafenbus: alle 30 Minuten ab ZOB, Fahrzeit 45 Minuten, Ticket 9 Euro.
Taxi: jederzeit, Fahrzeit etwa 25 Minuten, Preis ungefähr 38 Euro.

Am Montag fährt die S8 wegen Bauarbeiten erst ab 08:30 Uhr.`,
    questions: [
      { stem: "Welches Verkehrsmittel ist normalerweise am schnellsten?", options: ["A) S-Bahn", "B) Flughafenbus", "C) Taxi", "D) Alle sind gleich schnell."] },
      { stem: "Wie viel kostet die S-Bahn?", options: ["A) 7 Euro", "B) 9 Euro", "C) 25 Euro", "D) 38 Euro"] },
      { stem: "Wo fährt der Flughafenbus ab?", options: ["A) Am Flughafen", "B) Am ZOB", "C) Am Rathaus", "D) An der Universität"] },
      { stem: "Wie oft fährt die S-Bahn?", options: ["A) Alle 10 Minuten", "B) Alle 20 Minuten", "C) Alle 30 Minuten", "D) Einmal pro Stunde"] },
      { stem: "Was ist am Montagmorgen anders?", options: ["A) Der Bus kostet weniger.", "B) Das Taxi fährt nicht.", "C) Die S8 fährt erst ab 08:30 Uhr.", "D) Der Flughafen ist geschlossen."] },
    ],
  },
  12: {
    chapter: "5.12",
    format: "Stellenanzeigen zuordnen",
    title: "Welcher Job passt?",
    strategy: "Markiere in jeder Anzeige Arbeitszeit, Erfahrung und besondere Voraussetzungen. Vergleiche danach mit der Person.",
    text: `Anzeige A – Café Morgenrot
Servicekraft gesucht. Teilzeit, Montag bis Freitag 7–12 Uhr. Erfahrung ist nicht nötig. Gute Deutschkenntnisse sind wichtig.

Anzeige B – Tierpraxis Klein
Hilfe an der Rezeption gesucht. Vollzeit. Sie telefonieren viel und organisieren Termine. Computerkenntnisse und Erfahrung im Büro sind erforderlich.

Anzeige C – Sportzentrum Aktiv
Trainerin oder Trainer für Kindergruppen gesucht. Arbeit am Nachmittag und am Samstag. Sporterfahrung ist wichtig.

Anzeige D – Buchhandlung Lesewelt
Aushilfe am Samstag, 10–18 Uhr. Sie verkaufen Bücher und helfen Kunden. Erfahrung im Verkauf ist hilfreich, aber nicht notwendig.`,
    questions: [
      { stem: "Ama kann nur vormittags arbeiten und hat noch keine Berufserfahrung.", options: ["A) Anzeige A", "B) Anzeige B", "C) Anzeige C", "D) Anzeige D"] },
      { stem: "Paul hat im Büro gearbeitet und kennt sich gut mit Computern aus.", options: ["A) Anzeige A", "B) Anzeige B", "C) Anzeige C", "D) Anzeige D"] },
      { stem: "Lena arbeitet gern mit Kindern und hat viele Jahre Volleyball gespielt.", options: ["A) Anzeige A", "B) Anzeige B", "C) Anzeige C", "D) Anzeige D"] },
      { stem: "Timo sucht nur samstags einen Nebenjob und mag Bücher.", options: ["A) Anzeige A", "B) Anzeige B", "C) Anzeige C", "D) Anzeige D"] },
      { stem: "Bei welcher Stelle ist Büroerfahrung ausdrücklich erforderlich?", options: ["A) Anzeige A", "B) Anzeige B", "C) Anzeige C", "D) Anzeige D"] },
    ],
  },
  13: {
    chapter: "5.13",
    format: "Einladung zum Vorstellungsgespräch",
    title: "Termin bei der Firma Novak",
    strategy: "Achte auf Termin, Adresse, Ansprechpartner und was du mitbringen sollst.",
    text: `Sehr geehrte Frau Owusu,

vielen Dank für Ihre Bewerbung als Büroassistentin. Wir möchten Sie gern zu einem Vorstellungsgespräch einladen.

Termin: Dienstag, 6. Mai, 10:30 Uhr
Ort: Firma Novak, Lindenstraße 18, 2. Stock
Ansprechpartner: Herr Berger

Bitte bringen Sie Ihren Lebenslauf und Ihre Zeugnisse mit. Das Gespräch dauert ungefähr 45 Minuten. Wenn Sie den Termin nicht wahrnehmen können, melden Sie sich bitte spätestens am Freitag bei uns.

Mit freundlichen Grüßen
Personalabteilung Novak`,
    questions: [
      { stem: "Für welche Stelle hat sich Frau Owusu beworben?", options: ["A) Büroassistentin", "B) Verkäuferin", "C) Krankenpflegerin", "D) Lehrerin"] },
      { stem: "Wann ist das Vorstellungsgespräch?", options: ["A) Montag um 10:30 Uhr", "B) Dienstag um 10:30 Uhr", "C) Dienstag um 18:00 Uhr", "D) Freitag um 10:30 Uhr"] },
      { stem: "Wen trifft Frau Owusu bei der Firma?", options: ["A) Frau Novak", "B) Herrn Berger", "C) Herrn Owusu", "D) Die Buchhaltung"] },
      { stem: "Was soll sie mitbringen?", options: ["A) Pass und Fahrkarte", "B) Lebenslauf und Zeugnisse", "C) Laptop und Foto", "D) Arbeitskleidung"] },
      { stem: "Was soll sie tun, wenn sie nicht kommen kann?", options: ["A) Gar nichts.", "B) Erst am Dienstag anrufen.", "C) Sich spätestens am Freitag melden.", "D) Eine neue Bewerbung schreiben."] },
    ],
  },
  14: {
    chapter: "5.14",
    format: "Information am Arbeitsplatz",
    title: "Willkommen bei TechPlus",
    strategy: "Lies nach Regeln, Zeiten und Ansprechpartnern. Solche Informationen stehen oft in kurzen Absätzen.",
    text: `Willkommen bei TechPlus!

Die Arbeitszeit beginnt zwischen 8:00 und 9:00 Uhr. Wer später kommt, informiert bitte das Team. Die Mittagspause dauert mindestens 30 Minuten. Urlaub muss vorher im Online-System beantragt werden. Bei Krankheit informieren Sie Ihre Teamleitung am ersten Tag vor 9:00 Uhr. Ab dem dritten Krankheitstag brauchen Sie eine ärztliche Bescheinigung.

Für Fragen zu Weiterbildung sprechen Sie mit Frau König aus der Personalabteilung. Jeden ersten Mittwoch im Monat gibt es außerdem eine kurze Informationsveranstaltung für neue Mitarbeitende.`,
    questions: [
      { stem: "Wann kann die Arbeit beginnen?", options: ["A) Zwischen 8:00 und 9:00 Uhr", "B) Nur um 7:00 Uhr", "C) Nach 10:00 Uhr", "D) Immer um 12:00 Uhr"] },
      { stem: "Wie lange dauert die Mittagspause mindestens?", options: ["A) 15 Minuten", "B) 20 Minuten", "C) 30 Minuten", "D) 60 Minuten"] },
      { stem: "Wie beantragt man Urlaub?", options: ["A) Per Telefon", "B) Im Online-System", "C) Beim Kollegen", "D) Gar nicht"] },
      { stem: "Wann muss man bei Krankheit die Teamleitung informieren?", options: ["A) Am ersten Tag vor 9:00 Uhr", "B) Erst nach drei Tagen", "C) Am Wochenende", "D) Nur nach dem Arztbesuch"] },
      { stem: "Wer hilft bei Fragen zur Weiterbildung?", options: ["A) Herr Berger", "B) Frau König", "C) Die Kantine", "D) Die Teamleitung immer"] },
    ],
  },
  15: {
    chapter: "6.15",
    format: "Sportangebote",
    title: "Sportverein Nord",
    strategy: "Suche nach Wochentag, Uhrzeit, Alter und Preis. Bei Angeboten reichen oft einzelne Schlüsselwörter.",
    text: `Sportverein Nord – neue Kurse

Laufgruppe: Dienstag 18:00 Uhr, Treffpunkt Stadion, kostenlos.
Schwimmen: Mittwoch 19:00 Uhr, Hallenbad, 25 Euro pro Monat.
Badminton: Freitag 17:30 Uhr, Sporthalle 2, 20 Euro pro Monat.
Familienfitness: Samstag 10:00 Uhr, für Erwachsene mit Kindern ab 6 Jahren, 8 Euro pro Termin.

Für Schwimmen und Badminton ist eine Anmeldung nötig.`,
    questions: [
      { stem: "Welche Aktivität ist kostenlos?", options: ["A) Laufgruppe", "B) Schwimmen", "C) Badminton", "D) Familienfitness"] },
      { stem: "Wo findet Schwimmen statt?", options: ["A) Im Stadion", "B) Im Hallenbad", "C) In Sporthalle 2", "D) Im Park"] },
      { stem: "Wann beginnt Badminton?", options: ["A) Dienstag um 18:00 Uhr", "B) Mittwoch um 19:00 Uhr", "C) Freitag um 17:30 Uhr", "D) Samstag um 10:00 Uhr"] },
      { stem: "Für wen ist Familienfitness gedacht?", options: ["A) Nur für Kinder", "B) Für Erwachsene mit Kindern ab 6 Jahren", "C) Nur für Senioren", "D) Nur für Vereinsmitglieder"] },
      { stem: "Für welche Kurse muss man sich anmelden?", options: ["A) Laufgruppe und Familienfitness", "B) Schwimmen und Badminton", "C) Nur Laufgruppe", "D) Für alle Kurse"] },
    ],
  },
  16: {
    chapter: "6.16",
    format: "Anzeigen zuordnen",
    title: "Etwas für das Wohlbefinden",
    strategy: "Vergleiche Problem und Angebot. Achte auf Wörter wie Rücken, Stress, Ernährung und Entspannung.",
    text: `Angebot A – Yoga am Abend
Montag und Donnerstag, 18:30 Uhr. Ruhige Übungen für Anfänger.

Angebot B – Rückenkurs
Mittwoch, 17:00 Uhr. Übungen für Menschen mit Rückenproblemen.

Angebot C – Ernährungsberatung
Individuelle Termine. Tipps für gesundes Essen im Alltag.

Angebot D – Entspannung nach der Arbeit
Freitag, 19:00 Uhr. Atemübungen und einfache Techniken gegen Stress.`,
    questions: [
      { stem: "Marta sitzt viel im Büro und hat oft Rückenschmerzen.", options: ["A) Angebot A", "B) Angebot B", "C) Angebot C", "D) Angebot D"] },
      { stem: "Kwame möchte lernen, im Alltag gesünder zu essen.", options: ["A) Angebot A", "B) Angebot B", "C) Angebot C", "D) Angebot D"] },
      { stem: "Nora ist nach der Arbeit oft gestresst und sucht etwas am Freitagabend.", options: ["A) Angebot A", "B) Angebot B", "C) Angebot C", "D) Angebot D"] },
      { stem: "Jonas möchte als Anfänger zweimal pro Woche ruhige Übungen machen.", options: ["A) Angebot A", "B) Angebot B", "C) Angebot C", "D) Angebot D"] },
      { stem: "Welches Angebot hat individuelle Termine?", options: ["A) Angebot A", "B) Angebot B", "C) Angebot C", "D) Angebot D"] },
    ],
  },
  17: {
    chapter: "6.17",
    format: "Apothekeninformation",
    title: "Erkältung: Was können Sie tun?",
    strategy: "Unterscheide Symptome, Empfehlungen und Warnhinweise. Lies besonders Wörter wie wenn, nicht und bitte.",
    text: `Information aus der Stadt-Apotheke

Bei einer leichten Erkältung helfen oft Ruhe, viel Wasser oder Tee und frische Luft. Gegen Halsschmerzen gibt es Lutschtabletten. Bei Husten kann ein Hustensaft helfen. Nasenspray sollte man nur wenige Tage benutzen.

Bitte fragen Sie in der Apotheke nach, wenn Sie andere Medikamente nehmen. Bei hohem Fieber, starken Schmerzen oder wenn die Beschwerden länger als eine Woche dauern, sollten Sie zum Arzt gehen. Medikamente für Kinder müssen immer zum Alter des Kindes passen.`,
    questions: [
      { stem: "Was wird bei einer leichten Erkältung empfohlen?", options: ["A) Viel Sport", "B) Ruhe und viel trinken", "C) Wenig schlafen", "D) Nur Kaffee trinken"] },
      { stem: "Was kann gegen Halsschmerzen helfen?", options: ["A) Lutschtabletten", "B) Nasenspray", "C) Sonnencreme", "D) Pflaster"] },
      { stem: "Wie lange sollte man Nasenspray benutzen?", options: ["A) Mehrere Monate", "B) Nur wenige Tage", "C) Immer", "D) Genau drei Wochen"] },
      { stem: "Wann sollte man zum Arzt gehen?", options: ["A) Bei hohem Fieber oder starken Schmerzen", "B) Bei jedem kleinen Husten", "C) Nur am Wochenende", "D) Wenn man Wasser trinkt"] },
      { stem: "Was ist bei Medikamenten für Kinder wichtig?", options: ["A) Die Farbe", "B) Der Preis", "C) Sie müssen zum Alter passen.", "D) Sie müssen immer Tabletten sein."] },
    ],
  },
  18: {
    chapter: "7.18",
    format: "Bank-E-Mail",
    title: "Ihr Termin zur Kontoeröffnung",
    strategy: "Achte auf Dokumente, Termin, Ort und Vorbereitung. Diese Details werden in Service-E-Mails oft direkt genannt.",
    text: `Sehr geehrter Herr Mensah,

Ihr Termin zur Kontoeröffnung ist am Donnerstag um 14:00 Uhr in unserer Filiale am Marktplatz 8. Bitte bringen Sie Ihren Reisepass, Ihre Meldebescheinigung und einen Einkommensnachweis mit. Der Termin dauert ungefähr 45 Minuten.

Wenn Sie Zeit sparen möchten, können Sie die Formulare vorher online ausfüllen. Bitte kommen Sie zehn Minuten vor dem Termin. Falls Sie verhindert sind, ändern Sie den Termin über unsere App oder rufen Sie uns an.

Freundliche Grüße
Stadtbank`,
    questions: [
      { stem: "Wann ist der Termin?", options: ["A) Donnerstag um 14:00 Uhr", "B) Freitag um 14:00 Uhr", "C) Donnerstag um 10:00 Uhr", "D) Montag um 8:00 Uhr"] },
      { stem: "Wo findet der Termin statt?", options: ["A) Am Bahnhof", "B) Am Marktplatz 8", "C) Im Rathaus", "D) Online"] },
      { stem: "Welches Dokument soll Herr Mensah mitbringen?", options: ["A) Eine Fahrkarte", "B) Einen Reisepass", "C) Ein Schulbuch", "D) Eine Hotelbuchung"] },
      { stem: "Wie lange dauert der Termin ungefähr?", options: ["A) 15 Minuten", "B) 30 Minuten", "C) 45 Minuten", "D) Zwei Stunden"] },
      { stem: "Wie kann er Zeit sparen?", options: ["A) Später kommen", "B) Die Formulare vorher online ausfüllen", "C) Keine Dokumente mitbringen", "D) Den Termin absagen"] },
    ],
  },
  19: {
    chapter: "7.19",
    format: "Einkaufsinformationen",
    title: "Wo kaufe ich was?",
    strategy: "Lies Preise, Öffnungszeiten und besondere Hinweise. Das ist typisches Informations-Scanning.",
    text: `Wochenmarkt: Dienstag und Samstag, 7–13 Uhr. Obst, Gemüse, Brot und Käse. Viele Produkte kommen aus der Region. Kartenzahlung ist nicht an allen Ständen möglich.

Supermarkt City: Montag bis Samstag, 8–21 Uhr. Große Auswahl. Ab 19 Uhr sind einige Backwaren günstiger.

Secondhand-Laden: Mittwoch bis Freitag, 11–18 Uhr. Kleidung und kleine Haushaltsartikel. Man kann gut erhaltene Kleidung auch dort abgeben.`,
    questions: [
      { stem: "Wann ist der Wochenmarkt geöffnet?", options: ["A) Dienstag und Samstag", "B) Nur Sonntag", "C) Jeden Abend", "D) Montag bis Freitag"] },
      { stem: "Was ist auf dem Wochenmarkt nicht überall möglich?", options: ["A) Brot kaufen", "B) Kartenzahlung", "C) Gemüse kaufen", "D) Käse kaufen"] },
      { stem: "Wann sind im Supermarkt einige Backwaren günstiger?", options: ["A) Vor 8 Uhr", "B) Ab 19 Uhr", "C) Nur am Sonntag", "D) Mittags"] },
      { stem: "Was verkauft der Secondhand-Laden?", options: ["A) Nur Lebensmittel", "B) Kleidung und kleine Haushaltsartikel", "C) Fahrräder", "D) Medikamente"] },
      { stem: "Was kann man im Secondhand-Laden zusätzlich tun?", options: ["A) Kleidung abgeben", "B) Geld wechseln", "C) Einen Sprachkurs besuchen", "D) Lebensmittel bestellen"] },
    ],
  },
  20: {
    chapter: "7.20",
    format: "Reklamations-E-Mail",
    title: "Der neue Wasserkocher funktioniert nicht",
    strategy: "Suche zuerst: Was wurde gekauft? Was ist das Problem? Was möchte die Person jetzt?",
    text: `Sehr geehrte Damen und Herren,

am Montag habe ich in Ihrer Filiale einen Wasserkocher für 39 Euro gekauft. Zu Hause habe ich das Gerät einmal benutzt. Seit Dienstag schaltet es sich nicht mehr ein. Ich habe die Steckdose geprüft; andere Geräte funktionieren dort normal.

Leider finde ich den Kassenbon nicht mehr, aber ich habe die Kartenzahlung in meiner Banking-App. Kann ich den Wasserkocher am Samstag in die Filiale bringen? Ich möchte gern ein neues Gerät oder mein Geld zurück.

Mit freundlichen Grüßen
Daniel Koch`,
    questions: [
      { stem: "Was hat Daniel gekauft?", options: ["A) Eine Kaffeemaschine", "B) Einen Wasserkocher", "C) Einen Toaster", "D) Einen Fernseher"] },
      { stem: "Wie viel hat das Gerät gekostet?", options: ["A) 19 Euro", "B) 29 Euro", "C) 39 Euro", "D) 49 Euro"] },
      { stem: "Was ist das Problem?", options: ["A) Das Gerät ist zu laut.", "B) Es schaltet sich nicht mehr ein.", "C) Es fehlt ein Kabel.", "D) Die Farbe ist falsch."] },
      { stem: "Was fehlt Daniel?", options: ["A) Der Kassenbon", "B) Die Verpackung", "C) Die Bankkarte", "D) Die Adresse der Filiale"] },
      { stem: "Was möchte Daniel?", options: ["A) Eine Beratung über Kaffee", "B) Ein neues Gerät oder sein Geld zurück", "C) Einen Rabatt auf Kleidung", "D) Einen Termin beim Techniker zu Hause"] },
    ],
  },
  21: {
    chapter: "8.21",
    format: "Wochenendplan",
    title: "Unser Wochenende in Köln",
    strategy: "Bei Plänen können Bedingungen etwas verändern. Achte besonders auf wenn und falls.",
    text: `Mara und Daniel fahren am Samstagmorgen mit dem Zug nach Köln. Ihr Zug kommt um 10:15 Uhr an. Zuerst bringen sie ihre Taschen ins Hotel. Danach möchten sie am Rhein spazieren und den Dom besuchen. Falls es stark regnet, gehen sie stattdessen in ein Museum.

Am Abend haben sie um 19 Uhr einen Tisch in einem Restaurant reserviert. Danach gehen sie zu einem Konzert. Am Sonntag frühstücken sie lange und kaufen noch kleine Geschenke. Ihr Zug nach Hause fährt um 17 Uhr.`,
    questions: [
      { stem: "Wie reisen Mara und Daniel nach Köln?", options: ["A) Mit dem Zug", "B) Mit dem Auto", "C) Mit dem Bus", "D) Mit dem Flugzeug"] },
      { stem: "Was möchten sie nach dem Hotel zuerst machen?", options: ["A) Einkaufen", "B) Am Rhein spazieren", "C) Zum Konzert gehen", "D) Nach Hause fahren"] },
      { stem: "Was machen sie am Samstagabend?", options: ["A) Museum und Hotel", "B) Restaurant und Konzert", "C) Shopping und Kino", "D) Nur einen Spaziergang"] },
      { stem: "Was machen sie bei starkem Regen?", options: ["A) Sie gehen in ein Museum.", "B) Sie fahren sofort nach Hause.", "C) Sie bleiben am Bahnhof.", "D) Sie machen eine Fahrradtour."] },
      { stem: "Wann fährt ihr Zug am Sonntag nach Hause?", options: ["A) Um 10:15 Uhr", "B) Um 14:00 Uhr", "C) Um 17:00 Uhr", "D) Um 19:00 Uhr"] },
    ],
  },
  22: {
    chapter: "8.22",
    format: "Wochenplan",
    title: "Eine volle Woche",
    strategy: "Ordne die Informationen nach Wochentagen. Dadurch findest du Details schneller.",
    text: `Nina arbeitet von Montag bis Freitag in einem Büro. Am Montag hat sie nach der Arbeit einen Deutschkurs. Dienstagabend geht sie ins Fitnessstudio. Am Mittwoch arbeitet sie im Homeoffice, deshalb kann sie in der Mittagspause einen Arzttermin wahrnehmen. Donnerstag trifft sie nach der Arbeit eine Freundin im Café. Am Freitag macht Nina keine Termine am Abend, weil sie sich ausruhen möchte.

Am Samstag erledigt sie ihren Einkauf und putzt die Wohnung. Wenn sie danach noch Zeit hat, besucht sie ihre Schwester. Am Sonntag lernt sie am Vormittag und geht am Nachmittag spazieren. Nina trägt alle Termine in ihren Kalender ein, damit sie nichts vergisst.`,
    questions: [
      { stem: "Was macht Nina am Montag nach der Arbeit?", options: ["A) Sie besucht einen Deutschkurs.", "B) Sie geht zum Arzt.", "C) Sie trifft ihre Schwester.", "D) Sie arbeitet im Homeoffice."] },
      { stem: "Warum kann Nina am Mittwoch mittags zum Arzt?", options: ["A) Sie hat Urlaub.", "B) Sie arbeitet im Homeoffice.", "C) Das Büro ist geschlossen.", "D) Sie arbeitet nur abends."] },
      { stem: "Wann trifft Nina eine Freundin?", options: ["A) Dienstag", "B) Mittwoch", "C) Donnerstag", "D) Sonntag"] },
      { stem: "Was macht Nina am Samstag?", options: ["A) Einkauf und Wohnung putzen", "B) Deutschkurs und Fitnessstudio", "C) Arzttermin und Café", "D) Nur lernen"] },
      { stem: "Warum trägt Nina ihre Termine in den Kalender ein?", options: ["A) Damit sie nichts vergisst.", "B) Weil sie keinen Computer hat.", "C) Damit sie später arbeitet.", "D) Weil sie keine Freizeit möchte."] },
    ],
  },
  23: {
    chapter: "9.23",
    format: "Arbeitsweg",
    title: "Drei Wege zur Arbeit",
    strategy: "Achte darauf, wer welches Verkehrsmittel benutzt und warum. Jede Information muss wirklich im Text stehen.",
    text: `Drei Kolleginnen und Kollegen erzählen von ihrem Arbeitsweg.

Matthias wohnt außerhalb der Stadt. Er fährt morgens mit dem Regionalzug und danach noch zwei Stationen mit der Straßenbahn. Insgesamt braucht er etwa 45 Minuten.

Bernd wohnt nur vier Kilometer vom Büro entfernt. Wenn das Wetter gut ist, fährt er mit dem Fahrrad. Bei Regen nimmt er den Bus 16.

Thomas wohnt im Zentrum. Er geht meistens zu Fuß zur Arbeit. Das dauert 20 Minuten. Nur wenn er sehr spät dran ist, nimmt er die U-Bahn.`,
    questions: [
      { stem: "Welches Verkehrsmittel benutzt Matthias zuerst?", options: ["A) Den Regionalzug", "B) Das Fahrrad", "C) Den Bus 16", "D) Die U-Bahn"] },
      { stem: "Wie lange braucht Matthias ungefähr zur Arbeit?", options: ["A) 20 Minuten", "B) 30 Minuten", "C) 45 Minuten", "D) Eine Stunde"] },
      { stem: "Wann fährt Bernd mit dem Fahrrad?", options: ["A) Bei gutem Wetter", "B) Bei Regen", "C) Nur am Sonntag", "D) Wenn er spät dran ist"] },
      { stem: "Was nimmt Bernd bei Regen?", options: ["A) Die Straßenbahn", "B) Den Bus 16", "C) Die U-Bahn", "D) Den Regionalzug"] },
      { stem: "Wie kommt Thomas meistens zur Arbeit?", options: ["A) Mit dem Auto", "B) Mit der U-Bahn", "C) Zu Fuß", "D) Mit dem Fahrrad"] },
    ],
  },
  24: {
    chapter: "9.24",
    format: "Reiseangebote zuordnen",
    title: "Welches Angebot passt?",
    strategy: "Lies zuerst die Wünsche der Reisenden. Vergleiche danach Reiseziel, Preis, Verkehrsmittel und Aktivitäten.",
    text: `Angebot A – Hamburg-Wochenende
2 Nächte, Hotel mit Frühstück, Hafenrundfahrt inklusive, Anreise mit dem Zug, 229 Euro.

Angebot B – Wandern im Harz
3 Nächte in einer Pension, Frühstück, zwei geführte Wanderungen, eigene Anreise, 189 Euro.

Angebot C – Wellness am See
2 Nächte, Hotel mit Pool und Sauna, Abendessen inklusive, 310 Euro.

Angebot D – Berlin günstig
2 Nächte im Hostel, ohne Frühstück, Busfahrt hin und zurück inklusive, 149 Euro.`,
    questions: [
      { stem: "Nora möchte eine Hafenrundfahrt machen und mit dem Zug reisen.", options: ["A) Angebot A", "B) Angebot B", "C) Angebot C", "D) Angebot D"] },
      { stem: "David möchte vor allem wandern und weniger als 200 Euro bezahlen.", options: ["A) Angebot A", "B) Angebot B", "C) Angebot C", "D) Angebot D"] },
      { stem: "Mina möchte Sauna und Pool im Hotel.", options: ["A) Angebot A", "B) Angebot B", "C) Angebot C", "D) Angebot D"] },
      { stem: "Jonas sucht das günstigste Angebot mit Hin- und Rückfahrt.", options: ["A) Angebot A", "B) Angebot B", "C) Angebot C", "D) Angebot D"] },
      { stem: "Bei welchem Angebot ist Abendessen inklusive?", options: ["A) Angebot A", "B) Angebot B", "C) Angebot C", "D) Angebot D"] },
    ],
  },
  25: {
    chapter: "9.25",
    format: "Tagesablauf",
    title: "Annas Arbeitstag",
    strategy: "Achte auf Uhrzeiten und Signalwörter wie zuerst, danach, später und abends.",
    text: `Anna steht werktags um 6:30 Uhr auf. Am Abend vorher legt sie ihre Kleidung bereit, damit sie morgens Zeit spart. Nach dem Frühstück fährt sie um 7:30 Uhr mit dem Bus zur Arbeit. Ihr Arbeitstag beginnt um 8 Uhr.

Um 12:30 Uhr macht Anna Mittagspause. Meistens isst sie mit zwei Kolleginnen in der Kantine. Um 16:30 Uhr hat sie Feierabend. Zweimal pro Woche geht sie danach ins Fitnessstudio. An den anderen Tagen fährt sie direkt nach Hause. Abends kocht sie, ruft manchmal ihre Mutter an und liest noch etwas. Gegen 22:30 Uhr geht sie schlafen.`,
    questions: [
      { stem: "Warum legt Anna ihre Kleidung am Abend vorher bereit?", options: ["A) Damit sie morgens Zeit spart.", "B) Weil sie morgens Sport macht.", "C) Damit sie später arbeitet.", "D) Weil sie die Kleidung wäscht."] },
      { stem: "Wie fährt Anna zur Arbeit?", options: ["A) Mit dem Zug", "B) Mit dem Bus", "C) Mit dem Fahrrad", "D) Mit dem Auto"] },
      { stem: "Wann macht Anna Mittagspause?", options: ["A) Um 8:00 Uhr", "B) Um 12:30 Uhr", "C) Um 16:30 Uhr", "D) Um 22:30 Uhr"] },
      { stem: "Was macht Anna zweimal pro Woche nach der Arbeit?", options: ["A) Sie besucht ihre Mutter.", "B) Sie geht ins Fitnessstudio.", "C) Sie arbeitet länger.", "D) Sie geht einkaufen."] },
      { stem: "Wann geht Anna ungefähr schlafen?", options: ["A) Um 20:00 Uhr", "B) Um 21:00 Uhr", "C) Um 22:30 Uhr", "D) Nach Mitternacht"] },
    ],
  },
  26: {
    chapter: "10.26",
    format: "Alltagssituationen",
    title: "Ein Tag mit verschiedenen Gefühlen",
    strategy: "Verbinde Situation und Gefühl. Achte darauf, warum sich die Person so fühlt.",
    text: `Am Morgen ist Samuel nervös, weil er eine wichtige Präsentation bei der Arbeit hat. Kurz vor der Präsentation atmet er langsam ein und aus. Danach ist er sehr erleichtert, denn alles ist gut gelaufen.

In der Mittagspause bekommt Samuel eine Nachricht von seiner Schwester: Sie hat ihre Prüfung bestanden. Samuel freut sich sehr für sie. Am Abend wartet er lange auf einen Bus, der nicht kommt. Deshalb ist er genervt. Zu Hause hört er Musik und wird wieder ruhiger.`,
    questions: [
      { stem: "Warum ist Samuel am Morgen nervös?", options: ["A) Er hat eine wichtige Präsentation.", "B) Er wartet auf den Bus.", "C) Seine Schwester ruft an.", "D) Er hat Urlaub."] },
      { stem: "Was macht Samuel kurz vor der Präsentation?", options: ["A) Er trinkt Kaffee.", "B) Er atmet langsam ein und aus.", "C) Er geht nach Hause.", "D) Er ruft seine Schwester an."] },
      { stem: "Wie fühlt er sich nach der Präsentation?", options: ["A) Erleichtert", "B) Wütend", "C) Traurig", "D) Müde"] },
      { stem: "Warum freut Samuel sich in der Mittagspause?", options: ["A) Er bekommt Geld.", "B) Seine Schwester hat eine Prüfung bestanden.", "C) Der Bus kommt.", "D) Er hat Feierabend."] },
      { stem: "Was hilft Samuel am Abend, wieder ruhiger zu werden?", options: ["A) Sport", "B) Musik", "C) Arbeit", "D) Fernsehen im Büro"] },
    ],
  },
  27: {
    chapter: "10.27",
    format: "Digitale Hinweise",
    title: "Sicher kommunizieren",
    strategy: "Lies bei digitalen Hinweisen genau, was erlaubt, empfohlen oder gefährlich ist.",
    text: `Tipps für sichere digitale Kommunikation

1. Verwende für wichtige Konten unterschiedliche Passwörter.
2. Teile Passwörter nie per Chat oder E-Mail.
3. Öffne keine unbekannten Links, wenn du den Absender nicht kennst.
4. Prüfe bei Nachrichten von Banken oder Behörden immer die Absenderadresse.
5. In Klassengruppen oder Arbeitschats: Schreibe persönliche Daten nur, wenn es wirklich nötig ist.
6. Wenn eine Nachricht beleidigend oder bedrohend ist, antworte nicht sofort. Speichere die Nachricht und informiere eine verantwortliche Person.`,
    questions: [
      { stem: "Was wird für wichtige Konten empfohlen?", options: ["A) Immer dasselbe Passwort", "B) Unterschiedliche Passwörter", "C) Gar kein Passwort", "D) Das Passwort im Chat speichern"] },
      { stem: "Was soll man nie per Chat oder E-Mail teilen?", options: ["A) Einen Termin", "B) Ein Passwort", "C) Eine Begrüßung", "D) Einen Filmtipp"] },
      { stem: "Was soll man bei unbekannten Links tun?", options: ["A) Sofort öffnen", "B) An alle weiterleiten", "C) Nicht öffnen, wenn man den Absender nicht kennt", "D) Das Passwort eingeben"] },
      { stem: "Was sollte man bei Nachrichten von Banken prüfen?", options: ["A) Nur die Schriftfarbe", "B) Die Absenderadresse", "C) Das Wetter", "D) Den Akkustand"] },
      { stem: "Was soll man bei einer beleidigenden Nachricht tun?", options: ["A) Sofort beleidigend antworten.", "B) Die Nachricht speichern und eine verantwortliche Person informieren.", "C) Das Passwort senden.", "D) Den Absender anrufen und bedrohen."] },
    ],
  },
  28: {
    chapter: "10.28",
    format: "E-Mail über Zukunftspläne",
    title: "Meine Pläne für die nächsten Jahre",
    strategy: "Achte auf Zeitangaben wie nächstes Jahr, danach und später. Sie zeigen die Reihenfolge der Pläne.",
    text: `Hallo Sofia,

du hast gefragt, was ich nach dem Deutschkurs machen möchte. Nächstes Jahr will ich zuerst die B1-Prüfung machen. Danach möchte ich mich für eine Ausbildung im Bereich Logistik bewerben. Wenn alles klappt, werde ich im Herbst mit der Ausbildung beginnen.

Später möchte ich Berufserfahrung sammeln und vielleicht noch eine Weiterbildung machen. Ich will auch weiter Deutsch lernen, weil ich im Beruf sicher sprechen und schreiben möchte. In zwei oder drei Jahren möchte ich in eine größere Wohnung ziehen. Reisen ist mir ebenfalls wichtig: Ich hoffe, dass ich nächstes Jahr meine Schwester in Wien besuchen kann.

Liebe Grüße
Kofi`,
    questions: [
      { stem: "Was möchte Kofi nächstes Jahr zuerst machen?", options: ["A) Die B1-Prüfung", "B) Eine Wohnung kaufen", "C) Nach Wien ziehen", "D) Eine Firma gründen"] },
      { stem: "Wofür möchte er sich danach bewerben?", options: ["A) Für ein Studium", "B) Für eine Ausbildung in Logistik", "C) Für einen Sprachkurs in Wien", "D) Für einen Urlaub"] },
      { stem: "Wann möchte Kofi mit der Ausbildung beginnen?", options: ["A) Im Frühling", "B) Im Sommer", "C) Im Herbst", "D) Im Winter"] },
      { stem: "Warum möchte er weiter Deutsch lernen?", options: ["A) Weil er nur reisen möchte.", "B) Weil er im Beruf sicher sprechen und schreiben möchte.", "C) Weil seine Wohnung klein ist.", "D) Weil er keine Ausbildung machen will."] },
      { stem: "Wen möchte Kofi in Wien besuchen?", options: ["A) Seinen Lehrer", "B) Seine Schwester", "C) Einen Kollegen", "D) Sofia"] },
    ],
  },
};

export const getA2ReadingTask = (day) => A2_READING_TASKS[Number(day)] || null;

export const A2_READING_DAYS = Object.freeze(
  Object.keys(A2_READING_TASKS).map(Number).sort((a, b) => a - b),
);

export default A2_READING_TASKS;
