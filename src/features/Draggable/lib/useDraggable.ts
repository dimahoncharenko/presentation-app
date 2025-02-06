import { MouseEvent, RefObject, useContext, useEffect, useState } from 'react'

import { SelectedContext } from '@/shared/context/selected-nodes'

type Props = Partial<{
  disabled: boolean
}> & { ref: RefObject<HTMLElement> }

export const useDraggable = (props: Props) => {
  const [isDragging, setIsDragging] = useState(false)

  const { setSelectDisabled } = useContext(SelectedContext)

  useEffect(() => {
    setSelectDisabled(isDragging)
  }, [isDragging])

  const dragOnMouseDown = (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>,
  ) => {
    setIsDragging(true)

    if (e.currentTarget) {
      const handleMouseMove: EventListener = evt => {
        const event = evt as unknown as MouseEvent

        if (props.ref.current && !props?.disabled) {
          props.ref.current.style.transform = `translate(calc(${event.clientX}px - 50%), ${event.clientY}px)`
        }
      }

      const removeHandlers = () => {
        setIsDragging(false)

        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', removeHandlers)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', removeHandlers)
    }
  }

  return {
    dragOnMouseDown,
    isDragging,
    setIsDragging,
    draggableRef: props.ref,
  }
}
