"use strict";
// Server-owned form keys and AI marking tasks for A1 Mocks 4–8.
module.exports = Object.freeze({
  "a1-mock-04": {
    "form": [
      {
        "number": 1,
        "answer": "Nowak"
      },
      {
        "number": 2,
        "answer": "Polen"
      },
      {
        "number": 3,
        "answer": "verheiratet"
      },
      {
        "number": 4,
        "answer": "marek.n@mail.pl"
      },
      {
        "number": 5,
        "answer": "10.11.2025"
      }
    ],
    "writing": {
      "situation": "Sie feiern nächste Woche Ihren Geburtstag und möchten Ihre Kollegin Frau Müller einladen.",
      "points": [
        "Grund für das Schreiben (Einladung zum Geburtstag)",
        "Wann und wo die Feier stattfindet (Tag, Uhrzeit, Ort)",
        "Essen / Trinken mitbringen"
      ]
    },
    "speaking": {
      "durationSeconds": 900,
      "maxScore": 25,
      "passScore": 15,
      "tasks": [
        {
          "id": "teil1",
          "teil": "1",
          "title": "Teil 1 · Sich vorstellen",
          "context": "Persönliche Vorstellung",
          "maxRecordingSeconds": 90,
          "prompt": "Stellen Sie sich vor: Name, Alter, Land, Wohnort, Sprachen, Beruf und Hobby. Buchstabieren Sie auch Ihren Namen und nennen Sie eine Telefonnummer.",
          "card": [
            "Name",
            "Alter",
            "Land",
            "Wohnort",
            "Sprachen",
            "Beruf",
            "Hobby"
          ],
          "followUp": "Können Sie Ihren Nachnamen buchstabieren? Wie lautet Ihre Telefonnummer?"
        },
        {
          "id": "teil2",
          "teil": "2",
          "title": "Teil 2 · Informationen erfragen",
          "context": "Thema: Einkaufen",
          "maxRecordingSeconds": 60,
          "prompt": "Stellen Sie eine passende Frage zum Thema Einkaufen, Wort: Supermarkt. Reagieren Sie auf die Antwort.",
          "keyword": "Supermarkt",
          "cards": [
            "Supermarkt",
            "Brot",
            "Obst",
            "Preis"
          ]
        },
        {
          "id": "teil3",
          "teil": "3",
          "title": "Teil 3 · Eine Bitte formulieren",
          "context": "Höfliche Bitte",
          "maxRecordingSeconds": 60,
          "prompt": "Formulieren Sie eine höfliche Bitte zu: Wasserglas. Reagieren Sie höflich auf die Bitte.",
          "keyword": "Wasserglas",
          "cards": [
            "Wasserglas",
            "Stift / Kugelschreiber",
            "Wörterbuch",
            "Fenster"
          ]
        }
      ]
    }
  },
  "a1-mock-05": {
    "form": [
      {
        "number": 1,
        "answer": "Elena"
      },
      {
        "number": 2,
        "answer": "Italien"
      },
      {
        "number": 3,
        "answer": "Rom, Via Nazionale 45"
      },
      {
        "number": 4,
        "answer": "0176-55443322"
      },
      {
        "number": 5,
        "answer": "01.12.2025"
      }
    ],
    "writing": {
      "situation": "Sie sind krank und können morgen nicht zum Deutschkurs kommen. Schreiben Sie eine E-Mail an Ihre Lehrerin Frau Schmidt.",
      "points": [
        "Grund für das Schreiben (Entschuldigung für das Fehlen)",
        "Warum können Sie nicht kommen? (Krankheit / Arzttermin)",
        "Bitte um Hausaufgaben"
      ]
    },
    "speaking": {
      "durationSeconds": 900,
      "maxScore": 25,
      "passScore": 15,
      "tasks": [
        {
          "id": "teil1",
          "teil": "1",
          "title": "Teil 1 · Sich vorstellen",
          "context": "Persönliche Vorstellung",
          "maxRecordingSeconds": 90,
          "prompt": "Stellen Sie sich vor: Name, Alter, Land, Wohnort, Sprachen, Beruf und Hobby. Buchstabieren Sie auch Ihren Namen und nennen Sie eine Telefonnummer.",
          "card": [
            "Name",
            "Alter",
            "Land",
            "Wohnort",
            "Sprachen",
            "Beruf",
            "Hobby"
          ],
          "followUp": "Können Sie Ihren Nachnamen buchstabieren? Wie lautet Ihre Telefonnummer?"
        },
        {
          "id": "teil2",
          "teil": "2",
          "title": "Teil 2 · Informationen erfragen",
          "context": "Thema: Freizeit und Hobbys",
          "maxRecordingSeconds": 60,
          "prompt": "Stellen Sie eine passende Frage zum Thema Freizeit und Hobbys, Wort: Sport. Reagieren Sie auf die Antwort.",
          "keyword": "Sport",
          "cards": [
            "Sport",
            "Wochenende",
            "Musik",
            "Kino"
          ]
        },
        {
          "id": "teil3",
          "teil": "3",
          "title": "Teil 3 · Eine Bitte formulieren",
          "context": "Höfliche Bitte",
          "maxRecordingSeconds": 60,
          "prompt": "Formulieren Sie eine höfliche Bitte zu: Handy / Telefon. Reagieren Sie höflich auf die Bitte.",
          "keyword": "Handy / Telefon",
          "cards": [
            "Handy / Telefon",
            "Uhrzeit / Armbanduhr",
            "Speisekarte",
            "Fahrkarte / Ticket"
          ]
        }
      ]
    }
  },
  "a1-mock-06": {
    "form": [
      {
        "number": 1,
        "answer": "Smith"
      },
      {
        "number": 2,
        "answer": "England / Großbritannien"
      },
      {
        "number": 3,
        "answer": "Journalist"
      },
      {
        "number": 4,
        "answer": "david.smith@email.uk"
      },
      {
        "number": 5,
        "answer": "verheiratet"
      }
    ],
    "writing": {
      "situation": "Sie haben im Internet eine schöne 2-Zimmer-Wohnung gesehen und möchten sie besichtigen. Schreiben Sie eine E-Mail an den Vermieter Herrn Schneider.",
      "points": [
        "Grund für das Schreiben (Interesse an der Wohnung)",
        "Angaben zu Ihrer Person (Beruf, Personenzahl)",
        "Frage nach einem Besichtigungstermin"
      ]
    },
    "speaking": {
      "durationSeconds": 900,
      "maxScore": 25,
      "passScore": 15,
      "tasks": [
        {
          "id": "teil1",
          "teil": "1",
          "title": "Teil 1 · Sich vorstellen",
          "context": "Persönliche Vorstellung",
          "maxRecordingSeconds": 90,
          "prompt": "Stellen Sie sich vor: Name, Alter, Land, Wohnort, Sprachen, Beruf und Hobby. Buchstabieren Sie auch Ihren Namen und nennen Sie eine Telefonnummer.",
          "card": [
            "Name",
            "Alter",
            "Land",
            "Wohnort",
            "Sprachen",
            "Beruf",
            "Hobby"
          ],
          "followUp": "Können Sie Ihren Nachnamen buchstabieren? Wie lautet Ihre Telefonnummer?"
        },
        {
          "id": "teil2",
          "teil": "2",
          "title": "Teil 2 · Informationen erfragen",
          "context": "Thema: Essen und Trinken",
          "maxRecordingSeconds": 60,
          "prompt": "Stellen Sie eine passende Frage zum Thema Essen und Trinken, Wort: Lieblingsessen. Reagieren Sie auf die Antwort.",
          "keyword": "Lieblingsessen",
          "cards": [
            "Lieblingsessen",
            "Restaurant",
            "Kaffee",
            "Frühstück"
          ]
        },
        {
          "id": "teil3",
          "teil": "3",
          "title": "Teil 3 · Eine Bitte formulieren",
          "context": "Höfliche Bitte",
          "maxRecordingSeconds": 60,
          "prompt": "Formulieren Sie eine höfliche Bitte zu: Rechnung im Restaurant. Reagieren Sie höflich auf die Bitte.",
          "keyword": "Rechnung im Restaurant",
          "cards": [
            "Rechnung im Restaurant",
            "Salzstreuer",
            "Tasse Kaffee",
            "Kassenbon / Quittung"
          ]
        }
      ]
    }
  },
  "a1-mock-07": {
    "form": [
      {
        "number": 1,
        "answer": "Claire"
      },
      {
        "number": 2,
        "answer": "Frankreich"
      },
      {
        "number": 3,
        "answer": "ledig"
      },
      {
        "number": 4,
        "answer": "claire.d@service.fr"
      },
      {
        "number": 5,
        "answer": "15.11.2025"
      }
    ],
    "writing": {
      "situation": "Sie haben online ein Fahrrad gekauft, aber es wurde beschädigt geliefert. Schreiben Sie eine E-Mail an den Kundenservice des Händlers.",
      "points": [
        "Grund für das Schreiben (Reklamation defektes Fahrrad)",
        "Was genau beschädigt ist (z. B. Bremse / Rad kaputt)",
        "Bitte um Reparatur oder neues Fahrrad"
      ]
    },
    "speaking": {
      "durationSeconds": 900,
      "maxScore": 25,
      "passScore": 15,
      "tasks": [
        {
          "id": "teil1",
          "teil": "1",
          "title": "Teil 1 · Sich vorstellen",
          "context": "Persönliche Vorstellung",
          "maxRecordingSeconds": 90,
          "prompt": "Stellen Sie sich vor: Name, Alter, Land, Wohnort, Sprachen, Beruf und Hobby. Buchstabieren Sie auch Ihren Namen und nennen Sie eine Telefonnummer.",
          "card": [
            "Name",
            "Alter",
            "Land",
            "Wohnort",
            "Sprachen",
            "Beruf",
            "Hobby"
          ],
          "followUp": "Können Sie Ihren Nachnamen buchstabieren? Wie lautet Ihre Telefonnummer?"
        },
        {
          "id": "teil2",
          "teil": "2",
          "title": "Teil 2 · Informationen erfragen",
          "context": "Thema: Wohnen und Stadt",
          "maxRecordingSeconds": 60,
          "prompt": "Stellen Sie eine passende Frage zum Thema Wohnen und Stadt, Wort: Wohnung. Reagieren Sie auf die Antwort.",
          "keyword": "Wohnung",
          "cards": [
            "Wohnung",
            "Balkon",
            "Stadtmitte",
            "Nachbarn"
          ]
        },
        {
          "id": "teil3",
          "teil": "3",
          "title": "Teil 3 · Eine Bitte formulieren",
          "context": "Höfliche Bitte",
          "maxRecordingSeconds": 60,
          "prompt": "Formulieren Sie eine höfliche Bitte zu: Kugelschreiber. Reagieren Sie höflich auf die Bitte.",
          "keyword": "Kugelschreiber",
          "cards": [
            "Kugelschreiber",
            "Zimmertür",
            "Rechnung",
            "Wasserflasche"
          ]
        }
      ]
    }
  },
  "a1-mock-08": {
    "form": [
      {
        "number": 1,
        "answer": "80333 München"
      },
      {
        "number": 2,
        "answer": "Buchhalterin"
      },
      {
        "number": 3,
        "answer": "Spanisch A1 (Abendkurs)"
      },
      {
        "number": 4,
        "answer": "1. März"
      },
      {
        "number": 5,
        "answer": "Überweisung"
      }
    ],
    "writing": {
      "situation": "Sie haben nächste Woche einen Termin beim Arzt (Herrn Dr. Berger). Sie können aber nicht kommen, weil Sie arbeiten müssen. Schreiben Sie eine E-Mail an die Arztpraxis.",
      "points": [
        "Grund für Ihr Schreiben (Termin absagen)",
        "Warum können Sie nicht kommen? (Arbeit)",
        "Bitte um neuen Termin (Vorschlag für Tag/Uhrzeit)"
      ]
    },
    "speaking": {
      "durationSeconds": 900,
      "maxScore": 25,
      "passScore": 15,
      "tasks": [
        {
          "id": "teil1",
          "teil": "1",
          "title": "Teil 1 · Sich vorstellen",
          "context": "Persönliche Vorstellung",
          "maxRecordingSeconds": 90,
          "prompt": "Stellen Sie sich vor: Name, Alter, Land, Wohnort, Sprachen, Beruf und Hobby. Buchstabieren Sie auch Ihren Namen und nennen Sie eine Telefonnummer.",
          "card": [
            "Name",
            "Alter",
            "Land",
            "Wohnort",
            "Sprachen",
            "Beruf",
            "Hobby"
          ],
          "followUp": "Können Sie Ihren Nachnamen buchstabieren? Wie lautet Ihre Telefonnummer?"
        },
        {
          "id": "teil2",
          "teil": "2",
          "title": "Teil 2 · Informationen erfragen",
          "context": "Thema: Essen & Trinken, Einkaufen, Freizeit, Wohnen",
          "maxRecordingSeconds": 60,
          "prompt": "Stellen Sie eine passende Frage zum Thema Essen & Trinken, Einkaufen, Freizeit, Wohnen, Wort: Frühstück. Reagieren Sie auf die Antwort.",
          "keyword": "Frühstück",
          "cards": [
            "Frühstück",
            "Supermarkt",
            "Wochenende",
            "Balkon"
          ]
        },
        {
          "id": "teil3",
          "teil": "3",
          "title": "Teil 3 · Eine Bitte formulieren",
          "context": "Höfliche Bitte",
          "maxRecordingSeconds": 60,
          "prompt": "Formulieren Sie eine höfliche Bitte zu: Kugelschreiber. Reagieren Sie höflich auf die Bitte.",
          "keyword": "Kugelschreiber",
          "cards": [
            "Kugelschreiber",
            "Fenster",
            "Rechnung",
            "Uhrzeit"
          ]
        }
      ]
    }
  }
});
