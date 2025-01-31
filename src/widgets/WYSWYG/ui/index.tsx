'use client'

import { InputHTMLAttributes, memo, useEffect } from 'react'
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
import { cn } from '@/shared/lib/cn-merge'
import { editorIsAvailable } from '../lib/utils'
import { BulletListOptions } from './bullet-list-option'
import classes from './classes.module.css'
import { FancyRewriter } from './FancyRewriter'
import { OrderedListOptions } from './ordered-list-option'

export type WYSWYGProps = {
  content: string
  editor: Editor | null
  id: string
  hideBubbleMenu?: boolean
  classNames?: Partial<{
    container: string
  }>
  inputProps?: Partial<InputHTMLAttributes<HTMLInputElement>>
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

const handleSelect = (e: Event) => {
  e.preventDefault()
}

const WYSWYG = memo(
  ({
    editor,
    id,
    hideBubbleMenu,
    classNames,
    inputProps,
    features,
  }: WYSWYGProps) => {
    const attributes = useCurrentAttributes(editor)

    useEffect(() => {
      if (editor) {
        editor.commands.updateAttributes('paragraph', { id })
      }
    }, [id, editor])

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <EditorContent
            {...inputProps}
            id={id}
            className={cn(classes.editor, classNames?.container)}
            editor={editor}
          />

          {editorIsAvailable(editor) && (
            <CustomBubbleMenu
              attributes={attributes}
              hide={hideBubbleMenu}
              editor={editor}
              features={features}
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
              features={features}
            />
          )}

          <ContextMenuItem onSelect={handleSelect}>
            {editorIsAvailable(editor) && <BulletListOptions editor={editor} />}
          </ContextMenuItem>

          <ContextMenuItem onSelect={handleSelect}>
            {editorIsAvailable(editor) && (
              <OrderedListOptions editor={editor} />
            )}
          </ContextMenuItem>
          <ContextMenuSeparator />

          <ContextMenuItem onSelect={handleSelect}>
            {editorIsAvailable(editor) && <FancyRewriter editor={editor} />}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  },
)

WYSWYG.displayName = 'WYSWYG'

export { WYSWYG }
