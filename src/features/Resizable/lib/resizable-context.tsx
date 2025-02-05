import { createContext, MouseEvent, ReactNode, RefObject } from 'react'

import { useResizable } from './useResizable'

type ResizableContext = {
  resizeOnMouseDown: (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    direction: string,
  ) => void
  isResizing: boolean
  nodePosition: {
    x: number
    y: number
  }
  nodeSize: {
    width: number
    height: number
  }
}

export const ResizableContext = createContext<ResizableContext>(
  {} as ResizableContext,
)

export type ResizableProps = {
  children: ReactNode
  ref: RefObject<HTMLElement>
  heightResizable?: boolean
}

export const ResizableProvider = ({
  children,
  ref,
  heightResizable,
}: ResizableProps) => {
  const resizableProps = useResizable({ draggableRef: ref, heightResizable })
  return (
    <ResizableContext.Provider value={resizableProps}>
      {children}
    </ResizableContext.Provider>
  )
}
