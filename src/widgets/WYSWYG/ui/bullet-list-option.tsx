import { Editor } from '@tiptap/react'
import { ArrowRight, List } from 'lucide-react'

import { Button } from '@/shared/ui/bricks/common/Button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/ui/bricks/common/hover-card'
import { cn } from '@/shared/lib/cn-merge'
import { bulletListVariants } from '../lib/data'
import { isListActive, removeList } from '../lib/utils'

type Props = {
  editor: Editor
}

export const BulletListOptions = ({ editor }: Props) => {
  return (
    <>
      <Button
        variant='none'
        onMouseDownCapture={() => {
          editor?.chain().focus().toggleList('bulletList', 'listItem').run()
        }}
      >
        <List className='size-4' /> Markers
      </Button>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant='none' size='auto' className='ml-auto'>
            <ArrowRight className='size-4' />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className='absolute -right-[148px] -top-7 z-10 w-40 rounded-md border border-gray-200 bg-white p-2 shadow-sm'>
          <div className='grid grid-cols-2 grid-rows-4 gap-8 px-3'>
            <Button
              disabled={!editor?.isActive('bulletList')}
              variant='none'
              size='auto'
              className='-ml-3 cursor-pointer'
              onMouseDownCapture={() => {
                editor.chain().toggleBulletList().focus().run()
              }}
            >
              <p>None</p>
            </Button>
            {bulletListVariants.map(({ className, style }, index) => (
              <ul
                key={index}
                className={cn('cursor-pointer', className)}
                onMouseDownCapture={() => {
                  if (!isListActive(editor, 'bulletList'))
                    removeList(editor, 'bulletList')

                  editor
                    .chain()
                    .focus()
                    .updateAttributes('bulletList', {
                      style,
                    })
                    .run()
                }}
              >
                <li>____</li>
              </ul>
            ))}
          </div>
        </HoverCardContent>
      </HoverCard>
    </>
  )
}
