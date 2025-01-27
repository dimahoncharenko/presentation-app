import { CurrentAttributes } from '@/shared/hooks/useCurrentAttributes'
import { BubbleMenu, Editor } from '@tiptap/react'

import { cn } from '@/shared/lib/cn-merge'
import { BubbleMenuContent } from './Content'

type Props = {
  editor: Editor
  hide?: boolean
  attributes: CurrentAttributes
  features?: Partial<{
    align: boolean
    highlight: boolean
    size: boolean
    font: boolean
    color: boolean
    indent: boolean
    justify: boolean
    bold: boolean
    italic: boolean
    underline: boolean
  }>
}

export const CustomBubbleMenu = ({
  editor,
  hide,
  attributes,
  features,
}: Props) => {
  return (
    <BubbleMenu
      editor={editor}
      className={cn('min-w-[215px]', hide && 'hidden')}
    >
      <BubbleMenuContent
        features={features}
        editor={editor}
        classNames={{
          trigger: 'p-1 pr-0',
        }}
        attributes={attributes}
      />
    </BubbleMenu>
  )
}
