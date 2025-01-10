import { EditorWrapper } from '@/shared/ui/EditorWrapper'

import { DraggableResizable } from '@/widgets/DraggableResizable'
import { WYSWYG } from '@/widgets/WYSWYG'
import { SlideText } from '@/entities/SlideElement/model/types'

type Props = {
  element: SlideText
  onChange: (value: string) => void
  onDelete: () => void
}

export const EditableText = ({ element, onDelete, onChange }: Props) => {
  return (
    <EditorWrapper onChange={onChange} content={element.content}>
      {editor => {
        return (
          <DraggableResizable
            onDelete={onDelete}
            type='wyswyg'
            wyswygSlot={<WYSWYG content={element.content} editor={editor} />}
            initialPosition={element.spacing}
          />
        )
      }}
    </EditorWrapper>
  )
}
