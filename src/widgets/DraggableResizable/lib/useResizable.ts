import {
  MouseEvent,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { SelectedContext } from '@/shared/context/selected-nodes'
import {
  assignHeightWithinRange,
  changeElementSize,
  getChild,
  loadNaturalImageSize,
} from './use-draggable-utils'

type Props = {
  draggableRef: React.RefObject<HTMLElement>
  heightResizable?: boolean
}

export const useResizable = ({
  draggableRef,
  heightResizable = true,
}: Props) => {
  const [isResizing, setIsResizing] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const { setSelectDisabled } = useContext(SelectedContext)

  const size = useRef<{ width: number; height: number }>({
    height: 0,
    width: 0,
  })

  const position = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    setSelectDisabled(isResizing)
  }, [isResizing])

  // It's used to calculate the natural size of the element; only while mounting
  useLayoutEffect(() => {
    ;(async () => {
      if (draggableRef.current) {
        const content = getChild(
          draggableRef.current,
          '#draggable-resizable-content-container',
        )

        if (content) {
          const contentChild = content.firstChild as HTMLElement

          if (contentChild.tagName === 'IMG') {
            const img = contentChild as HTMLImageElement
            const maxWidth = 300

            const { height, width } = await loadNaturalImageSize(img)

            const newSize = {
              width: (width * maxWidth) / width,
              height: (height * maxWidth) / width,
            }
            changeElementSize(size, newSize)

            setInitialized(true)
            return
          } else {
            const { width, height } = contentChild.getBoundingClientRect()

            const newSize = {
              width: Math.max(width, 200),
              height: assignHeightWithinRange({
                height,
                minHeight: 50,
              }),
            }

            changeElementSize(size, newSize)

            setInitialized(true)
          }
        }
      }
    })()
  }, [draggableRef])

  useEffect(() => {
    if (draggableRef.current && initialized) {
      const positionX = position.current.x
      const positionY = position.current.y
      const nodeWidth = size.current.width
      const nodeHeight = size.current.height

      draggableRef.current.style.transform = `translate(${positionX || 500}px, ${positionY || 300}px)`
      draggableRef.current.style.width = `${nodeWidth}px`
      draggableRef.current.style.height = `${nodeHeight}px`
    }
  }, [
    draggableRef,
    size.current.height,
    size.current.width,
    position.current.x,
    position.current.y,
    initialized,
  ])

  const resizeOnMouseDown = (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    direction: string,
  ) => {
    const currentEl = e.target as HTMLElement
    const parentEl = currentEl.parentNode as HTMLElement

    setIsResizing(true)

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

        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

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
