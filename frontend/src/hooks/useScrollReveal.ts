import { useEffect } from "react";

/**
 * Custom hook to activate smooth scroll animations
 * Observes all elements with .reveal-left, .reveal-right, .reveal-up
 * and adds the .revealed class when they scroll into the viewport.
 */
export function useScrollReveal() {
  useEffect(() => {
    const selector = ".reveal-left, .reveal-right, .reveal-up";

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(selector).forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          } else {
            // Remove revealed class when scrolled out of view to re-animate on every scroll
            entry.target.classList.remove("revealed");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08,
      }
    );

    const observedSet = new WeakSet<Element>();
    const observeElements = () => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!observedSet.has(el)) {
          observer.observe(el);
          observedSet.add(el);
        }
      });
    };

    observeElements();

    // Re-scan when new elements are rendered
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
