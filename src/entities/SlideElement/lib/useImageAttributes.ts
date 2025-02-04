import { useState } from 'react'

export type ImageAttributes = {
  frames: ('shadowed' | 'bordered' | 'rounded')[]
  filters: ('grayscale' | 'sepia' | 'hue-rotate(220deg)')[]
}

export const useImageAttributes = () => {
  const [attributes, setAttributes] = useState<ImageAttributes>({
    filters: [],
    frames: [],
  })

  const toggleFrameAttribute = (attr: ImageAttributes['frames'][number]) => {
    setAttributes(prev => ({
      ...prev,
      frames: prev.frames.includes(attr)
        ? prev.frames.filter(frame => frame !== attr)
        : [...prev.frames, attr],
    }))
  }

  const toggleFilterAttribute = (attr: ImageAttributes['filters'][number]) => {
    setAttributes(prev => ({
      ...prev,
      filters: prev.filters.includes(attr)
        ? prev.filters.filter(filter => filter !== attr)
        : [...prev.filters, attr],
    }))
  }

  const clearFramesAttribute = () => {
    setAttributes(prev => ({ ...prev, frames: [] }))
  }

  const clearFiltersAttribute = () => {
    setAttributes(prev => ({ ...prev, filters: [] }))
  }

  return [
    attributes,
    setAttributes,
    {
      toggleFilterAttribute,
      toggleFrameAttribute,
      clearFiltersAttribute,
      clearFramesAttribute,
    },
  ] as const
}
