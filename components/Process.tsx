"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Sculpt",
    line: "Forms before details.",
    body: "Every piece starts as a grey blockout. Proportions, silhouette, weight — if it doesn't read as a thumbnail, it doesn't read at all. Details are earned, never glued on.",
    tools: "Blender · ZBrush",
  },
  {
    n: "02",
    title: "Texture",
    line: "Skin, rust, memory.",
    body: "PBR materials built from reference and imagination: worn edges, subsurface flesh, dust that settled over a decade. Surfaces should feel like they have a past.",
    tools: "Substance Painter · Mari",
  },
  {
    n: "03",
    title: "Light",
    line: "Mood is geometry too.",
    body: "Cinematic three-point setups, volumetric haze, rim light that carves the form out of the dark. Lighting does half the storytelling — I treat it like a second sculpt.",
    tools: "Octane · Redshift · Unreal",
  },
  {
    n: "04",
    title: "Render",
    line: "The final proof.",
    body: "Compositing, color, delivery in whatever your pipeline eats — stills, turntables, or real-time assets. What leaves the studio is finished, not 'finished enough'.",
    tools: "After Effects · Nuke",
  },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length)));
  });

  const step = STEPS[active];

  return (
    <section id="process" ref={ref} className="relative border-t border-bone/10">
      <div className="grid md:grid-cols-2">
        {/* sticky visual */}
        <div className="relative hidden md:block">
          <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden px-12 py-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-kiln">
              02 — Process
            </p>

            <div className="relative">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={step.n}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display text-[11rem] leading-none text-bone/10">
                    {step.n}
                  </p>
                  <h3 className="-mt-16 font-display text-7xl uppercase text-bone">
                    {step.title}
                  </h3>
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-kiln">
                    {step.line}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* morphing clay blob */}
              <div
                aria-hidden="true"
                className="mt-10 h-40 w-40 bg-kiln/25 blur-2xl"
                style={{ animation: "blobmorph 9s ease-in-out infinite" }}
              />
              <style>{`@keyframes blobmorph {
                0%, 100% { border-radius: 58% 42% 55% 45% / 55% 48% 52% 45%; transform: rotate(0deg) scale(1); }
                50% { border-radius: 45% 55% 42% 58% / 48% 58% 42% 52%; transform: rotate(24deg) scale(1.12); }
              }`}</style>
            </div>

            <div className="flex gap-2">
              {STEPS.map((s, i) => (
                <span
                  key={s.n}
                  className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                    i <= active ? "bg-kiln" : "bg-bone/15"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* scrolling steps */}
        <div>
          <div className="px-6 pt-24 md:hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-kiln">
              02 — Process
            </p>
          </div>
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex min-h-[85vh] flex-col justify-center border-b border-bone/10 px-6 py-16 md:min-h-screen md:border-b-0 md:px-12"
            >
              <p className="font-display text-7xl text-bone/15 md:hidden">{s.n}</p>
              <h3 className="font-display text-5xl uppercase text-bone md:text-6xl">
                {s.title}
              </h3>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-kiln">
                {s.line}
              </p>
              <p className="mt-6 max-w-md leading-relaxed text-fog">{s.body}</p>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/60">
                {s.tools}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
