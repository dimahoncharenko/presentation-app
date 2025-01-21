import { MouseEvent, useContext, useRef } from 'react'

import { SelectedContext } from '@/shared/context/selected-nodes'
import {
  getDraggableHandler,
  getParentNode,
  getPositionDelta,
} from './use-draggable-utils'

type Props = Partial<{
  disabled: boolean
}> | void

export const useDraggable = (props: Props) => {
  const draggableRef = useRef<HTMLDivElement>({} as HTMLDivElement)
  const { selectedNodes, changePosition } = useContext(SelectedContext)

  const adjustPositionForSelected = ({
    dx,
    dy,
  }: {
    dx: number
    dy: number
  }) => {
    selectedNodes.forEach(node => {
      changePosition({
        id: node.id,
        position: {
          x: node.position.x + dx,
          y: node.position.y + dy,
        },
      })
    })
  }

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
          const delta = getPositionDelta(e, event)
          adjustPositionForSelected(delta)
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
    adjustPositionForSelected,
  }
}
