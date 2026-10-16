import { ArrowRight, ExternalLink } from "lucide-react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { CalendarCheck01Icon, ChartBarLineIcon, Globe02Icon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/ui/motion-primitives";

type Project = {
  id: string;
  icon: IconSvgElement;
  iconLabel: string;
  title: string;
  description: string;
  meta: string;
  imageRatio: number;
  image: string;
  imageAlt: string;
  href: string;
};

export const PROJECTS: Project[] = [
  {
    id: "resoluteai-software",
    icon: Globe02Icon,
    iconLabel: "Resolute AI Software",
    title: "The official website for Resolute AI Software, designed and built end to end.",
    description:
      "A fast, responsive company site presenting Resolute AI Software's services and products with a clean, modern layout.",
    meta: "Company · Website · Web",
    imageRatio: 1897 / 867,
    image: "/resoluteai-software-project.png",
    imageAlt: "Resolute AI Software website homepage",
    href: "https://resoluteaisoftware.in",
  },
  {
    id: "doctor-appointment",
    icon: CalendarCheck01Icon,
    iconLabel: "Techinfo YT Care",
    title: "A modern hospital platform that makes booking and managing appointments simple.",
    description:
      "Patients can discover specialists, book appointments, and access a clear healthcare dashboard in one place.",
    meta: "Hospital · Appointments · Healthcare",
    imageRatio: 16 / 10,
    image: "/doctor-appointment-system.png",
    imageAlt: "Techinfo YT Care doctor appointment system",
    href: "https://hospital-base-project-wrtl.vercel.app/",
  },
  {
    id: "expense-tracker",
    icon: ChartBarLineIcon,
    iconLabel: "Wealth_Flow",
    title: "An AI-powered expense tracker for clearer, more confident money decisions.",
    description:
      "Track income and expenses, understand spending, and manage your financial picture from one elegant dashboard.",
    meta: "AI · Finance · Analytics",
    imageRatio: 16 / 10,
    image: "/ai-expense-tracker.png",
    imageAlt: "Wealth Flow AI expense tracker dashboard",
    href: "https://expence-tracker-app-gilt.vercel.app",
  },
];

export type ProjectsProps = {
  withHeadline?: boolean;
  viewMoreVisible?: boolean;
};

export function Projects({
  withHeadline = false,
  viewMoreVisible = false,
}: ProjectsProps): ReactNode {
  const items = viewMoreVisible ? PROJECTS.slice(0, 4) : PROJECTS;

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline ? (
          <FadeIn className="flex flex-col items-center gap-5 pt-12 pb-10 text-center sm:pt-20 sm:pb-14">
            <h2 className="font-serif text-[2.5rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[3rem] lg:text-[3.5rem]">
              My projects
            </h2>
            <p className="max-w-[33ch] text-[18px] leading-[1.45] tracking-tight text-foreground/65 sm:text-[20px]">
              A selection of full stack web applications built with modern
              JavaScript technologies.
            </p>
          </FadeIn>
        ) : null}

        <div className="columns-1 gap-6 md:columns-2 md:gap-7">
          {items.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {viewMoreVisible ? (
          <div className="mt-12 flex justify-center sm:mt-16">
            <Link
              href="/projects"
              className="border border-foreground/8 focus-ring group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
            >
              View all projects
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}): ReactNode {
  return (
    <FadeIn
      delay={Math.min(index * 0.06, 0.3)}
      className="mb-6 break-inside-avoid md:mb-7"
    >
      <article className="project-card flex flex-col gap-4 rounded-3xl border border-foreground/8 bg-background p-3 sm:p-3.5">
        <header className="flex items-center gap-2.5 px-1 pt-2">
          <span className="border-foreground/10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background">
            <HugeiconsIcon
              icon={project.icon}
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>
          <span className="text-sm font-medium tracking-tight text-foreground">
            {project.iconLabel}
          </span>
        </header>

        <div
          className="project-card__image ring-foreground/5 relative w-full overflow-hidden rounded-2xl bg-foreground/5 ring-1"
          style={{ aspectRatio: project.imageRatio }}
        >
          <div className="project-card__image-inner">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(min-width: 1024px) 540px, (min-width: 768px) 45vw, 100vw"
              className="object-cover"
              priority={index < 2}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 px-1 pb-1">
          <h3 className="text-[20px] font-medium leading-[1.2] tracking-tight text-foreground sm:text-[22px]">
            {project.title}
          </h3>
          <p className="text-[14px] leading-normal tracking-tight text-foreground/65 sm:text-[15px]">
            {project.description}
          </p>
        </div>

        <p className="px-1 pb-2 text-[12px] tracking-tight text-foreground/50">
          {project.meta}
        </p>
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className="focus-ring group inline-flex w-fit items-center gap-1.5 self-start rounded-lg px-1 pb-1 text-sm font-medium text-foreground transition-colors hover:text-foreground/65"
          aria-label={`Visit ${project.iconLabel}`}
        >
          View live project
          <ExternalLink
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      </article>
    </FadeIn>
  );
}
