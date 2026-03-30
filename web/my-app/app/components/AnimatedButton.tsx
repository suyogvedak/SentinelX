"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function AnimatedButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    animate(ref.current, {
      scale: [1, 1.1, 1],
      duration: 1200,
      easing: "easeInOutQuad",
      loop: true,
    });
  }, []);

  return (
    <button
      ref={ref}
      className="mt-4 rounded bg-black px-4 py-2 text-white"
    >
      {children}
    </button>
  );
}
