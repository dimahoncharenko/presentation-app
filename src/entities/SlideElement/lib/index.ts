import { SlideElement } from '../model/types'

export const groupBySlideId = (elements: SlideElement[]) => {
  const groupedSlides: { [P in string]: SlideElement[] } = {}

  elements.forEach(element => {
    const slideId = element['slide-id']
    if (!groupedSlides[slideId]) {
      groupedSlides[slideId] = []
    }
    groupedSlides[slideId].push(element)
  })

  return groupedSlides
}
