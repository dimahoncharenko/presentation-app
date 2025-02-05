import { InputHTMLAttributes, useContext, useEffect, useRef } from 'react'
import { CustomBubbleMenu } from '@/shared/ui/custom-bubble-menu'
import { Editor, EditorContent } from '@tiptap/react'

import { SelectedContext } from '@/shared/context/selected-nodes'
import { cn } from '@/shared/lib/cn-merge'
import classes from './classes.module.css'

type Props = {
  editor: Editor | null
  id: string
  classNames?: Partial<{
    container: string
  }>
  inputProps?: Partial<InputHTMLAttributes<HTMLInputElement>>
}

export const RichEdit = ({ editor, id, classNames, inputProps }: Props) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const { setSelectDisabled } = useContext(SelectedContext)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.addEventListener('mouseenter', () => {
        setSelectDisabled(true)
      })

      editorRef.current.addEventListener('mouseleave', () => {
        setSelectDisabled(false)
      })
    }
  }, [editorRef])

  useEffect(() => {
    if (editor) {
      editor.commands.updateAttributes('paragraph', { id })
    }
  }, [id, editor])

  return (
    <EditorContent
      {...inputProps}
      ref={editorRef}
      id={id}
      className={cn(classes.editor, classNames?.container)}
      editor={editor}
    />
  )
}
