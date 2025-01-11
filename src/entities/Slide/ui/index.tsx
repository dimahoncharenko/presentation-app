'use client'

import React, { CSSProperties, ReactElement } from 'react'

import { BackHome } from '@/features/BackHome'

type Props = Partial<{
  bg: CSSProperties['color']
  videoBg: string
  enableBackHome: boolean
  state: string
  animateOnTheNextSlide: CSSProperties
  fragments: React.ReactElement[]
  iframeBg: string
}> & {
  children: ReactElement<React.HTMLAttributes<HTMLElement>>
} & Partial<
    Omit<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
      'children'
    >
  >

export const Slide: React.FC<Props> = ({
  bg,
  state,
  children,
  videoBg,
  animateOnTheNextSlide,
  iframeBg,
  fragments,
  enableBackHome = false,
  ...rest
}) => {
  const activeBgs = [videoBg, bg, iframeBg].filter(bg => !!bg)

  if (activeBgs.length > 1) {
    throw new Error("Multiple backgrounds aren't supported!")
  }

  return (
    <>
      <section
        data-background-iframe={iframeBg}
        data-background-video={videoBg}
        data-background-video-muted
        data-background-color={bg}
        data-state={state}
        data-auto-animate={!!animateOnTheNextSlide}
        {...rest}
      >
        {enableBackHome && <BackHome />}

        {children}
        {fragments}
      </section>
      {animateOnTheNextSlide && (
        <section
          data-background-iframe={iframeBg}
          data-background-video={videoBg}
          data-background-video-muted
          data-background-color={bg}
          data-state={state}
          data-auto-animate
          {...rest}
        >
          {children}
          {fragments}
        </section>
      )}
    </>
  )
}
