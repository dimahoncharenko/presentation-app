import { MouseEvent, useRef, useState } from 'react'

type Props = {
  disabled?: boolean
  initialPosition?: {
    x: number
    y: number
  }
}

export const useDraggable = ({ disabled, initialPosition }: Props) => {
  const draggableRef = useRef<HTMLDivElement>({} as HTMLDivElement)
  const [position, setPosition] = useState(initialPosition ?? { x: 0, y: 0 })

  const adjustPosition = (value: { x: number; y: number }) => {
    setPosition(value)
  }

  const dragOnMouseDown = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
  ) => {
    // Draggable element (aria-label='draggable-resizable-handler')
    const currentEl = e.currentTarget as HTMLElement

    // Controls wrapper (aria-label='draggable-resizable-controls')
    const parentEl = currentEl.parentNode as HTMLElement

    if (parentEl) {
      const rect = parentEl.getBoundingClientRect()
      const handlerSize = (
        parentEl.children[0] as HTMLElement
      ).getBoundingClientRect().width

      // Sets the position of the draggable element: mouse position - top left corner + doubled handler size
      // Doubled handler size is used for centering the draggable element
      const offsetX = e.clientX - rect.left + handlerSize * 2
      const offsetY = e.clientY - rect.top

      const handleMouseMove: EventListener = evt => {
        const event = evt as unknown as MouseEvent

        if (draggableRef.current && !disabled) {
          // Calculates new position and updates
          const newX = event.clientX - offsetX
          const newY = event.clientY - offsetY

          setPosition({ x: newX, y: newY })
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
    position,
    adjustPosition,
  }
}
