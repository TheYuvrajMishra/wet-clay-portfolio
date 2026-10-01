"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Nav({ ready }: { ready: boolean }) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160);
  });

  return (
    <>
      <motion.header
        initial={{ y: "-110%", opacity: 0 }}
        animate={{
          y: hidden && !open ? "-110%" : "0%",
          opacity: ready ? 1 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[80] px-4 pt-4 md:px-8"
      >
        <nav
          aria-label="Primary"
          className="flex items-center justify-between rounded-full border border-bone/15 bg-ink/70 py-3 pl-6 pr-3 backdrop-blur-xl"
        >
          <a
            href="#top"
            className="font-display text-lg tracking-wide text-bone"
            data-cursor="Top"
          >
            MARA&nbsp;VOSS<sup className="font-mono text-[9px] text-kiln">®</sup>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-fog transition-colors hover:bg-bone/10 hover:text-bone"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              data-cursor="Say hi"
              className="hidden rounded-full bg-bone px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-kiln md:block"
            >
              Book a project
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/20 md:hidden"
            >
              <span className="flex flex-col gap-1.5">
                <span
                  className={`h-px w-5 bg-bone transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
                />
                <span
                  className={`h-px w-5 bg-bone transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[75] flex flex-col justify-center gap-2 bg-ink/95 px-8 backdrop-blur-xl md:hidden"
          >
            {LINKS.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-6xl uppercase text-bone"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setOpen(false)}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-6 w-fit rounded-full bg-kiln px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink"
            >
              Book a project
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
