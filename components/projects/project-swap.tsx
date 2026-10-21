"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore, type ReactNode } from "react";

import CardSwap, { type CardSwapItem } from "@/components/CardSwap";
import { PROJECTS } from "@/components/projects/projects";

const LINKEDIN_URL = "https://www.linkedin.com/in/nakul-gharote/";

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

type ProjectCard = CardSwapItem & { href: string };

const CARDS: ProjectCard[] = [
  ...PROJECTS.map((project) => ({
    title: project.iconLabel,
    url: project.href,
    alt: project.imageAlt,
    href: project.href,
  })),
  {
    alt: "Nakul Gharote on LinkedIn",
    image: "/linkedin-showcase.png",
    href: LINKEDIN_URL,
  },
];

export function ProjectSwap(): ReactNode {
  const mounted = useIsMounted();
  const { resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        <div className="h-[520px] overflow-hidden sm:h-[600px]">
          <CardSwap
            items={CARDS}
            theme={isDark ? "dark" : "light"}
            delay={4000}
            cardDistance={96}
            verticalDistance={26}
            depth={70}
            skewAmount={10}
            visibleCards={4}
            cardRadius={18}
            speed={1}
            bounce={0.35}
            parallax={0.5}
            hoverSpread={0.12}
            dim={0.5}
            autoplay
            pauseOnHover
            draggable
            onCardClick={(index) => {
              const card = CARDS[index];
              if (card) window.open(card.href, "_blank", "noopener,noreferrer");
            }}
          />
        </div>
      </div>
    </section>
  );
}
