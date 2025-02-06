import { Dispatch, SetStateAction } from 'react'
import Image from 'next/image'
import { EditorWrapper } from '@/shared/ui/EditorWrapper'
import { Check } from 'lucide-react'

import { WYSWYG } from '@/widgets/WYSWYG'
import { Button } from '@/shared/ui/bricks/common/Button'
import { filterParagraphContent, splitText } from '../../lib/utils'

type InputSlotProps = {
  setContent: Dispatch<SetStateAction<string>>
  setEditable: Dispatch<SetStateAction<boolean>>
  handleSubmit: (value: string) => void
  content: string
}

export const InputSlot = ({
  setEditable,
  setContent,
  content,
  handleSubmit,
}: InputSlotProps) => {
  return (
    <div>
      <EditorWrapper content={content} onChange={setContent}>
        {editor => {
          return (
            <div className='relative'>
              <div className='left-0 flex'>
                <WYSWYG
                  features={{
                    bold: false,
                    indent: false,
                    italic: false,
                    underline: false,
                    align: false,
                    justify: false,
                    color: true,
                    font: true,
                    highlight: true,
                    size: true,
                  }}
                  classNames={{
                    container: 'flex',
                  }}
                  editor={editor}
                  id='flip-words-editor'
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
                <Button
                  variant='none'
                  size='auto'
                  className='mr-1'
                  onClick={() => {
                    if (!editor) return
                    editor
                      .chain()
                      .focus()
                      .setMark('textStyle', {
                        class: 'split',
                      })
                      .run()
                  }}
                >
                  <Image
                    width={16}
                    height={16}
                    src='/icons/separate.svg'
                    alt='Separate words'
                  />
                </Button>
              </div>
            </div>
          )
        }}
      </EditorWrapper>
      <div className='pointer-events-none absolute -bottom-[2rem] flex max-w-full flex-wrap items-start gap-1'>
        {splitText(filterParagraphContent(content)).map((word, index) => (
          <p
            key={index}
            className='!m-0 whitespace-pre rounded-md bg-neutral-300 p-1 text-sm'
          >
            {word}
          </p>
        ))}
      </div>
    </div>
  )
}
