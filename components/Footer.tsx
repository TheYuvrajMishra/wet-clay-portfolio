"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "ArtStation", href: "https://artstation.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X", href: "https://x.com" },
];

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-bone/10">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-[60vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/3 rounded-full bg-kiln/10 blur-[130px]"
      />

      <div className="relative px-6 pb-10 pt-28 md:px-12 md:pt-40">
        <Reveal className="text-center">
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-kiln">
            04 — Contact
          </p>
          <h2 className="font-display text-[15vw] uppercase leading-[0.9] md:text-[10vw]">
            Let&apos;s make
            <br />
            <span className="text-stroke">something</span>
            <br />
            unreal<span className="text-kiln">.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15} className="mt-14 flex justify-center">
          <motion.a
            href="mailto:hello@maravoss.studio"
            data-cursor="Say hi"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-kiln px-10 py-5 font-mono text-sm font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-bone"
          >
            hello@maravoss.studio
          </motion.a>
        </Reveal>

        <Reveal delay={0.25}>
          <ul className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group font-mono text-[11px] uppercase tracking-[0.25em] text-fog transition-colors hover:text-bone"
                >
                  {s.label}
                  <span className="ml-1 inline-block text-kiln transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-bone/10 pt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-fog md:flex-row">
          <span>© 2026 Mara Voss</span>
          <span>Sculpted with intent — no templates harmed</span>
          <a href="#top" data-cursor="Top" className="transition-colors hover:text-kiln">
            Back to the clay ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
