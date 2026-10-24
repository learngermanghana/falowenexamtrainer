"use strict";
// Server-owned keys: do not import this module into the browser bundle.
// Source: teacher-supplied B1 Mock 2 Hören transcripts, question/key files and MP3 paths.
const QUESTIONS = Object.freeze([
  {
    "part": 1,
    "number": 1,
    "kind": "richtig-falsch",
    "question": "Die Vorsorgeuntersuchung findet am Dienstag wie geplant statt.",
    "options": [
      {
        "id": "richtig",
        "label": "Richtig"
      },
      {
        "id": "falsch",
        "label": "Falsch"
      }
    ],
    "answer": "falsch"
  },
  {
    "part": 1,
    "number": 2,
    "kind": "multiple-choice",
    "question": "Wann bietet die Praxis einen neuen Termin an?",
    "options": [
      {
        "id": "a",
        "label": "Am Donnerstag um zehn Uhr."
      },
      {
        "id": "b",
        "label": "Am Dienstag um zehn Uhr."
      },
      {
        "id": "c",
        "label": "Am Freitag um vierzehn Uhr."
      }
    ],
    "answer": "a"
  },
  {
    "part": 1,
    "number": 3,
    "kind": "richtig-falsch",
    "question": "Lena findet den Direktflug am Samstag zu teuer.",
    "options": [
      {
        "id": "richtig",
        "label": "Richtig"
      },
      {
        "id": "falsch",
        "label": "Falsch"
      }
    ],
    "answer": "richtig"
  },
  {
    "part": 1,
    "number": 4,
    "kind": "multiple-choice",
    "question": "Wie viel kostet der günstigere Flug?",
    "options": [
      {
        "id": "a",
        "label": "Hundertachtzig Euro."
      },
      {
        "id": "b",
        "label": "Dreihundert Euro."
      },
      {
        "id": "c",
        "label": "Achtzig Euro."
      }
    ],
    "answer": "a"
  },
  {
    "part": 1,
    "number": 5,
    "kind": "richtig-falsch",
    "question": "Der ICE 582 hält heute nicht in Hannover.",
    "options": [
      {
        "id": "richtig",
        "label": "Richtig"
      },
      {
        "id": "falsch",
        "label": "Falsch"
      }
    ],
    "answer": "richtig"
  },
  {
    "part": 1,
    "number": 6,
    "kind": "multiple-choice",
    "question": "Um wie viele Minuten verzögert sich die Abfahrt voraussichtlich?",
    "options": [
      {
        "id": "a",
        "label": "Zehn Minuten."
      },
      {
        "id": "b",
        "label": "Zwanzig Minuten."
      },
      {
        "id": "c",
        "label": "Dreißig Minuten."
      }
    ],
    "answer": "b"
  },
  {
    "part": 1,
    "number": 7,
    "kind": "richtig-falsch",
    "question": "Markus möchte das Picknick trotz des schlechten Wetters machen.",
    "options": [
      {
        "id": "richtig",
        "label": "Richtig"
      },
      {
        "id": "falsch",
        "label": "Falsch"
      }
    ],
    "answer": "falsch"
  },
  {
    "part": 1,
    "number": 8,
    "kind": "multiple-choice",
    "question": "Was schlägt Markus als Alternative vor?",
    "options": [
      {
        "id": "a",
        "label": "Einen Spaziergang am See."
      },
      {
        "id": "b",
        "label": "Ins Hallenbad gehen oder sich im Café treffen."
      },
      {
        "id": "c",
        "label": "Einen Kinobesuch."
      }
    ],
    "answer": "b"
  },
  {
    "part": 1,
    "number": 9,
    "kind": "richtig-falsch",
    "question": "Die Hotelrezeption ist am Samstag schon um zwölf Uhr besetzt.",
    "options": [
      {
        "id": "richtig",
        "label": "Richtig"
      },
      {
        "id": "falsch",
        "label": "Falsch"
      }
    ],
    "answer": "falsch"
  },
  {
    "part": 1,
    "number": 10,
    "kind": "multiple-choice",
    "question": "Was sollen Gäste tun, wenn sie früher anreisen möchten?",
    "options": [
      {
        "id": "a",
        "label": "Dem Hotel per E-Mail Bescheid geben."
      },
      {
        "id": "b",
        "label": "Ohne Anmeldung direkt einchecken."
      },
      {
        "id": "c",
        "label": "Erst am Sonntag anrufen."
      }
    ],
    "answer": "a"
  },
  {
    "part": 2,
    "number": 11,
    "kind": "multiple-choice",
    "question": "Was empfiehlt der Stadtführer den Teilnehmern für die Tour?",
    "options": [
      {
        "id": "a",
        "label": "Sie sollen bequeme Wanderschuhe und Regenschirme mitbringen."
      },
      {
        "id": "b",
        "label": "Sie sollen auf festes Schuhwerk achten und auf ihre Wertsachen aufpassen."
      },
      {
        "id": "c",
        "label": "Sie sollen im Hotel bleiben und erst am Nachmittag kommen."
      }
    ],
    "answer": "b"
  },
  {
    "part": 2,
    "number": 12,
    "kind": "multiple-choice",
    "question": "Warum ist eine Besichtigung des Alten Rathauses heute nicht möglich?",
    "options": [
      {
        "id": "a",
        "label": "Wegen einer internen Veranstaltung im Gebäude."
      },
      {
        "id": "b",
        "label": "Weil das Rathaus wegen Renovierung komplett geschlossen ist."
      },
      {
        "id": "c",
        "label": "Weil der Eintritt heute viel zu teuer ist."
      }
    ],
    "answer": "a"
  },
  {
    "part": 2,
    "number": 13,
    "kind": "multiple-choice",
    "question": "Was machen die Teilnehmer an der Steinernen Brücke?",
    "options": [
      {
        "id": "a",
        "label": "Sie machen eine Kaffeepause in einem Café."
      },
      {
        "id": "b",
        "label": "Sie genießen den Blick auf die Donau und den Dom."
      },
      {
        "id": "c",
        "label": "Sie kaufen Souvenirs an einem kleinen Stand."
      }
    ],
    "answer": "b"
  },
  {
    "part": 2,
    "number": 14,
    "kind": "multiple-choice",
    "question": "Wo treffen sich alle nach der kurzen Pause am Dom?",
    "options": [
      {
        "id": "a",
        "label": "Am Haupteingang der Dompropstei auf der linken Seite."
      },
      {
        "id": "b",
        "label": "Direkt im Inneren der Kirche vor dem Altar."
      },
      {
        "id": "c",
        "label": "Am Ufer der Donau neben dem Brückmännchen."
      }
    ],
    "answer": "a"
  },
  {
    "part": 2,
    "number": 15,
    "kind": "multiple-choice",
    "question": "Was ist als Abschluss des Rundgangs geplant?",
    "options": [
      {
        "id": "a",
        "label": "Eine Schifffahrt auf der Donau bei Sonnenuntergang."
      },
      {
        "id": "b",
        "label": "Ein gemeinsames Abendessen in einem modernen Restaurant."
      },
      {
        "id": "c",
        "label": "Regensburger Würstchen im historischen Wurstkuchl."
      }
    ],
    "answer": "c"
  },
  {
    "part": 3,
    "number": 16,
    "kind": "richtig-falsch",
    "question": "Die Party findet am kommenden Sonntag statt.",
    "options": [
      {
        "id": "richtig",
        "label": "Richtig"
      },
      {
        "id": "falsch",
        "label": "Falsch"
      }
    ],
    "answer": "falsch"
  },
  {
    "part": 3,
    "number": 17,
    "kind": "richtig-falsch",
    "question": "Fast alle eingeladenen Personen haben zugesagt.",
    "options": [
      {
        "id": "richtig",
        "label": "Richtig"
      },
      {
        "id": "falsch",
        "label": "Falsch"
      }
    ],
    "answer": "richtig"
  },
  {
    "part": 3,
    "number": 18,
    "kind": "richtig-falsch",
    "question": "Das Essen soll selbst gekocht werden.",
    "options": [
      {
        "id": "richtig",
        "label": "Richtig"
      },
      {
        "id": "falsch",
        "label": "Falsch"
      }
    ],
    "answer": "falsch"
  },
  {
    "part": 3,
    "number": 19,
    "kind": "richtig-falsch",
    "question": "Markus kümmert sich um die Getränke.",
    "options": [
      {
        "id": "richtig",
        "label": "Richtig"
      },
      {
        "id": "falsch",
        "label": "Falsch"
      }
    ],
    "answer": "richtig"
  },
  {
    "part": 3,
    "number": 20,
    "kind": "richtig-falsch",
    "question": "Julias Schwester bringt das Partylicht mit.",
    "options": [
      {
        "id": "richtig",
        "label": "Richtig"
      },
      {
        "id": "falsch",
        "label": "Falsch"
      }
    ],
    "answer": "richtig"
  },
  {
    "part": 3,
    "number": 21,
    "kind": "richtig-falsch",
    "question": "Tom stellt seinen eigenen Bluetooth-Lautsprecher für die Musik zur Verfügung.",
    "options": [
      {
        "id": "richtig",
        "label": "Richtig"
      },
      {
        "id": "falsch",
        "label": "Falsch"
      }
    ],
    "answer": "richtig"
  },
  {
    "part": 3,
    "number": 22,
    "kind": "richtig-falsch",
    "question": "Julia holt die Torte am Freitagabend ab.",
    "options": [
      {
        "id": "richtig",
        "label": "Richtig"
      },
      {
        "id": "falsch",
        "label": "Falsch"
      }
    ],
    "answer": "falsch"
  },
  {
    "part": 4,
    "number": 23,
    "kind": "multiple-choice",
    "question": "Wer findet, dass eine Stunde Tablet nach den Pflichten nicht schadet?",
    "options": [
      {
        "id": "a",
        "label": "Moderator B"
      },
      {
        "id": "b",
        "label": "Herr Klein (C)"
      },
      {
        "id": "c",
        "label": "Frau Weber (D)"
      }
    ],
    "answer": "c"
  },
  {
    "part": 4,
    "number": 24,
    "kind": "multiple-choice",
    "question": "Wer erwähnt, dass der ältere Sohn Lern-Apps nutzt?",
    "options": [
      {
        "id": "a",
        "label": "Herr Klein (C)"
      },
      {
        "id": "b",
        "label": "Frau Weber (D)"
      },
      {
        "id": "c",
        "label": "Moderator B"
      }
    ],
    "answer": "a"
  },
  {
    "part": 4,
    "number": 25,
    "kind": "multiple-choice",
    "question": "Wer betont, dass man bei den Spielen genau hinschauen muss?",
    "options": [
      {
        "id": "a",
        "label": "Moderator B"
      },
      {
        "id": "b",
        "label": "Herr Klein (C)"
      },
      {
        "id": "c",
        "label": "Frau Weber (D)"
      }
    ],
    "answer": "c"
  },
  {
    "part": 4,
    "number": 26,
    "kind": "multiple-choice",
    "question": "Wer berichtet über frühere Diskussionen beim Einsammeln der Geräte?",
    "options": [
      {
        "id": "a",
        "label": "Herr Klein (C)"
      },
      {
        "id": "b",
        "label": "Frau Weber (D)"
      },
      {
        "id": "c",
        "label": "Moderator B"
      }
    ],
    "answer": "a"
  },
  {
    "part": 4,
    "number": 27,
    "kind": "multiple-choice",
    "question": "Wer hält Konsequenz für den Schlüssel bei der Mediennutzung?",
    "options": [
      {
        "id": "a",
        "label": "Moderator B"
      },
      {
        "id": "b",
        "label": "Herr Klein (C)"
      },
      {
        "id": "c",
        "label": "Frau Weber (D)"
      }
    ],
    "answer": "c"
  },
  {
    "part": 4,
    "number": 28,
    "kind": "multiple-choice",
    "question": "Wer argumentiert, dass ein kompletter Medienverzicht heute nicht mehr funktioniert?",
    "options": [
      {
        "id": "a",
        "label": "Herr Klein (C)"
      },
      {
        "id": "b",
        "label": "Frau Weber (D)"
      },
      {
        "id": "c",
        "label": "Moderator B"
      }
    ],
    "answer": "a"
  },
  {
    "part": 4,
    "number": 29,
    "kind": "multiple-choice",
    "question": "Wer ist der Meinung, dass man Medienkompetenz am besten gemeinsam lernt?",
    "options": [
      {
        "id": "a",
        "label": "Moderator B"
      },
      {
        "id": "b",
        "label": "Herr Klein (C)"
      },
      {
        "id": "c",
        "label": "Frau Weber (D)"
      }
    ],
    "answer": "c"
  },
  {
    "part": 4,
    "number": 30,
    "kind": "multiple-choice",
    "question": "Wer bedankt sich am Ende bei den Teilnehmern für das Gespräch?",
    "options": [
      {
        "id": "a",
        "label": "Moderator B"
      },
      {
        "id": "b",
        "label": "Herr Klein (C)"
      },
      {
        "id": "c",
        "label": "Frau Weber (D)"
      }
    ],
    "answer": "a"
  }
]);
const PARTS = Object.freeze([
  {part:1, label:"Reisen und Termine", key:"b1/mock-hoeren/mock-02/teil-1.mp3", count:10},
  {part:2, label:"Eine Stadtführung", key:"b1/mock-hoeren/mock-02/teil-2.mp3", count:5},
  {part:3, label:"Ein Fest organisieren", key:"b1/mock-hoeren/mock-02/teil-3.mp3", count:7},
  {part:4, label:"Kinder und Medien", key:"b1/mock-hoeren/mock-02/teil-4.mp3", count:8}
]);
function publicB1Mock2Hoeren() {
  return {
    mockId:"b1-mock-02",level:"B1",section:"hoeren",practiceOnly:true,
    questionCount:30,
    introductionNotice:"Teil 1: Auf dem Bildschirm gibt es zwei Aufgaben zu jedem Text (Richtig/Falsch und a, b oder c). Die ältere Audio-Ansage erwähnt nur eine Aufgabe. Lesen Sie bitte beide sichtbaren Aufgaben. Die gesamte Aufnahme ist bereits zweimal enthalten.",
    parts:PARTS.map(p=>({
      ...p,questions:QUESTIONS.filter(q=>q.part===p.part).map(({answer,...publicQuestion})=>publicQuestion)
    }))
  };
}
function markB1Mock2Hoeren(answers) {
  if(!answers || typeof answers!=="object" || Array.isArray(answers)) throw new Error("Invalid answers");
  if(Object.keys(answers).length!==QUESTIONS.length) throw new Error("Answer all 30 listening questions.");
  let correct=0;
  const perPart=PARTS.map(p=>({part:p.part,correct:0,total:p.count}));
  for(const item of QUESTIONS){
    const value=answers[String(item.number)];
    if(typeof value!=="string" || !item.options.some(o=>o.id===value)) throw new Error("Invalid answer for question "+item.number);
    if(value===item.answer){correct++;perPart[item.part-1].correct++;}
  }
  return {correct,total:QUESTIONS.length,percentage:Math.round(correct/QUESTIONS.length*100),perPart};
}
module.exports={PARTS,QUESTIONS,publicB1Mock2Hoeren,markB1Mock2Hoeren};
