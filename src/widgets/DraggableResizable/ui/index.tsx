'use client'

import { memo, ReactNode, useContext, useEffect } from 'react'
import { useSelectable } from 'react-selectable-box'

import { AnimatedElement } from '@/entities/AnimatedElement'
import { SelectedContext } from '@/shared/context/selected-nodes'
import { cn } from '@/shared/lib/cn-merge'
import { useDraggable } from '../lib/useDraggable'
import { useResizable } from '../lib/useResizable'
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
      onDelete: () => void
      heightResizable?: boolean
      onDragLeave?: (newPosition: { x: number; y: number }) => void
    }
  | {
      id: string
      type: 'advanced'
      heightResizable?: boolean
      children: (params: ChildrenProps) => ReactNode
      onDelete: () => void
      onDragLeave?: (newPosition: { x: number; y: number }) => void
    }

const DraggableResizable = memo(
  ({ onDelete, heightResizable = true, id, ...rest }: Props) => {
    const { selectedNodes, handleSelectNode, setSelectedNodes } =
      useContext(SelectedContext)

    const { draggableRef, dragOnMouseDown } = useDraggable()

    const { setNodeRef } = useSelectable({
      value: { id },
      rule: 'collision',
    })

    const isNodeSelected = selectedNodes.find(
      node => node.id === id || node.id === `${id}_node`,
    )

    const { resizeOnMouseDown, isResizing } = useResizable({
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
        className='absolute left-0 top-0'
        onDoubleClick={() => {
          if (!isNodeSelected)
            handleSelectNode({
              id,
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
          ref={setNodeRef}
        >
          <AnimatedElement
            id={id}
            className={cn(
              'absolute h-full min-h-max w-full break-all',
              isNodeSelected && 'border-2 border-dashed border-opacity-85',
            )}
          >
            <>
              {/* Resize handlers (corners) */}
              <div
                onMouseDown={e => resizeOnMouseDown(e, 'nw')}
                aria-label='resizer-nw'
                className='absolute -left-[2px] -top-[2px] z-10 size-[10px] cursor-nw-resize rounded-full'
              ></div>
              <div
                onMouseDown={e => resizeOnMouseDown(e, 'ne')}
                aria-label='resizer-ne'
                className='absolute -right-[2px] -top-[2px] z-10 size-[10px] cursor-ne-resize rounded-full'
              ></div>
              <div
                onMouseDown={e => resizeOnMouseDown(e, 'se')}
                aria-label='resizer-se'
                className='absolute -bottom-[2px] -right-[2px] z-10 size-[10px] cursor-se-resize rounded-full'
              ></div>
              <div
                onMouseDown={e => resizeOnMouseDown(e, 'sw')}
                aria-label='resizer-sw'
                className='sw absolute -bottom-[0px] -left-[8px] z-10 size-[10px] cursor-sw-resize rounded-full'
              ></div>

              <div id='draggable-resizable-content-container'>
                {rest.type === 'advanced'
                  ? rest.children({ grabbed: !!isNodeSelected, isResizing })
                  : rest.children}
              </div>
            </>
          </AnimatedElement>
        </div>
      </div>
    )
  },
)

DraggableResizable.displayName = 'DraggableResizable'

export { DraggableResizable }
