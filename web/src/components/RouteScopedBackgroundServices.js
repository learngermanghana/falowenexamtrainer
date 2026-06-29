import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { registerOfflineServiceWorker } from "../serviceWorkerRegistration";
import { isPublicAuthPath } from "./RouteScopedAppServices";

export default function RouteScopedBackgroundServices() {
  const location = useLocation();

  useEffect(() => {
    if (isPublicAuthPath(location.pathname)) return;
    registerOfflineServiceWorker();
  }, [location.pathname]);

  return null;
}
