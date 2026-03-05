import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
];

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.secondaryButton,
        borderColor: active ? "#2563eb" : "#d1d5db",
        background: active ? "#eff6ff" : "#fff",
        color: active ? "#1d4ed8" : "#111827",
      }}
    >
      {children}
    </button>
  );
}

const B1Day25OnlineShoppingRightsRisksWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Chapter 8.25 Workbook · Online einkaufen – Rechte und Risiken</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Rechte und Risiken beim Online-Shopping besprechen.</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} of {tabs.length}
        </p>
      </div>

      {activeTab === "sprechen" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 1 (Sprechen) (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing these topics.
          </p>

          <h3 style={sectionTitle}>Zentrales Thema: Online einkaufen – Rechte und Risiken</h3>
          <ol style={listStyle}>
            <li>
              <strong>Gründe für Online-Shopping</strong>
              <ul style={listStyle}>
                <li>Bequemlichkeit: rund um die Uhr einkaufen</li>
                <li>Große Auswahl an Produkten</li>
                <li>Preisvergleiche möglich</li>
                <li>Lieferung nach Hause</li>
                <li>Oft günstiger als im Laden</li>
              </ul>
            </li>
            <li>
              <strong>Typische Produkte beim Online-Kauf</strong>
              <ul style={listStyle}>
                <li>Kleidung</li>
                <li>Elektronik (z. B. Handys, Laptops)</li>
                <li>Bücher</li>
                <li>Lebensmittel</li>
                <li>Möbel und Haushaltsartikel</li>
              </ul>
            </li>
            <li>
              <strong>Rechte beim Online-Kauf</strong>
              <ul style={listStyle}>
                <li>Widerrufsrecht (14 Tage Rückgaberecht ohne Grund)</li>
                <li>Rücksendung möglich</li>
                <li>Geld-zurück-Garantie</li>
                <li>Informationspflicht des Verkäufers (z. B. Preis, Lieferzeit)</li>
                <li>Garantie auf Produkte</li>
              </ul>
            </li>
            <li>
              <strong>Risiken und Probleme</strong>
              <ul style={listStyle}>
                <li>Falsche oder beschädigte Ware</li>
                <li>Lange Lieferzeiten</li>
                <li>Betrügerische Webseiten (Fake-Shops)</li>
                <li>Datenschutzprobleme (unsichere Bezahlung)</li>
                <li>Schwierige Rückgabe, besonders bei Auslandsbestellungen</li>
              </ul>
            </li>
            <li>
              <strong>Sichere Online-Shops erkennen</strong>
              <ul style={listStyle}>
                <li>Gütesiegel (z. B. Trusted Shops, TÜV)</li>
                <li>Kundenbewertungen lesen</li>
                <li>Impressum prüfen</li>
                <li>HTTPS (sichere Verbindung)</li>
                <li>Bezahlmethoden: PayPal, Rechnung, Kreditkarte</li>
              </ul>
            </li>
            <li>
              <strong>Nützliche Redemittel</strong>
              <ul style={listStyle}>
                <li>„Ich möchte die Ware zurückgeben.“</li>
                <li>„Das Produkt ist beschädigt angekommen.“</li>
                <li>„Ich habe etwas anderes bestellt.“</li>
                <li>„Wie funktioniert die Rücksendung?“</li>
                <li>„Ich möchte mein Geld zurück.“</li>
                <li>„Könnten Sie mir bitte eine neue Ware schicken?“</li>
              </ul>
            </li>
            <li>
              <strong>Tipps für sicheres Online-Shopping</strong>
              <ul style={listStyle}>
                <li>Nur bei bekannten Anbietern bestellen</li>
                <li>Zahlungsbestätigung aufbewahren</li>
                <li>Preise vergleichen</li>
                <li>Rückgabebedingungen lesen</li>
                <li>Niemals persönliche Daten per E-Mail weitergeben</li>
              </ul>
            </li>
          </ol>

          <h3 style={sectionTitle}>Gemeinsam etwas planen</h3>
          <p style={{ margin: 0 }}>
            <strong>„Online einkaufen – Rechte und Risiken“</strong>
          </p>
          <p style={{ margin: 0 }}>Plant gemeinsam einen Online-Einkauf. Nutzt dabei diese Struktur:</p>
          <ul style={listStyle}>
            <li>Was wollt ihr online kaufen? (z. B. Kleidung, Elektronik, Möbel)</li>
            <li>Wo kauft ihr ein? (Welche Webseite oder App?)</li>
            <li>Wie bezahlt ihr? (z. B. mit Karte, PayPal, auf Rechnung)</li>
            <li>
              Was macht ihr, wenn etwas nicht stimmt? (z. B. Rückgabe, Reklamation, Kundenservice kontaktieren)
            </li>
          </ul>
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 2 - Assignment: Schreiben</h2>
          <p style={{ margin: 0 }}>
            <strong>Aufgabe – B1 Schreiben (Formeller Brief)</strong>
          </p>
          <p style={{ margin: 0 }}>
            <strong>Situation:</strong> Sie haben online ein Handy gekauft. Nach der Lieferung haben Sie bemerkt, dass das
            Display kaputt war. Deshalb haben Sie es zurückgeschickt.
          </p>
          <p style={{ margin: 0 }}>Schreiben Sie einen formellen Brief an den Kundenservice und erwähnen Sie dabei auch:</p>
          <ul style={listStyle}>
            <li>Wann Sie das Handy gekauft haben</li>
            <li>Was genau das Problem war</li>
            <li>Wann Sie das Handy zurückgeschickt haben</li>
            <li>Was Sie jetzt erwarten</li>
          </ul>
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 3 – Lesen</h2>
          <h3 style={sectionTitle}>Essay: Selbstständigkeit, Umweltschutz und Verbraucherberatung in Deutschland</h3>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Ich habe einen eigenen Friseursalon. Ein großer Vorteil daran ist, dass ich endlich gut Geld verdienen kann.
            Früher, als ich angestellt war, war mein Gehalt sehr niedrig. Jetzt ist das anders. Ich kann selbst entscheiden,
            welche Dienstleistungen ich anbiete, und bin unabhängig. Viele Kunden bleiben mir treu, obwohl es in
            Kaufhäusern oft günstigere Angebote gibt. Das liegt daran, dass wir auf gute Beratung achten und uns viel Zeit
            für die Kunden nehmen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Ein Problem in meiner Arbeit ist die Konkurrenz. Ein weiteres Problem ist die Sozialversicherung. Als
            Selbstständige muss ich keine Rentenversicherung haben, aber ich habe freiwillig eine abgeschlossen. Auch wenn
            ich später vielleicht nicht viel Rente bekomme, habe ich dadurch eine gewisse Sicherheit. Insgesamt bin ich sehr
            zufrieden mit meiner Selbstständigkeit.
          </p>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            In meiner Familie spielt auch der Umweltschutz eine wichtige Rolle. Wir fahren mit dem Fahrrad oder mit
            öffentlichen Verkehrsmitteln, wenn wir einkaufen gehen. Außerdem achten wir darauf, möglichst wenig Müll zu
            produzieren. Wir kaufen Produkte mit wenig Verpackung und trennen den Müll richtig. Ich habe das Gefühl, dass
            die Menschen heute umweltbewusster sind als früher. Auch wir sparen Energie in der Wohnung: Wir heizen nur die
            Zimmer, die wir benutzen, und schalten das Licht und elektrische Geräte aus, wenn wir das Haus verlassen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Wenn man Fragen rund um das Thema Konsum hat, kann man sich in Deutschland an die Verbraucherzentralen wenden.
            Es gibt ungefähr 200 Beratungsstellen in allen Bundesländern. Die Mitarbeiter dort helfen bei Fragen zu
            Kaufverträgen, Krediten, Gewinnspielen, Versicherungen oder auch beim Wechsel des Stromanbieters. Sie
            informieren auch über Lebensmittel und gesunde Ernährung. Die Verbraucherzentralen werden vom Staat unterstützt,
            aber trotzdem müssen Kunden für manche Beratungen etwas bezahlen. Einfache Informationen sind oft kostenlos. Im
            Internet gibt es viele Broschüren, die man gratis herunterladen kann.
          </p>

          <h3 style={sectionTitle}>Fragen (Multiple Choice – 1 richtige Antwort pro Frage)</h3>
          <ol style={listStyle}>
            <li>
              Warum ist die Friseurin zufrieden mit ihrer Arbeit?
              <ul style={listStyle}>
                <li>a) Sie arbeitet in Teilzeit.</li>
                <li>b) Sie ist selbstständig und verdient mehr.</li>
                <li>c) Sie hat einen neuen Chef.</li>
                <li>d) Sie muss keine Kunden bedienen.</li>
              </ul>
            </li>
            <li>
              Warum bleiben viele Kunden bei ihrem Friseursalon?
              <ul style={listStyle}>
                <li>a) Weil sie keine andere Wahl haben.</li>
                <li>b) Weil der Salon am billigsten ist.</li>
                <li>c) Weil der Service und die Beratung gut sind.</li>
                <li>d) Weil sie dort arbeiten.</li>
              </ul>
            </li>
            <li>
              Was macht die Familie von Robert Schmidt für den Umweltschutz?
              <ul style={listStyle}>
                <li>a) Sie nutzt immer das Auto.</li>
                <li>b) Sie trennt Müll und spart Energie.</li>
                <li>c) Sie kauft viele neue Geräte.</li>
                <li>d) Sie wirft alles in den gleichen Müll.</li>
              </ul>
            </li>
            <li>
              Was passiert in der Wohnung, wenn niemand zu Hause ist?
              <ul style={listStyle}>
                <li>a) Die Heizung wird auf 25 Grad gestellt.</li>
                <li>b) Alle Lichter bleiben an.</li>
                <li>c) Die Familie stellt die Heizung auf 18 Grad und schaltet Geräte aus.</li>
                <li>d) Die Türen bleiben offen.</li>
              </ul>
            </li>
            <li>
              Was bieten die Verbraucherzentralen an?
              <ul style={listStyle}>
                <li>a) Friseurdienstleistungen</li>
                <li>b) Beratung zu Konsum, Verträgen und Ernährung</li>
                <li>c) Fahrstunden</li>
                <li>d) Sportkurse</li>
              </ul>
            </li>
            <li>
              Wie werden die Verbraucherzentralen finanziert?
              <ul style={listStyle}>
                <li>a) Nur durch Spenden</li>
                <li>b) Nur durch Mitgliedsbeiträge</li>
                <li>c) Durch den Staat und Kundenzahlungen</li>
                <li>d) Durch Werbung</li>
              </ul>
            </li>
            <li>
              Was ist im Internet bei den Verbraucherzentralen kostenlos erhältlich?
              <ul style={listStyle}>
                <li>a) Kinokarten</li>
                <li>b) Broschüren mit Informationen</li>
                <li>c) Reisen ins Ausland</li>
                <li>d) Elektronische Geräte</li>
              </ul>
            </li>
          </ol>
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 4 (Hören) (Exercise)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Please note that this is a Goethe-standard Hörverstehen (listening comprehension) test, and the answers are
            provided in the YouTube video. You are responsible for checking your own answers. The only parts that will be
            officially evaluated by the school are Lesen (reading) and Schreiben (writing). You must mark your own
            Hörverstehen results. This process will require a lot of motivation and self-discipline on your part to be
            effective. Thank you, and good luck!
          </p>
          <p style={{ margin: 0 }}>
            Link:{" "}
            <a href="https://youtu.be/iyydRu3oY4I?list=PLg78ckjpHfZy1W9NOddmHPfv0temfRI9X" target="_blank" rel="noreferrer">
              https://youtu.be/iyydRu3oY4I?list=PLg78ckjpHfZy1W9NOddmHPfv0temfRI9X
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default B1Day25OnlineShoppingRightsRisksWorkbookPage;
