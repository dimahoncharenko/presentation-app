import { CurrentAttributes } from '@/shared/hooks/useCurrentAttributes'
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
} from '@tabler/icons-react'
import { Editor } from '@tiptap/react'
import {
  AArrowDown,
  AArrowUp,
  Bold,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Underline,
} from 'lucide-react'

import { ColorPicker } from '@/widgets/WYSWYG/ui/ColorPicker'
import { cn } from '@/shared/lib/cn-merge'
import { Button } from '../../bricks/common/Button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../bricks/common/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../bricks/common/select'
import { ToggleGroup, ToggleGroupItem } from '../../bricks/common/toggle-group'
import { sizes } from '../lib/data'
import { HighlightText } from './HighlightText'

type Props = {
  editor: Editor
  classNames?: Partial<{
    container: string
    trigger: string
  }>
  attributes: CurrentAttributes
}

export const BubbleMenuContent = ({
  editor,
  classNames,
  attributes,
}: Props) => {
  const currentFontSizeIndex = sizes.findIndex(
    s => s === attributes.currentFontSize,
  )

  return (
    <div
      className={cn(
        'flex flex-wrap gap-[2px] rounded-sm border bg-white p-[2px]',
        classNames?.container,
      )}
    >
      <Select
        value={attributes.currentFontFamily}
        onValueChange={value => {
          editor?.chain().focus().setFontFamily(value).run()
        }}
      >
        <SelectTrigger
          className={cn(
            'h-[20px] min-w-[85px] max-w-max rounded-sm',
            classNames?.trigger,
          )}
        >
          <SelectValue placeholder={attributes.currentFontFamily} />
        </SelectTrigger>
        <SelectContent>
          {[
            'Arial',
            'monospace',
            'cursive',
            'fantasy',
            'sans-serif',
            'Geist Mono',
            'Lato',
          ].map((font, index) => (
            <SelectItem key={index} value={font}>
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={attributes.currentFontSize}
        onValueChange={value => {
          editor?.chain().focus().setFontSize(value).run()
        }}
      >
        <SelectTrigger
          className={cn(
            'h-[20px] max-w-max rounded-sm p-0 px-[1px]',
            classNames?.trigger,
          )}
        >
          <SelectValue placeholder={attributes.currentFontSize} />
        </SelectTrigger>
        <SelectContent>
          {sizes.map((size, index) => (
            <SelectItem key={index} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className='flex gap-[2px] px-1'>
        <Button
          title='Increase text size'
          variant='none'
          size='auto'
          onClick={() => {
            if (currentFontSizeIndex > -1) {
              editor
                ?.chain()
                .focus()
                .setFontSize(
                  sizes[Math.min(currentFontSizeIndex + 1, sizes.length - 1)],
                )
                .run()
            }
          }}
        >
          <AArrowUp className='size-5' />
        </Button>
        <Button
          title='Decrease text size'
          variant='none'
          size='auto'
          onClick={() => {
            if (currentFontSizeIndex > -1) {
              editor
                ?.chain()
                .focus()
                .setFontSize(sizes[Math.max(currentFontSizeIndex - 1, 0)])
                .run()
            }
          }}
        >
          <AArrowDown className='size-5' />
        </Button>
        <Button
          title='Decrease list intent'
          className='ml-1'
          variant='none'
          size='auto'
          onClick={() => editor.chain().focus().liftListItem('listItem').run()}
          disabled={!editor.can().liftListItem('listItem')}
        >
          <IndentDecrease className='size-5' />
        </Button>
        <Button
          title='Increase list intent'
          variant='none'
          size='auto'
          onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
          disabled={!editor.can().sinkListItem('listItem')}
        >
          <IndentIncrease className='size-5' />
        </Button>
      </div>

      <ToggleGroup type='multiple' size='xs'>
        <ToggleGroupItem
          title='Toggle bold text'
          value='bold'
          variant='default'
          aria-label='Toggle bold'
          onMouseDownCapture={() => editor?.chain().focus().toggleBold().run()}
          className={cn(
            'bg-transparent p-1',
            editor?.isActive('bold') && 'bg-black bg-opacity-5',
          )}
        >
          <Bold className='size-3' />
        </ToggleGroupItem>
        <ToggleGroupItem
          title='Toggle italic text'
          value='italic'
          aria-label='Toggle italic'
          onMouseDownCapture={() => {
            editor?.chain().focus().toggleItalic().run()
          }}
          className={cn(editor?.isActive('italic') && 'bg-black bg-opacity-5')}
        >
          <Italic className='size-3' />
        </ToggleGroupItem>
        <ToggleGroupItem
          title='Toggle underline text'
          value='underline'
          aria-label='Toggle underline'
          onMouseDownCapture={() => {
            editor?.chain().focus().toggleUnderline().run()
          }}
          className={cn(
            editor?.isActive('underline') && 'bg-black bg-opacity-5',
          )}
        >
          <Underline className='size-3' />
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        size='xs'
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
          title='Align to the left'
          value='left'
          aria-label='Align to the left'
          className={cn(editor?.isActive({ textAlign: 'left' }) && 'bg-black')}
        >
          <IconAlignLeft className='size-3' />
        </ToggleGroupItem>
        <ToggleGroupItem
          value='center'
          title='Align to center'
          aria-label='Align to center'
        >
          <IconAlignCenter className='size-3' />
        </ToggleGroupItem>
        <ToggleGroupItem
          value='right'
          title='Align to the right'
          aria-label='Align to the right'
        >
          <IconAlignRight className='size-3' />
        </ToggleGroupItem>
        <ToggleGroupItem
          value='justify'
          title='Align justified'
          aria-label='Align justified'
        >
          <IconAlignJustified className='size-3' />
        </ToggleGroupItem>
      </ToggleGroup>

      <Popover>
        <PopoverTrigger title='Change color'>
          <span
            className='block size-3 rounded-full'
            style={{
              backgroundColor: attributes.currentColor,
            }}
          ></span>
        </PopoverTrigger>
        <PopoverContent className='max-w-min'>
          {editor && <ColorPicker editor={editor} />}
        </PopoverContent>
      </Popover>

      <HighlightText editor={editor} />
    </div>
  )
}
