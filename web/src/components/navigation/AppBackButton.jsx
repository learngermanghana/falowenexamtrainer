import React from "react";
import { useNavigate } from "react-router-dom";
import "./AppBackButton.css";

const hasUsableHistory = () => {
  if (typeof window === "undefined") return false;

  const routerIndex = window.history.state?.idx;
  return Number.isFinite(routerIndex) && routerIndex > 0;
};

const AppBackButton = ({
  label = "Back",
  fallbackPath = "/campus/course",
  onBack,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (hasUsableHistory()) {
      navigate(-1);
      return;
    }

    navigate(fallbackPath, { replace: true });
  };

  return (
    <button
      type="button"
      className={`app-back-button ${className}`.trim()}
      onClick={handleBack}
      aria-label={label}
    >
      <span className="app-back-button__icon" aria-hidden="true">←</span>
      <span>{label}</span>
    </button>
  );
};

export default AppBackButton;
