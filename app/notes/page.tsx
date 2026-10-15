import { ContactCard } from '@/components/contact/contact-card'
import { FadeIn } from '@/components/ui/motion-primitives'
import { resume } from '@/lib/resume'
import { createMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = createMetadata({
  title: 'My Notes',
  description: 'Notes, learnings, and ideas.',
  path: '/notes',
})

export default function NotesPage(): ReactNode {
  return (
    <main id='main-content' className='flex flex-1 flex-col'>
      <section className='mx-auto w-full max-w-160 px-6 pt-44 pb-16 sm:px-10 sm:pt-56 sm:pb-24'>
        <FadeIn>
          <div className='rounded-4xl border border-foreground/5 bg-foreground/1.5 p-8 sm:p-12 dark:bg-foreground/3'>
            <h1 className='font-serif text-[2.25rem] font-medium tracking-tight text-foreground sm:text-[2.75rem]'>
              My Notes
            </h1>
            <div className='mt-8 space-y-4 text-[16px] leading-[1.7] tracking-tight text-foreground/75 sm:text-[17px]'>
              <p>
                Full Stack Developer focused on building clean, responsive web apps with React, Tailwind CSS, and modern tooling. Interested in performance, accessibility, and smooth UX.
              </p>
              <p>Currently exploring: {resume.technicalSkills.learning.join(', ')}.</p>
              <p>AI tools I use: {resume.technicalSkills.aiTools.join(', ')}.</p>
            </div>
          </div>
        </FadeIn>
      </section>
      <ContactCard />
      <div className='h-12 sm:h-16' />
    </main>
  )
}
