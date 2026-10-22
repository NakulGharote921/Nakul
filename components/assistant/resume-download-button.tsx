import { Download } from "lucide-react";
import type { ReactNode } from "react";

import { resumeDownloadPath } from "@/lib/resume";

/** A direct, accessible resume action for recruiters and hiring teams. */
export function ResumeDownloadButton(): ReactNode {
  return (
    <a
      href={resumeDownloadPath}
      download="Nakul_Gharote_Resume.pdf"
      className="focus-ring-cyan inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[12px] font-medium tracking-tight text-cyan-700 transition-colors hover:border-cyan-500/50 hover:bg-cyan-500/15 dark:text-cyan-200"
    >
      <Download className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
      Download Nakul&apos;s resume
    </a>
  );
}
