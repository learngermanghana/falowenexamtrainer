import React, { useMemo, useState } from "react";
import { styles } from "../styles";
import AppBackButton from "./navigation/AppBackButton";
import A1CourseBookLetterPracticePanel from "./A1CourseBookLetterPracticePanel";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
  margin: 0,
};

const labelStyle = {
  display: "inline-flex",
  width: "fit-content",
  padding: "5px 10px",
  borderRadius: 999,
  background: "#e0e7ff",
  color: "#3730a3",
  fontSize: 12,
  fontWeight: 900,
};

const taskButtonStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: 14,
  background: "#ffffff",
  textAlign: "left",
  display: "grid",
  gap: 6,
  cursor: "pointer",
  font: "inherit",
};

export const A1_DAY23_WRITING_TASKS = Object.freeze([
  {
    id: "arzttermin-absagen",
    category: "Termin / Absage",
    title: "Arzttermin absagen",
    register: "formal",
    situation:
      "Sie haben morgen einen Termin beim Arzt, können aber nicht kommen. Schreiben Sie eine E-Mail an die Arztpraxis.",
    points: [
      "Sagen Sie den Termin ab.",
      "Schreiben Sie, warum Sie nicht kommen können.",
      "Fragen Sie nach einem neuen Termin.",
    ],
    taskContext:
      "formal A1 email to a doctor's office: cancel the appointment, give one reason, and ask for a new appointment",
    placeholder:
      "Sehr geehrte Damen und Herren,\n\nleider ...\n\nMit freundlichen Grüßen\n...",
  },
  {
    id: "fahrrad-moritz",
    category: "Verabredung / Freizeit",
    title: "Fahrrad fahren mit Moritz",
    register: "informal",
    situation:
      "Sie möchten am Sonntag Fahrrad fahren. Ihr deutscher Freund Moritz wohnt in Ihrer Stadt und fährt auch gern Fahrrad. Schreiben Sie Moritz eine E-Mail.",
    points: [
      "Schlagen Sie vor, am Sonntag Fahrrad zu fahren.",
      "Schreiben Sie, wann und wo Sie sich treffen möchten.",
      "Fragen Sie, ob Moritz Zeit hat.",
    ],
    taskContext:
      "informal A1 email to Moritz: suggest cycling on Sunday, give a meeting time and place, and ask if he has time",
    placeholder:
      "Hallo Moritz,\n\nam Sonntag ...\n\nViele Grüße\n...",
  },
  {
    id: "hotel-reservieren",
    category: "Reservierung",
    title: "Hotelzimmer reservieren",
    register: "formal",
    situation:
      "Sie möchten im Sommer in München Urlaub machen. Schreiben Sie eine E-Mail an ein Hotel und reservieren Sie ein Zimmer.",
    points: [
      "Schreiben Sie, wann Sie kommen und wie lange Sie bleiben.",
      "Schreiben Sie, was für ein Zimmer Sie möchten.",
      "Fragen Sie nach dem Preis.",
    ],
    taskContext:
      "formal A1 hotel reservation email: give travel dates or length of stay, request a room type, and ask the price",
    placeholder:
      "Sehr geehrte Damen und Herren,\n\nich möchte ...\n\nMit freundlichen Grüßen\n...",
  },
  {
    id: "umzug-hilfe",
    category: "Bitte / Hilfe",
    title: "Hilfe beim Umzug",
    register: "informal",
    situation:
      "Sie ziehen um. Schreiben Sie eine E-Mail an einen Freund und bitten Sie um Hilfe beim Umzug.",
    points: [
      "Schreiben Sie, wann Sie umziehen.",
      "Sagen Sie, wobei Sie Hilfe brauchen.",
      "Fragen Sie, ob Ihr Freund kommen kann.",
    ],
    taskContext:
      "informal A1 email asking a friend for moving help: say when the move is, explain the help needed, and ask if the friend can come",
    placeholder:
      "Hallo ...,\n\nich ziehe ... um.\n\nLiebe Grüße\n...",
  },
  {
    id: "tasche-im-bus",
    category: "Problem / Verlust",
    title: "Tasche im Bus vergessen",
    register: "formal",
    situation:
      "Sie haben eine Tasche im Bus vergessen. Schreiben Sie eine E-Mail an die Busfirma.",
    points: [
      "Schreiben Sie, wann und in welchem Bus Sie die Tasche vergessen haben.",
      "Beschreiben Sie die Tasche kurz.",
      "Fragen Sie, was Sie jetzt tun sollen.",
    ],
    taskContext:
      "formal A1 email to a bus company about a lost bag: identify the journey, describe the bag, and ask what to do next",
    placeholder:
      "Sehr geehrte Damen und Herren,\n\nich habe ...\n\nMit freundlichen Grüßen\n...",
  },
  {
    id: "sprachschule-anmeldung",
    category: "Anmeldung / Schule",
    title: "Für einen Deutschkurs anmelden",
    register: "formal",
    situation:
      "Sie möchten sich für einen Deutschkurs anmelden. Schreiben Sie eine E-Mail an die Sprachschule.",
    points: [
      "Schreiben Sie, für welchen Kurs Sie sich anmelden möchten.",
      "Fragen Sie, wann der nächste Kurs beginnt.",
      "Fragen Sie nach dem Preis oder einem Abendkurs.",
    ],
    taskContext:
      "formal A1 email to a language school: state the course for registration, ask when it starts, and ask about the price or evening course",
    placeholder:
      "Sehr geehrte Damen und Herren,\n\nich möchte mich ...\n\nMit freundlichen Grüßen\n...",
  },
]);

const ThreePointPlan = ({ task }) => (
  <div style={{ ...cardStyle, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
    <span style={labelStyle}>{task.category}</span>
    <h3 style={{ margin: 0 }}>{task.title}</h3>
    <p style={{ margin: 0, lineHeight: 1.7 }}>{task.situation}</p>
    <strong>Schreiben Sie etwas zu allen drei Punkten:</strong>
    <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
      {task.points.map((point) => <li key={point}>{point}</li>)}
    </ol>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Schreiben Sie ungefähr <strong>30 Wörter</strong>. Schreiben Sie eine passende Anrede,
      einen Gruß und Ihren Namen.
    </p>
  </div>
);

const A1Day23WritingWorkshopPage = () => {
  const [selectedTaskId, setSelectedTaskId] = useState(A1_DAY23_WRITING_TASKS[0].id);
  const selectedTask = useMemo(
    () => A1_DAY23_WRITING_TASKS.find((task) => task.id === selectedTaskId) || A1_DAY23_WRITING_TASKS[0],
    [selectedTaskId],
  );

  return (
    <main style={{ ...styles.container, display: "grid", gap: 18, maxWidth: 1080 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={labelStyle}>A1 · Day 23 · Chapter 14.2</span>
      </div>

      <header style={{ ...cardStyle, padding: "clamp(20px, 4vw, 34px)", background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
        <span style={labelStyle}>Schreiben workshop</span>
        <h1 style={{ ...styles.title, margin: 0 }}>E-Mails und Briefe für Alltag und Prüfung</h1>
        <p style={{ margin: 0, lineHeight: 1.75, color: "#334155", maxWidth: 900 }}>
          Today is a writing-training day. The goal is not to learn another grammar list. You will
          learn one reliable method for short A1 messages, then practise the most useful situations
          until you can write them independently.
        </p>
        <div style={{ border: "1px solid #a7f3d0", borderRadius: 14, padding: 14, background: "#ecfdf5", lineHeight: 1.7 }}>
          <strong>Learning outcome:</strong> Ich kann eine kurze A1-Nachricht mit Anrede, drei
          Inhaltspunkten, Gruß und Namen selbstständig schreiben.
        </div>
      </header>

      <section style={cardStyle}>
        <span style={labelStyle}>The method</span>
        <h2 style={{ margin: 0 }}>First mark the three points. Then write.</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Before writing any letter, number the task points <strong>1, 2, 3</strong>. Write one clear
          sentence for each point. The greeting, closing and your name are required, but they are
          not extra content points.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
          {[
            ["1. Anrede", "Who are you writing to? Formal or informal?"],
            ["2. Grund", "State why you are writing."],
            ["3. Punkt 1", "Answer the first task point clearly."],
            ["4. Punkt 2 + 3", "Give each remaining point its own sentence."],
            ["5. Gruß + Name", "Finish appropriately and sign your name."],
          ].map(([title, copy]) => (
            <div key={title} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, display: "grid", gap: 5 }}>
              <strong>{title}</strong>
              <span style={{ lineHeight: 1.55, color: "#475569" }}>{copy}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <span style={labelStyle}>Formal oder informell?</span>
        <h2 style={{ margin: 0 }}>Choose the register before you start</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["", "Informell", "Formell"].map((heading) => (
                  <th key={heading || "feature"} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Person", "Freund, Freundin, Familie", "Arztpraxis, Hotel, Schule, Firma"],
                ["Anrede", "Hallo Moritz, / Liebe Anna,", "Sehr geehrte Damen und Herren,"],
                ["Pronomen", "du, dir, dich, dein/deine", "Sie, Ihnen, Ihr/Ihre"],
                ["Gruß", "Liebe Grüße / Viele Grüße", "Mit freundlichen Grüßen"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td key={cell} style={{ border: "1px solid #e2e8f0", padding: 10, fontWeight: index === 0 ? 800 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={cardStyle}>
        <span style={labelStyle}>Teacher-guided example</span>
        <h2 style={{ margin: 0 }}>Termin absagen: build the answer from the three points</h2>
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.7 }}>
          <li><strong>Absagen:</strong> Leider kann ich morgen nicht zu meinem Termin kommen.</li>
          <li><strong>Grund:</strong> Ich bin krank.</li>
          <li><strong>Neuer Termin:</strong> Kann ich bitte einen neuen Termin am Freitag bekommen?</li>
        </ol>
        <details style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, background: "#ffffff" }}>
          <summary style={{ cursor: "pointer", fontWeight: 800 }}>Musterantwort erst nach dem Planen öffnen</summary>
          <p style={{ whiteSpace: "pre-line", lineHeight: 1.8, marginBottom: 0 }}>
            {"Sehr geehrte Damen und Herren,\n\nleider kann ich morgen nicht zu meinem Termin kommen. Ich bin krank. Kann ich bitte einen neuen Termin am Freitag bekommen?\n\nMit freundlichen Grüßen\nFelix"}
          </p>
        </details>
      </section>

      <section style={cardStyle}>
        <span style={labelStyle}>60-minute class flow</span>
        <h2 style={{ margin: 0 }}>How to practise today</h2>
        <div style={{ display: "grid", gap: 8, lineHeight: 1.65 }}>
          <div><strong>0–5 min:</strong> Find what is missing in a weak letter.</div>
          <div><strong>5–15 min:</strong> Learn the five-part writing method and formal/informal register.</div>
          <div><strong>15–25 min:</strong> Build the Arzttermin letter together.</div>
          <div><strong>25–35 min:</strong> Write the Moritz/Fahrrad task with support.</div>
          <div><strong>35–50 min:</strong> Write the Hotel task independently under a 15-minute limit.</div>
          <div><strong>50–60 min:</strong> Check all three points, greeting, closing, name and clarity.</div>
        </div>
      </section>

      <section style={cardStyle}>
        <span style={labelStyle}>Core writing bank</span>
        <h2 style={{ margin: 0 }}>Six situations worth mastering</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          These six tasks cover the most reusable A1 functions: appointment, arrangement,
          reservation, asking for help, reporting a problem and registration. Choose a task, plan
          the three points, then write it below.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
          {A1_DAY23_WRITING_TASKS.map((task) => {
            const active = task.id === selectedTask.id;
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => setSelectedTaskId(task.id)}
                style={{
                  ...taskButtonStyle,
                  border: active ? "2px solid #4f46e5" : taskButtonStyle.border,
                  background: active ? "#eef2ff" : "#ffffff",
                }}
                aria-pressed={active}
              >
                <span style={{ fontSize: 12, fontWeight: 900, color: "#475569" }}>{task.category}</span>
                <strong>{task.title}</strong>
                <span style={{ color: "#64748b" }}>{task.register === "formal" ? "Formell" : "Informell"}</span>
              </button>
            );
          })}
        </div>
      </section>

      <ThreePointPlan task={selectedTask} />

      <A1CourseBookLetterPracticePanel
        key={selectedTask.id}
        title="Mark My Letter"
        description="Write the complete letter independently. Falowen can mark the draft after you have answered all three content points."
        taskId={`A1-14.2-${selectedTask.id}`}
        taskTitle={selectedTask.title}
        taskContext={selectedTask.taskContext}
        letterType={selectedTask.register}
        promptType="email"
        placeholder={selectedTask.placeholder}
        minimumWords={25}
        maximumWords={45}
        assignmentKey="A1-14.2"
        workbookId="A1-14.2-writing-workshop"
        day={23}
        chapter="14.2"
        lessonId="A1-day-23-chapter-14.2-writing-workshop"
      />

      <section style={{ ...cardStyle, border: "1px solid #fde68a", background: "#fffbeb" }}>
        <span style={{ ...labelStyle, background: "#fef3c7", color: "#92400e" }}>Final check</span>
        <h2 style={{ margin: 0 }}>Before you finish any A1 letter</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 8 }}>
          {[
            "Punkt 1 beantwortet?",
            "Punkt 2 beantwortet?",
            "Punkt 3 beantwortet?",
            "Passende Anrede?",
            "Passender Gruß?",
            "Name geschrieben?",
            "Einfach und verständlich?",
          ].map((item) => (
            <div key={item} style={{ border: "1px solid #fde68a", borderRadius: 10, padding: 10, background: "#ffffff", fontWeight: 700 }}>
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default A1Day23WritingWorkshopPage;
