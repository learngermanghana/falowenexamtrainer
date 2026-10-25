// Imported A1 mock writing/speaking tasks; only prompts, no answer keys.
export const A1_KOMBI_TASK_SETS = Object.freeze({
  "4": {
    "id": "a1-mock-04",
    "level": "A1",
    "mockNumber": 4,
    "writing": {
      "teil1": {
        "scenario": [
          "Ihr Bekannter Marek Nowak kommt aus Polen (Krakau, Ulica Florianska 12). Er ist 30 Jahre alt, verheiratet und hat ein Kind. Er möchte im Goethe-Institut München einen Deutschkurs besuchen. Der Kurs beginnt am 10. November 2025. Seine E-Mail-Adresse lautet: marek.n@mail.pl."
        ],
        "instruction": "Füllen Sie die fünf fehlenden Informationen aus.",
        "formRows": [
          {
            "number": 1,
            "label": "Familienname / Nachname",
            "kind": "input"
          },
          {
            "number": 2,
            "label": "Herkunftsland",
            "kind": "input"
          },
          {
            "number": 3,
            "label": "Familienstand",
            "kind": "input"
          },
          {
            "number": 4,
            "label": "E-Mail-Adresse",
            "kind": "input"
          },
          {
            "number": 5,
            "label": "Gewünschter Kursbeginn",
            "kind": "input"
          }
        ]
      },
      "teil2": {
        "situation": "Sie feiern nächste Woche Ihren Geburtstag und möchten Ihre Kollegin Frau Müller einladen.",
        "instruction": "Schreiben Sie eine E-Mail (ca. 30 Wörter) zu allen drei Punkten.",
        "points": [
          "Grund für das Schreiben (Einladung zum Geburtstag)",
          "Wann und wo die Feier stattfindet (Tag, Uhrzeit, Ort)",
          "Essen / Trinken mitbringen"
        ],
        "reminder": "Vergessen Sie nicht die Anrede, den Gruß und Ihren Namen."
      }
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
  "5": {
    "id": "a1-mock-05",
    "level": "A1",
    "mockNumber": 5,
    "writing": {
      "teil1": {
        "scenario": [
          "Ihre Bekannte Elena Rossi kommt aus Italien (Rom, Via Nazionale 45). Sie ist 28 Jahre alt und ledig. Sie möchte sich in Frankfurt für einen dreimonatigen Fitnesskurs anmelden. Kursbeginn ist am 1. Dezember 2025. Ihre Telefonnummer lautet: 0176-55443322."
        ],
        "instruction": "Füllen Sie die fünf fehlenden Informationen aus.",
        "formRows": [
          {
            "number": 1,
            "label": "Vorname der Teilnehmerin",
            "kind": "input"
          },
          {
            "number": 2,
            "label": "Herkunftsland",
            "kind": "input"
          },
          {
            "number": 3,
            "label": "Wohnort & Adresse",
            "kind": "input"
          },
          {
            "number": 4,
            "label": "Telefonnummer",
            "kind": "input"
          },
          {
            "number": 5,
            "label": "Gewünschter Kursbeginn",
            "kind": "input"
          }
        ]
      },
      "teil2": {
        "situation": "Sie sind krank und können morgen nicht zum Deutschkurs kommen. Schreiben Sie eine E-Mail an Ihre Lehrerin Frau Schmidt.",
        "instruction": "Schreiben Sie eine E-Mail (ca. 30 Wörter) zu allen drei Punkten.",
        "points": [
          "Grund für das Schreiben (Entschuldigung für das Fehlen)",
          "Warum können Sie nicht kommen? (Krankheit / Arzttermin)",
          "Bitte um Hausaufgaben"
        ],
        "reminder": "Vergessen Sie nicht die Anrede, den Gruß und Ihren Namen."
      }
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
  "6": {
    "id": "a1-mock-06",
    "level": "A1",
    "mockNumber": 6,
    "writing": {
      "teil1": {
        "scenario": [
          "Ihr Bekannter David Smith kommt aus England (London, 12 Baker Street). Er ist 32 Jahre alt, verheiratet und von Beruf Journalist. Er möchte in Berlin einen Bibliotheksausweis bei der Stadtbibliothek beantragen. Seine E-Mail-Adresse lautet: david.smith@email.uk."
        ],
        "instruction": "Füllen Sie die fünf fehlenden Informationen aus.",
        "formRows": [
          {
            "number": 1,
            "label": "Familienname / Nachname",
            "kind": "input"
          },
          {
            "number": 2,
            "label": "Herkunftsland",
            "kind": "input"
          },
          {
            "number": 3,
            "label": "Beruf",
            "kind": "input"
          },
          {
            "number": 4,
            "label": "E-Mail-Adresse",
            "kind": "input"
          },
          {
            "number": 5,
            "label": "Familienstand",
            "kind": "input"
          }
        ]
      },
      "teil2": {
        "situation": "Sie haben im Internet eine schöne 2-Zimmer-Wohnung gesehen und möchten sie besichtigen. Schreiben Sie eine E-Mail an den Vermieter Herrn Schneider.",
        "instruction": "Schreiben Sie eine E-Mail (ca. 30 Wörter) zu allen drei Punkten.",
        "points": [
          "Grund für das Schreiben (Interesse an der Wohnung)",
          "Angaben zu Ihrer Person (Beruf, Personenzahl)",
          "Frage nach einem Besichtigungstermin"
        ],
        "reminder": "Vergessen Sie nicht die Anrede, den Gruß und Ihren Namen."
      }
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
  "7": {
    "id": "a1-mock-07",
    "level": "A1",
    "mockNumber": 7,
    "writing": {
      "teil1": {
        "scenario": [
          "Ihre Bekannte Claire Dubois kommt aus Frankreich (Lyon, Rue de la République 10). Sie ist 26 Jahre alt und ledig. Sie möchte sich in Stuttgart für einen Wochenende-Fotoworkshop anmelden. Ihre E-Mail-Adresse lautet: claire.d@service.fr. Workshop-Datum: 15. November 2025."
        ],
        "instruction": "Füllen Sie die fünf fehlenden Informationen aus.",
        "formRows": [
          {
            "number": 1,
            "label": "Vorname der Teilnehmerin",
            "kind": "input"
          },
          {
            "number": 2,
            "label": "Herkunftsland",
            "kind": "input"
          },
          {
            "number": 3,
            "label": "Familienstand",
            "kind": "input"
          },
          {
            "number": 4,
            "label": "E-Mail-Adresse",
            "kind": "input"
          },
          {
            "number": 5,
            "label": "Datum des Workshops",
            "kind": "input"
          }
        ]
      },
      "teil2": {
        "situation": "Sie haben online ein Fahrrad gekauft, aber es wurde beschädigt geliefert. Schreiben Sie eine E-Mail an den Kundenservice des Händlers.",
        "instruction": "Schreiben Sie eine E-Mail (ca. 30 Wörter) zu allen drei Punkten.",
        "points": [
          "Grund für das Schreiben (Reklamation defektes Fahrrad)",
          "Was genau beschädigt ist (z. B. Bremse / Rad kaputt)",
          "Bitte um Reparatur oder neues Fahrrad"
        ],
        "reminder": "Vergessen Sie nicht die Anrede, den Gruß und Ihren Namen."
      }
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
  "8": {
    "id": "a1-mock-08",
    "level": "A1",
    "mockNumber": 8,
    "writing": {
      "teil1": {
        "scenario": [
          "Maria Rossi wohnt in der Goethestraße 12, 80333 München. Sie ist 28 Jahre alt, verheiratet und von Beruf Buchhalterin. Sie möchte ab dem 1. März einen Abendkurs Spanisch für Anfänger (A1) besuchen. Sie bezahlt die Kursgebühr von 120 Euro per Banküberweisung."
        ],
        "instruction": "Füllen Sie die fünf fehlenden Informationen aus.",
        "formRows": [
          {
            "number": 1,
            "label": "PLZ, Wohnort",
            "kind": "input"
          },
          {
            "number": 2,
            "label": "Beruf",
            "kind": "input"
          },
          {
            "number": 3,
            "label": "Gewünschter Kurs",
            "kind": "input"
          },
          {
            "number": 4,
            "label": "Kursbeginn",
            "kind": "input"
          },
          {
            "number": 5,
            "label": "Zahlungsart",
            "kind": "input"
          }
        ]
      },
      "teil2": {
        "situation": "Sie haben nächste Woche einen Termin beim Arzt (Herrn Dr. Berger). Sie können aber nicht kommen, weil Sie arbeiten müssen. Schreiben Sie eine E-Mail an die Arztpraxis.",
        "instruction": "Schreiben Sie eine E-Mail (ca. 30 Wörter) zu allen drei Punkten.",
        "points": [
          "Grund für Ihr Schreiben (Termin absagen)",
          "Warum können Sie nicht kommen? (Arbeit)",
          "Bitte um neuen Termin (Vorschlag für Tag/Uhrzeit)"
        ],
        "reminder": "Vergessen Sie nicht die Anrede, den Gruß und Ihren Namen."
      }
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
