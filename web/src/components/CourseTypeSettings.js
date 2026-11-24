import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../lib/formatters";
import { calculateSharedPaystackFee } from "../lib/paystackFeePolicy";
import { getBackendUrl } from "../services/backendUrl";
import { isPublicClassOpen, loadPublicClasses } from "../services/publicClassCatalogService";
import { styles } from "../styles";
import MyCoursesPanel from "./MyCoursesPanel";
import { PaymentNavigation } from "./MockExamCommerce";

export function getCourseType(profile) {
  return profile?.courseType || (profile?.accountType === "exam_only" ? "exam_preparation" : "full_course");
}

export default function CourseTypeSettings() {
  const { user, studentProfile, refreshStudentProfile, logout } = useAuth();
  const location = useLocation();
  const paymentReturn = new URLSearchParams(location.search).has("tuitionReturn");
  const current = getCourseType(studentProfile);
  const selectedChoice = new URLSearchParams(location.search).get("choice");
  const choiceMode = ["full_course", "exam_preparation"].includes(selectedChoice);
  const [target, setTarget] = useState(() => {
    const choice = new URLSearchParams(location.search).get("choice");
    return ["full_course", "exam_preparation"].includes(choice) ? choice : "";
  });
  useEffect(() => {
    if (choiceMode) setTarget(selectedChoice);
  }, [choiceMode, selectedChoice]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checkoutRequired, setCheckoutRequired] = useState("");
  const [notice, setNotice] = useState("");
  const examOnly = studentProfile?.accountType === "exam_only";
  const needsTuition = examOnly && studentProfile?.courseEnrollmentPreserved !== true;
  const selectedClass = classes.find(course => course.id === classId);
  const canSwitch = String(studentProfile?.program || "german").toLowerCase() === "german" && String(studentProfile?.secondaryProgram || "").toLowerCase() !== "swahili" && !["approved", "pending"].includes(studentProfile?.institutionVerification);

  useEffect(() => {
    if (!canSwitch || target !== "full_course" || !needsTuition) return undefined;
    let active = true;
    setLoadingClasses(true);
    loadPublicClasses().then((options) => {
      if (active) setClasses(options.filter(course => course.language === "German" &&
        !course.isSelfLearning && course.availability !== "always" && isPublicClassOpen(course)));
    }).catch(() => {
      if (active) setError("Could not load available classes.");
    }).finally(() => {
      if (active) setLoadingClasses(false);
    });
    return () => { active = false; };
  }, [target, needsTuition, canSwitch]);

  if (!user) return <Navigate to="/login/" replace />;
  if (!studentProfile) return <p role="status">Your student profile is unavailable. Sign in again to manage your account.</p>;
  const submit = async (event, beginCheckout = false) => {
    event.preventDefault();
    if (busy || !target || !canSwitch) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${getBackendUrl()}/account/course-type`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ courseType: target, classId, expectedCourseType: current, beginCheckout }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not change course type.");
      if (result.checkout === "required") {
        setCheckoutRequired(result.reason || "Review tuition before continuing.");
        return;
      }
      if (result.checkout === "tuition") {
        const url = new URL(result.authorizationUrl);
        if (url.origin !== "https://checkout.paystack.com") throw new Error("Invalid checkout URL.");
        window.location.assign(url.href);
        return;
      }
      await refreshStudentProfile();
      setTarget("");
      setCheckoutRequired("");
      setNotice(result.trialEndsAt ? "Course type saved. Your existing trial ends on " + new Date(result.trialEndsAt).toLocaleDateString() + ". No new trial or payment was created." : "Course type saved. Existing payments, access dates and progress are unchanged.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return <main style={{ ...styles.card, maxWidth: 640, margin: "32px auto" }}>
    <PaymentNavigation />
    <p><Link to="/mock/payment">← Back to payment options</Link></p>
    <h1>{choiceMode ? (selectedChoice === "full_course" ? "Full Course" : "Exam Preparation") : "Course type"}</h1>
    {!choiceMode && <MyCoursesPanel />}
    <p>Current type <strong>{current === "exam_preparation" ? "Exam preparation" : "Full course"}</strong></p>
    {paymentReturn && <p role="status">{examOnly
      ? "Waiting for Paystack to confirm your tuition payment. Refresh this page to check your access."
      : "Your full-course enrollment is active."}</p>}
    {!canSwitch && <p role="status">Contact admissions to manage course types for dual-language or institutional enrollments.</p>}
    {notice && <p role="status">{notice} <Link to="/exams/overview">Open Exams Room</Link>{" · "}{typeof window !== "undefined" && window.location.hostname.includes("exams.falowen.app") ? <a href="https://www.falowen.app/campus/course">Open Campus</a> : <Link to="/campus/course">Open Campus</Link>}</p>}
    {canSwitch && <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      {!choiceMode && <><label htmlFor="account-course-type">Change course type</label>
      <select id="account-course-type" style={styles.select} required value={target} disabled={busy}
        onChange={event => { setTarget(event.target.value); setError(""); setCheckoutRequired(""); setNotice(""); }}>
        <option value="">Choose a course type</option>
        <option value="full_course">Full course</option>
        <option value="exam_preparation">Exam preparation</option>
      </select></>}
      {target === "exam_preparation" && target !== current &&
        <p>Switch your learning preference without making a payment. Existing course payments, trial expiry and progress remain unchanged. You can purchase exam access separately.</p>}
      {target === "full_course" && (target !== current || needsTuition) && (needsTuition ? <>
        <label htmlFor="account-course-class">German class</label>
        <select id="account-course-class" style={styles.select} value={classId}
          disabled={busy || loadingClasses} onChange={event => { setClassId(event.target.value); setCheckoutRequired(""); }}>
          <option value="">{loadingClasses ? "Loading classes…" : "Choose a class, or resume a previous checkout"}</option>
          {classes.map(course => <option key={course.id} value={course.id}>
            {course.title} · {course.startDate}
          </option>)}
        </select>
        <p>If your exam trial is still active, selecting an open German class at your current level can transfer its remaining days to Full Course. Otherwise tuition is required. Selecting a class does not charge you.</p>
        {selectedClass && <p>Tuition {formatCurrency(selectedClass.tuitionGhs)}. Checkout total including the shared processing fee {formatCurrency(calculateSharedPaystackFee(selectedClass.tuitionGhs).checkoutAmount)}.</p>}
      </> : <p>Return to your existing course enrollment and billing.</p>)}
      {error && <p role="alert">{error}</p>}
      {checkoutRequired && <p role="status">{checkoutRequired}</p>}
      <button type="submit" style={styles.primaryButton} disabled={!target || busy}>
        {busy ? "Please wait…" : target === "full_course" && needsTuition ? "Check course access" : "Confirm course type"}
      </button>
      {checkoutRequired && target === "full_course" && needsTuition && <button type="button" style={styles.secondaryButton} disabled={busy} onClick={event=>submit(event,true)}>Continue to tuition checkout</button>}
    </form>}
    <p><Link to="/mock/checkout">Review exam subscription</Link>{" · "}{!examOnly && (typeof window !== "undefined" && window.location.hostname.includes("exams.falowen.app") ? <a href="https://www.falowen.app/campus/account?tab=billing">Course billing</a> : <Link to="/campus/account?tab=billing">Course billing</Link>)}</p>
    {examOnly && <button type="button" onClick={logout} style={styles.secondaryButton}>Sign out</button>}
  </main>;
}
