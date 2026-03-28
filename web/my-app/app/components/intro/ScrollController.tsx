"use client";

import { useEffect } from "react";

export default function ScrollController({
  setActiveIndex,
}: {
  setActiveIndex: (i: number) => void;
}) {
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      const index = Math.min(
        6,
        Math.max(0, Math.floor(scrollY / height))
      );
      setActiveIndex(index);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [setActiveIndex]);

  return null;
}
