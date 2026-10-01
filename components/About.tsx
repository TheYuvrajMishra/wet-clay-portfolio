"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Reveal } from "./Reveal";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
    });
    return unsub;
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 9, suffix: "", label: "Years sculpting" },
  { value: 140, suffix: "+", label: "Projects shipped" },
  { value: 12, suffix: "", label: "Industry awards" },
  { value: 18, suffix: "", label: "Countries served" },
];

const CLIENTS = ["Studio North", "Polyform", "Kilnworks", "Framehaus", "Hexlab", "Mono & Co"];

export function About() {
  return (
    <section id="about" className="border-t border-bone/10 px-6 py-28 md:px-12 md:py-40">
      <Reveal>
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-kiln">
          03 — The hands
        </p>
        <h2 className="max-w-5xl font-display text-[11vw] uppercase leading-[0.95] md:text-[5.5vw]">
          I&apos;m Mara. I make things that were{" "}
          <span className="text-stroke">never real</span>, then make you{" "}
          <span className="text-kiln">believe</span> they were.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-2">
        <Reveal delay={0.1}>
          <p className="max-w-lg leading-relaxed text-fog">
            Nine years freelancing for game studios, brands and directors who
            needed the impossible on a deadline. I work remote, worldwide —
            async-friendly, obsessive about silhouette, allergic to generic.
          </p>
          <p className="mt-5 max-w-lg leading-relaxed text-fog">
            My studio is a dark room, a strong machine, and a lump of digital
            clay that never dries out. You already met the clay — it&apos;s
            waiting at the top of this page.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fog">
            Previously trusted by
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {CLIENTS.map((c) => (
              <li
                key={c}
                className="font-display text-2xl uppercase text-bone/70 transition-colors hover:text-kiln"
              >
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-px bg-bone/10 md:mt-28 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-ink px-6 py-10 md:py-14">
            <p className="font-display text-6xl text-bone md:text-7xl">
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-fog">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
