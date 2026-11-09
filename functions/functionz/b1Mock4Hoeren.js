"use strict";
// B1 Mock 04 teacher-uploaded original Hören (30 tasks, 10/5/7/8).
// Learner payload omits the private answer field. R2 keys are planned,
// not evidence that the recordings have been uploaded.
const PARTS=Object.freeze([
  {
    "part": 1,
    "label": "Fünf Alltagstexte",
    "key": "b1/mock-hoeren/mock-04/teil-1.mp3",
    "count": 10,
    "instruction": "Sie hören fünf kurze Texte. Beantworten Sie pro Text eine Richtig/Falsch-Aussage und eine ergänzende Auswahlfrage. Die Ansage erwähnt nur die Richtig/Falsch-Aufgabe."
  },
  {
    "part": 2,
    "label": "Durchsage am Hauptbahnhof Köln",
    "key": "b1/mock-hoeren/mock-04/teil-2.mp3",
    "count": 5,
    "instruction": "Sie hören eine Durchsage einmal. Wählen Sie für jede Frage a, b oder c."
  },
  {
    "part": 3,
    "label": "Gespräch über Sommerurlaub",
    "key": "b1/mock-hoeren/mock-04/teil-3.mp3",
    "count": 7,
    "instruction": "Jonas und Maria planen ihren Sommerurlaub. Entscheiden Sie bei jeder Aussage: Richtig oder Falsch."
  },
  {
    "part": 4,
    "label": "Podcast: Urlaub zu Hause oder in der Ferne",
    "key": "b1/mock-hoeren/mock-04/teil-4.mp3",
    "count": 8,
    "instruction": "Sie hören eine Podiumsdiskussion mit Claudia Weber, Thomas Koch und einem Moderator. Wählen Sie pro Aussage die passende Person aus den angegebenen Antworten."
  }
]);
const QUESTIONS=Object.freeze([
  {
    "part": 1,
    "number": 1,
    "kind": "richtig-falsch",
    "question": "Die Praxis ruft an, weil der Arzttermin am Dienstag stattfinden kann.",
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
    "question": "Warum ruft die Praxis Dr. Weber an?",
    "options": [
      {
        "id": "a",
        "label": "Um den Termin am Dienstag wegen Erkrankung abzusagen"
      },
      {
        "id": "b",
        "label": "Um den Termin um eine Stunde zu verschieben"
      },
      {
        "id": "c",
        "label": "Um zu fragen, ob der Patient früher kommen kann"
      }
    ],
    "answer": "a"
  },
  {
    "part": 1,
    "number": 3,
    "kind": "richtig-falsch",
    "question": "Lukas lädt Maria zu einer gemeinsamen Wanderung am Wochenende ein.",
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
    "question": "Was plant Lukas am Wochenende?",
    "options": [
      {
        "id": "a",
        "label": "Eine Fahrradtour durch den Harz"
      },
      {
        "id": "b",
        "label": "Einen Ausflug in den Harz zum Wandern"
      },
      {
        "id": "c",
        "label": "Ein Treffen am Hauptbahnhof ohne Wanderung"
      }
    ],
    "answer": "b"
  },
  {
    "part": 1,
    "number": 5,
    "kind": "richtig-falsch",
    "question": "Der Regionalexpress nach München hat technische Probleme mit den Türen.",
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
    "question": "Warum hat der Regionalexpress nach München Verspätung?",
    "options": [
      {
        "id": "a",
        "label": "Wegen einer Signalstörung auf der Strecke"
      },
      {
        "id": "b",
        "label": "Wegen schlechten Wetters und Schnee"
      },
      {
        "id": "c",
        "label": "Wegen einer kurzfristigen Reparatur an den Türen"
      }
    ],
    "answer": "c"
  },
  {
    "part": 1,
    "number": 7,
    "kind": "richtig-falsch",
    "question": "Anna ruft ihren Vater an, weil sie die Einkaufsliste komplett auswendig weiß.",
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
    "question": "Welche Käsesorten erwähnt Anna im Supermarkt?",
    "options": [
      {
        "id": "a",
        "label": "Den teuren Bergkäse oder den normalen Gouda"
      },
      {
        "id": "b",
        "label": "Den billigen Schafskäse oder Mozzarella"
      },
      {
        "id": "c",
        "label": "Guten Bergkäse oder alten Schnittkäse"
      }
    ],
    "answer": "a"
  },
  {
    "part": 1,
    "number": 9,
    "kind": "richtig-falsch",
    "question": "Der Kurs für Kreatives Schreiben bekommt einen neuen Raum im Erdgeschoss.",
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
    "number": 10,
    "kind": "multiple-choice",
    "question": "Wohin wird der Kursraum für „Kreatives Schreiben“ verlegt?",
    "options": [
      {
        "id": "a",
        "label": "In den Raum 204 im ersten Stock"
      },
      {
        "id": "b",
        "label": "In den großen Konferenzraum im Erdgeschoss"
      },
      {
        "id": "c",
        "label": "In ein Gebäude außerhalb der Volkshochschule"
      }
    ],
    "answer": "b"
  },
  {
    "part": 2,
    "number": 11,
    "kind": "multiple-choice",
    "question": "Warum verspätet sich der Intercity 2155?",
    "options": [
      {
        "id": "a",
        "label": "Wegen einer kurzfristigen Signalstörung"
      },
      {
        "id": "b",
        "label": "Wegen schlechten Wetters und Sturmes"
      },
      {
        "id": "c",
        "label": "Wegen Bauarbeiten an den Gleisen"
      }
    ],
    "answer": "a"
  },
  {
    "part": 2,
    "number": 12,
    "kind": "multiple-choice",
    "question": "An welchem Gleis fährt der Intercity ab?",
    "options": [
      {
        "id": "a",
        "label": "An Gleis vier"
      },
      {
        "id": "b",
        "label": "An Gleis sechs"
      },
      {
        "id": "c",
        "label": "An Gleis zwei"
      }
    ],
    "answer": "b"
  },
  {
    "part": 2,
    "number": 13,
    "kind": "multiple-choice",
    "question": "Was müssen Reisende mit schwerem Gepäck beachten?",
    "options": [
      {
        "id": "a",
        "label": "Sie sollen den Fahrstuhl am Mittelbahnsteig nutzen."
      },
      {
        "id": "b",
        "label": "Sie bekommen Hilfe von einem Mitarbeiter."
      },
      {
        "id": "c",
        "label": "Sie müssen die Rolltreppen am nördlichen Ausgang benutzen."
      }
    ],
    "answer": "c"
  },
  {
    "part": 2,
    "number": 14,
    "kind": "multiple-choice",
    "question": "Wann fährt der Regionalexpress nach Düsseldorf ab?",
    "options": [
      {
        "id": "a",
        "label": "Um 14 Uhr 12"
      },
      {
        "id": "b",
        "label": "Um 14 Uhr 25"
      },
      {
        "id": "c",
        "label": "Um 15 Uhr 00"
      }
    ],
    "answer": "a"
  },
  {
    "part": 2,
    "number": 15,
    "kind": "multiple-choice",
    "question": "Was verteilt das Service-Team am Informationsstand?",
    "options": [
      {
        "id": "a",
        "label": "Kaffee und Kuchen"
      },
      {
        "id": "b",
        "label": "Kostenlose Wasserflaschen"
      },
      {
        "id": "c",
        "label": "Regenschirme und Taschen"
      }
    ],
    "answer": "b"
  },
  {
    "part": 3,
    "number": 16,
    "kind": "richtig-falsch",
    "question": "Jonas möchte im Sommer unbedingt eine Woche in den Alpen wandern.",
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
    "number": 17,
    "kind": "richtig-falsch",
    "question": "Maria findet Wandern bei der Sommerhitze sehr anstrengend.",
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
    "question": "Jonas möchte am liebsten den ganzen Tag faul in der Sonne liegen.",
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
    "question": "In Kroatien kann man laut Maria auch Kajak fahren.",
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
    "question": "Jonas findet die Idee mit dem Kajakfahren auf dem Meer langweilig.",
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
    "number": 21,
    "kind": "richtig-falsch",
    "question": "Eine Woche in der Pension kostet pro Person etwa sechshundert Euro.",
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
    "question": "Maria möchte mit der Flugbuchung noch bis nächste Woche warten.",
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
    "question": "Wer hat sich bewusst gegen eine Reise und für Urlaub zu Hause entschieden?",
    "options": [
      {
        "id": "a",
        "label": "Moderator B"
      },
      {
        "id": "b",
        "label": "Claudia Weber"
      },
      {
        "id": "c",
        "label": "Thomas Koch"
      }
    ],
    "answer": "b"
  },
  {
    "part": 4,
    "number": 24,
    "kind": "multiple-choice",
    "question": "Wer begründet den Urlaub zu Hause unter anderem damit, dass man dadurch Geld spart?",
    "options": [
      {
        "id": "a",
        "label": "Claudia Weber"
      },
      {
        "id": "b",
        "label": "Thomas Koch"
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
    "question": "Wer findet, dass ein echter Urlaub unbedingt einen Ortswechsel erfordert?",
    "options": [
      {
        "id": "a",
        "label": "Thomas Koch"
      },
      {
        "id": "b",
        "label": "Claudia Weber"
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
    "number": 26,
    "kind": "multiple-choice",
    "question": "Wer plant als nächstes eine Reise nach Südostasien?",
    "options": [
      {
        "id": "a",
        "label": "Claudia Weber"
      },
      {
        "id": "b",
        "label": "Moderator B"
      },
      {
        "id": "c",
        "label": "Thomas Koch"
      }
    ],
    "answer": "c"
  },
  {
    "part": 4,
    "number": 27,
    "kind": "multiple-choice",
    "question": "Wer betrachtet den langen Flug selbst als einen Teil des Abenteuers?",
    "options": [
      {
        "id": "a",
        "label": "Moderator B"
      },
      {
        "id": "b",
        "label": "Thomas Koch"
      },
      {
        "id": "c",
        "label": "Claudia Weber"
      }
    ],
    "answer": "b"
  },
  {
    "part": 4,
    "number": 28,
    "kind": "multiple-choice",
    "question": "Wer hat während des Urlaubs Ausflüge in die nähere Umgebung gemacht?",
    "options": [
      {
        "id": "a",
        "label": "Claudia Weber"
      },
      {
        "id": "b",
        "label": "Thomas Koch"
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
    "question": "Wer hält den Jahresurlaub für die wichtigste Investition in die persönliche Lebensqualität?",
    "options": [
      {
        "id": "a",
        "label": "Claudia Weber"
      },
      {
        "id": "b",
        "label": "Moderator B"
      },
      {
        "id": "c",
        "label": "Thomas Koch"
      }
    ],
    "answer": "c"
  },
  {
    "part": 4,
    "number": 30,
    "kind": "multiple-choice",
    "question": "Wer moderiert die Diskussion?",
    "options": [
      {
        "id": "a",
        "label": "Claudia Weber"
      },
      {
        "id": "b",
        "label": "Thomas Koch"
      },
      {
        "id": "c",
        "label": "Moderator B"
      }
    ],
    "answer": "c"
  }
]);
const EXPECTED=[10,5,7,8];
if(PARTS.length!==4 || QUESTIONS.length!==30 ||
  PARTS.some((p,i)=>p.count!==EXPECTED[i] || QUESTIONS.filter(q=>q.part===p.part).length!==p.count) ||
  QUESTIONS.some((q,i)=>q.number!==i+1)) throw Error("Invalid Mock 04 Hören content");
function publicB1Mock4Hoeren(){
  return {mockId:"b1-mock-04",level:"B1",section:"hoeren",practiceOnly:true,
    questionCount:30,verifiedQuestionCount:30,fullTargetCount:30,
    introductionNotice:"Original Falowen B1 practice, not an official Goethe-Institut test. Hören is graded separately until all four exam modules are built.",
    parts:PARTS.map(p=>({...p,questions:QUESTIONS.filter(q=>q.part===p.part).map(({answer,...question})=>question)}))};
}
function markB1Mock4Hoeren(answers){
  if(!answers || typeof answers!=="object" || Array.isArray(answers))throw Error("Invalid answers");
  if(Object.keys(answers).length!==30 || QUESTIONS.some(q=>typeof answers[q.number]!=="string" || !q.options.some(o=>o.id===answers[q.number])))
    throw Error("All 30 questions require valid answers");
  const perPart=PARTS.map(p=>({part:p.part,correct:0,total:p.count}));
  let correct=0;
  for(const q of QUESTIONS){if(answers[q.number]===q.answer){correct++;perPart[q.part-1].correct++;}}
  return {correct,total:30,percentage:Number((correct/30*100).toFixed(1)),perPart};
}
module.exports={PARTS,QUESTIONS,publicB1Mock4Hoeren,markB1Mock4Hoeren};
