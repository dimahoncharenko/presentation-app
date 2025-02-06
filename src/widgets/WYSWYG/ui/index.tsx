'use client'

import { InputHTMLAttributes, memo, useContext, useEffect } from 'react'
import { useCurrentAttributes } from '@/shared/hooks/useCurrentAttributes'
import { CustomBubbleMenu } from '@/shared/ui/custom-bubble-menu'
import { BubbleMenuContent } from '@/shared/ui/custom-bubble-menu/ui/Content'
import { Editor } from '@tiptap/react'

import { RichEdit } from '@/entities/RichEdit'
import { Button } from '@/shared/ui/bricks/common/Button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/bricks/common/context-menu'
import { AppStateContext } from '@/shared/context/app-state-context'
import { editorIsAvailable } from '../lib/utils'
import { BulletListOptions } from './bullet-list-option'
import { FancyRewriter } from './FancyRewriter'
import { OrderedListOptions } from './ordered-list-option'

export type WYSWYGProps = {
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
  contextMenu?: Partial<{
    bulletList: boolean
    orderedList: boolean
    magicPrompt: boolean
  }>
}

const handleSelect = (e: Event) => {
  e.preventDefault()
}

const removeTextSelection = (editor: Editor | null) => {
  editor?.commands.blur()
}

const WYSWYG = memo(
  ({
    editor,
    id,
    hideBubbleMenu,
    classNames,
    inputProps,
    features,
    contextMenu = {
      bulletList: true,
      orderedList: true,
      magicPrompt: true,
    },
  }: WYSWYGProps) => {
    const attributes = useCurrentAttributes(editor)
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      animated: [_, { addAnimation }],
    } = useContext(AppStateContext)

    useEffect(() => {
      if (hideBubbleMenu) removeTextSelection(editor)
    }, [hideBubbleMenu])

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <RichEdit
            editor={editor}
            id={id}
            inputProps={{ ...inputProps }}
            classNames={{ container: classNames?.container }}
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

          {contextMenu.bulletList && (
            <ContextMenuItem onSelect={handleSelect}>
              {editorIsAvailable(editor) && (
                <BulletListOptions editor={editor} />
              )}
            </ContextMenuItem>
          )}

          {contextMenu.orderedList && (
            <>
              <ContextMenuItem onSelect={handleSelect}>
                {editorIsAvailable(editor) && (
                  <OrderedListOptions editor={editor} />
                )}
              </ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}

          {contextMenu.magicPrompt && (
            <ContextMenuItem onSelect={handleSelect}>
              {editorIsAvailable(editor) && <FancyRewriter editor={editor} />}
            </ContextMenuItem>
          )}
          <ContextMenuItem onSelect={handleSelect}>
            <Button
              variant='none'
              onClick={() => {
                addAnimation(id, 'pulse')
              }}
            >
              Fade
            </Button>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  },
)

WYSWYG.displayName = 'WYSWYG'

export { WYSWYG }
