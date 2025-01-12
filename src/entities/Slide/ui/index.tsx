'use client'

import React, {
  CSSProperties,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { HexColorPicker } from 'react-colorful'

import { BackHome } from '@/features/BackHome'
import { AppStateContext } from '@/shared/context/app-state-context'
import { RevealContext } from '@/shared/context/reveal-context'

type Props = Partial<{
  bg: CSSProperties['color']
  videoBg: string
  enableBackHome: boolean
  state: string
  animateOnTheNextSlide: CSSProperties
  fragments: React.ReactElement[]
  iframeBg: string
  index: number
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
  index,
  ...rest
}) => {
  const { selectedColor } = useContext(AppStateContext)
  const { deckRef } = useContext(RevealContext)

  const activeBgs = [videoBg, bg, iframeBg].filter(bg => !!bg)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (selectedColor.indexh === index) {
      sectionRef.current?.setAttribute(
        'data-background-color',
        selectedColor.color,
      )
      deckRef.current?.sync()
    }
  }, [selectedColor])

  if (activeBgs.length > 1) {
    throw new Error("Multiple backgrounds aren't supported!")
  }

  return (
    <>
      <section
        ref={sectionRef}
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
          ref={sectionRef}
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
