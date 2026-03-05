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

    /* ================= GOOGLE TAG MANAGER ================= */
    w.dataLayer = w.dataLayer || [];

    if (!w.__gtm_inited__) {
      w.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });

      const gtmScript = document.createElement("script");
      gtmScript.async = true;
      gtmScript.src =
        "https://www.googletagmanager.com/gtm.js?id=GTM-5RFGJJ2Q";

      document.head.appendChild(gtmScript);

      w.__gtm_inited__ = true;
    }
  }, []);

  return null; // No UI rendered
}