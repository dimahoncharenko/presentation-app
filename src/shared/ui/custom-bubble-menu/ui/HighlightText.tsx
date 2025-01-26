import { useEffect, useState } from 'react'
import { Editor } from '@tiptap/react'
import { Highlighter } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../bricks/common/popover'

type Props = {
  editor: Editor
}

export const HighlightText = ({ editor }: Props) => {
  const [color, setColor] = useState('')
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (!color) return
    editor.chain().toggleHighlight({ color }).run()
  }, [editor, color])

  const handleChange = (newColor: string) => {
    setColor(newColor)
  }

  return (
    <Popover open={opened} onOpenChange={setOpened}>
      <PopoverTrigger title='Highlight text'>
        <Highlighter className='m-1 size-3' />
      </PopoverTrigger>
      <PopoverContent className='max-w-min'>
        <HexColorPicker
          className='absolute top-0'
          color={color}
          onChange={color => handleChange(color)}
        />
      </PopoverContent>
    </Popover>
  )
}
