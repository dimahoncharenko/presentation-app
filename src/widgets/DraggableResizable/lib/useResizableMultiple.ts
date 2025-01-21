import { MouseEvent, useContext, useEffect, useState } from 'react'

import { SelectedContext } from '@/shared/context/selected-nodes'
import { getRectData } from './use-draggable-utils'

type Props = {
  draggableRef: React.RefObject<HTMLElement>
  heightResizable?: boolean
}

export const useResizableMultiple = ({
  draggableRef,
  heightResizable = true,
}: Props) => {
  const [isResizing, setIsResizing] = useState(false)
  const { changePosition, changeSize, selectedNodes } =
    useContext(SelectedContext)

  const [naturalSize, setNaturalSize] = useState({
    width: 0,
    height: 0,
  })

  const resizeOnMouseDown = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    direction: string,
  ) => {
    const currentEl = e.target as HTMLElement
    const parentEl = currentEl.parentNode as HTMLElement

    if (parentEl) {
      let prevX = e.clientX
      let prevY = e.clientY

      const handleMouseMove: EventListener = evt => {
        const event = evt as unknown as MouseEvent

        if (draggableRef.current) {
          const rect = draggableRef.current.getBoundingClientRect()
          const handler = draggableRef.current.querySelector(
            '#draggable-resizable-controls',
          )
          const handlerRect = getRectData(handler)

          const HANDLER_HEIGHT = handlerRect.height

          let newWidth = 0
          let newHeight = 0

          // Calculate new width, height and position
          if (direction === 'se') {
            newWidth = rect.width - (prevX - event.clientX)
            // In cases when I don't need to resize height
            if (heightResizable)
              newHeight = rect.height - (prevY - event.clientY)

            selectedNodes.forEach(node => {
              changePosition({
                id: node.id,
                position: {
                  x: node.position.x,
                  y: node.position.y,
                },
              })

              changeSize({
                id: node.id,
                position: node.position,
                size: {
                  width: newWidth,
                  height:
                    event.clientY > node.position.y + naturalSize.height
                      ? newHeight
                      : naturalSize.height,
                },
              })
            })
          } else if (direction === 'sw') {
            newWidth = rect.width - (event.clientX - prevX)
            if (heightResizable)
              newHeight = rect.height + (event.clientY - prevY)

            selectedNodes.forEach(node => {
              changePosition({
                id: node.id,
                position: {
                  x: node.position.x + (event.clientX - e.clientX),
                  y: node.position.y,
                },
              })

              changeSize({
                id: node.id,
                position: node.position,
                size: {
                  width: newWidth,
                  height:
                    event.clientY > node.position.y + naturalSize.height
                      ? newHeight
                      : naturalSize.height,
                },
              })
            })
          } else if (direction === 'ne') {
            newWidth = rect.width - (prevX - event.clientX)

            if (heightResizable)
              newHeight = rect.height + (prevY - event.clientY)

            selectedNodes.forEach(node => {
              changePosition({
                id: node.id,
                position: {
                  x: node.position.x,
                  y:
                    newHeight > naturalSize.height
                      ? node.position.y +
                        (event.clientY - e.clientY) +
                        HANDLER_HEIGHT
                      : node.position.y + HANDLER_HEIGHT,
                },
              })

              changeSize({
                id: node.id,
                position: node.position,
                size: {
                  width: newWidth,
                  height:
                    event.clientY < node.position.y + naturalSize.height
                      ? newHeight
                      : naturalSize.height,
                },
              })
            })
          } else if (direction === 'nw') {
            newWidth = rect.width + (prevX - event.clientX)

            if (heightResizable)
              newHeight = rect.height + (prevY - event.clientY)

            selectedNodes.forEach(node => {
              changePosition({
                id: node.id,
                position: {
                  x: node.position.x + (event.clientX - e.clientX),
                  y:
                    newHeight > naturalSize.height
                      ? node.position.y +
                        (event.clientY - e.clientY) +
                        HANDLER_HEIGHT
                      : node.position.y + HANDLER_HEIGHT,
                },
              })

              changeSize({
                id: node.id,
                position: node.position,
                size: {
                  width: newWidth,
                  height:
                    event.clientY < node.position.y
                      ? newHeight
                      : naturalSize.height,
                },
              })
            })
          }

          prevX = event.clientX
          prevY = event.clientY
        }
      }

      const handleMouseUp = () => {
        setIsResizing(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      setIsResizing(true)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  // It's used to calculate the natural size of the element; only while mounting
  useEffect(() => {
    if (draggableRef.current) {
      const content = draggableRef.current.querySelector(
        '#draggable-resizable-content-container',
      )

      if (content) {
        const contentChild = content.firstChild as HTMLElement

        if (contentChild.tagName === 'IMG') {
          const img = contentChild as HTMLImageElement
          const maxWidth = 300

          if (!img.naturalHeight || !img?.naturalWidth) {
            img.onload = () => {
              setNaturalSize({
                width: img.naturalWidth,
                // Preserve aspect ratio and make sure the image is maximum $maxWidth
                height: (img.naturalHeight * maxWidth) / img.naturalWidth,
              })
            }
            return
          }
        } else {
          const rect = contentChild.getBoundingClientRect()
          setNaturalSize({
            width: rect.width,
            height: rect.height,
          })
        }
      }
    }
  }, [draggableRef])

  return {
    resizeOnMouseDown,
    isResizing,
  }
}
