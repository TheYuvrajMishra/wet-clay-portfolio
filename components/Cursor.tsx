"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest?.("[data-cursor]");
      setLabel(t ? t.getAttribute("data-cursor") : null);
    };
    const press = () => setDown(true);
    const release = () => setDown(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", press);
    window.addEventListener("mouseup", release);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* dot — follows instantly */}
      <motion.div
        aria-hidden="true"
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[100]"
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-bone mix-blend-difference transition-all duration-150 ${
            label ? "h-0 w-0 opacity-0" : down ? "h-2 w-2" : "h-2.5 w-2.5"
          }`}
        />
      </motion.div>

      {/* ring — springs behind, expands into a label badge */}
      <motion.div
        aria-hidden="true"
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[100]"
      >
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300 ${
            label
              ? "h-20 w-20 bg-kiln"
              : down
                ? "h-8 w-8 border border-bone/70"
                : "h-10 w-10 border border-bone/40 mix-blend-difference"
          }`}
        >
          {label && (
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
              {label}
            </span>
          )}
        </div>
      </motion.div>
    </>
  );
}
