"use strict";
// Private teacher-approved key for B1 Mock 02 Lesen, Aufgaben 1–30.
// Aufgaben 1–12: Integration, SprachPaten, Stadtteil-Treffs (teacher update 2026-11-02).
const B1_MOCK2_READING_KEY = Object.freeze({
  "t1-1":"richtig","t1-2":"richtig","t1-3":"falsch","t1-4":"falsch","t1-5":"richtig","t1-6":"richtig",
  "t2-7":"b","t2-8":"a","t2-9":"c","t2-10":"b","t2-11":"a","t2-12":"b",
  "t3-13":"c","t3-14":"f","t3-15":"0","t3-16":"d","t3-17":"a","t3-18":"b","t3-19":"h",
  "t4-20":"nein","t4-21":"ja","t4-22":"nein","t4-23":"ja","t4-24":"nein","t4-25":"ja","t4-26":"nein",
  "t5-27":"b","t5-28":"b","t5-29":"a","t5-30":"b",
});
// Teacher-only feedback explanations for Aufgaben 1–12; do not import in the browser.
const B1_MOCK2_READING_EXPLANATIONS=Object.freeze({
  "t1-1": "Sprachkenntnisse erleichtern soziale Kontakte und die Arbeitssuche.",
  "t1-2": "Bezahlbare Sprachkurse helfen bei Behördengängen und im Beruf ohne fremde Hilfe.",
  "t1-3": "Vereine und Begegnungsprojekte bringen Menschen verschiedener Herkunft zusammen und bauen Vorurteile ab.",
  "t1-4": "Staatliche Maßnahmen reichen nicht allein; auch Zugewanderte müssen Verantwortung übernehmen.",
  "t1-5": "Persönliche Begegnungen bei gemeinsamen Aktivitäten verringern Missverständnisse.",
  "t1-6": "Integration gelingt, wenn Staat und Zugewanderte gleichermaßen Verantwortung übernehmen.",
  "t2-7": "Bei SprachPaten wird Deutsch in Supermärkten, Sportvereinen oder Cafés direkt im Alltag angewendet.",
  "t2-8": "Sarah Meyer erklärt, dass die ungezwungene Atmosphäre die Angst vor dem freien Sprechen abbaut.",
  "t2-9": "Das Projekt richtet sich an Menschen mit ersten Grundkenntnissen; die Teilnahme ist kostenlos.",
  "t2-10": "Die Stadtteil-Treffs stärken das Miteinander aller Nachbarn und neu zugezogenen Familien.",
  "t2-11": "Einmal monatlich kochen Anwohner Gerichte aus ihren verschiedenen Herkunftsländern.",
  "t2-12": "Die Sprach-Cafés unterstützen beim Ausfüllen von Formularen und beim Schreiben von Bewerbungen."
});
module.exports = {B1_MOCK2_READING_KEY,B1_MOCK2_READING_EXPLANATIONS};
