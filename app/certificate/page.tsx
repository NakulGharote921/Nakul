import Masonry, { type Item } from '@/components/Masonry'
import { ContactCard } from '@/components/contact/contact-card'
import { FadeIn } from '@/components/ui/motion-primitives'
import { createMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = createMetadata({
  title: 'Certificate',
  description: 'Certificates and achievements.',
  path: '/certificate',
})

const certificateItems: Item[] = [
  {
    id: 'introduction-to-python',
    img: '/certificates/introduction-to-python.png',
    url: '/certificates/introduction-to-python.pdf',
    height: 396,
  },
  {
    id: 'nodejs',
    img: '/certificates/nodejs.png',
    url: '/certificates/nodejs.pdf',
    height: 396,
  },
  {
    id: 'javascript-concepts',
    img: '/certificates/javascript-concepts.png',
    url: '/certificates/javascript-concepts.pdf',
    height: 396,
  },
  {
    id: 'cce-certificate',
    img: '/certificates/cce-certificate.jpg',
    url: '/certificates/cce-certificate.jpg',
    height: 396,
  },
  {
    id: 'web-development-essentials',
    img: '/certificates/web-development-essentials.jpg',
    url: '/certificates/web-development-essentials.jpg',
    height: 433,
  },
  {
    id: 'java-essentials',
    img: '/certificates/java-essentials.jpg',
    url: '/certificates/java-essentials.jpg',
    height: 433,
  },
  {
    id: 'react-essentials',
    img: '/certificates/react-essentials.jpg',
    url: '/certificates/react-essentials.jpg',
    height: 433,
  },
  {
    id: 'sql-deep-dive',
    img: '/certificates/sql-deep-dive.jpg',
    url: '/certificates/sql-deep-dive.jpg',
    height: 433,
  },
  {
    id: 'mastering-spring-boot',
    img: '/certificates/mastering-spring-boot.jpg',
    url: '/certificates/mastering-spring-boot.jpg',
    height: 433,
  },
  {
    id: 'java-essentials-2',
    img: '/certificates/java-essentials-2.jpg',
    url: '/certificates/java-essentials-2.jpg',
    height: 433,
  },
  {
    id: 'unstop-quizverse-2026',
    img: '/certificates/unstop-quizverse-2026.png',
    url: '/certificates/unstop-quizverse-2026.pdf',
    height: 254,
  },
  {
    id: 'full-stack-development',
    img: '/certificates/full-stack-development.png',
    url: '/certificates/full-stack-development.pdf',
    height: 440,
  },
  {
    id: 'web-development-html',
    img: '/certificates/web-development-html.png',
    url: '/certificates/web-development-html.pdf',
    height: 800,
  },
  {
    id: 'java-fundamentals',
    img: '/certificates/java-fundamentals.png',
    url: '/certificates/java-fundamentals.pdf',
    height: 800,
  },
  {
    id: 'containerizing-spring-boot',
    img: '/certificates/containerizing-spring-boot.png',
    url: '/certificates/containerizing-spring-boot.pdf',
    height: 800,
  },
  {
    id: 'refactoring-microservices-ai',
    img: '/certificates/refactoring-microservices-ai.png',
    url: '/certificates/refactoring-microservices-ai.pdf',
    height: 800,
  },
  {
    id: 'sql-relational-databases',
    img: '/certificates/sql-relational-databases.png',
    url: '/certificates/sql-relational-databases.pdf',
    height: 800,
  },
]

export default function CertificatePage(): ReactNode {
  return (
    <main id='main-content' className='flex flex-1 flex-col'>
      <section className='mx-auto w-full max-w-160 px-6 pt-44 pb-10 sm:px-10 sm:pt-56'>
        <FadeIn>
          <h1 className='font-serif text-[2.25rem] font-medium tracking-tight text-foreground sm:text-[2.75rem]'>
            Certificates & Professional Development
          </h1>
        </FadeIn>
      </section>
      <section className='mx-auto w-full max-w-312 px-6 pb-16 sm:px-10 sm:pb-24'>
        <FadeIn delay={0.1}>
          <Masonry items={certificateItems} />
        </FadeIn>
      </section>
      <ContactCard />
      <div className='h-12 sm:h-16' />
    </main>
  )
}
