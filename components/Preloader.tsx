"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        timer = setTimeout(onDone, 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [onDone]);

  return (
    <motion.div
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[95] flex flex-col justify-between bg-ink px-6 py-8 md:px-12"
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-fog">
        <span>Mara Voss</span>
        <span>Folio 2026</span>
      </div>

      <div className="flex flex-col gap-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fog">
          Warming up the clay
        </p>
        <div className="h-px w-full bg-bone/10">
          <div
            className="h-px bg-kiln transition-[width] duration-100"
            style={{ width: `${n}%` }}
          />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <p className="max-w-[240px] font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-fog">
          Every render
          <br />
          has a skeleton
        </p>
        <span className="font-display text-[18vw] leading-none text-bone md:text-[10rem]">
          {n}
        </span>
      </div>
    </motion.div>
  );
}
