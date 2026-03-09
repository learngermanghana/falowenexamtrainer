import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 12 };

const chipStyle = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  fontSize: 13,
  fontWeight: 700,
};

const softBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  background: "#f8fafc",
};

const promptBox = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 12,
  background: "#eff6ff",
};

const answerBox = {
  border: "1px dashed #cbd5e1",
  borderRadius: 12,
  padding: 12,
  minHeight: 70,
};

const heroSrc =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80";

const ImageBreak = ({ src, title, subtitle }) => (
  <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
    <img
      src={src}
      alt=""
      style={{
        width: "100%",
        height: "clamp(220px,30vw,340px)",
        objectFit: "cover",
      }}
    />
    <div style={{ padding: 14 }}>
      <strong>{title}</strong>
      <div>{subtitle}</div>
    </div>
  </div>
);

const TableScroll = ({ children }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ borderCollapse: "collapse", width: "100%" }}>{children}</table>
  </div>
);

const th = {
  border: "1px solid #d1d5db",
  padding: 8,
  background: "#f9fafb",
};

const td = {
  border: "1px solid #d1d5db",
  padding: 8,
};

const FormingBasicStatementsPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card }}>
        <button
          style={{ ...styles.secondaryButton }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1>A1 Practice Book – Cities, Countries and Direction</h1>
        <p>Day 8 focus: location, movement and Präteritum.</p>
      </header>

      <ImageBreak
        src={heroSrc}
        title="Today's focus: Präteritum"
        subtitle="We compare present and past forms and practise direction questions."
      />

      {/* TENSES */}

      <section style={sectionStyle}>
        <h2>German Tenses</h2>

        <div style={{ display: "flex", gap: 6 }}>
          <span style={chipStyle}>Präsens</span>
          <span style={chipStyle}>Perfekt</span>
          <span style={chipStyle}>Präteritum</span>
          <span style={chipStyle}>Futur</span>
        </div>

        <TableScroll>
          <thead>
            <tr>
              <th style={th}>German</th>
              <th style={th}>English</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>Präsens</td>
              <td style={td}>Present</td>
            </tr>
            <tr>
              <td style={td}>Perfekt</td>
              <td style={td}>Present Perfect</td>
            </tr>
            <tr>
              <td style={td}>Präteritum</td>
              <td style={td}>Simple Past</td>
            </tr>
            <tr>
              <td style={td}>Futur</td>
              <td style={td}>Future</td>
            </tr>
          </tbody>
        </TableScroll>

        <div style={softBox}>
          Today we focus on <strong>Präteritum</strong>.
        </div>
      </section>

      {/* HABEN SEIN */}

      <section style={sectionStyle}>
        <h2>sein / haben present vs past</h2>

        <TableScroll>
          <thead>
            <tr>
              <th style={th}>Pronoun</th>
              <th style={th}>sein (present)</th>
              <th style={th}>sein (past)</th>
              <th style={th}>haben (present)</th>
              <th style={th}>haben (past)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>ich</td>
              <td style={td}>bin</td>
              <td style={td}>war</td>
              <td style={td}>habe</td>
              <td style={td}>hatte</td>
            </tr>
            <tr>
              <td style={td}>du</td>
              <td style={td}>bist</td>
              <td style={td}>warst</td>
              <td style={td}>hast</td>
              <td style={td}>hattest</td>
            </tr>
            <tr>
              <td style={td}>er/sie/es</td>
              <td style={td}>ist</td>
              <td style={td}>war</td>
              <td style={td}>hat</td>
              <td style={td}>hatte</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      {/* LIEGEN */}

      <section style={sectionStyle}>
        <h2>liegen (city location)</h2>

        <div style={softBox}>
          Directions:
          <ul>
            <li>Osten = East</li>
            <li>Westen = West</li>
            <li>Süden = South</li>
            <li>Norden = North</li>
          </ul>
        </div>

        <TableScroll>
          <tbody>
            <tr>
              <td style={td}>Berlin liegt im Osten von Deutschland.</td>
              <td style={td}>Berlin is in the east of Germany.</td>
            </tr>
            <tr>
              <td style={td}>Hamburg liegt im Norden von Deutschland.</td>
              <td style={td}>Hamburg is in the north of Germany.</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      {/* WO WOHER WOHIN */}

      <section style={sectionStyle}>
        <h2>wo / woher / wohin</h2>

        <TableScroll>
          <thead>
            <tr>
              <th style={th}>Word</th>
              <th style={th}>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>wo</td>
              <td style={td}>where (location)</td>
            </tr>
            <tr>
              <td style={td}>woher</td>
              <td style={td}>where from</td>
            </tr>
            <tr>
              <td style={td}>wohin</td>
              <td style={td}>where to</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      {/* NACH VS IN */}

      <section style={sectionStyle}>
        <h2>nach vs in</h2>

        <div style={softBox}>
          Use <strong>nach</strong> for countries with no article.
          <br />
          Use <strong>in + article</strong> for countries with article.
        </div>

        <TableScroll>
          <thead>
            <tr>
              <th style={th}>nach</th>
              <th style={th}>in + article</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>nach Deutschland</td>
              <td style={td}>in die Schweiz</td>
            </tr>
            <tr>
              <td style={td}>nach Ghana</td>
              <td style={td}>in die USA</td>
            </tr>
            <tr>
              <td style={td}>nach Italien</td>
              <td style={td}>in den Iran</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      {/* IRREGULAR */}

      <section style={sectionStyle}>
        <h2>Irregular verbs with vowel change</h2>

        <div style={softBox}>
          German vowels: <strong>a, e, i, o, u</strong>
        </div>

        <TableScroll>
          <thead>
            <tr>
              <th style={th}>Verb</th>
              <th style={th}>ich</th>
              <th style={th}>du</th>
              <th style={th}>er/sie/es</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>fahren</td>
              <td style={td}>fahre</td>
              <td style={td}>fährst</td>
              <td style={td}>fährt</td>
            </tr>
            <tr>
              <td style={td}>sprechen</td>
              <td style={td}>spreche</td>
              <td style={td}>sprichst</td>
              <td style={td}>spricht</td>
            </tr>
            <tr>
              <td style={td}>essen</td>
              <td style={td}>esse</td>
              <td style={td}>isst</td>
              <td style={td}>isst</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      {/* MAN VS MANN */}

      <section style={sectionStyle}>
        <h2>man vs Mann</h2>

        <div
          style={{
            border: "1px solid #fecaca",
            background: "#fff1f2",
            borderLeft: "6px solid #ef4444",
            padding: 12,
          }}
        >
          <strong>Common mistakes:</strong> man is a pronoun (lowercase), but Mann is a noun
          (capitalized). <br />
          Correction: <strong>Man spricht hier Deutsch.</strong> (not Mann spricht hier Deutsch.)
        </div>

        <div style={softBox}>
          Rule: <strong>man</strong> = people in general | <strong>Mann</strong> = a man
        </div>

        <TableScroll>
          <tbody>
            <tr>
              <td style={td}>Man spricht hier Deutsch.</td>
              <td style={td}>People speak German here.</td>
            </tr>
            <tr>
              <td style={td}>Der Mann heißt Simon.</td>
              <td style={td}>The man's name is Simon.</td>
            </tr>
          </tbody>
        </TableScroll>

        <TableScroll>
          <tbody>
            <tr><td style={td}>ich esse</td></tr>
            <tr><td style={td}>du isst</td></tr>
            <tr><td style={td}>er/sie/es/man isst</td></tr>
            <tr><td style={td}>wir essen</td></tr>
            <tr><td style={td}>ihr esst</td></tr>
            <tr><td style={td}>sie/Sie essen</td></tr>
          </tbody>
        </TableScroll>
      </section>

      {/* FINAL PRACTICE */}

      <section style={sectionStyle}>
        <h2>Practice</h2>

        <div style={promptBox}>Wo liegt Berlin?</div>
        <div style={answerBox}></div>

        <div style={promptBox}>Woher kommst du?</div>
        <div style={answerBox}></div>

        <div style={promptBox}>Wohin gehst du morgen?</div>
        <div style={answerBox}></div>
      </section>
    </main>
  );
};

export default memo(FormingBasicStatementsPage);
