"use client";

import type { ReactNode } from "react";

import Strands from "@/components/Strands";
import { assistantOrbColors } from "@/lib/assistant";
import { useReducedMotion } from "@/lib/motion";

type AiOrbProps = {
  /** Drives the brightness of the flowing strands. */
  energy?: number;
  /** Adds a speech-reactive pulse while the assistant is answering. */
  listening?: boolean;
  className?: string;
};

/**
 * The AI orb: a dark glass sphere with flowing multicolor light waves,
 * rendered by the React Bits `Strands` WebGL shader.
 *
 * The orb is not an image, so it has no baked-in background to strip: the
 * sphere itself is drawn by the shader into a transparent WebGL canvas that
 * is clipped to a circle, and the CSS layers underneath it are all round.
 * Anything painted outside the circle (the soft halo) is produced with
 * `box-shadow` on the rounded body, because a blurred layer would spread
 * past the border radius and read as a square patch on a light page.
 *
 * The sphere stays glossy black in both themes, so the orb looks identical
 * on the white page and on the charcoal one. The theme only changes the
 * rim and the halo, and it is driven by the `dark` class that `next-themes`
 * puts on `<html>`, so switching themes repaints the orb without a
 * re-render.
 */
export function AiOrb({
  energy = 0.62,
  listening = false,
  className = "",
}: AiOrbProps): ReactNode {
  const reducedMotion = useReducedMotion();

  return (
    <div className={`relative ${className}`.trim()}>
      {/* Glossy black glass body behind the shader, with a reflective rim. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.16),rgba(20,20,24,0.97)_42%,rgba(4,4,6,0.99)_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_0_0_2.5px_rgba(15,23,42,0.07),0_12px_28px_-16px_rgba(15,23,42,0.45)] transition-shadow duration-300 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_0_0_1px_rgba(34,211,238,0.22),0_0_16px_rgba(34,211,238,0.26),0_0_36px_rgba(59,130,246,0.16)]"
      />

      {/* The shader draws the sphere itself, so it is clipped to the circle. */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <Strands
          colors={assistantOrbColors}
          count={3}
          speed={reducedMotion ? 0 : 0.85}
          amplitude={1}
          waviness={1}
          thickness={1}
          spread={1}
          glow={1}
          taper={1}
          intensity={1}
          saturation={1}
          hueShift={0}
          scale={1}
          glass
          glassSize={1}
          refraction={1}
          rim={1}
          dispersion={1}
          energy={energy}
          listening={listening}
          interactive
          clickPulse
          intro
          lightMode={false}
          maxDevicePixelRatio={1.75}
        />
      </div>
    </div>
  );
}
