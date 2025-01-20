import { MouseEvent, useContext, useRef } from 'react'

import { SelectedContext } from '@/shared/context/selected-nodes'

type Props = {
  disabled?: boolean
  initialPosition: {
    x: number
    y: number
  }
}

export const useDraggable = ({ disabled, initialPosition }: Props) => {
  const draggableRef = useRef<HTMLDivElement>({} as HTMLDivElement)
  const { selectedNodes, changePosition } = useContext(SelectedContext)

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
          // Change position of all selected elements
          const delta = {
            x: event.clientX - offsetX - initialPosition.x,
            y: event.clientY - offsetY - initialPosition.y,
          }

          selectedNodes.forEach(node => {
            changePosition({
              id: node.id,
              position: {
                x: node.position.x + delta.x,
                y: node.position.y + delta.y,
              },
            })
          })
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
