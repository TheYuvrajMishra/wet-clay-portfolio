"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

const ClayCanvas = dynamic(
  () => import("./ClayCanvas").then((m) => m.ClayCanvas),
  { ssr: false }
);

const EASE = [0.22, 1, 0.36, 1] as const;

function Magnetic({
  children,
  href,
  className,
  cursor,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  cursor?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });

  return (
    <motion.a
      ref={ref}
      href={href}
      data-cursor={cursor}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

function HeadlineLine({
  children,
  ready,
  delay,
  className,
}: {
  children: React.ReactNode;
  ready: boolean;
  delay: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <motion.span
        initial={{ y: "112%" }}
        animate={ready ? { y: "0%" } : {}}
        transition={{ duration: 1.1, delay, ease: EASE }}
        className={`block font-display uppercase leading-[0.92] tracking-wide ${className ?? ""}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      {/* kiln glow behind the clay */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-kiln/15 blur-[120px]"
      />

      {/* the clay — decorative; the headline carries the message for assistive tech */}
      <div className="absolute inset-0" data-cursor="Drag" aria-hidden="true">
        {ready && <ClayCanvas />}
      </div>

      {/* legibility scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-ink via-ink/55 to-transparent"
      />

      {/* overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-6 pb-10 pt-24 md:px-12 md:pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-fog"
        >
          <span>Folio — 2026</span>
          <span className="hidden sm:block">Freelance 3D artist</span>
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-kiln opacity-70" />
              <span className="h-2 w-2 rounded-full bg-kiln" />
            </span>
            Open for work
          </span>
        </motion.div>

        <div className="flex flex-col gap-8">
          <h1 className="text-[17vw] md:text-[11.5vw]">
            <HeadlineLine ready={ready} delay={0.15}>
              I sculpt
            </HeadlineLine>
            <HeadlineLine ready={ready} delay={0.27} className="text-kiln">
              impossible
            </HeadlineLine>
            <HeadlineLine ready={ready} delay={0.39}>
              objects<span className="text-kiln">.</span>
            </HeadlineLine>
          </h1>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
              className="max-w-md text-[15px] leading-relaxed text-fog"
            >
              Characters, hard-surface and environments — from a grey blockout
              to a final render you can almost touch. Go on,{" "}
              <span className="text-bone">press the clay</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
              className="pointer-events-auto flex items-center gap-3"
            >
              <Magnetic
                href="#work"
                cursor="See"
                className="rounded-full bg-bone px-7 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-kiln"
              >
                See the work
              </Magnetic>
              <Magnetic
                href="#contact"
                cursor="Say hi"
                className="rounded-full border border-bone/25 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-bone transition-colors hover:border-kiln hover:text-kiln"
              >
                Book me
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </div>

      {/* interaction hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.4 }}
        className="pointer-events-none absolute left-1/2 top-24 hidden -translate-x-1/2 md:block"
      >
        <p className="flex items-center gap-3 rounded-full border border-bone/15 bg-ink/60 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-fog backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-kiln" />
          Move to dent — drag to spin
        </p>
      </motion.div>
    </section>
  );
}
