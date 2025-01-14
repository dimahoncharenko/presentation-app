import { EditorWrapper } from '@/shared/ui/EditorWrapper'

import { DraggableResizable } from '@/widgets/DraggableResizable'
import { WYSWYG } from '@/widgets/WYSWYG'
import { SlideText } from '@/entities/SlideElement/model/types'

type Props = {
  element: SlideText
  onChange: (value: string) => void
  onDelete: () => void
  onChangedPosition?: (newPosition: { x: number; y: number }) => void
}

export const EditableText = ({
  element,
  onDelete,
  onChange,
  onChangedPosition,
}: Props) => {
  return (
    <EditorWrapper onChange={onChange} content={element.content}>
      {editor => {
        return (
          <DraggableResizable
            id={element.id}
            onDelete={onDelete}
            type='wyswyg'
            onDragLeave={onChangedPosition}
            wyswygSlot={<WYSWYG content={element.content} editor={editor} />}
            initialPosition={element.position}
          />
        )
      }}
    </EditorWrapper>
  )
}
