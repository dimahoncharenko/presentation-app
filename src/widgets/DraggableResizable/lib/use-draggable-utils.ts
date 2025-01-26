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

export const getRectData = (node: HTMLElement | Element | null) => {
  return !node
    ? ({
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
      } as DOMRect)
    : node.getBoundingClientRect()
}

export const calculateNewCoordinates = () => {}
