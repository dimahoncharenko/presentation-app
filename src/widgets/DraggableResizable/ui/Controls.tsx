import { GripHorizontal, Trash2 } from 'lucide-react'

import { cn } from '@/shared/lib/cn-merge'

type Props = {
  grabbed: boolean
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
  onDelete: () => void
  className?: string
}

export const Controls = ({
  grabbed,
  handleMouseDown,
  onDelete,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        'absolute -top-4 hidden w-full rounded-t-lg bg-white px-1',
        className,
        grabbed && 'flex items-center justify-between',
      )}
      aria-label='draggable-resizable-controls'
    >
      <span className='block size-4'></span>
      <div
        onMouseDown={handleMouseDown}
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
