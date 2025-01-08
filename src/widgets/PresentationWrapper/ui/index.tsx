'use client'

import React, { useContext, useEffect, useRef } from 'react'
import Image from 'next/image'
import { AppStateContext } from '@/shared/context/app-state-context'
import { RevealContext } from '@/shared/context/reveal-context'
import { SlideElementsContext } from '@/shared/context/slide-elements-context'
import { DraggableResizable } from '@/shared/ui/DraggableResizable'
import { EditableFlipWords } from '@/shared/ui/EditableFlipWords'
import { EditableText } from '@/shared/ui/EditableText'
import { PanelLeft } from 'lucide-react'

import { Slide } from '@/entities/Slide/ui'
import { groupBySlideId } from '@/entities/SlideElement/lib'
import { Button } from '@/shared/ui/common/aceternity/Button'
import { TextHighlight } from '@/shared/ui/common/aceternity/TextHighlight'
import { cn } from '@/shared/lib/cn-merge'

export const PresentationWrapper = () => {
  const { setDeckRef, deckRef } = useContext(RevealContext)
  const { elements, setElements } = useContext(SlideElementsContext)
  const { openedSidenav, setOpenedSidenav } = useContext(AppStateContext)

  const deckDivRef = useRef<HTMLDivElement>({} as HTMLDivElement) // reference to deck container div

  useEffect(() => {
    setElements([
      {
        'slide-id': 'slide-0',
        content: 'New Slide',
        id: 'text-node-0',
        spacing: {
          x: 400,
          y: 0,
        },
        type: 'text-node',
        bg: '#dd3636',
        size: {
          width: 300,
          height: 100,
        },
      },
      {
        'slide-id': 'slide-1',
        content: 'New Slide',
        id: 'text-node-1',
        spacing: {
          x: 400,
          y: 0,
        },
        size: {
          width: 300,
          height: 100,
        },
        type: 'text-node',
        bg: 'white',
      },
    ])
  }, [])

  useEffect(() => {
    if (!deckRef.current && deckDivRef.current) {
      setDeckRef(deckDivRef)
    }
  }, [deckDivRef.current])

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
        <div className='custom-controls absolute right-0 top-0 h-10 w-full'>
          <Button
            className='absolute right-0 z-30'
            variant='none'
            onClick={() => setOpenedSidenav(!openedSidenav)}
          >
            <PanelLeft size={24} color='black' />
          </Button>
        </div>

        <div className='slides'>
          {Object.entries(groupBySlideId(elements)).map(([name, elements]) => {
            return (
              <Slide
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
                          <DraggableResizable initialPosition={el.spacing}>
                            <Image
                              src={el.content}
                              className='absolute !m-0 !max-h-full !max-w-full select-none'
                              fill
                              alt={el.id}
                            />
                          </DraggableResizable>
                        ) : el.type === 'text-node' ? (
                          <EditableText
                            element={el}
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
                          <DraggableResizable initialPosition={el.spacing}>
                            <p className='text-black'>
                              <TextHighlight>{el.content}</TextHighlight>
                            </p>
                          </DraggableResizable>
                        ) : (
                          <DraggableResizable initialPosition={el.spacing}>
                            <EditableFlipWords
                              initialValue={el.content}
                              handleDelete={() => {
                                handleDelete(el.id)
                              }}
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
          })}
        </div>
      </div>
    </>
  )
}
