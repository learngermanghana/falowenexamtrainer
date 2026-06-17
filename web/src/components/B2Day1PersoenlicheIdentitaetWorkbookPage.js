import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import SpeakingMindMap from "./SpeakingMindMap";
import { b2SpeakingMindMapExample } from "../data/speakingMindMaps/examples";

const tabs = [
  { key: "sprechen", label: "Sprechen" },
  { key: "schreiben", label: "Schreiben" },
  { key: "lesen", label: "Lesen" },
  { key: "hoeren", label: "Hören" },
];

export default function B2Day1PersoenlicheIdentitaetWorkbookPage() {
  const [active, setActive] = useState("sprechen");
  const activeLabel = useMemo(() => tabs.find((t) => t.key === active)?.label, [active]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <h1>B2 · Day 1.1 Workbook · Persönliche Identität und Selbstverständnis</h1>
      <p>Falowen Radio plus a 4-part workbook: Sprechen, Schreiben, Lesen, Hören.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {tabs.map((t) => <button key={t.key} onClick={() => setActive(t.key)} style={{ fontWeight: active === t.key ? 700 : 400 }}>{t.label}</button>)}
      </div>
      <p><strong>Aktiver Tab:</strong> {activeLabel}</p>

      {active === "sprechen" && <section><h2>Teil 1 · Sprechen</h2><SpeakingMindMap config={b2SpeakingMindMapExample} /><p>Beschreiben Sie in 2–3 Minuten, wie sich Ihre Identität im Laufe der Zeit verändert hat (Familie, Schule, Arbeit, soziale Medien).</p><p><strong>Selbstbewertung:</strong> Habe ich eine klare Position formuliert, Belege eingeordnet und ein Gegenargument beantwortet?</p></section>}

      {active === "schreiben" && <section><h2>Teil 2 · Schreiben</h2><p><em>Genre-Entscheidung: Meinungsessay/Erörterung, weil das Thema gesellschaftlich-persönlich ist und keine institutionelle Anfrage/Beschwerde verlangt.</em></p><p><strong>Situation:</strong> Ihre Volkshochschule organisiert eine Diskussionsreihe: „Wer bin ich online – wer bin ich offline?“. Schreiben Sie einen Meinungsessay (180–220 Wörter) für das Kursforum.</p><p><strong>Inhaltspunkte (Pflicht):</strong></p><ul><li>Welche Faktoren prägen Ihr Selbstverständnis?</li><li>Welche Rolle spielen soziale Medien für persönliche Identität?</li><li>Welche Chancen und Risiken sehen Sie?</li><li>Wie kann man authentisch bleiben?</li></ul><p><strong>Register/Ton:</strong> neutral-formell, klar argumentativ, B2-Niveau.</p><p><strong>Struktur:</strong> Einleitung (Thema + Position), Hauptteil (2–3 Argumente + Beispiele), Schluss (Fazit + Ausblick).</p><p><strong>Self-check:</strong> Kohärenz? Register passend? Adjektivdeklination korrekt? Wortschatz variantenreich? Aufgabenbezug vollständig?</p></section>}

      {active === "lesen" && <section><h2>Teil 3 · Lesen</h2><p>Lesen Sie einen kurzen Kommentar über digitale Identität. Markieren Sie 6 Adjektiv-Nomen-Verbindungen und erklären Sie die Endungen (Artikel? Kasus?).</p><p><strong>Selbstbewertung:</strong> Kann ich jede Endung grammatisch begründen?</p></section>}

      {active === "hoeren" && <section><h2>Teil 4 · Hören</h2><p>Hören Sie ein Interview zum Thema „Selbstbild und Fremdbild“. Notieren Sie: 3 Hauptaussagen, 2 Beispiele, 1 eigene Reaktion.</p><p><strong>Selbstbewertung:</strong> Habe ich Kernaussagen korrekt verstanden und strukturiert notiert?</p></section>}
    </div>
  );
}
