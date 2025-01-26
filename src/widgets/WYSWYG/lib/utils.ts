import { Editor } from '@tiptap/react'

export const getSelectedText = (editor: Editor) => {
  const { state } = editor
  const { from, to } = state.selection
  const text = state.doc.textBetween(from, to, '\n')

  return text
}

export const isListActive = (
  editor: Editor | null,
  listType: 'orderedList' | 'bulletList',
) => {
  return !!editor?.isActive(listType)
}

export const removeList = (
  editor: Editor,
  listType: 'orderedList' | 'bulletList',
) => {
  switch (listType) {
    case 'orderedList':
      editor.chain().focus().toggleOrderedList().run()
      break
    case 'bulletList':
      editor.chain().focus().toggleBulletList().run()
      break
    default:
      break
  }
}

export const editorIsAvailable = (editor: Editor | null): editor is Editor => {
  return !!editor
}
