"use client";

import { useState, useEffect } from "react";

interface ScrollState {
  isScrolled: boolean;
  scrollY: number;
  scrollDirection: "up" | "down" | null;
}

export function useScroll(threshold: number = 20): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isScrolled: false,
    scrollY: 0,
    scrollDirection: null,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > threshold;
      const scrollDirection = currentScrollY > lastScrollY ? "down" : "up";

      setScrollState({
        isScrolled,
        scrollY: currentScrollY,
        scrollDirection: currentScrollY === lastScrollY ? null : scrollDirection,
      });

      lastScrollY = currentScrollY;
    };

    // Set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrollState;
}
