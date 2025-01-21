import { MouseEvent, useContext, useState } from 'react'

import { SelectedContext } from '@/shared/context/selected-nodes'

type Props = {
  draggableRef: React.RefObject<HTMLElement>
  contentRef: React.RefObject<HTMLDivElement | null>
  heightResizable?: boolean
}

export const useResizableMultiple = ({
  draggableRef,
  heightResizable = true,
}: Props) => {
  const [isResizing, setIsResizing] = useState(false)
  const { changePosition, changeSize, selectedNodes } =
    useContext(SelectedContext)

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
                    event.clientY + rect.height < node.position.y
                      ? node.size!.height
                      : newHeight,
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
                    event.clientY + rect.height > node.position.y + rect.height
                      ? newHeight
                      : node.size!.height,
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
                    event.clientY < node.position.y + rect.height
                      ? node.position.y + (event.clientY - e.clientY)
                      : node.position.y + rect.height,
                },
              })

              changeSize({
                id: node.id,
                position: node.position,
                size: {
                  width: newWidth,
                  height:
                    event.clientY < node.position.y + rect.height
                      ? newHeight
                      : node.size!.height,
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
                    event.clientY < node.position.y + rect.height
                      ? node.position.y + (event.clientY - e.clientY)
                      : node.position.y + rect.height,
                },
              })

              changeSize({
                id: node.id,
                position: node.position,
                size: {
                  width: newWidth,
                  height:
                    event.clientY < node.position.y + rect.height
                      ? newHeight
                      : node.size!.height,
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

  // It's used to calculate the natural size of the draggable element; only while mounting
  // useEffect(() => {
  //   if (contentRef.current && draggableRef.current && !initialized) {
  //     const child = contentRef.current.children[0] as HTMLElement
  //     let newSize: { width: number; height: number }

  //     if (child.tagName === 'IMG') {
  //       const img = child as HTMLImageElement

  //       // Handle image loading
  //       if (!img.naturalHeight || !img.naturalWidth) {
  //         img.onload = () => {
  //           newSize = {
  //             width: img.naturalWidth,
  //             height: img.naturalHeight,
  //           }
  //           // setSize(newSize)
  //           draggableRef.current!.style.width = `${newSize.width}px`
  //           draggableRef.current!.style.height = `${newSize.height}px`
  //           setInitialized(true)
  //         }
  //         return
  //       }

  //       newSize = {
  //         width: img.naturalWidth,
  //         height: img.naturalHeight,
  //       }
  //     } else {
  //       const rect = child.getBoundingClientRect()

  //       newSize = {
  //         width: Math.max(rect.width, 200),
  //         height: Math.max(rect.height, 40),
  //       }
  //     }

  //     // setSize({
  //     //   width: newSize.width,
  //     //   height: newSize.height,
  //     // })

  //     selectedNodes.forEach(node => {
  //       // changePosition({
  //       //   id: node.id,
  //       //   position: {
  //       //     x: node.position.x + (event.clientX - e.clientX),
  //       //     y:
  //       //       newHeight > node.size!.height
  //       //         ? node.position.y + (event.clientY - e.clientY)
  //       //         : node.position.y,
  //       //   },
  //       // })

  //       // changeSize({
  //       //   id: node.id,
  //       //   position: node.position,
  //       //   size: {
  //       //     width: Math.max(newWidth, 200),
  //       //     height: Math.max(40, newHeight),
  //       //   },
  //       // })
  //     })

  //     setInitialized(true)

  //     draggableRef.current.style.width = `${newSize.width}px`
  //     draggableRef.current.style.height = `${newSize.height}px`
  //   }
  // }, [contentRef, draggableRef, initialized, setInitialized])

  return {
    resizeOnMouseDown,
    isResizing,
  }
}
