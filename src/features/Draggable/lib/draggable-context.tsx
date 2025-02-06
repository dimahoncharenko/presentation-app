import {
  createContext,
  Dispatch,
  MouseEvent,
  RefObject,
  SetStateAction,
} from 'react'

import { useDraggable } from './useDraggable'

type DraggableContext = {
  isDragging: boolean
  setIsDragging: Dispatch<SetStateAction<boolean>>
  dragOnMouseDown: (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
  ) => void
  draggableRef: RefObject<HTMLElement>
}

export const DraggableContext = createContext<DraggableContext>(
  {} as DraggableContext,
)

type Props = {
  children: React.ReactNode
  ref: RefObject<HTMLElement>
}

export const DraggableProvider = ({ children, ref }: Props) => {
  const draggableProps = useDraggable({ ref })

  return (
    <DraggableContext.Provider value={draggableProps}>
      {children}
    </DraggableContext.Provider>
  )
}
