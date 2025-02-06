import { useEffect, useState } from 'react'
import { Editor } from '@tiptap/react'
import { HexColorPicker } from 'react-colorful'

type Props = {
  editor: Editor
}

export const ColorPicker = ({ editor }: Props) => {
  const [color, setColor] = useState('')

  useEffect(() => {
    editor.chain().setColor(color).run()
  }, [editor, color])

  const handleChange = (newColor: string) => {
    setColor(newColor)
  }

  return (
    <HexColorPicker
      className='absolute top-0'
      color={color}
      onChange={color => handleChange(color)}
    />
  )
}
