"use client";
// Shared motion helpers. Everything renders in its final state on the server
// and without JavaScript; motion is an enhancement that only runs when the
// visitor has not asked for reduced motion.
import { useEffect, useRef, useState } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(REDUCED);
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * "below" until the element first scrolls into view, then "in". Elements that
 * are already on screen when the page loads report "in" straight away, so
 * nothing above the fold ever flashes. Returns "static" when motion is off.
 */
export type ViewState = "static" | "below" | "in";

export function useFirstView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const [state, setState] = useState<ViewState>("static");
  useEffect(() => {
    const element = ref.current;
    // Read the query directly: on the first effect `reduced` is not known yet.
    const still = reduced || window.matchMedia(REDUCED).matches;
    if (!element || still || !("IntersectionObserver" in window)) {
      setState("static");
      return;
    }
    const { top } = element.getBoundingClientRect();
    if (top < window.innerHeight * 0.85) {
      setState("in");
      return;
    }
    setState("below");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("in");
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced, threshold]);
  return [ref, state] as const;
}
