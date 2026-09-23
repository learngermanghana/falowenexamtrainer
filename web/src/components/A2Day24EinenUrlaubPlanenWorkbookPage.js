import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const lesenText = `Internet-Anzeigen: Sechs Personen suchen im Internet nach Lokalen. Lesen Sie die Aufgaben und die Anzeigen a bis f. Welche Anzeige passt zu welcher Person? Für eine Aufgabe gibt es keine Lösung: Schreiben Sie X.

Anzeigen (a–f)
a: Park-Café mit Torten, Kuchen, italienischem Eis, Sonnenterrasse und Spielplatz.
b: Catering für Hochzeiten/private Feiern; Essen, Möbel, Deko, Service, Kinderbetreuung.
c: Weinhaus mit internationalen Spezialitäten, 3-Gänge-Menü, ruhigem Garten, Raum für kleine Feiern.
d: Café am Fluss, großes Frühstück am Wochenende, samstags Live-Musik am Abend.
e: Towabu Indoor-Spiel + Spaß; Kindergeburtstagspartys mit Programm.
f: Ausflugsrestaurant am See; norddeutsche Küche; Räume bis 150 Personen für Feiern.`;

const advertChoices = [
  "A) Anzeige a",
  "B) Anzeige b",
  "C) Anzeige c",
  "D) Anzeige d",
  "E) Anzeige e",
  "F) Anzeige f",
  "X) Keine passende Anzeige",
];

const lesenQuestions = [
  {
    stem: "Sarah heiratet bald und möchte mit vielen Gästen in einem Lokal feiern.",
    options: advertChoices,
  },
  {
    stem: "Petra will mit Geschäftspartnern in der Stadt essen gehen und über die Arbeit sprechen.",
    options: advertChoices,
  },
  {
    stem: "Jens feiert seinen Geburtstag zu Hause und möchte guten Wein anbieten.",
    options: advertChoices,
  },
  {
    stem: "Karsten lädt am Abend Gäste zu sich nach Hause ein, möchte aber nicht kochen.",
    options: advertChoices,
  },
  {
    stem: "Gabriele und ihre Tochter feiern Kindergeburtstag und möchten Kuchen essen gehen.",
    options: advertChoices,
  },
];

export default function A2Day24EinenUrlaubPlanenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={24}
      title="Einen Urlaub planen"
      chapter="9.24"
      workbookId="A2Day24EinenUrlaubPlanen"
      topicPrompt="Plane einen Urlaub. Nenne Reiseziel, Zeitraum, Budget, Transport, Unterkunft, Aktivitäten und wichtige Vorbereitungen."
      schreibenTask="Sie möchten zusammen mit Sandra einen Urlaub planen. Schreiben Sie ihr eine E-Mail. Laden Sie sie zur gemeinsamen Planung ein, schlagen Sie einen Termin und Treffpunkt vor und fragen Sie nach ihrer Meinung zu Reiseziel, Transport oder Unterkunft."
      schreibenPlaceholder="Liebe Sandra,\n\nich möchte gern unseren Urlaub planen. Hast du ..."
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Öffnen Sie die separate Goethe-Hören-Übung für Teil 4. Falowen Radio gehört zur Vorbereitung vor dem Workbook und ist nicht die Teil-4-Aufgabe."
      hoerenAudioUrl="https://youtu.be/iPScKV6JWaA"
      hoerenQuestions={[]}
      showWorkbookGuidance={false}
    />
  );
}
