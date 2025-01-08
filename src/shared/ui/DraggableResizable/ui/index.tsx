'use client'

import { memo, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { GripVertical } from 'lucide-react'
import { useOnClickOutside } from 'usehooks-ts'

import { cn } from '@/shared/lib/cn-merge'

type Props = {
  children: ReactNode
  initialPosition?: {
    x: number
    y: number
  }
}

export const DraggableResizable = memo(
  ({ children, initialPosition }: Props) => {
    const [initialized, setInitialized] = useState(false)
    const [grabbed, setGrabbed] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [position, setPosition] = useState(initialPosition ?? { x: 0, y: 0 })
    const [size, setSize] = useState({ width: 200, height: 200 })

    const draggableRef = useRef<HTMLDivElement>({} as HTMLDivElement)
    const contentRef = useRef<HTMLDivElement>(null)

    const handleMouseDown = (e: MouseEvent) => {
      const currentEl = e.target as HTMLElement
      const parentEl = currentEl.parentNode as HTMLElement

      if (parentEl) {
        const rect = parentEl.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top

        const handleMouseMove: EventListener = evt => {
          const event = evt as unknown as MouseEvent

          if (draggableRef.current && !isResizing) {
            const newX = event.clientX - offsetX
            const newY = event.clientY - offsetY
            setPosition({ x: newX, y: newY })
          }
        }

        const handleMouseUp = () => {
          setIsDragging(false)
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        }

        setIsDragging(true)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }
    }

    useOnClickOutside(draggableRef || ([] as HTMLElement[]), () => {
      setIsDragging(false)
      setIsResizing(false)
      setGrabbed(false)
    })

    const handleResizeMouseDown = (e: MouseEvent, direction: string) => {
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

            // Resize handlers' logic
            if (direction === 'se') {
              newWidth = rect.width - (prevX - event.clientX)
              newHeight = rect.height - (prevY - event.clientY)
            } else if (direction === 'sw') {
              newWidth = rect.width - (event.clientX - prevX)
              newHeight = rect.height + (event.clientY - prevY)

              setPosition({
                y: position.y,
                x: position.x - (position.x - event.clientX),
              })
            } else if (direction === 'ne') {
              newWidth = rect.width - (prevX - event.clientX)
              newHeight = rect.height + (prevY - event.clientY)
              setPosition({
                x: position.x,
                y: position.y - (position.y - event.clientY),
              })
            } else if (direction === 'nw') {
              newWidth = rect.width + (prevX - event.clientX)
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

    // It's used to update the styles of the draggable element while dragging
    useEffect(() => {
      if (isDragging && draggableRef.current) {
        draggableRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`
      }
    }, [isDragging, draggableRef.current, position.x, position.y])

    // It's used to update the size of the draggable while resizing
    useEffect(() => {
      if (draggableRef.current) {
        draggableRef.current.style.width = `${size.width}px`
        draggableRef.current.style.height = `${size.height}px`
      }
    }, [size.height, size.width, draggableRef.current])

    // It's used to calculate the natural size of the draggable only while mounting
    useEffect(() => {
      if (contentRef.current && draggableRef.current && !initialized) {
        setInitialized(true)

        const child = contentRef.current.children[0] as HTMLElement

        let newSize: { width: number; height: number }

        if (child.tagName === 'IMG') {
          const img = child as HTMLImageElement
          newSize = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          }
        } else {
          const rect = child.getBoundingClientRect()
          newSize = {
            width: Math.max(rect.width, 150),
            height: Math.max(rect.height, 36),
          }
        }

        setSize({
          width: newSize.width,
          height: newSize.height,
        })

        draggableRef.current.style.width = `${newSize.width}px`
        draggableRef.current.style.height = `${newSize.height}px`
      }
    }, [contentRef.current, grabbed, draggableRef.current, initialized])

    return (
      <div
        ref={draggableRef}
        className={cn('absolute inline-block overflow-hidden')}
        aria-label='draggable-resizable'
        onDoubleClick={() => setGrabbed(true)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        <div className={cn(!grabbed && 'pointer-events-none')}>
          <div
            onMouseDown={handleMouseDown}
            className='absolute -left-2 top-1 z-10 cursor-move opacity-0 hover:opacity-100'
            aria-label='draggable-resizable-handler'
          >
            <GripVertical className='opacity-25' size={24} />
          </div>

          <div
            onMouseDown={e => handleResizeMouseDown(e, 'nw')}
            aria-label='draggable-resizable-resizer-nw'
            className='absolute -left-[2px] -top-[2px] z-10 size-[10px] cursor-nw-resize rounded-full'
          ></div>
          <div
            onMouseDown={e => handleResizeMouseDown(e, 'ne')}
            aria-label='draggable-resizable-resizer-ne'
            className='absolute -right-[2px] -top-[2px] z-10 size-[10px] cursor-ne-resize rounded-full'
          ></div>
          <div
            onMouseDown={e => handleResizeMouseDown(e, 'se')}
            aria-label='draggable-resizable-resizer-se'
            className='absolute -bottom-[2px] -right-[2px] z-10 size-[10px] cursor-se-resize rounded-full'
          ></div>
          <div
            onMouseDown={e => handleResizeMouseDown(e, 'sw')}
            aria-label='draggable-resizable-resizer-sw'
            className='sw absolute -bottom-[2px] -left-[2px] z-10 size-[10px] cursor-sw-resize rounded-full'
          ></div>
          <div
            ref={contentRef}
            className={cn(
              'absolute h-full w-full break-all',
              grabbed && 'border-2 border-dashed',
            )}
            aria-label='draggable-resizable-resizer-content'
          >
            {children}
          </div>
        </div>
      </div>
    )
  },
)
