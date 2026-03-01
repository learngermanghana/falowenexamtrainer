import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const boxStyle = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  overflow: "hidden",
};

const thStyle = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid #e5e7eb",
  background: "#f3f4f6",
  fontWeight: 700,
  fontSize: 14,
};

const tdStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: 14,
  verticalAlign: "top",
};

// Simple reusable hero image block (Unsplash)
const HeroImage = ({ src, alt, creditName, creditUrl }) => (
  <div
    style={{
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid #e5e7eb",
      background: "#fff",
    }}
  >
    <div style={{ position: "relative" }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: "100%",
          height: 220,
          objectFit: "cover",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 10,
          bottom: 10,
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(229,231,235,0.9)",
          borderRadius: 999,
          padding: "6px 10px",
          fontSize: 12,
          color: "#374151",
        }}
      >
        Photo by{" "}
        <a
          href={creditUrl}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#111827", fontWeight: 700, textDecoration: "none" }}
        >
          {creditName}
        </a>{" "}
        on Unsplash
      </div>
    </div>
  </div>
);

const HealthBodyPartsPage = () => {
  const navigate = useNavigate();

  // ✅ Pick any Unsplash image you like. This one is “medical / health” themed.
  // Tip: you can change the URL to any Unsplash photo (keep the ?auto=format... part).
  const heroSrc =
    "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1400&q=80";

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      {/* HEADER */}
      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <div style={{ display: "grid", gap: 8 }}>
          <h1 style={{ ...styles.title, marginBottom: 0 }}>
            Day 22: Health and Body Parts
          </h1>

          <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 14.1</p>

          <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>
            Today you will learn how to talk about health problems, ask about
            someone’s health, and write a formal cancellation message. You will
            also learn a simple A1 trick for adjective endings with indefinite
            articles (ein/eine/kein).
          </p>
        </div>

        {/* ✅ NEW: Unsplash hero image */}
        <HeroImage
          src={heroSrc}
          alt="Health and body parts learning"
          creditName="National Cancer Institute"
          creditUrl="https://unsplash.com/@nci"
        />
      </div>

      {/* PART 1 */}
      <Section title="Part 1: Two Ways to Say You Are Not Feeling Well">
        <div style={boxStyle}>
          <strong>1) Using “Ich habe … Schmerzen”</strong>
          <p style={{ marginTop: 8 }}>
            Use: <strong>Ich habe + body part + Schmerzen.</strong>
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li>Ich habe Kopfschmerzen. (headache)</li>
            <li>Ich habe Bauchschmerzen. (stomach pain)</li>
            <li>Ich habe Rückenschmerzen. (back pain)</li>
            <li>Ich habe Halsschmerzen. (sore throat)</li>
          </ul>
          <p style={{ marginTop: 8, marginBottom: 0 }}>
            Note: <strong>Schmerzen</strong> is plural.
          </p>
        </div>

        <div style={boxStyle}>
          <strong>2) Using “... tut mir weh”</strong>
          <p style={{ marginTop: 8 }}>
            Use: <strong>Mein/Meine + body part + tut mir weh.</strong>
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li>Mein Kopf tut mir weh.</li>
            <li>Mein Rücken tut mir weh.</li>
            <li>Mein Bauch tut mir weh.</li>
            <li>Mein Hals tut mir weh.</li>
          </ul>
          <p style={{ marginTop: 8, marginBottom: 0 }}>
            Short question you can answer with this:{" "}
            <strong>Was tut dir weh?</strong>
          </p>
        </div>
      </Section>

      {/* PART 2 */}
      <Section title="Part 2: How to Ask About Someone’s Health">
        <div style={boxStyle}>
          <strong>Questions (choose formal or informal):</strong>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Wie geht es dir? (informal)</li>
            <li>Wie geht es Ihnen? (formal)</li>
            <li>Geht es dir gut?</li>
            <li>Geht es Ihnen gut?</li>
            <li>Was ist los?</li>
            <li>Was tut dir weh?</li>
            <li>Fehlt dir etwas?</li>
          </ul>
        </div>

        <div style={boxStyle}>
          <strong>Possible answers:</strong>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Mir geht es nicht gut.</li>
            <li>Ich bin krank.</li>
            <li>Ich habe Kopfschmerzen.</li>
            <li>Mein Kopf tut mir weh.</li>
          </ul>
        </div>
      </Section>

      {/* PART 3 */}
      <Section title="Part 3: Writing – Cancel an Appointment (Termin absagen)">
        <div style={boxStyle}>
          <strong>Model sentences (A1):</strong>
          <p style={{ marginTop: 8, lineHeight: 1.7, marginBottom: 0 }}>
            Ich schreibe Ihnen, weil ich den Termin absagen möchte. <br />
            Ich bin krank. <br />
            Ich habe Kopfschmerzen. <br />
            Können wir einen anderen Termin vereinbaren?
          </p>
        </div>

        <div style={boxStyle}>
          <strong>Ways to ask for a new appointment:</strong>
          <ul
            style={{
              paddingLeft: 20,
              marginTop: 8,
              marginBottom: 0,
              lineHeight: 1.7,
            }}
          >
            <li>Können wir einen anderen Termin vereinbaren?</li>
            <li>Könnten wir einen neuen Termin vereinbaren?</li>
            <li>Wäre ein anderer Termin möglich?</li>
            <li>Ist es möglich, einen neuen Termin zu bekommen?</li>
            <li>Ist es möglich, den Termin zu verschieben?</li>
          </ul>
        </div>

        <div style={boxStyle}>
          <strong>Complete example:</strong>
          <p style={{ marginTop: 8, lineHeight: 1.7 }}>
            Sehr geehrte Damen und Herren, <br />
            ich schreibe Ihnen, weil ich den Termin am Montag absagen möchte.{" "}
            <br />
            Ich bin krank. Ich habe Kopfschmerzen. <br />
            Können wir einen anderen Termin vereinbaren? <br />
            Mit freundlichen Grüßen <br />
            Max Mustermann
          </p>
        </div>
      </Section>

      {/* PART 4 */}
      <Section title="Grammar Note: Adjective Declension (Indefinite Articles – A1 Trick)">
        {/* Step 1 */}
        <div style={boxStyle}>
          <strong>Step 1: Review the Articles</strong>
          <p style={{ marginTop: 8, marginBottom: 10 }}>
            We focus on <strong>Nominative</strong> (subject) and{" "}
            <strong>Accusative</strong> (object).
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <strong>Nominative (Subject)</strong>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Gender</th>
                    <th style={thStyle}>Definite</th>
                    <th style={thStyle}>Indefinite</th>
                    <th style={thStyle}>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}>Masculine</td>
                    <td style={tdStyle}>der</td>
                    <td style={tdStyle}>ein</td>
                    <td style={tdStyle}>der Hund, ein Hund</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Feminine</td>
                    <td style={tdStyle}>die</td>
                    <td style={tdStyle}>eine</td>
                    <td style={tdStyle}>die Blume, eine Blume</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Neuter</td>
                    <td style={tdStyle}>das</td>
                    <td style={tdStyle}>ein</td>
                    <td style={tdStyle}>das Auto, ein Auto</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Plural</td>
                    <td style={tdStyle}>die</td>
                    <td style={tdStyle}>keine</td>
                    <td style={tdStyle}>die Bücher, keine Bücher</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <strong>Accusative (Object)</strong>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Gender</th>
                    <th style={thStyle}>Definite</th>
                    <th style={thStyle}>Indefinite</th>
                    <th style={thStyle}>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}>Masculine</td>
                    <td style={tdStyle}>den</td>
                    <td style={tdStyle}>einen</td>
                    <td style={tdStyle}>den Hund, einen Hund</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Feminine</td>
                    <td style={tdStyle}>die</td>
                    <td style={tdStyle}>eine</td>
                    <td style={tdStyle}>die Blume, eine Blume</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Neuter</td>
                    <td style={tdStyle}>das</td>
                    <td style={tdStyle}>ein</td>
                    <td style={tdStyle}>das Auto, ein Auto</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Plural</td>
                    <td style={tdStyle}>die</td>
                    <td style={tdStyle}>keine</td>
                    <td style={tdStyle}>die Bücher, keine Bücher</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div style={boxStyle}>
          <strong>Step 2: How to Get the Adjective Ending (Simple Trick)</strong>
          <p style={{ marginTop: 8 }}>
            Look at the article (der/die/das/den). The article tells you the
            adjective ending:
          </p>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>If you see</th>
                <th style={thStyle}>Use this ending</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>der</td>
                <td style={tdStyle}>-er</td>
              </tr>
              <tr>
                <td style={tdStyle}>die</td>
                <td style={tdStyle}>-e</td>
              </tr>
              <tr>
                <td style={tdStyle}>das</td>
                <td style={tdStyle}>-es</td>
              </tr>
              <tr>
                <td style={tdStyle}>den</td>
                <td style={tdStyle}>-en</td>
              </tr>
              <tr>
                <td style={tdStyle}>plural (die/keine)</td>
                <td style={tdStyle}>-en</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: 10, marginBottom: 0 }}>
            We use simple adjectives: groß, klein, rot, blau, grün, schön, neu,
            alt.
          </p>
        </div>

        {/* Mistakes */}
        <div style={boxStyle}>
          <strong>Mistakes to avoid</strong>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>
              Neuter uses <strong>ein + -es</strong>: ein klein
              <strong>es</strong> Auto (not ein kleine Auto).
            </li>
            <li>
              Masculine accusative uses <strong>einen + -en</strong>: einen klein
              <strong>en</strong> Hund.
            </li>
          </ul>
        </div>

        {/* Step 3 */}
        <div style={boxStyle}>
          <strong>Step 3: Combine Article + Adjective + Noun</strong>

          <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
            <div>
              <strong>Nominative (Subject)</strong>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Gender</th>
                    <th style={thStyle}>Article</th>
                    <th style={thStyle}>Ending</th>
                    <th style={thStyle}>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}>Masculine</td>
                    <td style={tdStyle}>ein</td>
                    <td style={tdStyle}>-er</td>
                    <td style={tdStyle}>
                      ein groß<span style={{ fontWeight: 700 }}>er</span> Hund
                    </td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Feminine</td>
                    <td style={tdStyle}>eine</td>
                    <td style={tdStyle}>-e</td>
                    <td style={tdStyle}>
                      eine rot<span style={{ fontWeight: 700 }}>e</span> Blume
                    </td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Neuter</td>
                    <td style={tdStyle}>ein</td>
                    <td style={tdStyle}>-es</td>
                    <td style={tdStyle}>
                      ein klein<span style={{ fontWeight: 700 }}>es</span> Auto
                    </td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Plural</td>
                    <td style={tdStyle}>keine</td>
                    <td style={tdStyle}>-en</td>
                    <td style={tdStyle}>
                      keine neu<span style={{ fontWeight: 700 }}>en</span> Bücher
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <strong>Accusative (Object)</strong>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Gender</th>
                    <th style={thStyle}>Article</th>
                    <th style={thStyle}>Ending</th>
                    <th style={thStyle}>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}>Masculine</td>
                    <td style={tdStyle}>einen</td>
                    <td style={tdStyle}>-en</td>
                    <td style={tdStyle}>
                      einen klein<span style={{ fontWeight: 700 }}>en</span> Hund
                    </td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Feminine</td>
                    <td style={tdStyle}>eine</td>
                    <td style={tdStyle}>-e</td>
                    <td style={tdStyle}>
                      eine blau<span style={{ fontWeight: 700 }}>e</span> Blume
                    </td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Neuter</td>
                    <td style={tdStyle}>ein</td>
                    <td style={tdStyle}>-es</td>
                    <td style={tdStyle}>
                      ein grün<span style={{ fontWeight: 700 }}>es</span> Auto
                    </td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Plural</td>
                    <td style={tdStyle}>keine</td>
                    <td style={tdStyle}>-en</td>
                    <td style={tdStyle}>
                      keine alt<span style={{ fontWeight: 700 }}>en</span> Bücher
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Example Sentences */}
        <div style={boxStyle}>
          <strong>Example Sentences</strong>

          <p style={{ marginTop: 10, marginBottom: 6 }}>
            <strong>Nominative</strong>
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 0 }}>
            <li>
              Ich bin ein groß<span style={{ fontWeight: 700 }}>er</span> Mann.
            </li>
            <li>
              Sie hat eine rot<span style={{ fontWeight: 700 }}>e</span> Tasche.
            </li>
            <li>
              Das ist ein neu<span style={{ fontWeight: 700 }}>es</span> Auto.
            </li>
            <li>
              Wir haben keine klein<span style={{ fontWeight: 700 }}>en</span>{" "}
              Kinder.
            </li>
          </ul>

          <p style={{ marginTop: 10, marginBottom: 6 }}>
            <strong>Accusative</strong>
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 0 }}>
            <li>
              Ich habe einen klein<span style={{ fontWeight: 700 }}>en</span>{" "}
              Hund.
            </li>
            <li>
              Er sieht eine schön<span style={{ fontWeight: 700 }}>e</span> Blume.
            </li>
            <li>
              Wir kaufen ein gelb<span style={{ fontWeight: 700 }}>es</span> Buch.
            </li>
            <li>
              Du liest keine lang<span style={{ fontWeight: 700 }}>en</span> Texte.
            </li>
          </ul>
        </div>

        {/* Mini Test */}
        <div style={boxStyle}>
          <strong>Mini Adjective Ending Test (A1)</strong>
          <p style={{ marginTop: 8, marginBottom: 8 }}>
            Complete the sentences with the correct adjective endings (use:
            groß, klein, rot, schön, neu).
          </p>

          <ol style={{ paddingLeft: 20, marginTop: 0 }}>
            <li>Ich habe einen ___ Hund. (klein)</li>
            <li>Das ist ein ___ Auto. (neu)</li>
            <li>Sie ist eine ___ Frau. (schön)</li>
            <li>Ich sehe eine ___ Blume. (rot)</li>
            <li>Er ist ein ___ Mann. (groß)</li>
          </ol>

          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 10,
              background: "#ffffff",
              border: "1px dashed #d1d5db",
            }}
          >
            <strong>Check your answers:</strong>
            <p style={{ margin: "8px 0 0", lineHeight: 1.7 }}>
              1) einen klein<strong>en</strong> Hund <br />
              2) ein neu<strong>es</strong> Auto <br />
              3) eine schön<strong>e</strong> Frau <br />
              4) eine rot<strong>e</strong> Blume <br />
              5) ein groß<strong>er</strong> Mann
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default HealthBodyPartsPage;
