import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'

type OutputSlotParams = {
  content: string
  setEditable: Dispatch<SetStateAction<boolean>>
}

type InputSlotParams = {
  setContent: Dispatch<SetStateAction<string>>
  content: string
  setEditable: Dispatch<SetStateAction<boolean>>
}

type EditableElementProps = {
  inputSlot(params: InputSlotParams): ReactNode
  outputSlot(params: OutputSlotParams): ReactNode
  initialValue: string
}

export const EditableElement = ({
  initialValue,
  inputSlot,
  outputSlot,
}: EditableElementProps) => {
  const [editable, setEditable] = useState(true)
  const [content, setContent] = useState(initialValue)

  useEffect(() => {
    const handleDblClick = (e: MouseEvent) => {
      const node = e.target as HTMLElement

      if (node.dataset['backgroundVideoMuted']) {
        setEditable(false)
      }
    }

    window.addEventListener('dblclick', handleDblClick)

    return () => {
      window.removeEventListener('dblclick', handleDblClick)
    }
  }, [])

  if (editable) {
    return inputSlot({ setEditable, setContent, content })
  }

  return <>{outputSlot({ content, setEditable })}</>
}
