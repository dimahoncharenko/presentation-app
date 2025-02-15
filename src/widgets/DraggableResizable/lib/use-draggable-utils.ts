import { MouseEvent, RefObject } from 'react'

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

export const getChild = (node: HTMLElement, selector: string) => {
  const child = node.querySelector(selector)
  if (!child) throw new Error('No child')

  return child
}

export const loadNaturalImageSize = (
  img: HTMLImageElement,
): Promise<{ width: number; height: number }> =>
  new Promise(resolve => {
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }
  })

export const changeElementSize = (
  ref: RefObject<{ width: number; height: number }>,
  newSize: { width: number; height: number },
) => {
  ref.current = newSize

  return ref
}

type AssignHeightParams = {
  height: number
  minHeight: number
}

export const assignHeightWithinRange = ({
  height,
  minHeight,
}: AssignHeightParams) => {
  const isHeightZero = height === 0

  return isHeightZero ? minHeight : Math.max(height, minHeight)
}
