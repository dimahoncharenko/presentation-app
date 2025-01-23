import { MouseEvent, useRef } from 'react'

import { getDraggableHandler, getParentNode } from './use-draggable-utils'

type Props = Partial<{
  disabled: boolean
  initialPosition: {
    x: number
    y: number
  }
}> | void

export const useDraggable = (props: Props) => {
  const draggableRef = useRef<HTMLDivElement>({} as HTMLDivElement)

  const dragOnMouseDown = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
  ) => {
    // Initialize the dragging only after the container has been initialized
    const handler = getDraggableHandler(e)
    const parentEl = getParentNode(handler)

    if (parentEl) {
      const handleMouseMove: EventListener = evt => {
        const event = evt as unknown as MouseEvent

        if (draggableRef.current && !props?.disabled) {
          draggableRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`
        }
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  return {
    draggableRef,
    dragOnMouseDown,
  }
}
