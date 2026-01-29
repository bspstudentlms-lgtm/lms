"use client";

import { useEffect } from "react";
import mixpanel from "mixpanel-browser";

export default function AnalyticsInit() {
  useEffect(() => {
    const w = window as any;

    /* ================= MATOMO ================= */
    if (!w._mtm) {
      const _mtm = (w._mtm = []);
      _mtm.push({
        "mtm.startTime": new Date().getTime(),
        event: "mtm.Start",
      });

      const d = document;
      const g = d.createElement("script");
      const s = d.getElementsByTagName("script")[0];
      g.async = true;
      g.src =
        "https://cdn.matomo.cloud/learningco.matomo.cloud/container_aSiSUU5A.js";
      s.parentNode?.insertBefore(g, s);
    }

    /* ================= MIXPANEL ================= */
    if (!w.__mixpanel_inited__) {
      mixpanel.init("97e7cdad1fd84a54a507ff3c1b5b16e3", {
        autocapture: true,
        record_sessions_percent: 100,
        debug: process.env.NODE_ENV !== "production",
      });

      w.__mixpanel_inited__ = true;
    }
  }, []);

  return null; // no UI
}
