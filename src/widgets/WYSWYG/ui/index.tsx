'use client'

import { memo, useEffect, useState } from 'react'
import { useCurrentAttributes } from '@/shared/hooks/useCurrentAttributes'
import { CustomBubbleMenu } from '@/shared/ui/custom-bubble-menu'
import { BubbleMenuContent } from '@/shared/ui/custom-bubble-menu/ui/Content'
import { Editor, EditorContent } from '@tiptap/react'
import { List, ListOrdered, Palette } from 'lucide-react'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/shared/ui/bricks/common/context-menu'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/ui/bricks/common/toggle-group'
import { cn } from '@/shared/lib/cn-merge'
import classes from './classes.module.css'
import { ColorPicker } from './ColorPicker'
import { FancyRewriter } from './FancyRewriter'

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
  const [paletteOpened, setPaletteOpened] = useState(true)
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
        {editor && (
          <CustomBubbleMenu
            attributes={attributes}
            hide={hideBubbleMenu}
            editor={editor}
          />
        )}
      </ContextMenuTrigger>
      <ContextMenuContent className='w-[215px]'>
        {editor && (
          <BubbleMenuContent
            classNames={{
              container: 'absolute left-0 -top-14',
              trigger: 'p-1 pr-0',
            }}
            editor={editor}
            attributes={attributes}
          />
        )}

        <ContextMenuSub open={paletteOpened} onOpenChange={setPaletteOpened}>
          <ContextMenuSubTrigger className='flex items-center gap-2 pl-5'>
            <Palette className='size-4' /> Set Color
          </ContextMenuSubTrigger>
          <ContextMenuSubContent onPointerDownOutside={console.log}>
            <ContextMenuItem
              className='relative flex-col'
              onSelect={handleSelect}
            >
              {editor && <ColorPicker editor={editor} />}
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem onSelect={handleSelect} inset>
          <ToggleGroup type='single'>
            <ToggleGroupItem
              value='bullet'
              onMouseDownCapture={() => {
                editor
                  ?.chain()
                  .focus()
                  .toggleList('bulletList', 'listItem')
                  .run()
              }}
              className={cn(
                editor?.isActive('bulletList') && 'bg-black bg-opacity-5',
              )}
            >
              <List className='size-4' />
            </ToggleGroupItem>
            <ToggleGroupItem
              value='ordered'
              onMouseDownCapture={() => {
                editor
                  ?.chain()
                  .focus()
                  .toggleList('orderedList', 'listItem')
                  .run()
              }}
              className={cn(
                editor?.isActive('orderedList') && 'bg-black bg-opacity-5',
              )}
            >
              <ListOrdered className='size-4' />
            </ToggleGroupItem>
          </ToggleGroup>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onSelect={handleSelect}>
          {editor && <FancyRewriter editor={editor} />}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
})

WYSWYG.displayName = 'WYSWYG'

export { WYSWYG }
