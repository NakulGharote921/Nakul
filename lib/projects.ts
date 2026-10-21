import {
  CalendarCheck01Icon,
  ChartBarLineIcon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export type Project = {
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
    title:
      "The official website for Resolute AI Software, designed and built end to end.",
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
    title:
      "A modern hospital platform that makes booking and managing appointments simple.",
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
    title:
      "An AI-powered expense tracker for clearer, more confident money decisions.",
    description:
      "Track income and expenses, understand spending, and manage your financial picture from one elegant dashboard.",
    meta: "AI · Finance · Analytics",
    imageRatio: 16 / 10,
    image: "/ai-expense-tracker.png",
    imageAlt: "Wealth Flow AI expense tracker dashboard",
    href: "https://expence-tracker-app-gilt.vercel.app",
  },
];
