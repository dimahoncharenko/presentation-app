import { useEffect, useState } from 'react'
import { BubbleMenu, Editor } from '@tiptap/react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/bricks/common/select'
import { cn } from '@/shared/lib/cn-merge'

type Props = {
  editor: Editor
  grabbed: boolean
}

export const CustomBubbleMenu = ({ editor, grabbed }: Props) => {
  const [currentFontSize, setCurrentFontSize] = useState('40')

  useEffect(() => {
    if (!editor) return

    const updateFontSize = () => {
      const fontSize = editor.getAttributes('textStyle').fontSize || '40px' // Default to '14' if undefined
      setCurrentFontSize(fontSize.toString().slice(0, -2))
    }

    // Update font size whenever the selection changes
    editor.on('selectionUpdate', updateFontSize)
    editor.on('transaction', updateFontSize)

    // Cleanup listeners on unmount
    return () => {
      editor.off('selectionUpdate', updateFontSize)
      editor.off('transaction', updateFontSize)
    }
  }, [editor])

  return (
    <BubbleMenu editor={editor} className={cn(!grabbed && 'hidden')}>
      <div className='rounded-sm border bg-white p-[1px]'>
        <Select
          value={currentFontSize}
          onValueChange={value => {
            editor?.chain().focus().setFontSize(value).run()
          }}
        >
          <SelectTrigger className='h-[20px] max-w-max rounded-sm p-0 px-[1px]'>
            <SelectValue placeholder={currentFontSize} />
          </SelectTrigger>
          <SelectContent>
            {[
              8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44,
              48, 54, 60, 66, 72, 80, 88, 96,
            ].map(number => (
              <SelectItem key={number} value={number.toString()}>
                {number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </BubbleMenu>
  )
}
