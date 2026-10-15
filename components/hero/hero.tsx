import type { ReactNode } from "react";

import { HeroCtas } from "./hero-ctas";
import { FadeIn, ScaleUnblur } from "@/components/ui/motion-primitives";
import BlurText from "@/components/ui/BlurText";
import TextType from "@/components/ui/TextType";
import { PortraitMorph } from "./portrait-morph";

const PORTRAIT_SRC = "/josh.webp";
const PORTRAIT_HOVER_SRC = "/josh_wave.webp";

export function Hero(): ReactNode {
  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 pt-44 pb-24 sm:px-10 sm:pt-56 sm:pb-32">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-8">
          <FadeIn className="flex flex-col gap-4">
            <BlurText
              text="Hey 👋, I’m Nakul"
              animateBy="words"
              direction="top"
              delay={120}
              className="text-[20px] leading-tight tracking-tight font-medium text-foreground"
            />

            <h1 className="text-[2.75rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[2.5rem] lg:text-[3.65rem]">
              <TextType
                text={["Full Stack Developer", "React & JavaScript"]}
                typingSpeed={75}
                pauseDuration={1500}
                deletingSpeed={50}
                loop
                showCursor
                cursorCharacter="_"
                cursorBlinkDuration={0.5}
              />
            </h1>

            <p className="max-w-[34ch] text-[22px] leading-[1.4] tracking-tight text-foreground/65">
              I build responsive, interactive web applications with clean,
              maintainable code and thoughtful user experiences.
            </p>

            <HeroCtas />
          </FadeIn>

          <ScaleUnblur className="flex justify-stretch md:justify-end">
            <div className="relative aspect-square w-full md:max-w-105 overflow-hidden rounded-4xl border border-foreground/8 bg-background p-1.5 shadow-sm">
              <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
                <PortraitMorph
                  srcA={PORTRAIT_SRC}
                  srcB={PORTRAIT_HOVER_SRC}
                  alt="Nakul Gharote portrait"
                />
              </div>
            </div>
          </ScaleUnblur>
        </div>
      </div>
    </section>
  );
}
