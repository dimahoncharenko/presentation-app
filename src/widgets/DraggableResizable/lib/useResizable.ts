import { MouseEvent, useEffect, useState } from 'react'

type Props = {
  draggableRef: React.RefObject<HTMLElement>
  contentRef: React.RefObject<HTMLDivElement | null>
  position: { x: number; y: number }
  setPosition: (value: { x: number; y: number }) => void
  heightResizable?: boolean
}

export const useResizable = ({
  draggableRef,
  setPosition,
  position,
  contentRef,
  heightResizable = true,
}: Props) => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [initialized, setInitialized] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

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
          let newWidth = size.width
          let newHeight = size.height

          // Calculate new width, height and position
          if (direction === 'se') {
            newWidth = rect.width - (prevX - event.clientX)
            // In cases when I don't need to resize height
            if (heightResizable)
              newHeight = rect.height - (prevY - event.clientY)
          } else if (direction === 'sw') {
            newWidth = rect.width - (event.clientX - prevX)
            if (heightResizable)
              newHeight = rect.height + (event.clientY - prevY)

            setPosition({
              y: position.y,
              x: position.x - (position.x - event.clientX),
            })
          } else if (direction === 'ne') {
            newWidth = rect.width - (prevX - event.clientX)
            if (heightResizable)
              newHeight = rect.height + (prevY - event.clientY)
            setPosition({
              x: position.x,
              y: position.y - (position.y - event.clientY),
            })
          } else if (direction === 'nw') {
            newWidth = rect.width + (prevX - event.clientX)

            if (heightResizable)
              newHeight = rect.height + (prevY - event.clientY)
            setPosition({
              x: position.x - (position.x - event.clientX),
              y: position.y - (position.y - event.clientY),
            })
          }

          setSize({ width: newWidth, height: newHeight })
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
  useEffect(() => {
    if (contentRef.current && draggableRef.current && !initialized) {
      const child = contentRef.current.children[0] as HTMLElement
      let newSize: { width: number; height: number }

      if (child.tagName === 'IMG') {
        const img = child as HTMLImageElement

        // Handle image loading
        if (!img.naturalHeight || !img.naturalWidth) {
          img.onload = () => {
            newSize = {
              width: img.naturalWidth,
              height: img.naturalHeight,
            }
            setSize(newSize)
            draggableRef.current!.style.width = `${newSize.width}px`
            draggableRef.current!.style.height = `${newSize.height}px`
            setInitialized(true)
          }
          return
        }

        newSize = {
          width: img.naturalWidth,
          height: img.naturalHeight,
        }
      } else {
        const rect = child.getBoundingClientRect()

        newSize = {
          width: Math.max(rect.width, 200),
          height: Math.max(rect.height, 40),
        }
      }

      setSize({
        width: newSize.width,
        height: newSize.height,
      })

      setInitialized(true)

      draggableRef.current.style.width = `${newSize.width}px`
      draggableRef.current.style.height = `${newSize.height}px`
    }
  }, [contentRef, draggableRef, initialized, setInitialized, setSize])

  // It's used to update the size of the draggable while resizing
  useEffect(() => {
    if (draggableRef.current) {
      draggableRef.current.style.width = `${size.width}px`
      draggableRef.current.style.height = `${size.height}px`
    }
  }, [size.height, size.width, draggableRef])

  return {
    resizeOnMouseDown,
    size,
    isResizing,
  }
}
