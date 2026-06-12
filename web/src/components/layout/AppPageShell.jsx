import React from "react";
import AppBackButton from "../navigation/AppBackButton";
import "./AppPageShell.css";

const AppPageShell = ({
  title,
  subtitle,
  backLabel = "Back",
  backTo = "/campus/course",
  onBack,
  actions,
  rightActions,
  children,
  className = "",
}) => {
  const renderedActions = rightActions ?? actions;

  return (
    <div className={`app-page-shell ${className}`.trim()}>
      <header className="app-page-shell__header">
        <div className="app-page-shell__navigation">
          <AppBackButton label={backLabel} fallbackPath={backTo} onBack={onBack} />
          {renderedActions ? <div className="app-page-shell__actions">{renderedActions}</div> : null}
        </div>
        {title || subtitle ? (
          <div className="app-page-shell__heading">
            {title ? <h1 className="app-page-shell__title">{title}</h1> : null}
            {subtitle ? <p className="app-page-shell__subtitle">{subtitle}</p> : null}
          </div>
        ) : null}
      </header>
      <main className="app-page-shell__content">{children}</main>
    </div>
  );
};

export default AppPageShell;
