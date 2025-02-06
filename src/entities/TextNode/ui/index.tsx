import { useContext } from 'react'
import { EditorWrapper } from '@/shared/ui/EditorWrapper'

import { WYSWYG } from '@/widgets/WYSWYG'
import { ResizableContext } from '@/features/Resizable/lib/resizable-context'
import { SelectedContext } from '@/shared/context/selected-nodes'

type Props = {
  id: string
  initialValue: string
  handleChange: (value: string) => void
}

export const TextNode = ({ handleChange, id, initialValue }: Props) => {
  const { selectedNodes } = useContext(SelectedContext)
  const { isResizing } = useContext(ResizableContext)

  const isNodeSelected = selectedNodes.find(
    node => node.id === id || node.id === `${id}_node`,
  )

  return (
    <EditorWrapper onChange={handleChange} content={initialValue}>
      {editor => {
        return (
          <WYSWYG
            id={`${id}_node`}
            editor={editor}
            hideBubbleMenu={isResizing || !isNodeSelected}
          />
        )
      }}
    </EditorWrapper>
  )
}
