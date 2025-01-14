'use client'

import React, { useContext, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Palette, PanelLeft } from 'lucide-react'

import { DraggableResizable } from '@/widgets/DraggableResizable'
import { AddNewSlide } from '@/features/AddNewSlide'
import { Slide } from '@/entities/Slide/ui'
import { EditableFlipWords, EditableText } from '@/entities/SlideElement'
import { groupBySlideId } from '@/entities/SlideElement/lib'
import { Button } from '@/shared/ui/bricks/common/Button'
import { TextHighlight } from '@/shared/ui/bricks/featured/TextHighlight'
import { AppStateContext } from '@/shared/context/app-state-context'
import { RevealContext } from '@/shared/context/reveal-context'
import { SlideElementsContext } from '@/shared/context/slide-elements-context'
import { cn } from '@/shared/lib/cn-merge'

export const PresentationWrapper = () => {
  const { setDeckRef, deckRef } = useContext(RevealContext)
  const { elements, setElements } = useContext(SlideElementsContext)
  const { openedSidenav, setOpenedSidenav, setSelectedColor } =
    useContext(AppStateContext)
  const deckDivRef = useRef<HTMLDivElement>({} as HTMLDivElement) // reference to deck container div

  useEffect(() => {
    if (!deckRef.current && deckDivRef.current) {
      setDeckRef(deckDivRef)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckDivRef.current, deckRef.current])

  const groupedElements = Object.entries(groupBySlideId(elements))

  useEffect(() => {
    if (deckRef.current) {
      deckRef.current.slide(deckRef.current.getState().indexh)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckRef.current, elements])

  const handleDelete = (id: string) => {
    setElements(prev => prev.filter(e => e.id !== id))
  }

  return (
    <>
      <div
        className={cn(
          'reveal mr-auto transition-all duration-200 ease-in-out',
          openedSidenav && '!w-[calc(100%-250px)]',
        )}
        ref={deckDivRef}
      >
        {elements.length > 0 && (
          <div className='custom-controls absolute right-0 top-0 h-10 w-full'>
            <Button
              className='absolute left-0 z-30'
              variant='none'
              onClick={() => {
                setSelectedColor({
                  indexh: deckRef.current!.getState().indexh,
                  color: 'red',
                })
              }}
            >
              <Palette size={24} color='black' />
            </Button>
            <Button
              className='absolute right-0 z-30'
              variant='none'
              onClick={() => setOpenedSidenav(!openedSidenav)}
            >
              <PanelLeft size={24} color='black' />
            </Button>
          </div>
        )}

        <div className='slides'>
          {groupedElements.length ? (
            groupedElements.map(([name, elements], index) => {
              return (
                <Slide
                  index={index}
                  key={name}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  bg={elements[0].bg}
                >
                  <>
                    {elements.map((el, index) => {
                      return (
                        <React.Fragment key={index}>
                          {el.type === 'image-node' ? (
                            <DraggableResizable
                              onDelete={() => handleDelete(el.id)}
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
                              onDelete={() => handleDelete(el.id)}
                              onChange={value => {
                                if (!value) return

                                setElements(prev =>
                                  prev.map(e => {
                                    if (e.id === el.id) {
                                      return {
                                        ...e,
                                        content: value,
                                      }
                                    }

                                    return e
                                  }),
                                )
                              }}
                            />
                          ) : el.type === 'text-highlight-node' ? (
                            <DraggableResizable
                              onDelete={() => handleDelete(el.id)}
                              type='common'
                              initialPosition={el.position}
                            >
                              <p className='text-black'>
                                <TextHighlight>{el.content}</TextHighlight>
                              </p>
                            </DraggableResizable>
                          ) : (
                            <DraggableResizable
                              onDelete={() => handleDelete(el.id)}
                              type='common'
                              initialPosition={el.position}
                            >
                              <EditableFlipWords
                                initialValue={el.content}
                                handleSubmit={words => {
                                  if (words.trim()) {
                                    setElements(prev =>
                                      prev.map(e => {
                                        if (e.id === el.id) {
                                          return {
                                            ...e,
                                            content: words,
                                          }
                                        }

                                        return e
                                      }),
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
              )
            })
          ) : (
            <Slide
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <div className='flex h-full items-center justify-center'>
                {/* 0 is the first slide, but for now there is no slides */}
                <AddNewSlide currentSlideIndex={-1} />
              </div>
            </Slide>
          )}
        </div>
      </div>
    </>
  )
}
