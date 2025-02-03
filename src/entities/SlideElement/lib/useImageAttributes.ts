import { useState } from 'react'

export type ImageAttributes = {
  frame: 'none' | 'shadowed' | 'bordered' | 'rounded'
  filter: 'none' | 'grayscale' | 'sepia' | 'hue-rotate(220deg)'
}

export const useImageAttributes = () => {
  const [attributes, setAttributes] = useState<ImageAttributes>({
    filter: 'none',
    frame: 'none',
  })

  return [attributes, setAttributes] as const
}
