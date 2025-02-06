import { ReactNode, RefObject } from 'react'

import { DraggableProvider } from '../lib/draggable-context'
import { DraggableControls } from './draggable-controls'

type Props = {
  children: ReactNode
  ref: RefObject<HTMLDivElement>
  id: string
  handleDelete: () => void
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

export const Draggable = ({
  ref,
  children,
  id,
  handleDragEnd,
  handleDelete,
}: Props) => {
  return (
    <DraggableProvider ref={ref}>
      <DraggableControls
        handleDragEnd={handleDragEnd}
        id={id}
        onDelete={handleDelete}
        className='-left-[2px] -top-[18px] w-[calc(100%+3.5px)]'
      />
      {children}
    </DraggableProvider>
  )
}
