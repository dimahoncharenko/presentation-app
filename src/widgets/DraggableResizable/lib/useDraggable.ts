import { MouseEvent, useRef } from 'react'

type Props = Partial<{
  disabled: boolean
}> | void

export const useDraggable = (props: Props) => {
  const draggableRef = useRef<HTMLDivElement>({} as HTMLDivElement)

  const dragOnMouseDown = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
  ) => {
    if (e.currentTarget) {
      const handleMouseMove: EventListener = evt => {
        const event = evt as unknown as MouseEvent

        if (draggableRef.current && !props?.disabled) {
          draggableRef.current.style.transform = `translate(calc(${event.clientX}px - 50%), ${event.clientY}px)`
        }
      }

      const removeHandlers = () => {
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
