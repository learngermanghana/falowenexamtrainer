import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
  const examOnly = studentProfile?.accountType === "exam_only";
  const needsTuition = examOnly && studentProfile?.courseEnrollmentPreserved !== true;
  const selectedClass = classes.find(course => course.id === classId);

  useEffect(() => {
    if (target !== "full_course" || !needsTuition) return undefined;
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
  }, [target, needsTuition]);

  if (!user) return <Navigate to="/login/" replace />;
  if (!studentProfile) return <p role="status">Your student profile is unavailable. Sign in again to manage your account.</p>;
  const submit = async (event) => {
    event.preventDefault();
    if (busy || !target) return;
    if (target === current && (target !== "full_course" || !needsTuition)) {
      if (target === "exam_preparation") navigate("/mock/checkout");
      else if (typeof window !== "undefined" && window.location.hostname.includes("exams.falowen.app")) window.location.assign("https://www.falowen.app/campus/account?tab=billing");
      else navigate("/campus/account?tab=billing");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${getBackendUrl()}/account/course-type`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ courseType: target, classId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not change course type.");
      if (result.checkout === "tuition") {
        const url = new URL(result.authorizationUrl);
        if (url.origin !== "https://checkout.paystack.com") throw new Error("Invalid checkout URL.");
        window.location.assign(url.href);
        return;
      }
      await refreshStudentProfile();
      setTarget("");
      if (result.checkout === "exam") navigate("/mock/checkout");
      else if (target === "full_course") {
        if (typeof window !== "undefined" && window.location.hostname.includes("exams.falowen.app")) window.location.assign("https://www.falowen.app/campus/account?tab=billing");
        else navigate("/campus/account?tab=billing");
      }
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
    <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      {!choiceMode && <><label htmlFor="account-course-type">Change course type</label>
      <select id="account-course-type" style={styles.select} required value={target} disabled={busy}
        onChange={event => { setTarget(event.target.value); setError(""); }}>
        <option value="">Choose a course type</option>
        <option value="full_course">Full course</option>
        <option value="exam_preparation">Exam preparation</option>
      </select></>}
      {target === "exam_preparation" && target !== current &&
        <p>Switch to exam preparation, then review the monthly price before paying. Your existing enrollment, payments and balance are preserved if you return to the full course. Unpaid course access remains subject to trial limits.</p>}
      {target === "full_course" && (target !== current || needsTuition) && (needsTuition ? <>
        <label htmlFor="account-course-class">German class</label>
        <select id="account-course-class" style={styles.select} value={classId}
          disabled={busy || loadingClasses} onChange={event => setClassId(event.target.value)}>
          <option value="">{loadingClasses ? "Loading classes…" : "Choose a class, or resume a previous checkout"}</option>
          {classes.map(course => <option key={course.id} value={course.id}>
            {course.title} · {course.startDate}
          </option>)}
        </select>
        <p>Full tuition is due for a new enrollment. Course access starts after Paystack confirms payment.</p>
        {selectedClass && <p>Tuition {formatCurrency(selectedClass.tuitionGhs)}. Checkout total including the shared processing fee {formatCurrency(calculateSharedPaystackFee(selectedClass.tuitionGhs).checkoutAmount)}.</p>}
      </> : <p>Return to your existing course enrollment and billing.</p>)}
      {error && <p role="alert">{error}</p>}
      <button type="submit" style={styles.primaryButton} disabled={!target || (!choiceMode && target === current && (target !== "full_course" || !needsTuition)) || busy}>
        {busy ? "Please wait…" : target === "full_course" && needsTuition ? "Continue to tuition checkout" : choiceMode ? (target === "full_course" ? "Continue to course billing" : "Continue to exam checkout") : "Confirm course type"}
      </button>
    </form>
    <p><Link to={examOnly ? "/mock/checkout" : "/campus/account"}>{examOnly ? "Exam subscription" : "Back to Account"}</Link></p>
    {examOnly && <button type="button" onClick={logout} style={styles.secondaryButton}>Sign out</button>}
  </main>;
}
