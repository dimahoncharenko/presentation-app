import { createStore } from 'zustand'
import { devtools } from 'zustand/middleware'

import { SlideElement } from '@/entities/SlideElement'

export type SlidesState = {
  slides: {
    slideId: string
    elements: Array<SlideElement>
    bgColor?: string
  }[]
}

export type SlidesActions = {
  addNodeToSlide: (
    slideId: SlidesState['slides'][number]['slideId'],
    element: SlideElement,
  ) => void
  removeNodeFromSlide: (
    slideId: SlidesState['slides'][number]['slideId'],
    nodeId: SlideElement['id'],
  ) => void
  adjustPosition: (
    slideId: SlidesState['slides'][number]['slideId'],
    nodeId: SlideElement['id'],
    newPosition: SlideElement['position'],
  ) => void
  adjustSize: (
    slideId: SlidesState['slides'][number]['slideId'],
    nodeId: SlideElement['id'],
    newSize: SlideElement['size'],
  ) => void
  changeContent: (
    slideId: SlidesState['slides'][number]['slideId'],
    nodeId: SlideElement['id'],
    newContent: SlideElement['content'],
  ) => void
  removeSlide: (slideId: SlidesState['slides'][number]['slideId']) => void
  addSlide: (slideIndex: number) => void
  replaceNode: (
    slideId: SlidesState['slides'][number]['slideId'],
    nodeId: SlideElement['id'],
    newNode: SlideElement,
  ) => void
}

export type SlidesStore = SlidesState & SlidesActions

export const defaultInitState: SlidesState = {
  slides: [],
}

export const createSlidesStore = (
  initState: SlidesState = defaultInitState,
) => {
  return createStore<SlidesStore>()(
    devtools(set => ({
      ...initState,
      addNodeToSlide: (slideId, element) =>
        set(state => {
          // When the presentation is empty
          if (!state.slides.length) {
            return {
              slides: [
                {
                  slideId,
                  elements: [element],
                  bgColor: '',
                },
              ],
            }
            // Adding node to the existing slide
          } else if (state.slides.find(slide => slide.slideId === slideId)) {
            return {
              slides: state.slides.map(slide => {
                if (slide.slideId === slideId) {
                  slide = {
                    ...slide,
                    elements: [...slide.elements, element],
                    bgColor: '',
                  }
                }

                return slide
              }),
            }
          }

          // Creating a new slide
          return {
            slides: [
              ...state.slides,
              {
                slideId,
                elements: [element],
                bgColor: '',
              },
            ],
          }
        }),
      removeNodeFromSlide: (slideId, nodeId) =>
        set(state => ({
          slides: state.slides.map(slide => {
            if (slide.slideId === slideId) {
              slide = {
                ...slide,
                elements: slide.elements.filter(el => el.id !== nodeId),
              }

              return slide
            }

            return slide
          }),
        })),
      removeSlide: slideId =>
        set(state => {
          const slideToRemove = state.slides.findIndex(
            el => el.slideId === slideId,
          )
          const regex = /(?<=slide-)\d+/g

          const updatedSlides = state.slides.map(el => {
            const match = el.slideId.match(regex)

            return {
              slideId: match
                ? `slide-${Math.max(0, parseInt(match[0]) - 1)}`
                : el.slideId,
              elements: el.elements,
              bgColor: '',
            }
          })

          const newSlides = [
            ...updatedSlides.slice(0, slideToRemove),
            ...updatedSlides.slice(slideToRemove + 1),
          ]

          return {
            slides:
              newSlides.length > 0
                ? newSlides
                : [
                    {
                      slideId: 'slide-0',
                      elements: [],
                      bgColor: '',
                    },
                  ],
          }
        }),
      addSlide: slideIndex =>
        set(state => {
          if (state.slides.length === 0) {
            return {
              slides: [
                {
                  slideId: `slide-0`,
                  elements: [],
                  bgColor: '',
                },
              ],
            }
          }

          const candidate = state.slides.findIndex(
            slide => slide.slideId === `slide-${slideIndex + 1}`,
          )

          if (candidate !== -1) {
            const regex = /(?<=slide-)\d+/g

            const updatedSlides = state.slides.map((el, index) => {
              if (index > slideIndex) {
                const match = el.slideId.match(regex)

                return {
                  slideId: match
                    ? `slide-${parseInt(match[0]) + 1}`
                    : el.slideId,
                  elements: el.elements,
                  bgColor: '',
                }
              }

              return el
            })

            console.log('CANDIDATE', candidate)
            console.log('UPDATED: ', updatedSlides)

            const newSlides = [
              ...updatedSlides.slice(0, candidate),
              {
                slideId: `slide-${slideIndex + 1}`,
                elements: [],
                bgColor: '',
              },
              ...updatedSlides.slice(candidate),
            ]

            return {
              slides: newSlides,
            }
          }

          return {
            slides: [
              ...state.slides,
              { slideId: `slide-${slideIndex + 1}`, elements: [], bgColor: '' },
            ],
          }
        }),
      adjustPosition: (slideId, nodeId, newPosition) =>
        set(state => ({
          ...state,
          slides: state.slides.map(slide => {
            if (slide.slideId === slideId) {
              slide = {
                ...slide,
                elements: slide.elements.map(el => {
                  if (el.id === nodeId) {
                    el = { ...el, position: newPosition }
                  }
                  return el
                }),
              }

              return slide
            }

            return slide
          }),
        })),
      adjustSize: (slideId, nodeId, newSize) =>
        set(state => ({
          ...state,
          slides: state.slides.map(slide => {
            if (slide.slideId === slideId) {
              slide = {
                ...slide,
                elements: slide.elements.map(el => {
                  if (el.id === nodeId) {
                    el = { ...el, size: newSize }
                  }
                  return el
                }),
              }

              return slide
            }

            return slide
          }),
        })),
      changeContent: (slideId, nodeId, newContent) =>
        set(state => ({
          ...state,
          slides: state.slides.map(slide => {
            if (slide.slideId === slideId) {
              slide = {
                ...slide,
                elements: slide.elements.map(el => {
                  if (el.id === nodeId) {
                    el = { ...el, content: newContent }
                  }
                  return el
                }),
              }

              return slide
            }

            return slide
          }),
        })),
      replaceNode: (slideId, nodeIdToReplace, newNode) =>
        set(state => ({
          slides: state.slides.map(slide => {
            if (slide.slideId === slideId) {
              slide = {
                ...slide,
                elements: slide.elements.map(el =>
                  el.id === nodeIdToReplace ? newNode : el,
                ),
              }

              return slide
            }

            return slide
          }),
        })),
    })),
  )
}
