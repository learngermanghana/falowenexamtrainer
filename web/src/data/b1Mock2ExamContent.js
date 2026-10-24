// Teacher-provided B1 Mock 02 materials (October 2026).
// The authoritative reading answer key and final score verification live on the server.
const mc=(number,question,a,b,c)=>({number,question,options:[["a",a],["b",b],["c",c]]});
export const B1_MOCK2_READING=Object.freeze({
  teil1:{
    title:"Teil 1",time:"10 Minuten",
    intro:"Lesen Sie den Text und die Aufgaben 1 bis 6 dazu. Sind die Aussagen Richtig oder Falsch?",
    heading:"Blogbeitrag: Mein Intensivkurs in Wien",
    subheading:"Hallo ihr Lieben,",
    date:"",
    paragraphs:[
      "heute möchte ich euch von meinem vierwöchigen Deutschkurs erzählen, den ich letzten Monat in Wien gemacht habe. Ich studiere in Mailand und brauche für mein Masterstudium zwingend ein B2-Zertifikat in Deutsch. Deshalb habe ich mich spontan entschieden, den Sommer in Österreich zu verbringen.",
      "Am Anfang hatte ich etwas Angst vor dem Wiener Dialekt. Im Alltag beim Einkaufen oder in der U-Bahn war die Aussprache für mich tatsächlich gewöhnungsbedürftig. Im Sprachinstitut sprachen die Lehrkräfte aber zum Glück ein sehr deutliches Hochdeutsch, sodass ich dem Unterricht ohne Probleme folgen konnte.",
      "Gewohnt habe ich bei einer sehr netten Gastfamilie im 5. Bezirk. Das war die beste Entscheidung! Abends haben wir fast immer zusammen gegessen und über meinen Tag gesprochen. Dadurch habe ich nicht nur im Unterricht, sondern auch beim Abendessen enorm viel Deutsch gelernt.",
      "Der Unterricht fand immer morgens von 09:00 bis 12:30 Uhr statt. Am Nachmittag hatte ich viel Freizeit und bin gemeinsam mit anderen Kursteilnehmern durch die Stadt geschlendert oder wir haben die berühmten Wiener Museen besucht.",
      "Der Monat ist wie im Flug vergangen. Meine Sprachkenntnisse haben sich riesig verbessert und ich habe sogar schon eine Zusage für ein Praktikum in Wien für den kommenden Sommer!",
      "Eure Laura"
    ],
    questions:[
      {number:1,question:"Laura hat den Sprachkurs gemacht, weil sie das Deutsch-Zertifikat für ihr Studium braucht."},
      {number:2,question:"Im Unterricht hatte Laura große Probleme, die Lehrer zu verstehen."},
      {number:3,question:"Laura hat während ihres Aufenthalts in einem Studentenwohnheim gewohnt."},
      {number:4,question:"Laura hat sich abends meistens selbst Essen zubereitet."},
      {number:5,question:"Die Kurse an der Sprachschule dauerten jeden Tag bis zum Nachmittag."},
      {number:6,question:"Laura kehrt nächsten Sommer für eine Arbeitsstelle nach Wien zurück."}
    ]
  },
  teil2:{
    title:"Teil 2 · Text 1",time:"20 Minuten · Text 1 und 2",
    heading:"Urban Gardening – Gemeinsam gärtnern mitten in der Großstadt",
    paragraphs:[
      "Immer mehr Menschen in deutschen Großstädten entdecken das Gärtnern für sich. Da viele Bewohner von Mietwohnungen keinen eigenen Garten besitzen, schließen sie sich sogenannten „Urban Gardening“-Projekten an. Auf ungenutzten städtischen Flächen pflanzen sie gemeinsam Gemüse, Kräuter und Blumen an.",
      "Das Projekt geht jedoch über das bloße Anbauen von Lebensmitteln hinaus. Für die meisten Teilnehmer steht der soziale Aspekt im Vordergrund. Alt und Jung, Nachbarn und Neuangekommene arbeiten zusammen, tauschen Tipps aus und verbringen ihre Freizeit an der frischen Luft.",
      "Auch für die Umwelt bieten die Gemeinschaftsgärten große Vorteile: Sie verbessern das Mikroklima in den Städten und bieten Bienen und anderen Insekten wichtigen Lebensraum. Viele Städte unterstützen diese Initiativen deshalb, indem sie freie Grundstücke kostenlos zur Verfügung stellen."
    ],
    questions:[
      mc(7,"Was steht bei den Gemeinschaftsgärten für die Teilnehmer vor allem im Mittelpunkt?","Sie möchten durch den Anbau von Gemüse möglichst viel Geld sparen.","Sie schätzen das gemeinsame Arbeiten und den Kontakt mit anderen.","Sie wollen lernen, wie man professionell Landwirtschaft betreibt."),
      mc(8,"Welcher ökologische Vorteil wird im Text genannt?","Die Gärten schützen vor Überschwemmungen bei Starkregen.","Der CO₂-Ausstoß der Großstädte wird halbiert.","Sie schaffen Lebensräume für Insekten und verbessern das Stadtklima."),
      mc(9,"Wie greifen viele Städte den Projekten unter die Arme?","Sie überlassen den Initiativen Flächen ohne Mietkosten.","Sie bezahlen den Teilnehmern ein monatliches Honorar.","Sie stellen kostenloses Saatgut und Gartengeräte bereit.")
    ],
    text2:{
      title:"Teil 2 · Text 2",
      intro:"Lesen Sie den Text aus der Presse und die Aufgaben 10 bis 12. Wählen Sie jeweils a, b oder c.",
      heading:"Digital Detox – Urlaub ohne Smartphone und Internet",
      paragraphs:[
        "Immer mehr Reiseveranstalter bieten sogenannte „Digital Detox“-Reisen an. Das Ziel dieser Urlaube ist es, das Smartphone, den Laptop und andere digitale Geräte für einige Tage komplett auszuschalten und sich ohne ständige Benachrichtigungen zu erholen.",
        "Studien zeigen, dass die ständige Erreichbarkeit im Beruf und Alltag bei vielen Menschen zu Stress und Schlafstörungen führt. Selbst im Urlaub schauen viele mehrmals pro Stunde auf ihr Handy, um E-Mails zu lesen oder soziale Medien zu überprüfen. Bei einer Digital-Detox-Reise geben die Gäste ihre elektronischen Geräte direkt bei der Ankunft im Hotel ab und bekommen sie erst am Abreisetag zurück.",
        "Stattdessen stehen Aktivitäten in der Natur, Wandern, Yoga und gemeinsame Gespräche auf dem Programm. Viele Teilnehmer berichten, dass es ihnen am ersten Tag zwar schwerfiel, auf das Smartphone zu verzichten, sie sich aber schon nach kurzer Zeit deutlich entspannter und erholter fühlten."
      ],
      questions:[
        mc(10,"Was ist das Hauptziel einer „Digital Detox“-Reise?","Man lernt, wie man Smartphones im Beruf effektiver nutzt.","Man verzichtet im Urlaub vollständig auf die Nutzung digitaler Geräte.","Man sucht in der Natur nach Orten mit besonders gutem WLAN-Empfang."),
        mc(11,"Was geschieht mit den Geräten der Urlauber?","Sie werden während des Aufenthalts im Hotel verwahrt.","Sie dürfen jeden Abend für eine Stunde genutzt werden.","Sie werden von Technikern auf Viren überprüft."),
        mc(12,"Welche Erfahrung machen viele Teilnehmer während des Urlaubs?","Der Verzicht fällt ihnen von der ersten Minute an sehr leicht.","Sie spüren nach anfänglicher Umgewöhnung eine deutliche Entspannung.","Sie vermissen berufliche E-Mails so sehr, dass sie früher abreisen.")
      ]
    }
  },
  teil3:{
    title:"Teil 3",time:"10 Minuten",
    context:"Lesen Sie die Situationen 13 bis 19 und die Anzeigen A bis J. Jede Anzeige nur einmal; Beispiel E ist vergeben. Für eine Situation gibt es keine passende Anzeige: Wählen Sie 0.",
    example:"Beispiel 0: Herr Schneider sucht am Wochenende eine geführte Fahrradtour für sich und seine Frau. Lösung: E.",
    situations:[
      {number:13,text:"Manuel möchte sich beruflich verändern und sucht einen Kurs im Bereich Grafikdesign, den er abends nach der Arbeit besuchen kann."},
      {number:14,text:"Sandra plant eine Feier im Garten und möchte dafür Stehtische und ein großes Partyzelt für ein Wochenende mieten."},
      {number:15,text:"Herr Meier möchte sein altes, aber funktionsfähiges Klavier verschenken und sucht jemanden, der es kostenlos bei ihm abholt."},
      {number:16,text:"Laura sucht für ihre 12-jährige Tochter eine Tanzgruppe am Samstagnachmittag."},
      {number:17,text:"Sven möchte sein altes Auto schnell verkaufen und sucht einen Händler, der ihm das Geld direkt bar auszahlt."},
      {number:18,text:"Familie Becker sucht für den Sommerurlaub eine Ferienwohnung an der Nordsee, in der auch ihr Hund willkommen ist."},
      {number:19,text:"Claudia sucht für ihren Haushalt eine angemeldete und legale Reinigungskraft für zwei Stunden pro Woche."}
    ],
    ads:[
      ["A","Autohaus & Ankauf „Express-Car“","Wir kaufen Ihr gebrauchtes Fahrzeug unabhängig von Marke und Alter! Schnelle Abwicklung, kostenlose Abmeldung und sofortige Barauszahlung vor Ort."],
      ["B","Nordsee-Ferienhaus „Dünentraum“","Gemütliche Ferienwohnung für 2–4 Personen direkt hinter dem Deich. Mit großer Terrasse und eingezäuntem Garten. Hunde sind bei uns herzlich willkommen!"],
      ["C","Volkshochschule (VHS) – Abendkurse","Lernen Sie Grundlagen der digitalen Bildbearbeitung und des Grafikdesigns. Jeden Dienstag und Donnerstag von 18:30 bis 20:45 Uhr. Start ab nächsten Monat!"],
      ["D","Tanzstudio „Motion“","Hip-Hop und Jazz Dance für Kinder und Jugendliche (10–14 Jahre). Immer samstags von 15:00 bis 16:30 Uhr. Probestunde kostenlos!"],
      ["E","Fahrradverleih & Touren „GrünLand“","Geführte E-Bike-Touren durch das Naturschutzgebiet an jedem Samstag und Sonntag. Perfekt für Paare und Familien!"],
      ["F","Event-Verleih „Party-Service Müller“","Wir vermieten Partyzelte, Stehtische, Geschirr und Musikanlagen für Ihre Gartenfeier. Günstige Wochenendtarife inklusive Lieferung."],
      ["G","Musikschule & Instrumenten-Börse","Klavier-, Gitarren- und Gesangsunterricht für Anfänger und Fortgeschrittene. An- und Verkauf von gebrauchten Musikinstrumenten mit Garantie."],
      ["H","Haushaltshilfe gesucht? „Sauber & Fair“","Vermittlung von qualifizierten und legal angemeldeten Reinigungskräften für Privathaushalte. Zuverlässig, haftpflichtversichert und flexibel."],
      ["I","Sportverein „Eintracht“","Tennis-Intensivkurse für Erwachsene an Wochentagen morgens von 09:00 bis 11:00 Uhr. Schläger und Bälle können geliehen werden."],
      ["J","Kleinanzeigen – Gebrauchte Möbel","Biete gut erhaltene Einbauküche und Wohnzimmerschrank günstig zum Verkauf an. Nur Selbstabholung in der Innenstadt."]
    ]
  },
  teil4:{
    title:"Teil 4",time:"15 Minuten",
    context:"Lesen Sie die Beiträge 20 bis 26 aus dem Online-Forum „Sollten Hausaufgaben an Schulen komplett abgeschafft werden?“ Ja = dafür, Nein = dagegen. Beispiel 0: Katrin möchte keine Hausaufgaben mehr. Lösung: Ja.",
    comments:[
      {number:20,person:"Markus (42)",text:"Durch Hausaufgaben lernen Kinder, selbstständig zu arbeiten und ihre Zeit zu planen. Sie gehören einfach zu einer guten Schulausbildung dazu."},
      {number:21,person:"Nina (28)",text:"Ein langer Schultag ist für Kinder anstrengend genug. Ausreichend Freizeit am Nachmittag ist für ihre Entwicklung und Gesundheit viel wichtiger als noch mehr Arbeitsblätter."},
      {number:22,person:"Christoph (50)",text:"Ohne das regelmäßige Wiederholen zu Hause vergessen die Schüler den im Unterricht gelernten Stoff viel zu schnell wieder."},
      {number:23,person:"Sarah (34)",text:"Hausaufgaben schaffen Ungerechtigkeit: Kinder, deren Eltern abends keine Zeit haben, um ihnen zu helfen, sind gegenüber anderen Schülern benachteiligt."},
      {number:24,person:"Thomas (45)",text:"Für Eltern bieten Hausaufgaben eine tolle Gelegenheit zu sehen, was die Kinder in der Schule gerade lernen und wo sie eventuell noch Unterstützung brauchen."},
      {number:25,person:"Julia (17)",text:"Ich finde, der gesamte Lernstoff sollte direkt im Unterricht geübt werden, anstatt ihn auf den Nachmittag zu Hause zu verschieben."},
      {number:26,person:"Andreas (38)",text:"Eine vollständige Abschaffung halte ich für falsch. Lehrkräfte sollten selbst entscheiden dürfen, wann zusätzliche Übungen zu Hause sinnvoll sind."}
    ]
  },
  teil5:{
    title:"Teil 5",time:"10 Minuten",
    context:"Lesen Sie die Benutzungsordnung der Stadtbibliothek und die Aufgaben 27–30. Wählen Sie a, b oder c.",
    heading:"Benutzungsordnung und Regeln der Stadtbibliothek",
    sections:[
      ["Willkommen","Sehr geehrte Leserinnen und Leser, herzlich willkommen in der Stadtbibliothek! Um allen Besuchern ein ungestörtes Lernen und Lesen zu ermöglichen, bitten wir Sie um die Einhaltung folgender Regeln:"],
      ["1. Bibliotheksausweis","Für das Entleihen von Medien benötigen Sie einen gültigen Bibliotheksausweis. Dieser ist persönlich und darf nicht an dritte Personen weitergegeben werden. Sollten Sie Ihren Ausweis verlieren, melden Sie dies bitte umgehend der Information, damit das Konto gesperrt werden kann."],
      ["2. Leihfristen und Verlängerungen","Die reguläre Leihfrist für Bücher beträgt vier Wochen, für Filme (DVDs) und Hörbücher zwei Wochen. Sie können die Leihfrist bis zu zweimal online verlängern, sofern keine Vormerkung von anderen Lesern vorliegt. Bei verspäteter Rückgabe fallen Gebühren an."],
      ["3. Verhalten in den Lesesälen","Bitte verhalten Sie sich im gesamten Gebäude ruhig. Das Essen von Speisen ist in den Unterrichts- und Lesesälen nicht gestattet. Das Trinken von Wasser aus wiederverschließbaren Flaschen ist erlaubt."],
      ["4. Nutzung der Computerarbeitsplätze","Die Computer mit Internetzugang stehen angemeldeten Nutzern täglich für maximal 60 Minuten kostenlos zur Verfügung. Das Ausdrucken von Dokumenten ist kostenpflichtig (0,15 € pro Seite) und muss an der Hauptkasse beglichen werden."]
    ],
    questions:[
      mc(27,"Was soll man tun, wenn der Bibliotheksausweis verloren geht?","Einen neuen Ausweis bei der Polizei als gestohlen melden.","Die Bibliothek sofort informieren, damit der Ausweis gesperrt wird.","Eine Bearbeitungsgebühr von 10 Euro an der Kasse bezahlen."),
      mc(28,"Welche Regel gilt für die Ausleihe von DVDs und Hörbüchern?","Sie dürfen grundsätzlich nicht online verlängert werden.","Die reguläre Ausleihdauer beträgt zwei Wochen.","Man darf sie höchstens für vier Wochen behalten."),
      mc(29,"Was ist bezüglich Verpflegung im Gebäude gestattet?","Das Trinken von Wasser aus verschließbaren Flaschen.","Der Verzehr von kleinen Snacks in den Lesesälen.","Alle kalten Getränke dürfen an den Leseplätzen getrunken werden."),
      mc(30,"Wie ist die Nutzung der Internet-Computer geregelt?","Die Nutzung ist für alle Besucher ohne zeitliche Begrenzung gratis.","Angemeldete Nutzer können die Computer eine Stunde pro Tag kostenlos nutzen.","Das Ausdrucken von Seiten ist im Ausweisbeitrag bereits enthalten.")
    ]
  }
});
export const B1_MOCK2_WRITING_TASKS=Object.freeze([
  {id:"teil1",title:"Aufgabe 1 · Informelle E-Mail",meta:"20 Minuten · ca. 80 Wörter",target:80,
    prompt:"Ihr Freund Julian hat Sie zu seiner Geburtstagsparty am nächsten Samstag eingeladen. Sie können aber leider nicht kommen. Schreiben Sie eine E-Mail an Julian.",
    points:["Bedanken Sie sich für die Einladung.","Sagen Sie ab und begründen Sie, warum Sie nicht kommen können.","Machen Sie einen Vorschlag für ein Treffen an einem anderen Tag. Vergessen Sie nicht Anrede und Grußformel."]},
  {id:"teil2",title:"Aufgabe 2 · Diskussionsbeitrag",meta:"25 Minuten · ca. 80 Wörter",target:80,
    prompt:"Thema: „Brauchen wir bargeldloses Bezahlen überall?“ Laura (26 Jahre): „Ich bezahle fast alles nur noch mit Karte oder Smartphone. Das geht viel schneller und man muss nicht ständig zur Bank laufen. Bargeld ist veraltet.“",
    points:["Äußern Sie Ihre Meinung zum bargeldlosen Bezahlen im Alltag.","Begründen Sie Ihre Haltung.","Nennen Sie persönliche Erfahrungen oder die Situation in Ihrem Heimatland."]},
  {id:"teil3",title:"Aufgabe 3 · Formelle E-Mail",meta:"15 Minuten · ca. 40 Wörter",target:40,
    prompt:"Sie nehmen an einem Abendkurs an der Volkshochschule teil. Sie haben gestern Ihren Bibliotheksausweis im Kursraum vergessen. Schreiben Sie eine formelle Nachricht an Frau Sommer, Leiterin des Kundenservice.",
    points:["Erklären Sie höflich, was Sie vergessen haben und in welchem Raum.","Bitten Sie darum, nach dem Ausweis zu suchen und ihn an der Rezeption zu hinterlegen.","Verwenden Sie die Sie-Form, eine passende Anrede und eine Grußformel."]}
]);
export const B1_MOCK2_SPEAKING=Object.freeze({
  teil1:{id:"teil1",title:"Aufgabe 1 · Gemeinsam planen",
    situation:"Frau Keller aus Ihrem Sprachkurs feiert nächste Woche ihr 10-jähriges Firmenjubiläum. Sie und Ihr Partner möchten eine Überraschungsfeier im Kursraum organisieren.",
    points:["Wann und wo findet die Feier statt?","Wen laden Sie ein (Mitschüler, Lehrkräfte)?","Was schenken Sie ihr (Idee und Budget)?","Wer besorgt Essen, Getränke und Dekoration?"],
    instruction:"Planen Sie gemeinsam, machen Sie Vorschläge, fragen Sie nach, reagieren Sie und einigen Sie sich auf einen Plan.",
    maxRecordingSeconds:240},
  teil2:{id:"teil2",title:"Aufgabe 2 · Präsentation",
    topic:"Sollte man im Alltag mehr Bio-Produkte kaufen?",
    alternativeTopic:"Verreisen: Lieber alleine oder in einer Gruppe?",
    points:["Einleitung: Thema vorstellen und Aufbau erklären.","Eigene Erfahrungen schildern.","Situation im Heimatland beschreiben.","Vor- und Nachteile nennen und Ihre Meinung äußern.","Abschluss und Dank an die Zuhörer."],
    prepSeconds:300,maxRecordingSeconds:240},
  teil3:{id:"teil3",title:"Aufgabe 3 · Reagieren",
    prompt:"Geben Sie Ihrem Partner Feedback zu seiner Präsentation, stellen Sie eine passende Zusatzfrage und beantworten Sie eine Frage zu Ihrer eigenen Präsentation.",
    maxRecordingSeconds:120}
});
