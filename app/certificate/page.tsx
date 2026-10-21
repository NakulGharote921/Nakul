import Masonry from "@/components/Masonry";
import { ContactCard } from "@/components/contact/contact-card";
import { FadeIn } from "@/components/ui/motion-primitives";
import { CERTIFICATES } from "@/lib/certificates";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Certificate",
  description: "Certificates and achievements.",
  path: "/certificate",
});

export default function CertificatePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-160 px-6 pt-44 pb-10 sm:px-10 sm:pt-56">
        <FadeIn>
          <h1 className="font-serif text-[2.25rem] font-medium tracking-tight text-foreground sm:text-[2.75rem]">
            Certificates &amp; Professional Development
          </h1>
        </FadeIn>
      </section>
      <section className="mx-auto w-full max-w-312 px-6 pb-16 sm:px-10 sm:pb-24">
        <FadeIn delay={0.1}>
          <Masonry items={CERTIFICATES} />
        </FadeIn>
      </section>
      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
