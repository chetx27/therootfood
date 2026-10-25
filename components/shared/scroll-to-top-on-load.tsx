"use client";

import { useEffect } from "react";

/**
 * Fresh visits and reloads always start at the top of the page instead of wherever the
 * browser last left off. In-site links to a section (e.g. "/#bulk") still jump there.
 */
export function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isReload = nav?.type === "reload";
    let fromThisSite = false;
    try {
      fromThisSite = !!document.referrer && new URL(document.referrer).origin === location.origin;
    } catch {}

    if (isReload || !fromThisSite) {
      if (location.hash) history.replaceState(null, "", location.pathname + location.search);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  return null;
}
