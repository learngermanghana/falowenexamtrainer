import PartnerAccount from "./PartnerAccount.jsx";
import { partnerRequest } from "../lib/organisationPartnerAccount.js";
import { loadOrganisationClasses, matchingOrganisationClasses } from "../lib/organisationClasses.js";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./OrganisationEnrolmentPage.css";

const columns = [["name", "Full name"], ["email", "Student email"], ["phone", "Phone"], ["level", "Level"], ["location", "Location"], ["emergencyContactPhone", "Emergency number"], ["language", "Course language"]];
const emptyRow = () => Object.fromEntries(columns.map(([key]) => [key, ""]));
// Accept the public-facing Kiswahili name when importing spreadsheet rows.
const normalizePastedCourseLanguage = value => {
  const language = String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  if (["swahili", "kiswahili", "kiswahili (swahili)"].includes(language)) return "Swahili";
  if (["german", "deutsch"].includes(language)) return "German";
  return ""; // Unknown names should require an explicit choice, not an incorrect default.
};
export default function OrganisationEnrolmentPage() {
  return <PartnerAccount enrolment>{({ profile }) => <OrganisationEnrolmentForm key={profile.id} profile={profile} />}</PartnerAccount>;
}
function OrganisationEnrolmentForm({ profile }) {
  const [classes, setClasses] = useState([]), [classLoading, setClassLoading] = useState(false), [classError, setClassError] = useState("");
  const loadClasses = useCallback(async () => { setClassLoading(true); setClassError(""); try { setClasses(await loadOrganisationClasses()); } catch (e) { setClassError(e.message); } finally { setClassLoading(false); } }, []);
  useEffect(() => { void loadClasses(); }, [loadClasses]);
  const partnerContext = profile?.agreement ? { agreementReference: profile.agreement.reference } : null;
  const organisation = profile || { name: "", contactName: "", email: "", phone: "" };
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
        cells.forEach((value, c) => {
          const key = columns[columnIndex + c]?.[0];
          if (!key) return;
          const normalized = key === "language" ? normalizePastedCourseLanguage(value) : value.trim();
          if ((key === "language" || key === "level") && next[index][key] !== normalized) {
            next[index].requestedClassId = "";
          }
          next[index][key] = normalized;
        });
      });
      return next;
    });
  };
  const run = async action => { setBusy(true); setError(""); try { await action(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <section className="org-enrol"><div className="org-intro"><Link to="/partnerships">Organisation Partnerships</Link><h1>Add your organisation’s students</h1><p>Choose German or Kiswahili for every student. You may submit students for both programmes in the same group, provided the matching classes are available.</p><p>Fill one row for each student. Falowen reviews your list, deducts your agreed partner share from the invoice and sends one payment link. Students are enrolled after payment is verified.</p><p>Free or sponsored Kiswahili access is handled through its own approved arrangement; the 10% partner share applies only to paid first tuition.</p><p>Each class lasts 10 weeks. Falowen access lasts six months from account activation, even if the class is completed earlier. Students can request a class change within that contract, subject to approval and availability; changes do not extend access. Tuition payments are non-refundable.</p><p><a href="https://www.falowen.app/classes" target="_blank" rel="noopener noreferrer">View upcoming classes and current prices</a>. Check the fee for each student’s selected level and class before enrolment.</p></div>
    {reference ? <div role="status"><h2>Submission received</h2><p>Your reference is <strong>{reference}</strong>. Falowen will contact your organisation after review. Students do not have accounts yet.</p><button onClick={() => { setReference(""); setRows([emptyRow()]); setRequestId(crypto.randomUUID()); setConsent(false); }}>Add another group of students</button></div> : <form onSubmit={event => { event.preventDefault(); run(async () => {
      const students = rows.filter(row => Object.values(row).some(value => value.trim())).map((row, index) => {
        const selected = classes.find(course => course.id === row.requestedClassId && course.level === row.level.toUpperCase() && course.language === row.language);
        if (!selected) throw new Error(`Student ${index + 1}: select an available class matching their level.`);
        return { ...row, requestedClassId: selected.id, requestedClassName: selected.name, requestedClassStartDate: selected.startDate };
      });
      const data = await partnerRequest("organisation-enrolments", { organisation, students, consent, website, requestId, schemaVersion: 2, ...(partnerContext?.agreementReference ? { agreementReference: partnerContext.agreementReference } : {}) });
      setReference(data.reference);
    }); }}>
      <fieldset disabled={busy}><legend>Organisation contact</legend>{partnerContext?.agreementReference && <p>Signed agreement: {partnerContext.agreementReference}</p>}<div className="org-contact">{[["name", "Organisation name"], ["contactName", "Contact person"], ["email", "Contact email"], ["phone", "Contact phone"]].map(([key, label]) => <label key={key}>{label}<input required maxLength={254} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} value={organisation[key]} readOnly/></label>)}</div>
      <label className="org-trap" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)}/></label>
      <h2>Student details</h2><p>Paste rows from Excel or Google Sheets into a cell, or type directly. Columns: name, email, phone, level, location, emergency number, course language. Existing six-column spreadsheets can still be pasted; select the language afterwards. Maximum 50 students. Available classes load automatically. Choose German or Kiswahili and the level before selecting a matching class/start date. Kiswahili levels depend on open classes. Requests are subject to Falowen confirmation.</p><button type="button" disabled={classLoading} onClick={loadClasses}>{classLoading ? "Loading classes…" : "Load / refresh available classes"}</button>{classError && <p role="alert">{classError}</p>}{!classLoading && classes.length === 0 && <p>No available classes were found. Refresh the list or view upcoming classes and contact Falowen before submitting.</p>}
      <div className="org-scroll"><table><thead><tr><th>#</th>{columns.map(([key, label]) => <th key={key}>{label}{["name", "email", "phone", "level"].includes(key) ? " *" : ""}</th>)}<th>Requested class / start date *</th><th>Remove</th></tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index}><th scope="row">{index + 1}</th>{columns.map(([key, label], c) => <td key={key}>{key === "language" ? <select aria-label={`Student ${index + 1} ${label}`} value={row.language} onChange={e => setRows(old => old.map((item, i) => i === index ? { ...item, language: e.target.value, level: "", requestedClassId: "" } : item))}><option value="">Select language</option><option value="German">German</option><option value="Swahili">Kiswahili (Swahili)</option></select> : key === "level" ? <select aria-label={`Student ${index + 1} ${label}`} value={row.level.toUpperCase()} onChange={e => setRows(old => old.map((item, i) => i === index ? { ...item, level: e.target.value, requestedClassId: "" } : item))}><option value="">Select level</option>{["A1", "A2", "B1", "B2", "C1", "C2"].filter(level => !row.language || row.language === "German" || matchingOrganisationClasses(classes, row.language, level).length > 0).map(level => <option key={level}>{level}</option>)}</select> : <input aria-label={`Student ${index + 1} ${label}`} maxLength={254} type={key === "email" ? "email" : key.toLowerCase().includes("phone") ? "tel" : "text"} value={row[key]} onChange={e => update(index, key, e.target.value)} onPaste={e => paste(e, index, c)}/>}</td>)}<td><select disabled={classLoading || !row.language || !row.level || matchingOrganisationClasses(classes, row.language, row.level).length === 0} aria-label={`Student ${index + 1} Requested class`} value={row.requestedClassId || ""} onChange={e => update(index, "requestedClassId", e.target.value)}><option value="">{classLoading ? "Loading classes…" : !row.language ? "Select language first" : !row.level ? "Select level first" : matchingOrganisationClasses(classes, row.language, row.level).length ? "Select class / start date" : "No available class for this programme and level"}</option>{matchingOrganisationClasses(classes, row.language, row.level).map(course => <option key={course.id} value={course.id}>{course.name} — {course.startDate}</option>)}</select></td><td><button type="button" aria-label={`Remove student ${index + 1}`} disabled={rows.length === 1} onClick={() => setRows(rows.filter((_, i) => i !== index))}>×</button></td></tr>)}</tbody></table></div>
      <button type="button" disabled={rows.length >= 50} onClick={() => setRows([...rows, emptyRow()])}>+ Add student</button>
      <label className="org-consent"><input required type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/>I have permission to submit these students’ details and understand that Falowen must approve their enrolment.</label>
      <p>Use an email each student can access. Never enter passwords. Submissions are private and cannot be viewed from this public page. You can return here to submit more students.</p>
      {error && <p role="alert">{error}</p>}<button type="submit">{busy ? "Submitting…" : "Submit for Falowen review"}</button></fieldset>
    </form>}
  </section>;
}
