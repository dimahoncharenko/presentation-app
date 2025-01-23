import {
  MouseEvent,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { SelectedContext } from '@/shared/context/selected-nodes'

type Props = {
  draggableRef: React.RefObject<HTMLElement>
  heightResizable?: boolean
  id?: string
}

export const useResizableMultiple = ({
  draggableRef,
  heightResizable = true,
}: Props) => {
  const [isResizing, setIsResizing] = useState(false)
  const { changePosition, changeSize, selectedNodes } =
    useContext(SelectedContext)

  const initialSize = useRef<{ width: number; height: number }>({
    height: 0,
    width: 0,
  })

  const size = useRef<{ width: number; height: number }>({
    height: 0,
    width: 0,
  })

  const position = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

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
              initialSize.current.width = img.naturalWidth
              initialSize.current.height =
                (img.naturalHeight * maxWidth) / img.naturalWidth
            }
            return
          }
        } else {
          const rect = contentChild.getBoundingClientRect()
          initialSize.current.width = rect.width
          initialSize.current.height = rect.height
        }
      }
    }
  }, [draggableRef])

  useLayoutEffect(() => {
    if (draggableRef.current) {
      const positionX = position.current.x
      const positionY = position.current.y
      const nodeWidth = size.current.width
      const nodeHeight = size.current.height

      draggableRef.current.style.transform = `translate(${positionX || 500}px, ${positionY || 300}px)`
      draggableRef.current.style.width = `${nodeWidth || initialSize.current.width || 200}px`
      draggableRef.current.style.height = `${nodeHeight || initialSize.current.height || 50}px`
    }
  }, [
    draggableRef,
    size.current.height,
    size.current.width,
    position.current.x,
    position.current.y,
  ])

  const resizeOnMouseDown = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    direction: string,
  ) => {
    const currentEl = e.target as HTMLElement
    const parentEl = currentEl.parentNode as HTMLElement

    if (parentEl) {
      let prevX = e.clientX
      let prevY = e.clientY

      const prevWidth = parentEl.offsetWidth
      const prevHeight = parentEl.offsetHeight

      const handleMouseMove: EventListener = evt => {
        const event = evt as unknown as MouseEvent

        if (draggableRef.current) {
          const rect = draggableRef.current.getBoundingClientRect()
          size.current.width = rect.width - (event.clientX - prevX)

          if (direction === 'se') {
            if (heightResizable) {
              size.current.height = rect.height - (prevY - event.clientY)
            }

            position.current = {
              x: e.clientX - prevWidth,
              y: e.clientY - prevHeight,
            }

            size.current = {
              width: rect.width + (event.clientX - prevX),
              height: size.current.height,
            }
          } else if (direction === 'sw') {
            if (heightResizable) {
              size.current.height = rect.height - (prevY - event.clientY)
            }

            position.current = {
              y: e.clientY - prevHeight,
              x: prevX - (prevX - event.clientX),
            }

            size.current = {
              width: rect.width - (event.clientX - prevX),
              height: size.current.height,
            }
          } else if (direction === 'ne') {
            if (heightResizable) {
              size.current.height = rect.height - (event.clientY - prevY)
            }

            position.current = {
              x: e.clientX - prevWidth,
              y: event.clientY + (prevY - event.clientY),
            }

            size.current = {
              width: rect.width + (event.clientX - prevX),
              height: size.current.height,
            }
          } else if (direction === 'nw') {
            if (heightResizable)
              size.current.height = rect.height + (prevY - event.clientY)

            position.current = {
              x: prevX - (prevX - event.clientX),
              y: prevY - (prevY - event.clientY),
            }

            size.current = {
              width: rect.width - (event.clientX - prevX),
              height: size.current.height,
            }
          }

          draggableRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`
          draggableRef.current.style.width = `${size.current.width}px`
          draggableRef.current.style.height = `${size.current.height}px`

          prevX = event.clientX
          prevY = event.clientY
        }
      }

      const handleMouseUp = () => {
        setIsResizing(false)
        selectedNodes.forEach(node => {
          changePosition({
            id: node.id,
            position: position.current,
          })

          changeSize({
            id: node.id,
            size: size.current,
          })
        })

        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      setIsResizing(true)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  const nodePosition = {
    x: position.current.x,
    y: position.current.y,
  }

  const nodeSize = {
    width: size.current.width,
    height: size.current.height,
  }

  return {
    resizeOnMouseDown,
    isResizing,
    nodePosition,
    nodeSize,
  }
}
