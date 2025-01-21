'use client'

import { memo, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

import { SlideElement } from '@/entities/SlideElement'
import { SelectedContext } from '@/shared/context/selected-nodes'
import { cn } from '@/shared/lib/cn-merge'
import { useDraggable } from '../lib/useDraggable'
import { useResizable } from '../lib/useResizable'
import { useResizableMultiple } from '../lib/useResizableMultiple'
import { Controls } from './Controls'

type ChildrenProps = {
  grabbed: boolean
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
    ...rest
  }: Props) => {
    const [grabbed, setGrabbed] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)
    const {
      selectedNodes,
      handleSelectNode,
      changePosition,
      setSelectedNodes,
    } = useContext(SelectedContext)

    const [blockedDragging, setBlockedDragging] = useState(false)

    const { draggableRef, dragOnMouseDown } = useDraggable({
      disabled: blockedDragging,
    })

    const { resizeOnMouseDown, isResizing } = useResizableMultiple({
      draggableRef,
      contentRef,
      heightResizable,
    })

    useEffect(() => {
      console.log('RESIZING: ', isResizing)

      if (isResizing) {
        setBlockedDragging(true)
      } else {
        setBlockedDragging(false)
      }
    }, [isResizing])

    const isSelected = selectedNodes.find(
      node => node.id === rest.id || node.id === rest.id + '_node',
    )

    // If was clicked outside of selected nodes, then clear selection
    useEffect(() => {
      const handleDbl = (event: MouseEvent) => {
        const node = event.target as HTMLElement

        if (!node.id) {
          setSelectedNodes(() => [])
          if (!selectedNodes.length) setGrabbed(false)
        }
      }

      window.addEventListener('dblclick', handleDbl)

      return () => {
        window.removeEventListener('dblclick', handleDbl)
      }
    }, [])

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
      if (isSelected && !grabbed) {
        if (rest.onDragLeave) {
          rest.onDragLeave(isSelected.position)
        }
      }
    }, [grabbed, isSelected])

    const newX = isSelected?.position.x
    const newY = isSelected?.position.y

    const newWidth = isSelected?.size?.width
    const newHeight = isSelected?.size?.height

    return (
      <div
        id={rest.id}
        ref={draggableRef}
        className='absolute inline-block'
        aria-label='draggable-resizable'
        onDoubleClick={e => {
          if (e.ctrlKey || selectedNodes.length < 1)
            handleSelectNode({
              id: rest.id,
              position: {
                x: initialPosition.x,
                y: initialPosition.y,
              },
              size: {
                width: initialNodeParams?.size?.width ?? 0,
                height: initialNodeParams?.size?.height ?? 0,
              },
            })
          setGrabbed(true)
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `translate(${newX ?? initialPosition.x}px, ${newY ?? initialPosition.y}px)`,
          width: `${newWidth ?? initialNodeParams?.size?.width ?? 200}px`,
          height: `${newHeight ?? initialNodeParams?.size?.width ?? 40}px`,
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
