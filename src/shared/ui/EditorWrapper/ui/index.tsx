import BulletList from '@tiptap/extension-bullet-list'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import UnderlineExtension from '@tiptap/extension-underline'
import { Editor, useEditor, UseEditorOptions } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { FontSize } from '@/widgets/WYSWYG/lib/FontSizeExtension'

const CustomBulletList = BulletList.extend({
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) {
            return {}
          }
          return { style: attributes.style }
        },
      },
    }
  },
})

const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) {
            return {}
          }
          return { style: attributes.style }
        },
      },
    }
  },
})

const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id') || null,
        renderHTML: attributes => {
          if (!attributes.id) {
            return {}
          }
          return { id: attributes.id }
        },
      },
    }
  },
})

export const CustomTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id') || null,
        renderHTML: attributes => {
          if (!attributes.id) {
            return {}
          }
          return { id: attributes.id }
        },
      },
      class: {
        default: '',
        parseHTML: element => element.getAttribute('class') || '',
        renderHTML: attributes => {
          if (!attributes.class) {
            return {}
          }
          return { class: attributes.class }
        },
      },
    }
  },
})

const extensions = [
  StarterKit.configure({
    bulletList: false,
    paragraph: false,
    orderedList: false,
  }),
  Color,
  FontFamily,
  UnderlineExtension,
  CustomBulletList,
  CustomOrderedList,
  FontSize,
  Highlight.configure({
    multicolor: true,
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  CustomTextStyle.configure({ mergeNestedSpanStyles: true }),
  CustomParagraph,
]

export type EditorWrapperProps = {
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
}: EditorWrapperProps) => {
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
