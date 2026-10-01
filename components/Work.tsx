"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";

type Project = {
  src: string;
  index: string;
  title: string;
  category: string;
  year: string;
  meta: string;
  span: string;
};

const PROJECTS: Project[] = [
  {
    src: "/work-1.jpg",
    index: "01",
    title: "Iron Saint",
    category: "Character — Mech Bust",
    year: "2026",
    meta: "84K tris · Blender · Octane",
    span: "md:col-span-7",
  },
  {
    src: "/work-2.jpg",
    index: "02",
    title: "Bloom // Decay",
    category: "Creature — Botanical Alien",
    year: "2025",
    meta: "61K tris · ZBrush · Redshift",
    span: "md:col-span-4 md:col-start-9 md:mt-32",
  },
  {
    src: "/work-3.jpg",
    index: "03",
    title: "Citadel Drift",
    category: "Environment — Floating City",
    year: "2025",
    meta: "210K tris · Blender · Unreal",
    span: "md:col-span-5 md:col-start-2 md:-mt-16",
  },
  {
    src: "/work-4.jpg",
    index: "04",
    title: "Rust Runner",
    category: "Character — Stylized Fox",
    year: "2024",
    meta: "38K tris · Blender · Cycles",
    span: "md:col-span-6 md:col-start-7 md:mt-24",
  },
];

function WorkCard({ p }: { p: Project }) {
  return (
    <Reveal className={p.span}>
      <article className="group" data-cursor="View">
        <div className="relative overflow-hidden border border-bone/10 bg-coal">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={p.src}
              alt={`${p.title} — ${p.category} 3D render`}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          </div>

          {/* x-ray: the skeleton beneath the render */}
          <div className="wireframe-grid pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 bg-ink/35 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* corner ticks */}
          {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map(
            (pos) => (
              <span
                key={pos}
                aria-hidden="true"
                className={`absolute h-5 w-5 border-kiln opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${pos}`}
              />
            )
          )}

          <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between px-4 py-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-kiln">
              {p.meta}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/80">
              Wireframe
            </span>
          </div>
        </div>

        <div className="flex items-baseline justify-between pt-4">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-xs text-kiln">{p.index}</span>
            <h3 className="font-display text-3xl uppercase tracking-wide text-bone transition-colors group-hover:text-kiln md:text-4xl">
              {p.title}
            </h3>
          </div>
          <p className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-fog">
            {p.category}
            <br />
            {p.year}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

export function Work() {
  return (
    <section id="work" className="px-6 py-28 md:px-12 md:py-40">
      <Reveal>
        <div className="mb-16 flex flex-col justify-between gap-6 md:mb-24 md:flex-row md:items-end">
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-kiln">
              01 — Selected work
            </p>
            <h2 className="font-display text-[13vw] uppercase leading-[0.9] md:text-[7.5vw]">
              Work that
              <br />
              <span className="text-stroke">ships.</span>
            </h2>
          </div>
          <p className="max-w-xs font-mono text-[11px] uppercase leading-loose tracking-[0.2em] text-fog">
            Hover to x-ray.
            <br />
            Every render has a skeleton.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-12">
        {PROJECTS.map((p) => (
          <WorkCard key={p.index} p={p} />
        ))}
      </div>
    </section>
  );
}
