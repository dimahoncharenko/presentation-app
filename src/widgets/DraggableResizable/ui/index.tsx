'use client'

import { memo, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

import { SelectedContext } from '@/shared/context/selected-nodes'
import { cn } from '@/shared/lib/cn-merge'
import { useDraggable } from '../lib/useDraggable'
import { useResizable } from '../lib/useResizable'
import { Controls } from './Controls'

type ChildrenProps = {
  grabbed: boolean
}

type Props =
  | {
      id: string
      type: 'common'
      children: ReactNode
      initialPosition?: {
        x: number
        y: number
      }
      onDelete: () => void
      heightResizable?: boolean
      onDragLeave?: (newPosition: { x: number; y: number }) => void
      handleDragAll?: (params: { deltaX: number; deltaY: number }) => void
    }
  | {
      id: string
      type: 'advanced'
      heightResizable?: boolean
      children: (params: ChildrenProps) => ReactNode
      initialPosition?: {
        x: number
        y: number
      }
      onDelete: () => void
      onDragLeave?: (newPosition: { x: number; y: number }) => void
      handleDragAll?: (params: { deltaX: number; deltaY: number }) => void
    }

const DraggableResizable = memo(
  ({ initialPosition, onDelete, heightResizable = true, ...rest }: Props) => {
    const [grabbed, setGrabbed] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)
    const { selectedNodes, handleSelectNode } = useContext(SelectedContext)

    const { draggableRef, dragOnMouseDown, position, adjustPosition } =
      useDraggable({
        initialPosition,
      })

    const { resizeOnMouseDown, size } = useResizable({
      draggableRef,
      position,
      setPosition: adjustPosition,
      contentRef,
      heightResizable,
    })

    const isSelected = selectedNodes.find(
      nodeId => nodeId === rest.id || nodeId === rest.id + '_node',
    )

    // TODO: If was clicked outside of selected nodes, then clear selection
    // useEffect(() => {
    //   const handleDbl = (event: MouseEvent) => {
    //     const node = event.target as HTMLElement

    //     if (!node.id) {
    //       setSelectedNodes(() => [])
    //       !selectedNodes.length && setGrabbed(false)
    //     }
    //   }

    //   window.addEventListener('dblclick', handleDbl)

    //   return () => {
    //     window.removeEventListener('dblclick', handleDbl)
    //   }
    // }, [])

    useEffect(() => {
      if (selectedNodes.length > 0 && isSelected) {
        setGrabbed(true)
      } else if (selectedNodes.length > 0 && !isSelected) {
        setGrabbed(false)
      }
    }, [selectedNodes.length])

    useOnClickOutside(draggableRef || ([] as HTMLElement[]), () => {
      // Disable dragging/resizing and editing the element when clicked outside
      setGrabbed(false)
    })

    useEffect(() => {
      if (!grabbed) {
        if (rest.onDragLeave) {
          const deltaX = position.x - (initialPosition?.x ?? 0)
          const deltaY = position.y - (initialPosition?.y ?? 0)

          console.log(deltaX, deltaY)

          rest.handleDragAll?.({ deltaX: deltaX, deltaY: deltaY })
          rest.onDragLeave(position)
        }
      }
    }, [grabbed])

    return (
      <div
        id={rest.id}
        ref={draggableRef}
        className='absolute inline-block'
        aria-label='draggable-resizable'
        onDoubleClick={e => {
          if (e.ctrlKey) handleSelectNode(rest.id)
          setGrabbed(true)
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        <Controls
          grabbed={grabbed}
          handleMouseDown={e => {
            dragOnMouseDown(e)
          }}
          onDelete={() => {
            onDelete()
          }}
        />
        <div
          className={cn(
            'relative h-full w-full',
            !grabbed && 'pointer-events-none',
          )}
        >
          <div
            className={cn(
              'absolute h-full min-h-max w-full break-all',
              grabbed && 'border-2 border-dashed border-opacity-85',
            )}
          >
            {/* Resize handlers (corners) */}
            <div
              onMouseDown={e => resizeOnMouseDown(e, 'nw')}
              aria-label='draggable-resizable-resizer-nw'
              className='absolute -left-[2px] -top-[2px] z-10 size-[10px] cursor-nw-resize rounded-full'
            ></div>
            <div
              onMouseDown={e => resizeOnMouseDown(e, 'ne')}
              aria-label='draggable-resizable-resizer-ne'
              className='absolute -right-[2px] -top-[2px] z-10 size-[10px] cursor-ne-resize rounded-full'
            ></div>
            <div
              onMouseDown={e => resizeOnMouseDown(e, 'se')}
              aria-label='draggable-resizable-resizer-se'
              className='absolute -bottom-[2px] -right-[2px] z-10 size-[10px] cursor-se-resize rounded-full'
            ></div>
            <div
              onMouseDown={e => resizeOnMouseDown(e, 'sw')}
              aria-label='draggable-resizable-resizer-sw'
              className='sw absolute -bottom-[0px] -left-[8px] z-10 size-[10px] cursor-sw-resize rounded-full'
            ></div>

            {/* Resizer content */}
            <div
              ref={contentRef}
              aria-label='draggable-resizable-resizer-content'
            >
              {rest.type === 'advanced'
                ? rest.children({ grabbed })
                : rest.children}
            </div>
          </div>
        </div>
      </div>
    )
  },
)

DraggableResizable.displayName = 'DraggableResizable'

export { DraggableResizable }
