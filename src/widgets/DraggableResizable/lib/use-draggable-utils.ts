import { MouseEvent } from 'react'

export const getDraggableHandler = (
  e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
) => {
  // Draggable element (aria-label='draggable-resizable-handler')
  return e.currentTarget as HTMLElement
}

export const getParentNode = (child: HTMLElement) => {
  return child.parentNode as HTMLElement | null
}

export const getPositionDelta = (
  mouseDownEvent: MouseEvent,
  mouseMoveEvent: MouseEvent,
) => {
  return {
    dx: mouseMoveEvent.clientX - mouseDownEvent.clientX,
    dy: mouseMoveEvent.clientY - mouseDownEvent.clientY,
  }
}
