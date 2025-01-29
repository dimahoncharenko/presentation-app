'use client'

import { memo, ReactNode, useContext, useEffect, useRef } from 'react'

import { SlideElement } from '@/entities/SlideElement'
import { SelectedContext } from '@/shared/context/selected-nodes'
import { cn } from '@/shared/lib/cn-merge'
import { useDraggable } from '../lib/useDraggable'
import { useResizableMultiple } from '../lib/useResizable'
import { Controls } from './Controls'

type ChildrenProps = {
  grabbed: boolean
  isResizing: boolean
}

type Props =
  | {
      id: string
      type: 'common'
      children: ReactNode
      initialPosition: {
        x: number
        y: number
      }
      initialNodeParams?: {
        position: SlideElement['position']
        size: SlideElement['size']
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
      initialPosition: {
        x: number
        y: number
      }
      initialNodeParams?: {
        position: SlideElement['position']
        size: SlideElement['size']
      }
      onDelete: () => void
      onDragLeave?: (newPosition: { x: number; y: number }) => void
      handleDragAll?: (params: { deltaX: number; deltaY: number }) => void
    }

const DraggableResizable = memo(
  ({
    initialPosition,
    onDelete,
    initialNodeParams,
    heightResizable = true,
    id,
    ...rest
  }: Props) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const { selectedNodes, handleSelectNode, setSelectedNodes } =
      useContext(SelectedContext)

    const { draggableRef, dragOnMouseDown } = useDraggable({
      initialPosition,
    })

    const isNodeSelected = selectedNodes.find(
      node => node.id === id || node.id === `${id}_node`,
    )

    const { resizeOnMouseDown, isResizing } = useResizableMultiple({
      draggableRef,
      heightResizable,
    })

    // If was clicked outside of selected nodes, then clear selection
    useEffect(() => {
      const handleDbl = (event: MouseEvent) => {
        const node = event.target as HTMLElement
        if (rest.onDragLeave && !node.id) {
          rest.onDragLeave({
            x: event.clientX,
            y: event.clientY,
          })

          setSelectedNodes(() => [])
        }
      }

      window.addEventListener('dblclick', handleDbl)

      return () => {
        window.removeEventListener('dblclick', handleDbl)
      }
    }, [])

    return (
      <div
        id={id}
        ref={draggableRef}
        className='absolute left-0 top-0 inline-block'
        aria-label='draggable-resizable'
        onDoubleClick={() => {
          if (!isNodeSelected)
            handleSelectNode({
              id,
              position: {
                x: initialPosition.x,
                y: initialPosition.y,
              },
              size: {
                width: initialNodeParams?.size?.width ?? 0,
                height: initialNodeParams?.size?.height ?? 0,
              },
            })
        }}
      >
        <Controls
          grabbed={!!isNodeSelected}
          handleMouseDown={dragOnMouseDown}
          onDelete={onDelete}
        />
        <div
          className={cn(
            'relative h-full w-full',
            !isNodeSelected && 'pointer-events-none',
          )}
        >
          <div
            className={cn(
              'absolute h-full min-h-max w-full break-all',
              isNodeSelected && 'border-2 border-dashed border-opacity-85',
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
              id='draggable-resizable-content-container'
              ref={contentRef}
              aria-label='draggable-resizable-resizer-content'
            >
              {rest.type === 'advanced'
                ? rest.children({ grabbed: !!isNodeSelected, isResizing })
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
