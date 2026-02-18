import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const Callout = ({ children }) => (
  <div
    style={{
      background: "#f0f9ff",
      borderLeft: "4px solid #38bdf8",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      display: "grid",
      gap: 6,
    }}
  >
    {children}
  </div>
);

const DirectionsImperativePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 17: Directions + Imperative (Chapter 11)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Understand instructions and requests in German with useful direction phrases and imperative forms.
        </p>
      </div>

      <Section title="1) Basic direction vocabulary">
        <BulletList
          items={[
            "rechts — right",
            "links — left",
            "geradeaus — straight ahead",
            "die Straße — street",
            "die Kreuzung — intersection",
            "die Ampel — traffic light",
            "die Ecke — corner",
            "die Brücke — bridge",
            "der Platz — square",
            "der Bahnhof — train station",
            "das Krankenhaus — hospital",
            "die Schule — school",
            "der Supermarkt — supermarket",
            "überqueren — to cross",
            "erste Straße — first street",
            "zweite Straße — second street",
            "auf der rechten Seite — on the right side",
            "auf der linken Seite — on the left side",
          ]}
        />
      </Section>

      <Section title="2) Asking for directions">
        <BulletList
          items={[
            "Wo ist ...? (Where is ...?)",
            "Wo finde ich ...? (Where can I find ...?)",
            "Wie komme ich zu ...? (How do I get to ...?)",
            "Ich suche ... (I'm looking for ...)",
          ]}
        />
      </Section>

      <Section title="3) Giving directions (formal examples)">
        <BulletList
          items={[
            "Gehen Sie geradeaus. (Go straight ahead.)",
            "Biegen Sie rechts ab. (Turn right.)",
            "Biegen Sie links ab. (Turn left.)",
            "Nehmen Sie die erste Straße rechts. (Take the first street on the right.)",
            "Nehmen Sie die zweite Straße links. (Take the second street on the left.)",
            "Überqueren Sie die Straße. (Cross the street.)",
            "Der Supermarkt ist auf der rechten Seite. (The supermarket is on the right side.)",
            "Das Krankenhaus ist auf der linken Seite. (The hospital is on the left side.)",
          ]}
        />
      </Section>

      <Section title="4) If you don't know the way">
        <BulletList
          items={[
            "Entschuldigung, ich weiß es nicht. (Sorry, I don't know.)",
            "Tut mir leid, ich bin nicht von hier. (I'm sorry, I'm not from here.)",
            "Ich kenne den Weg nicht. (I don't know the way.)",
            "Vielleicht fragen Sie jemanden anderen. (Maybe you should ask someone else.)",
            "Entschuldigung, ich kann Ihnen nicht helfen. (Sorry, I can't help you.)",
            "Ich bin auch ein Besucher hier. (I'm also a visitor here.)",
          ]}
        />
      </Section>

      <Section title="5) Imperative for directions (Sie / du / ihr)">
        <Callout>
          <strong>Formal (Sie)</strong>
          <p style={{ margin: 0 }}>Use infinitive + Sie.</p>
          <BulletList
            items={[
              "Gehen Sie geradeaus.",
              "Biegen Sie rechts ab.",
              "Nehmen Sie die erste Straße links.",
            ]}
          />
        </Callout>
        <Callout>
          <strong>Informal singular (du)</strong>
          <p style={{ margin: 0 }}>Use verb stem (drop -en/-n, no du).</p>
          <BulletList items={["Geh geradeaus.", "Bieg rechts ab.", "Nimm die erste Straße links."]} />
        </Callout>
        <Callout>
          <strong>Informal plural (ihr)</strong>
          <p style={{ margin: 0 }}>Use verb stem + -t (no ihr).</p>
          <BulletList items={["Geht geradeaus.", "Biegt rechts ab.", "Nehmt die erste Straße links."]} />
        </Callout>
      </Section>

      <Section title="6) Example: How to get to the train station">
        <h3 style={{ margin: 0 }}>Formal (Sie)</h3>
        <BulletList
          items={[
            "Gehen Sie geradeaus bis zur Kreuzung.",
            "Biegen Sie links ab.",
            "Überqueren Sie die Brücke.",
            "Der Bahnhof ist auf der rechten Seite.",
          ]}
        />
        <h3 style={{ margin: "8px 0 0" }}>Informal singular (du)</h3>
        <BulletList
          items={[
            "Geh geradeaus bis zur Kreuzung.",
            "Bieg links ab.",
            "Überquere die Brücke.",
            "Der Bahnhof ist auf der rechten Seite.",
          ]}
        />
        <h3 style={{ margin: "8px 0 0" }}>Informal plural (ihr)</h3>
        <BulletList
          items={[
            "Geht geradeaus bis zur Kreuzung.",
            "Biegt links ab.",
            "Überquert die Brücke.",
            "Der Bahnhof ist auf der rechten Seite.",
          ]}
        />
      </Section>

      <Section title="7) Video lesson">
        <p style={{ margin: 0 }}>Watch this explanation and practice with your tutor afterwards.</p>
        <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: 12, overflow: "hidden" }}>
          <iframe
            title="Directions and imperative in German"
            src="https://www.youtube.com/embed/V9WNhHEkrkU?feature=oembed"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Section>
    </div>
  );
};

export default DirectionsImperativePage;
