import { ReactNode, useContext, useRef } from 'react'
import { useSelectable } from 'react-selectable-box'

import { Draggable } from '@/features/Draggable'
import { Resizable } from '@/features/Resizable'
import { AnimatedElement } from '@/entities/AnimatedElement'
import { useSlidesStore } from '@/entities/Slide/lib/slide-store-provider'
import { SelectedContext } from '@/shared/context/selected-nodes'
import { cn } from '@/shared/lib/cn-merge'

type Props = {
  id: string
  slideId: string
  contentSlot: ReactNode
}

export const PresentationElement = ({ id, slideId, contentSlot }: Props) => {
  const nodeRef = useRef<HTMLDivElement>({} as HTMLDivElement)
  const { selectedNodes } = useContext(SelectedContext)
  const slidesState = useSlidesStore(state => state)

  const { setNodeRef } = useSelectable({
    value: { id },
    rule: 'collision',
  })

  const isNodeSelected = selectedNodes.find(
    node => node.id === id || node.id === `${id}_node`,
  )

  const handleDragEnd = (
    newPosition: { x: number; y: number },
    newSize?: { width: number; height: number },
  ) => {
    slidesState.adjustPosition(slideId, id, newPosition)
    slidesState.adjustSize(slideId, id, newSize)
  }

  const handleDelete = () => {
    slidesState.removeNodeFromSlide(slideId, id)
  }

  return (
    <div ref={nodeRef} className='absolute h-full'>
      <Draggable
        ref={nodeRef}
        id={id}
        handleDragEnd={handleDragEnd}
        handleDelete={handleDelete}
      >
        <Resizable ref={nodeRef}>
          <AnimatedElement
            id={id}
            disabled={!!isNodeSelected}
            className='absolute h-full w-full'
          >
            <div
              ref={setNodeRef}
              className={cn(
                'h-full min-h-max',
                !!isNodeSelected && 'border-2 border-dashed border-opacity-85',
              )}
            >
              {contentSlot}
            </div>
          </AnimatedElement>
        </Resizable>
      </Draggable>
    </div>
  )
}
