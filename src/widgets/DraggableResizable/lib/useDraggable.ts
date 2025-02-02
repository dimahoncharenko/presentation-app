import { MouseEvent, useContext, useEffect, useRef, useState } from 'react'

import { SelectedContext } from '@/shared/context/selected-nodes'

type Props = Partial<{
  disabled: boolean
}> | void

export const useDraggable = (props: Props) => {
  const draggableRef = useRef<HTMLDivElement>({} as HTMLDivElement)
  const [isDragging, seIsDragging] = useState(false)

  const { setSelectDisabled } = useContext(SelectedContext)

  useEffect(() => {
    setSelectDisabled(isDragging)
  }, [isDragging])

  const dragOnMouseDown = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
  ) => {
    seIsDragging(true)

    if (e.currentTarget) {
      const handleMouseMove: EventListener = evt => {
        const event = evt as unknown as MouseEvent

        if (draggableRef.current && !props?.disabled) {
          draggableRef.current.style.transform = `translate(calc(${event.clientX}px - 50%), ${event.clientY}px)`
        }
      }

      const removeHandlers = () => {
        seIsDragging(false)

        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', removeHandlers)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', removeHandlers)
    }
  }

  return {
    draggableRef,
    dragOnMouseDown,
  }
}
