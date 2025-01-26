'use client'

import { memo, useEffect } from 'react'
import { useCurrentAttributes } from '@/shared/hooks/useCurrentAttributes'
import { CustomBubbleMenu } from '@/shared/ui/custom-bubble-menu'
import { BubbleMenuContent } from '@/shared/ui/custom-bubble-menu/ui/Content'
import { Editor, EditorContent } from '@tiptap/react'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/bricks/common/context-menu'
import { editorIsAvailable } from '../lib/utils'
import { BulletListOptions } from './bullet-list-option'
import classes from './classes.module.css'
import { FancyRewriter } from './FancyRewriter'
import { OrderedListOptions } from './ordered-list-option'

type Props = {
  content: string
  editor: Editor | null
  id: string
  hideBubbleMenu?: boolean
}

const handleSelect = (e: Event) => {
  e.preventDefault()
}

const WYSWYG = memo(({ editor, id, hideBubbleMenu }: Props) => {
  const attributes = useCurrentAttributes(editor)

  useEffect(() => {
    if (editor) {
      editor.commands.updateAttributes('paragraph', { id })
    }
  }, [id, editor])

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <EditorContent id={id} className={classes.editor} editor={editor} />

        {editorIsAvailable(editor) && (
          <CustomBubbleMenu
            attributes={attributes}
            hide={hideBubbleMenu}
            editor={editor}
          />
        )}
      </ContextMenuTrigger>
      <ContextMenuContent className='min-w-[215px]'>
        {editorIsAvailable(editor) && (
          <BubbleMenuContent
            classNames={{
              container: 'absolute left-0 -top-20',
              trigger: 'p-1 pr-0',
            }}
            editor={editor}
            attributes={attributes}
          />
        )}

        <ContextMenuItem onSelect={handleSelect}>
          {editorIsAvailable(editor) && <BulletListOptions editor={editor} />}
        </ContextMenuItem>

        <ContextMenuItem onSelect={handleSelect}>
          {editorIsAvailable(editor) && <OrderedListOptions editor={editor} />}
        </ContextMenuItem>
        <ContextMenuSeparator />

        <ContextMenuItem onSelect={handleSelect}>
          {editorIsAvailable(editor) && <FancyRewriter editor={editor} />}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
})

WYSWYG.displayName = 'WYSWYG'

export { WYSWYG }
