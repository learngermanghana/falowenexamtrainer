import React, { useEffect } from "react";
import LandingPageSimple from "./LandingPageSimple";
import {
  rememberPublicFunnelContext,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";

const FREE_LESSON_VIDEO_ID = "CFkrrVxhdL4";
const HOMEPAGE_REVIEWS_SCRIPT_ID = "falowen-homepage-reviews-script";

export default function LandingPage(props) {
  useEffect(() => {
    rememberPublicFunnelContext({
      lastStage: "landing",
      source: "homepage",
      video: FREE_LESSON_VIDEO_ID,
    });
    trackPublicFunnelEvent("landing_view", { video: FREE_LESSON_VIDEO_ID });
  }, []);

  useEffect(() => {
    if (document.getElementById(HOMEPAGE_REVIEWS_SCRIPT_ID)) return undefined;

    const script = document.createElement("script");
    script.id = HOMEPAGE_REVIEWS_SCRIPT_ID;
    script.src = "/homepage-reviews.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const injectedSection = document.getElementById("falowen-google-reviews");
      const injectedStyles = document.getElementById("falowen-google-reviews-styles");
      injectedSection?.remove();
      injectedStyles?.remove();
      script.remove();
    };
  }, []);

  return <LandingPageSimple {...props} />;
}
