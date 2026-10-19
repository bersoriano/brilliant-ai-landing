"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { articleProgress, linkProperties, sectionIsVisible, trafficProperties } from "@/lib/analytics";
import { analyticsEnabled, captureAnalytics } from "@/lib/analytics.client";

/** One tracker keeps both server-rendered MDX and client sections measurable. */
export function PageAnalytics() {
  const pathname = usePathname();
  const visit = useRef({ path: "", sections: new Set<string>(), milestones: new Set<number>() });

  useEffect(() => {
    if (!analyticsEnabled()) return;
    if (visit.current.path !== pathname) {
      visit.current = { path: pathname, sections: new Set(), milestones: new Set() };
      captureAnalytics("$pageview", trafficProperties(window.location.href, document.referrer));
    }
    const state = visit.current;
    let frame = 0;
    // Query on each check: streamed content and locale replacements can arrive
    // after this effect without a new route or a full document navigation.
    function measure() {
      frame = 0;
      if (document.visibilityState === "hidden") return;
      const sections = document.querySelectorAll<HTMLElement>(
        "main section[id], main article[id], [data-analytics-section], [data-analytics-article] h2",
      );
      sections.forEach((section, index) => {
        const id = section.dataset.analyticsSection || section.id || `blog-heading-${index + 1}`;
        if (state.sections.has(id)) return;
        const rect = section.getBoundingClientRect();
        if (sectionIsVisible(rect.top, rect.height, window.innerHeight)) {
          state.sections.add(id);
          captureAnalytics("section_viewed", { section_id: id });
        }
      });
      const article = document.querySelector("[data-analytics-article]");
      if (article) {
        const rect = article.getBoundingClientRect();
        const progress = articleProgress(rect.top, rect.height, window.innerHeight);
        for (const percent of [25, 50, 75, 100]) {
          if (progress >= percent && !state.milestones.has(percent)) {
            state.milestones.add(percent);
            captureAnalytics("blog_read_progress", { percent });
          }
        }
      }
    }
    function schedule() { if (!frame) frame = window.requestAnimationFrame(measure); }
    function click(event: MouseEvent) {
      if (event.type === "auxclick" && event.button !== 1) return;
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!target) return;
      const action = linkProperties(target.href, window.location.href);
      if (!action) return;
      const source = target.closest<HTMLElement>(
        "[data-analytics-location], [data-analytics-article], [data-analytics-section], article[id], section[id], header, footer, nav",
      );
      const section = source?.dataset.analyticsLocation || source?.dataset.analyticsSection || source?.id ||
        (source?.hasAttribute("data-analytics-article") ? "blog_body" : source?.tagName.toLowerCase()) || "page";
      captureAnalytics(action.event, { ...action.properties, source_section: section });
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    document.addEventListener("click", click, true);
    document.addEventListener("auxclick", click, true);
    const observer = new MutationObserver(schedule);
    const main = document.querySelector("main");
    if (main) observer.observe(main, { childList: true, subtree: true });
    schedule();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      document.removeEventListener("click", click, true);
      document.removeEventListener("auxclick", click, true);
    };
  }, [pathname]);
  return null;
}
