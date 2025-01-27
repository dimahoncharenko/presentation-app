import { useEffect, useState } from 'react'
import { EditorWrapper } from '@/shared/ui/EditorWrapper'
import { Check, Edit3 } from 'lucide-react'

import { WYSWYG } from '@/widgets/WYSWYG'
import { Button } from '@/shared/ui/bricks/common/Button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/ui/bricks/common/context-menu'
import { FlipWords } from '@/shared/ui/bricks/featured/FlipWords'
import { filterParagraphContent } from '../lib/utils'

type Props = {
  handleSubmit: (value: string) => void
  initialValue: string
}

export const EditableFlipWords = ({ handleSubmit, initialValue }: Props) => {
  const [editable, setEditable] = useState(true)
  const [words, setWords] = useState(initialValue)

  useEffect(() => {
    const handleDblClick = (e: MouseEvent) => {
      const node = e.target as HTMLElement

      if (node.dataset['backgroundVideoMuted']) {
        setEditable(false)
      }
    }

    window.addEventListener('dblclick', handleDblClick)

    return () => {
      window.removeEventListener('dblclick', handleDblClick)
    }
  }, [])

  if (editable) {
    return (
      <EditorWrapper content={words} onChange={setWords}>
        {editor => {
          return (
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
                content={words}
                id='flip-words-editor'
              />
              <Button
                variant='none'
                size='auto'
                className='ml-auto mr-1 hover:text-green-300'
                onClick={() => {
                  handleSubmit(words)
                  setEditable(false)
                }}
              >
                <Check />
              </Button>
            </div>
          )
        }}
      </EditorWrapper>
    )
  }

  const handleSelect = (e: Event) => {
    e.preventDefault()
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className='flex h-full items-center justify-center'
          onDoubleClick={() => {
            setEditable(true)
          }}
        >
          <FlipWords
            id='flip-words-editor'
            duration={1}
            words={filterParagraphContent(words).split('##')}
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className='min-w-[215px]'>
        <ContextMenuItem onSelect={handleSelect}>
          <Button variant='none' size='auto' onClick={() => setEditable(true)}>
            <Edit3 className='size-4' /> Edit content
          </Button>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
