import { Editor } from '@tiptap/react'

export const getSelectedText = (editor: Editor) => {
  const { state } = editor
  const { from, to } = state.selection
  const text = state.doc.textBetween(from, to, '\n')

  return text
}
