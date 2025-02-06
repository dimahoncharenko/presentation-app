import { useState } from 'react'

type ElementID = string

export type AnimatedElement = {
  id: ElementID
  type: 'spin' | 'ping' | 'pulse' | 'bounce'
}

export const useAnimated = () => {
  const [animated, setAnimated] = useState<AnimatedElement[]>([])

  const queryAnimatedElementById = (id: ElementID) => {
    return animated?.find(el => el.id === id)
  }

  const addAnimation = (
    id: ElementID,
    animationType: AnimatedElement['type'],
  ) => {
    const candidate = queryAnimatedElementById(id)

    if (!candidate) {
      setAnimated(prev => [...prev, { id, type: animationType }])
    } else {
      setAnimated(prev =>
        prev?.map(elem => {
          if (elem.id === id) {
            elem.type = animationType
          }

          return elem
        }),
      )
    }
  }

  const clearAnimation = (id: ElementID) => {
    setAnimated(prev => prev?.filter(elem => elem.id !== id))
  }

  return [
    animated,
    { setAnimated, addAnimation, clearAnimation, queryAnimatedElementById },
  ] as const
}
