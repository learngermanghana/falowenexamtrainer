import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
];

const card = { ...styles.card, display: "grid", gap: 12 };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };

const C1Day13MehrsprachigkeitWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <section style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, margin: 0 }}>C1 · Day 13 Workbook · Mehrsprachigkeit</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter: 3.3 · Fokus: Indirekte Rede und Distanzierung</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ ...styles.secondaryButton }}>{tab.label}</button>)}
        </div>
        <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
      </section>

      {activeTab === "sprechen" && <section style={card}><h2 style={{ margin: 0 }}>Sprechen</h2><p style={{ margin: 0 }}>Diskutiere: <strong>Sollten Schulen mehrsprachige Kompetenzen systematisch fördern?</strong></p><ul style={listSpacing}><li>Nenne Chancen für Individuum und Gesellschaft.</li><li>Berücksichtige mögliche Herausforderungen im Bildungssystem.</li><li>Beziehe ein Gegenargument ein und entkräfte es.</li><li>Schließe mit einer klaren Position.</li></ul><SpeakingPracticeTimerCard /></section>}

      {activeTab === "schreiben" && <section style={card}><h2 style={{ margin: 0 }}>Schreiben</h2><p style={{ margin: 0 }}><strong>Genre-Auswahl: Meinungsessay / Erörterung.</strong> {/* Thema "Mehrsprachigkeit" ist gesellschaftlich-bildungspolitisch und verlangt Abwägen von Positionen statt institutioneller Anfrage. */}</p><p style={{ margin: 0 }}><strong>Situation:</strong> Du schreibst für ein Online-Magazin einen C1-Meinungsbeitrag zur Frage, welche Rolle Mehrsprachigkeit in Schule, Arbeitsmarkt und öffentlichem Leben spielen sollte (220–280 Wörter).</p><p style={{ margin: 0 }}><strong>Pflichtpunkte (Stichpunkte):</strong></p><ul style={listSpacing}><li>zwei zentrale Vorteile von Mehrsprachigkeit mit Beispiel</li><li>mindestens eine reale Herausforderung (z. B. Ressourcen, Unterrichtsqualität, soziale Ungleichheit)</li><li>eine kritisch-distanzierte Einordnung einer fremden Position in indirekter Rede</li><li>eigene, begründete Schlussposition mit konkretem Vorschlag</li></ul><p style={{ margin: 0 }}><strong>Register/Ton:</strong> sachlich, argumentativ, differenziert (C1).</p><p style={{ margin: 0 }}><strong>Struktur:</strong> Einleitung (These + Kontext) · Hauptteil (Pro/Contra + Belege) · Schluss (Bewertung + Ausblick).</p><p style={{ margin: 0 }}><strong>Self-Check:</strong></p><ul style={listSpacing}><li>Kohärenz: Sind Argumente logisch verknüpft?</li><li>Register: Ist der Stil durchgehend formell-sachlich?</li><li>Grammatik: Nutze ich Konjunktiv I/II korrekt zur Distanzierung?</li><li>Wortschatz: Verwende ich präzise C1-Ausdrücke?</li><li>Aufgabenbezug: Habe ich alle Pflichtpunkte abgedeckt?</li></ul></section>}

      {activeTab === "lesen" && <section style={card}><h2 style={{ margin: 0 }}>Lesen</h2><p style={{ margin: 0 }}>Lies einen Debattenartikel zu Mehrsprachigkeit und markiere: These, Gegenposition, Belege, Schlussfolgerung.</p><ul style={listSpacing}><li>Welche Aussagen werden als Fakten präsentiert?</li><li>Wo wird nur eine Position wiedergegeben?</li><li>Welche Formulierungen zeigen Distanz oder Unsicherheit?</li></ul></section>}

      {activeTab === "hoeren" && <section style={card}><h2 style={{ margin: 0 }}>Hören</h2><p style={{ margin: 0 }}>Höre ein Interview zum Thema Sprachpolitik. Notiere Kernaussagen in indirekter Rede.</p><ul style={listSpacing}><li>Wer behauptet was?</li><li>Welche Aussagen sind belegt, welche spekulativ?</li><li>Formuliere anschließend eine kurze Zusammenfassung (80–100 Wörter).</li></ul></section>}
    </div>
  );
};

export default C1Day13MehrsprachigkeitWorkbookPage;
