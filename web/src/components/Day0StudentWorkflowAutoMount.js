import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useLocation } from "react-router-dom";
import Day0StudentWorkflowUpgrade, { DAY0_PATH_CONFIG } from "./Day0StudentWorkflowUpgrade";

const SUPPORTED_DAY0_PATHS = new Set(DAY0_PATH_CONFIG.map((item) => item.match));

const Day0StudentWorkflowAutoMount = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (!SUPPORTED_DAY0_PATHS.has(location.pathname)) return undefined;

    const existing = document.getElementById("falowen-day0-workflow-upgrade");
    if (existing) existing.remove();

    const pageContainer = document.querySelector("main .layout-main") || document.querySelector("main") || document.body;
    const lessonContainer = pageContainer.querySelector("div[style*='display: grid']") || pageContainer.firstElementChild || pageContainer;

    const mount = document.createElement("div");
    mount.id = "falowen-day0-workflow-upgrade";
    mount.style.margin = "16px 0";

    if (lessonContainer.firstElementChild?.nextSibling) {
      lessonContainer.insertBefore(mount, lessonContainer.firstElementChild.nextSibling);
    } else {
      lessonContainer.prepend(mount);
    }

    const root = createRoot(mount);
    root.render(<Day0StudentWorkflowUpgrade />);

    return () => {
      root.unmount();
      mount.remove();
    };
  }, [location.pathname]);

  return null;
};

export default Day0StudentWorkflowAutoMount;
