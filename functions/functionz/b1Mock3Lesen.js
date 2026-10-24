"use strict";
// B1 Mock 3 Lesen. All 30 answer keys stay on the server; the public route
// removes each answer before sending the reading passages and questions.
const PARTS = Object.freeze([
  {
    "part": 1,
    "label": "Mein erstes Jahr im neuen Job",
    "format": "richtig-falsch",
    "timeMinutes": 10,
    "instruction": "Lesen Sie den Blogbeitrag. Entscheiden Sie, ob die Aussagen 1–6 richtig oder falsch sind.",
    "passages": [
      {
        "title": "Blogbeitrag von Marco · Mein erstes Jahr im neuen Job",
        "paragraphs": [
          "Hallo zusammen! Vor genau einem Jahr habe ich mein Studium beendet und meine erste Stelle bei einer Marketing-Agentur in Hamburg angetreten. Am Anfang hatte ich große Angst, dass ich den Aufgaben nicht gewachsen sein würde. Aber mein Chef und meine Kollegen haben mir sehr geholfen, mich schnell einzuarbeiten.",
          "Am liebsten arbeite ich an Projekten für internationale Kunden. Da ich im Studium ein Auslandssemester in Spanien gemacht habe, kann ich jetzt oft meine Spanischkenntnisse im Beruf nutzen. Das macht mir besonders viel Spaß!",
          "Natürlich gibt es auch anstrengende Tage. Wenn wir kurz vor einer Deadline stehen, müssen wir manchmal Überstunden machen. Dafür dürfen wir an ruhigeren Tagen früher nach Hause gehen oder Überstunden als Urlaubstage nehmen.",
          "Seit drei Monaten habe ich außerdem eine neue Aufgabe übernommen: Ich betreue unsere Auszubildenden. Am Anfang war das eine große Herausforderung, weil ich selbst noch nicht so lange in der Firma bin. Aber mittlerweile macht mir die Arbeit mit den jungen Leuten sehr viel Freude.",
          "Mein Ziel für das nächste Jahr ist es, eine Fortbildung im Bereich Digitales Marketing zu machen. Mein Chef hat mir schon versprochen, dass die Firma die Kosten dafür übernimmt!"
        ]
      }
    ],
    "example": {
      "number": 0,
      "question": "Marco arbeitet seit einem Jahr in einer Marketing-Agentur.",
      "answer": "Richtig"
    },
    "questions": [
      {
        "number": 1,
        "question": "Marco hatte zu Beginn Sorgen, dass die Arbeit zu schwer für ihn sein könnte.",
        "answer": "richtig",
        "options": [
          {
            "id": "richtig",
            "label": "Richtig"
          },
          {
            "id": "falsch",
            "label": "Falsch"
          }
        ]
      },
      {
        "number": 2,
        "question": "Im Beruf nutzt Marco seine Spanischkenntnisse nur sehr selten.",
        "answer": "falsch",
        "options": [
          {
            "id": "richtig",
            "label": "Richtig"
          },
          {
            "id": "falsch",
            "label": "Falsch"
          }
        ]
      },
      {
        "number": 3,
        "question": "Wenn Marco Überstunden macht, kann er diese später durch freie Tage ausgleichen.",
        "answer": "richtig",
        "options": [
          {
            "id": "richtig",
            "label": "Richtig"
          },
          {
            "id": "falsch",
            "label": "Falsch"
          }
        ]
      },
      {
        "number": 4,
        "question": "Marco betreut die Auszubildenden seit Beginn seines Studiums.",
        "answer": "falsch",
        "options": [
          {
            "id": "richtig",
            "label": "Richtig"
          },
          {
            "id": "falsch",
            "label": "Falsch"
          }
        ]
      },
      {
        "number": 5,
        "question": "Die Arbeit mit den Auszubildenden gefällt Marco inzwischen gut.",
        "answer": "richtig",
        "options": [
          {
            "id": "richtig",
            "label": "Richtig"
          },
          {
            "id": "falsch",
            "label": "Falsch"
          }
        ]
      },
      {
        "number": 6,
        "question": "Marco muss die Fortbildung im nächsten Jahr selbst bezahlen.",
        "answer": "falsch",
        "options": [
          {
            "id": "richtig",
            "label": "Richtig"
          },
          {
            "id": "falsch",
            "label": "Falsch"
          }
        ]
      }
    ]
  },
  {
    "part": 2,
    "label": "Carsharing und digitales Lernen",
    "format": "a-b-c",
    "timeMinutes": 20,
    "instruction": "Lesen Sie die beiden Zeitungsartikel. Wählen Sie für die Aufgaben 7–12 a, b oder c.",
    "passages": [
      {
        "title": "Text 1 · Carsharing in einer Kleinstadt",
        "isReconstructed": true,
        "paragraphs": [
          "Carsharing gibt es längst nicht mehr nur in großen Städten. Ein Pilotprojekt in der Kleinstadt Menden zeigt nun, dass das gemeinsame Nutzen von Autos auch außerhalb der Metropolen erfolgreich sein kann. Statt selbst einen Wagen zu besitzen, können Bürger für einzelne Fahrten ein Fahrzeug ausleihen.",
          "Die Bürger können die Autos per Smartphone-App buchen und stundenweise mieten. Auf der App sehen sie, wann ein Wagen frei ist und wo er abgeholt werden kann. Besonders Menschen, die nur gelegentlich ein Auto brauchen, finden dieses Angebot praktisch.",
          "Die Nachfrage ist größer als zunächst erwartet. Deshalb plant die Stadtverwaltung, das Angebot im nächsten Jahr um fünf weitere Fahrzeuge zu erweitern. Mit zusätzlichen Standorten soll das Projekt noch mehr Menschen erreichen."
        ]
      },
      {
        "title": "Text 2 · Digitales Lernen im Klassenzimmer",
        "paragraphs": [
          "Eine Realschule in Hessen geht neue Wege im Unterricht: Seit Beginn des Schuljahres arbeiten alle Schülerinnen und Schüler der 8. Klassen mit digitalen Tablets statt mit klassischen Schulbüchern aus Papier. Die Geräte wurden von der Schule angeschafft und den Jugendlichen für das Schuljahr zur Verfügung gestellt.",
          "„Der Unterricht ist durch die Tablets viel flexibler geworden“, berichtet die Deutschlehrerin Sabine Becker. „Wir können im Unterricht sofort Recherchen durchführen, Lernvideos ansehen oder interaktive Übungen machen. Die Schüler sind viel motivierter bei der Sache.“",
          "Dennoch gibt es auch Herausforderungen. Einige Eltern sorgen sich, dass die Kinder zu viel Zeit vor Bildschirmen verbringen oder abgelenkt werden. Die Schulleitung betont jedoch, dass die Tablets streng für Lernzwecke eingerichtet sind: Soziale Netzwerke und Spiele sind während der Schulzeit gesperrt. Zudem lernen die Schüler im Fach Medienkunde, wie man verantwortungsvoll mit digitalen Medien umgeht."
        ]
      }
    ],
    "questions": [
      {
        "number": 7,
        "question": "Text 1: Worum geht es in dem Zeitungsartikel?",
        "answer": "b",
        "options": [
          {
            "id": "a",
            "label": "um strengere Parkregeln in einer Großstadt"
          },
          {
            "id": "b",
            "label": "um die Einführung eines Carsharing-Angebots in einer kleineren Stadt"
          },
          {
            "id": "c",
            "label": "um ein neues Fahrradgeschäft"
          }
        ],
        "textIndex": 0
      },
      {
        "number": 8,
        "question": "Text 1: Wie reservieren die Bürger die Autos?",
        "answer": "b",
        "options": [
          {
            "id": "a",
            "label": "telefonisch im Bürgerbüro"
          },
          {
            "id": "b",
            "label": "über eine Handy-App"
          },
          {
            "id": "c",
            "label": "ausschließlich direkt am Parkplatz"
          }
        ],
        "textIndex": 0
      },
      {
        "number": 9,
        "question": "Text 1: Was plant die Stadtverwaltung für das nächste Jahr?",
        "answer": "c",
        "options": [
          {
            "id": "a",
            "label": "das Projekt einzustellen"
          },
          {
            "id": "b",
            "label": "höhere Mietpreise einzuführen"
          },
          {
            "id": "c",
            "label": "mehr Fahrzeuge für das Projekt anzuschaffen"
          }
        ],
        "textIndex": 0
      },
      {
        "number": 10,
        "question": "Text 2: In diesem Text geht es darum, dass …",
        "answer": "b",
        "options": [
          {
            "id": "a",
            "label": "Schulbücher aus Papier in Zukunft teurer werden."
          },
          {
            "id": "b",
            "label": "eine Schule Tablets im Unterricht einsetzt."
          },
          {
            "id": "c",
            "label": "Lehrer Fortbildungen für Computerkurse besuchen."
          }
        ],
        "textIndex": 1
      },
      {
        "number": 11,
        "question": "Text 2: Die Lehrkraft Sabine Becker findet, dass …",
        "answer": "a",
        "options": [
          {
            "id": "a",
            "label": "die Schüler durch die Geräte motivierter lernen."
          },
          {
            "id": "b",
            "label": "Lernvideos den normalen Unterricht komplett ersetzen sollten."
          },
          {
            "id": "c",
            "label": "die Aufgaben mit Tablets viel schwieriger geworden sind."
          }
        ],
        "textIndex": 1
      },
      {
        "number": 12,
        "question": "Text 2: Damit die Schüler nicht abgelenkt werden, …",
        "answer": "b",
        "options": [
          {
            "id": "a",
            "label": "dürfen die Geräte nur zu Hause verwendet werden."
          },
          {
            "id": "b",
            "label": "sind Spiele und soziale Netzwerke auf den Geräten blockiert."
          },
          {
            "id": "c",
            "label": "kontrollieren die Eltern jeden Tag die Internetnutzung."
          }
        ],
        "textIndex": 1
      }
    ]
  },
  {
    "part": 3,
    "label": "Situationen und Anzeigen zuordnen",
    "format": "matching",
    "timeMinutes": 10,
    "instruction": "Lesen Sie die Situationen 13–19 und die Anzeigen A–H. Welche Anzeige passt? Eine Situation hat keine passende Anzeige: wählen Sie X.",
    "situations": [
      "Markus möchte am Wochenende eine neue Sportart im Freien ausprobieren, ohne einen Jahresvertrag abzuschließen.",
      "Elena sucht für ihre 8-jährige Tochter einen Tanzkurs am Nachmittag.",
      "Stefan möchte sein altes Fahrrad reparieren lassen. Er hat wenig Geld und würde gerne selbst mithelfen.",
      "Julia sucht für ihre neue Wohnung einen gebrauchten Schreibtisch aus Holz.",
      "Thomas möchte Spanisch lernen, kann aber wegen seiner Schichtarbeit nicht zu festen Kurszeiten lernen.",
      "Sarah sucht eine Betreuung für ihren Hund für zwei Wochen während ihres Sommerurlaubs.",
      "Klaus möchte mit Freunden am Samstagabend ein italienisches Restaurant besuchen, in dem Live-Musik gespielt wird."
    ],
    "ads": [
      {
        "id": "A",
        "title": "Fahrrad-Selbsthilfewerkstatt „Rad & Tat“",
        "text": "Wir stellen Werkzeug und professionelle Beratung zur Verfügung. Du reparierst dein Fahrrad selbst – schnell, günstig und gegen eine kleine Spende! Geöffnet: Di & Do 15:00–19:00 Uhr."
      },
      {
        "id": "B",
        "title": "Tanzschule „Ballerina“",
        "text": "Kindertanzen für Mädchen und Jungen von 6 bis 10 Jahren! Spiel, Spaß und Bewegung. Jeden Dienstag und Donnerstag um 15:30 Uhr. Probestunde kostenlos!"
      },
      {
        "id": "C",
        "title": "Sprachen lernen mit „LinguaFlex“",
        "text": "Flexible Online-Spanischkurse rund um die Uhr! Lernen Sie wann und wo Sie wollen mit unseren interaktiven Lektionen. Ideal für Berufstätige mit unregelmäßigen Arbeitszeiten."
      },
      {
        "id": "D",
        "title": "Hundehotel „Pfote & Co.“",
        "text": "Professionelle Urlaubsbetreuung für Ihren Vierbeiner im Grünen. Liebevolle Pflege tageweise oder wochenweise. Jetzt Sommerplätze reservieren!"
      },
      {
        "id": "E",
        "title": "Möbelkiste Secondhand",
        "text": "Große Auswahl an gut erhaltenen gebrauchten Holzmöbeln: Schränke, Esstische und Holzschreibtische zu fairen Preisen. Vorbeikommen und stöbern!"
      },
      {
        "id": "F",
        "title": "Ristorante „La Bella Italia“",
        "text": "Authentische italienische Küche im Stadtzentrum. Jeden Freitagabend frische Pasta und Pizza zu Spezialpreisen. Reservierung empfohlen."
      },
      {
        "id": "G",
        "title": "Kletterschule „Vertical“",
        "text": "Schnupperkurse im Outdoor-Klettern am Samstag & Sonntag! Erleben Sie die Natur aus neuen Höhen. Einzelne Tageskarten ohne Vereinsbindung verfügbar."
      },
      {
        "id": "H",
        "title": "Spanisch Intensivkurs",
        "text": "Präsenzkurs an der Volkshochschule. Jeden Montag und Mittwoch von 18:00 bis 20:00 Uhr. Perfekt für Anfänger und Fortgeschrittene."
      }
    ],
    "questions": [
      {
        "number": 13,
        "question": "Markus – möchte am Wochenende Outdoor-Sport ohne Jahresvertrag ausprobieren.",
        "answer": "G",
        "options": [
          {
            "id": "A",
            "label": "Anzeige A"
          },
          {
            "id": "B",
            "label": "Anzeige B"
          },
          {
            "id": "C",
            "label": "Anzeige C"
          },
          {
            "id": "D",
            "label": "Anzeige D"
          },
          {
            "id": "E",
            "label": "Anzeige E"
          },
          {
            "id": "F",
            "label": "Anzeige F"
          },
          {
            "id": "G",
            "label": "Anzeige G"
          },
          {
            "id": "H",
            "label": "Anzeige H"
          },
          {
            "id": "X",
            "label": "X – keine Anzeige"
          }
        ]
      },
      {
        "number": 14,
        "question": "Elena – sucht einen Tanzkurs für ihre 8-jährige Tochter am Nachmittag.",
        "answer": "B",
        "options": [
          {
            "id": "A",
            "label": "Anzeige A"
          },
          {
            "id": "B",
            "label": "Anzeige B"
          },
          {
            "id": "C",
            "label": "Anzeige C"
          },
          {
            "id": "D",
            "label": "Anzeige D"
          },
          {
            "id": "E",
            "label": "Anzeige E"
          },
          {
            "id": "F",
            "label": "Anzeige F"
          },
          {
            "id": "G",
            "label": "Anzeige G"
          },
          {
            "id": "H",
            "label": "Anzeige H"
          },
          {
            "id": "X",
            "label": "X – keine Anzeige"
          }
        ]
      },
      {
        "number": 15,
        "question": "Stefan – möchte sein Fahrrad günstig selbst reparieren.",
        "answer": "A",
        "options": [
          {
            "id": "A",
            "label": "Anzeige A"
          },
          {
            "id": "B",
            "label": "Anzeige B"
          },
          {
            "id": "C",
            "label": "Anzeige C"
          },
          {
            "id": "D",
            "label": "Anzeige D"
          },
          {
            "id": "E",
            "label": "Anzeige E"
          },
          {
            "id": "F",
            "label": "Anzeige F"
          },
          {
            "id": "G",
            "label": "Anzeige G"
          },
          {
            "id": "H",
            "label": "Anzeige H"
          },
          {
            "id": "X",
            "label": "X – keine Anzeige"
          }
        ]
      },
      {
        "number": 16,
        "question": "Julia – sucht einen gebrauchten Holzschreibtisch.",
        "answer": "E",
        "options": [
          {
            "id": "A",
            "label": "Anzeige A"
          },
          {
            "id": "B",
            "label": "Anzeige B"
          },
          {
            "id": "C",
            "label": "Anzeige C"
          },
          {
            "id": "D",
            "label": "Anzeige D"
          },
          {
            "id": "E",
            "label": "Anzeige E"
          },
          {
            "id": "F",
            "label": "Anzeige F"
          },
          {
            "id": "G",
            "label": "Anzeige G"
          },
          {
            "id": "H",
            "label": "Anzeige H"
          },
          {
            "id": "X",
            "label": "X – keine Anzeige"
          }
        ]
      },
      {
        "number": 17,
        "question": "Thomas – möchte flexibel Spanisch lernen.",
        "answer": "C",
        "options": [
          {
            "id": "A",
            "label": "Anzeige A"
          },
          {
            "id": "B",
            "label": "Anzeige B"
          },
          {
            "id": "C",
            "label": "Anzeige C"
          },
          {
            "id": "D",
            "label": "Anzeige D"
          },
          {
            "id": "E",
            "label": "Anzeige E"
          },
          {
            "id": "F",
            "label": "Anzeige F"
          },
          {
            "id": "G",
            "label": "Anzeige G"
          },
          {
            "id": "H",
            "label": "Anzeige H"
          },
          {
            "id": "X",
            "label": "X – keine Anzeige"
          }
        ]
      },
      {
        "number": 18,
        "question": "Sarah – sucht zwei Wochen Hundebetreuung.",
        "answer": "D",
        "options": [
          {
            "id": "A",
            "label": "Anzeige A"
          },
          {
            "id": "B",
            "label": "Anzeige B"
          },
          {
            "id": "C",
            "label": "Anzeige C"
          },
          {
            "id": "D",
            "label": "Anzeige D"
          },
          {
            "id": "E",
            "label": "Anzeige E"
          },
          {
            "id": "F",
            "label": "Anzeige F"
          },
          {
            "id": "G",
            "label": "Anzeige G"
          },
          {
            "id": "H",
            "label": "Anzeige H"
          },
          {
            "id": "X",
            "label": "X – keine Anzeige"
          }
        ]
      },
      {
        "number": 19,
        "question": "Klaus – sucht ein italienisches Restaurant am Samstagabend mit Live-Musik.",
        "answer": "X",
        "options": [
          {
            "id": "A",
            "label": "Anzeige A"
          },
          {
            "id": "B",
            "label": "Anzeige B"
          },
          {
            "id": "C",
            "label": "Anzeige C"
          },
          {
            "id": "D",
            "label": "Anzeige D"
          },
          {
            "id": "E",
            "label": "Anzeige E"
          },
          {
            "id": "F",
            "label": "Anzeige F"
          },
          {
            "id": "G",
            "label": "Anzeige G"
          },
          {
            "id": "H",
            "label": "Anzeige H"
          },
          {
            "id": "X",
            "label": "X – keine Anzeige"
          }
        ]
      }
    ]
  },
  {
    "part": 4,
    "label": "Smartphone-Verbot an Schulen",
    "format": "ja-nein",
    "timeMinutes": 15,
    "instruction": "Lesen Sie die Kommentare 20–26. Ist die Person für ein vollständiges Smartphone-Verbot an Schulen? Wählen Sie Ja oder Nein.",
    "topic": "Sollten Smartphones an Schulen komplett verboten werden?",
    "editorialNote": "Der gelieferte Beispielkommentar von Niko wurde als Aufgabe 20 übernommen, damit der Leseteil sieben bewertete Aufgaben (20–26) enthält.",
    "comments": [
      {
        "name": "Niko",
        "meta": "Beispielkommentar aus dem gelieferten Material",
        "text": "Smartphones stören den Unterricht ständig. Kinder schauen unter der Bank auf das Display und passen nicht mehr auf. Ein klares Verbot für das gesamte Schulgelände ist die einzig richtige Lösung!"
      },
      {
        "name": "Dagmar",
        "meta": "24, Leipzig",
        "text": "Smartphones gehören heute zum Alltag der Jugendlichen. Statt sie komplett zu verbieten, sollte die Schule den Schülern beibringen, wie man digitale Medien sinnvoll für Referate und Recherchen im Unterricht nutzt."
      },
      {
        "name": "Kathleen",
        "meta": "42, Cuxhaven",
        "text": "Die ständige Ablenkung durch Nachrichten und soziale Medien schadet den Noten massiv. Wenn die Geräte morgens vor der ersten Stunde in Schließfächern abgegeben werden müssen, können sich alle wieder voll auf das Lernen konzentrieren."
      },
      {
        "name": "Marius",
        "meta": "31, St. Gallen",
        "text": "Ich finde ein Komplettverbot übertrieben. In den Pausen sollten Schüler ihre Handys nutzen dürfen, um z. B. ihre Eltern zu kontaktieren oder Musik zu hören. Ein Verbot sollte nur während der Unterrichtszeit gelten."
      },
      {
        "name": "Jonny",
        "meta": "19, Berlin",
        "text": "An unserer Schule gilt seit sechs Monaten ein striktes Smartphone-Verbot – und es funktioniert hervorragend! In den Pausen unterhalten wir uns wieder miteinander oder spielen Tischtennis, statt nur starr auf den Bildschirm zu schauen."
      },
      {
        "name": "Robert",
        "meta": "45, Winterthur",
        "text": "Für Notfälle müssen Eltern ihre Kinder immer erreichen können. Ein absolutes Verbot auf dem Schulgelände halte ich deshalb für falsch und nicht mehr zeitgemäß."
      },
      {
        "name": "Marinette",
        "meta": "38, Frankfurt",
        "text": "Durch Smartphones nimmt das Cybermobbing auf dem Schulhof immer mehr zu. Um die Kinder vor heimlichen Fotos und Ausgrenzung in Klassenchats zu schützen, ist ein Verbot der Geräte an Schulen dringend notwendig."
      }
    ],
    "questions": [
      {
        "number": 20,
        "question": "Niko – Ist diese Person für ein vollständiges Smartphone-Verbot?",
        "answer": "ja",
        "options": [
          {
            "id": "ja",
            "label": "Ja"
          },
          {
            "id": "nein",
            "label": "Nein"
          }
        ]
      },
      {
        "number": 21,
        "question": "Dagmar – Ist diese Person für ein vollständiges Smartphone-Verbot?",
        "answer": "nein",
        "options": [
          {
            "id": "ja",
            "label": "Ja"
          },
          {
            "id": "nein",
            "label": "Nein"
          }
        ]
      },
      {
        "number": 22,
        "question": "Kathleen – Ist diese Person für ein vollständiges Smartphone-Verbot?",
        "answer": "ja",
        "options": [
          {
            "id": "ja",
            "label": "Ja"
          },
          {
            "id": "nein",
            "label": "Nein"
          }
        ]
      },
      {
        "number": 23,
        "question": "Marius – Ist diese Person für ein vollständiges Smartphone-Verbot?",
        "answer": "nein",
        "options": [
          {
            "id": "ja",
            "label": "Ja"
          },
          {
            "id": "nein",
            "label": "Nein"
          }
        ]
      },
      {
        "number": 24,
        "question": "Jonny – Ist diese Person für ein vollständiges Smartphone-Verbot?",
        "answer": "ja",
        "options": [
          {
            "id": "ja",
            "label": "Ja"
          },
          {
            "id": "nein",
            "label": "Nein"
          }
        ]
      },
      {
        "number": 25,
        "question": "Robert – Ist diese Person für ein vollständiges Smartphone-Verbot?",
        "answer": "nein",
        "options": [
          {
            "id": "ja",
            "label": "Ja"
          },
          {
            "id": "nein",
            "label": "Nein"
          }
        ]
      },
      {
        "number": 26,
        "question": "Marinette – Ist diese Person für ein vollständiges Smartphone-Verbot?",
        "answer": "ja",
        "options": [
          {
            "id": "ja",
            "label": "Ja"
          },
          {
            "id": "nein",
            "label": "Nein"
          }
        ]
      }
    ]
  },
  {
    "part": 5,
    "label": "Hausordnung der Volkshochschule",
    "format": "a-b-c",
    "timeMinutes": 10,
    "instruction": "Lesen Sie die Hausordnung der VHS Stadtmitte. Wählen Sie für die Aufgaben 27–30 a, b oder c.",
    "passages": [
      {
        "title": "Hausordnung der Volkshochschule (VHS) Stadtmitte",
        "paragraphs": [
          "Sehr geehrte Kursteilnehmerinnen und Kursteilnehmer, um einen angenehmen und störungsfreien Lernort für alle zu gewährleisten, bitten wir Sie, folgende Regeln einzuhalten:",
          "1. Pünktlichkeit und Raumnutzung: Bitte erscheinen Sie pünktlich zu Unterrichtsbeginn. Ein Wechsel der Kursräume ohne vorherige Genehmigung durch das Sekretariat ist nicht gestattet.",
          "2. Speisen und Getränke: In den Unterrichtsräumen und Computerräumen ist das Essen grundsätzlich untersagt. Getränke dürfen nur in fest verschlossenen Behältern (z. B. Plastik- oder Thermosflaschen) mitgenommen werden. Für Pausen steht Ihnen die Cafeteria im Erdgeschoss zur Verfügung.",
          "3. Nutzung digitaler Geräte: Während des Unterrichts müssen Mobiltelefone ausgeschaltet oder auf stumm geschaltet sein. Das Telefonieren in den Fluren ist während der Kurszeiten leise zu gestalten, um andere Kurse nicht zu stören.",
          "4. Rauchen und Brandschutz: Das Rauchen (auch von E-Zigaretten) ist im gesamten Gebäude sowie direkt vor dem Haupteingang streng verboten. Ein ausgewiesener Raucherbereich befindet sich ausschließlich im Innenhof.",
          "5. Parkmöglichkeiten: Der Parkplatz im Innenhof ist ausschließlich für Dozenten und Mitarbeiter reserviert. Kursteilnehmer werden gebeten, das kostenpflichtige Parkhaus in der Schulstraße (ca. 3 Gehminuten entfernt) zu nutzen."
        ]
      }
    ],
    "questions": [
      {
        "number": 27,
        "question": "In den Unterrichtsräumen …",
        "answer": "a",
        "options": [
          {
            "id": "a",
            "label": "sind Getränke in verschlossenen Flaschen erlaubt."
          },
          {
            "id": "b",
            "label": "darf man kleine Snacks essen."
          },
          {
            "id": "c",
            "label": "sind gar keine Getränke gestattet."
          }
        ]
      },
      {
        "number": 28,
        "question": "Während des Unterrichts …",
        "answer": "b",
        "options": [
          {
            "id": "a",
            "label": "müssen Handys bei der Verwaltung abgegeben werden."
          },
          {
            "id": "b",
            "label": "dürfen Mobiltelefone nicht laut klingeln."
          },
          {
            "id": "c",
            "label": "darf man auf den Fluren unbeschränkt laut telefonieren."
          }
        ]
      },
      {
        "number": 29,
        "question": "Das Rauchen ist erlaubt …",
        "answer": "c",
        "options": [
          {
            "id": "a",
            "label": "direkt vor dem Haupteingang."
          },
          {
            "id": "b",
            "label": "im gesamten Innenhof."
          },
          {
            "id": "c",
            "label": "nur im speziell markierten Bereich im Innenhof."
          }
        ]
      },
      {
        "number": 30,
        "question": "Kursteilnehmer können ihr Auto …",
        "answer": "b",
        "options": [
          {
            "id": "a",
            "label": "kostenlos im Innenhof parken."
          },
          {
            "id": "b",
            "label": "im nahegelegenen Parkhaus abstellen."
          },
          {
            "id": "c",
            "label": "auf den Mitarbeiterparkplätzen parken."
          }
        ]
      }
    ]
  }
]);
const QA_NOTES=Object.freeze([
  "Text 1 in Lesen Teil 2 was provided only through answer rationales; its Menden Carsharing passage and questions 7–9 were reconstructed to match those rationales and require teacher approval.",
  "Lesen Teil 4 supplied only six numbered comments 21–26 and a Niko example. To retain exactly seven scored items, the supplied Niko example is numbered question 20 (not an unscored example)."
]);
const QUESTIONS=Object.freeze(PARTS.flatMap(part=>part.questions.map(item=>({...item,part:part.part}))));
function publicB1Mock3Lesen(){
  return {mockId:"b1-mock-03",level:"B1",section:"lesen",practiceOnly:true,questionCount:30,durationSeconds:65*60,
    parts:PARTS.map(p=>({...p,questions:p.questions.map(({answer,...safe})=>safe)}))};
}
function markB1Mock3Lesen(answers,{allowPartial=false}={}){
  if(!answers||typeof answers!=="object"||Array.isArray(answers))throw Error("Invalid reading answers");
  const keys=Object.keys(answers);
  if(keys.some(k=>!/^([1-9]|[12][0-9]|30)$/.test(k)))throw Error("Unexpected reading question");
  if(!allowPartial&&keys.length!==30)throw Error("Answer all 30 reading questions before submitting.");
  let correct=0;const perPart=PARTS.map(p=>({part:p.part,correct:0,total:p.questions.length}));
  for(const item of QUESTIONS){
    const value=answers[String(item.number)];
    if(value===undefined&&allowPartial)continue;
    if(typeof value!=="string"||!item.options.some(o=>o.id===value))throw Error("Invalid answer for "+item.number);
    if(value===item.answer){correct++;perPart[item.part-1].correct++;}
  }
  return {correct,total:30,percentage:Math.round(correct/30*100),perPart};
}
module.exports={PARTS,QUESTIONS,QA_NOTES,publicB1Mock3Lesen,markB1Mock3Lesen};
