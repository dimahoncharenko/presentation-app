import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import Paragraph from '@tiptap/extension-paragraph'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import UnderlineExtension from '@tiptap/extension-underline'
import { Editor, useEditor, UseEditorOptions } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { FontSize } from '@/widgets/WYSWYG/lib/FontSizeExtension'

const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      id: {
        default: null,
        renderHTML: attributes => {
          return {
            id: `${attributes.id}`,
          }
        },
      },
    }
  },
})

const extensions = [
  StarterKit,
  Color,
  FontFamily,
  UnderlineExtension,
  FontSize,
  Highlight.configure({
    multicolor: true,
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TextStyle.configure({ mergeNestedSpanStyles: true }),
  CustomParagraph,
]

type Props = {
  content: string
  onChange: (html: string) => void
  editorProps?: Partial<UseEditorOptions>
  children: (param: Editor | null) => React.ReactNode
}

export const EditorWrapper = ({
  editorProps,
  onChange,
  content,
  children,
}: Props) => {
  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    editable: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    ...editorProps,
  })

  return <>{children(editor)}</>
}
