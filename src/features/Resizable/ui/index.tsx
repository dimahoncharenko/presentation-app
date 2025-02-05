import { ResizableProps, ResizableProvider } from '../lib/resizable-context'

export const Resizable = ({
  children,
  ref,
  heightResizable,
}: ResizableProps) => {
  return (
    <ResizableProvider ref={ref} heightResizable={heightResizable}>
      {children}
    </ResizableProvider>
  )
}
