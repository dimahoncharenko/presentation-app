'use client'

import React, { useContext, useEffect, useRef } from 'react'
import Image from 'next/image'

import { DraggableResizable } from '@/widgets/DraggableResizable'
import { Sidenav } from '@/widgets/Sidenav'
import { AddNewSlide } from '@/features/AddNewSlide'
import { useSlidesStore } from '@/entities/Slide/lib/slide-store-provider'
import { Slide } from '@/entities/Slide/ui'
import { EditableFlipWords, EditableText } from '@/entities/SlideElement'
import { TextHighlight } from '@/shared/ui/bricks/featured/TextHighlight'
import { RevealContext } from '@/shared/context/reveal-context'
import { cn } from '@/shared/lib/cn-merge'

export const PresentationWrapper = () => {
  const { setDeckRef, deckRef } = useContext(RevealContext)
  const deckDivRef = useRef<HTMLDivElement>({} as HTMLDivElement) // reference to deck container div
  const slidesState = useSlidesStore(state => state)

  useEffect(() => {
    if (!deckRef.current && deckDivRef.current) {
      setDeckRef(deckDivRef)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckDivRef.current, deckRef.current])

  useEffect(() => {
    if (deckRef.current) {
      deckRef.current.slide(deckRef.current.getState().indexh)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckRef.current, slidesState.slides.length])

  const handleDelete = (slideId: string, id: string) => {
    slidesState.removeNodeFromSlide(slideId, id)
  }

  return (
    <>
      <div
        className={cn('reveal mr-auto transition-all duration-200 ease-in-out')}
        ref={deckDivRef}
      >
        {slidesState.slides.length > 0 && <Sidenav />}

        <div className='slides'>
          {slidesState.slides.length > 0 ? (
            <>
              {slidesState.slides.map((slide, index) => (
                <Slide
                  index={index}
                  key={slide.slideId}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  bg={slide?.bgColor}
                >
                  <>
                    {slide.elements.map(el => {
                      return (
                        <React.Fragment key={el.id}>
                          {el.type === 'image-node' ? (
                            <DraggableResizable
                              id={el.id}
                              onDelete={() =>
                                handleDelete(slide.slideId, el.id)
                              }
                              type='common'
                              initialPosition={el.position}
                            >
                              <Image
                                src={el.content}
                                className='!m-0 !max-h-full !max-w-full select-none'
                                fill
                                alt={el.id}
                              />
                            </DraggableResizable>
                          ) : el.type === 'text-node' ? (
                            <EditableText
                              element={el}
                              onDelete={() =>
                                handleDelete(slide.slideId, el.id)
                              }
                              onChangedPosition={newPosition => {
                                slidesState.adjustPosition(
                                  slide.slideId,
                                  el.id,
                                  newPosition,
                                )
                              }}
                              onChange={value => {
                                if (!value) return

                                slidesState.changeContent(
                                  slide.slideId,
                                  el.id,
                                  value,
                                )
                              }}
                            />
                          ) : el.type === 'text-highlight-node' ? (
                            <DraggableResizable
                              id={el.id}
                              onDelete={() =>
                                handleDelete(slide.slideId, el.id)
                              }
                              type='common'
                              initialPosition={el.position}
                            >
                              <p className='text-black'>
                                <TextHighlight>{el.content}</TextHighlight>
                              </p>
                            </DraggableResizable>
                          ) : (
                            <DraggableResizable
                              id={el.id}
                              onDelete={() =>
                                handleDelete(slide.slideId, el.id)
                              }
                              type='common'
                              initialPosition={el.position}
                            >
                              <EditableFlipWords
                                initialValue={el.content}
                                handleSubmit={words => {
                                  if (words.trim()) {
                                    slidesState.changeContent(
                                      slide.slideId,
                                      el.id,
                                      words,
                                    )
                                  }
                                }}
                              />
                            </DraggableResizable>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </>
                </Slide>
              ))}
            </>
          ) : (
            <Slide
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <div className='flex h-full items-center justify-center'>
                {/* 0 is the first slide, but for now there is no slides */}
                <AddNewSlide currentSlideIndex={0} />
              </div>
            </Slide>
          )}
        </div>
      </div>
    </>
  )
}
