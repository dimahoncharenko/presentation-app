import { useContext, useEffect } from 'react'
import { GripHorizontal, Trash2 } from 'lucide-react'

import { SelectedContext } from '@/shared/context/selected-nodes'
import { cn } from '@/shared/lib/cn-merge'
import { DraggableContext } from '../lib/draggable-context'

type Props = {
  onDelete: () => void
  className?: string
  id: string
  handleDragEnd: (
    newPosition: {
      x: number
      y: number
    },
    newSize?: {
      width: number
      height: number
    },
  ) => void
}

export const DraggableControls = ({
  onDelete,
  className,
  id,
  handleDragEnd,
}: Props) => {
  const { dragOnMouseDown, draggableRef } = useContext(DraggableContext)
  const { selectedNodes } = useContext(SelectedContext)

  const isNodeSelected = selectedNodes.find(
    node => node.id === id || node.id === `${id}_node`,
  )

  useEffect(() => {
    if (draggableRef.current && !isNodeSelected) {
      const { x, y } = draggableRef.current.getBoundingClientRect()
      handleDragEnd({ x, y })
    }
  }, [draggableRef, isNodeSelected])

  return (
    <div
      className={cn(
        'absolute -top-4 z-30 hidden w-full rounded-t-lg bg-white px-1',
        className,
        !!isNodeSelected && 'flex items-center justify-between',
      )}
      id='draggable-resizable-controls'
    >
      <span className='block size-4'></span>
      <div
        onMouseDown={e => {
          dragOnMouseDown(e)
        }}
        className='cursor-move'
        aria-label='draggable-resizable-handler'
      >
        <GripHorizontal className='text-gray-400' size={16} />
      </div>
      <div
        onMouseDown={onDelete}
        className='cursor-pointer'
        aria-label='delete-draggable-resizable'
      >
        <Trash2 className='text-red-400' size={12} />
      </div>
    </div>
  )
}
