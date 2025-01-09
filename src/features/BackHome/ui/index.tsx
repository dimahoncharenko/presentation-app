'use client'

import { Button } from '@/shared/ui/bricks/common/Button'

import { SlideLink } from '@/entities/SlideElement/ui/slide-link'

export const BackHome = () => {
  return (
    <Button asChild variant='link'>
      <SlideLink
        href='#/0'
        className='fixed bottom-[0] left-[0] z-10 -translate-y-16 text-lg'
      >
        Back Home
      </SlideLink>
    </Button>
  )
}
