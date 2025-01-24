import { useEffect, useState } from 'react'
import { Editor } from '@tiptap/react'

type Props = Editor | null

export type CurrentAttributes = {
  currentFontSize: string
  currentFontFamily: string
  currentColor: string
}

export const useCurrentAttributes = (editor: Props): CurrentAttributes => {
  const [attributes, setAttributes] = useState<CurrentAttributes>({
    currentFontSize: '40',
    currentFontFamily: 'Lato',
    currentColor: 'black',
  })

  useEffect(() => {
    if (!editor) return

    const updateFontSize = () => {
      const fontSize = editor.getAttributes('textStyle').fontSize || '40px' // Default to '14' if undefined
      const fontFamily = editor.getAttributes('textStyle').fontFamily || 'Lato'
      const color = editor.getAttributes('textStyle').color || 'black'

      setAttributes({
        currentFontSize: fontSize.toString().slice(0, -2),
        currentFontFamily: fontFamily,
        currentColor: color,
      })
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

  return attributes
}
