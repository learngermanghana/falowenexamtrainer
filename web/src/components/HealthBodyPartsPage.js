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

const HeroImage = ({ src, alt }) => (
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
        Photo from Unsplash
      </div>
    </div>
  </div>
);

const HealthBodyPartsPage = () => {
  const navigate = useNavigate();

  // ✅ Updated hero image
  const heroSrc =
    "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1400&q=80";

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
            someone’s health, and write a formal cancellation message.
            You will also learn a simple A1 trick for adjective endings with
            indefinite articles (ein/eine/kein).
          </p>
        </div>

        <HeroImage
          src={heroSrc}
          alt="Doctor consultation in clinic"
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
            <li>Ich habe Kopfschmerzen.</li>
            <li>Ich habe Bauchschmerzen.</li>
            <li>Ich habe Rückenschmerzen.</li>
            <li>Ich habe Halsschmerzen.</li>
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
            <strong>Was tut dir weh?</strong>
          </p>
        </div>
      </Section>

      {/* PART 2 */}
      <Section title="Part 2: How to Ask About Someone’s Health">
        <div style={boxStyle}>
          <strong>Questions:</strong>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Wie geht es dir?</li>
            <li>Wie geht es Ihnen?</li>
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
      <Section title="Part 3: Writing – Cancel an Appointment">
        <div style={boxStyle}>
          <strong>Model sentences:</strong>
          <p style={{ marginTop: 8, lineHeight: 1.7 }}>
            Ich schreibe Ihnen, weil ich den Termin absagen möchte. <br />
            Ich bin krank. <br />
            Ich habe Kopfschmerzen. <br />
            Können wir einen anderen Termin vereinbaren?
          </p>
        </div>
      </Section>
    </div>
  );
};

export default HealthBodyPartsPage;
