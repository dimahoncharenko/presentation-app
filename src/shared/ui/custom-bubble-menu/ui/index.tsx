import { CurrentAttributes } from '@/shared/hooks/useCurrentAttributes'
import { BubbleMenu, Editor } from '@tiptap/react'

import { cn } from '@/shared/lib/cn-merge'
import { BubbleMenuContent } from './Content'

type Props = {
  editor: Editor
  hide?: boolean
  attributes: CurrentAttributes
}

export const CustomBubbleMenu = ({ editor, hide, attributes }: Props) => {
  return (
    <BubbleMenu
      editor={editor}
      className={cn('max-w-[215px]', hide && 'hidden')}
    >
      <BubbleMenuContent
        editor={editor}
        classNames={{
          trigger: 'p-1 pr-0',
        }}
        attributes={attributes}
      />
    </BubbleMenu>
  )
}
