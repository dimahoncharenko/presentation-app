import { ReactNode, RefObject } from 'react'

import { DraggableProvider } from '../lib/draggable-context'
import { Controls } from './Controls'

type Props = {
  children: ReactNode
  ref: RefObject<HTMLDivElement>
}

export const Draggable = ({ ref, children }: Props) => {
  return <DraggableProvider ref={ref}>{children}</DraggableProvider>
}
