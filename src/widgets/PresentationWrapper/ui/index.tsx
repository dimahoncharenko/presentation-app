'use client'

import React, { useContext, useEffect, useRef } from 'react'
import Selectable from 'react-selectable-box'

import { Sidenav } from '@/widgets/Sidenav'
import { AddNewSlide } from '@/features/AddNewSlide'
import { PresentationElement } from '@/entities/PresentationElement'
import { useSlidesStore } from '@/entities/Slide/lib/slide-store-provider'
import { Slide } from '@/entities/Slide/ui'
import {
  EditableFlippableText,
  EditableHighlightText,
} from '@/entities/SlideElement'
import { EditableImage } from '@/entities/SlideElement/ui/editable-image'
import { TextNode } from '@/entities/TextNode'
import { RevealContext } from '@/shared/context/reveal-context'
import { SelectedContext, SelectedNode } from '@/shared/context/selected-nodes'
import { cn } from '@/shared/lib/cn-merge'

export const PresentationWrapper = () => {
  const { setDeckRef, deckRef } = useContext(RevealContext)
  const deckDivRef = useRef<HTMLDivElement>({} as HTMLDivElement) // reference to deck container div
  const slidesState = useSlidesStore(state => state)
  const { selectedNodes, setSelectedNodes, selectDisabled, setSelectDisabled } =
    useContext(SelectedContext)

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

  useEffect(() => {
    const clearSelectionIfOutside = (event: MouseEvent) => {
      const node = event.target as HTMLElement

      if (!node.id) {
        setSelectedNodes(() => [])
      } else {
        setSelectedNodes([{ id: node.id }])
      }
    }
    window.addEventListener('dblclick', clearSelectionIfOutside)

    const selectWhenInsideSection = (event: MouseEvent) => {
      const node = event.target as HTMLElement

      if (node.tagName === 'SECTION') {
        setSelectDisabled(false)
      } else {
        setSelectDisabled(true)
      }
    }
    window.addEventListener('mousedown', selectWhenInsideSection)

    return () => {
      window.removeEventListener('dblclick', clearSelectionIfOutside)
      window.removeEventListener('mousedown', selectWhenInsideSection)
    }
  }, [])

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && deckRef.current) {
        selectedNodes.forEach(node => {
          slidesState.removeNodeFromSlide(
            `slide-${deckRef.current!.getState().indexh}`,
            node.id,
          )
        })
      }
    }

    window.addEventListener('keyup', handleKeyUp)
  }, [selectedNodes.length, deckRef])

  return (
    <div
      id='presentation-wrapper'
      className={cn('reveal mr-auto transition-all duration-200 ease-in-out')}
      ref={deckDivRef}
    >
      <Selectable
        disabled={selectDisabled}
        mode='add'
        boxClassName='pointer-events-none'
        value={selectedNodes}
        dragContainer={() =>
          document.getElementById('presentation-wrapper') as HTMLElement
        }
        onEnd={(
          _,
          {
            added,
            removed,
          }: { added: SelectedNode[]; removed: SelectedNode[] },
        ) => {
          const result = selectedNodes.concat(added)
          selectedNodes.filter(i => !removed.includes(i))

          setSelectedNodes(result)
        }}
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
                            <PresentationElement
                              id={el.id}
                              slideId={slide.slideId}
                              contentSlot={
                                <EditableImage
                                  id={el.id}
                                  src={el.content}
                                  alt={el.id}
                                />
                              }
                            />
                          ) : // <DraggableResizable
                          //   id={el.id}
                          //   onDelete={() =>
                          //     handleDelete(slide.slideId, el.id)
                          //   }
                          //   onDragLeave={newPosition => {
                          //     handleDragLeave(
                          //       slide.slideId,
                          //       el.id,
                          //       newPosition,
                          //     )
                          //   }}
                          //   type='common'
                          // >
                          // <EditableImage
                          //   id={el.id}
                          //   src={el.content}
                          //   alt={el.id}
                          // />
                          // </DraggableResizable>
                          el.type === 'text-node' ? (
                            <PresentationElement
                              id={el.id}
                              slideId={slide.slideId}
                              contentSlot={
                                <TextNode
                                  id={el.id}
                                  initialValue={el.content}
                                  handleChange={value => {
                                    if (!value) return

                                    slidesState.changeContent(
                                      slide.slideId,
                                      el.id,
                                      value,
                                    )
                                  }}
                                />
                              }
                            />
                          ) : el.type === 'text-highlight-node' ? (
                            // <DraggableResizable
                            //   id={el.id}
                            //   onDelete={() =>
                            //     handleDelete(slide.slideId, el.id)
                            //   }
                            //   onDragLeave={newPosition => {
                            //     handleDragLeave(
                            //       slide.slideId,
                            //       el.id,
                            //       newPosition,
                            //     )
                            //   }}
                            //   type='common'
                            // >
                            <PresentationElement
                              id={el.id}
                              slideId={slide.slideId}
                              contentSlot={
                                <EditableHighlightText
                                  initialValue={el.content}
                                  handleSubmit={() => {}}
                                />
                              }
                            />
                          ) : (
                            // <DraggableResizable
                            //   id={el.id}
                            //   onDelete={() =>
                            //     handleDelete(slide.slideId, el.id)
                            //   }
                            //   onDragLeave={newPosition => {
                            //     handleDragLeave(
                            //       slide.slideId,
                            //       el.id,
                            //       newPosition,
                            //     )
                            //   }}
                            //   type='common'
                            // >
                            <PresentationElement
                              id={el.id}
                              slideId={slide.slideId}
                              contentSlot={
                                <EditableFlippableText
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
                              }
                            />

                            // </DraggableResizable>
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
                <AddNewSlide currentSlideIndex={0} />
              </div>
            </Slide>
          )}
        </div>
      </Selectable>
    </div>
  )
}
