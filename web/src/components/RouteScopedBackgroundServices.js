import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isPublicAuthPath } from "../lib/publicAuthRoutes";
import { registerOfflineServiceWorker } from "../serviceWorkerRegistration";

export default function RouteScopedBackgroundServices() {
  const location = useLocation();

  useEffect(() => {
    if (isPublicAuthPath(location.pathname)) return;
    registerOfflineServiceWorker();
  }, [location.pathname]);

  return null;
}
