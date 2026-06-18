import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const normalizeLabel = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const includesAny = (value, labels) => labels.some((label) => value.includes(label));

const LOGIN_LABELS = ["log in", "login", "go to login", "anmelden", "se connecter"];
const SIGNUP_LABELS = ["create account", "sign up", "registrieren", "s'inscrire"];
const HOME_LABELS = ["back to overview", "back to landing", "zurück", "retour"];

export default function PublicAuthRouteBridge() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/login/") {
      navigate(`/login${location.search}`, { replace: true });
      return;
    }

    if (location.pathname === "/signup/") {
      navigate(`/signup${location.search}`, { replace: true });
      return;
    }

    if (location.pathname === "/signup") {
      const params = new URLSearchParams(location.search);
      const requestedProgram = params.get("program");
      const storedProgram = window.localStorage.getItem("falowen:signup-program");
      const program = requestedProgram === "french" || requestedProgram === "german"
        ? requestedProgram
        : storedProgram === "french"
          ? "french"
          : "german";

      window.localStorage.setItem("falowen:signup-program", program);

      if (requestedProgram !== program) {
        navigate(`/signup?program=${program}`, { replace: true });
      }
    }
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    const isLoginRoute = location.pathname === "/login";
    const isSignupRoute = location.pathname === "/signup";
    if (!isLoginRoute && !isSignupRoute) return undefined;

    const handleClick = (event) => {
      const control = event.target?.closest?.("button, a");
      if (!control) return;

      const label = normalizeLabel(control.getAttribute("aria-label") || control.textContent);
      if (!label) return;

      if (isLoginRoute && includesAny(label, SIGNUP_LABELS)) {
        const storedProgram = window.localStorage.getItem("falowen:signup-program");
        const program = storedProgram === "french" ? "french" : "german";
        navigate(`/signup?program=${program}`);
        return;
      }

      if (isSignupRoute && includesAny(label, LOGIN_LABELS)) {
        navigate("/login");
        return;
      }

      if (includesAny(label, HOME_LABELS)) {
        navigate("/");
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [location.pathname, navigate]);

  return null;
}
