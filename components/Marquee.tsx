"use client";

const ITEMS = [
  "Character Design",
  "Hard-Surface",
  "Environments",
  "Lookdev",
  "Lighting",
  "Rigging",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section aria-label="Services" className="overflow-hidden border-y border-bone/10 py-5">
      <div className="animate-marquee flex w-max items-center">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center" aria-hidden={half === 1}>
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span
                  className={`whitespace-nowrap px-6 font-display text-4xl uppercase tracking-wide md:text-5xl ${
                    i % 2 === 0 ? "text-bone" : "text-stroke"
                  }`}
                >
                  {item}
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-kiln" aria-hidden="true" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
