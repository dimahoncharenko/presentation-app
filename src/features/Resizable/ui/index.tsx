import { ResizableProps, ResizableProvider } from '../lib/resizable-context'
import { ResizableControls } from './resizable-controls'

export const Resizable = ({
  children,
  ref,
  heightResizable,
}: ResizableProps) => {
  return (
    <ResizableProvider ref={ref} heightResizable={heightResizable}>
      <ResizableControls />
      {children}
    </ResizableProvider>
  )
}
