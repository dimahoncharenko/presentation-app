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
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(initialPosition ?? { x: 0, y: 0 })

  const adjustPosition = (value: { x: number; y: number }) => {
    setPosition(value)
  }

  const forceDragging = (value: boolean) => {
    setIsDragging(value)
  }

  const dragOnMouseDown = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
  ) => {
    // Draggable element (aria-label='draggable-resizable-handler')
    const currentEl = e.target as HTMLElement

    // Controls wrapper (aria-label='draggable-resizable-controls')
    const parentEl = currentEl.parentNode?.parentNode as HTMLElement

    if (parentEl) {
      // Calculate the difference between the mouse position (e.clientX, e.clientY)
      // and the top-left corner of the controls wrapper (rect.left, rect.top).
      let rect: DOMRect
      let handlerSize: number

      // If it's not the draggable controls, then it's a handler,
      // we need the container of the handler to take its width and calculate the position
      if (parentEl.ariaLabel !== 'draggable-resizable-controls') {
        const controls = parentEl.parentNode as HTMLElement

        // Calculates the width of the handler
        handlerSize = parentEl.getBoundingClientRect().width

        rect = controls.getBoundingClientRect()
      } else {
        // Calculates the width of the handler
        handlerSize = (
          parentEl.children[0] as HTMLElement
        ).getBoundingClientRect().width

        rect = parentEl.getBoundingClientRect()
      }

      // Sets the initial position of the draggable element: mouse position - top left corner + doubled handler size
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
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      setIsDragging(true)

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  return {
    draggableRef,
    dragOnMouseDown,
    isDragging,
    position,
    adjustPosition,
    forceDragging,
  }
}
