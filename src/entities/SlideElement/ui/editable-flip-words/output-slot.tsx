import { Dispatch, SetStateAction } from 'react'
import { Edit3 } from 'lucide-react'

import { Button } from '@/shared/ui/bricks/common/Button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/ui/bricks/common/context-menu'
import { FlipWords } from '@/shared/ui/bricks/featured/FlipWords'
import { filterParagraphContent, splitTextPreserveSpans } from '../../lib/utils'

type OutputSlotProps = {
  content: string
  setEditable: Dispatch<SetStateAction<boolean>>
}

export const OutputSlot = ({ content, setEditable }: OutputSlotProps) => {
  const handleSelect = (e: Event) => {
    e.preventDefault()
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className='flex h-full items-center justify-center'
          onDoubleClick={e => {
            e.stopPropagation()
            setEditable(true)
          }}
        >
          <FlipWords
            id='flip-words-editor'
            duration={1}
            words={splitTextPreserveSpans(
              filterParagraphContent(content),
            ).filter(word => word)}
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
