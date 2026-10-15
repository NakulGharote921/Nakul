import { ContactCard } from '@/components/contact/contact-card'
import { FadeIn } from '@/components/ui/motion-primitives'
import { resume } from '@/lib/resume'
import { createMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = createMetadata({
  title: 'My RoadMap',
  description: 'Learning roadmap and upcoming goals.',
  path: '/roadmap',
})

export default function RoadmapPage(): ReactNode {
  return (
    <main id='main-content' className='flex flex-1 flex-col'>
      <section className='mx-auto w-full max-w-160 px-6 pt-44 pb-16 sm:px-10 sm:pt-56 sm:pb-24'>
        <FadeIn>
          <div className='rounded-4xl border border-foreground/5 bg-foreground/1.5 p-8 sm:p-12 dark:bg-foreground/3'>
            <h1 className='font-serif text-[2.25rem] font-medium tracking-tight text-foreground sm:text-[2.75rem]'>
              My RoadMap
            </h1>
            <div className='mt-8 space-y-3'>
              {resume.technicalSkills.learning.map((item, i) => (
                <div key={i} className='flex items-start gap-3 rounded-2xl border border-foreground/10 bg-background/60 p-4'>
                  <span className='mt-1 h-2 w-2 shrink-0 rounded-full bg-foreground/60' aria-hidden='true' />
                  <p className='text-[16px] leading-[1.6] tracking-tight text-foreground/85 sm:text-[17px]'>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>
      <ContactCard />
      <div className='h-12 sm:h-16' />
    </main>
  )
}
