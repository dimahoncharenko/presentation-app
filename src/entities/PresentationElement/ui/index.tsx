import { RefObject, useContext, useRef } from 'react'

import { Draggable } from '@/features/Draggable'
import { DraggableContext } from '@/features/Draggable/lib/draggable-context'
import { Controls } from '@/features/Draggable/ui/Controls'
import { Resizable } from '@/features/Resizable'
import { AnimatedElement } from '@/entities/AnimatedElement'
import { SelectedContext } from '@/shared/context/selected-nodes'
import { cn } from '@/shared/lib/cn-merge'

type Props = {
  id: string
}

export const PresentationElement = ({ id }: Props) => {
  const nodeRef = useRef<HTMLDivElement>({} as HTMLDivElement)

  return (
    <Draggable ref={nodeRef}>
      <AnimatedElement id={id}>
        <Resizable ref={nodeRef}>
          <TextElement ref={nodeRef} id={id} />
        </Resizable>
      </AnimatedElement>
    </Draggable>
  )
}

type TextElementProps = {
  id: string
  ref: RefObject<HTMLDivElement>
}

const TextElement = ({ id, ref }: TextElementProps) => {
  const { dragOnMouseDown } = useContext(DraggableContext)
  const { selectedNodes, handleSelectNode } = useContext(SelectedContext)

  const isNodeSelected = selectedNodes.find(
    node => node.id === id || node.id === `${id}_node`,
  )

  return (
    <div
      ref={ref}
      className={cn(
        'absolute',
        !!isNodeSelected && 'border-2 border-dashed border-opacity-85',
      )}
      onDoubleClick={() => {
        if (!isNodeSelected)
          handleSelectNode({
            id,
          })
      }}
    >
      <Controls
        grabbed={!!isNodeSelected}
        handleMouseDown={dragOnMouseDown}
        onDelete={console.log}
        className='-left-[2px] -top-[18px] w-[calc(100%+3.5px)]'
      />
      <p aria-label='element-content' className='!m-0'>
        Text
      </p>
    </div>
  )
}
