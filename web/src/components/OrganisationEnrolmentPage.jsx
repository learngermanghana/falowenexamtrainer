import { loadOrganisationClasses } from "../lib/organisationClasses.js";
import { loadOrganisationPartnerContext } from "../lib/organisationPartnerContext.js";
import { submitPartnershipForm as request } from "../lib/submitPartnershipForm";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./OrganisationEnrolmentPage.css";

const columns = [["name", "Full name"], ["email", "Student email"], ["phone", "Phone"], ["level", "Level"], ["location", "Location"], ["emergencyContactPhone", "Emergency number"]];
const emptyRow = () => Object.fromEntries(columns.map(([key]) => [key, ""]));
export default function OrganisationEnrolmentPage() {
  const [classes, setClasses] = useState([]), [classLoading, setClassLoading] = useState(false), [classError, setClassError] = useState("");
  const loadClasses = async () => { setClassLoading(true); setClassError(""); try { setClasses(await loadOrganisationClasses()); } catch (e) { setClassError(e.message); } finally { setClassLoading(false); } };
  const [partnerContext] = useState(loadOrganisationPartnerContext);
  const [organisation, setOrganisation] = useState(() => partnerContext?.organisation || { name: "", contactName: "", email: "", phone: "" });
  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow()]);
  const [consent, setConsent] = useState(false), [website, setWebsite] = useState("");
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [reference, setReference] = useState("");
  const update = (index, key, value) => setRows(old => old.map((row, i) => i === index ? { ...row, [key]: value } : row));
  const paste = (event, rowIndex, columnIndex) => {
    const text = event.clipboardData.getData("text");
    if (!text.includes("\t") && !text.includes("\n")) return;
    event.preventDefault();
    const values = text.replace(/\r/g, "").trimEnd().split("\n").map(line => line.split("\t"));
    if (rowIndex + values.length > 50) { setError("Maximum 50 students per submission."); return; }
    setRows(old => {
      const next = old.map(row => ({ ...row }));
      values.forEach((cells, r) => {
        const index = rowIndex + r; next[index] ||= emptyRow();
        cells.forEach((value, c) => { const key = columns[columnIndex + c]?.[0]; if (key) next[index][key] = value.trim(); });
      });
      return next;
    });
  };
  const run = async action => { setBusy(true); setError(""); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <section className="org-enrol"><div className="org-intro"><Link to="/partnerships">Organisation Partnerships</Link><h1>Add your organisation’s students</h1><p>Fill one row for each student. Falowen reviews your list, deducts your agreed partner share from the invoice and sends one payment link. Students are enrolled after payment is verified.</p><p>Each class lasts 10 weeks. Falowen access lasts six months from account activation, even if the class is completed earlier. Students can request a class change within that contract, subject to approval and availability; changes do not extend access. Tuition payments are non-refundable.</p></div>
    {reference ? <div role="status"><h2>Submission received</h2><p>Your reference is <strong>{reference}</strong>. Falowen will contact your organisation after review. Students do not have accounts yet.</p><button onClick={() => { setReference(""); setRows([emptyRow()]); setRequestId(crypto.randomUUID()); setConsent(false); }}>Add another group of students</button></div> : <form onSubmit={event => { event.preventDefault(); run(async () => {
      const students = rows.filter(row => Object.values(row).some(value => value.trim())).map((row, index) => {
        const selected = classes.find(course => course.id === row.requestedClassId && course.level === row.level.toUpperCase());
        if (!selected) throw new Error(`Student ${index + 1}: select an available class matching their level.`);
        return { ...row, requestedClassId: selected.id, requestedClassName: selected.name, requestedClassStartDate: selected.startDate };
      });
      const data = await request("organisation-enrolments", { organisation, students, consent, website, requestId, schemaVersion: 2, ...(partnerContext?.agreementReference ? { agreementReference: partnerContext.agreementReference } : {}) });
      setReference(data.reference);
    }); }}>
      <fieldset disabled={busy}><legend>Organisation contact</legend>{partnerContext?.agreementReference && <p>Signed agreement: {partnerContext.agreementReference}</p>}<div className="org-contact">{[["name", "Organisation name"], ["contactName", "Contact person"], ["email", "Contact email"], ["phone", "Contact phone"]].map(([key, label]) => <label key={key}>{label}<input required maxLength={254} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} value={organisation[key]} onChange={e => setOrganisation({ ...organisation, [key]: e.target.value })}/></label>)}</div>
      <label className="org-trap" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)}/></label>
      <h2>Student details</h2><p>Paste rows from Excel or Google Sheets into a cell, or type directly. Columns: name, email, phone, level, location, emergency number. Use A1, A2, B1, B2, C1 or C2. Maximum 50 students. Select a level, load available classes, then choose a class/start date for each student. Class choices are requests for Falowen to confirm.</p><button type="button" disabled={classLoading} onClick={loadClasses}>{classLoading ? "Loading classes…" : "Load / refresh available classes"}</button>{classError && <p role="alert">{classError}</p>}{!classLoading && classes.length === 0 && <p>Load classes to choose a start date. If none are available for your level, contact Falowen before submitting.</p>}
      <div className="org-scroll"><table><thead><tr><th>#</th>{columns.map(([key, label]) => <th key={key}>{label}{["name", "email", "phone", "level"].includes(key) ? " *" : ""}</th>)}<th>Requested class / start date *</th><th>Remove</th></tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index}><th scope="row">{index + 1}</th>{columns.map(([key, label], c) => <td key={key}>{key === "level" ? <select aria-label={`Student ${index + 1} ${label}`} value={row.level.toUpperCase()} onChange={e => setRows(old => old.map((item, i) => i === index ? { ...item, level: e.target.value, requestedClassId: "" } : item))}><option value="">Select level</option>{["A1", "A2", "B1", "B2", "C1", "C2"].map(level => <option key={level}>{level}</option>)}</select> : <input aria-label={`Student ${index + 1} ${label}`} maxLength={254} type={key === "email" ? "email" : key.toLowerCase().includes("phone") ? "tel" : "text"} value={row[key]} onChange={e => update(index, key, e.target.value)} onPaste={e => paste(e, index, c)}/>}</td>)}<td><select aria-label={`Student ${index + 1} Requested class`} value={row.requestedClassId || ""} onChange={e => update(index, "requestedClassId", e.target.value)}><option value="">Select class / start date</option>{classes.filter(course => course.level === row.level.toUpperCase()).map(course => <option key={course.id} value={course.id}>{course.name} — {course.startDate}</option>)}</select></td><td><button type="button" aria-label={`Remove student ${index + 1}`} disabled={rows.length === 1} onClick={() => setRows(rows.filter((_, i) => i !== index))}>×</button></td></tr>)}</tbody></table></div>
      <button type="button" disabled={rows.length >= 50} onClick={() => setRows([...rows, emptyRow()])}>+ Add student</button>
      <label className="org-consent"><input required type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/>I have permission to submit these students’ details and understand that Falowen must approve their enrolment.</label>
      <p>Use an email each student can access. Never enter passwords. Submissions are private and cannot be viewed from this public page. You can return here to submit more students.</p>
      {error && <p role="alert">{error}</p>}<button type="submit">{busy ? "Submitting…" : "Submit for Falowen review"}</button></fieldset>
    </form>}
  </section>;
}
