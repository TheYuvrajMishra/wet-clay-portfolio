"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Work } from "@/components/Work";
import { Process } from "@/components/Process";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";

export default function Page() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      </AnimatePresence>
      <Nav ready={loaded} />
      <main>
        <Hero ready={loaded} />
        <Marquee />
        <Work />
        <Process />
        <About />
        <Footer />
      </main>
    </>
  );
}
