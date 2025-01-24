import { EditorWrapper } from '@/shared/ui/EditorWrapper'

import { DraggableResizable } from '@/widgets/DraggableResizable'
import { WYSWYG } from '@/widgets/WYSWYG'
import { SlideText } from '@/entities/SlideElement/model/types'

type Props = {
  element: SlideText
  onChange: (value: string) => void
  onDelete: () => void
  onChangedPosition?: (newPosition: { x: number; y: number }) => void
  handleDragAll?: (params: { deltaX: number; deltaY: number }) => void
}

export const EditableText = ({
  element,
  onDelete,
  onChange,
  onChangedPosition,
  handleDragAll,
}: Props) => {
  return (
    <EditorWrapper onChange={onChange} content={element.content}>
      {editor => {
        return (
          <DraggableResizable
            id={element.id}
            onDelete={onDelete}
            type='advanced'
            onDragLeave={onChangedPosition}
            initialPosition={element.position}
            handleDragAll={handleDragAll}
            initialNodeParams={{
              position: element.position,
              size: {
                height: element.size?.height ?? 0,
                width: element.size?.width ?? 0,
              },
            }}
          >
            {({ grabbed }) => (
              <WYSWYG
                id={element.id + '_node'}
                content={element.content}
                editor={editor}
                grabbed={grabbed}
              />
            )}
          </DraggableResizable>
        )
      }}
    </EditorWrapper>
  )
}
