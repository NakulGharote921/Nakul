import { Education } from "@/components/about/education";
import { Experience } from "@/components/about/experience";
import { PolaroidStrip } from "@/components/about/polaroid-strip";
import { Skills } from "@/components/about/skills";
import { Stack } from "@/components/about/stack";
import { ContactCard } from "@/components/contact/contact-card";
import ScrambledText from "@/components/ScrambledText";
import { FadeIn } from "@/components/ui/motion-primitives";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "About",
  description: "About me, background, and how to get in touch.",
  path: "/about",
});

export default function AboutPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-312 pt-40 sm:pt-56">
        <PolaroidStrip />
      </section>

      <section className="mx-auto w-full max-w-160 px-6 pt-20 pb-16 sm:px-10 sm:pt-28 sm:pb-24">
        <FadeIn delay={0.5}>
          <div className="rounded-4xl border border-foreground/5 bg-foreground/1.5 p-8 sm:p-12 dark:bg-foreground/3">
            <h1 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground sm:text-[2rem]">
              Hello! I&rsquo;m <span className="border-b border-foreground/30 pb-0.5">Nakul Gharote</span>.
            </h1>
            <div className="mt-8 flex flex-col gap-6 text-[17px] leading-[1.7] tracking-tight text-foreground/75 sm:text-[18px]">
              <ScrambledText
                className="!m-0 !max-w-none !font-sans !text-[17px] !leading-[1.7] !tracking-tight sm:!text-[18px]"
                effect="blur"
                radius={100}
                strength={1}
                trail={0.6}
                duration={1.2}
                speed={0.5}
                scrambleChars=".:"
                clickBurst
                intro
              >
                A full stack developer with experience building interactive web applications using React, JavaScript, and CSS. I enjoy turning ideas into responsive, useful products with clean and maintainable code.
              </ScrambledText>
              <ScrambledText
                className="!m-0 !max-w-none !font-sans !text-[17px] !leading-[1.7] !tracking-tight sm:!text-[18px]"
                effect="blur"
                radius={100}
                strength={1}
                trail={0.6}
                duration={1.2}
                speed={0.5}
                scrambleChars=".:"
                clickBurst
                intro
              >
                My work is grounded in DOM manipulation, event-driven programming, and responsive web design. I use Git and GitHub to collaborate effectively and continuously sharpen my problem-solving skills through hands-on projects.
              </ScrambledText>
              <ScrambledText
                className="!m-0 !max-w-none !font-sans !text-[17px] !leading-[1.7] !tracking-tight sm:!text-[18px]"
                effect="blur"
                radius={100}
                strength={1}
                trail={0.6}
                duration={1.2}
                speed={0.5}
                scrambleChars=".:"
                clickBurst
                intro
              >
                I&rsquo;m currently a Full Stack Developer at Codekafters and am expanding my backend expertise in Node.js, Spring Boot, and MongoDB while pursuing opportunities to build impactful web products.
              </ScrambledText>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto w-full max-w-[40rem] px-6 pb-20 sm:px-10 sm:pb-28">
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-10">
            <Experience />
            <Education />
            <Skills />
            <Stack />
          </div>
        </FadeIn>
      </section>

      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
