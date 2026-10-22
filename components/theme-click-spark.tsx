"use client";

import ClickSpark from "@/components/ClickSpark";
import { useTheme } from "@/lib/theme";
import { useSyncExternalStore, type ReactNode } from "react";

const LIGHT_SPARK_COLORS = ["#000000", "#d4af37"];
const DARK_SPARK_COLORS = ["#ffffff", "#fef9c3", "#fde68a", "#e0f2fe"];

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeClickSpark({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const mounted = useIsMounted();
  const { resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <ClickSpark
      sparkColor={isDark ? DARK_SPARK_COLORS : LIGHT_SPARK_COLORS}
      shape="star"
      sparkCount={5}
      sparkSize={13}
      sparkRadius={26}
      sparkWidth={2}
      duration={600}
      easing="ease-out"
      spread={360}
      gravity={0}
      randomness={0.45}
      glow={0.6}
    >
      {children}
    </ClickSpark>
  );
}
