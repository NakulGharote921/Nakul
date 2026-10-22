"use client";

import { ReducedMotionProvider } from "@/lib/motion";
import { ThemeProvider } from "@/lib/theme";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <ThemeProvider>
      <ReducedMotionProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}
