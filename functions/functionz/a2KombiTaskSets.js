'use strict';
// Canonical server-side A2 tasks used for exact AI writing/speaking rubrics.
module.exports=Object.freeze({
  "a2-mock-04": {
    "writing": {
      "teil1": {
        "title": "Teil 1 · Informelle SMS / Kurz-E-Mail",
        "situation": "Ihr Freund Martin hat Sie zum Grillen am Samstag eingeladen. Schreiben Sie eine kurze SMS an Martin (~20–30 Wörter).",
        "points": [
          "Dank für die Einladung",
          "Zusagen (Sie kommen gerne)",
          "Fragen, was Sie mitbringen sollen"
        ],
        "wordMin": 20,
        "wordMax": 30
      },
      "teil2": {
        "title": "Teil 2 · Formelle E-Mail",
        "situation": "Sie haben einen Termin beim Bürgeramt am Dienstag, können aber nicht kommen. Schreiben Sie eine formelle E-Mail (~30–40 Wörter).",
        "points": [
          "Grund für das Schreiben (Termin absagen)",
          "Grund für die Absage (Krankheit/Arbeit)",
          "Bitte um einen neuen Termin"
        ],
        "wordMin": 30,
        "wordMax": 40
      }
    },
    "speaking": {
      "teil1": {
        "title": "Sich vorstellen",
        "prompt": "Name, Alter, Land, Wohnort, Sprachen, Beruf oder Ausbildung, Hobby; antworten Sie auch auf zwei Zusatzfragen."
      },
      "teil2": {
        "title": "Von sich erzählen",
        "theme": "Mein Alltag & Meine Arbeitszeiten",
        "questions": [
          "Wann stehen Sie morgens auf?",
          "Wie fahren Sie zur Arbeit/Schule?",
          "Was machen Sie in der Mittagspause?",
          "Was machen Sie nach Feierabend?"
        ]
      },
      "teil3": {
        "title": "Gemeinsam planen",
        "plan": "Ein gemeinsames Geschenk für einen Arbeitskollegen kaufen.",
        "points": [
          "Was kaufen? (Buch, Gutschein, Blumen?)",
          "Wie viel Geld ausgeben?",
          "Wann und wo einkaufen gehen?"
        ]
      }
    },
    "assessmentVersion": "three-module-v1"
  },
  "a2-mock-05": {
    "writing": {
      "teil1": {
        "title": "Teil 1 · Informelle SMS / Kurz-E-Mail",
        "situation": "Ihr Arbeitskollege Thomas ist krank. Schreiben Sie eine kurze E-Mail an Thomas (~20–30 Wörter).",
        "points": [
          "Gute Besserung wünschen",
          "Fragen, wie es ihm geht",
          "Hilfe beim Einkaufen oder bei der Arbeit anbieten"
        ],
        "wordMin": 20,
        "wordMax": 30
      },
      "teil2": {
        "title": "Teil 2 · Formelle E-Mail",
        "situation": "Sie möchten an einem Kochkurs in der Volkshochschule teilnehmen. Schreiben Sie eine formelle E-Mail (~30–40 Wörter).",
        "points": [
          "Grund für das Schreiben (Anmeldung zum Kurs)",
          "Nach Kursgebühr und Zeiten fragen",
          "Bitte um Anmeldebestätigung"
        ],
        "wordMin": 30,
        "wordMax": 40
      }
    },
    "speaking": {
      "teil1": {
        "title": "Sich vorstellen",
        "prompt": "Name, Alter, Land, Wohnort, Sprachen, Beruf oder Ausbildung, Hobby; antworten Sie auch auf zwei Zusatzfragen."
      },
      "teil2": {
        "title": "Von sich erzählen",
        "theme": "Meine Ernährung & Lieblingsessen",
        "questions": [
          "Was essen Sie gerne zum Frühstück?",
          "Kochen Sie selbst oder essen Sie in der Kantine?",
          "Was ist Ihr Lieblingsgericht?",
          "Was trinken Sie tagsüber am liebsten?"
        ]
      },
      "teil3": {
        "title": "Gemeinsam planen",
        "plan": "Einen gesunden Kochabend bei einem Freund organisieren.",
        "points": [
          "Was kochen? (Suppe, Salat, Pasta?)",
          "Wer kaufe die Zutaten ein?",
          "Wann treffen? (Tag & Uhrzeit)"
        ]
      }
    },
    "assessmentVersion": "three-module-v1"
  },
  "a2-mock-06": {
    "writing": {
      "teil1": {
        "title": "Teil 1 · Informelle SMS / Kurz-E-Mail",
        "situation": "Sie sind vor Kurzem in eine neue Wohnung gezogen und laden Ihre Nachbarin Lisa zum Kaffee ein (~20–30 Wörter).",
        "points": [
          "Grund für das Schreiben (Einladung)",
          "Termin vorschlagen (Tag & Uhrzeit)",
          "Kurze Information zur neuen Wohnung"
        ],
        "wordMin": 20,
        "wordMax": 30
      },
      "teil2": {
        "title": "Teil 2 · Formelle E-Mail",
        "situation": "Die Heizung in Ihrer Mietwohnung funktioniert seit gestern nicht mehr. Schreiben Sie an Ihre Hausverwaltung (~30–40 Wörter).",
        "points": [
          "Problem beschreiben (Heizung kalt)",
          "Dringlichkeit betonen",
          "Um schnellen Handwerkertermin bitten"
        ],
        "wordMin": 30,
        "wordMax": 40
      }
    },
    "speaking": {
      "teil1": {
        "title": "Sich vorstellen",
        "prompt": "Name, Alter, Land, Wohnort, Sprachen, Beruf oder Ausbildung, Hobby; antworten Sie auch auf zwei Zusatzfragen."
      },
      "teil2": {
        "title": "Von sich erzählen",
        "theme": "Mein Wohnort & Meine Wohnung",
        "questions": [
          "Wohnen Sie in einer Wohnung oder in einem Haus?",
          "Wo liegt Ihre Wohnung (Zentrum, Stadtrand)?",
          "Was gefällt Ihnen an Ihrem Wohnort am besten?",
          "Haben Sie einen Balkon oder Garten?"
        ]
      },
      "teil3": {
        "title": "Gemeinsam planen",
        "plan": "Ein Sommerfest mit den Nachbarn im Garten organisieren.",
        "points": [
          "Wann feiern? (Datum & Uhrzeit)",
          "Essen & Getränke organisieren (Grill, Salate)",
          "Tische & Stühle aufbauen"
        ]
      }
    },
    "assessmentVersion": "three-module-v1"
  },
  "a2-mock-07": {
    "writing": {
      "teil1": {
        "title": "Teil 1 · Informelle SMS / Kurz-E-Mail",
        "situation": "Sie sind im Urlaub in Dresden und schreiben Ihrer Kollegin Sarah eine Postkarte / kurze Mail (~20–30 Wörter).",
        "points": [
          "Grüsse aus dem Urlaub",
          "Beschreiben, wie das Wetter ist",
          "Berichten, was Sie besichtigst haben"
        ],
        "wordMin": 20,
        "wordMax": 30
      },
      "teil2": {
        "title": "Teil 2 · Formelle E-Mail",
        "situation": "Sie haben eine Hotelbuchung gemacht, müssen aber Ihre Ankunftszeit ändern. Schreiben Sie eine formelle E-Mail an das Hotel (~30–40 Wörter).",
        "points": [
          "Buchungsnummer nennen",
          "Neue Ankunftszeit mitteilen (spät am Abend)",
          "Fragen, ob der Schlüssel hinterlegt werden kann"
        ],
        "wordMin": 30,
        "wordMax": 40
      }
    },
    "speaking": {
      "teil1": {
        "title": "Sich vorstellen",
        "prompt": "Name, Alter, Land, Wohnort, Sprachen, Beruf oder Ausbildung, Hobby; antworten Sie auch auf zwei Zusatzfragen."
      },
      "teil2": {
        "title": "Von sich erzählen",
        "theme": "Meine Urlaubsreisen & Lieblingsziele",
        "questions": [
          "Wohin fahren Sie am liebsten in den Urlaub?",
          "Reisen Sie lieber im Sommer oder im Winter?",
          "Womit fahren Sie in den Urlaub (Auto, Zug, Flugzeug)?",
          "Was machen Sie im Urlaub am liebsten (Strand, Kultur, Wandern)?"
        ]
      },
      "teil3": {
        "title": "Gemeinsam planen",
        "plan": "Einen Wochenendausflug in eine andere Stadt mit einem Freund",
        "points": [
          "Welches Ziel? (z.B. Berlin oder Hamburg)",
          "Wie anreisen? (Zug oder Auto)",
          "Übernachtung buchen (Hotel oder Jugendherberge)"
        ]
      }
    },
    "assessmentVersion": "three-module-v1"
  },
  "a2-mock-08": {
    "writing": {
      "teil1": {
        "title": "Teil 1 · Informelle SMS / Kurz-E-Mail",
        "situation": "Ihr Freund Jan hat Sie gefragt, ob Sie am Sonntag mit zum Fußballspiel kommen. Schreiben Sie Jan (~20–30 Wörter).",
        "points": [
          "Dank für die Einladung",
          "Zusagen (Sie kommen gerne mit)",
          "Aufregung auf das Spiel ausdrücken"
        ],
        "wordMin": 20,
        "wordMax": 30
      },
      "teil2": {
        "title": "Teil 2 · Formelle E-Mail",
        "situation": "Sie haben eine Frage zu Ihrer Anmeldung im Fitnessstudio. Schreiben Sie eine E-Mail an das Studio (~30–40 Wörter).",
        "points": [
          "Mitgliedsnummer nennen",
          "Fragen zu den Öffnungszeiten am Feiertag",
          "Bitte um kurze Antwort"
        ],
        "wordMin": 30,
        "wordMax": 40
      }
    },
    "speaking": {
      "teil1": {
        "title": "Sich vorstellen",
        "prompt": "Name, Alter, Land, Wohnort, Sprachen, Beruf oder Ausbildung, Hobby; antworten Sie auch auf zwei Zusatzfragen."
      },
      "teil2": {
        "title": "Von sich erzählen",
        "theme": "Meine Hobbys & Sportaktivitäten",
        "questions": [
          "Welche Sportart machen Sie gerne?",
          "Wie oft in der Woche treiben Sie Sport?",
          "Machen Sie lieber Einzelsport oder Mannschaftssport?",
          "Was machen Sie am liebsten am Wochenende?"
        ]
      },
      "teil3": {
        "title": "Gemeinsam planen",
        "plan": "Einen Ausflug in einen Erlebnispark / Zoo organisieren.",
        "points": [
          "Welcher Tag? (Samstag oder Sonntag)",
          "Treffpunkt & Uhrzeit",
          "Tickets im Voraus online kaufen"
        ]
      }
    },
    "assessmentVersion": "three-module-v1"
  }
});
