import { Editor } from '@tiptap/react'
import { ArrowRight, ListOrdered } from 'lucide-react'

import { Button } from '@/shared/ui/bricks/common/Button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/ui/bricks/common/hover-card'
import { cn } from '@/shared/lib/cn-merge'
import { orderedListVariants } from '../lib/data'
import { isListActive, removeList } from '../lib/utils'

type Props = {
  editor: Editor
}

export const OrderedListOptions = ({ editor }: Props) => {
  return (
    <>
      <Button
        variant='none'
        onMouseDownCapture={() => {
          editor
            .chain()
            .focus()
            .toggleList('orderedList', 'listItem')
            .updateAttributes('orderedList', {
              style: { listStyle: 'decimal' },
            })
            .run()
        }}
      >
        <ListOrdered className='size-4' /> Enumeration
      </Button>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant='none' size='auto' className='ml-auto'>
            <ArrowRight className='size-4' />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className='absolute -right-[148px] -top-7 z-10 w-32 rounded-md border border-gray-200 bg-white p-2 shadow-sm'>
          <div className='grid grid-cols-2 grid-rows-4 gap-x-8 px-3'>
            <Button
              disabled={!editor?.isActive('orderedList')}
              variant='none'
              size='auto'
              className='-ml-3 cursor-pointer'
              onMouseDownCapture={() => {
                editor.chain().toggleOrderedList().focus().run()
              }}
            >
              <p>None</p>
            </Button>
            {orderedListVariants.map((style, index) => (
              <ol
                key={index}
                className={cn('cursor-pointer', style.className)}
                onMouseDownCapture={() => {
                  if (!isListActive(editor, 'orderedList'))
                    removeList(editor, 'orderedList')

                  editor
                    .chain()
                    .focus()
                    .updateAttributes('orderedList', {
                      style: `list-style-type: ${style.name};`,
                    })
                    .run()
                }}
              >
                <li>____</li>
              </ol>
            ))}
          </div>
        </HoverCardContent>
      </HoverCard>
    </>
  )
}
