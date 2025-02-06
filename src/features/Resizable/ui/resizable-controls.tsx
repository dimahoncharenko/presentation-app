import { useContext } from 'react'

import { ResizableContext } from '../lib/resizable-context'

export const ResizableControls = () => {
  const { resizeOnMouseDown } = useContext(ResizableContext)

  return (
    <div>
      <div
        onMouseDown={e => resizeOnMouseDown(e, 'nw')}
        aria-label='resizer-nw'
        className='absolute -top-[2px] left-0 z-10 size-[10px] cursor-nw-resize rounded-full'
      />
      <div
        onMouseDown={e => resizeOnMouseDown(e, 'ne')}
        aria-label='resizer-ne'
        className='absolute -top-[2px] right-0 z-10 size-[10px] cursor-ne-resize rounded-full'
      />
      <div
        onMouseDown={e => resizeOnMouseDown(e, 'se')}
        aria-label='resizer-se'
        className='absolute -bottom-[4px] right-0 z-10 size-[10px] cursor-se-resize rounded-full'
      />
      <div
        onMouseDown={e => resizeOnMouseDown(e, 'sw')}
        aria-label='resizer-sw'
        className='sw absolute -bottom-[4px] left-0 z-10 size-[10px] cursor-sw-resize rounded-full'
      />
    </div>
  )
}
