import { Dispatch, SetStateAction } from 'react'
import { EditorWrapper } from '@/shared/ui/EditorWrapper'
import { Check } from 'lucide-react'

import { WYSWYG } from '@/widgets/WYSWYG'
import { Button } from '@/shared/ui/bricks/common/Button'

type InputSlotProps = {
  setContent: Dispatch<SetStateAction<string>>
  setEditable: Dispatch<SetStateAction<boolean>>
  handleSubmit: (value: string) => void
  content: string
}

export const InputSlot = ({
  content,
  setContent,
  handleSubmit,
  setEditable,
}: InputSlotProps) => {
  return (
    <EditorWrapper content={content} onChange={setContent}>
      {editor => (
        <div className='flex'>
          <WYSWYG
            editor={editor}
            id='highlight-text-editor'
            contextMenu={{
              bulletList: false,
              magicPrompt: true,
              orderedList: false,
            }}
            features={{
              align: false,
              bold: true,
              color: true,
              font: true,
              highlight: false,
              indent: false,
              justify: false,
              italic: true,
              size: true,
              underline: true,
            }}
          />
          <Button
            variant='none'
            size='auto'
            className='ml-auto mr-1 hover:text-green-300'
            onClick={() => {
              handleSubmit(content)
              setEditable(false)
            }}
          >
            <Check />
          </Button>
        </div>
      )}
    </EditorWrapper>
  )
}
