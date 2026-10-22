# Falowen Goethe B1 Mock 03 — source content (draft)

**Status:** Draft in progress — do not publish or register as a ready full exam.
**Interface:** Reuse the existing B1 Final Mock Exam template, including the same reading layouts, module navigation, timers, answer choices, autosave, student result and Admin result pipelines. Only the new questions/texts and mock-specific scoring/audio identities may change.
**Completed:** Lesen Teil 1 (questions 1–6).
**Pending:** Lesen Teile 2–5, Hören Teile 1–4 with verified R2 audio, Schreiben Teile 1–3, Sprechen Teile 1–3, isolated Mock 03 attempt and server scoring, end-to-end checks.

## Modul Lesen — Teil 1

**Reguläre Prüfungszeit:** 10 Minuten (within the existing B1 Lesen module; do not introduce a separate timer or change the existing 65-minute reading-module countdown).

**Anweisung:** Lesen Sie den Text und die Aufgaben 1 bis 6 dazu. Sind die Aussagen **Richtig** oder **Falsch**?

### Blogbeitrag: Mein neues Leben auf dem Land

**Hallo liebe Blog-Leser,**

seit drei Monaten wohne ich nun nicht mehr in der Großstadt, sondern in einem kleinen Dorf im Schwarzwald. Viele meiner Freunde in Berlin konnten meine Entscheidung zuerst gar nicht verstehen. Sie dachten, ohne das große Kulturangebot der Stadt würde mir schnell langweilig werden. Aber das Gegenteil ist der Fall!

Ich arbeite als Grafikdesigner im Homeoffice, daher brauche ich für meinen Job nur ein Notebook und eine stabile Internetverbindung. Das war am Anfang tatsächlich ein Problem, weil der Empfang im Dorf sehr schlecht war. Doch vor zwei Wochen wurde endlich Glasfaser verlegt, und jetzt funktioniert das Arbeiten ohne Störungen.

Der größte Vorteil für mich ist die Natur. Gleich hinter meinem Haus beginnt der Wald. Jeden Tag nach der Arbeit gehe ich eine Stunde spazieren oder fahre Fahrrad. Früher in Berlin war ich nach dem Feierabend meistens müde und bin nur vor dem Fernseher gesessen. Jetzt fühle ich mich viel fitter und schlafe deutlich besser.

Ein kleiner Nachteil sind allerdings die Einkaufsmöglichkeiten. Es gibt im Dorf nur einen kleinen Laden, der samstags schon um 12:00 Uhr schließt. Wenn ich größere Einkäufe machen möchte, muss ich mit dem Bus in die zehn Kilometer entfernte Stadt fahren. Ein eigenes Auto habe ich bewusst nicht gekauft, da der Bus stündlich fährt und ich die Umwelt schonen möchte.

Insgesamt bereue ich meinen Umzug überhaupt nicht. Nächsten Monat kommen mich zwei Freunde aus Berlin besuchen – sie wollen mit eigenen Augen sehen, wie mein neues Landleben aussieht!

**Euer Markus**

### Aufgaben 1–6

Choose exactly one answer for each question: **Richtig** / **Falsch**. Use the same radio-button control and question numbering as B1 Mock 1.

1. Markus lebt seit drei Wochen in einem Dorf im Schwarzwald.
2. Markus’ Freunde hielten seinen Umzug von Anfang an für eine gute Idee.
3. An seinem neuen Wohnort gab es zu Beginn technische Probleme beim Arbeiten.
4. Markus bewegt sich heute nach der Arbeit mehr als während seiner Zeit in Berlin.
5. Im Dorfladen kann man am Samstagnachmittag einkaufen.
6. Für Fahrten in die Stadt nutzt Markus sein eigenes Auto.

## Teacher-only answer key — NOT FOR STUDENT EXAM UI

| Nummer | Lösung | Begründung |
|---|---|---|
| 1 | **Falsch** | Er wohnt seit **drei Monaten** auf dem Land, nicht drei Wochen. |
| 2 | **Falsch** | Seine Freunde konnten die Entscheidung zuerst **gar nicht verstehen**. |
| 3 | **Richtig** | Der schlechte Empfang verursachte anfangs technische Probleme beim Arbeiten. |
| 4 | **Richtig** | Heute geht er spazieren oder fährt Fahrrad; früher saß er meist vor dem Fernseher. |
| 5 | **Falsch** | Der Dorfladen schließt samstags schon **um 12:00 Uhr**. |
| 6 | **Falsch** | Er hat bewusst kein Auto gekauft und nutzt den stündlich fahrenden Bus. |

**Validated answer sequence:** Falsch, Falsch, Richtig, Richtig, Falsch, Falsch (**F, F, R, R, F, F**).

## Mock 03 integration requirements (when all parts are complete)

- Keep the existing student-facing B1 reading template. No new visual design, buttons or exam mechanics are needed.
- Set an independent Mock 03 ID (e.g. `b1-mock-03`), distinct server-owned answer keys and attempt storage; never reuse Mock 1/2 scores or browser state.
- All six reading items must have unique stable answer IDs, map to the six teacher-reviewed keys, and reveal no keys to students before verified submission.
- The 10-minute label describes **Teil 1 suggested time**, not an extra timer; the existing overall B1 Lesen module remains 65 minutes.
- This content file is an *unpublished teacher draft*. The mock must remain absent from the ready exam catalog until all four modules and protected Hören files are tested.
