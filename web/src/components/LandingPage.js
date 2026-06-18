import React, { useEffect } from "react";
import LandingPageSimple from "./LandingPageSimple";
import {
  rememberPublicFunnelContext,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";

const FREE_LESSON_VIDEO_ID = "CFkrrVxhdL4";

export default function LandingPage(props) {
  useEffect(() => {
    rememberPublicFunnelContext({
      lastStage: "landing",
      source: "homepage",
      video: FREE_LESSON_VIDEO_ID,
    });
    trackPublicFunnelEvent("landing_view", { video: FREE_LESSON_VIDEO_ID });
  }, []);

  return <LandingPageSimple {...props} />;
}
