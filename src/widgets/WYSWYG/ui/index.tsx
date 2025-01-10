'use client'

import { memo, useState } from 'react'
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
} from '@tabler/icons-react'
import { Editor, EditorContent } from '@tiptap/react'
import { Bold, Italic, Underline } from 'lucide-react'

import {
  ContextMenu,
  ContextMenuCheckboxItem,
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
}

const handleSelect = (e: Event) => {
  e.preventDefault()
}

const WYSWYG = memo(({ editor }: Props) => {
  const [paletteOpened, setPaletteOpened] = useState(true)

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <EditorContent className={classes.editor} editor={editor} />
      </ContextMenuTrigger>
      <ContextMenuContent className='w-64'>
        <ContextMenuSub open={paletteOpened} onOpenChange={setPaletteOpened}>
          <ContextMenuSubTrigger inset>Set Color</ContextMenuSubTrigger>
          <ContextMenuSubContent onPointerDownOutside={console.log}>
            <ContextMenuItem
              className='relative flex-col'
              onSelect={handleSelect}
            >
              {editor && <ColorPicker editor={editor} />}
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuItem inset onSelect={handleSelect}>
          <ToggleGroup type='multiple'>
            <ToggleGroupItem
              value='bold'
              aria-label='Toggle bold'
              onMouseDownCapture={() =>
                editor?.chain().focus().toggleBold().run()
              }
              className={cn(
                editor?.isActive('bold') && 'bg-black bg-opacity-5',
              )}
            >
              <Bold className='h-4 w-4' />
            </ToggleGroupItem>
            <ToggleGroupItem
              value='italic'
              aria-label='Toggle italic'
              onMouseDownCapture={() => {
                editor?.chain().focus().toggleItalic().run()
              }}
              className={cn(
                editor?.isActive('italic') && 'bg-black bg-opacity-5',
              )}
            >
              <Italic className='h-4 w-4' />
            </ToggleGroupItem>
            <ToggleGroupItem
              value='underline'
              aria-label='Toggle underline'
              onMouseDownCapture={() => {
                editor?.chain().focus().toggleUnderline().run()
              }}
              className={cn(
                editor?.isActive('underline') && 'bg-black bg-opacity-5',
              )}
            >
              <Underline className='h-4 w-4' />
            </ToggleGroupItem>
          </ToggleGroup>
        </ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Set Font</ContextMenuSubTrigger>
          <ContextMenuSubContent className='w-48'>
            <ContextMenuItem
              onSelect={handleSelect}
              onMouseDownCapture={() => {
                editor?.commands.setFontFamily('Arial')
              }}
            >
              Arial
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={handleSelect}
              onMouseDownCapture={() => {
                editor?.commands.setFontFamily('monospace')
              }}
            >
              Monospace
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={handleSelect}
              onMouseDownCapture={() => {
                editor?.commands.setFontFamily('cursive')
              }}
            >
              Cursive
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={handleSelect}
              onMouseDownCapture={() => {
                editor?.commands.setFontFamily('fantasy')
              }}
            >
              Fantasy
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={handleSelect}
              onMouseDownCapture={() => {
                editor?.commands.setFontFamily('sans-serif')
              }}
            >
              Sans Serif
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={handleSelect}
              onMouseDownCapture={() => {
                editor?.commands.setFontFamily('Geist Mono')
              }}
            >
              Geist Mono
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem onSelect={handleSelect}>
          <ToggleGroup
            defaultValue='left'
            type='single'
            value={editor?.getAttributes('paragraph').textAlign}
            onValueChange={value => {
              switch (value) {
                case 'left':
                  editor?.commands.setTextAlign('left')
                  break
                case 'center':
                  editor?.commands.setTextAlign('center')
                  break
                case 'right':
                  editor?.commands.setTextAlign('right')
                  break
                case 'justify':
                  editor?.commands.setTextAlign('justify')
                  break
                default:
                  break
              }
            }}
          >
            <ToggleGroupItem
              value='left'
              aria-label='Align to the left'
              className={cn(
                editor?.isActive({ textAlign: 'left' }) && 'bg-black',
              )}
            >
              <IconAlignLeft className='h-4 w-4' />
            </ToggleGroupItem>
            <ToggleGroupItem value='center' aria-label='Align to center'>
              <IconAlignCenter className='h-4 w-4' />
            </ToggleGroupItem>
            <ToggleGroupItem value='right' aria-label='Align to the right'>
              <IconAlignRight className='h-4 w-4' />
            </ToggleGroupItem>
            <ToggleGroupItem value='justify' aria-label='Align justified'>
              <IconAlignJustified className='h-4 w-4' />
            </ToggleGroupItem>
          </ToggleGroup>
        </ContextMenuCheckboxItem>

        <ContextMenuItem onSelect={handleSelect}>
          {editor && <FancyRewriter editor={editor} />}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
})

WYSWYG.displayName = 'WYSWYG'

export { WYSWYG }
