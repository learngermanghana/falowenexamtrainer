import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PROGRAM_STORAGE_KEY = "falowen:signup-program";

const normalizeLabel = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const includesAny = (value, labels) => labels.some((label) => value.includes(label));

const LOGIN_LABELS = ["log in", "login", "go to login", "anmelden", "se connecter"];
const SIGNUP_LABELS = ["create account", "sign up", "registrieren", "s'inscrire"];
const HOME_LABELS = ["back to overview", "back to landing", "zurück", "retour"];

const getSignupProgram = (search = "") =>
  "german";

const buildSignupPath = (program = "german", search = "") => {
  const params = new URLSearchParams(search);
  params.delete("program");
  const query = params.toString();
  return `/signup${query ? `?${query}` : ""}`;
};

const saveProgram = (program) => {
  try {
    window.localStorage.setItem(PROGRAM_STORAGE_KEY, "german");
  } catch (_error) {}
};

export default function PublicAuthRouteBridge() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignupPath = location.pathname === "/signup" || location.pathname === "/signup/";

  if (isSignupPath && typeof window !== "undefined") {
    saveProgram(getSignupProgram(location.search));
  }

  useEffect(() => {
    if (location.pathname === "/login/") {
      navigate(`/login${location.search}`, { replace: true });
      return;
    }

    if (isSignupPath) {
      const program = getSignupProgram(location.search);
      const target = buildSignupPath(program, location.search);
      saveProgram(program);
      if (`${location.pathname}${location.search}` !== target) {
        navigate(target, { replace: true });
      }
    }
  }, [isSignupPath, location.pathname, location.search, navigate]);

  useEffect(() => {
    const isLoginRoute = location.pathname === "/login";
    const isSignupRoute = location.pathname === "/signup";

    const handleClick = (event) => {
      const control = event.target && event.target.closest ? event.target.closest("button, a") : null;
      if (!control) return;

      const label = normalizeLabel(control.getAttribute("aria-label") || control.textContent);
      const isLandingSignupButton = control.classList && control.classList.contains("falowen-home-primary");
      const isSignupControl = isLandingSignupButton || includesAny(label, SIGNUP_LABELS);

      if (!isSignupRoute && isSignupControl) {
        event.preventDefault();
        event.stopPropagation();
        const program = "german";
        saveProgram(program);
        navigate(buildSignupPath(program));
        return;
      }

      if (isSignupRoute && includesAny(label, LOGIN_LABELS)) {
        event.preventDefault();
        navigate("/login");
        return;
      }

      if ((isLoginRoute || isSignupRoute) && includesAny(label, HOME_LABELS)) {
        event.preventDefault();
        navigate("/");
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [location.pathname, navigate]);

  return null;
}
